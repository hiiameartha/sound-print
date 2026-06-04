import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class ExplorerTraitScorer implements TraitScorerStrategy {
  readonly key = "explorer" as const;

  score(input: PersonalityInput): number {
    const raw =
      input.exploration * 40 +
      input.genreBreadth * 35 +
      input.recentArtistDiversity * 25;
    return clampScore0To100(raw);
  }
}
