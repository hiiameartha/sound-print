import type { ChartData } from "chart.js";
import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import { CHART_PALETTE } from "@/features/dashboard/constants/chart-colors";
import type { PersonalityTraits } from "@/features/personality/types/traits";

export function buildCompatibilityRadarChartData(
  traitsA: PersonalityTraits,
  traitsB: PersonalityTraits,
  labelA: string,
  labelB: string,
  foreground: string,
) {
  const labels = TRAIT_DISPLAY.map((d) => `${d.emoji} ${d.label}`);

  const datasets: Record<string, unknown>[] = [
    {
      label: labelA,
      data: TRAIT_DISPLAY.map((d) => traitsA[d.key]),
      backgroundColor: CHART_PALETTE.primaryFill,
      borderColor: CHART_PALETTE.primary,
      borderWidth: 2,
      pointBackgroundColor: CHART_PALETTE.primary,
      pointBorderColor: foreground,
      pointHoverBackgroundColor: CHART_PALETTE.primary,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: labelB,
      data: TRAIT_DISPLAY.map((d) => traitsB[d.key]),
      backgroundColor: CHART_PALETTE.secondaryFill,
      borderColor: CHART_PALETTE.secondary,
      borderWidth: 2,
      pointBackgroundColor: CHART_PALETTE.secondary,
      pointBorderColor: foreground,
      pointHoverBackgroundColor: CHART_PALETTE.secondary,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ];

  return { labels, datasets } as unknown as ChartData<"radar", number[], string>;
}
