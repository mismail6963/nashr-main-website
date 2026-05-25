"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * EN / AR pill, ~60px wide. Active locale has a 1px gold underline.
 * Switching triggers a 200ms full-page crossfade.
 */
export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [fading, setFading] = useState(false);

  const switchTo = (next: "en" | "ar") => {
    if (next === locale || fading) return;
    setFading(true);
    window.setTimeout(() => {
      startTransition(() => {
        const newPath = pathname.replace(`/${locale}`, `/${next}`);
        router.push(newPath);
      });
    }, 100);
    window.setTimeout(() => setFading(false), 400);
  };

  return (
    <>
      <div
        dir="ltr"
        className="flex items-center gap-1 font-mono"
        role="group"
        aria-label="Language"
      >
        {(["en", "ar"] as const).map((loc) => {
          const active = loc === locale;
          return (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              aria-pressed={active}
              aria-label={loc === "en" ? "English" : "العربية"}
              className="relative px-2 py-1 text-[11px] uppercase tracking-[0.08em] transition-colors duration-150"
              style={{
                color: active ? "var(--fg)" : "var(--fg-muted)",
              }}
            >
              {loc.toUpperCase()}
              {active && (
                <motion.span
                  aria-hidden
                  layoutId="lang-underline"
                  className="absolute inset-x-1 -bottom-0.5 h-px"
                  style={{ background: "var(--gold)" }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Crossfade overlay during route change */}
      <AnimatePresence>
        {fading && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{ background: "var(--bg)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
