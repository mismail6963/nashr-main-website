import { Instrument_Serif, Geist, Geist_Mono, Rubik } from "next/font/google";

export const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const fontSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontArabic = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});
