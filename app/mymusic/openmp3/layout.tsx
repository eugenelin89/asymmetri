import type { Metadata } from "next";
import Link from "next/link";
import { openMP3 } from "@/content/site";
import styles from "./openmp3.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  icons: { icon: openMP3.icon, apple: openMP3.icon },
  openGraph: { title: "OpenMP3", description: openMP3.description, images: [{ url: openMP3.icon, width: 1024, height: 1024, alt: "OpenMP3 app icon" }] },
  twitter: { card: "summary", title: "OpenMP3", description: openMP3.description, images: [openMP3.icon] },
};
export default function OpenMP3Layout({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <header className={styles.header}><Link href={openMP3.path}>OPEN / MP3</Link><Link href="/mymusic">My Music on the web ↗</Link></header>
    {children}
    <footer className={styles.footer}><span>OpenMP3 · Asymmetri</span><nav aria-label="OpenMP3 resources"><Link href={openMP3.path}>Overview</Link><Link href={openMP3.supportPath}>Support</Link><Link href={openMP3.privacyPath}>Privacy</Link></nav></footer>
  </div>;
}
