"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "motion/react";

type InViewOptions = Parameters<typeof useInView>[1];

/**
 * Reliable reveal trigger for scroll-in animations.
 *
 * Framer Motion's IntersectionObserver (`useInView`) stays the primary trigger,
 * so reveals fire exactly as designed where it works. But on some devices that
 * observer can silently fail to fire (engine differences, content-visibility
 * interference, low-power/background throttling). Because every reveal starts at
 * opacity:0, a missed trigger previously left content permanently hidden — the
 * structure rendered but the text/animations never appeared.
 *
 * This adds a dependency-free fallback: a plain getBoundingClientRect check on
 * scroll/resize (and once on mount) that reveals an element as soon as it enters
 * the viewport. Net effect: content is NEVER permanently hidden. The animation
 * still plays when the observer works; otherwise it degrades to reveal-on-scroll
 * and, as a last resort, just-visible. Reveal-once — returns true and latches.
 */
export function useReveal(
  ref: RefObject<Element | null>,
  options: InViewOptions = { once: true, margin: "-10% 0px 0px 0px" },
): boolean {
  const inView = useInView(ref, options);
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (inView && !shownRef.current) {
      shownRef.current = true;
      setShown(true);
    }
  }, [inView]);

  useEffect(() => {
    if (shownRef.current) return;

    const reveal = () => {
      if (shownRef.current) return true;
      const el = ref.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Mirror the ~10% top margin: reveal once the top edge is within 90% of
      // the viewport height and the element is not entirely above it.
      if (rect.top <= vh * 0.9 && rect.bottom >= 0) {
        shownRef.current = true;
        setShown(true);
        return true;
      }
      return false;
    };

    if (reveal()) return;

    const onChange = () => {
      if (reveal()) {
        window.removeEventListener("scroll", onChange);
        window.removeEventListener("resize", onChange);
      }
    };
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [shown, ref]);

  return shown;
}
