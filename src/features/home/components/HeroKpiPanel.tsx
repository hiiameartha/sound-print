"use client";

import { motion } from "framer-motion";
import { HERO_KPIS } from "@/features/home/constants/hero-kpis";
import { cn } from "@/lib/utils";

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.55, duration: 0.5, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export function HeroKpiPanel() {
  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-border/80 bg-background/60 p-5 shadow-xl backdrop-blur-md dark:bg-background/40"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          模擬 KPI
        </p>
        <motion.span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          LIVE
        </motion.span>
      </div>

      <ul className="space-y-4">
        {HERO_KPIS.map((kpi) => (
          <motion.li key={kpi.id} variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{kpi.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {kpi.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn("h-full rounded-full", kpi.accent)}
                initial={{ width: 0 }}
                animate={{ width: `${kpi.value}%` }}
                transition={{
                  delay: 0.7,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
