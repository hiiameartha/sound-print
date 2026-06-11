import { SPOTIFY_API_BASE } from "@/lib/spotify/config";
import type { SpotifyImage } from "@/lib/spotify/images";

export type SpotifyUser = {
  id: string;
  display_name: string | null;
  followers?: { total: number };
  product?: string;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  popularity?: number;
  genres?: string[];
  images?: SpotifyImage[];
};

export type SpotifyAlbum = {
  id?: string;
  name: string;
  images?: SpotifyImage[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  popularity?: number;
  artists: { id?: string; name?: string }[];
  album?: SpotifyAlbum;
};

export type SpotifyListeningData = {
  user: SpotifyUser;
  topArtistsShort: SpotifyArtist[];
  topArtistsMedium: SpotifyArtist[];
  topTracksShort: SpotifyTrack[];
  recentlyPlayedTracks: SpotifyTrack[];
};

type PagedArtists = { items: SpotifyArtist[] };
type RecentlyPlayedItem = {
  played_at?: string;
  track: SpotifyTrack;
};
type PagedTracks = { items: RecentlyPlayedItem[] };
type TopTracksResponse = { items: SpotifyTrack[] };

function logSpotifyDev(label: string, data: unknown): void {
  if (process.env.NODE_ENV !== "development") return;
  console.log(`[spotify] ${label}`, data);
}

async function spotifyFetch<T>(
  path: string,
  accessToken: string,
): Promise<T> {
  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${path} 失敗：${text}`);
  }

  const json = (await res.json()) as T;
  logSpotifyDev(`raw ${path}`, json);
  return json;
}

async function fetchTopArtists(
  accessToken: string,
  timeRange: "short_term" | "medium_term",
  limit = 50,
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<PagedArtists>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken,
  );
  return data.items.filter((a): a is SpotifyArtist => Boolean(a?.id));
}

async function fetchTopTracks(
  accessToken: string,
  limit = 50,
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<TopTracksResponse>(
    `/me/top/tracks?time_range=short_term&limit=${limit}`,
    accessToken,
  );
  return data.items.filter(
    (t): t is SpotifyTrack => Boolean(t?.id && Array.isArray(t.artists)),
  );
}

async function fetchRecentlyPlayed(
  accessToken: string,
  limit = 50,
): Promise<{ tracks: SpotifyTrack[]; playedAtByTrackId: Map<string, string> }> {
  const data = await spotifyFetch<PagedTracks>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken,
  );

  const tracks: SpotifyTrack[] = [];
  const playedAtByTrackId = new Map<string, string>();

  for (const item of data.items) {
    const track = item.track;
    if (!track?.id || !Array.isArray(track.artists)) continue;
    tracks.push(track);
    if (item.played_at) {
      playedAtByTrackId.set(track.id, item.played_at);
    }
  }

  return { tracks, playedAtByTrackId };
}

export type SpotifyListeningFetchMeta = {
  playedAtByTrackId: Map<string, string>;
};

export async function fetchSpotifyListeningData(
  accessToken: string,
): Promise<SpotifyListeningData & SpotifyListeningFetchMeta> {
  const [
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayed,
  ] = await Promise.all([
    spotifyFetch<SpotifyUser>("/me", accessToken),
    fetchTopArtists(accessToken, "short_term"),
    fetchTopArtists(accessToken, "medium_term"),
    fetchTopTracks(accessToken),
    fetchRecentlyPlayed(accessToken),
  ]);

  const { tracks: recentlyPlayedTracks, playedAtByTrackId } = recentlyPlayed;

  const listening: SpotifyListeningData & SpotifyListeningFetchMeta = {
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
    playedAtByTrackId,
  };

  logSpotifyDev("processed listening", listening);
  logSpotifyDev("processed summary", {
    user: listening.user,
    counts: {
      topArtistsShort: topArtistsShort.length,
      topArtistsMedium: topArtistsMedium.length,
      topTracksShort: topTracksShort.length,
      recentlyPlayedTracks: recentlyPlayedTracks.length,
    },
    sampleTopArtistShort: topArtistsShort[0] ?? null,
    sampleTopTrack: topTracksShort[0] ?? null,
    sampleRecentTrack: recentlyPlayedTracks[0] ?? null,
  });

  return listening;
}
