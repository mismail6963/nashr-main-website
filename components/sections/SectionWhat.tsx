import { useTranslations } from "next-intl";
import { SectionRef } from "@/components/ui/SectionRef";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/ui/CountUp";

type Stat = { value: number; suffix: string; label: string };

/**
 * §01 — What is NASHR
 * Two columns: body left 6/12, stats right 6/12 (no card chrome).
 * Stats are hairline-separated rows, Linear-style.
 */
export function SectionWhat() {
  const t = useTranslations("what");
  const stats = (t.raw("stats") as Stat[]) ?? [];

  return (
    <section id="what" className="section-pad below-fold hairline">
      <div className="container-page">
        <Reveal>
          <SectionRef number="1.0" label={t("ref")} />
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="t-h1 mt-10 md:mt-12 max-w-[18ch] text-[var(--fg)]">
            {t("headline")}
          </h2>
        </Reveal>

        <div className="mt-20 md:mt-28 grid grid-cols-12 gap-6 md:gap-10">
          {/* Body — full on sm, 6/12 on md+ */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            <Reveal delay={0.1}>
              <p className="t-body-lg text-[var(--fg-secondary)] max-w-[540px]">
                {t("intro1")}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="t-body-lg text-[var(--fg-secondary)] max-w-[540px]">
                {t("intro2")}
              </p>
            </Reveal>
          </div>

          {/* Stats — full on sm, 6/12 on md+. Hairline rows, no boxes. */}
          <div className="col-span-12 md:col-span-6">
            <ul className="border-t border-[var(--border)]">
              {stats.map((stat, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-4 border-b border-[var(--border)] py-8 md:py-10 items-baseline"
                >
                  <div className="col-span-12 md:col-span-5">
                    <span
                      className="t-display ltr-mono inline-flex items-baseline gap-0"
                      style={{
                        fontFamily: "var(--font-sans), sans-serif",
                        fontWeight: 400,
                        fontSize: "clamp(56px, 8vw, 96px)",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      <CountUp to={stat.value} />
                      <span style={{ color: "var(--gold)" }}>{stat.suffix}</span>
                    </span>
                  </div>
                  <p className="col-span-12 md:col-span-7 text-[var(--fg-secondary)] t-body">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
