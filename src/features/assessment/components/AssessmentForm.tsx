"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  ASSESSMENT_DIMENSIONS,
  DEFAULT_ASSESSMENT_SCORES,
} from "@/features/assessment/constants/dimensions";
import { DimensionSliderField } from "@/features/assessment/components/DimensionSliderField";
import {
  buildAssessmentResult,
  calculateAverageScore,
  calculateTotalScore,
} from "@/features/assessment/lib/calculate-score";
import { getOrCreateLocalUserId, LifeRecordsService } from "@/features/life-records";
import {
  assessmentSchema,
  type AssessmentFormValues,
} from "@/features/assessment/schemas/assessment-schema";
import { useAssessmentStore } from "@/store/assessment-store";
import { cn } from "@/lib/utils";

export function AssessmentForm() {
  const router = useRouter();
  const setResult = useAssessmentStore((state) => state.setResult);
  const lifeRecordsService = useMemo(() => new LifeRecordsService(), []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: DEFAULT_ASSESSMENT_SCORES,
    mode: "onChange",
  });

  const watchedScores = watch();
  const liveTotal = useMemo(
    () => calculateTotalScore(watchedScores),
    [watchedScores],
  );
  const liveAverage = useMemo(
    () => calculateAverageScore(watchedScores),
    [watchedScores],
  );

  const onSubmit = async (data: AssessmentFormValues) => {
    const result = buildAssessmentResult(data);
    setResult(result);
    try {
      const userId = getOrCreateLocalUserId();
      await lifeRecordsService.saveFromAssessment(userId, result);
    } catch {
      // Supabase 未設定 / 連線失敗時，不阻擋使用者進入儀表板
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {ASSESSMENT_DIMENSIONS.map((dimension) => (
          <DimensionSliderField
            key={dimension.key}
            dimension={dimension}
            control={control}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              即時總分
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              六大維度加總（滿分 60）
            </p>
          </div>
          <div className="flex items-baseline gap-6">
            <div className="text-right">
              <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
                {liveTotal}
              </span>
              <span className="ml-1 font-mono text-lg text-muted-foreground">
                / 60
              </span>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-muted-foreground">平均</p>
              <p className="font-mono text-2xl font-semibold tabular-nums text-cyan-600 dark:text-cyan-400">
                {liveAverage}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-full",
          "bg-primary text-sm font-semibold text-primary-foreground",
          "transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            提交中…
          </>
        ) : (
          "完成問卷，前往儀表板"
        )}
      </button>
    </form>
  );
}
