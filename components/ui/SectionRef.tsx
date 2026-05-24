import { Mono } from "./Mono";

type Props = {
  /** "1.0", "2.0", etc. */
  number: string;
  label: string;
};

/**
 * Section reference, Linear-style: `1.0 — WHAT IS NASHR`
 * Always LTR + Latin. Used at the top of every section.
 */
export function SectionRef({ number, label }: Props) {
  return (
    <Mono size={11} tone="faint">
      <span aria-hidden className="inline-block align-middle me-3 h-px w-8 bg-[var(--border-strong)]" />
      {number} — {label}
    </Mono>
  );
}
