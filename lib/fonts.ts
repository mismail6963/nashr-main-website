import localFont from "next/font/local";

// Self-hosted variable fonts. Files live in /public/fonts.
// Variable fonts mean a single woff2 file covers the full weight range,
// which we keep narrow with weight clamping for predictable rendering.

export const fontSans = localFont({
  src: "../public/fonts/InterTight-Variable.woff2",
  display: "optional",
  variable: "--font-sans",
  weight: "100 900",
  style: "normal",
  preload: true,
});

export const fontMono = localFont({
  src: "../public/fonts/JetBrainsMono-Variable.woff2",
  display: "optional",
  variable: "--font-mono",
  weight: "100 800",
  style: "normal",
  preload: true,
});

export const fontArabic = localFont({
  src: [
    {
      path: "../public/fonts/IBMPlexSansArabic-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexSansArabic-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexSansArabic-600.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "optional",
  variable: "--font-arabic",
  preload: true,
});
