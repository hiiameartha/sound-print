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

-- RLS：Supabase 預設已啟用。未設定 policy 時 anon 無法 INSERT（42501）。
-- 開發（localStorage user_id、尚未 Auth）請執行：life_records_rls_dev.sql
-- 正式環境接 Auth 後請改用 auth.uid() 限制讀寫，勿長期使用 dev policy。

