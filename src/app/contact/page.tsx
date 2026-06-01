import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "聯絡我們",
  description: "與 Life is Fine 團隊取得聯繫。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">聯絡我們</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        聯絡表單與客服管道將在此建立。目前為架構佔位頁面。
      </p>
    </section>
  );
}
