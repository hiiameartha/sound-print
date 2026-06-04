import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import {
  clampScore0To100,
  normalize,
} from "@/features/personality/engine/utils/signals";

export class SocialTraitScorer implements TraitScorerStrategy {
  readonly key = "social" as const;

  score(input: PersonalityInput): number {
    const mainstream = normalize(input.avgArtistPopularity, 35, 90);
    const raw =
      input.partyRatio * 40 +
      mainstream * 30 +
      input.recentArtistDiversity * 15 +
      normalize(input.avgTrackPopularity, 40, 90) * 15;
    return clampScore0To100(raw);
  }
}
