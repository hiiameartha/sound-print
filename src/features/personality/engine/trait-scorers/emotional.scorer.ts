import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class EmotionalTraitScorer implements TraitScorerStrategy {
  readonly key = "emotional" as const;

  score(input: PersonalityInput): number {
    const raw =
      input.emotionalGenreRatio * 45 +
      input.chillRatio * 30 +
      (1 - input.partyRatio) * 15 +
      input.indieRatio * 10;
    return clampScore0To100(raw);
  }
}
