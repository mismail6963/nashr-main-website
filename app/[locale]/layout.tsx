import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { fontSans, fontMono, fontArabic } from "@/lib/fonts";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import "../globals.css";

const SITE_URL = "https://nashr.sa";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "NASHR — Bilingual Web Design Studio · Riyadh",
    description:
      "NASHR designs and builds bilingual websites for Saudi businesses. Arabic + English, mobile-first, one-time fee. You own the work.",
  },
  ar: {
    title: "نَشْر — استوديو تصميم ويب ثنائي اللغة · الرياض",
    description:
      "نَشْر يصمم ويبني مواقع ثنائية اللغة لأعمال السعودية. عربي + إنجليزي، يبدأ من الجوال، دفعة وحدة. الموقع لك بالكامل.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale as Locale] ?? META.en;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      title: m.title,
      description: m.description,
      siteName: "NASHR",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [{ url: `/api/og?locale=${locale}`, width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`/api/og?locale=${locale}`],
    },
    icons: { icon: "/favicon.svg" },
  };
}

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NASHR",
  alternateName: "نَشْر",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: "Bilingual web design studio in Riyadh, Saudi Arabia.",
  areaServed: { "@type": "Country", name: "Saudi Arabia" },
  address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "SA",
      availableLanguage: ["Arabic", "English"],
      // TODO: replace with NASHR's real WhatsApp number
      telephone: "+9665XXXXXXXX",
    },
  ],
};

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

  // Both font variables loaded always; per-locale CSS rule in globals.css
  // picks the right family. Mono is global.
  const fontClass = [
    fontSans.variable,
    fontMono.variable,
    fontArabic.variable,
  ].join(" ");

  return (
    <html lang={locale} dir={dir} className={fontClass}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div aria-hidden className="page-frame" />
        <GrainOverlay />
        <CustomCursor />
        <SmoothScroll />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
