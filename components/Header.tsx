"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LangToggle } from "@/components/ui/LangToggle";
import { Mono } from "@/components/ui/Mono";
import { getContactLinks } from "@/lib/contact";

const NAV_LINKS = [
  { key: "work", href: "#how" },
  { key: "about", href: "#what" },
  { key: "contact", href: "#contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { calcom } = getContactLinks(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route hash change or escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-16"
        style={{
          backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          backgroundColor: scrolled ? "rgba(8, 9, 10, 0.7)" : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transition: "background-color 200ms var(--ease-out-quint), border-color 200ms var(--ease-out-quint)",
        }}
      >
        <div className="container-page flex h-full items-center justify-between">
          {/* Wordmark */}
          <a
            href="#hero"
            className="flex items-center gap-2 focus-visible:outline-none"
            aria-label="NASHR — home"
            dir="ltr"
          >
            <span
              aria-hidden
              className="h-1 w-1 rounded-full bg-[var(--gold)]"
            />
            <span
              className="text-[17px] font-semibold tracking-[-0.03em] text-[var(--fg)]"
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              NASHR
            </span>
          </a>

          {/* Center nav — md+ only */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
              >
                <Mono size={11} tone="muted">{t(key)}</Mono>
              </a>
            ))}
          </nav>

          {/* Right: lang + CTA (desktop) / hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <LangToggle />
              <Button variant="primary" href={calcom} external>
                {t("cta")}
              </Button>
            </div>
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center text-[var(--fg)]"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden flex flex-col"
            style={{ background: "var(--bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="container-page flex h-16 items-center justify-between">
              <div className="flex items-center gap-2" dir="ltr">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-[var(--gold)]"
                />
                <span
                  className="text-[17px] font-semibold tracking-[-0.03em]"
                >
                  NASHR
                </span>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-[var(--fg)]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="container-page flex flex-1 flex-col justify-center gap-8">
              {NAV_LINKS.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-[var(--fg)] hover:text-[var(--gold)] transition-colors duration-150"
                >
                  <span className="t-h2">{t(key)}</span>
                </a>
              ))}
              <div className="mt-6 flex items-center gap-4 pt-8 border-t border-[var(--border)]">
                <LangToggle />
                <Button variant="primary" href={calcom} external>
                  {t("cta")}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
