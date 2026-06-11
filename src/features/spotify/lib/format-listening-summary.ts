import type {
  SpotifyArtist,
  SpotifyListeningData,
  SpotifyTrack,
} from "@/lib/spotify/api";
import { pickSpotifyImageUrl } from "@/lib/spotify/images";

export type ListeningArtistItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  rank: number;
};

export type ListeningTrackItem = {
  id: string;
  name: string;
  artists: string;
  albumName: string | null;
  imageUrl: string | null;
  popularity: number | null;
  playedAt: string | null;
  rank: number | null;
};

export type SpotifyListeningSummary = {
  displayName: string;
  userId: string;
  fetchedAt: string;
  counts: {
    topArtistsShort: number;
    topArtistsMedium: number;
    topTracksShort: number;
    recentlyPlayed: number;
  };
  topArtistsShort: ListeningArtistItem[];
  topArtistsMedium: ListeningArtistItem[];
  topTracksShort: ListeningTrackItem[];
  recentlyPlayed: ListeningTrackItem[];
};

function formatArtistNames(
  artists: { name?: string }[] | undefined,
): string {
  return (artists ?? [])
    .map((a) => a.name)
    .filter((name): name is string => Boolean(name))
    .join("、");
}

function toArtistItem(
  artist: SpotifyArtist,
  rank: number,
): ListeningArtistItem {
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: pickSpotifyImageUrl(artist.images),
    rank,
  };
}

function toTrackItem(
  track: SpotifyTrack,
  options: { rank?: number; playedAt?: string | null } = {},
): ListeningTrackItem {
  return {
    id: track.id,
    name: track.name,
    artists: formatArtistNames(track.artists),
    albumName: track.album?.name ?? null,
    imageUrl: pickSpotifyImageUrl(track.album?.images),
    popularity: track.popularity ?? null,
    playedAt: options.playedAt ?? null,
    rank: options.rank ?? null,
  };
}

export function formatSpotifyListeningSummary(
  data: SpotifyListeningData,
  playedAtByTrackId?: Map<string, string>,
): SpotifyListeningSummary {
  const displayName =
    data.user.display_name?.trim() || data.user.id || "Spotify 使用者";

  return {
    displayName,
    userId: data.user.id,
    fetchedAt: new Date().toISOString(),
    counts: {
      topArtistsShort: data.topArtistsShort.length,
      topArtistsMedium: data.topArtistsMedium.length,
      topTracksShort: data.topTracksShort.length,
      recentlyPlayed: data.recentlyPlayedTracks.length,
    },
    topArtistsShort: data.topArtistsShort.map((artist, index) =>
      toArtistItem(artist, index + 1),
    ),
    topArtistsMedium: data.topArtistsMedium.map((artist, index) =>
      toArtistItem(artist, index + 1),
    ),
    topTracksShort: data.topTracksShort.map((track, index) =>
      toTrackItem(track, { rank: index + 1 }),
    ),
    recentlyPlayed: data.recentlyPlayedTracks.map((track) =>
      toTrackItem(track, {
        playedAt: playedAtByTrackId?.get(track.id) ?? null,
      }),
    ),
  };
}
