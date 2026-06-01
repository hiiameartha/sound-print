import { z } from "zod";

const dimensionScore = z
  .number({ error: "請選擇分數" })
  .int({ error: "分數須為整數" })
  .min(1, { error: "最低為 1 分" })
  .max(10, { error: "最高為 10 分" });

export const assessmentSchema = z.object({
  health: dimensionScore,
  wealth: dimensionScore,
  work: dimensionScore,
  social: dimensionScore,
  entertainment: dimensionScore,
  growth: dimensionScore,
});

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;
