"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { SpotifyListeningThumbnail } from "@/features/spotify/components/SpotifyListeningThumbnail";
import type {
  ListeningArtistItem,
  ListeningTrackItem,
  SpotifyListeningSummary,
} from "@/features/spotify/lib/format-listening-summary";
import { cn } from "@/lib/utils";

type TabId = "recent" | "topTracks" | "topArtistsShort" | "topArtistsMedium";

const TABS: { id: TabId; label: string }[] = [
  { id: "recent", label: "最近播放" },
  { id: "topTracks", label: "熱門曲目" },
  { id: "topArtistsShort", label: "近期藝人" },
  { id: "topArtistsMedium", label: "長期藝人" },
];

function formatPlayedAt(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

function TrackRow({ item }: { item: ListeningTrackItem }) {
  const playedLabel = formatPlayedAt(item.playedAt);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5">
      {item.rank ? (
        <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
          {item.rank}
        </span>
      ) : null}
      <SpotifyListeningThumbnail
        imageUrl={item.imageUrl}
        alt={item.albumName ? `${item.albumName} 封面` : `${item.name} 封面`}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="truncate text-xs text-muted-foreground">{item.artists}</p>
        {item.albumName ? (
          <p className="truncate text-[11px] text-muted-foreground/80">
            {item.albumName}
          </p>
        ) : null}
      </div>
      {playedLabel ? (
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {playedLabel}
        </span>
      ) : null}
    </li>
  );
}

function ArtistRow({ item }: { item: ListeningArtistItem }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5">
      <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
        {item.rank}
      </span>
      <SpotifyListeningThumbnail
        imageUrl={item.imageUrl}
        alt={`${item.name} 頭像`}
        variant="circle"
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
      </div>
    </li>
  );
}

type SpotifyListeningPanelProps = {
  className?: string;
  initialSummary?: SpotifyListeningSummary | null;
};

export function SpotifyListeningPanel({
  className,
  initialSummary = null,
}: SpotifyListeningPanelProps) {
  const [summary, setSummary] = useState<SpotifyListeningSummary | null>(
    initialSummary,
  );
  const [loading, setLoading] = useState(!initialSummary);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("recent");

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/listening", { cache: "no-store" });
      const body = (await res.json()) as {
        summary?: SpotifyListeningSummary;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(body.error ?? "無法載入聆聽紀錄");
      }
      setSummary(body.summary ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "無法載入聆聽紀錄",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSummary) return;
    void loadSummary();
  }, [initialSummary]);

  const activeItems = (() => {
    if (!summary) return [];
    switch (activeTab) {
      case "recent":
        return summary.recentlyPlayed;
      case "topTracks":
        return summary.topTracksShort;
      case "topArtistsShort":
        return summary.topArtistsShort;
      case "topArtistsMedium":
        return summary.topArtistsMedium;
    }
  })();

  const isTrackTab = activeTab === "recent" || activeTab === "topTracks";

  return (
    <DashboardCard
      className={className}
      title="Spotify 聆聽紀錄"
      subtitle={
        summary
          ? `${summary.displayName} · 資料來自 Spotify API · 更新於 ${new Intl.DateTimeFormat("zh-TW", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(summary.fetchedAt))}`
          : "載入 Spotify 熱門藝人、曲目與最近播放"
      }
      action={
        <button
          type="button"
          onClick={() => void loadSummary()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          重新整理
        </button>
      }
    >
      {error ? (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      ) : null}

      {loading && !summary ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : summary ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#1DB954]/15 text-[#1DB954]"
                    : "border border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {tab.label}
                <span className="ml-1 font-mono text-[10px] opacity-70">
                  {summary.counts[
                    tab.id === "recent"
                      ? "recentlyPlayed"
                      : tab.id === "topTracks"
                        ? "topTracksShort"
                        : tab.id
                  ]}
                </span>
              </button>
            ))}
          </div>

          {activeItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Spotify 尚未回傳此類別的資料。請確認帳號有足夠聆聽紀錄，或稍後再試。
            </p>
          ) : (
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {isTrackTab
                ? (activeItems as ListeningTrackItem[]).map((item) => (
                    <TrackRow key={`${item.id}-${item.playedAt ?? item.rank}`} item={item} />
                  ))
                : (activeItems as ListeningArtistItem[]).map((item) => (
                    <ArtistRow key={item.id} item={item} />
                  ))}
            </ul>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            近期藝人約 4 週、長期藝人約 6 個月、熱門曲目為近 4 週；最近播放為 Spotify
            回傳的近期播放清單（最多 50 筆）。
          </p>
        </>
      ) : null}
    </DashboardCard>
  );
}
