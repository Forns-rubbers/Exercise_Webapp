-- Run this after supabase-schema.sql in Supabase Dashboard > SQL Editor.
-- Then create/sign up the dedicated administrator account and run:
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'ADMIN_EMAIL');
alter table public.mission_progress drop constraint if exists mission_progress_unlocked_level_check;
alter table public.mission_progress drop constraint if exists mission_progress_completed_level_check;
alter table public.mission_progress drop constraint if exists completed_not_ahead;
alter table public.mission_progress add constraint mission_progress_unlocked_level_check check (unlocked_level between 1 and 30);
alter table public.mission_progress add constraint mission_progress_completed_level_check check (completed_level between 0 and 30);
alter table public.mission_progress add constraint completed_not_ahead check (completed_level < unlocked_level or (completed_level = 30 and unlocked_level = 30));
create or replace function public.complete_mission_level(p_level integer)
returns void language plpgsql security definer set search_path = public as $$
declare current_unlocked integer;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select unlocked_level into current_unlocked from public.mission_progress where user_id = auth.uid() for update;
  if p_level <> current_unlocked then raise exception 'Complete the current unlocked level first'; end if;
  update public.mission_progress set completed_level = p_level, unlocked_level = least(p_level + 1, 30), updated_at = now() where user_id = auth.uid();
end; $$;
create table if not exists public.mission_submissions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  level integer not null check (level between 1 and 30), evidence_path text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')), created_at timestamptz not null default now()
);
alter table public.mission_submissions enable row level security;
drop policy if exists "users read own submissions" on public.mission_submissions;
create policy "users read own submissions" on public.mission_submissions for select using (auth.uid() = user_id);
drop policy if exists "users create own submissions" on public.mission_submissions;
create policy "users create own submissions" on public.mission_submissions for insert with check (auth.uid() = user_id);
-- Admin authorization is database-backed; never trust a client-side flag.
alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user','admin'));
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only an administrator can change account roles';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_role_before_update on public.profiles;
create trigger protect_profile_role_before_update before update on public.profiles for each row execute function public.protect_profile_role();
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "users create own submissions" on public.mission_submissions;
create policy "users create own submissions" on public.mission_submissions for insert with check (auth.uid() = user_id and status = 'pending');
drop policy if exists "admins read all mission progress" on public.mission_progress;
create policy "admins read all mission progress" on public.mission_progress for select using (public.is_admin());
drop policy if exists "admins read all submissions" on public.mission_submissions;
create policy "admins read all submissions" on public.mission_submissions for select using (public.is_admin());
drop policy if exists "admins read mission evidence" on storage.objects;
create policy "admins read mission evidence" on storage.objects for select to authenticated using (bucket_id = 'mission-evidence' and public.is_admin());
revoke execute on function public.complete_mission_level(integer) from public, authenticated;

create or replace function public.review_mission_submission(p_submission_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
declare s public.mission_submissions%rowtype; p public.mission_progress%rowtype;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if p_status not in ('approved','rejected') then raise exception 'Invalid review status'; end if;
  select * into s from public.mission_submissions where id = p_submission_id for update;
  if not found then raise exception 'Submission not found'; end if;
  update public.mission_submissions set status = p_status where id = p_submission_id;
  if p_status = 'approved' then
    select * into p from public.mission_progress where user_id = s.user_id for update;
    if p.completed_level < s.level and s.level = p.unlocked_level then
      update public.mission_progress set completed_level = s.level, unlocked_level = least(s.level + 1, 30), updated_at = now() where user_id = s.user_id;
    end if;
  end if;
end;
$$;
grant execute on function public.review_mission_submission(uuid,text) to authenticated;

create table if not exists public.user_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  visited_at timestamptz not null default now()
);
alter table public.user_activity enable row level security;
drop policy if exists "admins read activity" on public.user_activity;
create policy "admins read activity" on public.user_activity for select using (public.is_admin());
create or replace function public.record_user_visit()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  insert into public.user_activity(user_id) values (auth.uid());
end;
$$;
grant execute on function public.record_user_visit() to authenticated;
create or replace function public.admin_dashboard_stats()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  return json_build_object(
    'users', (select count(*) from public.profiles),
    'visits', (select count(*) from public.user_activity),
    'returning_users', (select count(*) from (select user_id from public.user_activity group by user_id having count(*) > 1) r)
  );
end;
$$;
grant execute on function public.admin_dashboard_stats() to authenticated;
create or replace function public.get_leaderboard()
returns table(username text, completed_level integer, visits bigint)
language sql stable security definer set search_path = public as $$
  select coalesce(pr.username,'User'), mp.completed_level,
    (select count(*) from public.user_activity ua where ua.user_id = pr.id) as visits
  from public.profiles pr join public.mission_progress mp on mp.user_id = pr.id
  where pr.role = 'user'
  order by mp.completed_level desc, visits desc, pr.username asc limit 10;
$$;
grant execute on function public.get_leaderboard() to authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mission-evidence', 'mission-evidence', false, 52428800, array['image/jpeg','image/png','image/webp','video/mp4','video/webm']) on conflict (id) do nothing;
drop policy if exists "users upload own evidence" on storage.objects;
create policy "users upload own evidence" on storage.objects for insert to authenticated with check (bucket_id = 'mission-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "users read own evidence" on storage.objects;
create policy "users read own evidence" on storage.objects for select to authenticated using (bucket_id = 'mission-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
