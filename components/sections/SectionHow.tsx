"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";

type Step = { num: string; title: string; body: string };
type Handover = { youProvide: string[]; nashrHandles: string[]; labels: { you: string; us: string } };

export function SectionHow() {
  const t = useTranslations("how");
  const steps = (t.raw("steps") as Step[]) ?? [];
  const handover = t.raw("handover") as Handover;

  return (
    <section
      id="how"
      className="relative px-6 md:px-10"
      style={{ paddingBlock: "clamp(96px, 12vw, 192px)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="sticky top-[88px] z-20 -mb-2 w-fit">
          <SectionLabel number="02" label={t("label")} />
        </div>

        <div className="mt-10 md:mt-14">
          <TextReveal
            as="h2"
            text={t("headline")}
            className="max-w-[22ch] text-[var(--fg)]"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "var(--text-h1)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          />
        </div>

        {/* Timeline */}
        <div className="relative mt-20 md:mt-28">
          {/* Vertical rule — runs the full height of the steps */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 w-px bg-[var(--gold)]/20 ms-[15px] md:ms-[19px]"
          />

          <ol className="space-y-14 md:space-y-20">
            {steps.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} />
            ))}
          </ol>
        </div>

        {/* You provide / NASHR handles split */}
        <ScrollReveal delay={0.1}>
          <div className="mt-28 grid grid-cols-1 gap-10 rounded-2xl border border-[var(--surface-line)] bg-[var(--bg-card)]/40 p-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[var(--gold)]/15 md:p-0 rtl:md:divide-x-reverse">
            <SplitColumn
              label={handover.labels.you}
              items={handover.youProvide}
            />
            <SplitColumn
              label={handover.labels.us}
              items={handover.nashrHandles}
              accent
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TimelineStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  return (
    <li ref={ref} className="relative ps-14 md:ps-20">
      {/* Node */}
      <div
        aria-hidden
        className="absolute top-2 -start-px ms-[7px] md:ms-[11px]"
      >
        <div className="relative h-4 w-4">
          <div
            className="absolute inset-0 rounded-full border bg-[var(--bg)]"
            style={{
              borderColor: inView ? "var(--gold)" : "var(--gold-soft)",
              transition: "border-color 600ms var(--ease-out-expo)",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--gold)]"
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15,
            }}
            style={{ transformOrigin: "center" }}
          />
          {/* Pulse ring */}
          {inView && !reduce && (
            <motion.div
              className="absolute inset-0 rounded-full border border-[var(--gold)]"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 1.8,
                ease: "easeOut",
                delay: 0.3,
                repeat: 1,
              }}
            />
          )}
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.06 * index,
        }}
        className="rtl:md:[--x:16px]"
      >
        <div className="force-ltr flex items-baseline gap-4">
          <span
            className="select-none"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(48px, 6vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--gold-soft)",
            }}
          >
            {step.num}
          </span>
          <h3
            className="text-[var(--fg)]"
            style={{
              fontSize: "clamp(20px, 2vw, 24px)",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {step.title}
          </h3>
        </div>
        <p
          className="mt-4 max-w-[60ch] text-[var(--fg-muted)]"
          style={{ fontSize: "16px", lineHeight: 1.6 }}
        >
          {step.body}
        </p>
      </motion.div>
    </li>
  );
}

function SplitColumn({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="p-8 md:p-10">
      <p
        className="font-mono text-[11px] uppercase tracking-[0.2em]"
        style={{
          fontFamily: "var(--font-mono), monospace",
          color: accent ? "var(--gold)" : "var(--fg-muted)",
        }}
      >
        {label}
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-[var(--fg)]"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            <span
              aria-hidden
              className="select-none text-[var(--gold)]/60"
              style={{ marginTop: "2px" }}
            >
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
