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
  release_date?: string;
};

export type SpotifyAudioFeatures = {
  id: string;
  valence: number;
  energy: number;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  popularity?: number;
  artists: { id?: string; name?: string }[];
  album?: SpotifyAlbum;
};

export type RecentlyPlayedEntry = {
  track: SpotifyTrack;
  playedAt: string | null;
};

export type SpotifyListeningData = {
  user: SpotifyUser;
  topArtistsShort: SpotifyArtist[];
  topArtistsMedium: SpotifyArtist[];
  topTracksShort: SpotifyTrack[];
  recentlyPlayedTracks: RecentlyPlayedEntry[];
  audioFeaturesByTrackId: Record<string, SpotifyAudioFeatures>;
};

type PagedArtists = { items: SpotifyArtist[] };
type RecentlyPlayedItem = {
  played_at?: string;
  track: SpotifyTrack;
};
type PagedTracks = { items: RecentlyPlayedItem[] };
type TopTracksResponse = { items: SpotifyTrack[] };
type AudioFeaturesResponse = {
  audio_features: (SpotifyAudioFeatures | null)[];
};

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function fetchAudioFeatures(
  accessToken: string,
  trackIds: string[],
): Promise<Record<string, SpotifyAudioFeatures>> {
  const uniqueIds = [...new Set(trackIds.filter((id) => id.length > 0))];
  if (uniqueIds.length === 0) return {};

  const byId: Record<string, SpotifyAudioFeatures> = {};

  for (const batch of chunk(uniqueIds, 100)) {
    try {
      const data = await spotifyFetch<AudioFeaturesResponse>(
        `/audio-features?ids=${batch.join(",")}`,
        accessToken,
      );

      for (const feature of data.audio_features) {
        if (
          feature?.id &&
          typeof feature.valence === "number" &&
          typeof feature.energy === "number"
        ) {
          byId[feature.id] = feature;
        }
      }
    } catch (err) {
      logSpotifyDev("audio-features batch failed", err);
    }
  }

  return byId;
}

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
): Promise<RecentlyPlayedEntry[]> {
  const data = await spotifyFetch<PagedTracks>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken,
  );

  const entries: RecentlyPlayedEntry[] = [];

  for (const item of data.items) {
    const track = item.track;
    if (!track?.id || !Array.isArray(track.artists)) continue;
    entries.push({
      track,
      playedAt: item.played_at ?? null,
    });
  }

  return entries;
}

export async function fetchSpotifyListeningData(
  accessToken: string,
): Promise<SpotifyListeningData> {
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

  const recentlyPlayedTracks = recentlyPlayed;

  const trackIds = [
    ...topTracksShort.map((track) => track.id),
    ...recentlyPlayedTracks.map((entry) => entry.track.id),
  ];
  const audioFeaturesByTrackId = await fetchAudioFeatures(accessToken, trackIds);

  const listening: SpotifyListeningData = {
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
    audioFeaturesByTrackId,
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
    sampleRecentTrack: recentlyPlayedTracks[0]?.track ?? null,
  });

  return listening;
}
