import type { MetadataRoute } from "next";

const BASE = "https://nashr.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languages = {
    en: `${BASE}/en`,
    ar: `${BASE}/ar`,
    "x-default": `${BASE}/en`,
  };
  return [
    {
      url: `${BASE}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${BASE}/ar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: { languages },
    },
  ];
}
