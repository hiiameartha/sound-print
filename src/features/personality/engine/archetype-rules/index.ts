import { HopelessRomanticRule } from "@/features/personality/engine/archetype-rules/hopeless-romantic.rule";
import { IndieWandererRule } from "@/features/personality/engine/archetype-rules/indie-wanderer.rule";
import { KpopAmbassadorRule } from "@/features/personality/engine/archetype-rules/kpop-ambassador.rule";
import { MidnightPhilosopherRule } from "@/features/personality/engine/archetype-rules/midnight-philosopher.rule";
import { MoodDjRule } from "@/features/personality/engine/archetype-rules/mood-dj.rule";
import { SongRepeaterRule } from "@/features/personality/engine/archetype-rules/song-repeater.rule";
import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";

export function createDefaultArchetypeRules(): ArchetypeRuleStrategy[] {
  return [
    new MidnightPhilosopherRule(),
    new HopelessRomanticRule(),
    new SongRepeaterRule(),
    new KpopAmbassadorRule(),
    new IndieWandererRule(),
    new MoodDjRule(),
  ];
}

export type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
