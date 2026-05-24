import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main style={{ minHeight: "100vh", padding: "2rem" }}>
      <p style={{ color: "var(--fg-muted)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Scaffold ready · locale: {locale}
      </p>
    </main>
  );
}
