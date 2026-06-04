import { spotifyToPersonalityInput } from "@/features/personality/engine/adapters/spotify-to-personality-input";
import type {
  SpotifyArtist,
  SpotifyListeningData,
  SpotifyTrack,
} from "@/lib/spotify/api";

export type SpotifyFieldIssue = {
  field: string;
  severity: "empty" | "missing" | "partial";
  message: string;
  count?: number;
  total?: number;
};

export type SpotifyDiagnosis = {
  ok: boolean;
  issues: SpotifyFieldIssue[];
  counts: {
    topArtistsShort: number;
    topArtistsMedium: number;
    topTracksShort: number;
    recentlyPlayedTracks: number;
  };
  optionalFieldStats: {
    artistsWithoutGenres: number;
    artistsWithoutPopularity: number;
    tracksWithoutPopularity: number;
    recentTracksWithArtistId: number;
    recentTracksWithoutArtistId: number;
  };
  personalityInput: ReturnType<typeof spotifyToPersonalityInput>;
};

function countArtistsMissingGenres(artists: SpotifyArtist[]): number {
  return artists.filter((a) => !a.genres || a.genres.length === 0).length;
}

function countArtistsMissingPopularity(artists: SpotifyArtist[]): number {
  return artists.filter((a) => a.popularity === undefined || a.popularity === null)
    .length;
}

function countTracksMissingPopularity(tracks: SpotifyTrack[]): number {
  return tracks.filter((t) => t.popularity === undefined || t.popularity === null)
    .length;
}

function countRecentArtistIds(tracks: SpotifyTrack[]): {
  withId: number;
  withoutId: number;
} {
  let withId = 0;
  let withoutId = 0;
  for (const track of tracks) {
    const ids = (track.artists ?? [])
      .map((a) => a?.id)
      .filter((id): id is string => typeof id === "string");
    if (ids.length > 0) withId += 1;
    else withoutId += 1;
  }
  return { withId, withoutId };
}

export function diagnoseSpotifyListeningData(
  data: SpotifyListeningData,
): SpotifyDiagnosis {
  const issues: SpotifyFieldIssue[] = [];
  const {
    user,
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
  } = data;

  if (!user.display_name) {
    issues.push({
      field: "user.display_name",
      severity: "missing",
      message: "Spotify 帳號未設定顯示名稱（會改用「Spotify 使用者」）",
    });
  }

  if (topArtistsShort.length === 0) {
    issues.push({
      field: "topArtistsShort",
      severity: "empty",
      message:
        "近 4 週 Top Artists 為空：新帳號、聆聽量不足，或未授權 user-top-read",
    });
  }

  if (topArtistsMedium.length === 0) {
    issues.push({
      field: "topArtistsMedium",
      severity: "empty",
      message: "近 6 個月 Top Artists 為空，artistOverlap / exploration 會是 0",
    });
  }

  if (topTracksShort.length === 0) {
    issues.push({
      field: "topTracksShort",
      severity: "empty",
      message: "近 4 週 Top Tracks 為空，repeatListeningRatio 等訊號會偏弱",
    });
  }

  if (recentlyPlayedTracks.length === 0) {
    issues.push({
      field: "recentlyPlayedTracks",
      severity: "empty",
      message:
        "最近播放為空：近期沒開 Spotify 播放，或未授權 user-read-recently-played",
    });
  }

  const allArtists = [...topArtistsShort, ...topArtistsMedium];
  const withoutGenres = countArtistsMissingGenres(allArtists);
  if (allArtists.length > 0 && withoutGenres === allArtists.length) {
    issues.push({
      field: "artists.genres",
      severity: "empty",
      message:
        "所有 Top Artists 都沒有 genres：曲風相關 ratio（chill、kpop 等）會全部是 0",
      count: withoutGenres,
      total: allArtists.length,
    });
  } else if (withoutGenres > 0) {
    issues.push({
      field: "artists.genres",
      severity: "partial",
      message: "部分藝人沒有 genres（Spotify 資料庫常見，尤其小眾藝人）",
      count: withoutGenres,
      total: allArtists.length,
    });
  }

  const withoutArtistPop = countArtistsMissingPopularity(topArtistsShort);
  if (topArtistsShort.length > 0 && withoutArtistPop > 0) {
    issues.push({
      field: "artists.popularity",
      severity: "partial",
      message: "部分 Top Artists 缺少 popularity",
      count: withoutArtistPop,
      total: topArtistsShort.length,
    });
  }

  const withoutTrackPop = countTracksMissingPopularity(topTracksShort);
  if (topTracksShort.length > 0 && withoutTrackPop > 0) {
    issues.push({
      field: "tracks.popularity",
      severity: "partial",
      message: "部分 Top Tracks 缺少 popularity",
      count: withoutTrackPop,
      total: topTracksShort.length,
    });
  }

  const recentIds = countRecentArtistIds(recentlyPlayedTracks);
  if (
    recentlyPlayedTracks.length > 0 &&
    recentIds.withoutId === recentlyPlayedTracks.length
  ) {
    issues.push({
      field: "recentlyPlayed.artists.id",
      severity: "missing",
      message:
        "最近播放曲目都沒有 artist.id，recentArtistDiversity 會是 0",
      count: recentIds.withoutId,
      total: recentlyPlayedTracks.length,
    });
  }

  const personalityInput = spotifyToPersonalityInput(data);

  if (personalityInput.genreCount === 0 && allArtists.length > 0) {
    issues.push({
      field: "personalityInput.allGenres",
      severity: "empty",
      message: "轉換後曲風數為 0，人格特質會主要依賴 overlap / 重複播放等訊號",
    });
  }

  if (personalityInput.topArtist === null && topArtistsShort.length > 0) {
    issues.push({
      field: "personalityInput.topArtist",
      severity: "missing",
      message: "有 Top Artists 但無法取得代表藝人名稱",
    });
  }

  const recentIdStats = countRecentArtistIds(recentlyPlayedTracks);

  return {
    ok: issues.filter((i) => i.severity === "empty" || i.severity === "missing")
      .length === 0,
    issues,
    counts: {
      topArtistsShort: topArtistsShort.length,
      topArtistsMedium: topArtistsMedium.length,
      topTracksShort: topTracksShort.length,
      recentlyPlayedTracks: recentlyPlayedTracks.length,
    },
    optionalFieldStats: {
      artistsWithoutGenres: withoutGenres,
      artistsWithoutPopularity: withoutArtistPop,
      tracksWithoutPopularity: withoutTrackPop,
      recentTracksWithArtistId: recentIdStats.withId,
      recentTracksWithoutArtistId: recentIdStats.withoutId,
    },
    personalityInput,
  };
}
