"use client";

import { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { buildCompatibilityRadarChartData } from "@/features/compatibility/lib/build-compatibility-radar-data";
import { useChartTheme } from "@/features/dashboard/hooks/useChartTheme";
import { ensureChartsRegistered } from "@/features/dashboard/lib/chart-setup";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { cn } from "@/lib/utils";

ensureChartsRegistered();

type CompatibilityTraitRadarChartProps = {
  traitsA: PersonalityTraits;
  traitsB: PersonalityTraits;
  labelA: string;
  labelB: string;
  className?: string;
  heightClassName?: string;
};

export function CompatibilityTraitRadarChart({
  traitsA,
  traitsB,
  labelA,
  labelB,
  className,
  heightClassName = "h-80 lg:h-[420px]",
}: CompatibilityTraitRadarChartProps) {
  const theme = useChartTheme();

  const chartData = useMemo(
    () =>
      buildCompatibilityRadarChartData(
        traitsA,
        traitsB,
        labelA,
        labelB,
        theme.foreground,
      ),
    [traitsA, traitsB, labelA, labelB, theme.foreground],
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
          max: 100,
          ticks: {
            stepSize: 25,
            color: theme.muted,
            backdropColor: "transparent",
            font: { family: "var(--font-geist-mono), monospace", size: 10 },
          },
          grid: { color: theme.grid },
          angleLines: { color: theme.grid },
          pointLabels: {
            color: theme.foreground,
            font: { size: 11, weight: 500 as const },
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: theme.muted,
            usePointStyle: true,
            padding: 12,
            font: { size: 10 },
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
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-border/70 bg-muted/20",
          heightClassName,
          className,
        )}
      >
        <p className="font-mono text-xs text-muted-foreground">載入圖表…</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-muted/10 p-3 dark:border-white/10",
        className,
      )}
    >
      <div className={heightClassName}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
