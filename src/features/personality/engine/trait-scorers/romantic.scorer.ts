import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import {
  clampScore0To100,
  normalize,
} from "@/features/personality/engine/utils/signals";

export class RomanticTraitScorer implements TraitScorerStrategy {
  readonly key = "romantic" as const;

  score(input: PersonalityInput): number {
    const mainstream = normalize(input.avgTrackPopularity, 25, 85);
    const raw =
      input.romanticGenreRatio * 55 +
      input.emotionalGenreRatio * 25 +
      mainstream * 10 +
      (1 - input.intenseRatio) * 10;
    return clampScore0To100(raw);
  }
}
