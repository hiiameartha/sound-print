"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DimensionCardsGrid } from "@/features/dashboard/components/DimensionCardsGrid";
import { RadarChartPanel } from "@/features/dashboard/components/RadarChartPanel";
import { TotalScoreCard } from "@/features/dashboard/components/TotalScoreCard";
import { LifeRecordsPanel } from "@/features/life-records";
import { LifeCommentaryPanel } from "@/features/life-commentary";
import { useAssessmentStore } from "@/store/assessment-store";

export function DashboardContent() {
  const router = useRouter();
  const result = useAssessmentStore((state) => state.result);

  useEffect(() => {
    if (!result) {
      router.replace("/assessment");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">
          載入儀表板中…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader completedAt={result.completedAt} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TotalScoreCard result={result} />
        <RadarChartPanel result={result} />
      </div>

      <DimensionCardsGrid result={result} />

      <LifeRecordsPanel />

      <LifeCommentaryPanel result={result} />
    </div>
  );
}
