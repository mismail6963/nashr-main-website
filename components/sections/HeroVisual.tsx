"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Mono } from "@/components/ui/Mono";
import { EASE_OUT_QUINT } from "@/lib/motion";

/**
 * Hero visual — the BEFORE / AFTER composition per §6.2.
 *
 * On lg+: side-by-side with horizontal hairline connector + → arrow.
 * On md and below: stacked vertically with vertical connector + ↓ arrow.
 *
 * The connector arrow is the single perpetual-motion element on the
 * entire site (pure CSS keyframe, zero JS frame budget).
 */
export function HeroVisual() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isAr = locale === "ar";

  // Noise SVG for the BEFORE frame — signals brokenness, not atmosphere
  const noiseUrl =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <div className="relative">
      {/* AFTER backdrop glow — the only place gold goes beyond surgical accents.
          Positioned below+behind the AFTER frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 hidden lg:block"
        style={{
          width: "600px",
          height: "400px",
          right: "-80px",
          bottom: "-40px",
          background:
            "radial-gradient(closest-side, rgba(164,143,96,0.10), transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Mobile-only glow, smaller */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 lg:hidden"
        style={{
          width: "100%",
          height: "300px",
          bottom: "-40px",
          left: 0,
          background:
            "radial-gradient(closest-side, rgba(164,143,96,0.10), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-0">
        {/* BEFORE */}
        <div className="flex-1 lg:flex-1">
          <BrowserFrame
            variant="before"
            url={isAr ? "(لا يوجد موقع)" : "(no website)"}
          >
            <BeforeContent />
          </BrowserFrame>
          <div className="mt-4 text-center">
            <Mono size={11} tone="faint">{t("before")}</Mono>
          </div>
        </div>

        {/* Connector */}
        <div
          aria-hidden
          className="relative flex items-center justify-center self-stretch lg:px-6"
        >
          {/* Hairline — vertical on lg, horizontal on mobile */}
          <div
            className="absolute bg-[var(--border-strong)]
                       left-1/2 top-0 h-px w-[calc(100%-32px)] -translate-x-1/2
                       lg:left-auto lg:top-1/2 lg:h-[calc(100%-72px)] lg:w-px lg:-translate-y-1/2 lg:translate-x-0"
          />
          {/* Gold dot at midpoint */}
          <div
            className="relative h-1 w-1 rounded-full bg-[var(--gold)]"
            style={{ boxShadow: "0 0 0 4px rgba(164,143,96,0.12)" }}
          />
          {/* Arrow glyph — animates on a 2s nudge loop (CSS only) */}
          <div
            className="absolute font-mono text-[11px] text-[var(--fg-muted)]
                       left-[calc(50%+18px)] top-1/2 -translate-y-1/2
                       lg:left-1/2 lg:top-[calc(50%+18px)] lg:-translate-x-1/2 lg:translate-y-0"
          >
            {/* Mobile: ↓ vertical nudge */}
            <span className="connector-arrow vertical lg:hidden inline-block">↓</span>
            {/* Desktop LTR: → / Desktop RTL: ← */}
            <span className="connector-arrow horizontal hidden lg:inline-block">
              {isAr ? "←" : "→"}
            </span>
          </div>
        </div>

        {/* AFTER */}
        <div className="flex-1 lg:flex-1">
          <BrowserFrame variant="after" url="nashr.sa">
            <AfterContent />
          </BrowserFrame>
          <div className="mt-4 text-center">
            <Mono size={11} tone="gold">{t("after")}</Mono>
          </div>
        </div>
      </div>

      {/* Noise overlay across the whole BEFORE-frame zone — applied via background-image */}
      <style>{`.before-noise { background-image: ${noiseUrl}; }`}</style>
    </div>
  );
}

function BeforeContent() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Noise overlay — only inside the BEFORE frame */}
      <div
        aria-hidden
        className="before-noise pointer-events-none absolute inset-0"
        style={{ opacity: 0.06, mixBlendMode: "overlay" }}
      />

      {/* Broken bars */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: "24px",
          left: "24px",
          width: "40%",
          height: "8px",
          background: "rgba(98, 102, 109, 0.25)",
          transform: "rotate(-1deg)",
        }}
      />
      <div
        aria-hidden
        className="absolute"
        style={{
          top: "48px",
          left: "24px",
          width: "60%",
          height: "8px",
          background: "rgba(98, 102, 109, 0.25)",
          transform: "rotate(1deg)",
        }}
      />
      <div
        aria-hidden
        className="absolute"
        style={{
          top: "72px",
          left: "24px",
          width: "30%",
          height: "8px",
          background: "rgba(98, 102, 109, 0.25)",
          transform: "rotate(-0.5deg)",
        }}
      />

      {/* Bottom-right × */}
      <div
        aria-hidden
        className="absolute"
        style={{ bottom: "20px", right: "20px", color: "rgba(98,102,109,0.5)" }}
      >
        <X size={16} strokeWidth={1.5} />
      </div>
    </div>
  );
}

function AfterContent() {
  const reduce = useReducedMotion();

  // Reveal interior on scroll-in, 60ms stagger, total 600ms.
  const stagger = 0.06;

  const items = [
    // Headline bar — gold
    {
      key: "headline",
      style: {
        top: "28px",
        left: "28px",
        width: "60%",
        height: "24px",
        borderRadius: "6px",
        background: "var(--gold)",
      },
    },
    // Body lines
    {
      key: "body1",
      style: {
        top: "72px",
        left: "28px",
        width: "75%",
        height: "6px",
        background: "rgba(180, 184, 189, 0.35)",
      },
    },
    {
      key: "body2",
      style: {
        top: "86px",
        left: "28px",
        width: "65%",
        height: "6px",
        background: "rgba(180, 184, 189, 0.35)",
      },
    },
    // CTA pill
    {
      key: "cta",
      style: {
        top: "116px",
        left: "28px",
        width: "96px",
        height: "30px",
        borderRadius: "999px",
        background: "rgba(247, 248, 248, 0.95)",
      },
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Lang toggle indicator — top-right */}
      <div
        aria-hidden
        className="absolute flex items-center gap-1 font-mono"
        style={{ top: "20px", right: "20px" }}
      >
        <span
          style={{
            fontSize: "9px",
            color: "var(--fg)",
            paddingBottom: "1px",
            borderBottom: "1px solid var(--gold)",
          }}
        >
          EN
        </span>
        <span
          style={{
            fontSize: "9px",
            color: "var(--fg-faint)",
          }}
        >
          /
        </span>
        <span style={{ fontSize: "9px", color: "var(--fg-faint)" }}>AR</span>
      </div>

      {/* Bottom-right WhatsApp glyph */}
      <div
        aria-hidden
        className="absolute"
        style={{ bottom: "20px", right: "20px", color: "var(--fg-muted)" }}
      >
        <MessageCircle size={16} strokeWidth={1.5} />
      </div>

      {/* Animated interior */}
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          className="absolute"
          style={item.style as React.CSSProperties}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.42,
            delay: i * stagger,
            ease: EASE_OUT_QUINT,
          }}
        />
      ))}
    </div>
  );
}
