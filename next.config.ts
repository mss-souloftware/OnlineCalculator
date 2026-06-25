import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Prevent the browser from MIME-sniffing responses (applied everywhere).
    const noSniff = { key: "X-Content-Type-Options", value: "nosniff" };

    return [
      {
        // Embed routes are the whole point of the feature: any third-party site
        // must be able to frame them. `frame-ancestors *` allows all origins —
        // and we deliberately set NO `X-Frame-Options` here (it has no "allow
        // all" value, and its presence would block framing). Cache at the CDN so
        // the dynamic (?theme) route isn't re-rendered on every external hit.
        source: "/embed/:path*",
        headers: [
          noSniff,
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Everything EXCEPT /embed: lock framing to our own origin so the main
        // site can't be iframed by attackers (clickjacking protection).
        source: "/((?!embed).*)",
        headers: [
          noSniff,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },

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
