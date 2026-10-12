-- ============================================================
-- Migration: board_posts (community free board — public, shared)
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists public.board_posts (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  author      text        not null,
  title       text        not null,
  content     text        not null,
  tags        text[]      not null default '{}',
  created_at  timestamptz not null default now()
);

-- Index: board feed is always sorted newest-first
create index if not exists board_posts_created_at_idx
  on public.board_posts (created_at desc);

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table public.board_posts enable row level security;

-- SELECT: public board — anyone (including signed-out visitors) can read
create policy "board_posts: select all"
  on public.board_posts
  for select
  using (true);

-- INSERT: must be signed in, and can only post as yourself
create policy "board_posts: insert own"
  on public.board_posts
  for insert
  with check (user_id = auth.uid());

-- DELETE: authors can remove their own posts
create policy "board_posts: delete own"
  on public.board_posts
  for delete
  using (user_id = auth.uid());
