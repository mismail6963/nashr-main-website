"use client";

// Segment-level error boundary (Part A). Catches render/hydration/runtime errors
// in the localized page tree. Without this, such an error blanks the content
// silently; here we (1) report it to the on-screen diagnostics so an affected
// device can read & report it, and (2) show an unobtrusive, theme-consistent
// fallback with a retry instead of a blank shell.

import { useEffect } from "react";
import { diagEnabled, reportDiag } from "@/lib/diag";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportDiag(
      "react-error",
      (error?.message || "render error") +
        (error?.digest ? ` #${error.digest}` : ""),
    );
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background: "var(--bg, #08090A)",
        color: "var(--fg, #F7F8F8)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Something went wrong loading this section.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 20,
            height: 44,
            padding: "0 22px",
            borderRadius: 999,
            border: 0,
            background: "var(--gold, #A48F60)",
            color: "#08090A",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        {diagEnabled() && (
          <pre
            dir="ltr"
            style={{
              marginTop: 20,
              padding: 12,
              textAlign: "left",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 11,
              lineHeight: 1.5,
              color: "#C7B27A",
              border: "1px solid #C7B27A",
              borderRadius: 8,
            }}
          >
            {(error?.message || "render error") +
              (error?.digest ? `\n#${error.digest}` : "")}
          </pre>
        )}
      </div>
    </div>
  );
}
