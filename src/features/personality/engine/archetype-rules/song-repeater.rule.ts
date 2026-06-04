import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { ARCHETYPE_TITLES } from "@/features/personality/types/archetype";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { clampScore0To100 } from "@/features/personality/engine/utils/signals";

export class SongRepeaterRule implements ArchetypeRuleStrategy {
  readonly id = "song-repeater" as const;
  readonly title = ARCHETYPE_TITLES["song-repeater"];

  match(traits: PersonalityTraits, input: PersonalityInput): number {
    const raw =
      traits.nostalgia * 0.45 +
      (100 - traits.explorer) * 0.25 +
      input.repeatListeningRatio * 100 * 0.2 +
      input.artistOverlap * 100 * 0.1;
    return clampScore0To100(raw);
  }
}
