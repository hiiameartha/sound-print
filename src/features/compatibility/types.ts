import type { PersonalityTraitKey } from "@/features/personality/types/traits";

export type CompatibilitySessionStatus = "pending" | "ready" | "failed";

export type CompatibilityInput = {
  reportAId: string;
  reportBId: string;
};

export type CompatibilityDimensionKey =
  | "musicOverlap"
  | "personalityComplement"
  | "emotionalSync";

export type CompatibilityDimension = {
  key: CompatibilityDimensionKey;
  label: string;
  score: number;
  hint?: string;
};

export type CompatibilityScenarioKey = "travel" | "work" | "karaoke";

export type CompatibilityScenarioLevel = "strong" | "good" | "okay" | "weak";

export type CompatibilityScenario = {
  key: CompatibilityScenarioKey;
  label: string;
  score: number;
  level: CompatibilityScenarioLevel;
  verdict: string;
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
  dimensions: CompatibilityDimension[];
  scenarios: CompatibilityScenario[];
  traitDeltas: Record<PersonalityTraitKey, number>;
  traitDetails: CompatibilityTraitDelta[];
  reportAId: string;
  reportBId: string;
  labelA: string;
  labelB: string;
};

export interface CompatibilityEngine {
  compare(input: CompatibilityInput): Promise<CompatibilityResult>;
}
