import type { ArchetypeMatch } from "@/features/personality/types/archetype";
import type { PersonalityTraits } from "@/features/personality/types/traits";

export type PersonalityHighlights = {
  displayName: string;
  topArtist: string | null;
  genreCount: number;
  trackSampleSize: number;
};

export type PersonalitySignalEnrichment = {
  source: "ai";
  fields: ("genres" | "popularity")[];
};

export type PersonalityProfile = {
  traits: PersonalityTraits;
  primaryArchetype: ArchetypeMatch;
  secondaryArchetype: ArchetypeMatch;
  highlights: PersonalityHighlights;
  analyzedAt: string;
  engineVersion: string;
  provider: "spotify";
  /** Spotify API 缺欄位時，由 AI 補強的訊號來源 */
  signalEnrichment?: PersonalitySignalEnrichment;
};
