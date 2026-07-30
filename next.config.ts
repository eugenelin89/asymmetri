import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/why-asymmetrico", destination: "/about#why-asymmetrico", permanent: true },
      { source: "/work/asymmetrico-platform", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
