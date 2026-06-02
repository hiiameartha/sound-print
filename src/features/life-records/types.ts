import type { AssessmentResult } from "@/types/assessment";

export type LifeRecordRow = {
  id: string;
  user_id: string;
  health: number;
  wealth: number;
  career: number;
  social: number;
  fun: number;
  growth: number;
  score: number;
  created_at: string;
};

export type LifeRecordInsert = {
  user_id: string;
  health: number;
  wealth: number;
  career: number;
  social: number;
  fun: number;
  growth: number;
  score: number;
  created_at?: string;
};

export type LifeRecord = {
  id: string;
  userId: string;
  health: number;
  wealth: number;
  career: number;
  social: number;
  fun: number;
  growth: number;
  score: number;
  createdAt: string;
};

export type LifeTrendPoint = {
  createdAt: string;
  score: number;
};

export type LifeTrendDelta = {
  label: string;
  current: number;
  previous: number | null;
  delta: number | null;
};

export type LifeTrendSummary = {
  count: number;
  latestCreatedAt?: string;
  scoreSeries: LifeTrendPoint[];
  deltas: {
    score: LifeTrendDelta;
    health: LifeTrendDelta;
    wealth: LifeTrendDelta;
    career: LifeTrendDelta;
    social: LifeTrendDelta;
    fun: LifeTrendDelta;
    growth: LifeTrendDelta;
  };
};

export function rowToLifeRecord(row: LifeRecordRow): LifeRecord {
  return {
    id: row.id,
    userId: row.user_id,
    health: row.health,
    wealth: row.wealth,
    career: row.career,
    social: row.social,
    fun: row.fun,
    growth: row.growth,
    score: row.score,
    createdAt: row.created_at,
  };
}

export function assessmentToLifeRecordInsert(
  userId: string,
  result: AssessmentResult,
): LifeRecordInsert {
  return {
    user_id: userId,
    health: result.health,
    wealth: result.wealth,
    career: result.work,
    social: result.social,
    fun: result.entertainment,
    growth: result.growth,
    score: result.totalScore,
    created_at: result.completedAt,
  };
}

export function lifeRecordToAssessmentResult(record: LifeRecord): AssessmentResult {
  const totalScore = record.score;
  const averageScore = Math.round((totalScore / 6) * 10) / 10;

  return {
    health: record.health,
    wealth: record.wealth,
    work: record.career,
    social: record.social,
    entertainment: record.fun,
    growth: record.growth,
    totalScore,
    averageScore,
    completedAt: record.createdAt,
  };
}

