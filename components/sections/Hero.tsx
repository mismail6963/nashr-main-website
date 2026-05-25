"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { getContactLinks } from "@/lib/contact";
import { SplitText } from "@/components/motion/SplitText";
import { EASE_OUT_QUINT } from "@/lib/motion";

/**
 * Hero — Linear-style sans-serif headline, with one gold-accent word.
 * No serif. No italic. No magnetic anything.
 *
 * The right-side visual is the BEFORE/AFTER BrowserFrame composition (§6.2).
 *
 * Load reveal sequence (§7.1):
 *  120ms  eyebrow
 *  200ms  headline (word-by-word, 60ms apart, 420ms each)
 *  400ms  visual (fade + scale 0.98 → 1, 720ms)
 *  600ms  subhead
 *  750ms  CTAs
 *  900ms  trust
 */
export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isAr = locale === "ar";
  const { calcom } = getContactLinks(locale);
  const reduce = useReducedMotion();

  // Word array: [{text, accent?}]. Built from message JSON.
  const headlineWords = (t.raw("headlineWords") as Array<
    string | { text: string; accent?: boolean }
  >) ?? [];

  const trustItems = (t.raw("trust") as string[]) ?? [];

  const fade = (delay: number, duration = 0.3) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration, delay, ease: EASE_OUT_QUINT },
        };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-32 md:pt-28 pb-24 md:pb-32 overflow-hidden"
    >
      {/* Hero internal quarter guides — vertical hairlines at 25/50/75% */}
      <div aria-hidden className="hero-guides hidden md:block">
        <span className="g-25" />
        <span className="g-75" />
      </div>

      <div className="container-page grid w-full grid-cols-12 gap-6 md:gap-6 items-center relative">
        {/* Left: content (full on md-, 7/12 on lg+) */}
        <div className="col-span-12 lg:col-span-7">
          {/* Eyebrow — 120ms */}
          <motion.div {...fade(0.12, 0.18)} className="mb-8 md:mb-10">
            <Mono size={12} tone="muted">
              {t("eyebrow")}
            </Mono>
          </motion.div>

          {/* Headline — 200ms, word-by-word */}
          <SplitText
            as="h1"
            className="t-display text-[var(--fg)] mb-8 md:mb-10"
            words={headlineWords}
            ariaLabel={t("headlineAria")}
            onMount
            delay={0.2}
            stagger={0.06}
            duration={0.42}
          />

          {/* Subhead — 600ms */}
          <motion.p
            {...fade(0.6, 0.3)}
            className="t-body-lg text-[var(--fg-secondary)] mb-10 max-w-[520px]"
          >
            {t("sub")}
          </motion.p>

          {/* CTAs — 750ms */}
          <motion.div
            {...fade(0.75, 0.24)}
            className="mb-10 flex flex-wrap items-center gap-3"
          >
            <Button variant="primary" href={calcom} external>
              {t("ctaPrimary")}
            </Button>
            <Button variant="secondary" href="#how">
              {t("ctaSecondary")}
              <span aria-hidden className="ms-1">{isAr ? "←" : "→"}</span>
            </Button>
          </motion.div>

          {/* Trust strip — 900ms */}
          <motion.div {...fade(0.9, 0.24)}>
            <Mono size={11} tone="faint">
              {trustItems.join(" · ")}
            </Mono>
          </motion.div>
        </div>

        {/* Right: BEFORE/AFTER visual — 400ms */}
        <motion.div
          className="col-span-12 lg:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.4, ease: EASE_OUT_QUINT }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
