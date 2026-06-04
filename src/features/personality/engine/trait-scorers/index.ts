import { AdventurousTraitScorer } from "@/features/personality/engine/trait-scorers/adventurous.scorer";
import { EmotionalTraitScorer } from "@/features/personality/engine/trait-scorers/emotional.scorer";
import { ExplorerTraitScorer } from "@/features/personality/engine/trait-scorers/explorer.scorer";
import { NostalgiaTraitScorer } from "@/features/personality/engine/trait-scorers/nostalgia.scorer";
import { RomanticTraitScorer } from "@/features/personality/engine/trait-scorers/romantic.scorer";
import { SocialTraitScorer } from "@/features/personality/engine/trait-scorers/social.scorer";
import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";

export function createDefaultTraitScorers(): TraitScorerStrategy[] {
  return [
    new RomanticTraitScorer(),
    new SocialTraitScorer(),
    new NostalgiaTraitScorer(),
    new ExplorerTraitScorer(),
    new EmotionalTraitScorer(),
    new AdventurousTraitScorer(),
  ];
}

export type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
