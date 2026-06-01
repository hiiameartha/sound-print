import type { AssessmentFormValues } from "@/features/assessment/schemas/assessment-schema";
import type { AssessmentResult, AssessmentScores } from "@/types/assessment";

export function calculateTotalScore(scores: AssessmentScores): number {
  return Object.values(scores).reduce((sum, value) => sum + value, 0);
}

export function calculateAverageScore(scores: AssessmentScores): number {
  const total = calculateTotalScore(scores);
  return Math.round((total / Object.keys(scores).length) * 10) / 10;
}

export function buildAssessmentResult(
  scores: AssessmentFormValues,
): AssessmentResult {
  return {
    ...scores,
    totalScore: calculateTotalScore(scores),
    averageScore: calculateAverageScore(scores),
    completedAt: new Date().toISOString(),
  };
}

export function scoreToPercent(score: number): number {
  return Math.round((score / 10) * 100);
}
