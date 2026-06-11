"use client";

import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import { TRAIT_EVIDENCE_SOURCE_LABELS } from "@/features/personality/types/trait-breakdown";
import type { PersonalityTraitBreakdowns } from "@/features/personality/types/trait-breakdown";
import { TRAIT_CHART_COLORS } from "@/features/share/constants/trait-colors";
import type { PersonalityTraits } from "@/features/personality/types/traits";

type PersonalityTraitCardsProps = {
  traits: PersonalityTraits;
  traitBreakdowns?: PersonalityTraitBreakdowns;
};

const TREND_SYMBOL = {
  high: "↑",
  mid: "→",
  low: "↓",
} as const;

export function PersonalityTraitCards({
  traits,
  traitBreakdowns,
}: PersonalityTraitCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <p className="text-sm font-medium">六維度數值</p>
        {traitBreakdowns ? (
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            含聆聽證據
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TRAIT_DISPLAY.map((display) => {
          const score = traits[display.key];
          const color = TRAIT_CHART_COLORS[display.key];
          const breakdown = traitBreakdowns?.[display.key];

          return (
            <div
              key={display.key}
              className="rounded-2xl border border-border/70 bg-background/50 p-4 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {display.label} {display.emoji}
                </p>
                <span
                  className="font-mono text-2xl font-bold tabular-nums"
                  style={{ color }}
                >
                  {score}
                  {breakdown ? (
                    <span className="ml-1 text-base font-semibold opacity-80">
                      {TREND_SYMBOL[breakdown.trend]}
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>

              {breakdown && breakdown.contributors.length > 0 ? (
                <div className="mt-4 space-y-3 border-t border-border/50 pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    因為：
                  </p>
                  <ul className="space-y-1.5">
                    {breakdown.contributors.map((item) => (
                      <li
                        key={`${item.source}-${item.reason}`}
                        className="flex items-start justify-between gap-2 text-xs"
                      >
                        <span className="text-muted-foreground">
                          {TRAIT_EVIDENCE_SOURCE_LABELS[item.source]}
                        </span>
                        <span className="text-right">
                          <span
                            className="font-mono font-semibold tabular-nums"
                            style={{ color }}
                          >
                            +{item.points}
                          </span>
                          <span className="ml-2 text-foreground/90">
                            {item.reason}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {breakdown.composition.length > 0 ? (
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {display.label}組成
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                        {breakdown.composition.map((metric) => (
                          <div key={metric.label}>
                            <p className="text-[10px] text-muted-foreground">
                              {metric.label}
                            </p>
                            <p className="font-mono text-sm font-medium tabular-nums">
                              {metric.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
