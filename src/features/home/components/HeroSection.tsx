"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Music2 } from "lucide-react";
import { HeroAnimatedBackground } from "@/features/home/components/HeroAnimatedBackground";
import { HeroPersonalityPreview } from "@/features/home/components/HeroPersonalityPreview";
import { SITE } from "@/constants/site";
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
              <Music2
                className="h-10 w-10 text-[#1DB954]"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <MotionLink
              href="/spotify"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-8",
                "bg-primary text-sm font-semibold text-primary-foreground shadow-lg",
                "transition-shadow hover:shadow-cyan-500/25 dark:hover:shadow-cyan-400/20",
              )}
            >
              用 Spotify 解鎖音樂人格
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </MotionLink>
          </motion.div>
        </motion.div>

        <div className="w-full shrink-0 lg:w-auto">
          <HeroPersonalityPreview />
        </div>
      </div>
    </section>
  );
}
