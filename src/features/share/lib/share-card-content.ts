import type { ShareCardCommentary, ShareCardData } from "@/features/share/types";
import type { AssessmentResult } from "@/types/assessment";
import type { LifeCommentary } from "@/types/life-commentary";

const CARD_TEXT_MAX = 120;

const PENDING_COMMENTARY: ShareCardCommentary = {
  humorousAnalysis: "AI 正在解讀你的人生數據，完成後重新下載即可附上完整評論。",
  encouragement: "完成上方「AI 人生評論」後，這裡會出現專屬鼓勵建議。",
};

export type LifeTier = {
  code: string;
  label: string;
  accent: string;
};

const TIERS: { min: number; tier: LifeTier }[] = [
  { min: 54, tier: { code: "SSR", label: "傳說級人生", accent: "#fbbf24" } },
  { min: 45, tier: { code: "SR", label: "開掛運行中", accent: "#22d3ee" } },
  { min: 36, tier: { code: "R", label: "穩定版玩家", accent: "#a78bfa" } },
  { min: 24, tier: { code: "N", label: "潛力股覺醒", accent: "#34d399" } },
  { min: 0, tier: { code: "???", label: "待重啟人生", accent: "#f472b6" } },
];

const WEAKEST_HOOKS: Record<string, string> = {
  健康: "身體是人生的底層 API，記得更新。",
  財富: "錢包在排隊，下一版更新見。",
  工作: "職涯劇情還在載入中，敬請期待。",
  社交: "人際連線訊號偏弱，多 ping 幾次。",
  娛樂: "快樂緩存不足，該排休閒更新了。",
  成長: "技能樹還有大片迷霧，去探索吧。",
};

export function getLifeTier(totalScore: number): LifeTier {
  return TIERS.find((t) => totalScore >= t.min)!.tier;
}

export function getScorePercent(totalScore: number): number {
  return Math.round((totalScore / 60) * 100);
}

export function getScoreGap(bestScore: number, weakestScore: number): number {
  return bestScore - weakestScore;
}

export function getHookLine(data: Pick<
  ShareCardData,
  "totalScore" | "weakestLabel" | "bestLabel" | "bestScore" | "weakestScore"
>): string {
  const gap = getScoreGap(data.bestScore, data.weakestScore);

  if (data.totalScore >= 54) {
    return "這份人生報告，值得直接發限動。";
  }
  if (gap >= 5) {
    return `${data.bestLabel}很頂，${data.weakestLabel}在喊需要 patch。`;
  }
  if (data.totalScore >= 45) {
    return "整體運行順暢，你比想像中更穩。";
  }
  if (data.totalScore >= 36) {
    return "人生主線穩定，支線還能再刷。";
  }

  return WEAKEST_HOOKS[data.weakestLabel] ?? "每一版人生，都值得被記錄。";
}

export function truncateForCard(text: string, max = CARD_TEXT_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function resolveShareCommentary(
  ai: LifeCommentary | null | undefined,
): Pick<ShareCardData, "hasAiCommentary" | "commentary"> {
  if (!ai) {
    return {
      hasAiCommentary: false,
      commentary: PENDING_COMMENTARY,
    };
  }

  return {
    hasAiCommentary: true,
    commentary: {
      humorousAnalysis: truncateForCard(ai.humorousAnalysis),
      encouragement: truncateForCard(ai.encouragement),
    },
  };
}

export function enrichShareCardData(
  base: Omit<ShareCardData, "percent" | "tier" | "hookLine" | "gap">,
): ShareCardData {
  const tier = getLifeTier(base.totalScore);
  const percent = getScorePercent(base.totalScore);
  const gap = getScoreGap(base.bestScore, base.weakestScore);
  const hookLine = getHookLine(base);

  return {
    ...base,
    percent,
    tier,
    hookLine,
    gap,
  };
}

export function buildShareCardDataFromResult(
  result: AssessmentResult,
  title: string,
  extremes: {
    best: { label: string; score: number };
    weakest: { label: string; score: number };
  },
  aiCommentary?: LifeCommentary | null,
): ShareCardData {
  const commentaryFields = resolveShareCommentary(aiCommentary);

  return enrichShareCardData({
    totalScore: result.totalScore,
    bestLabel: extremes.best.label,
    bestScore: extremes.best.score,
    weakestLabel: extremes.weakest.label,
    weakestScore: extremes.weakest.score,
    title,
    completedAt: result.completedAt,
    ...commentaryFields,
  });
}
