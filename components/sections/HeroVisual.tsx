"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Hero right-side visual.
 *
 * Concentric thin gold rings — three of them — rotating at different
 * speeds. Inside the innermost ring sits the Arabic glyph "ن" (the
 * letter Nūn, the first letter of NASHR). Three pulsing dots are
 * positioned around the rings as Saudi city markers (Riyadh, Jeddah,
 * Dammam).
 *
 * Implementation note: we went with concentric rings rather than the
 * full wireframe globe described as the primary option. The globe added
 * meaningful weight (geo coords, projection math, 60fps rotation of
 * hundreds of line segments) for no clearer storytelling than the
 * rings — the rings already evoke "broadcast / publish / reach", which
 * matches the meaning of nashr (نَشْر).
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -120]);

  const rings = [
    { r: 220, speed: 80, dasharray: undefined, opacity: 0.45 },
    { r: 160, speed: -55, dasharray: "2 8", opacity: 0.6 },
    { r: 100, speed: 40, dasharray: undefined, opacity: 0.8 },
  ];

  // Pulse dot positions on the outer ring — Riyadh (center-right),
  // Jeddah (left), Dammam (top-right). Angles in degrees from 12 o'clock.
  const cities = [
    { name: "Riyadh", angle: 90, ring: 220 },
    { name: "Jeddah", angle: 230, ring: 220 },
    { name: "Dammam", angle: 40, ring: 220 },
  ];

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
      style={{ y: reduce ? 0 : y }}
    >
      <svg
        viewBox="-260 -260 520 520"
        className="h-full w-full"
        role="img"
        aria-label="NASHR — three concentric gold rings centered on the Arabic letter Nūn"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,184,114,0.35)" />
            <stop offset="100%" stopColor="rgba(212,184,114,0)" />
          </radialGradient>
        </defs>

        {/* Soft center glow */}
        <circle cx="0" cy="0" r="120" fill="url(#centerGlow)" />

        {/* Concentric rings */}
        {rings.map((ring, i) => (
          <motion.g
            key={i}
            animate={reduce ? undefined : { rotate: ring.speed > 0 ? 360 : -360 }}
            transition={{
              duration: Math.abs(ring.speed),
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ transformOrigin: "0 0" }}
          >
            <circle
              cx="0"
              cy="0"
              r={ring.r}
              fill="none"
              stroke="#a48f60"
              strokeWidth="1"
              strokeOpacity={ring.opacity}
              strokeDasharray={ring.dasharray}
            />
            {/* A small tick mark on the ring so rotation is visible */}
            <circle
              cx={ring.r}
              cy="0"
              r="2"
              fill="#d4b872"
            />
          </motion.g>
        ))}

        {/* City pulse dots — anchored to outer ring, not rotating */}
        {cities.map((city) => {
          const rad = ((city.angle - 90) * Math.PI) / 180;
          const cx = Math.cos(rad) * city.ring;
          const cy = Math.sin(rad) * city.ring;
          return (
            <g key={city.name}>
              {/* Pulse */}
              {!reduce && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="none"
                  stroke="#d4b872"
                  strokeWidth="1"
                  initial={{ r: 4, opacity: 0.8 }}
                  animate={{ r: 18, opacity: 0 }}
                  transition={{
                    duration: 2.4,
                    ease: "easeOut",
                    repeat: Infinity,
                    delay: cities.indexOf(city) * 0.6,
                  }}
                />
              )}
              <circle cx={cx} cy={cy} r="4" fill="#d4b872" />
            </g>
          );
        })}

        {/* Center Arabic glyph "ن" (Nūn) */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f2efe8"
          style={{
            fontFamily: "var(--font-arabic), serif",
            fontSize: "92px",
            fontWeight: 500,
          }}
        >
          ن
        </text>
      </svg>

      {/* Faint city labels around the visual — mono, very small */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { name: "RIYADH", top: "50%", right: "-4%", align: "left" as const },
          { name: "JEDDAH", top: "84%", left: "0%", align: "right" as const },
          { name: "DAMMAM", top: "16%", right: "8%", align: "left" as const },
        ].map((label, i) => (
          <span
            key={i}
            className="force-ltr absolute font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]/70"
            style={{
              fontFamily: "var(--font-mono), monospace",
              top: label.top,
              left: label.left,
              right: label.right,
              transform: "translateY(-50%)",
              textAlign: label.align,
            }}
          >
            {label.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
