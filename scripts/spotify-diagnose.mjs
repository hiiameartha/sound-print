/**
 * 用法（需先從瀏覽器 DevTools → Application → Cookies 複製 access token）：
 *   node scripts/spotify-diagnose.mjs "<access_token>"
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const key = t.slice(0, i).trim();
      const val = t.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const token = process.argv[2];
if (!token) {
  console.error("請提供 Spotify access token 作為第一個參數");
  process.exit(1);
}

const base = "https://api.spotify.com/v1";

async function spotifyFetch(path) {
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`${path} ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function countMissingGenres(artists) {
  return artists.filter((a) => !a.genres?.length).length;
}

function countMissingPopularity(items) {
  return items.filter((x) => x.popularity == null).length;
}

function recentArtistIdStats(tracks) {
  let withId = 0;
  let withoutId = 0;
  for (const t of tracks) {
    const ids = (t.artists ?? []).map((a) => a?.id).filter(Boolean);
    if (ids.length) withId++;
    else withoutId++;
  }
  return { withId, withoutId };
}

const [user, topShort, topMedium, topTracks, recent] = await Promise.all([
  spotifyFetch("/me"),
  spotifyFetch("/me/top/artists?time_range=short_term&limit=50"),
  spotifyFetch("/me/top/artists?time_range=medium_term&limit=50"),
  spotifyFetch("/me/top/tracks?time_range=short_term&limit=50"),
  spotifyFetch("/me/player/recently-played?limit=50"),
]);

const topArtistsShort = (topShort.items ?? []).filter((a) => a?.id);
const topArtistsMedium = (topMedium.items ?? []).filter((a) => a?.id);
const topTracksShort = (topTracks.items ?? []).filter(
  (t) => t?.id && Array.isArray(t.artists),
);
const recentlyPlayedTracks = (recent.items ?? [])
  .map((i) => i.track)
  .filter((t) => t?.id && Array.isArray(t.artists));

const allArtists = [...topArtistsShort, ...topArtistsMedium];
const recentStats = recentArtistIdStats(recentlyPlayedTracks);

const report = {
  user: {
    id: user.id,
    display_name: user.display_name,
    product: user.product ?? null,
    followers: user.followers?.total ?? null,
  },
  counts: {
    topArtistsShort: topArtistsShort.length,
    topArtistsMedium: topArtistsMedium.length,
    topTracksShort: topTracksShort.length,
    recentlyPlayedTracks: recentlyPlayedTracks.length,
  },
  optionalFieldStats: {
    artistsWithoutGenres: countMissingGenres(allArtists),
    artistsWithoutPopularity: countMissingPopularity(topArtistsShort),
    tracksWithoutPopularity: countMissingPopularity(topTracksShort),
    recentTracksWithArtistId: recentStats.withId,
    recentTracksWithoutArtistId: recentStats.withoutId,
  },
  sampleFirstArtist: topArtistsShort[0]
    ? {
        name: topArtistsShort[0].name,
        genres: topArtistsShort[0].genres ?? [],
        popularity: topArtistsShort[0].popularity ?? null,
      }
    : null,
  issues: [],
};

if (!user.display_name) {
  report.issues.push("user.display_name 為 null");
}
if (topArtistsShort.length === 0) {
  report.issues.push("topArtistsShort 為空陣列");
}
if (topArtistsMedium.length === 0) {
  report.issues.push("topArtistsMedium 為空陣列");
}
if (topTracksShort.length === 0) {
  report.issues.push("topTracksShort 為空陣列");
}
if (recentlyPlayedTracks.length === 0) {
  report.issues.push("recentlyPlayedTracks 為空陣列");
}
if (allArtists.length > 0 && countMissingGenres(allArtists) === allArtists.length) {
  report.issues.push("所有 Top Artists 都沒有 genres");
}
if (
  recentlyPlayedTracks.length > 0 &&
  recentStats.withoutId === recentlyPlayedTracks.length
) {
  report.issues.push("最近播放曲目都缺少 artist.id");
}

console.log(JSON.stringify(report, null, 2));
