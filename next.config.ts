import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static 3D showcase pages live in public/showcase; serve them at clean URLs.
  async rewrites() {
    return [
      { source: "/showcase", destination: "/showcase/index.html" },
      {
        source: "/showcase/:site(tea|villa|sapphire|coffee|surf)",
        destination: "/showcase/:site/index.html",
      },
      // Multi-page preview of the Lakmini International redesign.
      { source: "/showcase/lakmini", destination: "/showcase/lakmini/index.html" },
      {
        source: "/showcase/lakmini/:page(about|services|contact)",
        destination: "/showcase/lakmini/:page/index.html",
      },
    ];
  },
};

export default nextConfig;
