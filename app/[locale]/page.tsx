import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main" style={{ minHeight: "200vh", padding: "8rem 2rem" }}>
      <p
        className="font-mono"
        style={{
          color: "var(--fg-muted)",
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        Design system live · locale: {locale}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: "var(--text-display)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          marginTop: "2rem",
          maxWidth: "20ch",
        }}
      >
        Atmosphere check.
      </h1>
    </main>
  );
}
