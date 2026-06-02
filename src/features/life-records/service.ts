import type { AssessmentResult } from "@/types/assessment";
import { LifeRecordsRepository } from "@/features/life-records/repository";
import {
  assessmentToLifeRecordInsert,
  rowToLifeRecord,
  type LifeRecord,
  type LifeTrendDelta,
  type LifeTrendSummary,
} from "@/features/life-records/types";

function makeDelta(label: string, current: number, previous: number | null): LifeTrendDelta {
  return {
    label,
    current,
    previous,
    delta: previous === null ? null : current - previous,
  };
}

export class LifeRecordsService {
  private readonly repo: LifeRecordsRepository;

  constructor(repo = new LifeRecordsRepository()) {
    this.repo = repo;
  }

  async saveFromAssessment(userId: string, result: AssessmentResult): Promise<LifeRecord> {
    const inserted = await this.repo.insert(assessmentToLifeRecordInsert(userId, result));
    return rowToLifeRecord(inserted);
  }

  async list(userId: string, limit = 50): Promise<LifeRecord[]> {
    const rows = await this.repo.listByUserId(userId, limit);
    return rows.map(rowToLifeRecord);
  }

  buildTrendSummary(records: LifeRecord[]): LifeTrendSummary {
    const count = records.length;
    const latest = count > 0 ? records[count - 1] : null;
    const previous = count > 1 ? records[count - 2] : null;

    return {
      count,
      latestCreatedAt: latest?.createdAt,
      scoreSeries: records.map((r) => ({ createdAt: r.createdAt, score: r.score })),
      deltas: {
        score: makeDelta("總分", latest?.score ?? 0, previous?.score ?? null),
        health: makeDelta("健康", latest?.health ?? 0, previous?.health ?? null),
        wealth: makeDelta("財富", latest?.wealth ?? 0, previous?.wealth ?? null),
        career: makeDelta("職涯", latest?.career ?? 0, previous?.career ?? null),
        social: makeDelta("社交", latest?.social ?? 0, previous?.social ?? null),
        fun: makeDelta("娛樂", latest?.fun ?? 0, previous?.fun ?? null),
        growth: makeDelta("成長", latest?.growth ?? 0, previous?.growth ?? null),
      },
    };
  }
}

