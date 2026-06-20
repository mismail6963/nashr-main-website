import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Run the i18n middleware ONLY where a redirect/locale-negotiation is needed:
  // the root and any path that is not already locale-prefixed. Requests that
  // already carry a locale (/en, /ar) are skipped, so their statically
  // prerendered HTML is served straight from the global CDN edge instead of
  // being made uncacheable by the middleware's Set-Cookie and round-tripping to
  // the single origin region (the cause of the multi-second TTFB for distant
  // users). The locale still resolves from the URL param via setRequestLocale,
  // so rendering is unchanged.
  matcher: ["/((?!api|_next|_vercel|(?:en|ar)(?:/|$)|.*\\..*).*)"],
};
