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
import { SectionShell } from "@/components/ui/SectionShell";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

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

// Status badges per cell — adds a Linear-doc / engineering feel
const BADGES = [
  { label: "CORE", active: true },
  { label: "FAST", active: false },
  { label: "ACTIVE", active: true },
  { label: "ADD-ON", active: false },
  { label: "LOCAL", active: false },
  { label: "OPTIONAL", active: false },
  { label: "INCLUDED", active: false },
  { label: "INCLUDED", active: false },
  { label: "FINAL", active: true },
];

export function SectionHelp() {
  const t = useTranslations("help");
  const caps = (t.raw("cards") as Capability[]) ?? [];

  return (
    <SectionShell
      id="help"
      number="3.0"
      label={t("ref")}
      watermark="03"
      dotGrid
    >
      <Reveal>
        <h2 className="t-h1 max-w-[22ch] text-[var(--fg)]">{t("headline")}</h2>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="t-body-lg mt-8 text-[var(--fg-secondary)] max-w-[600px]">
          {t("sub")}
        </p>
      </Reveal>

      {/* Square aspect cells. 1 / 2 / 3 cols. Each has a status badge
          in the top-right and a subtle gold glow on hover. */}
      <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {caps.map((cap, i) => {
          const Icon = ICONS[i] ?? Layers;
          const badge = BADGES[i] ?? BADGES[0];
          return (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <div className="group relative h-full bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors duration-200 p-7 md:p-8 flex flex-col justify-between min-h-[260px]">
                {/* Top hairline highlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(164,143,96,0.5), transparent)",
                  }}
                />
                {/* Status badge */}
                <span
                  className={cn(
                    "absolute top-4 status-badge",
                    badge.active && "is-active",
                  )}
                  style={{ insetInlineEnd: "16px" }}
                  aria-hidden
                >
                  {badge.label}
                </span>

                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "var(--fg-muted)" }}
                  aria-hidden
                />

                <div className="mt-6">
                  <h3 className="t-body-lg font-medium text-[var(--fg)] group-hover:text-[var(--gold-bright)] transition-colors duration-200">
                    {cap.title}
                  </h3>
                  <p className="mt-3 t-body text-[var(--fg-secondary)]">
                    {cap.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Decorative hairline + dot — §6.4 */}
      <div className="mt-24 flex justify-center" aria-hidden>
        <div className="relative" style={{ width: "240px" }}>
          <div className="absolute top-1/2 inset-x-0 h-px bg-[var(--border-strong)]" />
          <div
            className="relative mx-auto h-1.5 w-1.5 rounded-full bg-[var(--gold-bright)]"
            style={{ boxShadow: "0 0 0 4px var(--gold-faint)" }}
          />
        </div>
      </div>

      <Reveal delay={0.12}>
        <p className="mt-10 text-center">
          <Mono size={11} tone="faint">
            {t("disclaimer")}
          </Mono>
        </p>
      </Reveal>
    </SectionShell>
  );
}
