"use client";

import type { CompatibilityResult } from "@/features/compatibility/types";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { cn } from "@/lib/utils";

type CompatibilityResultViewProps = {
  result: CompatibilityResult;
};

const SCENARIO_LEVEL_STYLES = {
  strong: "text-emerald-600 dark:text-emerald-400",
  good: "text-cyan-600 dark:text-cyan-400",
  okay: "text-amber-600 dark:text-amber-400",
  weak: "text-rose-600 dark:text-rose-400",
} as const;

export function CompatibilityResultView({ result }: CompatibilityResultViewProps) {
  return (
    <DashboardCard title="相容性結果">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          相容指數
        </p>
        <p className="mt-2 text-6xl font-bold tabular-nums text-cyan-600 dark:text-cyan-400">
          {result.score}%
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {result.labelA} × {result.labelB}
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {result.dimensions.map((dimension) => (
          <div
            key={dimension.key}
            className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 text-center dark:border-white/10"
          >
            <p className="text-xs text-muted-foreground">{dimension.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {dimension.score}%
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-lg leading-relaxed text-foreground">
        {result.summary}
      </p>

      <div className="mt-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          情境建議
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {result.scenarios.map((scenario) => (
            <li
              key={scenario.key}
              className="rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.02]"
            >
              <span className="font-medium text-foreground">{scenario.label}</span>
              <span
                className={cn(
                  "mt-1 block font-semibold",
                  SCENARIO_LEVEL_STYLES[scenario.level],
                )}
              >
                {scenario.verdict}
              </span>
              <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                {scenario.score}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <details className="mt-8 group">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-muted-foreground">
          特質對照
        </summary>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.traitDetails.map((item) => (
            <li
              key={item.key}
              className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm"
            >
              <span className="font-medium">
                {item.label} {item.emoji}
              </span>
              <span className="mt-1 block font-mono text-xs text-muted-foreground">
                {item.scoreA} → {item.scoreB}
                {item.delta !== 0 && (
                  <span
                    className={cn(
                      "ml-2",
                      item.delta > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    ({item.delta > 0 ? "+" : ""}
                    {item.delta})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </DashboardCard>
  );
}
