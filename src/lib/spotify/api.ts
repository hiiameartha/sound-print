import { SPOTIFY_API_BASE } from "@/lib/spotify/config";

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
};

export type SpotifyTrack = {
  id: string;
  name: string;
  popularity?: number;
  artists: { id?: string; name?: string }[];
};

export type SpotifyListeningData = {
  user: SpotifyUser;
  topArtistsShort: SpotifyArtist[];
  topArtistsMedium: SpotifyArtist[];
  topTracksShort: SpotifyTrack[];
  recentlyPlayedTracks: SpotifyTrack[];
};

type PagedArtists = { items: SpotifyArtist[] };
type PagedTracks = { items: { track: SpotifyTrack }[] };
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
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<PagedTracks>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken,
  );
  return data.items
    .map((item) => item.track)
    .filter(
      (track): track is SpotifyTrack =>
        Boolean(track?.id && Array.isArray(track.artists)),
    );
}

export async function fetchSpotifyListeningData(
  accessToken: string,
): Promise<SpotifyListeningData> {
  const [user, topArtistsShort, topArtistsMedium, topTracksShort, recentlyPlayedTracks] =
    await Promise.all([
      spotifyFetch<SpotifyUser>("/me", accessToken),
      fetchTopArtists(accessToken, "short_term"),
      fetchTopArtists(accessToken, "medium_term"),
      fetchTopTracks(accessToken),
      fetchRecentlyPlayed(accessToken),
    ]);

  const listening: SpotifyListeningData = {
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
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
