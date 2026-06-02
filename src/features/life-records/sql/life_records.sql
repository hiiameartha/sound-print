-- Life.EXE - 歷史紀錄表
-- 需求欄位：
-- id, user_id, health, wealth, career, social, fun, growth, score, created_at

-- 建議：啟用 gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.life_records (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  health smallint not null check (health between 0 and 10),
  wealth smallint not null check (wealth between 0 and 10),
  career smallint not null check (career between 0 and 10),
  social smallint not null check (social between 0 and 10),
  fun smallint not null check (fun between 0 and 10),
  growth smallint not null check (growth between 0 and 10),
  score smallint not null check (score between 0 and 60),
  created_at timestamptz not null default now()
);

create index if not exists life_records_user_id_created_at_idx
  on public.life_records (user_id, created_at desc);

-- 若未來接 Supabase Auth，可改成 uuid 並與 auth.users 對齊。
-- 先提供最小可用的 RLS 建議（匿名情境通常會關閉 RLS 或用 service role 寫入）。
-- alter table public.life_records enable row level security;
-- create policy "read_own_records" on public.life_records
--   for select using (user_id = auth.uid()::text);
-- create policy "insert_own_records" on public.life_records
--   for insert with check (user_id = auth.uid()::text);

