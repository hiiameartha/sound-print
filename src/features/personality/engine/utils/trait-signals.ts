import {
  clampScore0To100,
  normalize,
} from "@/features/personality/engine/utils/signals";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export const TRAIT_SOURCE_WEIGHTS = {
  recent: 0.2,
  topArtists: 0.3,
  topTracks: 0.3,
  stability: 0.2,
} as const;

export type TraitSignalSource = keyof typeof TRAIT_SOURCE_WEIGHTS;

export type TraitSourceSignals = Record<TraitSignalSource, number>;

export type TraitSignalMap = Record<PersonalityTraitKey, TraitSourceSignals>;

export const TRAIT_SIGNAL_LABELS: Record<PersonalityTraitKey, string> = {
  romantic: "Valence",
  explorer: "Genre entropy",
  social: "Artist popularity",
  emotional: "Energy",
  nostalgia: "Release age",
  adventurous: "Novelty",
};

export function normalizePopularity(popularity: number): number {
  return normalize(popularity, 20, 85);
}

export function normalizeReleaseAge(years: number): number {
  return normalize(years, 0, 25);
}

export function normalizeNovelty(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function scoreTraitFromSources(signals: TraitSourceSignals): number {
  const weighted =
    signals.recent * TRAIT_SOURCE_WEIGHTS.recent +
    signals.topArtists * TRAIT_SOURCE_WEIGHTS.topArtists +
    signals.topTracks * TRAIT_SOURCE_WEIGHTS.topTracks +
    signals.stability * TRAIT_SOURCE_WEIGHTS.stability;

  return clampScore0To100(weighted * 100);
}

export function sourceContributionPoints(
  source: TraitSignalSource,
  signal: number,
): number {
  return Math.round(signal * TRAIT_SOURCE_WEIGHTS[source] * 100);
}
