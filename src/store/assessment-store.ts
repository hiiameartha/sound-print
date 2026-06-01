import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentResult } from "@/types/assessment";

type AssessmentState = {
  result: AssessmentResult | null;
  setResult: (result: AssessmentResult) => void;
  clearResult: () => void;
  hasCompleted: () => boolean;
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      result: null,
      setResult: (result) => set({ result }),
      clearResult: () => set({ result: null }),
      hasCompleted: () => get().result !== null,
    }),
    {
      name: "life-exe-assessment",
    },
  ),
);
