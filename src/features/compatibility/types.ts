import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export type CompatibilitySessionStatus = "pending" | "ready" | "failed";

export type CompatibilityInput = {
  reportAId: string;
  reportBId: string;
};

export type CompatibilityTraitDelta = {
  key: PersonalityTraitKey;
  label: string;
  emoji: string;
  scoreA: number;
  scoreB: number;
  delta: number;
};

export type CompatibilityResult = {
  sessionId: string;
  score: number;
  summary: string;
  traitDeltas: Record<PersonalityTraitKey, number>;
  traitDetails: CompatibilityTraitDelta[];
  reportAId: string;
  reportBId: string;
};

export interface CompatibilityEngine {
  compare(input: CompatibilityInput): Promise<CompatibilityResult>;
}
