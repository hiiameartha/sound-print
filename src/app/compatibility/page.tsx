import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { CompatibilityPanel } from "@/features/compatibility";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "人格相容性",
  description: `比較兩份音樂人格報告的相容程度。${SITE.name} — ${SITE.tagline}`,
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
          <h1 className="mt-2 text-3xl font-bold tracking-tight">人格相容性</h1>
          <p className="mt-2 text-muted-foreground">
            選兩份歷史報告，看看人格頻率有多接近（規則引擎，可重現、非 AI）。
          </p>
        </header>
        <CompatibilityPanel />
      </section>
    </div>
  );
}
