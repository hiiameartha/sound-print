"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { CHART_PALETTE } from "@/features/dashboard/constants/chart-colors";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { useChartTheme } from "@/features/dashboard/hooks/useChartTheme";
import { ensureChartsRegistered } from "@/features/dashboard/lib/chart-setup";
import { formatHistoryLabel } from "@/features/dashboard/lib/format-history-label";
import type { AssessmentHistory } from "@/types/assessment";

ensureChartsRegistered();

type TrendChartPanelProps = {
  history: AssessmentHistory;
};

export function TrendChartPanel({ history }: TrendChartPanelProps) {
  const theme = useChartTheme();

  const chartData = useMemo(
    () => ({
      labels: history.map((item) => formatHistoryLabel(item.completedAt)),
      datasets: [
        {
          label: "總分",
          data: history.map((item) => item.totalScore),
          borderColor: CHART_PALETTE.primary,
          backgroundColor: CHART_PALETTE.primaryFill,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: CHART_PALETTE.primary,
          borderWidth: 2,
        },
        {
          label: "平均分 × 6",
          data: history.map((item) => item.averageScore * 6),
          borderColor: CHART_PALETTE.secondary,
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
          borderDash: [4, 4],
        },
      ],
    }),
    [history],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1400,
        easing: "easeOutQuart" as const,
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: theme.muted,
            maxRotation: 45,
            font: { size: 10 },
          },
          border: { color: theme.border },
        },
        y: {
          min: 0,
          max: 60,
          grid: { color: theme.grid },
          ticks: {
            color: theme.muted,
            stepSize: 10,
            font: { family: "var(--font-geist-mono), monospace", size: 10 },
          },
          border: { color: theme.border },
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
      <DashboardCard title="趨勢圖" subtitle="歷次檢測分數變化">
        <div className="flex h-72 items-center justify-center">
          <p className="font-mono text-xs text-muted-foreground">載入圖表…</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="趨勢圖"
      subtitle={
        history.length < 2
          ? "完成更多次問卷以觀察長期趨勢"
          : `共 ${history.length} 筆檢測紀錄`
      }
    >
      <div className="h-72 sm:h-80">
        <Line data={chartData} options={options} />
      </div>
    </DashboardCard>
  );
}
