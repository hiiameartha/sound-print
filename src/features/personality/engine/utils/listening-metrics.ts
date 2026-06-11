import type { SpotifyListeningData } from "@/lib/spotify/api";
import {
  collectGenres,
  genreMatchRatio,
  GENRE_SIGNALS,
  repeatListeningRatio,
  unique,
} from "@/features/personality/engine/utils/signals";

const LANGUAGE_GENRE_HINTS: Record<string, string[]> = {
  korean: ["k-pop", "kpop", "k pop", "korean"],
  japanese: ["j-pop", "jpop", "j pop", "anime", "japanese"],
  mandarin: ["mandopop", "c-pop", "cpop", "chinese"],
  latin: ["latin", "reggaeton", "bachata", "salsa"],
  spanish: ["spanish", "flamenco"],
};

function hasScript(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

function detectScriptLanguages(text: string): string[] {
  const found: string[] = [];
  if (hasScript(text, /[\u3040-\u30ff\u4e00-\u9fff]/)) found.push("cjk");
  if (hasScript(text, /[\uac00-\ud7af]/)) found.push("korean");
  if (hasScript(text, /[\u0400-\u04ff]/)) found.push("cyrillic");
  if (hasScript(text, /[\u0600-\u06ff]/)) found.push("arabic");
  if (/[a-zA-Z]/.test(text)) found.push("latin");
  return found;
}

function detectLanguageGroups(
  artists: { name?: string; genres?: string[] | null }[],
): string[] {
  const groups = new Set<string>();

  for (const artist of artists) {
    for (const lang of detectScriptLanguages(artist.name ?? "")) {
      groups.add(lang);
    }
    for (const genre of artist.genres ?? []) {
      const lower = genre.toLowerCase();
      for (const [lang, hints] of Object.entries(LANGUAGE_GENRE_HINTS)) {
        if (hints.some((hint) => lower.includes(hint))) {
          groups.add(lang);
        }
      }
    }
  }

  return [...groups];
}

function genreEntropy(genres: string[]): number {
  if (genres.length === 0) return 0;

  const counts = new Map<string, number>();
  for (const genre of genres) {
    counts.set(genre, (counts.get(genre) ?? 0) + 1);
  }

  const total = genres.length;
  let entropy = 0;
  for (const count of counts.values()) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }

  const maxEntropy = Math.log2(counts.size);
  if (maxEntropy <= 0) return 0;
  return entropy / maxEntropy;
}

export type ListeningMetrics = {
  newArtistRatio: number;
  languageSpan: number;
  songFreshness: number;
  genreEntropy: number;
  romanticGenreRatio: number;
  partyGenreRatio: number;
  emotionalGenreRatio: number;
  indieGenreRatio: number;
  intenseGenreRatio: number;
  chillGenreRatio: number;
};

export function computeListeningMetrics(
  data: SpotifyListeningData,
): ListeningMetrics {
  const {
    topArtistsShort,
    topArtistsMedium,
    topTracksShort,
    recentlyPlayedTracks,
  } = data;

  const mediumArtistIds = new Set(
    topArtistsMedium
      .map((a) => a.id)
      .filter((id): id is string => typeof id === "string"),
  );

  const recentArtistIds = unique(
    recentlyPlayedTracks.flatMap((track) =>
      (track.artists ?? [])
        .map((artist) => artist?.id)
        .filter((id): id is string => typeof id === "string"),
    ),
  );

  const newArtistCount = recentArtistIds.filter(
    (id) => !mediumArtistIds.has(id),
  ).length;
  const newArtistRatio =
    recentArtistIds.length > 0 ? newArtistCount / recentArtistIds.length : 0;

  const topTrackIds = new Set(
    topTracksShort
      .map((track) => track.id)
      .filter((id): id is string => typeof id === "string"),
  );
  const recentTrackIds = recentlyPlayedTracks
    .map((track) => track.id)
    .filter((id): id is string => typeof id === "string");
  const freshTrackCount = recentTrackIds.filter(
    (id) => !topTrackIds.has(id),
  ).length;
  const songFreshness =
    recentTrackIds.length > 0 ? freshTrackCount / recentTrackIds.length : 0;

  const allGenres = unique([
    ...collectGenres(topArtistsShort),
    ...collectGenres(topArtistsMedium),
    ...collectGenres(
      recentlyPlayedTracks.flatMap((track) =>
        (track.artists ?? []).map((artist) => ({
          genres: topArtistsShort.find((a) => a.id === artist?.id)?.genres,
        })),
      ),
    ),
  ]);

  const languageSpan = detectLanguageGroups([
    ...topArtistsShort,
    ...topArtistsMedium,
    ...recentlyPlayedTracks.flatMap((track) => track.artists ?? []),
  ]).length;

  return {
    newArtistRatio,
    languageSpan,
    songFreshness,
    genreEntropy: genreEntropy(allGenres),
    romanticGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.romantic),
    partyGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.party),
    emotionalGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.emotional),
    indieGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.indie),
    intenseGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.intense),
    chillGenreRatio: genreMatchRatio(allGenres, GENRE_SIGNALS.chill),
  };
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
