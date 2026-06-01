"use client";

import { motion } from "framer-motion";

const ORBS = [
  { size: 420, x: "10%", y: "15%", color: "rgba(56, 189, 248, 0.35)", duration: 18 },
  { size: 360, x: "75%", y: "20%", color: "rgba(167, 139, 250, 0.3)", duration: 22 },
  { size: 300, x: "55%", y: "70%", color: "rgba(52, 211, 153, 0.28)", duration: 20 },
  { size: 280, x: "20%", y: "75%", color: "rgba(251, 191, 36, 0.22)", duration: 24 },
] as const;

export function HeroAnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/40 dark:to-muted/20" />

      <motion.div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {ORBS.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-500/60 to-transparent"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />
    </div>
  );
}
