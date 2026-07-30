import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/story", destination: "/#story", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/about", destination: "/#story", permanent: true },
      { source: "/work", destination: "/", permanent: true },
      {
        source: "/why-asymmetrico",
        destination: "/#story",
        permanent: true,
      },
      {
        source: "/work/asymmetrico-platform",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
