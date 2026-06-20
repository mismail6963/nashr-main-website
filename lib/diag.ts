// Client-side diagnostics helpers (Part A). Pair with the inline diagnostics
// script in app/[locale]/layout.tsx. Flag-gated and removable: everything is a
// no-op unless the visitor enabled debug mode with ?debug=1 (persisted for the
// tab). Safe to delete this file and its imports once the cause is found.

/** True only when on-screen diagnostics were explicitly enabled (?debug=1). */
export function diagEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (/[?&]debug=1/.test(window.location.search)) return true;
    return sessionStorage.getItem("nashr_debug") === "1";
  } catch {
    // Safari Private mode can throw on storage access — fall back to the URL.
    try {
      return /[?&]debug=1/.test(window.location.search);
    } catch {
      return false;
    }
  }
}

/**
 * Surface a failure to the on-screen diagnostics overlay (and the console).
 * Used to report things that otherwise fail silently into blank content:
 * render/hydration errors, chunk-load failures, image errors, fetch failures.
 */
export function reportDiag(kind: string, message: string): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    __nashrDiag?: (kind: string, message: string) => void;
  };
  try {
    w.__nashrDiag?.(kind, message);
  } catch {
    /* ignore */
  }
  try {
    // eslint-disable-next-line no-console
    console.error(`[nashr:${kind}] ${message}`);
  } catch {
    /* ignore */
  }
}
