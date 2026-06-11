import { spotifyToPersonalityInput } from "@/features/personality/engine/adapters/spotify-to-personality-input";
import { buildListeningInsights } from "@/features/personality/engine/build-listening-insights";
import { buildTraitBreakdowns } from "@/features/personality/engine/build-trait-breakdowns";
import { computeListeningMetrics } from "@/features/personality/engine/utils/listening-metrics";
import {
  buildListeningSignalsPromptContext,
  mergeInferredListeningSignals,
  needsListeningSignalEnrichment,
  type SignalEnrichmentFields,
} from "@/features/personality/engine/adapters/enrich-personality-input";
import {
  analyzePersonalityFromInput,
  type PersonalityAnalysisResult,
} from "@/features/personality/engine/personality-engine";
import { inferListeningSignals } from "@/features/personality/services/infer-listening-signals";
import type { SpotifyListeningData } from "@/lib/spotify/api";
import { isOpenAIConfigured } from "@/services/openai-client";

export async function analyzeSpotifyPersonality(
  listening: SpotifyListeningData,
): Promise<PersonalityAnalysisResult> {
  let input = spotifyToPersonalityInput(listening);
  const { needed, fields } = needsListeningSignalEnrichment(input);
  let enrichedFields: SignalEnrichmentFields[] = [];

  if (needed && isOpenAIConfigured()) {
    try {
      const context = buildListeningSignalsPromptContext(listening);
      const inferred = await inferListeningSignals(context);
      input = mergeInferredListeningSignals(input, inferred, fields);
      enrichedFields = fields.filter((field) => {
        if (field === "genres") return input.genreCount > 0;
        if (field === "popularity") {
          return input.avgTrackPopularity > 0 || input.avgArtistPopularity > 0;
        }
        return false;
      });

      if (process.env.NODE_ENV === "development") {
        console.log("[personality:ai-enrich] inferred", inferred);
        console.log("[personality:ai-enrich] enrichedFields", enrichedFields);
      }
    } catch (err) {
      console.error("[personality:ai-enrich]", err);
    }
  } else if (needed && process.env.NODE_ENV === "development") {
    console.log(
      "[personality:ai-enrich] skipped — OPENAI_API_KEY 未設定或無需補強",
      { needed, fields },
    );
  }

  const profile = analyzePersonalityFromInput(input);
  const metrics = computeListeningMetrics(listening);
  const traitBreakdowns = buildTraitBreakdowns(input, profile.traits, metrics);
  const insights = buildListeningInsights(listening, input, metrics);

  const withBreakdowns = {
    ...profile,
    traitBreakdowns,
    insights,
    ...(enrichedFields.length > 0
      ? { signalEnrichment: { source: "ai" as const, fields: enrichedFields } }
      : {}),
  };

  return { profile: withBreakdowns };
}
