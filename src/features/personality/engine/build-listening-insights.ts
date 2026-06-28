import type { ListeningMetrics } from "@/features/personality/engine/utils/listening-metrics";
import { formatPercent } from "@/features/personality/engine/utils/listening-metrics";
import {
  collectGenres,
  genreMatchRatio,
  GENRE_SIGNALS,
  normalize,
} from "@/features/personality/engine/utils/signals";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type {
  InsightObservation,
  ListeningInference,
  ListeningInsights,
} from "@/features/personality/types/listening-insights";
import type { SpotifyListeningData } from "@/lib/spotify/api";

const KOREAN_GENRE_HINTS = ["k-pop", "kpop", "k pop", "korean pop", "korean"];
const LANGUAGE_GENRE_LABELS: Record<string, string> = {
  korean: "韓文歌",
  japanese: "日文歌",
  mandarin: "中文歌",
  latin: "拉丁音樂",
};

const LANGUAGE_GENRE_HINTS: Record<string, string[]> = {
  korean: KOREAN_GENRE_HINTS,
  japanese: ["j-pop", "jpop", "j pop", "anime", "japanese"],
  mandarin: ["mandopop", "c-pop", "cpop", "chinese"],
  latin: ["latin", "reggaeton", "bachata", "salsa"],
};

function isEveningHour(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 18 || hour < 6;
}

function computeEveningPlaybackRatio(
  recentlyPlayedTracks: SpotifyListeningData["recentlyPlayedTracks"],
): number | null {
  let evening = 0;
  let total = 0;

  for (const entry of recentlyPlayedTracks) {
    if (!entry.playedAt) continue;
    total += 1;
    if (isEveningHour(new Date(entry.playedAt))) evening += 1;
  }

  if (total === 0) return null;
  return evening / total;
}

function artistMatchesLanguage(
  artist: { name?: string; genres?: string[] | null },
  lang: string,
): boolean {
  const hints = LANGUAGE_GENRE_HINTS[lang];
  if (!hints) return false;

  if (lang === "korean" && /[\uac00-\ud7af]/.test(artist.name ?? "")) {
    return true;
  }
  if (lang === "japanese" && /[\u3040-\u30ff]/.test(artist.name ?? "")) {
    return true;
  }
  if (lang === "mandarin" && /[\u4e00-\u9fff]/.test(artist.name ?? "")) {
    return true;
  }

  return (artist.genres ?? []).some((genre) => {
    const lower = genre.toLowerCase();
    return hints.some((hint) => lower.includes(hint));
  });
}

function enrichArtistGenres(
  artist: { id?: string; name?: string; genres?: string[] | null },
  topArtists: SpotifyListeningData["topArtistsShort"],
): { name?: string; genres?: string[] | null } {
  if (artist.genres && artist.genres.length > 0) return artist;
  const match = topArtists.find((item) => item.id === artist.id);
  return match ?? artist;
}

function languageRatio(
  artists: { id?: string; name?: string; genres?: string[] | null }[],
  lang: string,
  topArtists: SpotifyListeningData["topArtistsShort"],
): number {
  if (artists.length === 0) return 0;
  const enriched = artists.map((artist) => enrichArtistGenres(artist, topArtists));
  const hits = enriched.filter((artist) => artistMatchesLanguage(artist, lang)).length;
  return hits / enriched.length;
}

function detectDominantLanguageTrend(
  data: SpotifyListeningData,
): { label: string; deltaPercent: number } | null {
  const recentArtists = data.recentlyPlayedTracks.flatMap(
    (entry) => entry.track.artists ?? [],
  );
  const baselineArtists = [...data.topArtistsShort, ...data.topArtistsMedium];

  let best: { label: string; deltaPercent: number } | null = null;

  for (const [lang, label] of Object.entries(LANGUAGE_GENRE_LABELS)) {
    const recentRatio = languageRatio(recentArtists, lang, data.topArtistsShort);
    const baselineRatio = languageRatio(baselineArtists, lang, data.topArtistsShort);
    const deltaPercent = Math.round((recentRatio - baselineRatio) * 100);
    if (deltaPercent <= 0) continue;
    if (!best || deltaPercent > best.deltaPercent) {
      best = { label, deltaPercent };
    }
  }

  return best;
}

function energyLabel(score: number): string {
  if (score >= 0.55) return "高能量";
  if (score <= 0.35) return "低能量";
  return "中等能量";
}

function computeEnergyScore(genres: string[]): number {
  const chill = genreMatchRatio(genres, GENRE_SIGNALS.chill);
  const intense = genreMatchRatio(genres, GENRE_SIGNALS.intense);
  const party = genreMatchRatio(genres, GENRE_SIGNALS.party);
  return normalize(intense + party * 0.6 - chill * 0.8, -0.5, 0.7);
}

function buildMoodObservation(
  data: SpotifyListeningData,
): InsightObservation {
  const baselineGenres = collectGenres([
    ...data.topArtistsShort,
    ...data.topArtistsMedium,
  ]);
  const recentGenres = collectGenres(
    data.recentlyPlayedTracks.flatMap((entry) =>
      (entry.track.artists ?? []).map((artist) =>
        enrichArtistGenres(artist, data.topArtistsShort),
      ),
    ),
  );

  const baselineEnergy = computeEnergyScore(baselineGenres);
  const recentEnergy = computeEnergyScore(
    recentGenres.length > 0 ? recentGenres : baselineGenres,
  );

  const delta = recentEnergy - baselineEnergy;
  if (Math.abs(delta) < 0.08) {
    return {
      category: "mood",
      headline: `${energyLabel(baselineEnergy)} · 近期相近`,
    };
  }

  return {
    category: "mood",
    headline: `${energyLabel(baselineEnergy)} → ${energyLabel(recentEnergy)}`,
  };
}

function buildInference(
  data: SpotifyListeningData,
  metrics: ListeningMetrics,
  input: PersonalityInput,
): ListeningInference {
  const baselineGenres = collectGenres([
    ...data.topArtistsShort,
    ...data.topArtistsMedium,
  ]);
  const recentGenres = collectGenres(
    data.recentlyPlayedTracks.flatMap((entry) =>
      (entry.track.artists ?? []).map((artist) =>
        enrichArtistGenres(artist, data.topArtistsShort),
      ),
    ),
  );

  const baselineChill = genreMatchRatio(baselineGenres, GENRE_SIGNALS.chill);
  const recentChill = genreMatchRatio(
    recentGenres.length > 0 ? recentGenres : baselineGenres,
    GENRE_SIGNALS.chill,
  );
  const baselineIntense = genreMatchRatio(baselineGenres, GENRE_SIGNALS.intense);
  const recentIntense = genreMatchRatio(
    recentGenres.length > 0 ? recentGenres : baselineGenres,
    GENRE_SIGNALS.intense,
  );

  const calmDelta = recentChill - recentIntense - (baselineChill - baselineIntense);

  if (calmDelta >= 0.1) {
    const reasons: string[] = [];
    if (metrics.chillGenreRatio >= 0.25) reasons.push("獨處充電");
    if (input.repeatListeningRatio >= 0.45) reasons.push("熟悉歌單循環");
    if (metrics.newArtistRatio <= 0.3) reasons.push("口味偏穩定");
    reasons.push("工作專注", "情緒平穩期", "旅行模式");
    return {
      summary: "最近播放似乎比平常更安靜",
      possibleReasons: [...new Set(reasons)].slice(0, 3),
    };
  }

  if (calmDelta <= -0.1) {
    const reasons: string[] = [];
    if (metrics.partyGenreRatio >= 0.2) reasons.push("社交聚會");
    if (metrics.songFreshness >= 0.45) reasons.push("探索新歌");
    if (input.exploration >= 0.5) reasons.push("口味正在擴張");
    reasons.push("通勤／運動", "心情高漲", "派對模式");
    return {
      summary: "最近播放似乎比平常更熱鬧",
      possibleReasons: [...new Set(reasons)].slice(0, 3),
    };
  }

  return {
    summary: "最近播放節奏與平常大致相近",
    possibleReasons: ["作息規律", "熟悉口味延續", "情緒相對穩定"],
  };
}

export function buildListeningInsights(
  data: SpotifyListeningData,
  input: PersonalityInput,
  metrics: ListeningMetrics,
): ListeningInsights {
  const observations: InsightObservation[] = [];

  const eveningRatio = computeEveningPlaybackRatio(data.recentlyPlayedTracks);
  if (eveningRatio !== null) {
    observations.push({
      category: "habit",
      headline: `${formatPercent(eveningRatio)} 晚上播放`,
    });
  } else {
    observations.push({
      category: "habit",
      headline: "播放時段資料不足",
    });
  }

  const languageTrend = detectDominantLanguageTrend(data);
  if (languageTrend && languageTrend.deltaPercent >= 8) {
    observations.push({
      category: "recent",
      headline: `${languageTrend.label} ↑${languageTrend.deltaPercent}%`,
    });
  } else if (input.kpopRatio >= 0.15) {
    observations.push({
      category: "recent",
      headline: "K-Pop 在你的歌單中佔比偏高",
    });
  } else {
    observations.push({
      category: "recent",
      headline: "近期曲風與平常相近",
    });
  }

  observations.push(buildMoodObservation(data));

  return {
    observations,
    inference: buildInference(data, metrics, input),
  };
}
