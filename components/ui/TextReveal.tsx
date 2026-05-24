"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { createElement, type CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  /** Triggered on mount (true) or on scroll-in (false). Default scroll-in. */
  onMount?: boolean;
  delay?: number;
  /** Stagger between words, in seconds. */
  stagger?: number;
  /** Optional style override, applied to the outer container. */
  style?: CSSProperties;
  /** Optional class applied per-word — useful for italic + color overrides. */
  wordClassNames?: Record<number, string>;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * Splits text into words and reveals each one from below an overflow-hidden
 * mask. Linear-style. Use on every section title.
 */
export function TextReveal({
  text,
  className,
  onMount = false,
  delay = 0,
  stagger = 0.06,
  style,
  wordClassNames,
  as = "h2",
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Motion = motion[as] as typeof motion.h2;

  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const child = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (reduce) {
    return createElement(as, { className, style }, text);
  }

  return (
    <Motion
      className={className}
      style={style}
      initial="hidden"
      animate={onMount ? "visible" : undefined}
      whileInView={onMount ? undefined : "visible"}
      viewport={onMount ? undefined : { once: true, margin: "-80px" }}
      variants={container}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-baseline"
          style={{ marginRight: i === words.length - 1 ? 0 : "0.28em" }}
        >
          <motion.span
            variants={child}
            className={cn("inline-block", wordClassNames?.[i])}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Motion>
  );
}
