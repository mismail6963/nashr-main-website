"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useRef, type ReactNode } from "react";
import { EASE_OUT_QUINT } from "@/lib/motion";
import { useReveal } from "@/components/motion/useReveal";

type Word = string | { text: string; accent?: boolean };

type Props = {
  /** Either pre-split words OR a plain string (auto-split on whitespace). */
  words?: Word[];
  text?: string;
  /** Tag for the wrapping element. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Trigger on mount? Otherwise scroll-in once. */
  onMount?: boolean;
  /** Stagger between words (s). Default 60ms. */
  stagger?: number;
  /** Initial delay (s) before the first word reveals. */
  delay?: number;
  /** Each word reveal duration (s). */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible label for the headline (read once by screen readers). */
  ariaLabel: string;
  children?: ReactNode;
};

/**
 * Per-word reveal with clip-path mask, slides up from below.
 * Each word is wrapped in an overflow-hidden mask. The word itself
 * translates up from 110% → 0%.
 *
 * Used for the hero headline. Honours prefers-reduced-motion.
 */
export function SplitText({
  words,
  text,
  as = "h1",
  onMount = false,
  stagger = 0.06,
  delay = 0,
  duration = 0.42,
  className,
  style,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.h1;
  const ref = useRef<HTMLHeadingElement>(null);
  // Scroll-in headlines reveal via the reliable hook; `onMount` headlines (the
  // hero) animate immediately. Either way the words always reach their visible
  // state, so a missed observer never leaves a headline blank.
  const shown = useReveal(ref);

  // If `text` was provided instead of `words`, auto-split on whitespace.
  const resolvedWords: Word[] = words ?? (text ? text.split(/\s+/) : []);

  // Reduced motion: static render, no animation, no clip masks.
  if (reduce) {
    const StaticTag = as as keyof React.JSX.IntrinsicElements;
    return (
      <StaticTag className={className} style={style} aria-label={ariaLabel}>
        {resolvedWords.map((w, i) => {
          const isObj = typeof w === "object";
          const wordText = isObj ? w.text : w;
          const accent = isObj && w.accent;
          return (
            <Fragment key={i}>
              <span style={accent ? { color: "var(--gold)" } : undefined}>
                {wordText}
              </span>
              {i < resolvedWords.length - 1 && " "}
            </Fragment>
          );
        })}
      </StaticTag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      aria-label={ariaLabel}
      initial="hidden"
      animate={onMount || shown ? "visible" : "hidden"}
    >
      <span className="sr-only">{ariaLabel}</span>
      {resolvedWords.map((w, i) => {
        const isObj = typeof w === "object";
        const wordText = isObj ? w.text : w;
        const accent = isObj && w.accent;
        return (
          <Fragment key={i}>
            <span
              aria-hidden
              className="inline-block overflow-hidden align-baseline"
              style={{ verticalAlign: "bottom", paddingBottom: "0.04em" }}
            >
              <motion.span
                className="inline-block"
                style={accent ? { color: "var(--gold)" } : undefined}
                variants={{
                  hidden: { y: "110%" },
                  visible: { y: "0%" },
                }}
                transition={{
                  duration,
                  delay: delay + i * stagger,
                  ease: EASE_OUT_QUINT,
                }}
              >
                {wordText}
              </motion.span>
            </span>
            {i < resolvedWords.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}
