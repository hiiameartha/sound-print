import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import {
  ARCHETYPE_ACCENTS,
  DEFAULT_SHARE_ACCENT,
  TRAIT_CHART_COLORS,
} from "@/features/share/constants/trait-colors";
import type { ShareCardData, ShareCardRadarPoint } from "@/features/share/types";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export function getArchetypeAccent(archetypeId: string): string {
  return ARCHETYPE_ACCENTS[archetypeId] ?? DEFAULT_SHARE_ACCENT;
}

export function buildRadarPoints(
  profile: PersonalityProfile,
): ShareCardRadarPoint[] {
  return TRAIT_DISPLAY.map((display) => ({
    key: display.key,
    label: display.label,
    emoji: display.emoji,
    score: profile.traits[display.key],
    color: TRAIT_CHART_COLORS[display.key],
  }));
}

export function getFallbackYearlyTitle(profile: PersonalityProfile): string {
  const year = new Date(profile.analyzedAt).getFullYear();
  const shortName = profile.primaryArchetype.title.split("（")[0]?.trim();
  return `${year} · ${shortName}的耳朵`;
}

export function buildShareCardDataFromProfile(
  profile: PersonalityProfile,
  commentary?: PersonalityCommentary | null,
): ShareCardData {
  const primaryShort =
    profile.primaryArchetype.title.split("（")[0]?.trim() ??
    profile.primaryArchetype.title;

  return {
    analyzedAt: profile.analyzedAt,
    displayName: profile.highlights.displayName,
    primaryArchetype: profile.primaryArchetype,
    secondaryArchetype: profile.secondaryArchetype,
    primaryShortName: primaryShort,
    yearlyTitle:
      commentary?.yearlyTitle?.trim() || getFallbackYearlyTitle(profile),
    humorousCommentary: commentary?.humorousCommentary ?? null,
    toxicCommentary: commentary?.toxicCommentary ?? null,
    hasAiCommentary: Boolean(commentary),
    radar: buildRadarPoints(profile),
    accent: getArchetypeAccent(profile.primaryArchetype.id),
  };
}
