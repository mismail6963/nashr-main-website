"use client";

import { useTranslations } from "next-intl";
import { LangToggle } from "@/components/ui/LangToggle";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative mt-32 border-t border-[var(--surface-line)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        {/* Left: wordmark + copyright */}
        <div className="force-ltr flex items-center gap-3">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
          />
          <span
            className="italic text-[16px] tracking-[-0.02em] text-[var(--fg)]"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            NASHR
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            © 2026 · {t("rights")}
          </span>
        </div>

        {/* Center: quiet links */}
        <nav className="flex items-center gap-6">
          {(["privacy", "terms", "vat"] as const).map((key) => (
            <a
              key={key}
              href="#"
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

        {/* Right: lang toggle + tiny KSA flag */}
        <div className="flex items-center gap-3">
          <LangToggle />
          <span
            aria-label="Saudi Arabia"
            title="Saudi Arabia"
            className="text-[16px]"
            style={{ filter: "saturate(1.05)" }}
          >
            🇸🇦
          </span>
        </div>
      </div>
    </footer>
  );
}
