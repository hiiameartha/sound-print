import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import { CHART_PALETTE } from "@/features/dashboard/constants/chart-colors";
import { TRAIT_CHART_COLORS } from "@/features/share/constants/trait-colors";
import type { PersonalityTraits } from "@/features/personality/types/traits";

export function buildPersonalityRadarChartData(
  traits: PersonalityTraits,
  foreground: string,
) {
  const labels = TRAIT_DISPLAY.map((d) => `${d.emoji} ${d.label}`);

  return {
    labels,
    datasets: [
      {
        label: "人格特質",
        data: TRAIT_DISPLAY.map((d) => traits[d.key]),
        backgroundColor: CHART_PALETTE.primaryFill,
        borderColor: CHART_PALETTE.primary,
        borderWidth: 2,
        pointBackgroundColor: TRAIT_DISPLAY.map((d) => TRAIT_CHART_COLORS[d.key]),
        pointBorderColor: foreground,
        pointHoverBackgroundColor: CHART_PALETTE.secondary,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "基準線 (50)",
        data: TRAIT_DISPLAY.map(() => 50),
        backgroundColor: CHART_PALETTE.secondaryFill,
        borderColor: CHART_PALETTE.secondary,
        borderWidth: 1,
        borderDash: [6, 4],
        pointRadius: 0,
      },
    ],
  };
}
