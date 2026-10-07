import type { Metadata, Viewport } from "next";
import { divisions, site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.company.siteUrl),
  title: site.metadata.title,
  description: site.metadata.description,
  applicationName: site.company.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/asymmetrico-app-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/brand/asymmetrico-app-icon.png",
  },
  openGraph: {
    title: site.metadata.title,
    description: site.metadata.description,
    url: "/",
    siteName: site.company.name,
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/home-social.png",
        width: 1200,
        height: 630,
        alt: `${site.company.name}: ${site.metadata.socialHeadline} ${site.metadata.socialSupport}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.metadata.title,
    description: site.metadata.description,
    images: ["/images/home-social.png"],
  },
};

export const viewport: Viewport = {
  themeColor: site.metadata.themeColor,
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.company.name,
  url: site.company.siteUrl,
  logo: `${site.company.siteUrl}/favicon.svg`,
  description: site.metadata.description,
  email: site.company.contactEmail,
  subOrganization: Object.values(divisions).map((division) => ({
    "@type": "Organization",
    name: division.name,
    url: `${site.company.siteUrl}${division.path}`,
  })),
  knowsAbout: [
    "AI worker coordination",
    "Sports technology",
    "Inspectable evidence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
