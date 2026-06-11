"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Music2, Sparkles } from "lucide-react";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import { PersonalityTraitCards } from "@/features/dashboard/components/PersonalityTraitCards";
import { PersonalityReportsService } from "@/features/personality-reports/service";
import { SpotifyListeningPanel } from "@/features/spotify/components/SpotifyListeningPanel";
import { SITE } from "@/constants/site";
import { getOrCreateLocalUserId } from "@/lib/user-id";
import { usePersonalityReportStore } from "@/store/personality-report-store";
import { cn } from "@/lib/utils";

type SessionState = {
  configured: boolean;
  connected: boolean;
  displayName?: string;
};

type AnalyzeResponse = {
  profile: PersonalityProfile;
};

type Phase =
  | "checking"
  | "login"
  | "analyzing"
  | "preview"
  | "submitting"
  | "error";

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Spotify 授權失敗，請再試一次",
  invalid_state: "登入狀態已過期，請重新連結",
  no_refresh: "無法取得長期授權，請重新連結 Spotify",
};

async function fetchSession(): Promise<SessionState> {
  const res = await fetch("/api/spotify/session", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("無法檢查 Spotify 連線狀態");
  }
  return res.json() as Promise<SessionState>;
}

async function fetchAnalyze(): Promise<AnalyzeResponse> {
  const res = await fetch("/api/spotify/analyze", { cache: "no-store" });
  const body = (await res.json()) as AnalyzeResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? "分析失敗，請稍後再試");
  }
  return body;
}

export function SpotifyLifeScan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setProfile = usePersonalityReportStore((state) => state.setProfile);
  const reportsService = useMemo(() => new PersonalityReportsService(), []);

  const [phase, setPhase] = useState<Phase>("checking");
  const [session, setSession] = useState<SessionState | null>(null);
  const [analyzeData, setAnalyzeData] = useState<AnalyzeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bootstrapStarted = useRef(false);
  const urlError = searchParams.get("error");
  const fromShare = searchParams.get("from") === "share";

  const runAnalyze = useCallback(async () => {
    setPhase("analyzing");
    setErrorMessage(null);
    try {
      const data = await fetchAnalyze();
      setAnalyzeData(data);
      setProfile(data.profile);
      setPhase("preview");
    } catch (err) {
      setPhase("error");
      setErrorMessage(
        err instanceof Error ? err.message : "分析失敗，請稍後再試",
      );
    }
  }, [setProfile]);

  const bootstrap = useCallback(async () => {
    setPhase("checking");
    setErrorMessage(null);

    try {
      const data = await fetchSession();
      setSession(data);

      if (!data.configured) {
        setPhase("error");
        setErrorMessage(
          "伺服器尚未設定 Spotify（SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET）",
        );
        return;
      }

      if (urlError) {
        setPhase("login");
        setErrorMessage(
          ERROR_MESSAGES[urlError] ?? "連結 Spotify 時發生錯誤",
        );
        router.replace("/spotify", { scroll: false });
        return;
      }

      if (!data.connected) {
        setPhase("login");
        return;
      }

      await runAnalyze();
    } catch (err) {
      setPhase("error");
      setErrorMessage(
        err instanceof Error ? err.message : "無法連線到伺服器，請確認 dev server 已啟動",
      );
    }
  }, [router, runAnalyze, urlError]);

  useEffect(() => {
    if (bootstrapStarted.current) return;
    bootstrapStarted.current = true;
    void bootstrap();
  }, [bootstrap]);

  const handleRetry = () => {
    bootstrapStarted.current = false;
    void bootstrap();
  };

  const handleConfirm = async () => {
    if (!analyzeData) return;

    setPhase("submitting");
    const { profile } = analyzeData;

    try {
      const userId = getOrCreateLocalUserId();
      const saved = await reportsService.saveReport(userId, profile);
      setProfile(profile, saved.id);
    } catch {
      setProfile(profile);
    }

    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await fetch("/api/spotify/logout", { method: "POST" });
    setAnalyzeData(null);
    setSession((prev) =>
      prev ? { ...prev, connected: false, displayName: undefined } : prev,
    );
    setPhase("login");
  };

  if (phase === "checking" || phase === "analyzing" || phase === "submitting") {
    const labels: Record<typeof phase, string> = {
      checking: "檢查 Spotify 連線…",
      analyzing: "正在分析你的音樂人格…",
      submitting: "寫入人格報告…",
    };

    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/20 p-10">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400" />
        <p className="font-mono text-sm text-muted-foreground">{labels[phase]}</p>
      </div>
    );
  }

  if (phase === "login") {
    return (
      <div className="space-y-6 rounded-xl border border-border bg-muted/20 p-5 sm:p-10">
        {fromShare ? (
          <p className="rounded-lg border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-3 text-sm leading-relaxed text-foreground">
            朋友分享了 {SITE.name} 音樂人格報告！連結你的 Spotify，幾分鐘內就能取得屬於你的報告。
          </p>
        ) : null}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1DB954]/15">
            <Music2 className="h-6 w-6 text-[#1DB954]" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-semibold">連結 Spotify 帳號</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              登入後系統會分析你的聆聽習慣，由 Personality Engine 推算音樂人格特質與主人格類型。
            </p>
            {session?.connected && session.displayName ? (
              <p className="mt-2 text-sm text-muted-foreground">
                已連線：{session.displayName}
              </p>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <a
          href="/api/spotify/login"
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full px-8",
            "bg-[#1DB954] text-sm font-semibold text-black shadow-lg transition-opacity hover:opacity-90",
          )}
        >
          <Music2 className="h-4 w-4" aria-hidden />
          使用 Spotify 登入
        </a>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8">
        <p className="text-sm text-destructive">{errorMessage}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  if (!analyzeData) return null;

  const { profile } = analyzeData;
  const { highlights, primaryArchetype, secondaryArchetype } = profile;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#1DB954]">
              Spotify · 人格分析完成
            </p>
            <p className="mt-1 text-lg font-semibold">{highlights.displayName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {highlights.topArtist
                ? `近期代表藝人：${highlights.topArtist}`
                : "已載入聆聽資料"}
              {" · "}
              {highlights.genreCount} 種曲風 · {highlights.trackSampleSize} 首樣本
            </p>
            {profile.signalEnrichment?.source === "ai" ? (
              <p className="mt-1 text-xs text-muted-foreground/90">
                Spotify 未提供部分曲風／熱門度資料，已以 AI 依藝人與曲目名稱推估補強
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            換帳號
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            主人格
          </p>
          <p className="mt-2 text-lg font-semibold">{primaryArchetype.title}</p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            契合度 {primaryArchetype.score}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            副人格
          </p>
          <p className="mt-2 text-lg font-semibold">{secondaryArchetype.title}</p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            契合度 {secondaryArchetype.score}
          </p>
        </div>
      </div>

      <SpotifyListeningPanel />

      <PersonalityTraitCards
        traits={profile.traits}
        traitBreakdowns={profile.traitBreakdowns}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleConfirm()}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full px-8",
            "bg-primary text-sm font-semibold text-primary-foreground shadow-lg",
          )}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          確認並前往儀表板
        </button>
        <button
          type="button"
          onClick={() => void runAnalyze()}
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium hover:bg-muted"
        >
          重新分析
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        開發模式需在 Spotify Dashboard 將帳號加入測試使用者清單。
        <Link href="/about" className="ml-1 underline-offset-4 hover:underline">
          了解更多
        </Link>
      </p>
    </div>
  );
}
