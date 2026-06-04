import type { SpotifyListeningData } from "@/lib/spotify/api";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import {
  artistOverlapRatio,
  collectGenres,
  genreMatchRatio,
  GENRE_SIGNALS,
  normalize,
  repeatListeningRatio,
  unique,
  average,
} from "@/features/personality/engine/utils/signals";

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
    .map((a) => a.id)
    .filter((id): id is string => typeof id === "string");
  const mediumArtistIds = topArtistsMedium
    .map((a) => a.id)
    .filter((id): id is string => typeof id === "string");

  const recentArtistIds = unique(
    recentlyPlayedTracks.flatMap((t) =>
      (t.artists ?? [])
        .map((a) => a?.id)
        .filter((id): id is string => typeof id === "string"),
    ),
  );

  const recentTrackIds = recentlyPlayedTracks
    .map((t) => t.id)
    .filter((id): id is string => typeof id === "string");
  const topTrackIds = topTracksShort
    .map((t) => t.id)
    .filter((id): id is string => typeof id === "string");

  const overlap = artistOverlapRatio(shortArtistIds, mediumArtistIds);
  const trackSampleSize = unique([...topTrackIds, ...recentTrackIds]).length;

  return {
    displayName: user.display_name ?? "Spotify 使用者",
    topArtist: topArtistsShort[0]?.name ?? null,
    genreCount: allGenres.length,
    trackSampleSize,
    allGenres,
    chillRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.chill),
    partyRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.party),
    romanticGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.romantic),
    emotionalGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.emotional),
    kpopRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.kpop),
    indieRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.indie),
    intenseRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.intense),
    artistOverlap: overlap,
    exploration: 1 - overlap,
    genreBreadth: normalize(allGenres.length, 4, 28),
    recentArtistDiversity: normalize(recentArtistIds.length, 8, 40),
    repeatListeningRatio: repeatListeningRatio(recentTrackIds, topTrackIds),
    avgTrackPopularity: average(
      topTracksShort.map((t) => t.popularity ?? 0),
    ),
    avgArtistPopularity: average(
      topArtistsShort.map((a) => a.popularity ?? 0),
    ),
    recentTrackCount: recentlyPlayedTracks.length,
  };
}
