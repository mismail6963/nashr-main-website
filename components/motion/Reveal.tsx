"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_QUINT, REVEAL_VIEWPORT } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  /** translateY offset in px. Default 8 (Linear-restrained). */
  y?: number;
  duration?: number;
  className?: string;
};

/**
 * The only reveal primitive on the site.
 * IntersectionObserver-based, reveal-once. Transform + opacity only.
 * EASE_OUT_QUINT. No other curves.
 */
export function Reveal({
  children,
  delay = 0,
  y = 8,
  duration = DURATION.content,
  className,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_QUINT,
      }}
    >
      {children}
    </motion.div>
  );
}
