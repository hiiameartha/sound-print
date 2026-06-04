import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  PersonalityReportInsert,
  PersonalityReportRow,
} from "@/features/personality-reports/types";

const TABLE = "personality_reports" as const;

export class PersonalityReportsRepository {
  async insert(record: PersonalityReportInsert): Promise<PersonalityReportRow> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .insert(record)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "新增 personality_reports 失敗");
    }
    return data as PersonalityReportRow;
  }

  async listByUserId(
    userId: string,
    limit = 50,
  ): Promise<PersonalityReportRow[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as PersonalityReportRow[];
  }

  async getById(id: string): Promise<PersonalityReportRow | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return (data as PersonalityReportRow | null) ?? null;
  }

  async updateCommentary(
    id: string,
    fields: {
      humorous_commentary: string;
      toxic_commentary: string;
      yearly_title: string;
    },
  ): Promise<PersonalityReportRow> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from(TABLE)
      .update(fields)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "更新 personality_reports 評論失敗");
    }
    return data as PersonalityReportRow;
  }
}
