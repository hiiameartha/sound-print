"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, Loader2, UserPlus, Users } from "lucide-react";
import { CompatibilityResultView } from "@/features/compatibility/components/CompatibilityResultView";
import { comparePersonalityReports } from "@/features/compatibility/engine/compatibility-engine";
import {
  buildCompatibilityInviteUrl,
  buildSpotifyCompareUrl,
  COMPATIBILITY_COMPARE_PARAM,
  COMPATIBILITY_INVITE_CTA,
  persistCompatibilityTarget,
} from "@/features/compatibility/lib/build-compatibility-invite-url";
import { profileToComparableReport } from "@/features/compatibility/lib/profile-to-report";
import type { CompatibilityResult } from "@/features/compatibility/types";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { usePersonalityReports } from "@/features/personality-reports";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import type { PersonalityReport } from "@/features/personality-reports/types";
import { usePersonalityReportStore } from "@/store/personality-report-store";
import { cn } from "@/lib/utils";

function formatReportOption(report: PersonalityReport): string {
  const primary = report.profile.primaryArchetype.title.split("（")[0]?.trim();
  const date = new Date(report.createdAt).toLocaleDateString("zh-TW");
  return `${date} · ${primary}`;
}

export function CompatibilityPanel() {
  const searchParams = useSearchParams();
  const friendReportId = searchParams.get(COMPATIBILITY_COMPARE_PARAM);

  const storeProfile = usePersonalityReportStore((s) => s.profile);
  const storeReportId = usePersonalityReportStore((s) => s.reportId);

  const { reports, loading, error, refresh } = usePersonalityReports();
  const reportsService = useMemo(() => new PersonalityReportsService(), []);

  const [reportAId, setReportAId] = useState<string>("");
  const [reportBId, setReportBId] = useState<string>("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [friendReport, setFriendReport] = useState<PersonalityReport | null>(
    null,
  );
  const [friendLoading, setFriendLoading] = useState(Boolean(friendReportId));
  const [friendError, setFriendError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [shareReportId, setShareReportId] = useState<string>("");

  useEffect(() => {
    if (!friendReportId) return;
    persistCompatibilityTarget(friendReportId);
  }, [friendReportId]);

  useEffect(() => {
    if (!friendReportId) {
      setFriendLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setFriendLoading(true);
      setFriendError(null);
      try {
        const report = await reportsService.getReport(friendReportId);
        if (cancelled) return;
        if (!report) {
          setFriendError("找不到好友的報告，連結可能已失效。");
          return;
        }
        setFriendReport(report);
      } catch (e) {
        if (!cancelled) {
          setFriendError(e instanceof Error ? e.message : "載入好友報告失敗");
        }
      } finally {
        if (!cancelled) setFriendLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [friendReportId, reportsService]);

  const myReport = useMemo((): PersonalityReport | null => {
    if (storeProfile && storeReportId) {
      const fromList = reports.find((r) => r.id === storeReportId);
      if (fromList) return fromList;
      return profileToComparableReport(storeProfile, storeReportId);
    }
    if (reports.length > 0) return reports[0];
    if (storeProfile) {
      return profileToComparableReport(storeProfile, storeReportId ?? "local-profile");
    }
    return null;
  }, [reports, storeProfile, storeReportId]);

  const reportA = useMemo(
    () => reports.find((r) => r.id === reportAId) ?? null,
    [reports, reportAId],
  );
  const reportB = useMemo(
    () => reports.find((r) => r.id === reportBId) ?? null,
    [reports, reportBId],
  );

  const canCompare =
    reportA && reportB && reportA.id !== reportB.id;

  const inviteReportId = shareReportId || storeReportId || reports[0]?.id || "";
  const inviteUrl = inviteReportId
    ? buildCompatibilityInviteUrl(inviteReportId)
    : null;

  const friendCompareResult = useMemo(() => {
    if (!friendReport || !myReport) return null;
    return comparePersonalityReports(friendReport, myReport);
  }, [friendReport, myReport]);

  const handleCompare = () => {
    if (!reportA || !reportB || reportA.id === reportB.id) return;
    setResult(comparePersonalityReports(reportA, reportB));
  };

  const handleCopyInvite = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setInviteStatus("已複製邀請連結");
    } catch {
      setInviteStatus("複製失敗，請手動選取連結");
    }
  }, [inviteUrl]);

  if (loading || friendLoading) {
    return (
      <DashboardCard title="音樂相容性">
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (friendReportId && friendReport && !myReport) {
    const spotifyCompareUrl = buildSpotifyCompareUrl(friendReportId);
    const friendName =
      friendReport.profile.highlights.displayName ??
      friendReport.profile.primaryArchetype.title.split("（")[0]?.trim();

    return (
      <div className="space-y-6">
        <DashboardCard
          title="好友邀請你比較相容性"
          subtitle={COMPATIBILITY_INVITE_CTA.headline}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{friendName}</span>{" "}
            想和你比較 Spotify 音樂人格合拍程度。連結你的 Spotify 後，就能看見音樂重疊、人格互補與情境建議。
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {COMPATIBILITY_INVITE_CTA.steps}
          </p>
          <a
            href={spotifyCompareUrl}
            onClick={() => persistCompatibilityTarget(friendReportId)}
            className={cn(
              "mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold",
              "bg-[#1DB954] text-black shadow-lg transition-opacity hover:opacity-90",
            )}
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            連結 Spotify 開始比較
          </a>
        </DashboardCard>
      </div>
    );
  }

  if (friendReportId && friendError) {
    return (
      <DashboardCard title="音樂相容性">
        <p className="text-sm text-rose-600 dark:text-rose-400">{friendError}</p>
        <Link
          href="/spotify"
          className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
        >
          先完成自己的檢測
        </Link>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      {inviteUrl ? (
        <DashboardCard
          title="邀請好友比較"
          subtitle="分享連結，好友連結 Spotify 後即可查看合拍指數"
        >
          <p className="text-sm text-muted-foreground">{COMPATIBILITY_INVITE_CTA.steps}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 truncate rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {inviteUrl}
            </code>
            <button
              type="button"
              onClick={() => void handleCopyInvite()}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-cyan-500/40 px-4 text-sm font-medium",
                "bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:text-cyan-300",
              )}
            >
              <Copy className="h-4 w-4" aria-hidden />
              {COMPATIBILITY_INVITE_CTA.action}
            </button>
          </div>
          {reports.length > 1 ? (
            <label className="mt-4 block space-y-2">
              <span className="text-xs text-muted-foreground">以此報告作為邀請基準</span>
              <select
                value={shareReportId || inviteReportId}
                onChange={(e) => setShareReportId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {formatReportOption(r)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {inviteStatus ? (
            <p className="mt-2 font-mono text-xs text-cyan-600 dark:text-cyan-400">
              {inviteStatus}
            </p>
          ) : null}
        </DashboardCard>
      ) : null}

      {friendCompareResult ? (
        <CompatibilityResultView result={friendCompareResult} />
      ) : null}

      {!friendReportId && reports.length < 2 && !myReport ? (
        <DashboardCard title="音樂相容性" subtitle="需要至少一份人格報告">
          <p className="text-sm text-muted-foreground">
            完成音樂人格檢測後，就能邀請好友比較，或與過往報告對照。
          </p>
          <Link
            href="/spotify"
            className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
          >
            前往檢測
          </Link>
        </DashboardCard>
      ) : !friendReportId ? (
        <DashboardCard
          title="選擇兩份報告"
          subtitle="比較不同時間點或不同帳號的音樂人格（規則引擎，非 AI）"
        >
          {error ? (
            <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}

          {reports.length < 2 ? (
            <p className="mb-4 text-sm text-muted-foreground">
              目前只有一份報告。你可以邀請好友比較，或之後再檢測一次與過往自己對照。
            </p>
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

          <button
            type="button"
            onClick={() => void refresh()}
            className="ml-3 mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            重新整理報告列表
          </button>
        </DashboardCard>
      ) : null}

      {result && !friendReport ? (
        <CompatibilityResultView result={result} />
      ) : null}
    </div>
  );
}
