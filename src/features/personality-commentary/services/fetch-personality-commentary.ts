import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export async function fetchPersonalityCommentary(
  profile: PersonalityProfile,
): Promise<PersonalityCommentary> {
  const response = await fetch("/api/personality/commentary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const error =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "無法取得 AI 人格評論";
    throw new Error(error);
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload) ||
    typeof (payload as { data: unknown }).data !== "object"
  ) {
    throw new Error("回應格式錯誤");
  }

  return (payload as { data: PersonalityCommentary }).data;
}
