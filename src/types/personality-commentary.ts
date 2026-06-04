import type { PersonalityProfile } from "@/features/personality/types/personality-profile";

export type PersonalityCommentary = {
  humorousCommentary: string;
  toxicCommentary: string;
  yearlyTitle: string;
};

export type PersonalityCommentaryApiResponse = {
  data: PersonalityCommentary;
};

export type PersonalityCommentaryApiError = {
  error: string;
};

export type PersonalityCommentaryRequest = PersonalityProfile;
