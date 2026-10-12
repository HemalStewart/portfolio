import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These projects have their own hosting; preserve links shared before they moved.
  async redirects() {
    return [
      {
        source: "/preview/nilaveli/:path*",
        destination: "https://nilaveli-beach-resort.vercel.app/",
        permanent: true,
      },
      {
        source: "/showcase/lakmini/:path*",
        destination: "https://lakminiint.com/:path*",
        permanent: true,
      },
    ];
  },
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
        source: "/showcase/:site(tea|villa|sapphire|coffee|surf|afterhours|crunch|wayline)",
        destination: "/showcase/:site/index.html",
      },
      // Free homepage designs made for prospective clients.
      {
        source: "/preview/ceylon-select",
        destination: "/preview/ceylon-select/index.html",
      },
    ];
  },
};

export default nextConfig;
