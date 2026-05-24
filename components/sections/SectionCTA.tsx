"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  CalendarClock,
  MessageCircle,
  Mail,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticTile } from "@/components/ui/MagneticTile";
import { getContactLinks } from "@/lib/contact";

type Tile = {
  channel: string;
  body: string;
  cta: string;
};

const ICONS: LucideIcon[] = [CalendarClock, MessageCircle, Mail];

export function SectionCTA() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const links = getContactLinks(locale);
  const tiles = (t.raw("tiles") as Tile[]) ?? [];

  const hrefs = [links.calcom, links.whatsapp, links.email];
  const external = [true, true, false];

  // Headline: oversized 2 lines, italic-gold "No forms." as the accent.
  const headlineLines = (t.raw("headlineLines") as string[]) ?? [];
  const accentLineIndex = (t.raw("accentLineIndex") as number) ?? 1;

  return (
    <section
      id="contact"
      className="relative px-6 md:px-10"
      style={{ paddingBlock: "clamp(96px, 12vw, 192px)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="sticky top-[88px] z-20 -mb-2 w-fit">
          <SectionLabel number="04" label={t("label")} />
        </div>

        {/* Oversized headline with italic-gold accent line */}
        <div className="mt-10 max-w-[20ch] md:mt-14">
          {headlineLines.map((line, i) => (
            <TextReveal
              key={i}
              as="h2"
              text={line}
              delay={i * 0.12}
              className="block text-[var(--fg)]"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "var(--text-display)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                fontStyle: i === accentLineIndex ? "italic" : "normal",
                color:
                  i === accentLineIndex
                    ? "var(--gold-bright)"
                    : "var(--fg)",
              }}
            />
          ))}
        </div>

        <ScrollReveal delay={0.15}>
          <p
            className="mt-10 max-w-[60ch] text-[var(--fg-muted)]"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
          >
            {t("sub")}
          </p>
        </ScrollReveal>

        {/* 3 magnetic tiles */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
          {tiles.map((tile, i) => {
            const Icon = ICONS[i] ?? Mail;
            return (
              <ScrollReveal key={i} delay={0.1 + i * 0.08}>
                <MagneticTile
                  href={hrefs[i]}
                  external={external[i]}
                  ariaLabel={tile.channel}
                  className="flex h-full min-h-[280px] flex-col"
                >
                  <Icon
                    size={48}
                    strokeWidth={1.5}
                    style={{ color: "var(--gold)" }}
                    aria-hidden
                  />
                  <h3
                    className="mt-8 text-[var(--fg)]"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "clamp(28px, 3vw, 36px)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {tile.channel}
                  </h3>
                  <p
                    className="mt-3 text-[var(--fg-muted)]"
                    style={{ fontSize: "15px", lineHeight: 1.55 }}
                  >
                    {tile.body}
                  </p>
                  <div
                    className="force-ltr mt-auto flex items-center gap-2 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <span>{tile.cta}</span>
                    <ArrowRight
                      size={14}
                      strokeWidth={1.75}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </MagneticTile>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.25}>
          <p
            className="force-ltr mt-14 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--fg-faint)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {t("meta")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
