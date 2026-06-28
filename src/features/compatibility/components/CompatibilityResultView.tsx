"use client";

import { CompatibilityTraitRadarChart } from "@/features/compatibility/components/CompatibilityTraitRadarChart";
import { MUSIC_MATCH_LABELS } from "@/features/compatibility/lib/build-compatibility-invite-url";
import type { CompatibilityResult } from "@/features/compatibility/types";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { PersonalityTraits } from "@/features/personality/types/traits";
import { cn } from "@/lib/utils";

type CompatibilityResultViewProps = {
  result: CompatibilityResult;
  traitsA: PersonalityTraits;
  traitsB: PersonalityTraits;
};

const SCENARIO_LEVEL_STYLES = {
  strong: "text-emerald-600 dark:text-emerald-400",
  good: "text-cyan-600 dark:text-cyan-400",
  okay: "text-amber-600 dark:text-amber-400",
  weak: "text-rose-600 dark:text-rose-400",
} as const;

export function CompatibilityResultView({
  result,
  traitsA,
  traitsB,
}: CompatibilityResultViewProps) {
  return (
    <DashboardCard title={MUSIC_MATCH_LABELS.resultTitle}>
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {MUSIC_MATCH_LABELS.scoreLabel}
        </p>
        <p className="mt-2 text-6xl font-bold tabular-nums text-cyan-600 dark:text-cyan-400">
          {result.score}%
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {result.labelA} × {result.labelB}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/80">
          三項維度平均
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
            {dimension.hint ? (
              <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
                {dimension.hint}
              </p>
            ) : null}
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

      <div className="mt-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          特質對照
        </p>
        <CompatibilityTraitRadarChart
          traitsA={traitsA}
          traitsB={traitsB}
          labelA={result.labelA}
          labelB={result.labelB}
        />
      </div>
    </DashboardCard>
  );
}
