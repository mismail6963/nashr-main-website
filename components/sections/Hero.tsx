"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { getContactLinks } from "@/lib/contact";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const { calcom } = getContactLinks(locale);

  // The hero headline is intentionally split into 4 lines so the masked
  // word-reveal staggers line-by-line. The italic+gold word "actually"
  // (or its Arabic counterpart) lives on line 3.
  const headlineLines = (t.raw("headlineLines") as string[]) ?? [];
  const accentIndex = (t.raw("accentLineIndex") as number) ?? 2;

  const trustItems = (t.raw("trust") as string[]) ?? [];

  // Word reveal: each word slides up from below an overflow-hidden mask.
  // We do it inline here (instead of using <TextReveal />) because we
  // need precise per-line and per-word control for the italic-gold accent.
  const wordVariant = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center px-6 pb-32 pt-32 md:px-10 md:pt-40"
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-16 md:grid-cols-12">
        {/* Left: content (7 cols on desktop) */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="md:col-span-7"
        >
          {/* Eyebrow */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="force-ltr mb-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--gold)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span aria-hidden className="inline-block h-px w-6 bg-[var(--gold)]" />
            {t("eyebrow")}
          </motion.p>

          {/* Headline — 4 lines, masked word reveal */}
          <h1
            className="mb-10 text-[var(--fg)]"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "var(--text-display)",
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="sr-only">{headlineLines.join(" ")}</span>
            {headlineLines.map((line, lineIdx) => (
              <span
                key={lineIdx}
                aria-hidden
                className="block"
              >
                {line.split(" ").map((word, wIdx, arr) => {
                  // Identify the single accent word on the accent line.
                  // Convention: on the accent line, the FIRST word is the accent
                  // (e.g. "actually" / "فعلاً"). Adjust later if needed.
                  const isAccent =
                    lineIdx === accentIndex && wIdx === 0;
                  return (
                    <span
                      key={wIdx}
                      className="inline-block overflow-hidden align-baseline"
                      style={{
                        marginInlineEnd:
                          wIdx === arr.length - 1 ? 0 : "0.22em",
                      }}
                    >
                      <motion.span
                        variants={wordVariant}
                        transition={{
                          delay: 0.18 + lineIdx * 0.08 + wIdx * 0.03,
                        }}
                        className={
                          isAccent
                            ? "inline-block italic text-[var(--gold-bright)]"
                            : "inline-block"
                        }
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Sub-headline */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="mb-10 max-w-[520px] text-[var(--fg-muted)]"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.55 }}
          >
            {t("sub")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
            className="mb-10 flex flex-wrap items-center gap-4"
          >
            <Button variant="primary" href={calcom} external>
              {t("ctaPrimary")}
            </Button>
            <Button variant="ghost" href="#how">
              {t("ctaSecondary")}
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.ul
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="force-ltr flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {trustItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden className="text-[var(--gold)]/40">
                    ·
                  </span>
                )}
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: visual (5 cols on desktop) */}
        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="relative"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
      >
        <motion.div
          aria-hidden
          className="h-8 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--gold), transparent)",
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--fg-faint)]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          {t("scroll")}
        </span>
      </motion.div>
    </section>
  );
}
