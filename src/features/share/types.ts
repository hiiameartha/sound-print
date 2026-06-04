export type LifeTier = {
  code: string;
  label: string;
  accent: string;
};

export type ShareCardCommentary = {
  humorousAnalysis: string;
  encouragement: string;
};

export type ShareCardData = {
  totalScore: number;
  bestLabel: string;
  bestScore: number;
  weakestLabel: string;
  weakestScore: number;
  title: string;
  completedAt: string;
  percent: number;
  tier: LifeTier;
  hookLine: string;
  gap: number;
  hasAiCommentary: boolean;
  commentary: ShareCardCommentary;
};
