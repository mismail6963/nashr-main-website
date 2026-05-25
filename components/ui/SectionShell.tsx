import type { ReactNode } from "react";
import { SectionRef } from "@/components/ui/SectionRef";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  /** Section ref number, e.g. "1.0" */
  number: string;
  /** Section ref label, e.g. "WHAT IS NASHR" */
  label: string;
  /** Big background watermark numeral, e.g. "01" */
  watermark?: string;
  /** Apply dot-grid background (used for §03) */
  dotGrid?: boolean;
  /** Use elevated background (used for §02) */
  elevated?: boolean;
  /** Show top hairline (defaults true; turn off on first section) */
  hairline?: boolean;
  children: ReactNode;
  /** Optional extra classes for the section element */
  className?: string;
};

/**
 * The standard section wrapper.
 *
 *  - section-pad vertical padding (clamp 120–240px)
 *  - 2-col grid on md+: left sticky label, right content
 *  - full-bleed background optionally (elevated, dot-grid)
 *  - watermark numeral in the section background
 *  - container-page constrains content to --container max-width
 *
 * The sticky label is positioned at top:100px so it clears the
 * fixed header (h-16) and breathes.
 */
export function SectionShell({
  id,
  number,
  label,
  watermark,
  dotGrid,
  elevated,
  hairline = true,
  children,
  className,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative below-fold",
        hairline && "border-t border-[var(--border)]",
        elevated && "bg-[var(--bg-elevated)]",
        dotGrid && "dot-grid",
        className,
      )}
    >
      {/* Watermark — sits in the section background */}
      {watermark && (
        <span aria-hidden className="section-watermark">
          {watermark}
        </span>
      )}

      <div className="container-page section-pad relative">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
          {/* Left: sticky section ref */}
          <div className="sticky-label">
            <SectionRef number={number} label={label} />
          </div>

          {/* Right: section content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
