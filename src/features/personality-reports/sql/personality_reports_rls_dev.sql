-- 開發用 RLS：localStorage user_id + anon key，尚未接 Supabase Auth。
-- 在 Supabase Dashboard → SQL Editor 執行 personality_reports.sql 後再執行此檔。

alter table public.personality_reports enable row level security;

drop policy if exists "personality_reports_dev_select" on public.personality_reports;
drop policy if exists "personality_reports_dev_insert" on public.personality_reports;
drop policy if exists "personality_reports_dev_update" on public.personality_reports;

create policy "personality_reports_dev_select"
  on public.personality_reports
  for select
  to anon, authenticated
  using (true);

create policy "personality_reports_dev_insert"
  on public.personality_reports
  for insert
  to anon, authenticated
  with check (true);

create policy "personality_reports_dev_update"
  on public.personality_reports
  for update
  to anon, authenticated
  using (true)
  with check (true);
