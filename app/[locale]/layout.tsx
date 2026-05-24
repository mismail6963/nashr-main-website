import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { fontDisplay, fontSans, fontMono, fontArabic } from "@/lib/fonts";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "../globals.css";

export const metadata: Metadata = {
  title: "NASHR — Bilingual Web Design Studio · Riyadh",
  description:
    "NASHR designs and builds bilingual websites for Saudi businesses. One-time fee. You own the work.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale as Locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const fontClass = [
    fontDisplay.variable,
    fontSans.variable,
    fontMono.variable,
    fontArabic.variable,
  ].join(" ");

  return (
    <html lang={locale} dir={dir} className={fontClass}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <GradientMesh />
        <SmoothScroll />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
