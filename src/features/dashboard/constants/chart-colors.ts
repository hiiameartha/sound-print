import type { AssessmentDimensionKey } from "@/types/assessment";

export const DIMENSION_CHART_COLORS: Record<AssessmentDimensionKey, string> = {
  health: "#10b981",
  wealth: "#f59e0b",
  work: "#0ea5e9",
  social: "#8b5cf6",
  entertainment: "#ec4899",
  growth: "#06b6d4",
};

export const CHART_PALETTE = {
  primary: "#06b6d4",
  primaryFill: "rgba(6, 182, 212, 0.18)",
  secondary: "#8b5cf6",
  secondaryFill: "rgba(139, 92, 246, 0.12)",
} as const;
