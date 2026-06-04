import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class KpopAmbassadorRule implements ArchetypeRuleStrategy {
  readonly id = "kpop-ambassador" as const;
  readonly title = ARCHETYPE_TITLES["kpop-ambassador"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const kpopSignal = input.kpopRatio * 100;
    const raw =
      kpopSignal * 0.6 +
      traits.social * 0.25 +
      traits.romantic * 0.15;
    return clampScore0To100(raw);
  }
}
