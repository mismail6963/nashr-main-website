"use client";

import { useTranslations } from "next-intl";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { CountUp } from "@/components/ui/CountUp";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export function SectionWhat() {
  const t = useTranslations("what");
  const stats = (t.raw("stats") as Stat[]) ?? [];

  return (
    <section
      id="what"
      className="relative px-6 md:px-10"
      style={{ paddingBlock: "clamp(96px, 12vw, 192px)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionLabel number="01" label={t("label")} />
        </ScrollReveal>

        <div className="mt-10 md:mt-14">
          <TextReveal
            as="h2"
            text={t("headline")}
            className="max-w-[18ch] text-[var(--fg)]"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "var(--text-h1)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
          {/* Left: intro paragraphs */}
          <ScrollReveal delay={0.1} className="md:col-span-7">
            <div className="space-y-6">
              <p
                className="max-w-[58ch] text-[var(--fg-muted)]"
                style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
              >
                {t("intro1")}
              </p>
              <p
                className="max-w-[58ch] text-[var(--fg-muted)]"
                style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
              >
                {t("intro2")}
              </p>
            </div>
          </ScrollReveal>

          {/* Right: 3 stacked stat blocks */}
          <div className="space-y-6 md:col-span-5">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={0.15 + i * 0.1}>
                <StatBlock stat={stat} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-[var(--surface-line)] bg-[var(--bg-card)]/60 p-7 transition-colors duration-300 hover:border-[var(--gold)]/30"
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(164,143,96,0.4), transparent)",
        }}
      />
      <div
        className="force-ltr flex items-baseline gap-1"
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: "clamp(56px, 8vw, 96px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
        }}
      >
        <CountUp to={stat.value} />
        {stat.suffix && (
          <span
            style={{
              fontSize: "0.5em",
              color: "var(--gold-bright)",
              marginInlineStart: "0.05em",
            }}
          >
            {stat.suffix}
          </span>
        )}
      </div>
      <div
        className="mt-4 h-px w-12 bg-[var(--gold)]/60"
        aria-hidden
      />
      <p
        className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {stat.label}
      </p>
    </div>
  );
}
