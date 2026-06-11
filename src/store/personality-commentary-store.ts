import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersonalityCommentary } from "@/types/personality-commentary";

type PersonalityCommentaryState = {
  commentary: PersonalityCommentary | null;
  sourceAnalyzedAt: string | null;
  setCommentary: (
    commentary: PersonalityCommentary,
    sourceAnalyzedAt: string,
  ) => void;
  clearCommentary: () => void;
};

export const usePersonalityCommentaryStore = create<PersonalityCommentaryState>()(
  persist(
    (set) => ({
      commentary: null,
      sourceAnalyzedAt: null,
      setCommentary: (commentary, sourceAnalyzedAt) =>
        set({ commentary, sourceAnalyzedAt }),
      clearCommentary: () =>
        set({ commentary: null, sourceAnalyzedAt: null }),
    }),
    { name: "sound-print-personality-commentary" },
  ),
);
