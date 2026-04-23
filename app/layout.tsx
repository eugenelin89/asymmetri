import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asymmetri.co"),
  title: "Asymmetri Labs | Infrastructure for Physical AI",
  description:
    "Asymmetri Labs builds infrastructure that enables AI systems trained in simulation to operate reliably in the real world.",
  icons: {
    icon: "/logo2.png",
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
  openGraph: {
    title: "Asymmetri Labs | Infrastructure for Physical AI",
    description:
      "Sim-to-real infrastructure for deploying Physical AI systems from simulation into the real world.",
    url: "https://asymmetri.co",
    siteName: "Asymmetri Labs",
    images: [
      {
        url: "/logo_w2.png",
        width: 1536,
        height: 1024,
        alt: "Asymmetri Labs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asymmetri Labs | Infrastructure for Physical AI",
    description:
      "Sim-to-real infrastructure for deploying Physical AI systems from simulation into the real world.",
    images: ["/logo_w2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ink font-sans text-white antialiased">{children}</body>
    </html>
  );
}
