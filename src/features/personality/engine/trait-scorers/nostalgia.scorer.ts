import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import { scoreTraitFromSources } from "@/features/personality/engine/utils/trait-signals";

export class NostalgiaTraitScorer implements TraitScorerStrategy {
  readonly key = "nostalgia" as const;

  score(input: PersonalityInput): number {
    return scoreTraitFromSources(input.traitSignals.nostalgia);
  }
}
