import type { Metadata } from "next";
import { Suspense } from "react";
import { SpotifyLifeScan } from "@/features/spotify";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Spotify 人生檢測",
  description:
    "連結 Spotify 帳號，依聆聽習慣自動推算健康、財富、工作、社交、娛樂、成長六大維度。",
  path: "/spotify",
});

function SpotifyScanFallback() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border bg-muted/20">
      <p className="font-mono text-sm text-muted-foreground">載入中…</p>
    </div>
  );
}

export default function SpotifyPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#1DB954]">
          Spotify.LifeScan
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Spotify 人生檢測
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          登入 Spotify 後，系統會分析你的熱門藝人、曲目、近期播放與曲風輪廓，
          自動推算六大生活維度並寫入儀表板。
        </p>
      </header>
      <Suspense fallback={<SpotifyScanFallback />}>
        <SpotifyLifeScan />
      </Suspense>
    </section>
  );
}
