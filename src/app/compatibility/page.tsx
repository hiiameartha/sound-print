import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE } from "@/constants/site";
import { CompatibilityPanel } from "@/features/compatibility";
import { createPageMetadata } from "@/lib/metadata";

function CompatibilityFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="font-mono text-sm text-muted-foreground">載入相容性…</p>
    </div>
  );
}

export const metadata: Metadata = createPageMetadata({
  title: "音樂相容性",
  description: `比較兩份 Spotify 音樂人格的合拍程度：音樂重疊、人格互補、情境建議。${SITE.name} — ${SITE.tagline}`,
  path: "/compatibility",
});

export default function CompatibilityPage() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.08),transparent_50%)]"
        aria-hidden
      />
      <section className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            {SITE.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">音樂相容性</h1>
          <p className="mt-2 text-muted-foreground">
            拆開看音樂重疊、人格互補與情緒同步，並給出一起旅行、工作、唱歌的合拍建議。邀請好友連結 Spotify 即可比較。
          </p>
        </header>
        <Suspense fallback={<CompatibilityFallback />}>
          <CompatibilityPanel />
        </Suspense>
      </section>
    </div>
  );
}
