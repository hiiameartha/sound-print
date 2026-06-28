import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const TABLE = "personality_reports" as const;
const PAGE_SIZE = 1000;

async function countDistinctUsersFallback(
  supabase: SupabaseClient,
): Promise<number | null> {
  const users = new Set<string>();
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("user_id")
      .range(from, from + PAGE_SIZE - 1);

    if (error) return null;
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (typeof row.user_id === "string" && row.user_id.length > 0) {
        users.add(row.user_id);
      }
    }

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return users.size;
}

async function fetchAnalyzedUserCount(): Promise<number | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("count_analyzed_users");

  if (!error && typeof data === "number" && Number.isFinite(data)) {
    return Math.max(0, Math.round(data));
  }

  if (error && process.env.NODE_ENV === "development") {
    console.warn(
      "[personality-reports] count_analyzed_users RPC 不可用，改用分頁統計",
      error.message,
    );
  }

  return countDistinctUsersFallback(supabase);
}

export async function getAnalyzedUserCount(): Promise<number | null> {
  const cached = unstable_cache(
    fetchAnalyzedUserCount,
    ["analyzed-user-count"],
    { revalidate: 300 },
  );

  return cached();
}
