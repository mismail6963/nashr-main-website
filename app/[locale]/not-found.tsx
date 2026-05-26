import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

// Locale-scoped 404. Triggered when a locale-prefixed URL like
// /en/no-such-page or /ar/foo doesn't match a route. Inherits the
// locale layout's <html lang dir> + page-frame + analytics, so this
// looks like the rest of the site, not a generic Next error page.

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  const copy = isAr
    ? { heading: "الصفحة غير موجودة", back: "← العودة إلى nashr.net" }
    : { heading: "Page not found", back: "← Back to nashr.net" };

  // Suppress the unused-import lint via touch — getTranslations is
  // kept available for future localized 404 copy if richer messaging
  // is needed.
  void getTranslations;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="text-center" style={{ padding: 32 }}>
        <p className="font-mono t-mono-sm uppercase" style={{ color: "var(--fg-faint)", marginBottom: 16 }}>
          404
        </p>
        <h1
          style={{
            fontFamily: isAr
              ? "var(--font-arabic), sans-serif"
              : "var(--font-sans), sans-serif",
            fontSize: isAr ? 40 : 48,
            fontWeight: 500,
            letterSpacing: isAr ? "0" : "-0.03em",
            margin: "0 0 28px",
            color: "var(--fg)",
          }}
        >
          {copy.heading}
        </h1>
        <Link
          href={`/${locale}`}
          className="font-mono t-mono-sm uppercase"
          style={{ color: "var(--gold-bright)", textDecoration: "none" }}
        >
          {copy.back}
        </Link>
      </div>
    </main>
  );
}
