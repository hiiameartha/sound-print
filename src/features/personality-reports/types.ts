import {
  ARCHETYPE_TITLES,
  type ArchetypeId,
  type ArchetypeMatch,
} from "@/features/personality/types/archetype";
import type {
  PersonalityHighlights,
  PersonalityProfile,
} from "@/features/personality/types/personality-profile";
import type { PersonalityTraitBreakdowns } from "@/features/personality/types/trait-breakdown";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export type SpotifySnapshot = {
  highlights: PersonalityHighlights;
  primaryArchetype: ArchetypeMatch;
  secondaryArchetype: ArchetypeMatch;
  engineVersion: string;
  provider: "spotify";
  analyzedAt: string;
  traitBreakdowns?: PersonalityTraitBreakdowns;
  signalEnrichment?: PersonalityProfile["signalEnrichment"];
};

export type PersonalityReportRow = {
  id: string;
  user_id: string;
  primary_archetype: string;
  secondary_archetype: string;
  romantic: number;
  social: number;
  nostalgia: number;
  explorer: number;
  emotional: number;
  adventurous: number;
  spotify_snapshot: SpotifySnapshot | null;
  humorous_commentary: string | null;
  yearly_title: string | null;
  created_at: string;
};

export type PersonalityReportInsert = {
  user_id: string;
  primary_archetype: string;
  secondary_archetype: string;
  romantic: number;
  social: number;
  nostalgia: number;
  explorer: number;
  emotional: number;
  adventurous: number;
  spotify_snapshot: SpotifySnapshot;
  humorous_commentary?: string | null;
  yearly_title?: string | null;
  created_at?: string;
};

export type PersonalityReport = {
  id: string;
  userId: string;
  profile: PersonalityProfile;
  commentary: PersonalityCommentary | null;
  createdAt: string;
};

export function profileToInsert(
  userId: string,
  profile: PersonalityProfile,
  commentary?: PersonalityCommentary | null,
): PersonalityReportInsert {
  return {
    user_id: userId,
    primary_archetype: profile.primaryArchetype.id,
    secondary_archetype: profile.secondaryArchetype.id,
    romantic: profile.traits.romantic,
    social: profile.traits.social,
    nostalgia: profile.traits.nostalgia,
    explorer: profile.traits.explorer,
    emotional: profile.traits.emotional,
    adventurous: profile.traits.adventurous,
    spotify_snapshot: {
      highlights: profile.highlights,
      primaryArchetype: profile.primaryArchetype,
      secondaryArchetype: profile.secondaryArchetype,
      engineVersion: profile.engineVersion,
      provider: profile.provider,
      analyzedAt: profile.analyzedAt,
      traitBreakdowns: profile.traitBreakdowns,
      signalEnrichment: profile.signalEnrichment,
    },
    humorous_commentary: commentary?.humorousCommentary ?? null,
    yearly_title: commentary?.yearlyTitle ?? null,
    created_at: profile.analyzedAt,
  };
}

export function rowToPersonalityReport(row: PersonalityReportRow): PersonalityReport {
  const snapshot = row.spotify_snapshot;

  const profile: PersonalityProfile = snapshot
    ? {
        traits: {
          romantic: row.romantic,
          social: row.social,
          nostalgia: row.nostalgia,
          explorer: row.explorer,
          emotional: row.emotional,
          adventurous: row.adventurous,
        },
        primaryArchetype: snapshot.primaryArchetype,
        secondaryArchetype: snapshot.secondaryArchetype,
        highlights: snapshot.highlights,
        analyzedAt: snapshot.analyzedAt,
        engineVersion: snapshot.engineVersion,
        provider: snapshot.provider,
        traitBreakdowns: snapshot.traitBreakdowns,
        signalEnrichment: snapshot.signalEnrichment,
      }
    : buildProfileFromRowOnly(row);

  const commentary =
    row.humorous_commentary && row.yearly_title
      ? {
          humorousCommentary: row.humorous_commentary,
          yearlyTitle: row.yearly_title,
        }
      : null;

  return {
    id: row.id,
    userId: row.user_id,
    profile,
    commentary,
    createdAt: row.created_at,
  };
}

function archetypeFromId(id: string): ArchetypeMatch {
  const archetypeId = id as ArchetypeId;
  return {
    id: archetypeId,
    title: ARCHETYPE_TITLES[archetypeId] ?? id,
    score: 0,
  };
}

function buildProfileFromRowOnly(row: PersonalityReportRow): PersonalityProfile {
  const traits: PersonalityTraits = {
    romantic: row.romantic,
    social: row.social,
    nostalgia: row.nostalgia,
    explorer: row.explorer,
    emotional: row.emotional,
    adventurous: row.adventurous,
  };

  return {
    traits,
    primaryArchetype: archetypeFromId(row.primary_archetype),
    secondaryArchetype: archetypeFromId(row.secondary_archetype),
    highlights: {
      displayName: "Spotify 使用者",
      topArtist: null,
      genreCount: 0,
      trackSampleSize: 0,
    },
    analyzedAt: row.created_at,
    engineVersion: "unknown",
    provider: "spotify",
  };
}
