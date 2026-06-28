import type { SpotifyListeningData, SpotifyTrack } from "@/lib/spotify/api";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type { TraitSignalMap } from "@/features/personality/engine/utils/trait-signals";
import {
  normalizeNovelty,
  normalizePopularity,
  normalizeReleaseAge,
} from "@/features/personality/engine/utils/trait-signals";
import {
  artistOverlapRatio,
  average,
  averageReleaseAgeYears,
  collectGenres,
  genreEntropy,
  genreMatchRatio,
  GENRE_SIGNALS,
  normalize,
  repeatListeningRatio,
  unique,
} from "@/features/personality/engine/utils/signals";

function tracksByArtistSet(
  tracks: SpotifyTrack[],
  artistIds: Set<string>,
): SpotifyTrack[] {
  return tracks.filter((track) =>
    (track.artists ?? []).some(
      (artist) => artist?.id && artistIds.has(artist.id),
    ),
  );
}

function avgAudioFeature(
  tracks: SpotifyTrack[],
  features: SpotifyListeningData["audioFeaturesByTrackId"],
  key: "valence" | "energy",
  fallback: number,
): number {
  const values = tracks
    .map((track) => features[track.id]?.[key])
    .filter((value): value is number => typeof value === "number");

  if (values.length === 0) return fallback;
  return average(values);
}

function avgReleaseAgeSignal(
  tracks: SpotifyTrack[],
  fallback: number,
): number {
  const age = averageReleaseAgeYears(
    tracks.map((track) => track.album?.release_date),
  );
  if (age === null) return fallback;
  return normalizeReleaseAge(age);
}

function valenceFallback(input: {
  romanticGenreRatio: number;
  emotionalGenreRatio: number;
  intenseRatio: number;
}): number {
  return (
    input.romanticGenreRatio * 0.45 +
    input.emotionalGenreRatio * 0.35 +
    (1 - input.intenseRatio) * 0.2
  );
}

function energyFallback(input: {
  partyRatio: number;
  intenseRatio: number;
  chillRatio: number;
}): number {
  return (
    input.partyRatio * 0.45 +
    input.intenseRatio * 0.35 +
    (1 - input.chillRatio) * 0.2
  );
}

function buildTraitSignals(
  data: SpotifyListeningData,
  base: {
    allGenres: string[];
    shortGenres: string[];
    mediumGenres: string[];
    recentGenres: string[];
    topTrackGenres: string[];
    artistOverlap: number;
    exploration: number;
    repeatListeningRatio: number;
    newArtistRatio: number;
    songFreshness: number;
    chillRatio: number;
    partyRatio: number;
    romanticGenreRatio: number;
    emotionalGenreRatio: number;
    intenseRatio: number;
    avgTrackPopularity: number;
    avgArtistPopularity: number;
    avgMediumArtistPopularity: number;
    avgRecentArtistPopularity: number;
    avgTopTrackArtistPopularity: number;
  },
): TraitSignalMap {
  const {
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
    audioFeaturesByTrackId,
  } = data;

  const shortArtistIds = new Set(
    topArtistsShort
      .map((artist) => artist.id)
      .filter((id): id is string => typeof id === "string"),
  );
  const recentTracks = recentlyPlayedTracks.map((entry) => entry.track);
  const topArtistTracks = tracksByArtistSet(topTracksShort, shortArtistIds);

  const valenceFallbackValue = valenceFallback(base);
  const energyFallbackValue = energyFallback(base);

  const recentValence = avgAudioFeature(
    recentTracks,
    audioFeaturesByTrackId,
    "valence",
    valenceFallbackValue,
  );
  const topArtistValence = avgAudioFeature(
    topArtistTracks,
    audioFeaturesByTrackId,
    "valence",
    valenceFallbackValue,
  );
  const topTrackValence = avgAudioFeature(
    topTracksShort,
    audioFeaturesByTrackId,
    "valence",
    valenceFallbackValue,
  );
  const stabilityValence = avgAudioFeature(
    topArtistTracks.length > 0 ? topArtistTracks : topTracksShort,
    audioFeaturesByTrackId,
    "valence",
    valenceFallbackValue,
  );

  const recentEnergy = avgAudioFeature(
    recentTracks,
    audioFeaturesByTrackId,
    "energy",
    energyFallbackValue,
  );
  const topArtistEnergy = avgAudioFeature(
    topArtistTracks,
    audioFeaturesByTrackId,
    "energy",
    energyFallbackValue,
  );
  const topTrackEnergy = avgAudioFeature(
    topTracksShort,
    audioFeaturesByTrackId,
    "energy",
    energyFallbackValue,
  );
  const stabilityEnergy = avgAudioFeature(
    topArtistTracks.length > 0 ? topArtistTracks : topTracksShort,
    audioFeaturesByTrackId,
    "energy",
    energyFallbackValue,
  );

  const releaseFallback = normalizeReleaseAge(8);

  const recentNovelty = normalizeNovelty(
    base.newArtistRatio * 0.55 + base.songFreshness * 0.45,
  );
  const topArtistNovelty = normalizeNovelty(base.exploration);
  const topTrackNovelty = normalizeNovelty(
    1 - normalizePopularity(base.avgTrackPopularity),
  );
  const stabilityNovelty = normalizeNovelty(1 - base.repeatListeningRatio);

  const nostalgiaStability = normalizeNovelty(
    base.artistOverlap * 0.6 + base.repeatListeningRatio * 0.4,
  );

  return {
    romantic: {
      recent: recentValence,
      topArtists: topArtistValence,
      topTracks: topTrackValence,
      stability: stabilityValence,
    },
    explorer: {
      recent: genreEntropy(base.recentGenres),
      topArtists: genreEntropy(base.shortGenres),
      topTracks: genreEntropy(base.topTrackGenres),
      stability: genreEntropy(base.mediumGenres),
    },
    social: {
      recent: normalizePopularity(base.avgRecentArtistPopularity),
      topArtists: normalizePopularity(base.avgArtistPopularity),
      topTracks: normalizePopularity(base.avgTopTrackArtistPopularity),
      stability: normalizePopularity(base.avgMediumArtistPopularity),
    },
    emotional: {
      recent: recentEnergy,
      topArtists: topArtistEnergy,
      topTracks: topTrackEnergy,
      stability: stabilityEnergy,
    },
    nostalgia: {
      recent: avgReleaseAgeSignal(recentTracks, releaseFallback),
      topArtists: avgReleaseAgeSignal(topArtistTracks, releaseFallback),
      topTracks: avgReleaseAgeSignal(topTracksShort, releaseFallback),
      stability: nostalgiaStability,
    },
    adventurous: {
      recent: recentNovelty,
      topArtists: topArtistNovelty,
      topTracks: topTrackNovelty,
      stability: stabilityNovelty,
    },
  };
}

export function spotifyToPersonalityInput(
  data: SpotifyListeningData,
): PersonalityInput {
  const {
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
  } = data;

  const shortGenres = collectGenres(topArtistsShort);
  const mediumGenres = collectGenres(topArtistsMedium);
  const allGenres = unique([...shortGenres, ...mediumGenres]);

  const shortArtistIds = topArtistsShort
    .map((artist) => artist.id)
    .filter((id): id is string => typeof id === "string");
  const mediumArtistIds = topArtistsMedium
    .map((artist) => artist.id)
    .filter((id): id is string => typeof id === "string");
  const mediumArtistIdSet = new Set(mediumArtistIds);

  const recentArtistIds = unique(
    recentlyPlayedTracks.flatMap((entry) =>
      (entry.track.artists ?? [])
        .map((artist) => artist?.id)
        .filter((id): id is string => typeof id === "string"),
    ),
  );

  const recentTrackIds = recentlyPlayedTracks
    .map((entry) => entry.track.id)
    .filter((id): id is string => typeof id === "string");
  const topTrackIds = topTracksShort
    .map((track) => track.id)
    .filter((id): id is string => typeof id === "string");

  const overlap = artistOverlapRatio(shortArtistIds, mediumArtistIds);
  const trackSampleSize = unique([...topTrackIds, ...recentTrackIds]).length;
  const repeatRatio = repeatListeningRatio(recentTrackIds, topTrackIds);

  const newArtistCount = recentArtistIds.filter(
    (id) => !mediumArtistIdSet.has(id),
  ).length;
  const newArtistRatio =
    recentArtistIds.length > 0 ? newArtistCount / recentArtistIds.length : 0;

  const topTrackIdSet = new Set(topTrackIds);
  const freshTrackCount = recentTrackIds.filter(
    (id) => !topTrackIdSet.has(id),
  ).length;
  const songFreshness =
    recentTrackIds.length > 0 ? freshTrackCount / recentTrackIds.length : 0;

  const recentGenres = collectGenres(
    recentlyPlayedTracks.flatMap((entry) =>
      (entry.track.artists ?? []).map((artist) => ({
        genres: topArtistsShort.find((item) => item.id === artist?.id)?.genres,
      })),
    ),
  );

  const topTrackGenres = collectGenres(
    topTracksShort.flatMap((track) =>
      (track.artists ?? []).map((artist) => ({
        genres: topArtistsShort.find((item) => item.id === artist?.id)?.genres,
      })),
    ),
  );

  const avgTrackPopularity = average(
    topTracksShort.map((track) => track.popularity ?? 0),
  );
  const avgArtistPopularity = average(
    topArtistsShort.map((artist) => artist.popularity ?? 0),
  );
  const avgMediumArtistPopularity = average(
    topArtistsMedium.map((artist) => artist.popularity ?? 0),
  );

  const recentArtistPopularityValues = recentlyPlayedTracks.flatMap((entry) =>
    (entry.track.artists ?? [])
      .map((artist) => {
        const matched = topArtistsShort.find((item) => item.id === artist?.id);
        return matched?.popularity;
      })
      .filter((value): value is number => typeof value === "number"),
  );
  const avgRecentArtistPopularity =
    recentArtistPopularityValues.length > 0
      ? average(recentArtistPopularityValues)
      : avgArtistPopularity;

  const topTrackArtistPopularityValues = topTracksShort.flatMap((track) =>
    (track.artists ?? [])
      .map((artist) => {
        const matched = topArtistsShort.find((item) => item.id === artist?.id);
        return matched?.popularity;
      })
      .filter((value): value is number => typeof value === "number"),
  );
  const avgTopTrackArtistPopularity =
    topTrackArtistPopularityValues.length > 0
      ? average(topTrackArtistPopularityValues)
      : avgTrackPopularity;

  const chillRatio = genreMatchRatio(allGenres, GENRE_SIGNALS.chill);
  const partyRatio = genreMatchRatio(allGenres, GENRE_SIGNALS.party);
  const romanticGenreRatio = genreMatchRatio(allGenres, GENRE_SIGNALS.romantic);
  const emotionalGenreRatio = genreMatchRatio(
    allGenres,
    GENRE_SIGNALS.emotional,
  );
  const intenseRatio = genreMatchRatio(allGenres, GENRE_SIGNALS.intense);

  const traitSignals = buildTraitSignals(data, {
    allGenres,
    shortGenres,
    mediumGenres,
    recentGenres,
    topTrackGenres,
    artistOverlap: overlap,
    exploration: 1 - overlap,
    repeatListeningRatio: repeatRatio,
    newArtistRatio,
    songFreshness,
    chillRatio,
    partyRatio,
    romanticGenreRatio,
    emotionalGenreRatio,
    intenseRatio,
    avgTrackPopularity,
    avgArtistPopularity,
    avgMediumArtistPopularity,
    avgRecentArtistPopularity,
    avgTopTrackArtistPopularity,
  });

  return {
    displayName: user.display_name ?? "Spotify 使用者",
    topArtist: topArtistsShort[0]?.name ?? null,
    genreCount: allGenres.length,
    trackSampleSize,
    allGenres,
    traitSignals,
    chillRatio,
    partyRatio,
    romanticGenreRatio,
    emotionalGenreRatio,
    kpopRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.kpop),
    indieRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.indie),
    intenseRatio,
    artistOverlap: overlap,
    exploration: 1 - overlap,
    genreBreadth: normalize(allGenres.length, 4, 28),
    recentArtistDiversity: normalize(recentArtistIds.length, 8, 40),
    repeatListeningRatio: repeatRatio,
    avgTrackPopularity,
    avgArtistPopularity,
    recentTrackCount: recentlyPlayedTracks.length,
  };
}
