-- ============================================================
-- schema.sql — run this ONCE in Supabase (SQL Editor → New query)
-- ------------------------------------------------------------
-- This creates the one table the app needs. Supabase is really
-- PostgreSQL underneath, so everything here is standard SQL.
-- ============================================================

create table if not exists transactions (
  id         bigint generated always as identity primary key,
  title      text not null,
  amount     numeric(12, 2) not null,   -- positive = income, negative = spending
  category   text not null default 'Other',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- Supabase blocks all access by default until you write policies.
-- For a LEARNING project with no login yet, we allow anyone with
-- the anon key (i.e. your app) to read and write.
--
-- LATER LESSON: when you add Supabase Auth (user accounts),
-- replace these with per-user policies like:
--   using (auth.uid() = user_id)
-- ------------------------------------------------------------

alter table transactions enable row level security;

create policy "public read"   on transactions for select using (true);
create policy "public insert" on transactions for insert with check (true);
create policy "public delete" on transactions for delete using (true);
