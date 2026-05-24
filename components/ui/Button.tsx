"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet";

type ButtonProps = {
  variant?: Variant;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

/**
 * Magnetic button. On hover, translates 4–6px toward the cursor when the
 * cursor enters an 80px radius. Three variants: primary (gold fill),
 * ghost (gold border), quiet (text + animated underline).
 */
export function Button({
  variant = "primary",
  href,
  external,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.max(rect.width, rect.height) / 2 + 60;
    if (dist < radius) {
      const strength = 0.18;
      x.set(dx * strength);
      y.set(dy * strength);
    }
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors duration-200 select-none whitespace-nowrap";

  const variants: Record<Variant, string> = {
    primary:
      "px-6 py-3.5 rounded-full bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold-bright)] shadow-[0_0_0_0_rgba(212,184,114,0)] hover:shadow-[0_0_40px_-4px_rgba(212,184,114,0.45)]",
    ghost:
      "px-6 py-3.5 rounded-full bg-transparent text-[var(--fg)] border border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/[0.06]",
    quiet:
      "px-1 py-1 text-[var(--fg)] hover:text-[var(--gold-bright)] [&_.underline-bar]:hover:scale-x-100",
  };

  const content = (
    <span className="relative inline-flex items-center gap-2">
      {children}
      {variant === "quiet" && (
        <span
          className="underline-bar absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-300"
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        />
      )}
    </span>
  );

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(base, variants[variant], className)}
    >
      {content}
    </motion.div>
  );

  if (href) {
    const extProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} {...extProps} className="inline-block focus-visible:outline-none">
        {inner}
      </a>
    );
  }

  return (
    <button type={type} {...rest} className="inline-block focus-visible:outline-none">
      {inner}
    </button>
  );
}
