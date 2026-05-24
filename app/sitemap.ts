import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const SITE_URL = "https://nashr.sa";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
      },
    },
  }));
}
