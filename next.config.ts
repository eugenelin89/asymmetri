import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Rollback compatibility for cached Trade redirects and new bookmarks.
    return [{ source: "/botsquad/trade/:path*", destination: "/botsquad/investment/:path*" }];
  },
  async redirects() {
    return [
      { source: "/sport", destination: "/sports", permanent: true },
      { source: "/work", destination: "/labs", permanent: true },
      { source: "/story", destination: "/sports#story", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      {
        source: "/why-asymmetrico",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/work/asymmetrico-platform",
        destination: "/sports",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
