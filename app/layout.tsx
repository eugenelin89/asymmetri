import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asymmetri.co"),
  title: "Asymmetri Labs | Infrastructure for Physical AI",
  description:
    "Asymmetri Labs builds infrastructure that enables AI systems trained in simulation to operate reliably in the real world.",
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
