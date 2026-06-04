import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class NostalgiaTraitScorer implements TraitScorerStrategy {
  readonly key = "nostalgia" as const;

  score(input: PersonalityInput): number {
    const raw =
      input.artistOverlap * 45 +
      input.repeatListeningRatio * 35 +
      (1 - input.exploration) * 20;
    return clampScore0To100(raw);
  }
}
