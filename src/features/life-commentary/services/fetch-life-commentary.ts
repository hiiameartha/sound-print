import type { LifeCommentaryInput } from "@/types/life-commentary";
import type { LifeCommentary } from "@/types/life-commentary";

export async function fetchLifeCommentary(
  scores: LifeCommentaryInput,
): Promise<LifeCommentary> {
  const response = await fetch("/api/life-commentary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scores),
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const error =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "無法取得 AI 人生評論";
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

  return (payload as { data: LifeCommentary }).data;
}
