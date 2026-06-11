"use client";

import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { PersonalityRadarPlot } from "@/features/dashboard/components/PersonalityRadarPlot";
import type { PersonalityTraits } from "@/features/personality/types/traits";

type PersonalityRadarChartProps = {
  traits: PersonalityTraits;
  title?: string;
  subtitle?: string;
};

export function PersonalityRadarChart({
  traits,
  title = "人格雷達",
  subtitle = "輔助參考 · 0–100",
}: PersonalityRadarChartProps) {
  return (
    <DashboardCard title={title} subtitle={subtitle}>
      <PersonalityRadarPlot
        traits={traits}
        label="人格特質"
        showBaseline
        heightClassName="h-80 lg:h-[420px]"
      />
    </DashboardCard>
  );
}
