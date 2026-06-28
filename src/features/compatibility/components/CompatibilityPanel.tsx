"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, Loader2, UserPlus } from "lucide-react";
import { CompatibilityResultView } from "@/features/compatibility/components/CompatibilityResultView";
import { comparePersonalityReports } from "@/features/compatibility/engine/compatibility-engine";
import {
  buildCompatibilityInviteUrl,
  buildSpotifyComparePath,
  COMPATIBILITY_COMPARE_PARAM,
  COMPATIBILITY_INVITE_CTA,
  MUSIC_MATCH_LABELS,
  MUSIC_MATCH_SECTION_ID,
  persistCompatibilityTarget,
} from "@/features/compatibility/lib/build-compatibility-invite-url";
import { profileToComparableReport } from "@/features/compatibility/lib/profile-to-report";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import type { PersonalityReport } from "@/features/personality-reports/types";
import { usePersonalityReportStore } from "@/store/personality-report-store";
import { cn } from "@/lib/utils";

export function CompatibilityPanel() {
  const searchParams = useSearchParams();
  const friendReportId = searchParams.get(COMPATIBILITY_COMPARE_PARAM);

  const storeProfile = usePersonalityReportStore((s) => s.profile);
  const storeReportId = usePersonalityReportStore((s) => s.reportId);

  const reportsService = useMemo(() => new PersonalityReportsService(), []);

  const [friendReport, setFriendReport] = useState<PersonalityReport | null>(
    null,
  );
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendError, setFriendError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!friendReportId) return;
    persistCompatibilityTarget(friendReportId);
  }, [friendReportId]);

  useEffect(() => {
    if (!friendReportId) return;

    let cancelled = false;

    void (async () => {
      setFriendLoading(true);
      setFriendError(null);
      setFriendReport(null);
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
    if (!storeProfile) return null;
    return profileToComparableReport(
      storeProfile,
      storeReportId ?? "current-profile",
    );
  }, [storeProfile, storeReportId]);

  const inviteUrl = storeReportId
    ? buildCompatibilityInviteUrl(storeReportId)
    : null;

  const friendCompareResult = useMemo(() => {
    if (!friendReportId || !friendReport || !myReport) return null;
    return comparePersonalityReports(friendReport, myReport);
  }, [friendReportId, friendReport, myReport]);

  const handleCopyInvite = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setInviteStatus("已複製邀請連結");
    } catch {
      setInviteStatus("複製失敗，請手動選取連結");
    }
  }, [inviteUrl]);

  if (friendReportId && friendLoading) {
    return (
      <div id={MUSIC_MATCH_SECTION_ID}>
        <DashboardCard title={MUSIC_MATCH_LABELS.sectionTitle}>
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardCard>
      </div>
    );
  }

  if (friendReportId && friendReport && !myReport) {
    const spotifyComparePath = buildSpotifyComparePath(friendReportId);
    const friendName =
      friendReport.profile.highlights.displayName ??
      friendReport.profile.primaryArchetype.title.split("（")[0]?.trim();

    return (
      <div id={MUSIC_MATCH_SECTION_ID} className="space-y-6">
        <DashboardCard
          title={MUSIC_MATCH_LABELS.friendInviteTitle}
          subtitle={COMPATIBILITY_INVITE_CTA.headline}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{friendName}</span>{" "}
            {MUSIC_MATCH_LABELS.friendInviteBody}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {COMPATIBILITY_INVITE_CTA.steps}
          </p>
          <a
            href={spotifyComparePath}
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
      <div id={MUSIC_MATCH_SECTION_ID}>
        <DashboardCard title={MUSIC_MATCH_LABELS.sectionTitle}>
          <p className="text-sm text-rose-600 dark:text-rose-400">{friendError}</p>
          <Link
            href="/spotify"
            className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
          >
            先完成自己的檢測
          </Link>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div id={MUSIC_MATCH_SECTION_ID} className="space-y-6">
      <DashboardCard
        title={MUSIC_MATCH_LABELS.sectionTitle}
        subtitle={MUSIC_MATCH_LABELS.sectionSubtitle}
      >
        {inviteUrl ? (
          <>
            <p className="text-sm text-muted-foreground">
              {COMPATIBILITY_INVITE_CTA.steps}
            </p>
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
            {inviteStatus ? (
              <p className="mt-2 font-mono text-xs text-cyan-600 dark:text-cyan-400">
                {inviteStatus}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {MUSIC_MATCH_LABELS.unsavedReportHint}
          </p>
        )}
      </DashboardCard>

      {friendCompareResult && friendReport && myReport ? (
        <CompatibilityResultView
          result={friendCompareResult}
          traitsA={friendReport.profile.traits}
          traitsB={myReport.profile.traits}
        />
      ) : null}
    </div>
  );
}
