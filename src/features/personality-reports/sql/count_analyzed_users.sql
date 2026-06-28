-- 首頁「已分析 N 人」：回傳不重複 user_id 數量。
-- 在 Supabase Dashboard → SQL Editor 執行（需已建立 personality_reports 表）。

create or replace function public.count_analyzed_users()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(distinct user_id)::bigint
  from public.personality_reports;
$$;

revoke all on function public.count_analyzed_users() from public;
grant execute on function public.count_analyzed_users() to anon, authenticated;
