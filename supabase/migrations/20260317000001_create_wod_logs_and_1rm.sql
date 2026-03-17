-- ============================================================
-- Migration: wod_logs + one_rm_records
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. wod_logs
-- ────────────────────────────────────────────────────────────
create table if not exists public.wod_logs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  wod_id      text,
  wod_name    text        not null,
  wod_type    text        check (
                wod_type in (
                  'For Time', 'AMRAP', 'EMOM',
                  'Tabata', 'Strength', 'Custom'
                )
              ),
  date        date        not null default current_date,
  time        text,                          -- e.g. '04:52'
  rounds      text,
  weight      text,
  difficulty  int         check (difficulty between 1 and 5),
  notes       text,
  created_at  timestamptz not null default now()
);

-- Index: fast lookup by user + date (most common query pattern)
create index if not exists wod_logs_user_date_idx
  on public.wod_logs (user_id, date desc);

-- ────────────────────────────────────────────────────────────
-- 2. one_rm_records
-- ────────────────────────────────────────────────────────────
create table if not exists public.one_rm_records (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  lift_type   text        not null check (
                lift_type in (
                  'deadlift', 'back_squat', 'bench_press',
                  'front_squat', 'overhead_press', 'clean', 'snatch'
                )
              ),
  weight      numeric     not null check (weight > 0),
  unit        text        not null default 'kg' check (unit in ('kg', 'lbs')),
  date        date        not null default current_date,
  created_at  timestamptz not null default now()
);

-- Index: fast lookup by user + lift + date (for progress charts)
create index if not exists one_rm_user_lift_date_idx
  on public.one_rm_records (user_id, lift_type, date desc);

-- ────────────────────────────────────────────────────────────
-- 3. Enable Row Level Security
-- ────────────────────────────────────────────────────────────
alter table public.wod_logs      enable row level security;
alter table public.one_rm_records enable row level security;

-- ────────────────────────────────────────────────────────────
-- 4. RLS Policies — wod_logs
-- ────────────────────────────────────────────────────────────
-- SELECT: own rows only
create policy "wod_logs: select own"
  on public.wod_logs
  for select
  using (user_id = auth.uid());

-- INSERT: can only insert rows with own user_id
create policy "wod_logs: insert own"
  on public.wod_logs
  for insert
  with check (user_id = auth.uid());

-- UPDATE: own rows only
create policy "wod_logs: update own"
  on public.wod_logs
  for update
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- DELETE: own rows only
create policy "wod_logs: delete own"
  on public.wod_logs
  for delete
  using (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 5. RLS Policies — one_rm_records
-- ────────────────────────────────────────────────────────────
create policy "one_rm: select own"
  on public.one_rm_records
  for select
  using (user_id = auth.uid());

create policy "one_rm: insert own"
  on public.one_rm_records
  for insert
  with check (user_id = auth.uid());

create policy "one_rm: update own"
  on public.one_rm_records
  for update
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "one_rm: delete own"
  on public.one_rm_records
  for delete
  using (user_id = auth.uid());
