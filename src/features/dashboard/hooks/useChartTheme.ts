"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return {
    mounted,
    isDark,
    foreground: isDark ? "#ededed" : "#171717",
    muted: isDark ? "#a1a1aa" : "#71717a",
    grid: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    tooltipBg: isDark ? "rgba(24, 24, 27, 0.95)" : "rgba(255, 255, 255, 0.95)",
    tooltipBorder: isDark ? "#3f3f46" : "#e4e4e7",
  };
}
