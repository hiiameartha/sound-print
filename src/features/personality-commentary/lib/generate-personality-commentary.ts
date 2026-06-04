import {
  buildPersonalityCommentaryUserPrompt,
  PERSONALITY_COMMENTARY_SYSTEM_PROMPT,
} from "@/features/personality-commentary/prompts/personality-commentary-prompt";
import { personalityCommentaryResponseSchema } from "@/features/personality-commentary/schemas/personality-commentary-schema";
import { getOpenAIClient, getOpenAIModel } from "@/services/openai-client";
import type { PersonalityCommentary } from "@/types/personality-commentary";
import type { PersonalityCommentaryRequestPayload } from "@/features/personality-commentary/schemas/personality-commentary-schema";

export async function generatePersonalityCommentary(
  profile: PersonalityCommentaryRequestPayload,
): Promise<PersonalityCommentary> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PERSONALITY_COMMENTARY_SYSTEM_PROMPT },
      { role: "user", content: buildPersonalityCommentaryUserPrompt(profile) },
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

  return personalityCommentaryResponseSchema.parse(parsed);
}
