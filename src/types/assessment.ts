export type AssessmentDimensionKey =
  | "health"
  | "wealth"
  | "work"
  | "social"
  | "entertainment"
  | "growth";

export type AssessmentScores = Record<AssessmentDimensionKey, number>;

export type AssessmentResult = AssessmentScores & {
  totalScore: number;
  averageScore: number;
  completedAt: string;
};

export type AssessmentHistory = AssessmentResult[];
