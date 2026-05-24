"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
};

/**
 * Whole-card-clickable magnetic tile. Tracks cursor for a 6px pull,
 * intensifies a radial glow, and exposes a tracked CSS var pair
 * --mx/--my for the child glow gradient.
 */
export function MagneticTile({
  href,
  external,
  children,
  className,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${mx}%`);
    ref.current.style.setProperty("--my", `${my}%`);

    if (reduce) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.08);
    y.set((e.clientY - cy) * 0.08);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x: sx,
        y: sy,
        // Glow trackers (consumed inside)
        ["--mx" as string]: "50%",
        ["--my" as string]: "50%",
      }}
      {...ext}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-[var(--bg-card)] p-10 transition-colors duration-300 focus-visible:outline-none",
        "border-[var(--surface-line)] hover:border-[var(--gold)]/50",
        className,
      )}
    >
      {/* Strong cursor glow — more intense than GlowCard */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), rgba(164, 143, 96, 0.28), transparent 60%)",
        }}
      />
      {/* Top hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(164,143,96,0.5), transparent)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.a>
  );
}
