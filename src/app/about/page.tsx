import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "關於我們",
  description: `了解 ${SITE.name} 的使命與願景。`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">關於 {SITE.name}</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {SITE.name} 用 Spotify 聆聽資料推算你的音樂人格——{SITE.tagline}
        我們相信播放清單裡藏著真實的品味輪廓，並以規則引擎與可選的 AI 補強，產出可分享、可追蹤的人格報告。
      </p>
    </section>
  );
}
