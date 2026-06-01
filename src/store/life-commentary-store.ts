import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LifeCommentary } from "@/types/life-commentary";

type LifeCommentaryState = {
  commentary: LifeCommentary | null;
  /** 對應 assessment result 的 completedAt，用於快取是否仍有效 */
  sourceCompletedAt: string | null;
  setCommentary: (commentary: LifeCommentary, sourceCompletedAt: string) => void;
  clearCommentary: () => void;
};

export const useLifeCommentaryStore = create<LifeCommentaryState>()(
  persist(
    (set) => ({
      commentary: null,
      sourceCompletedAt: null,
      setCommentary: (commentary, sourceCompletedAt) =>
        set({ commentary, sourceCompletedAt }),
      clearCommentary: () =>
        set({ commentary: null, sourceCompletedAt: null }),
    }),
    { name: "life-exe-commentary" },
  ),
);
