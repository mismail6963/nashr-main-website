"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { EASE_OUT_QUINT, REVEAL_VIEWPORT } from "@/lib/motion";

type Step = { num: string; title: string; body: string };
type Handover = {
  labels: { you: string; us: string };
  youProvide: string[];
  nashrHandles: string[];
};

export function SectionHow() {
  const t = useTranslations("how");
  const steps = (t.raw("steps") as Step[]) ?? [];
  const handover = t.raw("handover") as Handover;

  return (
    <SectionShell
      id="how"
      number="2.0"
      label={t("ref")}
      watermark="02"
      elevated
    >
      <Reveal>
        <h2 className="t-h1 max-w-[24ch] text-[var(--fg)]">
          {t("headline")}
        </h2>
      </Reveal>

      {/* Row-based timeline. Each step is a 2-col grid (num | content)
          with a 1px hairline beneath. Active row gold-highlights the num. */}
      <ol className="mt-20 border-b border-[var(--border)]">
        {steps.map((step, i) => (
          <TimelineRow key={i} step={step} index={i} />
        ))}
      </ol>

      {/* You provide / NASHR handles split */}
      <Reveal delay={0.1}>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 border-t border-[var(--border)]">
          <SplitColumn label={handover.labels.you} items={handover.youProvide} />
          <SplitColumn
            label={handover.labels.us}
            items={handover.nashrHandles}
            border
          />
        </div>
      </Reveal>
    </SectionShell>
  );
}

function TimelineRow({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const reduce = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr] gap-6 border-t border-[var(--border)] py-8 md:py-10 transition-colors duration-200 hover:bg-[var(--bg)]/40"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.42, delay: index * 0.04, ease: EASE_OUT_QUINT }}
    >
      <span
        className="ltr-mono pt-1"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "12px",
          letterSpacing: "0.08em",
          color: inView ? "var(--gold-bright)" : "var(--fg-faint)",
          transition: "color 200ms var(--ease-out-quint)",
        }}
      >
        {step.num}
      </span>
      <div>
        <h3 className="t-body-lg font-medium text-[var(--fg)] uppercase tracking-[0.06em]">
          {step.title}
        </h3>
        <p className="mt-2 t-body text-[var(--fg-secondary)] max-w-[640px]">
          {step.body}
        </p>
      </div>
    </motion.li>
  );
}

function SplitColumn({
  label,
  items,
  border,
}: {
  label: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div
      className="py-10 md:py-12"
      style={{
        borderInlineStart: border ? "1px solid var(--border)" : undefined,
        paddingInlineStart: border ? "clamp(20px, 3vw, 48px)" : undefined,
        paddingInlineEnd: !border ? "clamp(20px, 3vw, 48px)" : undefined,
      }}
    >
      <Mono size={11} tone="muted">
        {label}
      </Mono>
      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-[var(--fg-secondary)] t-body"
          >
            <span aria-hidden className="text-[var(--fg-faint)] select-none">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
