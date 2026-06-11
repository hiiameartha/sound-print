"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { SITE } from "@/constants/site";
import { usePersonalityCommentaryStore } from "@/store/personality-commentary-store";
import { usePersonalityReportStore } from "@/store/personality-report-store";

type PersonalityHeaderProps = {
  analyzedAt: string;
  displayName?: string;
};

export function PersonalityHeader({
  analyzedAt,
  displayName,
}: PersonalityHeaderProps) {
  const router = useRouter();
  const clearProfile = usePersonalityReportStore((state) => state.clearProfile);
  const clearCommentary = usePersonalityCommentaryStore(
    (state) => state.clearCommentary,
  );

  const completedLabel = new Date(analyzedAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          {SITE.name}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          你的音樂人格
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {displayName ? `${displayName} · ` : ""}
          最近分析 · {completedLabel}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          href="/profile"
          className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background/80 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
        >
          歷史紀錄
        </Link>
        <Link
          href="/spotify"
          className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background/80 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
        >
          重新檢測
        </Link>
        <button
          type="button"
          onClick={() => {
            clearProfile();
            clearCommentary();
            router.push("/spotify");
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
