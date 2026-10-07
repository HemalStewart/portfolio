import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Afterhours streams hundreds of WebP frames per scene; let browsers reuse them without revalidating each one.
  async headers() {
    return [
      {
        source: "/showcase/afterhours/:dir(reference-media|frames-mobile)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
  // Static 3D showcase pages live in public/showcase; serve them at clean URLs.
  async rewrites() {
    return [
      { source: "/showcase", destination: "/showcase/index.html" },
      {
        source: "/showcase/:site(tea|villa|sapphire|coffee|surf|afterhours|crunch)",
        destination: "/showcase/:site/index.html",
      },
      // Multi-page preview of the Lakmini International redesign.
      { source: "/showcase/lakmini", destination: "/showcase/lakmini/index.html" },
      {
        source: "/showcase/lakmini/:page(about|services|contact)",
        destination: "/showcase/lakmini/:page/index.html",
      },
      // Free homepage designs made for prospective clients.
      {
        source: "/preview/:client(nilaveli|ceylon-select)",
        destination: "/preview/:client/index.html",
      },
    ];
  },
};

export default nextConfig;
