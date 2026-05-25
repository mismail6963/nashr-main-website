"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_QUINT } from "@/lib/motion";

/**
 * Section divider: 240px hairline with a 4px gold dot at its midpoint.
 * Fades in via scroll-into-view with a tiny radial glow.
 *
 * Drop one of these between every section boundary.
 */
export function SectionDivider() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="container-page flex justify-center py-12 md:py-16 relative z-10"
    >
      <motion.div
        className="relative"
        style={{ width: "240px" }}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
      >
        <div className="absolute top-1/2 inset-x-0 h-px bg-[var(--border-strong)]" />
        <div
          className="relative mx-auto h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
          style={{ boxShadow: "0 0 0 4px var(--gold-faint), 0 0 16px rgba(164,143,96,0.25)" }}
        />
      </motion.div>
    </div>
  );
}
