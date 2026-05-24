"use client";

import { useTranslations } from "next-intl";
import {
  Languages,
  Smartphone,
  MessageCircle,
  Calendar,
  MapPin,
  MessageSquare,
  Layers,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { GlowCard } from "@/components/ui/GlowCard";

type Capability = { title: string; body: string };

const ICONS: LucideIcon[] = [
  Languages,
  Smartphone,
  MessageCircle,
  Calendar,
  MapPin,
  MessageSquare,
  Layers,
  Search,
  ShieldCheck,
];

export function SectionHelp() {
  const t = useTranslations("help");
  const capabilities = (t.raw("cards") as Capability[]) ?? [];

  return (
    <section
      id="help"
      className="relative px-6 md:px-10"
      style={{ paddingBlock: "clamp(96px, 12vw, 192px)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionLabel number="03" label={t("label")} />
        </ScrollReveal>

        <div className="mt-10 md:mt-14">
          <TextReveal
            as="h2"
            text={t("headline")}
            className="max-w-[24ch] text-[var(--fg)]"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "var(--text-h1)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          />
        </div>

        <ScrollReveal delay={0.1}>
          <p
            className="mt-8 max-w-[60ch] text-[var(--fg-muted)]"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
          >
            {t("sub")}
          </p>
        </ScrollReveal>

        {/* 3-col grid (1/2/3) */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {capabilities.map((cap, i) => {
            const Icon = ICONS[i] ?? Layers;
            return (
              <ScrollReveal
                key={i}
                delay={(i % 3) * 0.08 + Math.floor(i / 3) * 0.04}
              >
                <GlowCard className="h-full">
                  <Icon
                    size={32}
                    strokeWidth={1.5}
                    className="mb-6"
                    style={{ color: "var(--gold)" }}
                    aria-hidden
                  />
                  <h3
                    className="mb-3 text-[var(--fg)]"
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {cap.title}
                  </h3>
                  <p
                    className="text-[var(--fg-muted)]"
                    style={{ fontSize: "15px", lineHeight: 1.6 }}
                  >
                    {cap.body}
                  </p>
                </GlowCard>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2}>
          <p
            className="force-ltr mt-14 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {t("disclaimer")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
