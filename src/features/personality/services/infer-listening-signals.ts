import {
  buildListeningSignalsInferenceUserPrompt,
  LISTENING_SIGNALS_INFERENCE_SYSTEM_PROMPT,
} from "@/features/personality/prompts/listening-signals-inference-prompt";
import { listeningSignalsInferenceSchema } from "@/features/personality/schemas/listening-signals-inference-schema";
import type { ListeningSignalsInference } from "@/features/personality/schemas/listening-signals-inference-schema";
import type { ListeningSignalsPromptContext } from "@/features/personality/prompts/listening-signals-inference-prompt";
import { getOpenAIClient, getOpenAIModel } from "@/services/openai-client";

export async function inferListeningSignals(
  context: ListeningSignalsPromptContext,
): Promise<ListeningSignalsInference> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: LISTENING_SIGNALS_INFERENCE_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildListeningSignalsInferenceUserPrompt(context),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI 未回傳聆聽訊號推估結果");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI 聆聽訊號推估格式無法解析為 JSON");
  }

  return listeningSignalsInferenceSchema.parse(parsed);
}
