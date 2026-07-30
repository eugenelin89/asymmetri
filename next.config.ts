import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/story", permanent: true },
      { source: "/work", destination: "/story", permanent: true },
      { source: "/why-asymmetrico", destination: "/story", permanent: true },
      { source: "/work/asymmetrico-platform", destination: "/story", permanent: true },
    ];
  },
};

export default nextConfig;
