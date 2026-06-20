"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { DURATION, EASE_OUT_QUINT } from "@/lib/motion";
import { useReveal } from "@/components/motion/useReveal";

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
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
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
