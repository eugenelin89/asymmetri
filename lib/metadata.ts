import type { Metadata } from "next";
import { site, type UtilityPageContent } from "@/content/site";

export function pageMetadata(
  page: { title: string; description: string },
  path: string,
  image = "/images/labs-social.png",
): Metadata {
  return {
    ...page,
    alternates: { canonical: path },
    openGraph: {
      ...page,
      url: path,
      siteName: site.company.name,
      type: "website",
      locale: "en_CA",
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
    },
    twitter: { ...page, card: "summary_large_image", images: [image] },
  };
}

export function utilityMetadata(
  page: UtilityPageContent,
  path: string,
): Metadata {
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
