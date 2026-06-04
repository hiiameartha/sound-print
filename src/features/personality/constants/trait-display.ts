import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export type TraitDisplay = {
  key: PersonalityTraitKey;
  label: string;
  emoji: string;
};

/** 對外展示用（分享卡、文案），不使用技術 key 名稱 */
export const TRAIT_DISPLAY: TraitDisplay[] = [
  { key: "romantic", label: "浪漫值", emoji: "❤️" },
  { key: "social", label: "社交值", emoji: "🎉" },
  { key: "nostalgia", label: "懷舊值", emoji: "📼" },
  { key: "explorer", label: "探索值", emoji: "🚀" },
  { key: "emotional", label: "情緒值", emoji: "🌙" },
  { key: "adventurous", label: "冒險值", emoji: "🗺️" },
];

export function formatTraitLine(
  key: PersonalityTraitKey,
  score: number,
): string {
  const display = TRAIT_DISPLAY.find((d) => d.key === key);
  if (!display) return `${score}`;
  return `${display.label} ${display.emoji} ${score}`;
}

export function formatTraitShareLine(
  key: PersonalityTraitKey,
  score: number,
): string {
  const display = TRAIT_DISPLAY.find((d) => d.key === key);
  if (!display) return `${score}`;
  return `${display.emoji} ${display.label} ${score}`;
}
