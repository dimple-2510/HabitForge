-- =============================================
-- HabitForge Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. HABITS TABLE
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'General',
  color text not null default '#3B82F6',
  icon text default '✓',
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly', 'custom')),
  habit_type text not null default 'positive' check (habit_type in ('positive', 'negative', 'target_count')),
  target_value integer,
  target_unit text,
  days_of_week integer[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. HABIT LOGS TABLE (check-ins)
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_date date not null,
  count_value integer not null default 1,
  note text,
  created_at timestamptz not null default now()
);

-- Unique constraint: one log per habit per day
alter table public.habit_logs
  add constraint habit_logs_habit_date_unique unique (habit_id, completed_date);

-- 3. BADGES TABLE (predefined achievements)
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  requirement_type text not null check (requirement_type in ('streak', 'completions', 'habits_count')),
  requirement_value integer not null,
  created_at timestamptz not null default now()
);

-- 4. USER BADGES TABLE (earned badges)
create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now()
);

-- 5. HABIT GROUPS TABLE (routines)
create table public.habit_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text not null default '#8B5CF6',
  created_at timestamptz not null default now()
);

-- 6. HABIT GROUP ITEMS TABLE (habits in a group)
create table public.habit_group_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.habit_groups(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_habits_user_id on public.habits(user_id);
create index idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index idx_habit_logs_user_id on public.habit_logs(user_id);
create index idx_habit_logs_date on public.habit_logs(completed_date);
create index idx_user_badges_user_id on public.user_badges(user_id);
create index idx_habit_groups_user_id on public.habit_groups(user_id);
create index idx_habit_group_items_group_id on public.habit_group_items(group_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habits
alter table public.habits enable row level security;
create policy "Users can view own habits" on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

-- Habit Logs
alter table public.habit_logs enable row level security;
create policy "Users can view own logs" on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs" on public.habit_logs for update using (auth.uid() = user_id);
create policy "Users can delete own logs" on public.habit_logs for delete using (auth.uid() = user_id);

-- Badges (read-only for all authenticated users)
alter table public.badges enable row level security;
create policy "Anyone can view badges" on public.badges for select using (auth.role() = 'authenticated');

-- User Badges
alter table public.user_badges enable row level security;
create policy "Users can view own earned badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "Users can earn badges" on public.user_badges for insert with check (auth.uid() = user_id);

-- Habit Groups
alter table public.habit_groups enable row level security;
create policy "Users can view own groups" on public.habit_groups for select using (auth.uid() = user_id);
create policy "Users can insert own groups" on public.habit_groups for insert with check (auth.uid() = user_id);
create policy "Users can update own groups" on public.habit_groups for update using (auth.uid() = user_id);
create policy "Users can delete own groups" on public.habit_groups for delete using (auth.uid() = user_id);

-- Habit Group Items
alter table public.habit_group_items enable row level security;
create policy "Users can view own group items" on public.habit_group_items for select using (
  auth.uid() in (select user_id from public.habit_groups where id = group_id)
);
create policy "Users can insert own group items" on public.habit_group_items for insert with check (
  auth.uid() in (select user_id from public.habit_groups where id = group_id)
);
create policy "Users can delete own group items" on public.habit_group_items for delete using (
  auth.uid() in (select user_id from public.habit_groups where id = group_id)
);

-- =============================================
-- SEED DATA: Default Badges
-- =============================================
insert into public.badges (name, description, requirement_type, requirement_value) values
  ('First Step', 'Complete your first habit', 'completions', 1),
  ('Week Warrior', 'Maintain a 7-day streak', 'streak', 7),
  ('Monthly Master', 'Maintain a 30-day streak', 'streak', 30),
  ('Century Club', 'Complete 100 total check-ins', 'completions', 100),
  ('Habit Builder', 'Create 5 active habits', 'habits_count', 5),
  ('Dedicated', 'Maintain a 100-day streak', 'streak', 100);
