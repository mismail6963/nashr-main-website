import { useTranslations } from "next-intl";
import {
  Languages,
  Smartphone,
  MessageCircle,
  Calendar,
  MapPin,
  MessageSquare,
  Layers,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionRef } from "@/components/ui/SectionRef";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";

type Capability = { title: string; body: string };

const ICONS: LucideIcon[] = [
  Languages,
  Smartphone,
  MessageCircle,
  Calendar,
  MapPin,
  MessageSquare,
  Layers,
  Search,
  ShieldCheck,
];

export function SectionHelp() {
  const t = useTranslations("help");
  const caps = (t.raw("cards") as Capability[]) ?? [];

  return (
    <section id="help" className="section-pad below-fold hairline">
      <div className="container-page">
        <Reveal>
          <SectionRef number="3.0" label={t("ref")} />
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="t-h1 mt-10 md:mt-12 max-w-[24ch] text-[var(--fg)]">
            {t("headline")}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 t-body-lg text-[var(--fg-secondary)] max-w-[600px]">
            {t("sub")}
          </p>
        </Reveal>

        {/* Structured grid: 1 / 2 / 3 cols. Shared borders via grid lines.
            Each cell has top border. Left border applied to cols 2+
            and reset at every row start by ::nth-child. */}
        <div className="mt-20 md:mt-24">
          <div
            className="grid-cells"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(var(--cols, 1), minmax(0, 1fr))",
            }}
          >
            {caps.map((cap, i) => {
              const Icon = ICONS[i] ?? Layers;
              return (
                <Cell key={i} index={i}>
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: "var(--fg-muted)" }}
                    aria-hidden
                  />
                  <h3 className="mt-6 t-body-lg font-medium text-[var(--fg)] transition-colors duration-150 cell-title">
                    {cap.title}
                  </h3>
                  <p className="mt-3 t-body text-[var(--fg-secondary)]">
                    {cap.body}
                  </p>
                </Cell>
              );
            })}
          </div>
          <style>{`
            .grid-cells { --cols: 1; }
            @media (min-width: 768px) { .grid-cells { --cols: 2; } }
            @media (min-width: 1024px) { .grid-cells { --cols: 3; } }
            .grid-cells > * {
              border-top: 1px solid var(--border);
              padding: 32px 0;
              padding-inline-end: 24px;
            }
            /* All cells get a leading inline border, then we strip it
               for the first cell of each row using nth-child math. */
            .grid-cells > * { border-inline-start: 1px solid var(--border); padding-inline-start: 24px; }
            @media (max-width: 767px) {
              .grid-cells > *:nth-child(n) { border-inline-start: 0; padding-inline-start: 0; padding-inline-end: 0; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .grid-cells > *:nth-child(2n+1) { border-inline-start: 0; padding-inline-start: 0; }
            }
            @media (min-width: 1024px) {
              .grid-cells > *:nth-child(3n+1) { border-inline-start: 0; padding-inline-start: 0; }
            }
            .grid-cells > *:hover .cell-title { color: var(--gold); }
            /* Add a bottom border on the very last row */
            .grid-cells > *:last-child,
            .grid-cells > *:nth-last-child(2),
            .grid-cells > *:nth-last-child(3) {}
          `}</style>
        </div>

        {/* Decorative hairline with gold dot — §6.4 */}
        <div className="mt-24 flex justify-center" aria-hidden>
          <div className="relative" style={{ width: "240px" }}>
            <div className="absolute top-1/2 inset-x-0 h-px bg-[var(--border-strong)]" />
            <div
              className="relative mx-auto h-1 w-1 rounded-full bg-[var(--gold)]"
              style={{ boxShadow: "0 0 0 4px var(--gold-faint)" }}
            />
          </div>
        </div>

        {/* Pricing disclaimer */}
        <Reveal delay={0.12}>
          <p className="mt-12 text-center">
            <Mono size={11} tone="faint">
              {t("disclaimer")}
            </Mono>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Cell({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return <div data-index={index}>{children}</div>;
}
