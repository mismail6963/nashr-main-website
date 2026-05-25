import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet";

type Props = {
  variant?: Variant;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

/**
 * v2 Button — Linear-style restraint.
 * No magnetic hover. No scale. Hover = brightness/color shift only, 150ms.
 *   primary:    gold bg, near-black text
 *   secondary:  transparent + 1px strong border, fg text
 *   quiet:      text-only with animated underline
 */
export function Button({
  variant = "primary",
  href,
  external,
  children,
  className,
  type = "button",
  ...rest
}: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 select-none whitespace-nowrap font-medium transition-[color,background-color,border-color,opacity] duration-150 focus-visible:outline-none";

  const variants: Record<Variant, string> = {
    primary: [
      "h-11 rounded-full px-5 text-[14px] tracking-[-0.01em]",
      "bg-[var(--gold)] text-[#08090A]",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)]",
      "hover:bg-[var(--gold-bright)]",
    ].join(" "),
    secondary: [
      "h-11 rounded-full px-5 text-[14px] tracking-[-0.01em]",
      "bg-transparent text-[var(--fg)] border border-[var(--border-strong)]",
      "hover:border-[var(--fg-muted)] hover:text-[var(--fg)]",
    ].join(" "),
    quiet:
      "group/q relative px-0.5 py-1 text-[14px] text-[var(--fg-secondary)] hover:text-[var(--fg)]",
  };

  const content =
    variant === "quiet" ? (
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-300 group-hover/q:scale-x-100"
          style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
        />
      </span>
    ) : (
      children
    );

  if (href) {
    const extProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} {...extProps} className={cn(base, variants[variant], className)}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} {...rest} className={cn(base, variants[variant], className)}>
      {content}
    </button>
  );
}
