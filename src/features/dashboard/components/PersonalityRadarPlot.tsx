"use client";

import { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { buildPersonalityRadarChartData } from "@/features/dashboard/lib/build-personality-radar-data";
import { useChartTheme } from "@/features/dashboard/hooks/useChartTheme";
import { ensureChartsRegistered } from "@/features/dashboard/lib/chart-setup";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { cn } from "@/lib/utils";

ensureChartsRegistered();

type PersonalityRadarPlotProps = {
  traits: PersonalityTraits;
  label: string;
  showBaseline?: boolean;
  className?: string;
  heightClassName?: string;
};

export function PersonalityRadarPlot({
  traits,
  label,
  showBaseline = false,
  className,
  heightClassName = "h-64 sm:h-72",
}: PersonalityRadarPlotProps) {
  const theme = useChartTheme();

  const chartData = useMemo(
    () =>
      buildPersonalityRadarChartData(traits, theme.foreground, {
        label,
        showBaseline,
      }),
    [traits, theme.foreground, label, showBaseline],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
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
            font: { family: "var(--font-geist-mono), monospace", size: 9 },
          },
          grid: { color: theme.grid },
          angleLines: { color: theme.grid },
          pointLabels: {
            color: theme.foreground,
            font: { size: 10, weight: 500 as const },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          titleColor: theme.foreground,
          bodyColor: theme.muted,
          padding: 10,
          cornerRadius: 10,
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
      <p className="truncate px-1 text-center text-sm font-medium text-foreground">
        {label}
      </p>
      <div className={cn("mt-2", heightClassName)}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
