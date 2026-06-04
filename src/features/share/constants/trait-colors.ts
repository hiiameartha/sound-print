import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export const TRAIT_CHART_COLORS: Record<PersonalityTraitKey, string> = {
  romantic: "#f472b6",
  social: "#a78bfa",
  nostalgia: "#fbbf24",
  explorer: "#22d3ee",
  emotional: "#818cf8",
  adventurous: "#fb7185",
};

export const ARCHETYPE_ACCENTS: Record<string, string> = {
  "midnight-philosopher": "#818cf8",
  "hopeless-romantic": "#f472b6",
  "song-repeater": "#fbbf24",
  "kpop-ambassador": "#22d3ee",
  "indie-wanderer": "#34d399",
  "mood-dj": "#a78bfa",
};

export const DEFAULT_SHARE_ACCENT = "#22d3ee";
