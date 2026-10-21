import type { NextConfig } from "next";
import { motion } from "./content/site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Keep the public access URL stable while allowing the signup destination to change.
      { source: motion.access.path, destination: motion.access.formUrl, permanent: false },
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
