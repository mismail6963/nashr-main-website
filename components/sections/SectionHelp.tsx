"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Languages,
  Smartphone,
  MessageCircle,
  Gauge,
  ShieldCheck,
  Layers,
  Tablet,
  Laptop,
  Monitor,
  Check,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

type Capability = {
  title: string;
  body: string;
  features: string[]; // 2–3 sub-bullets packed into the card via spacing
};

/**
 * §03 — What we build.
 *
 * Six cards covering all nine original features via creative packing:
 *
 *  1. Bilingual          → bilingual + content architecture (FAQ, team/service pages)
 *  2. Mobile-first       → mobile-first build + booking on small screens
 *  3. Conversational     → WhatsApp + AI chat assistant
 *  4. Performance        → <200ms TTFB + local SEO foundations
 *  5. Durability         → SSL + IP transfer + 'you own everything'
 *  6. Architecture       → maps + headless / modern stack
 *
 * Each card has a unique micro-animation that demonstrates its capability.
 */

const ICONS: LucideIcon[] = [
  Languages,
  Smartphone,
  MessageCircle,
  Gauge,
  ShieldCheck,
  Layers,
];

const BADGES = [
  { label: "CORE", active: true },
  { label: "FAST", active: false },
  { label: "ACTIVE", active: true },
  { label: "<200MS", active: false },
  { label: "FINAL", active: true },
  { label: "TECH", active: false },
];

export function SectionHelp() {
  const t = useTranslations("help");
  const caps = (t.raw("cards") as Capability[]) ?? [];

  return (
    <SectionShell
      id="help"
      number="3.0"
      label={t("ref")}
      watermark="03"
      dotGrid
    >
      <SplitText
        as="h2"
        className="t-h1 max-w-[22ch] text-[var(--fg)]"
        text={t("headline")}
        ariaLabel={t("headline")}
        stagger={0.06}
      />

      <Reveal delay={0.06}>
        <p className="t-body-lg mt-8 text-[var(--fg-secondary)] max-w-[600px]">
          {t("sub")}
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {caps.map((cap, i) => {
          const Icon = ICONS[i] ?? Layers;
          const badge = BADGES[i] ?? BADGES[0];
          return (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <CapabilityCard
                index={i}
                title={cap.title}
                body={cap.body}
                features={cap.features}
                Icon={Icon}
                badge={badge}
              />
            </Reveal>
          );
        })}
      </div>

      {/* Decorative hairline + dot */}
      <div className="mt-24 flex justify-center" aria-hidden>
        <div className="relative" style={{ width: "240px" }}>
          <div className="absolute top-1/2 inset-x-0 h-px bg-[var(--border-strong)]" />
          <div
            className="relative mx-auto h-1.5 w-1.5 rounded-full bg-[var(--gold-bright)]"
            style={{ boxShadow: "0 0 0 4px var(--gold-faint)" }}
          />
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------- CapabilityCard with per-index micro-animation ---------- */

function CapabilityCard({
  index,
  title,
  body,
  features,
  Icon,
  badge,
}: {
  index: number;
  title: string;
  body: string;
  features: string[];
  Icon: LucideIcon;
  badge: { label: string; active: boolean };
}) {
  return (
    <div className="group relative h-full bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors duration-200 overflow-hidden flex flex-col">
      {/* Top hairline highlight on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(164,143,96,0.5), transparent)",
        }}
      />
      {/* Status badge */}
      <span
        className={cn(
          "absolute top-4 status-badge",
          badge.active && "is-active",
        )}
        style={{ insetInlineEnd: "16px" }}
        aria-hidden
      >
        {badge.label}
      </span>

      {/* Top half: icon + micro-animation slot */}
      <div className="p-7 md:p-8 pb-4 flex-shrink-0">
        <Icon
          size={20}
          strokeWidth={1.5}
          style={{ color: "var(--fg-muted)" }}
          aria-hidden
        />
      </div>

      {/* Body content */}
      <div className="px-7 md:px-8 pb-4 flex-1">
        <h3 className="t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold-bright)] transition-colors duration-200">
          {title}
        </h3>
        <p className="mt-2 t-body text-[var(--fg-secondary)]">{body}</p>
      </div>

      {/* Micro-animation slot — bottom 1/3 of card */}
      <div className="px-7 md:px-8 pb-4 flex items-center justify-center min-h-[80px]">
        <MicroAnim index={index} />
      </div>

      {/* Sub-feature pills — bottom strip, mono uppercase */}
      <div
        className="px-7 md:px-8 py-3 border-t border-[var(--border)]"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {features.map((f, i) => (
            <span key={i} className="t-mono-sm font-mono uppercase text-[var(--fg-faint)]">
              {i > 0 && <span className="me-3 text-[var(--fg-faint)]/40">·</span>}
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- MicroAnim: one per card index ---------- */

function MicroAnim({ index }: { index: number }) {
  switch (index) {
    case 0: return <MicroBilingual />;
    case 1: return <MicroMobile />;
    case 2: return <MicroChat />;
    case 3: return <MicroPerf />;
    case 4: return <MicroLock />;
    case 5: return <MicroCode />;
    default: return null;
  }
}

/* 1. Bilingual — EN/AR text crossfade with dir flip */
function MicroBilingual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [showAr, setShowAr] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setShowAr((s) => !s), 3000);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="w-full font-mono text-[12px] text-[var(--fg-muted)]">
      <motion.div
        key={showAr ? "ar" : "en"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32 }}
        dir={showAr ? "rtl" : "ltr"}
        style={{
          fontFamily: showAr
            ? "var(--font-arabic), sans-serif"
            : "var(--font-sans), sans-serif",
          letterSpacing: showAr ? 0 : "-0.01em",
        }}
      >
        {showAr ? "موقع جاهز للسوق" : "Ready for market"}
      </motion.div>
    </div>
  );
}

/* 2. Mobile-first — device-stack pulse */
function MicroMobile() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % 4), 1000);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const devices = [Smartphone, Tablet, Laptop, Monitor];
  return (
    <div ref={ref} className="flex items-end gap-3">
      {devices.map((D, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: active === i ? 1 : 0.35,
            scale: active === i ? 1.1 : 1,
            color: active === i ? "var(--gold-bright)" : "var(--fg-muted)",
          }}
          transition={{ duration: 0.3 }}
        >
          <D size={16 + i * 2} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}

/* 3. WhatsApp + AI chat — 3-bubble cycle */
function MicroChat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % 3), 1700);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="w-full flex flex-col gap-1.5">
      <div className="flex justify-start">
        <span
          className="rounded-md border border-[var(--border)] px-2 py-1 t-mono-sm font-mono text-[var(--fg-secondary)]"
          style={{ fontSize: "10px" }}
        >
          Hi
        </span>
      </div>
      {stage >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <span
            className="rounded-md border border-[var(--gold)]/30 bg-[rgba(164,143,96,0.06)] px-2 py-1 text-[10px] font-mono text-[var(--gold-bright)]"
          >
            {stage === 1 ? "…" : "Confirmed ✓"}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* 4. Performance — speed gauge sweep */
function MicroPerf() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });

  // Gauge is a semicircle SVG; needle rotates from -90deg to +85deg
  const start = -90;
  const end = 85;
  const angle = inView && !reduce ? end : start;

  return (
    <div ref={ref} className="flex items-end gap-3">
      <svg viewBox="0 0 60 40" width="80" height="50" aria-hidden>
        {/* Arc — full sweep, faint */}
        <path
          d="M 6 34 A 24 24 0 0 1 54 34"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Active arc */}
        <motion.path
          d="M 6 34 A 24 24 0 0 1 54 34"
          stroke="var(--gold-bright)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="76"
          initial={{ strokeDashoffset: 76 }}
          animate={{ strokeDashoffset: inView && !reduce ? 0 : 76 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Needle */}
        <motion.line
          x1="30"
          y1="34"
          x2="30"
          y2="12"
          stroke="var(--fg)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transformOrigin: "30px 34px" }}
          initial={{ rotate: start }}
          animate={{ rotate: angle }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <circle cx="30" cy="34" r="2" fill="var(--gold-bright)" />
      </svg>
      <span className="t-mono-sm font-mono uppercase text-[var(--fg-muted)]">
        &lt;200ms
      </span>
    </div>
  );
}

/* 5. Durability — padlock close + ring expand */
function MicroLock() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="relative">
        <ShieldCheck
          size={28}
          strokeWidth={1.5}
          style={{ color: "var(--gold-bright)" }}
        />
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-[var(--gold)]"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={inView ? { scale: 2.4, opacity: 0 } : undefined}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Check size={12} strokeWidth={2} style={{ color: "#28C840" }} />
        <span className="t-mono-sm font-mono uppercase text-[var(--fg-muted)]">SSL</span>
      </div>
    </div>
  );
}

/* 6. Headless / architecture — scrolling code lines */
function MicroCode() {
  const reduce = useReducedMotion();
  const lines = [
    "GET /api/products",
    "{ status: 200 }",
    "cache: HIT",
    "GET /api/booking",
    "{ ok: true }",
  ];
  return (
    <div className="w-full h-[60px] overflow-hidden font-mono text-[10px] leading-[14px] text-[var(--fg-faint)]">
      <motion.div
        animate={reduce ? undefined : { y: ["0%", "-50%"] }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      >
        {[...lines, ...lines].map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </motion.div>
    </div>
  );
}
