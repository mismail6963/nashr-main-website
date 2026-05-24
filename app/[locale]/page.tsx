import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";

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
        <section id="hero" className="flex min-h-screen items-center px-6 md:px-10">
          <p
            className="font-mono"
            style={{
              color: "var(--fg-muted)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            Header & footer wired · locale: {locale}
          </p>
        </section>
        <section id="what" style={{ minHeight: "60vh" }} />
        <section id="how" style={{ minHeight: "60vh" }} />
        <section id="contact" style={{ minHeight: "40vh" }} />
      </main>
      <Footer />
    </>
  );
}
