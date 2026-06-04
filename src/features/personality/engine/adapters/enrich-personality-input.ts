import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { ListeningSignalsInference } from "@/features/personality/schemas/listening-signals-inference-schema";
import {
  GENRE_SIGNALS,
  genreMatchRatio,
  normalize,
  unique,
} from "@/features/personality/engine/utils/signals";
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
      .map((t) => t.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0),
  ).slice(0, 15);

  return { topArtists, topTracks, recentTracks };
}

function applyGenreSignals(
  input: PersonalityInput,
  allGenres: string[],
): PersonalityInput {
  return {
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
    };
  }

  return next;
}
