"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PersonalityCommentaryPanel } from "@/features/personality-commentary";
import { PersonalityHeader } from "@/features/dashboard/components/PersonalityHeader";
import { PersonalityRadarChart } from "@/features/dashboard/components/PersonalityRadarChart";
import { PrimaryArchetypeCard } from "@/features/dashboard/components/PrimaryArchetypeCard";
import { SecondaryArchetypeCard } from "@/features/dashboard/components/SecondaryArchetypeCard";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardInsightsPanel } from "@/features/dashboard/components/DashboardInsightsPanel";
import { SharePanel } from "@/features/share";
import { usePersonalityReportStore } from "@/store/personality-report-store";

export function DashboardContent() {
  const router = useRouter();
  const profile = usePersonalityReportStore((state) => state.profile);
  const reportId = usePersonalityReportStore((state) => state.reportId);

  useEffect(() => {
    if (!profile) {
      router.replace("/spotify");
    }
  }, [profile, router]);

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">
          載入人格報告中…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PersonalityHeader
        analyzedAt={profile.analyzedAt}
        displayName={profile.highlights.displayName}
      />

      <div className="flex flex-col gap-6">
        <PrimaryArchetypeCard archetype={profile.primaryArchetype} />
        <SecondaryArchetypeCard archetype={profile.secondaryArchetype} />
        <PersonalityCommentaryPanel profile={profile} />
        <PersonalityRadarChart
          traits={profile.traits}
          title="特質寫照"
          subtitle="六維人格輪廓 · 0–100"
        />
      </div>

      {profile.insights ? (
        <DashboardInsightsPanel insights={profile.insights} />
      ) : (
        <DashboardCard
          title="洞察"
          subtitle="從聆聽習慣拼出的故事"
        >
          <p className="text-sm text-muted-foreground">
            此報告尚無洞察資料。請重新完成 Spotify 檢測以產生音樂觀察與 AI 推論。
          </p>
        </DashboardCard>
      )}

      <SharePanel profile={profile} reportId={reportId} />
    </div>
  );
}
