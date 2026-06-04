import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class HopelessRomanticRule implements ArchetypeRuleStrategy {
  readonly id = "hopeless-romantic" as const;
  readonly title = ARCHETYPE_TITLES["hopeless-romantic"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const raw =
      traits.romantic * 0.45 +
      traits.emotional * 0.35 +
      input.romanticGenreRatio * 100 * 0.2;
    return clampScore0To100(raw);
  }
}
