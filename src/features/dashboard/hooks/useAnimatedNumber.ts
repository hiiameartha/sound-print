"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";

type UseAnimatedNumberOptions = {
  duration?: number;
  decimals?: number;
};

export function useAnimatedNumber(
  target: number,
  { duration = 1.1, decimals = 0 }: UseAnimatedNumberOptions = {},
) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        const factor = 10 ** decimals;
        setDisplay(Math.round(value * factor) / factor);
      },
    });
    return () => controls.stop();
  }, [target, duration, decimals]);

  return display;
}
