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
    ];
  },
};

export default nextConfig;
