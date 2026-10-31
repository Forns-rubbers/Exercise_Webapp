-- Run once in Supabase Dashboard > SQL Editor before using the app.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  selected_character text,
  exercise_frequency integer check (exercise_frequency between 0 and 7),
  exercise_experience_days integer check (exercise_experience_days between 0 and 30),
  exercise_location text check (exercise_location in ('fitness', 'home_no_equipment', 'home_with_equipment')),
  fitness_goal text check (fitness_goal in ('weight_loss', 'health', 'muscle', 'performance', 'consistency')),
  weekly_goal_days integer check (weekly_goal_days between 1 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mission_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  unlocked_level integer not null default 1 check (unlocked_level between 1 and 8),
  completed_level integer not null default 0 check (completed_level between 0 and 8),
  updated_at timestamptz not null default now(),
  constraint completed_not_ahead check (completed_level < unlocked_level or (completed_level = 8 and unlocked_level = 8))
);

-- Accounts created before this script is run also receive their own records.
insert into public.profiles (id, username)
select id, raw_user_meta_data ->> 'username' from auth.users
on conflict (id) do nothing;

insert into public.mission_progress (user_id)
select id from auth.users
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.mission_progress enable row level security;

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users read own mission progress" on public.mission_progress for select using (auth.uid() = user_id);

create or replace function public.create_user_records()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username) values (new.id, new.raw_user_meta_data ->> 'username');
  insert into public.mission_progress (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_user_records();

create or replace function public.complete_mission_level(p_level integer)
returns void language plpgsql security definer set search_path = public as $$
declare current_unlocked integer;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select unlocked_level into current_unlocked from public.mission_progress where user_id = auth.uid() for update;
  if current_unlocked is null then raise exception 'Progress not found'; end if;
  if p_level <> current_unlocked then raise exception 'Complete the current unlocked level first'; end if;
  update public.mission_progress
    set completed_level = p_level,
        unlocked_level = least(p_level + 1, 8),
        updated_at = now()
    where user_id = auth.uid();
end;
$$;

grant execute on function public.complete_mission_level(integer) to authenticated;
