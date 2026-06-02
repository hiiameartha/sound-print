"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { TrendChartPanel } from "@/features/dashboard/components/TrendChartPanel";
import { useLifeRecords } from "@/features/life-records/hooks/useLifeRecords";
import { lifeRecordToAssessmentResult } from "@/features/life-records/types";
import { cn } from "@/lib/utils";

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
        <Minus className="h-3 w-3" aria-hidden />
        N/A
      </span>
    );
  }

  const positive = value > 0;
  const negative = value < 0;
  const Icon = positive ? TrendingUp : negative ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[11px]",
        positive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        negative && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        !positive && !negative && "bg-muted text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {value > 0 ? `+${value}` : value}
    </span>
  );
}

export function LifeRecordsPanel() {
  const { records, trend, loading, error, saving } = useLifeRecords();

  const history = useMemo(
    () => records.map(lifeRecordToAssessmentResult),
    [records],
  );

  return (
    <div className="space-y-6">
      <DashboardCard
        title="歷史變化"
        subtitle={
          loading
            ? "從 Supabase 讀取中…"
            : `共 ${trend.count} 筆（最近一次：${
                trend.latestCreatedAt
                  ? new Date(trend.latestCreatedAt).toLocaleString("zh-TW")
                  : "—"
              }）`
        }
        action={
          saving ? (
            <span className="font-mono text-xs text-muted-foreground">同步中…</span>
          ) : null
        }
      >
        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              trend.deltas.score,
              trend.deltas.health,
              trend.deltas.wealth,
              trend.deltas.career,
              trend.deltas.social,
              trend.deltas.fun,
              trend.deltas.growth,
            ] as const
          ).map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.35 }}
              className="rounded-2xl border border-border/70 bg-background/50 p-4 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <DeltaBadge value={item.delta} />
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                目前：{item.current}
                {item.previous === null ? "" : `（前次：${item.previous}）`}
              </p>
            </motion.div>
          ))}
        </div>
      </DashboardCard>

      <TrendChartPanel history={history} />
    </div>
  );
}

