"use client";

import type { Control, FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { AssessmentFormValues } from "@/features/assessment/schemas/assessment-schema";
import type { AssessmentDimension } from "@/features/assessment/constants/dimensions";
import { cn } from "@/lib/utils";

type DimensionSliderFieldProps = {
  dimension: AssessmentDimension;
  control: Control<AssessmentFormValues>;
};

export function DimensionSliderField({
  dimension,
  control,
}: DimensionSliderFieldProps) {
  const Icon = dimension.icon;

  return (
    <Controller
      name={dimension.key as FieldPath<AssessmentFormValues>}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={cn(
            "rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm",
            fieldState.error && "border-red-500/50",
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
                  dimension.accent,
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {dimension.label}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {dimension.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "font-mono text-3xl font-bold tabular-nums",
                  dimension.accent,
                )}
              >
                {field.value}
              </span>
              <span className="block font-mono text-xs text-muted-foreground">
                / 10
              </span>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={field.value}
            onChange={(e) => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-cyan-600 dark:accent-cyan-400"
            aria-label={`${dimension.label} 評分`}
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={field.value}
          />

          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>1</span>
            <span>10</span>
          </div>

          {fieldState.error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
