import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { ProfileHistoryPanel } from "@/features/profile";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "歷史人格紀錄",
  description: `查看你過往的 Spotify 音樂人格分析報告。${SITE.name} — ${SITE.tagline}`,
  path: "/profile",
});

export default function ProfilePage() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]"
        aria-hidden
      />
      <section className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            {SITE.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">歷史人格紀錄</h1>
          <p className="mt-2 text-muted-foreground">
            每一次音樂人格檢測都會留下一份報告。
          </p>
        </header>
        <ProfileHistoryPanel />
      </section>
    </div>
  );
}
