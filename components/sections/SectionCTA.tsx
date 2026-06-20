"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  CalendarClock,
  MessageCircle,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { getContactLinks, CAL } from "@/lib/contact";

// Code-split: the brief form (portal + form + framer-motion + icons) only ever
// renders after a click and is null on the server, so keep it out of the
// initial bundle and fetch its chunk on demand. Purely a load-time change —
// the rendered output is identical.
const BriefModal = dynamic(
  () => import("@/components/ui/BriefModal").then((m) => m.BriefModal),
  { ssr: false },
);

type Tile = { channel: string; body: string; cta: string };

const ICONS: LucideIcon[] = [CalendarClock, MessageCircle, FileText];

// Shared card visual — identical Tailwind across all three tiles so swapping
// the third tile's tag from <a> to <button> doesn't shift the layout.
const CARD_CLASS =
  "group block relative h-full bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--bg-elevated)] transition-colors duration-200 p-8 md:p-10 min-h-[240px] flex flex-col overflow-hidden text-start";

export function SectionCTA() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isAr = locale === "ar";
  const links = getContactLinks(locale);
  const tiles = (t.raw("tiles") as Tile[]) ?? [];

  const headlineWords = (t.raw("headlineWords") as Array<
    string | { text: string; accent?: boolean }
  >) ?? [];

  const hrefs = [links.calcom, links.whatsapp];
  const [briefOpen, setBriefOpen] = useState(false);

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
          const Icon = ICONS[i] ?? FileText;
          const cardInner = (
            <CardContent
              tile={tile}
              Icon={Icon}
              previewIndex={i}
              arrowChar={isAr ? "←" : "→"}
            />
          );

          // Tile 3 (Start a brief) — button that opens the BriefModal.
          if (i === 2) {
            return (
              <Reveal key={i} delay={0.05 + i * 0.05}>
                <button
                  type="button"
                  onClick={() => setBriefOpen(true)}
                  aria-label={t("startBrief.aria")}
                  className={CARD_CLASS}
                >
                  {cardInner}
                </button>
              </Reveal>
            );
          }

          // Tiles 1 + 2 — anchors (Cal.com popup / WhatsApp).
          const ext =
            i === 0 || i === 1
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
          const calAttrs =
            i === 0
              ? {
                  "data-cal-link": CAL.link,
                  "data-cal-namespace": CAL.namespace,
                  "data-cal-config": CAL.config,
                }
              : {};
          const ariaLabel =
            i === 1 ? "Open WhatsApp chat with NASHR" : undefined;
          return (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <a
                href={hrefs[i]}
                {...ext}
                {...calAttrs}
                aria-label={ariaLabel}
                className={CARD_CLASS}
              >
                {cardInner}
              </a>
            </Reveal>
          );
        })}
      </div>

      <BriefModal isOpen={briefOpen} onClose={() => setBriefOpen(false)} />
    </SectionShell>
  );
}

/* ---------- Shared card content ---------- */

function CardContent({
  tile,
  Icon,
  previewIndex,
  arrowChar,
}: {
  tile: Tile;
  Icon: LucideIcon;
  previewIndex: number;
  arrowChar: string;
}) {
  return (
    <>
      {/* Icon — absolute at logical START corner */}
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

      {/* Hover preview — logical END corner */}
      <div
        className="absolute"
        style={{ top: "24px", insetInlineEnd: "24px" }}
      >
        <TilePreview index={previewIndex} />
      </div>

      {/* Body — text-start auto-aligns right in RTL */}
      <div className="mt-16 text-start">
        <h3 className="t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold-bright)] transition-colors duration-200">
          {tile.channel}
        </h3>
        <p className="mt-2 t-body text-[var(--fg-secondary)]">{tile.body}</p>
      </div>

      {/* Bottom row — OPEN + arrow at logical END */}
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
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "13px",
          }}
        >
          {arrowChar}
        </span>
      </div>
    </>
  );
}

/* ---------- TilePreview — per-tile hover micro-animation ---------- */

function TilePreview({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <PreviewCalendar />;
    case 1:
      return <PreviewChat />;
    case 2:
      return <PreviewBriefForm />;
    default:
      return null;
  }
}

/* Calendar tile — 5-bar audio meter equalizes on hover */
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

/* Brief-form tile — small document fills its lines in, then a checkmark */
function PreviewBriefForm() {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative">
      <svg viewBox="0 0 32 28" width="32" height="28" aria-hidden>
        {/* Document outline */}
        <rect
          x="3"
          y="2"
          width="22"
          height="24"
          rx="2"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="1.25"
        />
        {/* Form lines — stagger in to suggest fields being filled */}
        {[8, 13, 18].map((y, i) => (
          <motion.line
            key={i}
            x1="6"
            x2="22"
            y1={y}
            y2={y}
            stroke="var(--gold-bright)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        {/* Check tick at the bottom corner */}
        <motion.path
          d="M 18 22 L 21 25 L 26 19"
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
