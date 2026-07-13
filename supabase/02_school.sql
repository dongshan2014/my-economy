-- ============================================================
-- 02_school.sql — run this in Supabase SQL Editor (like 01)
-- ------------------------------------------------------------
-- LESSON: real projects never edit old schema files — they add
-- new numbered ones. Each file is a "migration": a step in the
-- database's history. Databases evolve one migration at a time.
-- ============================================================

-- ---------- Classes taken in school ----------
create table if not exists classes (
  id         bigint generated always as identity primary key,
  code       text not null,              -- e.g. EC1101
  name       text not null,
  semester   text not null,              -- e.g. Y1S2
  credits    int  not null default 0,
  grade      text not null default 'In progress',
  created_at timestamptz not null default now()
);

-- ---------- School activities ----------
create table if not exists activities (
  id            bigint generated always as identity primary key,
  title         text not null,
  kind          text not null default 'Other',   -- Club / Sports / Volunteering...
  activity_date date not null,
  hours         numeric(5, 1) not null default 0,
  notes         text not null default '',
  created_at    timestamptz not null default now()
);

-- Same open policies as the transactions table (learning project).
-- The auth lesson later will tighten all of these at once.
alter table classes enable row level security;
create policy "public read"   on classes for select using (true);
create policy "public insert" on classes for insert with check (true);
create policy "public delete" on classes for delete using (true);

alter table activities enable row level security;
create policy "public read"   on activities for select using (true);
create policy "public insert" on activities for insert with check (true);
create policy "public delete" on activities for delete using (true);
