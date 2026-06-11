import { PersonalityReportsRepository } from "@/features/personality-reports/repository";
import {
  profileToInsert,
  rowToPersonalityReport,
  type PersonalityReport,
} from "@/features/personality-reports/types";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export class PersonalityReportsService {
  private readonly repo: PersonalityReportsRepository;

  constructor(repo = new PersonalityReportsRepository()) {
    this.repo = repo;
  }

  async saveReport(
    userId: string,
    profile: PersonalityProfile,
    commentary?: PersonalityCommentary | null,
  ): Promise<PersonalityReport> {
    const inserted = await this.repo.insert(
      profileToInsert(userId, profile, commentary),
    );
    return rowToPersonalityReport(inserted);
  }

  async listReports(userId: string, limit = 50): Promise<PersonalityReport[]> {
    const rows = await this.repo.listByUserId(userId, limit);
    return rows.map(rowToPersonalityReport);
  }

  async getReport(id: string): Promise<PersonalityReport | null> {
    const row = await this.repo.getById(id);
    if (!row) return null;
    return rowToPersonalityReport(row);
  }

  async saveCommentary(
    reportId: string,
    commentary: PersonalityCommentary,
  ): Promise<PersonalityReport> {
    const updated = await this.repo.updateCommentary(reportId, {
      humorous_commentary: commentary.humorousCommentary,
      yearly_title: commentary.yearlyTitle,
    });
    return rowToPersonalityReport(updated);
  }
}
