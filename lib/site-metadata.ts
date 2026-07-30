import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetadata = {
  title: string;
  description: string;
};

export function createPageMetadata(
  page: PageMetadata,
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
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Asymmetrico — Better tools for an uneven playing field. Accessible sports technology, starting with baseball.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og.png"],
    },
  };
}
