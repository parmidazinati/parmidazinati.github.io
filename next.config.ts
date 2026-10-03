import type { NextConfig } from "next";

/**
 * Two build flavours:
 *
 * 1. default (no env)          → `output: "standalone"` — the full dynamic app
 * 2. STATIC_EXPORT=1 (scripts/build-static.sh)
 *    → `output: "export"` — pure-static bundle for GitHub Pages:
 *      no API routes, no admin panel, images unoptimized, trailing slashes.
 *      Client components read NEXT_PUBLIC_STATIC_EXPORT to swap
 *      server-backed features for graceful static fallbacks.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
