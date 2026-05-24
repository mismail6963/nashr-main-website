"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { SectionRef } from "@/components/ui/SectionRef";
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
    <section id="how" className="section-pad below-fold hairline">
      <div className="container-page">
        <Reveal>
          <SectionRef number="2.0" label={t("ref")} />
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="t-h1 mt-10 md:mt-12 max-w-[22ch] text-[var(--fg)]">
            {t("headline")}
          </h2>
        </Reveal>

        {/* Timeline — sm: no rail. md+: hairline rail at left/right. */}
        <div className="mt-24 md:mt-32 relative">
          {/* Vertical rail */}
          <div
            aria-hidden
            className="hidden md:block absolute top-0 bottom-0 w-px bg-[var(--border)]"
            style={{
              insetInlineStart: "88px",
            }}
          />

          <ol className="space-y-20 md:space-y-24">
            {steps.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} />
            ))}
          </ol>
        </div>

        {/* You provide / NASHR handles split */}
        <Reveal delay={0.1}>
          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 border-t border-[var(--border)]">
            <SplitColumn label={handover.labels.you} items={handover.youProvide} />
            <SplitColumn
              label={handover.labels.us}
              items={handover.nashrHandles}
              border
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TimelineStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const reduce = useReducedMotion();

  return (
    <li ref={ref} className="relative md:ps-[176px]">
      {/* Node — md+ only */}
      <div
        aria-hidden
        className="hidden md:block absolute top-4 -translate-x-1/2 rtl:translate-x-1/2"
        style={{ insetInlineStart: "88px" }}
      >
        <div
          className="h-3 w-3 rounded-full border transition-all duration-300"
          style={{
            background: inView ? "var(--gold)" : "var(--border-strong)",
            borderColor: inView ? "var(--gold)" : "var(--border)",
            boxShadow: inView
              ? "0 0 0 4px var(--gold-faint)"
              : "0 0 0 0px transparent",
          }}
        />
      </div>

      {/* Step content */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.42,
          delay: 0.04 * index,
          ease: EASE_OUT_QUINT,
        }}
      >
        <div className="flex items-baseline gap-4 md:gap-6">
          <span
            className="ltr-mono inline-block"
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(48px, 5vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--fg-faint)",
              minWidth: "1.5em",
            }}
          >
            {step.num}
          </span>
          <h3 className="t-h2 text-[var(--fg)]">{step.title}</h3>
        </div>
        <p className="mt-4 ms-0 md:ms-[88px] t-body text-[var(--fg-secondary)] max-w-[520px]">
          {step.body}
        </p>
      </motion.div>
    </li>
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
