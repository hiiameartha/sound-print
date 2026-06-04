import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class IndieWandererRule implements ArchetypeRuleStrategy {
  readonly id = "indie-wanderer" as const;
  readonly title = ARCHETYPE_TITLES["indie-wanderer"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const raw =
      traits.explorer * 0.35 +
      input.indieRatio * 100 * 0.3 +
      input.genreBreadth * 100 * 0.2 +
      (100 - traits.social) * 0.15;
    return clampScore0To100(raw);
  }
}
