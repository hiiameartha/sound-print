import { spotifyToPersonalityInput } from "@/features/personality/engine/adapters/spotify-to-personality-input";
import type { ArchetypeRuleStrategy } from "@/features/personality/engine/archetype-rules/archetype-rule.strategy";
import { createDefaultArchetypeRules } from "@/features/personality/engine/archetype-rules";
import type { TraitScorerStrategy } from "@/features/personality/engine/trait-scorers/trait-scorer.strategy";
import { createDefaultTraitScorers } from "@/features/personality/engine/trait-scorers";
import type { ArchetypeMatch } from "@/features/personality/types/archetype";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import {
  PERSONALITY_TRAIT_KEYS,
  type PersonalityTraits,
} from "@/features/personality/types/traits";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { SpotifyListeningData } from "@/lib/spotify/api";

export const PERSONALITY_ENGINE_VERSION = "1.0.0";

export type PersonalityAnalysisResult = {
  profile: PersonalityProfile;
};

export class PersonalityEngine {
  constructor(
    private readonly traitScorers: TraitScorerStrategy[] = createDefaultTraitScorers(),
    private readonly archetypeRules: ArchetypeRuleStrategy[] = createDefaultArchetypeRules(),
  ) {}

  analyze(spotifyData: SpotifyListeningData): PersonalityProfile {
    return this.analyzeFromInput(spotifyToPersonalityInput(spotifyData));
  }

  analyzeFromInput(input: PersonalityInput): PersonalityProfile {
    const traits = this.evaluateTraits(input);
    const { primary, secondary } = this.resolveArchetypes(traits, input);

    return {
      traits,
      primaryArchetype: primary,
      secondaryArchetype: secondary,
      highlights: {
        displayName: input.displayName,
        topArtist: input.topArtist,
        genreCount: input.genreCount,
        trackSampleSize: input.trackSampleSize,
      },
      analyzedAt: new Date().toISOString(),
      engineVersion: PERSONALITY_ENGINE_VERSION,
      provider: "spotify",
    };
  }

  private evaluateTraits(
    input: ReturnType<typeof spotifyToPersonalityInput>,
  ): PersonalityTraits {
    const traits = {} as PersonalityTraits;

    for (const scorer of this.traitScorers) {
      traits[scorer.key] = scorer.score(input);
    }

    for (const key of PERSONALITY_TRAIT_KEYS) {
      if (traits[key] === undefined) {
        throw new Error(
          `PersonalityEngine: missing trait scorer for "${key}"`,
        );
      }
    }

    return traits;
  }

  private resolveArchetypes(
    traits: PersonalityTraits,
    input: ReturnType<typeof spotifyToPersonalityInput>,
  ): { primary: ArchetypeMatch; secondary: ArchetypeMatch } {
    const ranked = this.archetypeRules
      .map((rule) => ({
        id: rule.id,
        title: rule.title,
        score: rule.match(traits, input),
      }))
      .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) {
      throw new Error("PersonalityEngine: no archetype rules registered");
    }

    const primary = ranked[0]!;
    const secondary =
      ranked.find((item) => item.id !== primary.id) ?? ranked[0]!;

    return { primary, secondary };
  }
}

let defaultEngine: PersonalityEngine | null = null;

export function getPersonalityEngine(): PersonalityEngine {
  if (!defaultEngine) {
    defaultEngine = new PersonalityEngine();
  }
  return defaultEngine;
}

export function analyzePersonality(
  spotifyData: SpotifyListeningData,
): PersonalityProfile {
  return getPersonalityEngine().analyze(spotifyData);
}

export function analyzePersonalityFromInput(
  input: PersonalityInput,
): PersonalityProfile {
  return getPersonalityEngine().analyzeFromInput(input);
}
