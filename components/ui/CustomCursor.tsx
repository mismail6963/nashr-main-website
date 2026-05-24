"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * 8px gold dot that follows the cursor; grows to a 32px outlined gold ring
 * on hover over interactive elements (a, button, [data-cursor="hover"]).
 *
 * Disabled on touch devices and at prefers-reduced-motion. Auto-hides
 * after 5s of mouse inactivity (so users who haven't moved a mouse don't
 * lose the native cursor).
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;
    setEnabled(true);

    const resetIdle = () => {
      setVisible(true);
      document.documentElement.classList.add("cursor-active");
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setVisible(false);
        document.documentElement.classList.remove("cursor-active");
      }, 5000);
    };

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      resetIdle();
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = !!target.closest(
        "a, button, [data-cursor='hover'], [role='button']",
      );
      setHover(interactive);
    };

    const handleLeave = () => {
      setVisible(false);
      document.documentElement.classList.remove("cursor-active");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("cursor-active");
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <motion.div
          animate={{
            width: hover ? 32 : 8,
            height: hover ? 32 : 8,
            backgroundColor: hover ? "transparent" : "#d4b872",
            borderColor: "#d4b872",
            borderWidth: hover ? 1.5 : 0,
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full"
        />
      </motion.div>
    </>
  );
}
