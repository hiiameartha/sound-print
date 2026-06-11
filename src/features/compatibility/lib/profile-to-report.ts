import type { PersonalityReport } from "@/features/personality-reports/types";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";

/** 將本機 profile 包成可比較的報告（尚未寫入 DB 時使用） */
export function profileToComparableReport(
  profile: PersonalityProfile,
  id = "local-profile",
): PersonalityReport {
  return {
    id,
    userId: "local",
    profile,
    commentary: null,
    createdAt: profile.analyzedAt,
  };
}
