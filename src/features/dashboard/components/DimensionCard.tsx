"use client";

import { motion } from "framer-motion";
import type { AssessmentDimension } from "@/features/assessment/constants/dimensions";
import { DIMENSION_CHART_COLORS } from "@/features/dashboard/constants/chart-colors";
import { AnimatedScore } from "@/features/dashboard/components/AnimatedScore";
import { scoreToPercent } from "@/features/assessment/lib/calculate-score";
import { cn } from "@/lib/utils";

type DimensionCardProps = {
  dimension: AssessmentDimension;
  score: number;
  index: number;
};

export function DimensionCard({ dimension, score, index }: DimensionCardProps) {
  const Icon = dimension.icon;
  const percent = scoreToPercent(score);
  const barColor = DIMENSION_CHART_COLORS[dimension.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 p-4",
        "bg-background/60 backdrop-blur-md transition-shadow hover:shadow-md",
        "dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-[0_4px_24px_rgba(6,182,212,0.08)]",
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ backgroundColor: barColor }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl bg-muted/80",
              dimension.accent,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </div>
          <span className="text-sm font-medium">{dimension.label}</span>
        </div>
        <AnimatedScore
          value={score}
          className={cn("text-2xl font-bold", dimension.accent)}
        />
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            delay: 0.2 + index * 0.06,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
      <p className="relative mt-2 text-right font-mono text-[11px] text-muted-foreground">
        {percent}%
      </p>
    </motion.div>
  );
}
