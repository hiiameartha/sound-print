import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export type TraitEvidenceSource =
  | "recently_played"
  | "top_artists"
  | "top_tracks"
  | "stability"
  | "recent_behavior"
  | "genre_profile";

export const TRAIT_EVIDENCE_SOURCE_LABELS: Record<TraitEvidenceSource, string> = {
  recently_played: "最近播放",
  top_artists: "Top Artists",
  top_tracks: "Top Tracks",
  stability: "長期穩定度",
  recent_behavior: "近期行為",
  genre_profile: "曲風分布",
};

export type TraitContributor = {
  source: TraitEvidenceSource;
  points: number;
  reason: string;
};

export type TraitCompositionMetric = {
  label: string;
  value: string;
};

export type TraitScoreTrend = "high" | "mid" | "low";

export type TraitBreakdown = {
  traitKey: PersonalityTraitKey;
  score: number;
  trend: TraitScoreTrend;
  contributors: TraitContributor[];
  composition: TraitCompositionMetric[];
};

export type PersonalityTraitBreakdowns = Record<
  PersonalityTraitKey,
  TraitBreakdown
>;
