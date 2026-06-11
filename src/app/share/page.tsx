import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE } from "@/constants/site";
import { SharePageContent } from "@/features/share/components/SharePageContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "分享人格報告",
  description: `分享你的 ${SITE.name} 音樂人格報告。${SITE.tagline}`,
  path: "/share",
});

function ShareFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="font-mono text-sm text-muted-foreground">載入分享頁…</p>
    </div>
  );
}

export default function SharePage() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]"
        aria-hidden
      />
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            {SITE.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">分享人格報告</h1>
          <p className="mt-2 text-muted-foreground">
            下載 PNG 或分享到社群。亦可從歷史紀錄開啟專屬連結。
          </p>
        </header>
        <Suspense fallback={<ShareFallback />}>
          <SharePageContent />
        </Suspense>
      </section>
    </div>
  );
}
