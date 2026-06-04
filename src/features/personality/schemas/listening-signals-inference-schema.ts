import { z } from "zod";

export const listeningSignalsInferenceSchema = z.object({
  genres: z.array(z.string().min(1).max(80)).min(1).max(24),
  avgArtistPopularity: z.number().min(0).max(100),
  avgTrackPopularity: z.number().min(0).max(100),
});

export type ListeningSignalsInference = z.infer<
  typeof listeningSignalsInferenceSchema
>;
