import type { NextConfig } from "next";
import { motion } from "./content/site";

const nextConfig: NextConfig = {
  async headers() {
    const version = "/court-damage/builds/:revision([0-9a-f]{40})";
    const cache = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };
    const encodings = [
      { extension: "wasm.gz", contentType: "application/wasm" },
      { extension: "js.gz", contentType: "application/javascript" },
      { extension: "data.gz", contentType: "application/gzip" },
    ];
    return [
      { source: `${version}/:asset*`, headers: [cache] },
      ...encodings.map(({ extension, contentType }) => ({
        source: `${version}/Build/:name.${extension}`,
        headers: [
          { key: "Content-Type", value: contentType },
          { key: "Content-Encoding", value: "gzip" },
        ],
      })),
    ];
  },
  async redirects() {
    return [
      // Preserve previously shared access links after the App Store launch.
      { source: motion.access.path, destination: motion.access.appStoreUrl, permanent: false },
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
