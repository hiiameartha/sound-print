"use client";

import { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { ASSESSMENT_DIMENSIONS } from "@/features/assessment/constants/dimensions";
import { CHART_PALETTE } from "@/features/dashboard/constants/chart-colors";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { useChartTheme } from "@/features/dashboard/hooks/useChartTheme";
import { ensureChartsRegistered } from "@/features/dashboard/lib/chart-setup";
import type { AssessmentResult } from "@/types/assessment";

ensureChartsRegistered();

type RadarChartPanelProps = {
  result: AssessmentResult;
};

export function RadarChartPanel({ result }: RadarChartPanelProps) {
  const theme = useChartTheme();

  const chartData = useMemo(
    () => ({
      labels: ASSESSMENT_DIMENSIONS.map((d) => d.label),
      datasets: [
        {
          label: "目前評分",
          data: ASSESSMENT_DIMENSIONS.map((d) => result[d.key]),
          backgroundColor: CHART_PALETTE.primaryFill,
          borderColor: CHART_PALETTE.primary,
          borderWidth: 2,
          pointBackgroundColor: CHART_PALETTE.primary,
          pointBorderColor: theme.foreground,
          pointHoverBackgroundColor: CHART_PALETTE.secondary,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "基準線 (7)",
          data: ASSESSMENT_DIMENSIONS.map(() => 7),
          backgroundColor: CHART_PALETTE.secondaryFill,
          borderColor: CHART_PALETTE.secondary,
          borderWidth: 1,
          borderDash: [6, 4],
          pointRadius: 0,
        },
      ],
    }),
    [result, theme.foreground],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeOutQuart" as const,
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            color: theme.muted,
            backdropColor: "transparent",
            font: { family: "var(--font-geist-mono), monospace", size: 10 },
          },
          grid: { color: theme.grid },
          angleLines: { color: theme.grid },
          pointLabels: {
            color: theme.foreground,
            font: { size: 12, weight: 500 as const },
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: theme.muted,
            usePointStyle: true,
            padding: 16,
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          titleColor: theme.foreground,
          bodyColor: theme.muted,
          padding: 12,
          cornerRadius: 12,
        },
      },
    }),
    [theme],
  );

  if (!theme.mounted) {
    return (
      <DashboardCard title="雷達圖" subtitle="六大維度平衡視覺化">
        <div className="flex h-72 items-center justify-center">
          <p className="font-mono text-xs text-muted-foreground">載入圖表…</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="雷達圖" subtitle="六大維度平衡視覺化">
      <div className="h-72 sm:h-80">
        <Radar data={chartData} options={options} />
      </div>
    </DashboardCard>
  );
}
