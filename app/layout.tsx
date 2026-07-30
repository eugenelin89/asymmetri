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
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Asymmetri Labs — Better evidence for better pitching. Smartphone video, sensors, and AI built to support coaches.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.metadata.title,
    description: site.metadata.description,
    images: ["/og.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1110",
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
  knowsAbout: [
    "Baseball technology",
    "Pitching development",
    "Pitching mechanics",
    "Smartphone video",
    "Wearable sensors",
    "Artificial intelligence",
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
