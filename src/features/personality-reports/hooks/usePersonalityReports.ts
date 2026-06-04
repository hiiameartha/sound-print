"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import type { PersonalityReport } from "@/features/personality-reports/types";
import { getOrCreateLocalUserId } from "@/lib/user-id";

export function usePersonalityReports() {
  const service = useMemo(() => new PersonalityReportsService(), []);

  const [userId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getOrCreateLocalUserId();
  });
  const [reports, setReports] = useState<PersonalityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await service.listReports(userId, 60);
      setReports(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "讀取歷史報告失敗");
    } finally {
      setLoading(false);
    }
  }, [service, userId]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      void refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { userId, reports, loading, error, refresh };
}
