type Props = {
  number: string; // "01"
  label: string;  // "WHAT IS NASHR"
};

/**
 * Mono uppercase numeral + label, prefixed by a 32px gold rule line.
 * Stays LTR even in RTL layouts.
 */
export function SectionLabel({ number, label }: Props) {
  return (
    <div className="force-ltr flex items-center gap-4">
      <span
        aria-hidden
        className="h-px w-8 bg-[var(--gold)]"
        style={{ opacity: 0.7 }}
      />
      <span
        className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--gold)]"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {number}
        <span className="mx-2 text-[var(--fg-faint)]">/</span>
        <span className="text-[var(--fg-muted)]">{label}</span>
      </span>
    </div>
  );
}
