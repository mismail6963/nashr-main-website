/**
 * Section reference, Linear-style: `1.0 — WHAT IS NASHR`
 *
 * The rail + number ("1.0 —") stays LTR + mono in both locales.
 * The label after the em-dash takes the locale's natural font:
 *   - en: JetBrains Mono uppercase letter-spaced (Linear-style)
 *   - ar: IBM Plex Sans Arabic, normal case (mono Latin fonts have no
 *         Arabic glyphs and would render boxes)
 *
 * The CSS-driven per-locale styling lives in globals.css on the
 * `.section-ref-label` class so the JSX stays locale-agnostic.
 */
type Props = {
  /** "1.0", "2.0", etc. */
  number: string;
  label: string;
};

export function SectionRef({ number, label }: Props) {
  return (
    <div className="inline-flex items-center gap-3 text-[var(--fg-faint)]">
      <span
        aria-hidden
        className="inline-block h-px w-8 bg-[var(--border-strong)]"
      />
      <span
        dir="ltr"
        lang="en"
        className="font-mono t-mono-sm uppercase"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {number} —
      </span>
      <span className="section-ref-label">{label}</span>
    </div>
  );
}
