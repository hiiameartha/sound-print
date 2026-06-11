import { z } from "zod";
import { ARCHETYPE_IDS } from "@/features/personality/types/archetype";

const traitScore = z.number().int().min(0).max(100);

const traitsSchema = z.object({
  romantic: traitScore,
  social: traitScore,
  nostalgia: traitScore,
  explorer: traitScore,
  emotional: traitScore,
  adventurous: traitScore,
});

const archetypeMatchSchema = z.object({
  id: z.enum(ARCHETYPE_IDS),
  title: z.string(),
  score: z.number().min(0).max(100),
});

export const personalityCommentaryRequestSchema = z.object({
  traits: traitsSchema,
  primaryArchetype: archetypeMatchSchema,
  secondaryArchetype: archetypeMatchSchema,
  highlights: z.object({
    displayName: z.string(),
    topArtist: z.string().nullable(),
    genreCount: z.number(),
    trackSampleSize: z.number(),
  }),
  analyzedAt: z.string(),
  engineVersion: z.string(),
  provider: z.literal("spotify"),
});

export const personalityCommentaryResponseSchema = z.object({
  humorousCommentary: z.string().min(10).max(600),
  yearlyTitle: z.string().min(2).max(40),
});

export type PersonalityCommentaryRequestPayload = z.infer<
  typeof personalityCommentaryRequestSchema
>;
