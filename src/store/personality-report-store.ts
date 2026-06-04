import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";

type PersonalityReportState = {
  profile: PersonalityProfile | null;
  reportId: string | null;
  setProfile: (profile: PersonalityProfile, reportId?: string | null) => void;
  clearProfile: () => void;
};

export const usePersonalityReportStore = create<PersonalityReportState>()(
  persist(
    (set) => ({
      profile: null,
      reportId: null,
      setProfile: (profile, reportId = null) =>
        set({ profile, reportId: reportId ?? null }),
      clearProfile: () => set({ profile: null, reportId: null }),
    }),
    { name: "life-is-fine-personality-report" },
  ),
);
