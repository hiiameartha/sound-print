"use client";

import { Brain, Music2 } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import {
  INSIGHT_CATEGORY_LABELS,
  type ListeningInsights,
} from "@/features/personality/types/listening-insights";
import { cn } from "@/lib/utils";

type DashboardInsightsPanelProps = {
  insights: ListeningInsights;
  className?: string;
};

export function DashboardInsightsPanel({
  insights,
  className,
}: DashboardInsightsPanelProps) {
  return (
    <DashboardCard
      className={className}
      title="洞察"
      subtitle="從聆聽習慣拼出的故事"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <section
          className={cn(
            "rounded-2xl border border-border/80 bg-muted/20 p-5",
            "dark:border-white/10 dark:bg-white/[0.02]",
          )}
        >
          <div className="mb-4 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Music2 className="h-4 w-4" aria-hidden />
            <h4 className="font-mono text-xs uppercase tracking-widest">
              你的音樂觀察
            </h4>
          </div>

          <ul className="space-y-3">
            {insights.observations.map((item) => (
              <li
                key={`${item.category}-${item.headline}`}
                className="flex items-baseline gap-3 text-sm"
              >
                <span className="shrink-0 font-medium text-muted-foreground">
                  {INSIGHT_CATEGORY_LABELS[item.category]}：
                </span>
                <span className="font-medium text-foreground">{item.headline}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={cn(
            "rounded-2xl border border-violet-500/20 bg-linear-to-br from-violet-500/8 via-transparent to-cyan-500/8 p-5",
            "dark:border-violet-400/20",
          )}
        >
          <div className="mb-4 flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <Brain className="h-4 w-4" aria-hidden />
            <h4 className="font-mono text-xs uppercase tracking-widest">
              AI 推論
            </h4>
          </div>

          <p className="text-base font-medium leading-relaxed text-foreground">
            {insights.inference.summary}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground">可能原因：</p>
            <ul className="flex flex-wrap gap-2">
              {insights.inference.possibleReasons.map((reason) => (
                <li
                  key={reason}
                  className={cn(
                    "rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs",
                    "text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]",
                  )}
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            以上為依聆聽訊號推估的解讀，僅供參考，不代表你的真實生活狀態。
          </p>
        </section>
      </div>
    </DashboardCard>
  );
}
