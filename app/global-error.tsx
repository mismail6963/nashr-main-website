"use client";

// Root error boundary (Part A). Last line of defense: catches errors in the
// root layout itself. Must render its own <html>/<body>. Reports to the
// diagnostics overlay (if present) and the console, and shows an unobtrusive
// fallback with a reload instead of a white screen.

import { useEffect } from "react";
import { reportDiag } from "@/lib/diag";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportDiag(
      "root-error",
      (error?.message || "root render error") +
        (error?.digest ? ` #${error.digest}` : ""),
    );
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: "#08090A",
          color: "#F7F8F8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Something went wrong. Please reload the page.
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
              background: "#A48F60",
              color: "#08090A",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
