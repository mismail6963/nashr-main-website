import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { SectionWhat } from "@/components/sections/SectionWhat";
import { SectionHow } from "@/components/sections/SectionHow";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CustomCursor />
      <Header />
      <main id="main" className="relative">
        <Hero />
        <SectionWhat />
        <SectionHow />
        <section id="contact" style={{ minHeight: "40vh" }} />
      </main>
      <Footer />
    </>
  );
}
