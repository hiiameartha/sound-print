-- 開發用 RLS：目前 app 使用 localStorage user_id + anon key，尚未接 Supabase Auth。
-- 若 life_records 已啟用 RLS 但沒有 policy，INSERT 會失敗：
--   code 42501, message: new row violates row-level security policy
--
-- 在 Supabase Dashboard → SQL Editor 執行此檔。

alter table public.life_records enable row level security;

drop policy if exists "life_records_dev_select" on public.life_records;
drop policy if exists "life_records_dev_insert" on public.life_records;

-- 允許瀏覽器 anon key 讀取（依 user_id 過濾在 app 層完成）
create policy "life_records_dev_select"
  on public.life_records
  for select
  to anon, authenticated
  using (true);

-- 允許瀏覽器 anon key 新增紀錄
create policy "life_records_dev_insert"
  on public.life_records
  for insert
  to anon, authenticated
  with check (true);

-- 若只想快速本機測試、不打算用 RLS，可改執行下面這行（二選一）：
-- alter table public.life_records disable row level security;
