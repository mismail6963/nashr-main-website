import { useTranslations } from "next-intl";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { AmbientMesh } from "@/components/ui/AmbientMesh";

type Stat = { value: number; suffix: string; label: string };

/**
 * §01 — What is NASHR
 * 2-col sticky layout via SectionShell.
 * Stats sit in a single sheet — 1px hairline grid via gap-px on a hairline bg.
 */
export function SectionWhat() {
  const t = useTranslations("what");
  const stats = (t.raw("stats") as Stat[]) ?? [];

  return (
    <SectionShell id="what" number="1.0" label={t("ref")} watermark="01">
      <Reveal>
        <h2 className="t-h1 max-w-[18ch] text-[var(--fg)]">{t("headline")}</h2>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="t-body-lg mt-10 text-[var(--fg-secondary)] max-w-[540px]">
          {t("intro1")}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="t-body-lg mt-6 text-[var(--fg-secondary)] max-w-[540px]">
          {t("intro2")}
        </p>
      </Reveal>

      {/* Stats — 3 cells in a single hairline sheet, with ambient mesh behind */}
      <Reveal delay={0.15}>
        <div className="relative mt-20 md:mt-24">
          <AmbientMesh variant="stats" className="opacity-50" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)]">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[var(--bg)] p-10 md:p-12 flex flex-col gap-4 min-h-[260px]">
              <span
                className="ltr-mono inline-flex items-baseline"
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(56px, 7vw, 88px)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--gold-bright)",
                }}
              >
                <CountUp to={stat.value} />
                <span>{stat.suffix}</span>
              </span>
              <p className="font-mono t-mono-sm uppercase text-[var(--fg-faint)]">
                {stat.label}
              </p>
            </div>
          ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
