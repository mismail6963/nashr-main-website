"use client";

import { useTranslations } from "next-intl";
import { LangToggle } from "@/components/ui/LangToggle";
import { Mono } from "@/components/ui/Mono";

export function Footer() {
  const t = useTranslations("footer");
  const links = ["privacy", "terms", "vat"] as const;

  return (
    <footer className="relative mt-0 border-t border-[var(--border)]">
      <div className="container-page flex h-20 flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between md:py-0">
        {/* Left: wordmark + copyright */}
        <div className="flex items-center gap-3" dir="ltr">
          <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--gold)]" />
          <span className="text-[15px] font-semibold tracking-[-0.03em]">
            NASHR
          </span>
          <Mono size={11} tone="faint">
            © 2026 {t("rights")}
          </Mono>
        </div>

        {/* Center: quiet links */}
        <nav className="flex items-center gap-5">
          {links.map((key) => (
            <a
              key={key}
              href="#"
              className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
            >
              <Mono size={11} tone="muted">{t(key)}</Mono>
            </a>
          ))}
        </nav>

        {/* Right: lang + gold dot */}
        <div className="flex items-center gap-4">
          <LangToggle />
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-[var(--gold)]"
          />
        </div>
      </div>
    </footer>
  );
}
