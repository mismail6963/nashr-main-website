"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts up from 0 → `to` when the element scrolls into view.
 * Respects prefers-reduced-motion by jumping straight to the final value.
 */
export function CountUp({ to, suffix = "", duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setValue(v);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  // Preserve integer vs float display
  const formatted = Number.isInteger(to)
    ? Math.round(value).toString()
    : value.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
