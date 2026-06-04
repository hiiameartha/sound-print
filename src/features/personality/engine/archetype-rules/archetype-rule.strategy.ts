import type { ArchetypeId } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";

export interface ArchetypeRuleStrategy {
  readonly id: ArchetypeId;
  readonly title: string;
  /**
   * Deterministic match strength (0–100). Higher = stronger fit.
   */
  match(traits: PersonalityTraits, input: PersonalityInput): number;
}
