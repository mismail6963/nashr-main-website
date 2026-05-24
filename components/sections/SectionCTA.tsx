"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  CalendarClock,
  MessageCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { SectionRef } from "@/components/ui/SectionRef";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { getContactLinks } from "@/lib/contact";

type Tile = { channel: string; body: string; cta: string };

const ICONS: LucideIcon[] = [CalendarClock, MessageCircle, Mail];

export function SectionCTA() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isAr = locale === "ar";
  const links = getContactLinks(locale);
  const tiles = (t.raw("tiles") as Tile[]) ?? [];

  const headlineWords = (t.raw("headlineWords") as Array<
    string | { text: string; accent?: boolean }
  >) ?? [];

  const hrefs = [links.calcom, links.whatsapp, links.email];
  const external = [true, true, false];

  return (
    <section id="contact" className="section-pad below-fold hairline">
      <div className="container-page">
        <Reveal>
          <SectionRef number="4.0" label={t("ref")} />
        </Reveal>

        {/* Headline — text-wrap: balance so it wraps to 2 lines max,
            not word-by-word. */}
        <div
          className="mt-10 md:mt-12"
          style={{
            maxWidth: "clamp(720px, 50vw, 960px)",
          }}
        >
          <SplitText
            as="h2"
            className="t-display text-[var(--fg)] [text-wrap:balance]"
            words={headlineWords}
            ariaLabel={t("headlineAria")}
            delay={0}
            stagger={0.05}
            duration={0.42}
          />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 t-body-lg text-[var(--fg-secondary)] max-w-[600px]">
            {t("sub")}
          </p>
        </Reveal>

        {/* Three hairline rows / columns. No card chrome. */}
        <div className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-3 border-t border-[var(--border)]">
          {tiles.map((tile, i) => {
            const Icon = ICONS[i] ?? Mail;
            const ext = external[i]
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <a
                key={i}
                href={hrefs[i]}
                {...ext}
                className="group block border-b border-[var(--border)] md:border-b-0 py-10 md:py-12 transition-colors duration-150"
                style={{
                  borderInlineStart: i > 0 ? "1px solid var(--border)" : undefined,
                  paddingInlineStart: i > 0 ? "clamp(20px, 3vw, 48px)" : undefined,
                  paddingInlineEnd: i < tiles.length - 1 ? "clamp(20px, 3vw, 48px)" : undefined,
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "var(--fg-muted)" }}
                  aria-hidden
                />
                <h3 className="mt-6 t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors duration-150">
                  {tile.channel}
                </h3>
                <p className="mt-3 t-body text-[var(--fg-secondary)]">
                  {tile.body}
                </p>
                <div className="mt-8 inline-flex items-center gap-2">
                  <Mono size={11} tone="faint">{tile.cta}</Mono>
                  <span
                    aria-hidden
                    className="text-[var(--fg-faint)] transition-transform duration-150 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}
                  >
                    {isAr ? "←" : "→"}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-16 text-center">
            <Mono size={11} tone="faint">
              {t("meta")}
            </Mono>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
