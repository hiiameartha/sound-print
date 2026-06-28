export type InsightObservationCategory = "habit" | "recent" | "mood";

export const INSIGHT_CATEGORY_LABELS: Record<
  InsightObservationCategory,
  string
> = {
  habit: "你有",
  recent: "最近",
  mood: "情緒",
};

export type InsightObservation = {
  category: InsightObservationCategory;
  headline: string;
};

export type ListeningInference = {
  summary: string;
  possibleReasons: string[];
};

export type ListeningInsights = {
  observations: InsightObservation[];
  inference: ListeningInference;
};
