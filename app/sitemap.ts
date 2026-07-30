import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes = ["", "/story", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.company.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : route === "/story" ? 0.9 : 0.7,
  }));
}
