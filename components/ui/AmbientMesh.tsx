"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "hero" | "stats";
  className?: string;
};

/**
 * CSS-only animated mesh gradient. Three soft radial blobs drifting
 * on independent loops (18s / 22s / 27s) at low opacity. Zero JS
 * runtime cost beyond the keyframe declarations.
 *
 * Two variants:
 *   "hero"  — softer, broader, used behind the hero text column
 *   "stats" — denser, golder, used behind the About section stat row
 *
 * Honours prefers-reduced-motion by freezing the blobs in place.
 */
export function AmbientMesh({ variant = "hero", className }: Props) {
  const reduce = useReducedMotion();
  const animClass = reduce ? "" : `ambient-${variant}-anim`;

  const isStats = variant === "stats";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ zIndex: 0 }}
    >
      <div
        className={cn("ambient-blob ambient-blob-a", animClass)}
        style={{
          background: isStats
            ? "radial-gradient(closest-side, rgba(199,178,122,0.18), transparent 70%)"
            : "radial-gradient(closest-side, rgba(255,255,255,0.04), transparent 70%)",
          width: isStats ? "60vw" : "50vw",
          height: isStats ? "60vw" : "50vw",
          filter: isStats ? "blur(120px)" : "blur(160px)",
          top: "-20%",
          left: "-10%",
        }}
      />
      <div
        className={cn("ambient-blob ambient-blob-b", animClass)}
        style={{
          background: isStats
            ? "radial-gradient(closest-side, rgba(164,143,96,0.14), transparent 70%)"
            : "radial-gradient(closest-side, rgba(164,143,96,0.06), transparent 70%)",
          width: isStats ? "50vw" : "40vw",
          height: isStats ? "50vw" : "40vw",
          filter: "blur(140px)",
          top: "20%",
          right: "-10%",
        }}
      />
      <div
        className={cn("ambient-blob ambient-blob-c", animClass)}
        style={{
          background: isStats
            ? "radial-gradient(closest-side, rgba(247,248,248,0.05), transparent 70%)"
            : "radial-gradient(closest-side, rgba(247,248,248,0.03), transparent 70%)",
          width: isStats ? "45vw" : "55vw",
          height: isStats ? "45vw" : "55vw",
          filter: "blur(150px)",
          bottom: "-15%",
          left: "20%",
        }}
      />
    </div>
  );
}
