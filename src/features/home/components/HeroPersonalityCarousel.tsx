"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getHeroCardAccent,
  HERO_PERSONALITY_CARDS,
  type HeroPersonalityCard,
} from "@/features/home/constants/hero-personality-cards";
import { TRAIT_CHART_COLORS } from "@/features/share/constants/trait-colors";
import { cn } from "@/lib/utils";

const ROTATE_MS = 3800;

function PersonalityCard({ card }: { card: HeroPersonalityCard }) {
  const accent = getHeroCardAccent(card.archetypeId);

  return (
    <article
      className={cn(
        "relative w-[min(100%,280px)] shrink-0 overflow-hidden rounded-2xl border border-border/70",
        "bg-background/70 p-5 shadow-xl backdrop-blur-md",
        "dark:border-white/10 dark:bg-background/50"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: accent }}
      />

      <h3 className="mt-2 text-xl font-bold tracking-tight">
        {card.primaryTitle}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        副人格 · {card.secondaryTitle}
      </p>

      <ul className="mt-4 space-y-2.5">
        {card.highlightTraits.map((trait) => (
          <li key={trait.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {trait.label} {trait.emoji}
              </span>
              <span
                className="font-mono text-sm font-bold tabular-nums"
                style={{ color: TRAIT_CHART_COLORS[trait.key] }}
              >
                {trait.value}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted/80">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${trait.value}%`,
                  backgroundColor: TRAIT_CHART_COLORS[trait.key],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function HeroPersonalityCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardCount = HERO_PERSONALITY_CARDS.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % cardCount) + cardCount) % cardCount);
    },
    [cardCount]
  );

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cardCount);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [cardCount, paused]);

  const activeCard = HERO_PERSONALITY_CARDS[activeIndex]!;

  return (
    <motion.div
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative flex min-h-[300px] items-center justify-center px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, x: 36, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -36, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <PersonalityCard card={activeCard} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {HERO_PERSONALITY_CARDS.map((card, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={card.id}
              type="button"
              aria-label={`查看 ${card.primaryTitle}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isActive
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/55"
              )}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
