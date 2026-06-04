import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class MidnightPhilosopherRule implements ArchetypeRuleStrategy {
  readonly id = "midnight-philosopher" as const;
  readonly title = ARCHETYPE_TITLES["midnight-philosopher"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const raw =
      traits.emotional * 0.35 +
      traits.explorer * 0.15 +
      input.chillRatio * 100 * 0.25 +
      (1 - input.partyRatio) * 100 * 0.15 +
      (100 - traits.social) * 0.1;
    return clampScore0To100(raw);
  }
}
