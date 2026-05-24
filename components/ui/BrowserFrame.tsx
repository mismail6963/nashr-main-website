"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "before" | "after";

type Props = {
  variant: Variant;
  url: string;
  children?: ReactNode;
  className?: string;
};

/**
 * macOS-Safari-style window chrome with content slot inside.
 * Shared chrome between BEFORE/AFTER; difference is opacity + content.
 *
 * - 32px title bar with 3 colored dots and a centered URL pill
 * - 16:10 content area with --bg-elevated background
 * - BEFORE: 0.55 outer opacity, dim
 * - AFTER:  1.0 opacity
 */
export function BrowserFrame({ variant, url, children, className }: Props) {
  const isBefore = variant === "before";

  return (
    <div
      className={cn(
        "relative w-full transition-opacity duration-500",
        className,
      )}
      style={{ opacity: isBefore ? 0.55 : 1 }}
    >
      {/* Outer frame */}
      <div
        className="overflow-hidden rounded-[12px] border bg-[var(--bg-elevated)]"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {/* Title bar */}
        <div
          className="relative flex h-8 items-center px-4"
          style={{
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Traffic lights — LTR-anchored in both locales */}
          <div className="absolute left-4 flex items-center gap-[8px]" dir="ltr">
            <span
              aria-hidden
              className="block h-3 w-3 rounded-full"
              style={{ background: "#FF5F57" }}
            />
            <span
              aria-hidden
              className="block h-3 w-3 rounded-full"
              style={{ background: "#FEBC2E" }}
            />
            <span
              aria-hidden
              className="block h-3 w-3 rounded-full"
              style={{ background: "#28C840" }}
            />
          </div>

          {/* URL pill */}
          <div
            dir="ltr"
            className="mx-auto flex h-6 items-center rounded-[6px] px-[14px]"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              minWidth: "180px",
              justifyContent: "center",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                letterSpacing: "0.02em",
                color: isBefore ? "var(--fg-faint)" : "var(--fg-secondary)",
              }}
            >
              {url}
            </span>
          </div>
        </div>

        {/* Content area — 16:10 aspect ratio reserves space */}
        <div
          className="relative w-full"
          style={{ aspectRatio: "16 / 10" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
