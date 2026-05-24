"use client";

import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** If provided, the entire card becomes a link. */
  href?: string;
  external?: boolean;
  /** Intensity multiplier for the cursor glow (default 1). */
  intensity?: number;
  style?: CSSProperties;
};

/**
 * Card with bg-card background, 1px gold rule border, and a cursor-following
 * radial gold glow. Tracks mousemove and sets CSS vars --mx/--my.
 */
export function GlowCard({
  children,
  className,
  href,
  external,
  intensity = 1,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${mx}%`);
    ref.current.style.setProperty("--my", `${my}%`);
  };

  const inner = (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-[var(--bg-card)] p-8 transition-colors duration-300",
        "border-[var(--surface-line)] hover:border-[var(--gold)]/30",
        className,
      )}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--glow-intensity": intensity,
          ...style,
        } as CSSProperties
      }
    >
      {/* Cursor glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(164, 143, 96, calc(0.18 * var(--glow-intensity))), transparent 60%)",
        }}
      />
      {/* Top hairline highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(164,143,96,0.4), transparent)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );

  if (href) {
    const extProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} {...extProps} className="block focus-visible:outline-none">
        {inner}
      </a>
    );
  }

  return inner;
}
