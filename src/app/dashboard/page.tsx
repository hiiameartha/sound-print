import type { Metadata } from "next";
import { DashboardContent } from "@/features/dashboard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "人生儀表板",
  description: "檢視六大維度評分與人生總分儀表板。",
  path: "/dashboard",
});

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          人生儀表板
        </h1>
        <p className="mt-3 text-muted-foreground">
          你的六大維度評分與總覽
        </p>
      </header>
      <DashboardContent />
    </section>
  );
}
