-- Run this once after supabase-schema.sql in Supabase Dashboard > SQL Editor.
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
create policy "users read own submissions" on public.mission_submissions for select using (auth.uid() = user_id);
create policy "users create own submissions" on public.mission_submissions for insert with check (auth.uid() = user_id);
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mission-evidence', 'mission-evidence', false, 52428800, array['image/jpeg','image/png','image/webp','video/mp4','video/webm']) on conflict (id) do nothing;
create policy "users upload own evidence" on storage.objects for insert to authenticated with check (bucket_id = 'mission-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users read own evidence" on storage.objects for select to authenticated using (bucket_id = 'mission-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
