"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { fetchLifeCommentary } from "@/features/life-commentary/services/fetch-life-commentary";
import { useLifeCommentaryStore } from "@/store/life-commentary-store";
import type { AssessmentResult } from "@/types/assessment";
import type { LifeCommentaryInput } from "@/types/life-commentary";
import { cn } from "@/lib/utils";

type LifeCommentaryPanelProps = {
  result: AssessmentResult;
};

function toCommentaryInput(result: AssessmentResult): LifeCommentaryInput {
  return {
    health: result.health,
    wealth: result.wealth,
    work: result.work,
    social: result.social,
    entertainment: result.entertainment,
    growth: result.growth,
  };
}

export function LifeCommentaryPanel({ result }: LifeCommentaryPanelProps) {
  const commentary = useLifeCommentaryStore((s) => s.commentary);
  const sourceCompletedAt = useLifeCommentaryStore((s) => s.sourceCompletedAt);
  const setCommentary = useLifeCommentaryStore((s) => s.setCommentary);

  const isCacheValid =
    sourceCompletedAt === result.completedAt && commentary !== null;

  const [isLoading, setIsLoading] = useState(() => !isCacheValid);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestCommentary = useCallback(
    async (scores: LifeCommentaryInput, completedAt: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchLifeCommentary(scores);
        setCommentary(data, completedAt);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "產生評論失敗",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setCommentary],
  );

  const handleRegenerate = useCallback(() => {
    void requestCommentary(toCommentaryInput(result), result.completedAt);
  }, [requestCommentary, result]);

  useEffect(() => {
    if (isCacheValid) return;

    let cancelled = false;
    const scores = toCommentaryInput(result);
    const completedAt = result.completedAt;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await requestCommentary(scores, completedAt);
    })();

    return () => {
      cancelled = true;
    };
  }, [isCacheValid, requestCommentary, result]);

  const showSuccess = !isLoading && !errorMessage && commentary !== null;

  return (
    <DashboardCard
      title="AI 人生評論"
      subtitle="Life.EXE 幽默分析 · 鼓勵建議 · 專屬稱號"
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
      className="lg:col-span-2"
    >
      {isLoading && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
          <Loader2
            className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400"
            aria-hidden
          />
          <p className="font-mono text-sm text-muted-foreground">
            AI 正在解讀你的人生數據…
          </p>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
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
          className="space-y-6"
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-6 text-center dark:border-cyan-400/20">
            <div className="mb-2 flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-widest">
                人生稱號
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              {commentary.title}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 dark:bg-white/[0.02]">
              <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                幽默分析
              </h4>
              <p className="leading-relaxed text-foreground">
                {commentary.humorousAnalysis}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 dark:bg-white/[0.02]">
              <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                鼓勵建議
              </h4>
              <p className="leading-relaxed text-foreground">
                {commentary.encouragement}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardCard>
  );
}
