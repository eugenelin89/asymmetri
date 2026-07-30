import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
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
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Asymmetrico — Better tools for an uneven playing field. Accessible sports technology, starting with baseball.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.metadata.title,
    description: site.metadata.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
  colorScheme: "light dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.company.name,
  url: site.company.siteUrl,
  logo: `${site.company.siteUrl}/brand/asymmetrico-horizontal.svg`,
  description: site.metadata.description,
  email: site.company.contactEmail,
  knowsAbout: [
    "Athlete development",
    "Sports technology",
    "Sports analytics",
    "Biomechanics",
    "Wearable sensors",
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
