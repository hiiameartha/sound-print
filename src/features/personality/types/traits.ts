export const PERSONALITY_TRAIT_KEYS = [
  "romantic",
  "social",
  "nostalgia",
  "explorer",
  "emotional",
  "adventurous",
] as const;

export type PersonalityTraitKey = (typeof PERSONALITY_TRAIT_KEYS)[number];

export type PersonalityTraits = Record<PersonalityTraitKey, number>;

export const PERSONALITY_TRAIT_LABELS: Record<PersonalityTraitKey, string> = {
  romantic: "浪漫值",
  social: "社交值",
  nostalgia: "念舊值",
  explorer: "探索值",
  emotional: "情緒值",
  adventurous: "冒險值",
};
