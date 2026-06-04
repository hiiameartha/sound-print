import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export interface TraitScorerStrategy {
  readonly key: PersonalityTraitKey;
  score(input: PersonalityInput): number;
}
