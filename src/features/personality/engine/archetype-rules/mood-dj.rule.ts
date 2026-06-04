import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class MoodDjRule implements ArchetypeRuleStrategy {
  readonly id = "mood-dj" as const;
  readonly title = ARCHETYPE_TITLES["mood-dj"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const raw =
      traits.emotional * 0.35 +
      input.genreBreadth * 100 * 0.25 +
      traits.adventurous * 0.15 +
      input.recentArtistDiversity * 100 * 0.15 +
      input.partyRatio * 100 * 0.1;
    return clampScore0To100(raw);
  }
}
