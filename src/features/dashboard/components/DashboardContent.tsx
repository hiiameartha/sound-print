"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompatibilityPanel } from "@/features/compatibility";
import {
  buildSpotifyComparePath,
  COMPATIBILITY_COMPARE_PARAM,
} from "@/features/compatibility/lib/build-compatibility-invite-url";
import { PersonalityCommentaryPanel } from "@/features/personality-commentary";
import { PersonalityHeader } from "@/features/dashboard/components/PersonalityHeader";
import { PrimaryArchetypeCard } from "@/features/dashboard/components/PrimaryArchetypeCard";
import { SecondaryArchetypeCard } from "@/features/dashboard/components/SecondaryArchetypeCard";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardInsightsPanel } from "@/features/dashboard/components/DashboardInsightsPanel";
import { SharePanel } from "@/features/share";
import { usePersonalityReportStore } from "@/store/personality-report-store";

function MusicMatchFallback() {
  return (
    <DashboardCard title="與好友的音樂合拍">
      <p className="font-mono text-sm text-muted-foreground">載入音樂合拍…</p>
    </DashboardCard>
  );
}

function DashboardContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendReportId = searchParams.get(COMPATIBILITY_COMPARE_PARAM);
  const profile = usePersonalityReportStore((state) => state.profile);

  useEffect(() => {
    if (profile) return;
    if (friendReportId) {
      router.replace(buildSpotifyComparePath(friendReportId));
      return;
    }
    router.replace("/spotify");
  }, [profile, friendReportId, router]);

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

      <CompatibilityPanel />

      <SharePanel profile={profile} />
    </div>
  );
}

export function DashboardContent() {
  return (
    <Suspense fallback={<MusicMatchFallback />}>
      <DashboardContentInner />
    </Suspense>
  );
}
