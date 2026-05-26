// JSON-LD structured data. Two schemas cross-referenced via @id:
//   - ProfessionalService (most specific applicable subtype of LocalBusiness)
//   - WebSite (declares site name + bilingual languages)
//
// Plain <script type="application/ld+json"> is preferred over next/script
// for inline JSON-LD — next/script's beforeInteractive strategy has known
// quirks with multiple inline scripts and ld+json content type, and the
// performance benefit doesn't apply (this is static text, not executed JS).
//
// Rendered once per page from app/[locale]/layout.tsx. The slogan is
// locale-aware; everything else is stable across locales — Google reads
// either page and resolves the same Organization entity via @id.

const BASE = "https://nashr.net";

export function StructuredData({ locale }: { locale: string }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE}/#organization`,
    name: "NASHR",
    alternateName: "نَشر",
    url: BASE,
    logo: `${BASE}/icon`,
    image: `${BASE}/${locale}/opengraph-image`,
    description:
      "Bilingual web design studio in Riyadh building custom websites for Saudi businesses in Arabic and English.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Region",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Oman" },
    ],
    knowsLanguage: ["en", "ar"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "mohammed@nashr.net",
        telephone: "+966555987440",
        availableLanguage: ["English", "Arabic"],
        areaServed: "SA",
      },
    ],
    // TODO: paste real socials when public
    sameAs: [
      // "https://www.instagram.com/nashr.studio",
      // "https://x.com/nashrstudio",
      // "https://www.linkedin.com/company/nashr",
    ],
    serviceType: [
      "Web design",
      "Web development",
      "Bilingual website development",
      "Arabic UX design",
      "Mobile-first web design",
      "RTL layout development",
      "Custom website development",
    ],
    priceRange: "$$",
    // TODO: replace with actual founding year if different
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Mohammed",
      email: "mohammed@nashr.net",
    },
    slogan:
      locale === "ar"
        ? "مواقع تحتاجها أعمال السعودية، فعلاً."
        : "Websites Saudi businesses actually need.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "NASHR",
    alternateName: "نَشر",
    description: "Bilingual web design studio in Riyadh.",
    inLanguage: ["en-SA", "ar-SA"],
    publisher: { "@id": `${BASE}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
