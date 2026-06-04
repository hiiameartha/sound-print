import type { ArchetypeMatch } from "@/features/personality/types/archetype";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export type ShareCardRadarPoint = {
  key: PersonalityTraitKey;
  label: string;
  emoji: string;
  score: number;
  color: string;
};

export type ShareCardData = {
  analyzedAt: string;
  displayName: string;
  primaryArchetype: ArchetypeMatch;
  secondaryArchetype: ArchetypeMatch;
  primaryShortName: string;
  yearlyTitle: string;
  humorousCommentary: string | null;
  toxicCommentary: string | null;
  hasAiCommentary: boolean;
  radar: ShareCardRadarPoint[];
  accent: string;
};
