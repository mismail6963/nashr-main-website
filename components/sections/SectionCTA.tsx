"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  CalendarClock,
  MessageCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
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
    <SectionShell id="contact" number="4.0" label={t("ref")} watermark="04">
      <div className="[text-wrap:balance]" style={{ maxWidth: "clamp(560px, 50vw, 880px)" }}>
        <SplitText
          as="h2"
          className="t-h1 text-[var(--fg)] [text-wrap:balance]"
          words={headlineWords}
          ariaLabel={t("headlineAria")}
          stagger={0.05}
        />
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 t-body-lg text-[var(--fg-secondary)] max-w-[600px]">
          {t("sub")}
        </p>
      </Reveal>

      {/* Three tiles. Surface-card bg, hairline border, gold-bright on hover. */}
      <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((tile, i) => {
          const Icon = ICONS[i] ?? Mail;
          const ext = external[i]
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <a
                href={hrefs[i]}
                {...ext}
                className="group block h-full bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--bg-elevated)] transition-colors duration-200 p-8 md:p-10 min-h-[200px] flex flex-col justify-between"
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "var(--gold-bright)" }}
                  aria-hidden
                />
                <div className="mt-10">
                  <p>
                    <Mono size={11} tone="faint">
                      {tile.cta}
                    </Mono>
                  </p>
                  <h3 className="mt-2 t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold-bright)] transition-colors duration-200">
                    {tile.channel}
                  </h3>
                  <p className="mt-2 t-body text-[var(--fg-secondary)]">
                    {tile.body}
                  </p>
                  <span
                    aria-hidden
                    className="mt-4 inline-block text-[var(--fg-faint)] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px" }}
                  >
                    {isAr ? "←" : "→"}
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.18}>
        <p className="mt-14 text-center">
          <Mono size={11} tone="faint">
            {t("meta")}
          </Mono>
        </p>
      </Reveal>
    </SectionShell>
  );
}
