import { ASSESSMENT_DIMENSIONS } from "@/features/assessment/constants/dimensions";
import { buildShareCardDataFromResult } from "@/features/share/lib/share-card-content";
import type { ShareCardData } from "@/features/share/types";
import type { AssessmentResult } from "@/types/assessment";
import type { LifeCommentary } from "@/types/life-commentary";

type DimensionEntry = {
  label: string;
  score: number;
};

function getDimensionEntries(result: AssessmentResult): DimensionEntry[] {
  return ASSESSMENT_DIMENSIONS.map((dim) => ({
    label: dim.label,
    score: result[dim.key],
  }));
}

export function getBestAndWeakest(result: AssessmentResult): {
  best: DimensionEntry;
  weakest: DimensionEntry;
} {
  const entries = getDimensionEntries(result);
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  return {
    best: sorted[0]!,
    weakest: sorted[sorted.length - 1]!,
  };
}

export function getFallbackTitle(result: AssessmentResult): string {
  const { best, weakest } = getBestAndWeakest(result);

  if (result.totalScore >= 50) {
    return `${best.label}傳奇`;
  }
  if (result.totalScore >= 35) {
    return `進擊的${best.label}人`;
  }
  if (weakest.score <= 3) {
    return `${weakest.label}修煉中`;
  }
  return "人生平衡玩家";
}

export function buildShareCardData(
  result: AssessmentResult,
  title: string,
  aiCommentary?: LifeCommentary | null,
): ShareCardData {
  const { best, weakest } = getBestAndWeakest(result);
  return buildShareCardDataFromResult(result, title, { best, weakest }, aiCommentary);
}
