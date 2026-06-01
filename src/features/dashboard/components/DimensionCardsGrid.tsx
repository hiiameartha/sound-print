"use client";

import { ASSESSMENT_DIMENSIONS } from "@/features/assessment/constants/dimensions";
import { DimensionCard } from "@/features/dashboard/components/DimensionCard";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { AssessmentResult } from "@/types/assessment";

type DimensionCardsGridProps = {
  result: AssessmentResult;
};

export function DimensionCardsGrid({ result }: DimensionCardsGridProps) {
  return (
    <DashboardCard
      title="六大維度"
      subtitle="各生活面向即時評分"
      className="lg:col-span-2"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ASSESSMENT_DIMENSIONS.map((dimension, index) => (
          <DimensionCard
            key={dimension.key}
            dimension={dimension}
            score={result[dimension.key]}
            index={index}
          />
        ))}
      </div>
    </DashboardCard>
  );
}
