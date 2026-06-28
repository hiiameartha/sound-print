import type { ListeningMetrics } from "@/features/personality/engine/utils/listening-metrics";
import { formatPercent } from "@/features/personality/engine/utils/listening-metrics";
import {
  sourceContributionPoints,
  TRAIT_SIGNAL_LABELS,
  TRAIT_SOURCE_WEIGHTS,
  type TraitSignalSource,
} from "@/features/personality/engine/utils/trait-signals";
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
import type { TraitEvidenceSource } from "@/features/personality/types/trait-breakdown";
import { TRAIT_EVIDENCE_SOURCE_LABELS } from "@/features/personality/types/trait-breakdown";

const SOURCE_TO_EVIDENCE: Record<TraitSignalSource, TraitEvidenceSource> = {
  recent: "recently_played",
  topArtists: "top_artists",
  topTracks: "top_tracks",
  stability: "stability",
};

const SOURCE_REASONS: Record<
  PersonalityTraitKey,
  Record<TraitSignalSource, (signal: number) => string>
> = {
  romantic: {
    recent: (signal) =>
      signal >= 0.65 ? "近期曲目偏正向愉悅" : signal >= 0.4 ? "情緒基調適中" : "近期曲目偏沉靜",
    topArtists: (signal) =>
      signal >= 0.65 ? "代表藝人曲風偏浪漫" : signal >= 0.4 ? "藝人曲調適中" : "藝人曲調偏冷",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲 valence 偏高" : signal >= 0.4 ? "熱門曲情緒均衡" : "熱門曲偏低 valence",
    stability: (signal) =>
      signal >= 0.65 ? "長期偏好愉悅曲調" : signal >= 0.4 ? "長期曲調穩定" : "長期曲調偏沉",
  },
  explorer: {
    recent: (signal) =>
      signal >= 0.65 ? "近期曲風分散" : signal >= 0.4 ? "近期曲風適中" : "近期曲風集中",
    topArtists: (signal) =>
      signal >= 0.65 ? "Top 藝人曲風多元" : signal >= 0.4 ? "藝人曲風跨度適中" : "藝人曲風單一",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲曲風分散" : signal >= 0.4 ? "熱門曲風適中" : "熱門曲風集中",
    stability: (signal) =>
      signal >= 0.65 ? "長期曲風持續多元" : signal >= 0.4 ? "長期曲風適中" : "長期曲風穩定",
  },
  social: {
    recent: (signal) =>
      signal >= 0.65 ? "近期藝人偏主流" : signal >= 0.4 ? "主流小眾混搭" : "近期藝人偏小眾",
    topArtists: (signal) =>
      signal >= 0.65 ? "Top 藝人熱門度高" : signal >= 0.4 ? "藝人熱門度適中" : "Top 藝人偏冷門",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲藝人主流" : signal >= 0.4 ? "曲目熱門度適中" : "熱門曲偏小眾",
    stability: (signal) =>
      signal >= 0.65 ? "長期偏好主流藝人" : signal >= 0.4 ? "長期熱門度適中" : "長期偏小眾",
  },
  emotional: {
    recent: (signal) =>
      signal >= 0.65 ? "近期曲目能量高" : signal >= 0.4 ? "近期能量適中" : "近期曲目偏慢",
    topArtists: (signal) =>
      signal >= 0.65 ? "代表藝人曲風激昂" : signal >= 0.4 ? "藝人能量適中" : "藝人曲風偏柔",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲 energy 偏高" : signal >= 0.4 ? "熱門曲能量適中" : "熱門曲偏 chill",
    stability: (signal) =>
      signal >= 0.65 ? "長期偏好高能量" : signal >= 0.4 ? "長期能量穩定" : "長期偏低能量",
  },
  nostalgia: {
    recent: (signal) =>
      signal >= 0.65 ? "近期常聽舊歌" : signal >= 0.4 ? "新舊曲混搭" : "近期偏新發行",
    topArtists: (signal) =>
      signal >= 0.65 ? "代表藝人作品偏經典" : signal >= 0.4 ? "作品年代適中" : "代表藝人偏新",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲發行較早" : signal >= 0.4 ? "曲目年代適中" : "熱門曲偏新",
    stability: (signal) =>
      signal >= 0.65 ? "口味長期穩定" : signal >= 0.4 ? "穩定度適中" : "口味變化較大",
  },
  adventurous: {
    recent: (signal) =>
      signal >= 0.65 ? "近期探索新曲多" : signal >= 0.4 ? "新舊探索混搭" : "近期偏熟悉曲目",
    topArtists: (signal) =>
      signal >= 0.65 ? "Top 名單變化大" : signal >= 0.4 ? "藝人組合更新中" : "Top 藝人穩定",
    topTracks: (signal) =>
      signal >= 0.65 ? "熱門曲偏小眾" : signal >= 0.4 ? "冷門度適中" : "熱門曲偏主流",
    stability: (signal) =>
      signal >= 0.65 ? "較少重複播放" : signal >= 0.4 ? "重複率適中" : "重複播放多",
  },
};

function scoreTrend(score: number): TraitScoreTrend {
  if (score >= 60) return "high";
  if (score <= 40) return "low";
  return "mid";
}

function contributor(
  source: TraitEvidenceSource,
  points: number,
  reason: string,
): TraitContributor {
  return {
    source,
    points: Math.max(0, points),
    reason,
  };
}

function formatSignalValue(traitKey: PersonalityTraitKey, signal: number): string {
  if (traitKey === "social") {
    return `${Math.round(signal * 100)}`;
  }
  return signal.toFixed(2);
}

function buildTraitBreakdown(
  traitKey: PersonalityTraitKey,
  input: PersonalityInput,
  metrics: ListeningMetrics,
  score: number,
): TraitBreakdown {
  const signals = input.traitSignals[traitKey];
  const sources = Object.keys(TRAIT_SOURCE_WEIGHTS) as TraitSignalSource[];

  const contributors = sources
    .map((source) => {
      const signal = signals[source];
      const points = sourceContributionPoints(source, signal);
      if (points <= 0) return null;

      return contributor(
        SOURCE_TO_EVIDENCE[source],
        points,
        SOURCE_REASONS[traitKey][source](signal),
      );
    })
    .filter((item): item is TraitContributor => item !== null);

  const composition = sources.map((source) => ({
    label: `${TRAIT_EVIDENCE_SOURCE_LABELS[SOURCE_TO_EVIDENCE[source]]} (${Math.round(TRAIT_SOURCE_WEIGHTS[source] * 100)}%)`,
    value: formatSignalValue(traitKey, signals[source]),
  }));

  composition.push({
    label: TRAIT_SIGNAL_LABELS[traitKey],
    value:
      traitKey === "explorer"
        ? metrics.genreEntropy.toFixed(2)
        : traitKey === "adventurous"
          ? formatPercent(metrics.newArtistRatio)
          : traitKey === "nostalgia"
            ? formatPercent(input.artistOverlap)
            : formatSignalValue(traitKey, score / 100),
  });

  return {
    traitKey,
    score,
    trend: scoreTrend(score),
    contributors,
    composition,
  };
}

export function buildTraitBreakdowns(
  input: PersonalityInput,
  traits: PersonalityTraits,
  metrics: ListeningMetrics,
): PersonalityTraitBreakdowns {
  const breakdowns = {} as PersonalityTraitBreakdowns;

  for (const key of PERSONALITY_TRAIT_KEYS) {
    breakdowns[key] = buildTraitBreakdown(key, input, metrics, traits[key]);
  }

  return breakdowns;
}
