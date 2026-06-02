import type { AssessmentDimensionKey, AssessmentResult } from "@/types/assessment";

export type AchievementId =
  | "sleep-god"
  | "workaholic"
  | "finance-master"
  | "travel-king"
  | "social-expert"
  | "discipline-demon";

export type AchievementDefinition = {
  id: AchievementId;
  name: string;
  description: string;
  badgeAccentClassName: string;
};

export type KpiSnapshot = {
  completedAt: string;
  scoresPercent: Record<AssessmentDimensionKey, number>;
  averagePercent: number;
};

export type AchievementProgress = {
  id: AchievementId;
  definition: AchievementDefinition;
  progress: number; // 0~1
  unlocked: boolean;
  unlockedAt?: string;
  currentLabel: string;
};

export type AchievementStrategy = {
  definition: AchievementDefinition;
  evaluate: (snapshot: KpiSnapshot) => Omit<AchievementProgress, "definition">;
};

export function clamp01(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function toPercent(score: number): number {
  return Math.round((score / 10) * 100);
}

export function buildKpiSnapshot(result: AssessmentResult): KpiSnapshot {
  const scoresPercent: Record<AssessmentDimensionKey, number> = {
    health: toPercent(result.health),
    wealth: toPercent(result.wealth),
    work: toPercent(result.work),
    social: toPercent(result.social),
    entertainment: toPercent(result.entertainment),
    growth: toPercent(result.growth),
  };

  return {
    completedAt: result.completedAt,
    scoresPercent,
    averagePercent: toPercent(result.averageScore),
  };
}

