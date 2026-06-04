export const GENRE_SIGNALS = {
  chill: [
    "ambient",
    "chill",
    "sleep",
    "acoustic",
    "lo-fi",
    "lofi",
    "spa",
    "meditation",
    "soundtrack",
  ],
  party: ["dance", "edm", "house", "techno", "disco", "party", "club"],
  romantic: [
    "r&b",
    "rnb",
    "soul",
    "ballad",
    "love",
    "romance",
    "singer-songwriter",
    "soft rock",
  ],
  emotional: [
    "sad",
    "melancholy",
    "indie folk",
    "folk",
    "acoustic",
    "emo",
    "alternative",
    "chill",
  ],
  kpop: ["k-pop", "kpop", "k pop", "korean pop"],
  indie: ["indie", "indie rock", "indie pop", "alternative rock", "art pop"],
  intense: ["metal", "hard-rock", "punk", "rock", "hip hop", "rap", "grunge"],
} as const;

export function clampScore0To100(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function collectGenres(
  artists: { genres?: string[] | null }[],
): string[] {
  return unique(
    artists.flatMap((a) =>
      (a.genres ?? []).filter(
        (g): g is string => typeof g === "string" && g.length > 0,
      ),
    ),
  );
}

export function artistOverlapRatio(
  shortIds: string[],
  mediumIds: string[],
): number {
  if (shortIds.length === 0 || mediumIds.length === 0) return 0;
  const mediumSet = new Set(mediumIds);
  const overlap = shortIds.filter((id) => mediumSet.has(id)).length;
  return overlap / shortIds.length;
}

export function genreMatchRatio(
  genres: string[],
  keywords: readonly string[],
): number {
  const valid = genres.filter((g) => typeof g === "string" && g.length > 0);
  if (valid.length === 0) return 0;
  const hits = valid.filter((g) =>
    keywords.some((kw) => g.toLowerCase().includes(kw)),
  ).length;
  return hits / valid.length;
}

export function repeatListeningRatio(
  recentTrackIds: string[],
  topTrackIds: string[],
): number {
  if (recentTrackIds.length === 0) return 0;
  const topSet = new Set(topTrackIds);
  const repeats = recentTrackIds.filter((id) => topSet.has(id)).length;
  return repeats / recentTrackIds.length;
}
