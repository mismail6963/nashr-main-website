"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Fixed, full-viewport atmospheric backdrop.
 * Three blurred radial blobs drift on an 18s loop, with a fine grain
 * noise overlay on top. This is the single most important atmospheric
 * layer in the design system.
 */
export function GradientMesh() {
  const reduce = useReducedMotion();

  const drift = (dx: number, dy: number) =>
    reduce
      ? undefined
      : {
          x: [0, dx, -dx * 0.5, 0],
          y: [0, dy, -dy * 0.6, 0],
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Navy deep glow — bottom left */}
      <motion.div
        className="motion-drift absolute"
        style={{
          left: "-15%",
          top: "20%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(closest-side, rgba(12, 36, 60, 0.95), transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.85,
        }}
        animate={drift(60, -40)}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold warm glow — top right */}
      <motion.div
        className="motion-drift absolute"
        style={{
          right: "-10%",
          top: "-15%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(closest-side, rgba(164, 143, 96, 0.28), transparent 70%)",
          filter: "blur(140px)",
          opacity: 0.7,
        }}
        animate={drift(-40, 50)}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Deep blue accent — bottom right */}
      <motion.div
        className="motion-drift absolute"
        style={{
          right: "5%",
          bottom: "-20%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(closest-side, rgba(20, 50, 90, 0.6), transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.6,
        }}
        animate={drift(50, -30)}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grain noise overlay — SVG fractal turbulence as data URI */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Top edge vignette — subtle darkening so header content reads */}
      <div
        className="absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7, 16, 28, 0.85), transparent)",
        }}
      />
    </div>
  );
}
