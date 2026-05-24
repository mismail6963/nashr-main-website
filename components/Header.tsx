"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { LangToggle } from "@/components/ui/LangToggle";
import { getContactLinks } from "@/lib/contact";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { calcom } = getContactLinks(locale);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 h-[72px]"
      style={{
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        backgroundColor: scrolled ? "rgba(7, 16, 28, 0.72)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--surface-line)" : "1px solid transparent",
        transition:
          "background-color 300ms var(--ease-out-expo), border-color 300ms var(--ease-out-expo), backdrop-filter 300ms var(--ease-out-expo)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 md:px-10">
        {/* Wordmark */}
        <a
          href="#hero"
          className="force-ltr group flex items-center gap-2 focus-visible:outline-none"
          aria-label="NASHR — home"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] transition-transform duration-300 group-hover:scale-150"
          />
          <span
            className="italic text-[22px] tracking-[-0.02em] text-[var(--fg)]"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            NASHR
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {(["work", "about", "contact"] as const).map((key) => (
            <a
              key={key}
              href={`#${key === "contact" ? "contact" : key === "about" ? "what" : "how"}`}
              className="group relative font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {t(key)}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-300 group-hover:scale-x-100"
                style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
              />
            </a>
          ))}
        </nav>

        {/* Right: lang + CTA */}
        <div className="flex items-center gap-3">
          <LangToggle />
          <div className="hidden sm:block">
            <Button variant="primary" href={calcom} external>
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
