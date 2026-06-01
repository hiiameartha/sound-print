import type { AssessmentScores } from "@/types/assessment";

/** API 請求：六大維度分數（1–10） */
export type LifeCommentaryInput = AssessmentScores;

/** OpenAI 結構化輸出 */
export type LifeCommentary = {
  humorousAnalysis: string;
  encouragement: string;
  title: string;
};

export type LifeCommentaryApiResponse = {
  data: LifeCommentary;
};

export type LifeCommentaryApiError = {
  error: string;
};
