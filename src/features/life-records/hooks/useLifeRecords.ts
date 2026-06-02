"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AssessmentResult } from "@/types/assessment";
import { LifeRecordsService } from "@/features/life-records/service";
import type { LifeRecord, LifeTrendSummary } from "@/features/life-records/types";
import { getOrCreateLocalUserId } from "@/features/life-records/lib/user-id";

export function useLifeRecords() {
  const service = useMemo(() => new LifeRecordsService(), []);

  const [userId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getOrCreateLocalUserId();
  });
  const [records, setRecords] = useState<LifeRecord[]>([]);
  const [trend, setTrend] = useState<LifeTrendSummary>(() =>
    service.buildTrendSummary([]),
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await service.list(userId, 60);
      setRecords(list);
      setTrend(service.buildTrendSummary(list));
    } catch (e) {
      setError(e instanceof Error ? e.message : "讀取歷史紀錄失敗");
    } finally {
      setLoading(false);
    }
  }, [service, userId]);

  const saveFromAssessment = useCallback(
    async (result: AssessmentResult) => {
      if (!userId) return;
      setSaving(true);
      setError(null);
      try {
        await service.saveFromAssessment(userId, result);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "儲存歷史紀錄失敗");
      } finally {
        setSaving(false);
      }
    },
    [refresh, service, userId],
  );

  useEffect(() => {
    let cancelled = false;

    // 避免在 effect body 內「同步」觸發 setState，改在 microtask 排程後執行。
    Promise.resolve().then(() => {
      if (cancelled) return;
      void refresh();
    });

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return {
    userId,
    records,
    trend,
    loading,
    saving,
    error,
    refresh,
    saveFromAssessment,
  };
}

