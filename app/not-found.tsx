import Link from "next/link";

// Root-level 404. Served when nothing else (including the locale layout)
// matches. Returns HTTP 404 automatically via Next's not-found convention.
//
// Visual styling uses the same tokens as the rest of the site so this
// renders consistently even though it has no locale context.

export const metadata = {
  title: "404 — Page not found · NASHR",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          background: "#08090A",
          color: "#F7F8F8",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "32px" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#62666D",
              marginBottom: 16,
            }}
          >
            404
          </p>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "0 0 28px",
            }}
          >
            Page not found
          </h1>
          <Link
            href="/en"
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C7B27A",
              textDecoration: "none",
            }}
          >
            ← Back to nashr.net
          </Link>
        </div>
      </body>
    </html>
  );
}
