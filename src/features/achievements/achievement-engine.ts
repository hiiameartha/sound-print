import type {
  AchievementProgress,
  AchievementStrategy,
  KpiSnapshot,
} from "@/features/achievements/types";

export class AchievementEngine {
  private readonly strategies: AchievementStrategy[];

  constructor(strategies: AchievementStrategy[]) {
    this.strategies = strategies;
  }

  evaluate(snapshot: KpiSnapshot): AchievementProgress[] {
    return this.strategies.map((strategy) => {
      const result = strategy.evaluate(snapshot);
      return {
        ...result,
        definition: strategy.definition,
      };
    });
  }
}

