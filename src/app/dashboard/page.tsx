import type { Metadata } from "next";
import { DashboardContent } from "@/features/dashboard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "音樂人格報告",
  description:
    "Life is Fine：Tell me what you listen to, and I'll tell you who you are. 你的音樂人格、特質雷達與 AI 評論。",
  path: "/dashboard",
});

export default function DashboardPage() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]"
        aria-hidden
      />
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <DashboardContent />
      </section>
    </div>
  );
}
