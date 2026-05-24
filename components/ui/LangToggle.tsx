"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [sweeping, setSweeping] = useState(false);

  const other = locale === "en" ? "ar" : "en";

  const handleClick = () => {
    if (sweeping) return;
    setSweeping(true);

    // Sweep first, then navigate at the midpoint so the user perceives
    // the locale flip during the gold-line sweep.
    window.setTimeout(() => {
      const next = pathname.replace(`/${locale}`, `/${other}`);
      router.push(next);
    }, 220);

    window.setTimeout(() => setSweeping(false), 700);
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={`Switch language to ${other === "ar" ? "Arabic" : "English"}`}
        className="force-ltr group relative flex h-9 items-center gap-1 rounded-full border border-[var(--surface-line)] bg-transparent px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:border-[var(--gold)]/40 hover:text-[var(--fg)]"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={locale}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--fg)]"
          >
            {locale.toUpperCase()}
          </motion.span>
        </AnimatePresence>
        <span className="text-[var(--fg-faint)]">/</span>
        <span className="text-[var(--fg-muted)]">{other.toUpperCase()}</span>
      </button>

      {/* Full-page sweep transition */}
      <AnimatePresence>
        {sweeping && (
          <motion.div
            aria-hidden
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed inset-y-0 left-0 z-[100] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, transparent 48%, rgba(164,143,96,0.9) 50%, transparent 52%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
