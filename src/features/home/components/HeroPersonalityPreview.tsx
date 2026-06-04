"use client";

import { motion } from "framer-motion";

const PREVIEW_TRAITS = [
  { label: "浪漫值", emoji: "❤️", value: 88 },
  { label: "懷舊值", emoji: "📼", value: 92 },
  { label: "情緒值", emoji: "🌙", value: 84 },
  { label: "探索值", emoji: "🚀", value: 37 },
] as const;

export function HeroPersonalityPreview() {
  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-border/80 bg-background/60 p-5 shadow-xl backdrop-blur-md dark:bg-background/40"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-[#1DB954]">
        音樂人格預覽
      </p>
      <p className="mt-3 text-2xl font-bold">凌晨哲學家</p>
      <p className="mt-1 text-sm text-muted-foreground">副人格 · 情緒 DJ</p>

      <ul className="mt-5 space-y-3">
        {PREVIEW_TRAITS.map((trait, idx) => (
          <motion.li
            key={trait.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + idx * 0.08 }}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {trait.label} {trait.emoji}
            </span>
            <span className="font-mono font-bold tabular-nums">{trait.value}</span>
          </motion.li>
        ))}
      </ul>

      <p className="mt-4 font-mono text-[10px] text-muted-foreground">
        連結 Spotify 後取得你的真實報告
      </p>
    </motion.div>
  );
}
