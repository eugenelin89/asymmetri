import type { MetadataRoute } from "next";
import { motion, site, tutorial } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.company.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.company.siteUrl}${motion.path}`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...["/sports", "/labs", "/botsquad", "/about"].map((path) => ({
      url: `${site.company.siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...site.footerNavigation.map((item) => ({
      url:
        item.href === tutorial.path
          ? tutorial.canonical
          : `${site.company.siteUrl}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
