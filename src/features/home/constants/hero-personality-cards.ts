import type { ArchetypeId } from "@/features/personality/types/archetype";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";
import { TRAIT_CHART_COLORS } from "@/features/share/constants/trait-colors";
import { ARCHETYPE_ACCENTS } from "@/features/share/constants/trait-colors";

export type HeroPersonalityCard = {
  id: string;
  archetypeId: ArchetypeId;
  primaryTitle: string;
  secondaryTitle: string;
  highlightTraits: {
    key: PersonalityTraitKey;
    label: string;
    emoji: string;
    value: number;
  }[];
};

export const HERO_PERSONALITY_CARDS: HeroPersonalityCard[] = [
  {
    id: "midnight-philosopher",
    archetypeId: "midnight-philosopher",
    primaryTitle: "凌晨哲學家",
    secondaryTitle: "情緒 DJ",
    highlightTraits: [
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 88 },
      { key: "nostalgia", label: "懷舊值", emoji: "📼", value: 76 },
      { key: "romantic", label: "浪漫值", emoji: "❤️", value: 71 },
      { key: "explorer", label: "探索值", emoji: "🚀", value: 38 },
    ],
  },
  {
    id: "hopeless-romantic",
    archetypeId: "hopeless-romantic",
    primaryTitle: "浪漫主義者",
    secondaryTitle: "單曲循環患者",
    highlightTraits: [
      { key: "romantic", label: "浪漫值", emoji: "❤️", value: 92 },
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 85 },
      { key: "nostalgia", label: "懷舊值", emoji: "📼", value: 68 },
      { key: "social", label: "社交值", emoji: "🎉", value: 54 },
    ],
  },
  {
    id: "kpop-ambassador",
    archetypeId: "kpop-ambassador",
    primaryTitle: "KPOP 外交官",
    secondaryTitle: "情緒 DJ",
    highlightTraits: [
      { key: "social", label: "社交值", emoji: "🎉", value: 89 },
      { key: "adventurous", label: "冒險值", emoji: "🗺️", value: 74 },
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 67 },
      { key: "explorer", label: "探索值", emoji: "🚀", value: 61 },
    ],
  },
  {
    id: "indie-wanderer",
    archetypeId: "indie-wanderer",
    primaryTitle: "獨立音樂旅人",
    secondaryTitle: "凌晨哲學家",
    highlightTraits: [
      { key: "explorer", label: "探索值", emoji: "🚀", value: 86 },
      { key: "adventurous", label: "冒險值", emoji: "🗺️", value: 79 },
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 72 },
      { key: "romantic", label: "浪漫值", emoji: "❤️", value: 48 },
    ],
  },
  {
    id: "mood-dj",
    archetypeId: "mood-dj",
    primaryTitle: "情緒 DJ",
    secondaryTitle: "KPOP 外交官",
    highlightTraits: [
      { key: "social", label: "社交值", emoji: "🎉", value: 83 },
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 77 },
      { key: "adventurous", label: "冒險值", emoji: "🗺️", value: 65 },
      { key: "explorer", label: "探索值", emoji: "🚀", value: 58 },
    ],
  },
  {
    id: "song-repeater",
    archetypeId: "song-repeater",
    primaryTitle: "單曲循環患者",
    secondaryTitle: "浪漫主義者",
    highlightTraits: [
      { key: "nostalgia", label: "懷舊值", emoji: "📼", value: 94 },
      { key: "romantic", label: "浪漫值", emoji: "❤️", value: 81 },
      { key: "emotional", label: "情緒值", emoji: "🌙", value: 69 },
      { key: "explorer", label: "探索值", emoji: "🚀", value: 29 },
    ],
  },
];

export function getHeroCardAccent(archetypeId: ArchetypeId): string {
  return ARCHETYPE_ACCENTS[archetypeId] ?? TRAIT_CHART_COLORS.emotional;
}
