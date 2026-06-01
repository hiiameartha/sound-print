import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentHistory, AssessmentResult } from "@/types/assessment";

const MAX_HISTORY = 12;

type AssessmentState = {
  result: AssessmentResult | null;
  history: AssessmentHistory;
  setResult: (result: AssessmentResult) => void;
  clearResult: () => void;
  hasCompleted: () => boolean;
};

function appendHistory(
  history: AssessmentHistory,
  result: AssessmentResult,
): AssessmentHistory {
  const next = [
    ...history.filter((item) => item.completedAt !== result.completedAt),
    result,
  ];
  return next.slice(-MAX_HISTORY);
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      result: null,
      history: [],
      setResult: (result) =>
        set((state) => ({
          result,
          history: appendHistory(state.history, result),
        })),
      clearResult: () => set({ result: null, history: [] }),
      hasCompleted: () => get().result !== null,
    }),
    {
      name: "life-exe-assessment",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<AssessmentState>;
        if (state.result && (!state.history || state.history.length === 0)) {
          return { ...state, history: [state.result] };
        }
        return state as AssessmentState;
      },
    },
  ),
);
