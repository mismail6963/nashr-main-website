import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { fontSans, fontMono, fontArabic } from "@/lib/fonts";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { StructuredData } from "@/components/seo/StructuredData";
import "../globals.css";

const SITE_URL = "https://nashr.net";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090A",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "NASHR — Bilingual Web Design Studio · Riyadh",
    description:
      "Bilingual websites for Saudi businesses — Arabic and English, mobile-first, built around how your customers actually browse, message, and book. One-time fee.",
  },
  ar: {
    title: "نَشر — استوديو تصميم مواقع ثنائي اللغة · الرياض",
    description:
      "مواقع ثنائية اللغة لأعمال السعودية — عربي وإنجليزي، محسّنة للجوال، ومبنية حول طريقة بحث عملائك ومراسلتهم وحجزهم فعلياً. رسوم لمرة واحدة.",
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
    applicationName: "NASHR",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      title: m.title,
      description: m.description,
      siteName: "NASHR",
      locale: locale === "ar" ? "ar_SA" : "en_SA",
      alternateLocale: locale === "ar" ? "en_SA" : "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    // TODO: paste the GSC verification token here once the property is verified.
    // verification: { google: "..." },
  };
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

  // Both font variables loaded always; per-locale CSS rule in globals.css
  // picks the right family. Mono is global.
  const fontClass = [
    fontSans.variable,
    fontMono.variable,
    fontArabic.variable,
  ].join(" ");

  return (
    <html lang={locale} dir={dir} className={fontClass}>
      <body>
        {/* Runtime polyfills for older Safari/iOS. Runs synchronously before
            the deferred app bundle so any code path using these methods is
            safe. Array/String.prototype.at landed only in Safari 15.4. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function at(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;if(n<0||n>=this.length)return undefined;return this[n];}if(!Array.prototype.at){Object.defineProperty(Array.prototype,'at',{value:at,writable:true,configurable:true});}if(!String.prototype.at){Object.defineProperty(String.prototype,'at',{value:at,writable:true,configurable:true});}})();",
          }}
        />
        <StructuredData locale={locale} />
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
        {/* Cal.com embed — initialised once globally. The IIFE's
            cal.loaded guard makes re-init a no-op even if the layout
            re-renders. Triggered by any element with data-cal-link. */}
        <Script id="cal-embed" strategy="afterInteractive">
          {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "free-mockup-walkthrough-call", {origin:"https://app.cal.com"});
Cal.ns["free-mockup-walkthrough-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});`}
        </Script>
        {/* Vercel Web Analytics + Speed Insights — autoconfigured on Vercel
            deployments, no env vars needed. Placed after children + Cal
            script so they don't interfere with anything above. */}
        <Analytics />
        <SpeedInsights />
        {/* Blank-page failsafe. Almost all content is server-rendered at
            opacity:0 and revealed by `motion` after hydration. If the client
            bundle ever fails to run (e.g. an unsupported feature on an old
            browser), nothing sets `__appHydrated` and this reveals that hidden
            content so the page is never blank. When hydration succeeds it is a
            no-op, so the entrance animations and visual result are unchanged. */}
        <script
          dangerouslySetInnerHTML={{
            // The "trans"+"form" split is deliberate: it keeps Tailwind's
            // source scanner from extracting a bare token and emitting an
            // unused utility, so this script adds zero CSS to the bundle.
            __html:
              "(function(){function reveal(){if(window.__appHydrated)return;try{var p='trans'+'form';var n=document.querySelectorAll('[style]');for(var i=0;i<n.length;i++){var s=n[i].style;if(s.opacity==='0'){s.opacity='1';s.removeProperty(p);}}}catch(e){}}function arm(){setTimeout(reveal,5000);}if(document.readyState==='complete'){arm();}else{window.addEventListener('load',arm);}})();",
          }}
        />
      </body>
    </html>
  );
}
