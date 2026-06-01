import {
  buildLifeCommentaryUserPrompt,
  LIFE_COMMENTARY_SYSTEM_PROMPT,
} from "@/features/life-commentary/prompts/life-commentary-prompt";
import { lifeCommentaryResponseSchema } from "@/features/life-commentary/schemas/life-commentary-schema";
import { getOpenAIClient, getOpenAIModel } from "@/services/openai-client";
import type { LifeCommentary, LifeCommentaryInput } from "@/types/life-commentary";

export async function generateLifeCommentary(
  scores: LifeCommentaryInput,
): Promise<LifeCommentary> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: LIFE_COMMENTARY_SYSTEM_PROMPT },
      { role: "user", content: buildLifeCommentaryUserPrompt(scores) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI 未回傳內容");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI 回傳格式無法解析為 JSON");
  }

  return lifeCommentaryResponseSchema.parse(parsed);
}
