import type { ListeningMetrics } from "@/features/personality/engine/utils/listening-metrics";
import {
  formatPercent,
} from "@/features/personality/engine/utils/listening-metrics";
import { normalize } from "@/features/personality/engine/utils/signals";
import type { PersonalityInput } from "@/features/personality/types/personality-input";
import type {
  PersonalityTraitBreakdowns,
  TraitBreakdown,
  TraitContributor,
  TraitScoreTrend,
} from "@/features/personality/types/trait-breakdown";
import {
  PERSONALITY_TRAIT_KEYS,
  type PersonalityTraitKey,
  type PersonalityTraits,
} from "@/features/personality/types/traits";

function scoreTrend(score: number): TraitScoreTrend {
  if (score >= 60) return "high";
  if (score <= 40) return "low";
  return "mid";
}

function contributor(
  source: TraitContributor["source"],
  points: number,
  reason: string,
): TraitContributor {
  return {
    source,
    points: Math.max(0, Math.round(points)),
    reason,
  };
}

function explorationReason(exploration: number): string {
  if (exploration >= 0.65) return "新藝人比例高";
  if (exploration >= 0.4) return "名單持續更新";
  return "聆聽名單穩定";
}

function diversityReason(value: number): string {
  if (value >= 0.65) return "聆聽藝人多元";
  if (value >= 0.4) return "藝人組合適中";
  return "藝人較集中";
}

function genreBreadthReason(value: number): string {
  if (value >= 0.65) return "曲風分散";
  if (value >= 0.4) return "曲風適中";
  return "曲風集中";
}

function repeatReason(ratio: number): string {
  if (ratio >= 0.55) return "重複率高";
  if (ratio >= 0.3) return "重複率適中";
  return "重複率低";
}

function freshnessReason(ratio: number): string {
  if (ratio >= 0.65) return "新歌探索多";
  if (ratio >= 0.4) return "新舊曲混搭";
  return "偏熟悉曲目";
}

function languageReason(span: number): string {
  if (span >= 4) return "多國語系";
  if (span >= 2) return "跨語言聆聽";
  return "語言較單一";
}

function mainstreamReason(popularity: number): string {
  const normalized = normalize(popularity, 25, 85);
  if (normalized >= 0.65) return "偏主流熱門";
  if (normalized >= 0.4) return "主流小眾混搭";
  return "偏小眾冷門";
}

function ratioReason(ratio: number, high: string, mid: string, low: string): string {
  if (ratio >= 0.45) return high;
  if (ratio >= 0.2) return mid;
  return low;
}

function buildExplorerBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const contributors = [
    contributor(
      "recently_played",
      input.recentArtistDiversity * 25,
      metrics.newArtistRatio >= 0.45 ? "新藝人比例高" : diversityReason(input.recentArtistDiversity),
    ),
    contributor(
      "top_artists",
      input.exploration * 40,
      languageReason(metrics.languageSpan),
    ),
    contributor(
      "top_tracks",
      input.genreBreadth * 35,
      genreBreadthReason(input.genreBreadth),
    ),
    contributor(
      "recent_behavior",
      metrics.songFreshness * 15,
      freshnessReason(metrics.songFreshness),
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "explorer",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "新藝人占比", value: formatPercent(metrics.newArtistRatio) },
      { label: "語言跨度", value: `${metrics.languageSpan} 種` },
      { label: "歌曲新鮮度", value: formatPercent(metrics.songFreshness) },
      { label: "Genre entropy", value: metrics.genreEntropy.toFixed(2) },
    ],
  };
}

function buildNostalgiaBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const contributors = [
    contributor(
      "top_artists",
      input.artistOverlap * 45,
      input.artistOverlap >= 0.55 ? "長期名單穩定" : "名單略有變化",
    ),
    contributor(
      "recently_played",
      input.repeatListeningRatio * 35,
      repeatReason(input.repeatListeningRatio),
    ),
    contributor(
      "recent_behavior",
      (1 - input.exploration) * 20,
      input.exploration <= 0.35 ? "口味變化小" : "仍偏熟悉口味",
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "nostalgia",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "名單重疊率", value: formatPercent(input.artistOverlap) },
      { label: "熱門曲重播率", value: formatPercent(input.repeatListeningRatio) },
      { label: "熟悉曲占比", value: formatPercent(1 - metrics.songFreshness) },
      { label: "口味穩定度", value: formatPercent(1 - input.exploration) },
    ],
  };
}

function buildRomanticBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const mainstream = normalize(input.avgTrackPopularity, 25, 85);
  const contributors = [
    contributor(
      "top_artists",
      input.romanticGenreRatio * 55 + input.emotionalGenreRatio * 25,
      ratioReason(
        metrics.romanticGenreRatio,
        "情歌／R&B 標籤多",
        "浪漫曲風適中",
        "浪漫標籤較少",
      ),
    ),
    contributor(
      "top_tracks",
      mainstream * 10,
      mainstreamReason(input.avgTrackPopularity),
    ),
    contributor(
      "genre_profile",
      (1 - input.intenseRatio) * 10,
      ratioReason(
        1 - metrics.intenseGenreRatio,
        "輕柔曲風多",
        "強烈曲風適中",
        "激烈曲風偏多",
      ),
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "romantic",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "浪漫曲風占比", value: formatPercent(metrics.romanticGenreRatio) },
      { label: "情緒曲風占比", value: formatPercent(metrics.emotionalGenreRatio) },
      { label: "曲目熱門度", value: `${Math.round(input.avgTrackPopularity)}` },
      { label: "輕柔曲風占比", value: formatPercent(1 - metrics.intenseGenreRatio) },
    ],
  };
}

function buildSocialBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const artistMainstream = normalize(input.avgArtistPopularity, 35, 90);
  const trackMainstream = normalize(input.avgTrackPopularity, 40, 90);
  const contributors = [
    contributor(
      "top_artists",
      input.partyRatio * 40,
      ratioReason(metrics.partyGenreRatio, "派對舞曲多", "舞曲適中", "舞曲較少"),
    ),
    contributor(
      "top_tracks",
      artistMainstream * 30 + trackMainstream * 15,
      mainstreamReason(input.avgArtistPopularity),
    ),
    contributor(
      "recently_played",
      input.recentArtistDiversity * 15,
      diversityReason(input.recentArtistDiversity),
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "social",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "派對曲風占比", value: formatPercent(metrics.partyGenreRatio) },
      { label: "藝人熱門度", value: `${Math.round(input.avgArtistPopularity)}` },
      { label: "曲目熱門度", value: `${Math.round(input.avgTrackPopularity)}` },
      { label: "近期藝人多樣", value: formatPercent(input.recentArtistDiversity) },
    ],
  };
}

function buildEmotionalBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const contributors = [
    contributor(
      "top_artists",
      input.emotionalGenreRatio * 45 + input.indieRatio * 10,
      ratioReason(
        metrics.emotionalGenreRatio,
        "情緒向曲風多",
        "情緒曲風適中",
        "情緒標籤較少",
      ),
    ),
    contributor(
      "genre_profile",
      input.chillRatio * 30 + (1 - input.partyRatio) * 15,
      ratioReason(metrics.chillGenreRatio, "慢歌／chill 多", "節奏適中", "快歌偏多"),
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "emotional",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "情緒曲風占比", value: formatPercent(metrics.emotionalGenreRatio) },
      { label: "Chill 曲風占比", value: formatPercent(metrics.chillGenreRatio) },
      { label: "獨立曲風占比", value: formatPercent(metrics.indieGenreRatio) },
      { label: "非派對曲占比", value: formatPercent(1 - metrics.partyGenreRatio) },
    ],
  };
}

function buildAdventurousBreakdown(
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const niche = 1 - normalize(input.avgTrackPopularity, 30, 90);
  const contributors = [
    contributor(
      "top_artists",
      input.intenseRatio * 40 + input.indieRatio * 20 + input.exploration * 30,
      ratioReason(
        metrics.intenseGenreRatio + metrics.indieGenreRatio,
        "激烈／獨立曲風多",
        "曲風跨度適中",
        "曲風較保守",
      ),
    ),
    contributor(
      "top_tracks",
      niche * 10,
      niche >= 0.55 ? "偏冷門曲目" : "冷門度適中",
    ),
    contributor(
      "recent_behavior",
      metrics.songFreshness * 12,
      explorationReason(input.exploration),
    ),
  ].filter((item) => item.points > 0);

  return {
    traitKey: "adventurous",
    score,
    trend: scoreTrend(score),
    contributors,
    composition: [
      { label: "激烈曲風占比", value: formatPercent(metrics.intenseGenreRatio) },
      { label: "獨立曲風占比", value: formatPercent(metrics.indieGenreRatio) },
      { label: "新藝人占比", value: formatPercent(metrics.newArtistRatio) },
      { label: "冷門曲偏好", value: formatPercent(niche) },
    ],
  };
}

const BUILDERS: Record<
  PersonalityTraitKey,
  (
    input: PersonalityInput,
    metrics: ListeningMetrics,
    score: number,
  ) => TraitBreakdown
> = {
  explorer: buildExplorerBreakdown,
  nostalgia: buildNostalgiaBreakdown,
  romantic: buildRomanticBreakdown,
  social: buildSocialBreakdown,
  emotional: buildEmotionalBreakdown,
  adventurous: buildAdventurousBreakdown,
};

export function buildTraitBreakdowns(
  input: PersonalityInput,
  traits: PersonalityTraits,
  metrics: ListeningMetrics,
): PersonalityTraitBreakdowns {
  const breakdowns = {} as PersonalityTraitBreakdowns;

  for (const key of PERSONALITY_TRAIT_KEYS) {
    breakdowns[key] = BUILDERS[key](input, metrics, traits[key]);
  }

  return breakdowns;
}
