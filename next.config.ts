import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Preserve every published page, exact-run link and GET-only download/read URL.
      { source: "/botsquad/investment/:path*", destination: "/botsquad/trade/:path*", permanent: true },
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
