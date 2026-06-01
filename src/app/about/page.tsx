import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "關於我們",
  description: "了解 Life is Fine 的使命與願景。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">關於 Life is Fine</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        我們相信每一天都值得被溫柔對待。此頁面為佔位內容。
      </p>
    </section>
  );
}
