import type { Metadata } from "next";
import { AssessmentForm } from "@/features/assessment";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "人生問卷",
  description: "六大維度自我評估：健康、財富、工作、社交、娛樂、成長。",
  path: "/assessment",
});

export default function AssessmentPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          Assessment.EXE
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          人生問卷
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          為六大生活維度評分（1–10），拖曳滑桿即可即時更新分數。完成後將計算總分並同步至你的儀表板。
        </p>
      </header>
      <AssessmentForm />
    </section>
  );
}
