"use client";

import { motion } from "framer-motion";
import { useAnimatedNumber } from "@/features/dashboard/hooks/useAnimatedNumber";
import { cn } from "@/lib/utils";

type AnimatedScoreProps = {
  value: number;
  className?: string;
  decimals?: number;
  suffix?: string;
};

export function AnimatedScore({
  value,
  className,
  decimals = 0,
  suffix,
}: AnimatedScoreProps) {
  const display = useAnimatedNumber(value, { decimals });

  return (
    <motion.span
      className={cn("font-mono tabular-nums", className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
