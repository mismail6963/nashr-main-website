"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll with the v2 brief's exact config.
 * Disabled on touch devices (native scroll is better there)
 * and at prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Hydration beacon — signals to the blank-page failsafe (inline script in
    // the root layout) that the client bundle parsed and React mounted. If a
    // script error on an old browser aborts hydration, this never runs and the
    // failsafe reveals the content that `motion` server-rendered at opacity:0.
    (window as unknown as { __appHydrated?: boolean }).__appHydrated = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (touch) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    // Expose the instance so modals / overlays can stop+start scrolling.
    // BriefModal calls .stop() on open and .start() on close.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return null;
}
