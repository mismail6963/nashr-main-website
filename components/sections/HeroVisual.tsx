"use client";

// Designed as a portfolio piece — demonstrates the kind of polish NASHR ships for clients.
//
// Hero FIG 0.1: an editorial figure that visualizes the NASHR transformation.
// - BEFORE: a dim browser frame with a 404 / "your customers leave" state
// - AFTER:  a fully built bilingual site preview with WhatsApp FAB, headline
//           sweeping highlight, gold-accent CTA, EN/AR toggle, calendar booking
// - Connector: a 1px track with 3 gold dots traveling left → right (RTL: right → left)
// - 3D tilt on cursor proximity (max ±2.5°, spring-damped, hover-capable devices only)
// - Scroll-driven scale + opacity (0.75 → 1 → 0.75 across viewport pass)

import { useRef, type ReactNode } from "react";
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
  Lock,
  Smartphone,
  CalendarDays,
  CloudOff,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Mono } from "@/components/ui/Mono";
import { EASE_OUT_QUINT } from "@/lib/motion";

export function HeroVisual() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isAr = locale === "ar";
  const reduce = useReducedMotion();

  // Wrapper handles scroll-scrubbed scale + opacity per addendum §2
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

  // 3D tilt on cursor proximity
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
        className="relative group/fig"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative rounded-[12px] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 md:p-7"
          style={
            reduce
              ? undefined
              : {
                  rotateX: tiltXSpring,
                  rotateY: tiltYSpring,
                  transformStyle: "preserve-3d",
                }
          }
        >
          {/* LIVE badge — mono, top-right of outer sheet */}
          <span
            aria-hidden
            className="absolute z-20 font-mono pointer-events-none"
            style={{
              top: "16px",
              insetInlineEnd: "16px",
              background: "rgba(255,255,255,0.06)",
              color: "var(--fg-faint)",
              padding: "3px 7px",
              borderRadius: "3px",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            LIVE v2.04
          </span>

          {/* AFTER backdrop glow */}
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

          <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:gap-3">
            {/* BEFORE */}
            <div className="flex-1">
              <BrowserWindow
                variant="before"
                url={isAr ? "❌ لا يوجد موقع" : "❌ no website"}
              >
                <BeforeContent />
              </BrowserWindow>
              <div className="mt-3 text-center">
                <Mono size={11} tone="faint">{t("before")}</Mono>
              </div>
            </div>

            {/* Connector — traveling dots */}
            <Connector isAr={isAr} reduce={!!reduce} />

            {/* AFTER */}
            <div className="flex-1">
              <BrowserWindow
                variant="after"
                url="🔒 nashr.sa"
                showLive
              >
                <AfterContent isAr={isAr} reduce={!!reduce} />
              </BrowserWindow>
              <div className="mt-3 text-center">
                <Mono size={11} tone="gold">{t("after")}</Mono>
              </div>
            </div>
          </div>
        </motion.div>

        <figcaption className="mt-4 text-center">
          <Mono size={11} tone="faint">
            FIG 0.1 — {isAr ? "تحول نَشْر" : "THE NASHR TRANSFORMATION"}
          </Mono>
        </figcaption>
      </figure>
    </motion.div>
  );
}

/* ---------- Browser window chrome ---------- */

function BrowserWindow({
  variant,
  url,
  showLive,
  children,
}: {
  variant: "before" | "after";
  url: string;
  showLive?: boolean;
  children: ReactNode;
}) {
  const isBefore = variant === "before";
  return (
    <div
      className="relative overflow-hidden rounded-[10px] border"
      style={{
        borderColor: "var(--border)",
        background: isBefore ? "var(--bg-elevated)" : "var(--bg-card)",
        opacity: isBefore ? 0.7 : 1,
      }}
    >
      {/* Title bar */}
      <div
        className="relative flex h-7 items-center px-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="absolute left-3 flex items-center gap-[6px]" dir="ltr">
          <span
            className="block h-2.5 w-2.5 rounded-full"
            style={{ background: isBefore ? "rgba(255,95,87,0.4)" : "#FF5F57" }}
          />
          <span
            className="block h-2.5 w-2.5 rounded-full"
            style={{ background: isBefore ? "rgba(254,188,46,0.4)" : "#FEBC2E" }}
          />
          <span
            className="block h-2.5 w-2.5 rounded-full"
            style={{ background: isBefore ? "rgba(40,200,64,0.4)" : "#28C840" }}
          />
        </div>
        <div
          dir="ltr"
          className="mx-auto flex h-5 items-center rounded-[4px] px-2 gap-1"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            minWidth: "150px",
            justifyContent: "center",
          }}
        >
          <span
            className="font-mono whitespace-nowrap"
            style={{
              fontSize: "10px",
              letterSpacing: "0.02em",
              color: isBefore ? "var(--fg-faint)" : "var(--fg-secondary)",
            }}
          >
            {url}
          </span>
          {showLive && (
            <span
              className="ml-1 inline-flex items-center gap-1 font-mono"
              style={{
                fontSize: "8px",
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
          )}
        </div>
      </div>
      {/* Content — 16:10 aspect ratio reserves space */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- BEFORE content: 404 / broken state ---------- */

function BeforeContent() {
  const t = useTranslations("hero");
  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center gap-3 px-4">
      {/* Cross-hatch overlay — diagonal lines at 2% opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 13px)",
        }}
      />
      <CloudOff
        size={36}
        strokeWidth={1.25}
        aria-hidden
        style={{ color: "var(--fg-faint)", opacity: 0.6 }}
      />
      <div className="text-center">
        <Mono size={11} tone="faint">
          {t("brokenStateTitle")}
        </Mono>
        <p
          className="mt-1 t-mono-sm"
          style={{
            color: "var(--fg-faint)",
            opacity: 0.7,
            fontFamily: "var(--font-sans), sans-serif",
            letterSpacing: "-0.01em",
            fontSize: "11px",
            textTransform: "none",
          }}
        >
          {t("brokenStateSub")}
        </p>
      </div>
    </div>
  );
}

/* ---------- AFTER content: built bilingual site preview ---------- */

function AfterContent({ isAr, reduce }: { isAr: boolean; reduce: boolean }) {
  const t = useTranslations("hero");
  return (
    <div className="absolute inset-0 overflow-hidden p-3">
      {/* Faint gold radial glow behind the hero block */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: "10% 20% 50% 0",
          background:
            "radial-gradient(closest-side, rgba(164,143,96,0.10), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Top nav stub — wordmark + 3 nav rects + EN/AR pill */}
      <div className="relative flex items-center justify-between" dir="ltr">
        <div className="flex items-center gap-1">
          <span
            className="h-1 w-1 rounded-full bg-[var(--gold)]"
            aria-hidden
          />
          <span
            className="text-[8px] font-semibold tracking-[-0.03em]"
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
          <span style={{ color: "var(--fg-faint)" }}>/</span>
          <span style={{ color: "var(--fg-faint)" }}>AR</span>
        </div>
      </div>

      {/* Hero block — gold pill button + headline + body, all with subtle motion */}
      <div className="relative mt-3.5 flex flex-col gap-1.5">
        {/* CTA */}
        <span
          className="rounded-full px-2 py-0.5"
          style={{
            background: "var(--gold)",
            color: "#08090A",
            fontSize: "7px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            width: "fit-content",
          }}
        >
          BOOK A CALL
        </span>
        {/* Headline stub w/ sweeping highlight */}
        <div
          className="relative h-2 w-[80%] overflow-hidden rounded-sm"
          style={{ background: "rgba(247, 248, 248, 0.85)" }}
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
        {/* Body stub */}
        <div
          className="h-1 w-[70%] rounded-sm"
          style={{ background: "rgba(180, 184, 189, 0.35)" }}
        />
        <div
          className="h-1 w-[55%] rounded-sm"
          style={{ background: "rgba(180, 184, 189, 0.25)" }}
        />
      </div>

      {/* Lower row — 2 cells: phone+chat / calendar+highlight */}
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
        <div
          className="flex items-center gap-2 rounded-[4px] border p-2"
          style={{
            borderColor: "var(--border)",
            background: "rgba(8,9,10,0.5)",
          }}
        >
          <div className="relative">
            <Smartphone size={14} strokeWidth={1.5} style={{ color: "var(--fg-secondary)" }} aria-hidden />
            <MessageCircle
              size={8}
              strokeWidth={1.5}
              className="absolute -right-1.5 -top-1"
              style={{ color: "var(--gold-bright)" }}
              aria-hidden
            />
          </div>
          <Mono size={11} tone="faint">{t("featMobile")}</Mono>
        </div>
        <div
          className="flex items-center gap-2 rounded-[4px] border p-2"
          style={{
            borderColor: "var(--border)",
            background: "rgba(8,9,10,0.5)",
          }}
        >
          <div className="relative">
            <CalendarDays size={14} strokeWidth={1.5} style={{ color: "var(--fg-secondary)" }} aria-hidden />
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--gold-bright)" }}
            />
          </div>
          <Mono size={11} tone="faint">{t("featBooking")}</Mono>
        </div>
      </div>

      {/* Floating WhatsApp FAB bottom-right outside the grid */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          insetInlineEnd: "10px",
          bottom: "10px",
          width: "28px",
          height: "28px",
        }}
        animate={
          reduce
            ? undefined
            : {
                boxShadow: [
                  "0 0 0 0 rgba(164,143,96,0)",
                  "0 0 0 8px rgba(164,143,96,0.18)",
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
          <MessageCircle size={14} strokeWidth={2} style={{ color: "#08090A" }} />
        </div>
      </motion.div>

      {/* Padlock badge top-right tip — security signal */}
      <span
        aria-hidden
        className="absolute"
        style={{ top: "9px", insetInlineEnd: "60px" }}
      >
        <Lock size={9} strokeWidth={2} style={{ color: "#28C840", opacity: 0.6 }} />
      </span>
    </div>
  );
}

/* ---------- Connector with traveling gold dots ---------- */

function Connector({ isAr, reduce }: { isAr: boolean; reduce: boolean }) {
  // 3 dots, 800ms offsets, 3s total. Mobile = X axis, desktop = Y axis.
  // We render both sets and toggle visibility via responsive classes so
  // the motion keyframes stay axis-specific (no diagonal drift).
  const dots = [0, 0.8, 1.6];
  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center self-stretch py-2 lg:px-3 lg:py-0"
      style={{ minHeight: "32px" }}
    >
      {/* Track */}
      <div
        className="absolute bg-[var(--border-strong)]
                   left-1/2 top-1/2 h-px w-[60%] -translate-x-1/2 -translate-y-1/2
                   lg:left-auto lg:top-1/2 lg:h-[60%] lg:w-px lg:-translate-y-1/2 lg:translate-x-0"
      />

      {/* Mobile dots — travel along X */}
      {!reduce &&
        dots.map((delay, i) => (
          <motion.span
            key={`m-${i}`}
            className="lg:hidden absolute h-1 w-1 rounded-full bg-[var(--gold)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ boxShadow: "0 0 8px rgba(199,178,122,0.6)" }}
            animate={{
              x: isAr ? ["calc(30vw - 30px)", "calc(-30vw + 30px)"] : ["calc(-30vw + 30px)", "calc(30vw - 30px)"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 3, delay, ease: "easeInOut", repeat: Infinity }}
          />
        ))}

      {/* Desktop dots — travel along Y */}
      {!reduce &&
        dots.map((delay, i) => (
          <motion.span
            key={`d-${i}`}
            className="hidden lg:block absolute h-1 w-1 rounded-full bg-[var(--gold)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ boxShadow: "0 0 8px rgba(199,178,122,0.6)" }}
            animate={{
              y: ["-80px", "80px"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 3, delay, ease: "easeInOut", repeat: Infinity }}
          />
        ))}

      {/* Static arrow tip */}
      <span
        aria-hidden
        className="absolute font-mono text-[11px] text-[var(--gold-bright)]
                   left-[calc(50%+22px)] top-1/2 -translate-y-1/2
                   lg:left-1/2 lg:top-[calc(50%+22px)] lg:-translate-x-1/2 lg:translate-y-0"
      >
        <span className="lg:hidden">↓</span>
        <span className="hidden lg:inline">{isAr ? "←" : "→"}</span>
      </span>
    </div>
  );
}

// (Globe was previously imported as a placeholder; removed to keep imports clean.)
