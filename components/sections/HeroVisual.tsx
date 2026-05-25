"use client";

// Designed as a portfolio piece — demonstrates the kind of polish NASHR ships for clients.
//
// FIG 0.1 single-window redesign:
// - One browser window, full width of the figure container (no BEFORE/AFTER split)
// - Live chrome (3 colored traffic lights, nashr.sa URL pill, LIVE indicator)
// - Interior: top nav stub (NASHR + nav rects + EN|AR pill), gold CTA pill,
//   headline stub with a sweeping highlight on a 4s loop, 2 body stubs,
//   3 icon-only feature cells (Smartphone / MessageCircle / CalendarDays),
//   WhatsApp FAB bottom-corner with breathing glow on an 8s loop
// - Zero translatable internal text → no clipping risk in /ar; the only
//   string is the URL literal which stays English in both locales
// - Scroll-scrubbed scale (0.85 → 1 → 0.85) and 3D cursor tilt preserved
//   from the previous build; element positions auto-mirror via dir.

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  MessageCircle,
  Smartphone,
  CalendarDays,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { EASE_OUT_QUINT } from "@/lib/motion";

export function HeroVisual() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isAr = locale === "ar";
  const reduce = useReducedMotion();

  // Scroll-scrubbed scale + opacity. Unchanged from previous build.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.85, 1, 1, 0.85],
  );
  const opacityRaw = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.2, 1, 1, 0.4],
  );
  const scale = useSpring(scaleRaw, { stiffness: 200, damping: 30, mass: 0.6 });
  const opacity = useSpring(opacityRaw, { stiffness: 200, damping: 30, mass: 0.6 });

  // 3D tilt on cursor proximity. Unchanged.
  const figureRef = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 80, damping: 25, mass: 0.8 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 80, damping: 25, mass: 0.8 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !figureRef.current) return;
    const rect = figureRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    tiltY.set(dx * 2.5);
    tiltX.set(-dy * 2.5);
  };
  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      style={reduce ? undefined : { scale, opacity }}
      className="will-change-transform"
    >
      <figure
        ref={figureRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative"
        style={{ perspective: "1200px" }}
      >
        {/* Single browser window — full width of the figure container.
            The 3D tilt is applied here; the chrome + interior live inside. */}
        <motion.div
          className="relative overflow-hidden rounded-[12px] border bg-[var(--bg-card)]"
          style={
            reduce
              ? { borderColor: "var(--border)" }
              : {
                  borderColor: "var(--border)",
                  rotateX: tiltXSpring,
                  rotateY: tiltYSpring,
                  transformStyle: "preserve-3d",
                }
          }
        >
          {/* AFTER backdrop glow — the only place gold reaches beyond the
              surgical accent rule. Behind the bottom-right of the window. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -z-10 hidden lg:block"
            style={{
              width: "560px",
              height: "360px",
              insetInlineEnd: "-60px",
              bottom: "-40px",
              background:
                "radial-gradient(closest-side, rgba(164,143,96,0.10), transparent 70%)",
              filter: "blur(120px)",
            }}
          />

          {/* Browser title bar */}
          <BrowserChrome />

          {/* Browser content — 16:10 aspect for stable layout */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
            <SiteInterior reduce={!!reduce} />
          </div>
        </motion.div>

        <figcaption className="mt-4 text-center">
          <span
            dir="ltr"
            className="font-mono t-mono-sm uppercase text-[var(--fg-faint)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            FIG 0.1 —
          </span>{" "}
          <span className="t-mono-sm text-[var(--fg-faint)] section-ref-label">
            {t("figure.transformation")}
          </span>
        </figcaption>
      </figure>
    </motion.div>
  );
}

/* ---------- Browser chrome (title bar) ---------- */

function BrowserChrome() {
  return (
    <div
      className="relative flex h-8 items-center px-4"
      style={{
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Traffic-light dots — LTR-anchored so they auto-flip via the dir
          attribute on the html element. Live colors (not muted). */}
      <div className="absolute left-4 flex items-center gap-[8px]" dir="ltr">
        <span
          aria-hidden
          className="block h-3 w-3 rounded-full"
          style={{ background: "#FF5F57" }}
        />
        <span
          aria-hidden
          className="block h-3 w-3 rounded-full"
          style={{ background: "#FEBC2E" }}
        />
        <span
          aria-hidden
          className="block h-3 w-3 rounded-full"
          style={{ background: "#28C840" }}
        />
      </div>

      {/* URL pill — centered, with LIVE indicator beside it. Always LTR. */}
      <div
        dir="ltr"
        className="mx-auto flex h-6 items-center rounded-[6px] px-3 gap-2"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          minWidth: "200px",
          justifyContent: "center",
        }}
      >
        <span
          className="font-mono whitespace-nowrap"
          style={{
            fontSize: "11px",
            letterSpacing: "0.02em",
            color: "var(--fg-secondary)",
          }}
        >
          nashr.sa
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.12em",
            color: "#28C840",
          }}
        >
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{ background: "#28C840" }}
          />
          LIVE
        </span>
      </div>
    </div>
  );
}

/* ---------- Site interior (content area inside the browser window) ---------- */

function SiteInterior({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden p-4 md:p-5">
      {/* Faint gold radial glow behind the hero block */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: "10% 20% 40% 0",
          background:
            "radial-gradient(closest-side, rgba(164,143,96,0.10), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Top nav: wordmark + nav rects + EN|AR pill — all LTR-anchored so
          they auto-flip horizontal order via the html dir attribute */}
      <div className="relative flex items-center justify-between" dir="ltr">
        <div className="flex items-center gap-1">
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-[var(--gold)]"
          />
          <span
            className="text-[9px] font-semibold tracking-[-0.03em]"
            style={{ color: "var(--fg)" }}
          >
            NASHR
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[10, 8, 12].map((w, i) => (
            <span
              key={i}
              className="block h-[2px] rounded-full"
              style={{ width: `${w}px`, background: "rgba(180,184,189,0.3)" }}
            />
          ))}
        </div>
        <div
          className="inline-flex items-center gap-0.5 rounded-full border px-1 py-0.5 font-mono"
          style={{
            borderColor: "var(--gold)",
            fontSize: "7px",
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ color: "var(--gold-bright)" }}>EN</span>
          <span style={{ color: "var(--fg-faint)" }}>|</span>
          <span style={{ color: "var(--fg-faint)" }}>AR</span>
        </div>
      </div>

      {/* Hero block — items-start auto-flips to start side per direction
          (left in LTR, right in RTL). Pure shape stubs, no text. */}
      <div className="relative mt-5 flex flex-col gap-2 items-start">
        {/* CTA pill — text-less gold bar */}
        <span
          className="rounded-full"
          style={{
            background: "var(--gold)",
            width: "72px",
            height: "12px",
          }}
        />
        {/* Headline stub with sweeping highlight — 4s loop */}
        <div
          className="relative mt-1 h-2.5 overflow-hidden rounded-sm"
          style={{
            background: "rgba(247, 248, 248, 0.85)",
            width: "82%",
          }}
        >
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute inset-y-0 -left-1/3 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(199,178,122,0.7), transparent)",
                mixBlendMode: "screen",
              }}
              animate={{ x: ["0%", "400%"] }}
              transition={{
                duration: 4,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          )}
        </div>
        {/* 2 body stubs */}
        <div
          className="h-1.5 rounded-sm"
          style={{ width: "72%", background: "rgba(180, 184, 189, 0.35)" }}
        />
        <div
          className="h-1.5 rounded-sm"
          style={{ width: "58%", background: "rgba(180, 184, 189, 0.25)" }}
        />
      </div>

      {/* Feature row — 3 icon-only cells. Stays in a single row even on
          mobile per brief; the cells are square and the row is grid-3 so
          it'll never wrap. Direction-agnostic — same in both locales. */}
      <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5 grid grid-cols-3 gap-2">
        <FeatureCell icon={<Smartphone size={16} strokeWidth={1.5} />} />
        <FeatureCell icon={<MessageCircle size={16} strokeWidth={1.5} />} />
        <FeatureCell
          icon={
            <div className="relative">
              <CalendarDays size={16} strokeWidth={1.5} />
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--gold-bright)" }}
              />
            </div>
          }
        />
      </div>

      {/* Floating WhatsApp FAB — logical end corner (bottom-right LTR,
          bottom-left RTL) via inset-inline-end. Breathing glow 8s loop. */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          insetInlineEnd: "12px",
          bottom: "62px",
          width: "30px",
          height: "30px",
        }}
        animate={
          reduce
            ? undefined
            : {
                boxShadow: [
                  "0 0 0 0 rgba(164,143,96,0)",
                  "0 0 0 10px rgba(164,143,96,0.18)",
                  "0 0 0 0 rgba(164,143,96,0)",
                ],
              }
        }
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full"
          style={{ background: "var(--gold)" }}
        >
          <MessageCircle size={15} strokeWidth={2} style={{ color: "#08090A" }} />
        </div>
      </motion.div>

      {/* Subtle reveal of the interior elements on first scroll-in — kept
          to a single fade so it doesn't compete with the figure's own
          scroll-scrubbed scale animation. */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
        className="pointer-events-none absolute inset-0"
      />
    </div>
  );
}

function FeatureCell({ icon }: { icon: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center rounded-[4px] border min-h-[32px]"
      style={{
        borderColor: "var(--border)",
        background: "rgba(8,9,10,0.5)",
        color: "var(--fg-secondary)",
      }}
    >
      {icon}
    </div>
  );
}
