"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
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
import { getContactLinks, CAL } from "@/lib/contact";

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

      <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((tile, i) => {
          const Icon = ICONS[i] ?? Mail;
          const ext = external[i]
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};
          // Only the first tile (Book a call) opens the Cal.com popup.
          // The href stays as a JS-disabled fallback to the booking page.
          const calAttrs =
            i === 0
              ? {
                  "data-cal-link": CAL.link,
                  "data-cal-namespace": CAL.namespace,
                  "data-cal-config": CAL.config,
                }
              : {};
          return (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <a
                href={hrefs[i]}
                {...ext}
                {...calAttrs}
                className="group block relative h-full bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--bg-elevated)] transition-colors duration-200 p-8 md:p-10 min-h-[240px] flex flex-col overflow-hidden"
              >
                {/* Icon — absolute at logical START corner (top-left LTR / top-right RTL) */}
                <div
                  className="absolute"
                  style={{ top: "32px", insetInlineStart: "32px" }}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: "var(--gold-bright)" }}
                    aria-hidden
                  />
                </div>

                {/* Hover preview — absolute at logical END corner (top-right LTR / top-left RTL) */}
                <div
                  className="absolute"
                  style={{ top: "24px", insetInlineEnd: "24px" }}
                >
                  <TilePreview index={i} />
                </div>

                {/* Body content — text-start auto-aligns right in RTL.
                    mt-16 clears the absolute-positioned icon. */}
                <div className="mt-16 text-start">
                  <h3 className="t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold-bright)] transition-colors duration-200">
                    {tile.channel}
                  </h3>
                  <p className="mt-2 t-body text-[var(--fg-secondary)]">
                    {tile.body}
                  </p>
                </div>

                {/* Bottom row — OPEN/افتح + arrow — pushed to logical END via ms-auto
                    (right in LTR, left in RTL). The arrow glyph flips per locale
                    so it always points 'forward' in the reading direction. */}
                <div className="mt-auto ms-auto pt-6 flex items-center gap-2">
                  <span
                    className="section-ref-label"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    {tile.cta}
                  </span>
                  <span
                    aria-hidden
                    className="text-[var(--fg-faint)] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px" }}
                  >
                    {isAr ? "←" : "→"}
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>

    </SectionShell>
  );
}

/* ---------- TilePreview — per-tile hover micro-animation ---------- */

function TilePreview({ index }: { index: number }) {
  switch (index) {
    case 0: return <PreviewCalendar />;
    case 1: return <PreviewChat />;
    case 2: return <PreviewEnvelope />;
    default: return null;
  }
}

/* Calendar tile — 5-bar audio meter equalizes on hover (call connecting feel) */
function PreviewCalendar() {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end gap-[3px] h-6">
      {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-sm bg-[var(--gold-bright)]"
          initial={{ height: "20%" }}
          animate={{ height: ["20%", "90%", "40%", "70%", "30%"] }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            repeat: Infinity,
            delay,
          }}
          style={{ minHeight: "4px" }}
        />
      ))}
    </div>
  );
}

/* WhatsApp tile — typing-indicator bubble on hover */
function PreviewChat() {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/30 bg-[rgba(164,143,96,0.06)] px-2 py-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1 w-1 rounded-full bg-[var(--gold-bright)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Email tile — envelope opens with paper edge sliding up */
function PreviewEnvelope() {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative">
      <svg viewBox="0 0 32 24" width="32" height="24" aria-hidden>
        {/* Envelope body */}
        <rect
          x="2"
          y="6"
          width="28"
          height="16"
          rx="2"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="1.25"
        />
        {/* Open flap */}
        <motion.path
          d="M 2 6 L 16 16 L 30 6"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="1.25"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Paper sliding up */}
        <motion.rect
          x="6"
          y="14"
          width="20"
          height="10"
          rx="1"
          fill="var(--bg-card)"
          stroke="var(--fg-muted)"
          strokeWidth="0.75"
          initial={{ y: 14 }}
          animate={{ y: 2 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
