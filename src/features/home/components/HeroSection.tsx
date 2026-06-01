"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { HeroAnimatedBackground } from "@/features/home/components/HeroAnimatedBackground";
import { HeroKpiPanel } from "@/features/home/components/HeroKpiPanel";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const MotionLink = motion.create(Link);

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <HeroAnimatedBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div
              className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border/80",
                "bg-linear-to-br from-cyan-500/10 via-background to-violet-500/10 shadow-lg backdrop-blur-sm",
                "dark:from-cyan-400/15 dark:to-violet-400/15",
              )}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl ring-1 ring-cyan-500/30"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <Terminal
                className="h-10 w-10 text-cyan-600 dark:text-cyan-400"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Life
            </span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400">
              .EXE
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 font-mono text-sm tracking-widest text-cyan-600/90 uppercase dark:text-cyan-400/90"
          >
            人生執行中
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            人生不是只有工作，也值得有儀表板
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <MotionLink
              href="/assessment"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-8",
                "bg-primary text-sm font-semibold text-primary-foreground shadow-lg",
                "transition-shadow hover:shadow-cyan-500/25 dark:hover:shadow-cyan-400/20",
              )}
            >
              開始檢測人生
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </MotionLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full flex-shrink-0 lg:w-auto"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroKpiPanel />
        </motion.div>
      </div>
    </section>
  );
}
