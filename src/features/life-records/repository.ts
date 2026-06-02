import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LifeRecordInsert, LifeRecordRow } from "@/features/life-records/types";

const TABLE = "life_records" as const;

export class LifeRecordsRepository {
  async insert(record: LifeRecordInsert): Promise<LifeRecordRow> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .insert(record)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "新增 life_records 失敗");
    }
    return data as LifeRecordRow;
  }

  async listByUserId(userId: string, limit = 50): Promise<LifeRecordRow[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as LifeRecordRow[];
  }
}

