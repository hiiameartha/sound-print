import { z } from "zod";
import { assessmentSchema } from "@/features/assessment/schemas/assessment-schema";

/** POST /api/life-commentary 請求 body */
export const lifeCommentaryRequestSchema = assessmentSchema;

export type LifeCommentaryRequest = z.infer<typeof lifeCommentaryRequestSchema>;

/** OpenAI JSON 回傳結構 */
export const lifeCommentaryResponseSchema = z.object({
  humorousAnalysis: z
    .string()
    .min(10, "幽默分析過短")
    .max(500, "幽默分析過長"),
  encouragement: z
    .string()
    .min(10, "鼓勵建議過短")
    .max(500, "鼓勵建議過長"),
  title: z.string().min(2, "稱號過短").max(30, "稱號過長"),
});

export type LifeCommentaryResponsePayload = z.infer<
  typeof lifeCommentaryResponseSchema
>;
