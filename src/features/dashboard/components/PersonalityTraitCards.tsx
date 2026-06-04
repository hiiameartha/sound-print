"use client";

import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import { TRAIT_CHART_COLORS } from "@/features/share/constants/trait-colors";
import type { PersonalityTraits } from "@/features/personality/types/traits";

type PersonalityTraitCardsProps = {
  traits: PersonalityTraits;
};

export function PersonalityTraitCards({ traits }: PersonalityTraitCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TRAIT_DISPLAY.map((display) => {
        const score = traits[display.key];
        const color = TRAIT_CHART_COLORS[display.key];

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
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
