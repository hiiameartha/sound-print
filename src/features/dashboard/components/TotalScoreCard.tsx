"use client";

import { Activity } from "lucide-react";
import { AnimatedScore } from "@/features/dashboard/components/AnimatedScore";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { AssessmentResult } from "@/types/assessment";

type TotalScoreCardProps = {
  result: AssessmentResult;
};

export function TotalScoreCard({ result }: TotalScoreCardProps) {
  const percent = Math.round((result.totalScore / 60) * 100);

  return (
    <DashboardCard className="lg:col-span-2">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
            <Activity
              className="h-7 w-7 text-cyan-600 dark:text-cyan-400"
              aria-hidden
            />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Life Score
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <AnimatedScore
                value={result.totalScore}
                className="text-5xl font-bold text-foreground sm:text-6xl"
              />
              <span className="font-mono text-xl text-muted-foreground">
                / 60
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              六大維度平均{" "}
              <AnimatedScore
                value={result.averageScore}
                className="font-semibold text-cyan-600 dark:text-cyan-400"
                decimals={1}
              />
              <span className="text-muted-foreground"> / 10</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">達成率</p>
            <AnimatedScore
              value={percent}
              suffix="%"
              className="text-3xl font-bold text-foreground"
            />
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted sm:w-48">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-500 to-violet-500 transition-all duration-1000 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ● System Online
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
