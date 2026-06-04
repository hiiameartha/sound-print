"use client";

import Link from "next/link";
import { Loader2, Share2, Users } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { usePersonalityReports } from "@/features/personality-reports";
import { cn } from "@/lib/utils";

export function ProfileHistoryPanel() {
  const { reports, loading, error } = usePersonalityReports();

  return (
    <DashboardCard
      title="歷史人格報告"
      subtitle={
        loading
          ? "載入中…"
          : reports.length > 0
            ? `共 ${reports.length} 筆 · 依時間由新到舊`
            : "完成 Spotify 檢測後會出現在這裡"
      }
    >
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}

      {loading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && reports.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            尚無儲存的報告。請先至 Spotify 檢測並確認分析結果。
          </p>
          <Link
            href="/spotify"
            className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
          >
            前往 Spotify 檢測
          </Link>
        </div>
      )}

      {!loading && reports.length >= 2 && (
        <Link
          href="/compatibility"
          className={cn(
            "mb-6 flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-sm font-medium",
            "text-violet-700 hover:bg-violet-500/10 dark:text-violet-300",
          )}
        >
          <Users className="h-4 w-4" aria-hidden />
          比較兩份報告的相容性
        </Link>
      )}

      {!loading && reports.length > 0 && (
        <ul className="space-y-4">
          {reports.map((report) => {
            const primary =
              report.profile.primaryArchetype.title.split("（")[0]?.trim() ??
              report.profile.primaryArchetype.title;
            const dateLabel = new Date(report.createdAt).toLocaleString(
              "zh-TW",
              { dateStyle: "medium", timeStyle: "short" },
            );

            return (
              <li
                key={report.id}
                className="rounded-2xl border border-border/70 bg-background/50 p-5 backdrop-blur"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {dateLabel}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{primary}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      副人格 ·{" "}
                      {report.profile.secondaryArchetype.title.split("（")[0]?.trim()}
                    </p>
                    {report.commentary?.yearlyTitle ? (
                      <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-300">
                        年度稱號：{report.commentary.yearlyTitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/share?report=${report.id}`}
                      className={cn(
                        "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium",
                        "hover:bg-muted",
                      )}
                    >
                      <Share2 className="h-3.5 w-3.5" aria-hidden />
                      分享
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
