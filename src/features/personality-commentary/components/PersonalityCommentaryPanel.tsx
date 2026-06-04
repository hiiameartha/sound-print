"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { fetchPersonalityCommentary } from "@/features/personality-commentary/services/fetch-personality-commentary";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";
import { usePersonalityCommentaryStore } from "@/store/personality-commentary-store";
import { usePersonalityReportStore } from "@/store/personality-report-store";
import { cn } from "@/lib/utils";

type PersonalityCommentaryPanelProps = {
  profile: PersonalityProfile;
};

export function PersonalityCommentaryPanel({
  profile,
}: PersonalityCommentaryPanelProps) {
  const commentary = usePersonalityCommentaryStore((s) => s.commentary);
  const sourceAnalyzedAt = usePersonalityCommentaryStore(
    (s) => s.sourceAnalyzedAt,
  );
  const setCommentary = usePersonalityCommentaryStore((s) => s.setCommentary);
  const reportId = usePersonalityReportStore((s) => s.reportId);

  const persistCommentary = useCallback(
    async (data: PersonalityCommentary) => {
      if (!reportId) return;
      try {
        const service = new PersonalityReportsService();
        await service.saveCommentary(reportId, data);
      } catch {
        // Supabase 未設定或 RLS 失敗時不阻擋 UI
      }
    },
    [reportId],
  );

  const isCacheValid =
    sourceAnalyzedAt === profile.analyzedAt && commentary !== null;

  const [isLoading, setIsLoading] = useState(() => !isCacheValid);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestCommentary = useCallback(
    async (target: PersonalityProfile) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchPersonalityCommentary(target);
        setCommentary(data, target.analyzedAt);
        await persistCommentary(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "產生評論失敗",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setCommentary, persistCommentary],
  );

  const handleRegenerate = useCallback(() => {
    void requestCommentary(profile);
  }, [requestCommentary, profile]);

  useEffect(() => {
    if (isCacheValid) return;

    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await requestCommentary(profile);
    })();

    return () => {
      cancelled = true;
    };
  }, [isCacheValid, requestCommentary, profile]);

  const showSuccess = !isLoading && !errorMessage && commentary !== null;

  return (
    <DashboardCard
      title="AI 人格評論"
      subtitle="幽默 · 毒舌 · 年度稱號（可選，需 OPENAI_API_KEY）"
      action={
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isLoading}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          )}
          重新生成
        </button>
      }
    >
      {isLoading && (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-3">
          <Loader2
            className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400"
            aria-hidden
          />
          <p className="font-mono text-sm text-muted-foreground">
            AI 正在解讀你的音樂人格…
          </p>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-center">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleRegenerate}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            重試
          </button>
        </div>
      )}

      {showSuccess && commentary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-5 text-center dark:border-cyan-400/20">
            <div className="mb-2 flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-widest">
                年度稱號
              </span>
            </div>
            <p className="text-xl font-bold tracking-tight sm:text-2xl">
              {commentary.yearlyTitle}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 dark:bg-white/[0.02]">
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              幽默評論
            </h4>
            <p className="leading-relaxed text-foreground">
              {commentary.humorousCommentary}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-rose-600 dark:text-rose-400">
              毒舌評論
            </h4>
            <p className="leading-relaxed text-foreground">
              {commentary.toxicCommentary}
            </p>
          </div>
        </motion.div>
      )}
    </DashboardCard>
  );
}
