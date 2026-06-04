import { buildShareCardDataFromProfile } from "@/features/share/lib/share-card-content";
import type { ShareCardData } from "@/features/share/types";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export function buildShareCardData(
  profile: PersonalityProfile,
  commentary?: PersonalityCommentary | null,
): ShareCardData {
  return buildShareCardDataFromProfile(profile, commentary);
}
