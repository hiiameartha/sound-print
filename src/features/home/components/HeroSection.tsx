"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroAnimatedBackground } from "@/features/home/components/HeroAnimatedBackground";
import { HeroPersonalityCarousel } from "@/features/home/components/HeroPersonalityCarousel";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  analyzedCount: number | null;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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

export function HeroSection({ analyzedCount }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <HeroAnimatedBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-10 text-center">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="block">Tell me what you listen to,</span>
            <span className="mt-2 block bg-linear-to-r from-cyan-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-violet-300 dark:to-fuchsia-300">
              I&apos;ll tell you who you are.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-lg font-medium text-foreground sm:text-xl"
          >
            3 分鐘生成你的音樂人格
          </motion.p>

          {analyzedCount !== null ? (
            <motion.p
              variants={itemVariants}
              className="mt-2 font-mono text-sm tabular-nums text-muted-foreground"
            >
              已分析 {analyzedCount.toLocaleString("zh-TW")} 人
            </motion.p>
          ) : null}

          <motion.div variants={itemVariants} className="mt-8">
            <MotionLink
              href="/spotify"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-8",
                "bg-[#1DB954] text-sm font-semibold text-white shadow-lg",
                "transition-shadow hover:shadow-[#1DB954]/35",
              )}
            >
              用 Spotify 開始分析
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </MotionLink>
          </motion.div>
        </motion.div>

        <HeroPersonalityCarousel />
      </div>
    </section>
  );
}
