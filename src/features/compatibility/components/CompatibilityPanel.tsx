"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { comparePersonalityReports } from "@/features/compatibility/engine/compatibility-engine";
import type { CompatibilityResult } from "@/features/compatibility/types";
import { usePersonalityReports } from "@/features/personality-reports";
import type { PersonalityReport } from "@/features/personality-reports/types";
import { cn } from "@/lib/utils";

function formatReportOption(report: PersonalityReport): string {
  const primary = report.profile.primaryArchetype.title.split("（")[0]?.trim();
  const date = new Date(report.createdAt).toLocaleDateString("zh-TW");
  return `${date} · ${primary}`;
}

export function CompatibilityPanel() {
  const { reports, loading, error } = usePersonalityReports();
  const [reportAId, setReportAId] = useState<string>("");
  const [reportBId, setReportBId] = useState<string>("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const reportA = useMemo(
    () => reports.find((r) => r.id === reportAId) ?? null,
    [reports, reportAId],
  );
  const reportB = useMemo(
    () => reports.find((r) => r.id === reportBId) ?? null,
    [reports, reportBId],
  );

  const canCompare =
    reportA &&
    reportB &&
    reportA.id !== reportB.id;

  const handleCompare = () => {
    if (!reportA || !reportB || reportA.id === reportB.id) return;
    setResult(comparePersonalityReports(reportA, reportB));
  };

  if (loading) {
    return (
      <DashboardCard title="人格相容性">
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (reports.length < 2) {
    return (
      <DashboardCard title="人格相容性" subtitle="需要至少兩份歷史報告">
        <p className="text-sm text-muted-foreground">
          完成兩次以上 Spotify 檢測後，就能比較不同時間的音樂人格。
        </p>
        <Link
          href="/spotify"
          className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
        >
          前往檢測
        </Link>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="選擇兩份報告"
        subtitle="比較不同時間點的音樂人格（規則引擎，非 AI）"
      >
        {error ? (
          <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">報告 A</span>
            <select
              value={reportAId}
              onChange={(e) => {
                setReportAId(e.target.value);
                setResult(null);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">請選擇…</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {formatReportOption(r)}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">報告 B</span>
            <select
              value={reportBId}
              onChange={(e) => {
                setReportBId(e.target.value);
                setResult(null);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">請選擇…</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === reportAId}>
                  {formatReportOption(r)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          disabled={!canCompare}
          onClick={handleCompare}
          className={cn(
            "mt-6 inline-flex h-10 items-center gap-2 rounded-full px-6 text-sm font-semibold",
            "bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <Users className="h-4 w-4" aria-hidden />
          開始比較
        </button>
      </DashboardCard>

      {result && (
        <DashboardCard title="相容性結果">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              相容指數
            </p>
            <p className="mt-2 text-6xl font-bold tabular-nums text-cyan-600 dark:text-cyan-400">
              {result.score}
            </p>
          </div>
          <p className="mt-6 text-center text-lg leading-relaxed text-foreground">
            {result.summary}
          </p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
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
        </DashboardCard>
      )}
    </div>
  );
}
