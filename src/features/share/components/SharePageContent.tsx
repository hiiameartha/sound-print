"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import { SharePanel } from "@/features/share/components/SharePanel";
import { usePersonalityReportStore } from "@/store/personality-report-store";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";

export function SharePageContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("report");

  const storeProfile = usePersonalityReportStore((s) => s.profile);
  const storeReportId = usePersonalityReportStore((s) => s.reportId);

  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [commentary, setCommentary] = useState<PersonalityCommentary | null>(
    null,
  );
  const [loading, setLoading] = useState(Boolean(reportId));
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => new PersonalityReportsService(), []);

  useEffect(() => {
    if (!reportId) {
      if (storeProfile) {
        setProfile(storeProfile);
        setLoading(false);
      } else {
        setError("尚無可分享的報告，請先完成 Spotify 檢測。");
        setLoading(false);
      }
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const report = await service.getReport(reportId);
        if (cancelled) return;
        if (!report) {
          setError("找不到這份人格報告。");
          return;
        }
        setProfile(report.profile);
        setCommentary(report.commentary);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "載入報告失敗");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportId, service, storeProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "無法載入報告"}</p>
        <Link
          href="/spotify"
          className="mt-4 inline-flex text-sm font-medium text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
        >
          前往 Spotify 檢測
        </Link>
      </div>
    );
  }

  return (
    <SharePanel
      profile={profile}
      initialCommentary={commentary}
      reportId={reportId ?? storeReportId}
    />
  );
}
