import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // These dependencies ship modern JS syntax (optional chaining, nullish
  // coalescing, logical-assignment, private class fields) in their published
  // bundles. Next.js does NOT transpile node_modules by default, so on older
  // Safari / iOS (which can't parse that syntax) these chunks fail to load and
  // `motion` never runs — leaving the whole page stuck at the opacity:0 initial
  // state it server-renders, i.e. a blank page. Running them through the SWC
  // compiler lowers the syntax to the browserslist target so they parse
  // everywhere. No effect on output for browsers that already support it.
  transpilePackages: ["motion", "framer-motion", "lenis", "lucide-react", "next-intl"],
};

export default withNextIntl(nextConfig);
