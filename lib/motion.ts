// Single source of truth for motion timing.
// Reveals use out-quint; the one continuous loop uses ease-in-out.
// Anything not in this file is a build mistake.

export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.6, 1] as const;

export const DURATION = {
  micro: 0.18,
  content: 0.42,
  hero: 0.72,
} as const;

export const STAGGER = 0.04; // 40ms

// Shared IntersectionObserver options for reveal-once
export const REVEAL_VIEWPORT = {
  once: true,
  margin: "-10% 0px 0px 0px",
  amount: 0,
} as const;
