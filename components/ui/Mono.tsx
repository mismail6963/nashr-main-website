import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Default 11. The 12px size is rare. */
  size?: 11 | 12;
  /** "muted" (default), "faint", or "fg" */
  tone?: "muted" | "faint" | "fg" | "gold";
  upper?: boolean;
};

/**
 * Mono wrapper — always renders LTR with Latin glyphs, even inside the
 * Arabic locale. The numerals and slashes in our section refs must not flip.
 */
export function Mono({
  children,
  className,
  size = 11,
  tone = "muted",
  upper = true,
}: Props) {
  const colorClass =
    tone === "fg"
      ? "text-[var(--fg)]"
      : tone === "faint"
        ? "text-[var(--fg-faint)]"
        : tone === "gold"
          ? "text-[var(--gold)]"
          : "text-[var(--fg-muted)]";

  const sizeClass = size === 12 ? "t-mono" : "t-mono-sm";

  return (
    <span
      dir="ltr"
      lang="en"
      className={cn(
        "ltr-mono font-mono",
        sizeClass,
        colorClass,
        upper && "uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
