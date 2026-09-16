import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.company.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...site.footerNavigation.map((item) => ({
      url: `${site.company.siteUrl}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
