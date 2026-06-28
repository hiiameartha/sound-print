import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { ListeningSignalsInference } from "@/features/personality/schemas/listening-signals-inference-schema";
import {
  genreEntropy,
  GENRE_SIGNALS,
  genreMatchRatio,
  normalize,
  unique,
} from "@/features/personality/engine/utils/signals";
import {
  normalizeNovelty,
  normalizePopularity,
} from "@/features/personality/engine/utils/trait-signals";
import type { SpotifyListeningData } from "@/lib/spotify/api";

export type SignalEnrichmentFields = "genres" | "popularity";

export function needsListeningSignalEnrichment(input: PersonalityInput): {
  needed: boolean;
  fields: SignalEnrichmentFields[];
} {
  const fields: SignalEnrichmentFields[] = [];

  if (input.genreCount === 0 && input.trackSampleSize > 0) {
    fields.push("genres");
  }

  if (
    input.avgTrackPopularity === 0 &&
    input.avgArtistPopularity === 0 &&
    input.trackSampleSize > 0
  ) {
    fields.push("popularity");
  }

  return { needed: fields.length > 0, fields };
}

export function buildListeningSignalsPromptContext(
  data: SpotifyListeningData,
): {
  topArtists: string[];
  topTracks: string[];
  recentTracks: string[];
} {
  const topArtists = data.topArtistsShort
    .map((a) => a.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0)
    .slice(0, 15);

  const topTracks = unique(
    data.topTracksShort
      .map((t) => t.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0),
  ).slice(0, 20);

  const recentTracks = unique(
    data.recentlyPlayedTracks
      .map((entry) => entry.track.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0),
  ).slice(0, 15);

  return { topArtists, topTracks, recentTracks };
}

function refreshTraitSignalsAfterEnrichment(
  input: PersonalityInput,
): PersonalityInput["traitSignals"] {
  const entropy = genreEntropy(input.allGenres);
  const valenceFallback =
    input.romanticGenreRatio * 0.45 +
    input.emotionalGenreRatio * 0.35 +
    (1 - input.intenseRatio) * 0.2;
  const energyFallback =
    input.partyRatio * 0.45 +
    input.intenseRatio * 0.35 +
    (1 - input.chillRatio) * 0.2;
  const socialPopularity = normalizePopularity(input.avgArtistPopularity);
  const trackPopularity = normalizePopularity(input.avgTrackPopularity);

  return {
    romantic: {
      ...input.traitSignals.romantic,
      topArtists:
        input.traitSignals.romantic.topArtists === 0
          ? valenceFallback
          : input.traitSignals.romantic.topArtists,
      topTracks:
        input.traitSignals.romantic.topTracks === 0
          ? valenceFallback
          : input.traitSignals.romantic.topTracks,
    },
    explorer: {
      recent: entropy,
      topArtists: entropy,
      topTracks: entropy,
      stability: entropy,
    },
    social: {
      recent: socialPopularity,
      topArtists: socialPopularity,
      topTracks: trackPopularity,
      stability: socialPopularity,
    },
    emotional: {
      ...input.traitSignals.emotional,
      topArtists:
        input.traitSignals.emotional.topArtists === 0
          ? energyFallback
          : input.traitSignals.emotional.topArtists,
      topTracks:
        input.traitSignals.emotional.topTracks === 0
          ? energyFallback
          : input.traitSignals.emotional.topTracks,
    },
    nostalgia: input.traitSignals.nostalgia,
    adventurous: {
      ...input.traitSignals.adventurous,
      topTracks: normalizeNovelty(1 - trackPopularity),
    },
  };
}

function applyGenreSignals(
  input: PersonalityInput,
  allGenres: string[],
): PersonalityInput {
  const next = {
    ...input,
    allGenres,
    genreCount: allGenres.length,
    chillRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.chill),
    partyRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.party),
    romanticGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.romantic),
    emotionalGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.emotional),
    kpopRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.kpop),
    indieRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.indie),
    intenseRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.intense),
    genreBreadth: normalize(allGenres.length, 4, 28),
  };

  return {
    ...next,
    traitSignals: refreshTraitSignalsAfterEnrichment(next),
  };
}

export function mergeInferredListeningSignals(
  input: PersonalityInput,
  inferred: ListeningSignalsInference,
  fields: SignalEnrichmentFields[],
): PersonalityInput {
  let next = input;

  if (fields.includes("genres")) {
    const genres = unique(
      inferred.genres
        .map((g) => g.trim().toLowerCase())
        .filter((g) => g.length > 0),
    );
    if (genres.length > 0) {
      next = applyGenreSignals(next, genres);
    }
  }

  if (fields.includes("popularity")) {
    next = {
      ...next,
      avgArtistPopularity: inferred.avgArtistPopularity,
      avgTrackPopularity: inferred.avgTrackPopularity,
      traitSignals: refreshTraitSignalsAfterEnrichment({
        ...next,
        avgArtistPopularity: inferred.avgArtistPopularity,
        avgTrackPopularity: inferred.avgTrackPopularity,
      }),
    };
  }

  return next;
}
