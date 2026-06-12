import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SOP URL change: drop the redundant `/calculators/` folder. 301 any old
  // links to the clean structure so nothing breaks and link equity is kept.
  async redirects() {
    return [
      { source: "/calculators", destination: "/browse", permanent: true },
      {
        source: "/calculators/:category",
        destination: "/:category",
        permanent: true,
      },
      {
        source: "/calculators/:category/:slug",
        destination: "/:category/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
