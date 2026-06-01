"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useAssessmentStore } from "@/store/assessment-store";
import { useLifeCommentaryStore } from "@/store/life-commentary-store";

type DashboardHeaderProps = {
  completedAt: string;
};

export function DashboardHeader({ completedAt }: DashboardHeaderProps) {
  const router = useRouter();
  const clearResult = useAssessmentStore((state) => state.clearResult);
  const clearCommentary = useLifeCommentaryStore((state) => state.clearCommentary);

  const completedLabel = new Date(completedAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Life.EXE · Dashboard
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          人生 KPI 儀表板
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          最近更新 · {completedLabel}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          href="/assessment"
          className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background/80 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
        >
          重新檢測
        </Link>
        <button
          type="button"
          onClick={() => {
            clearResult();
            clearCommentary();
            router.push("/assessment");
          }}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          清除
        </button>
      </div>
    </div>
  );
}
