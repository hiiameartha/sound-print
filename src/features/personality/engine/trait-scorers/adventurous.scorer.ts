import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import {
  clampScore0To100,
  normalize,
} from "@/features/personality/engine/utils/signals";

export class AdventurousTraitScorer implements TraitScorerStrategy {
  readonly key = "adventurous" as const;

  score(input: PersonalityInput): number {
    const niche = 1 - normalize(input.avgTrackPopularity, 30, 90);
    const raw =
      input.intenseRatio * 40 +
      input.exploration * 30 +
      input.indieRatio * 20 +
      niche * 10;
    return clampScore0To100(raw);
  }
}
