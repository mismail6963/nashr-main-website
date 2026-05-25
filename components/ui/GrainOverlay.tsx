/**
 * Fixed, full-viewport SVG fractal noise overlay at 3% opacity.
 * Pointer-events-none, z-index 60 — sits above content but below
 * any modal/menu overlays.
 *
 * This is the single biggest "expensive feel" cheat code on the site.
 * Pure static — no animation, no JS cost.
 */
export function GrainOverlay() {
  const noise =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 55,
        opacity: 0.03,
        mixBlendMode: "overlay",
        backgroundImage: noise,
        backgroundSize: "240px 240px",
      }}
    />
  );
}
