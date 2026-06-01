"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { ASSESSMENT_DIMENSIONS } from "@/features/assessment/constants/dimensions";
import { scoreToPercent } from "@/features/assessment/lib/calculate-score";
import { useAssessmentStore } from "@/store/assessment-store";
import { cn } from "@/lib/utils";

export function DashboardContent() {
  const router = useRouter();
  const result = useAssessmentStore((state) => state.result);
  const clearResult = useAssessmentStore((state) => state.clearResult);

  useEffect(() => {
    if (!result) {
      router.replace("/assessment");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">
          載入儀表板中…
        </p>
      </div>
    );
  }

  const completedDate = new Date(result.completedAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-border bg-muted/20 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Life.EXE · 人生儀表板
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              總分{" "}
              <span className="font-mono text-cyan-600 dark:text-cyan-400">
                {result.totalScore}
              </span>
              <span className="text-lg font-normal text-muted-foreground">
                {" "}
                / 60
              </span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              六大維度平均{" "}
              <span className="font-mono font-semibold text-foreground">
                {result.averageScore}
              </span>{" "}
              / 10 · 完成於 {completedDate}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/assessment"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              重新檢測
            </Link>
            <button
              type="button"
              onClick={() => {
                clearResult();
                router.push("/assessment");
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              清除紀錄
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ASSESSMENT_DIMENSIONS.map((dimension) => {
          const score = result[dimension.key];
          const percent = scoreToPercent(score);
          const Icon = dimension.icon;

          return (
            <div
              key={dimension.key}
              className="rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg bg-muted",
                      dimension.accent,
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <span className="font-medium">{dimension.label}</span>
                </div>
                <span
                  className={cn(
                    "font-mono text-2xl font-bold tabular-nums",
                    dimension.accent,
                  )}
                >
                  {score}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-cyan-600 transition-all dark:bg-cyan-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-right font-mono text-xs text-muted-foreground">
                {percent}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
