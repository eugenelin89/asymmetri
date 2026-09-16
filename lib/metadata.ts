import type { Metadata } from "next";
import { site, type UtilityPageContent } from "@/content/site";

export function utilityMetadata(page: UtilityPageContent, path: string): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      siteName: site.company.name,
      type: "website",
      locale: "en_CA",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}
