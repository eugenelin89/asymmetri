import type { Metadata } from "next";
import Link from "next/link";
import styles from "./resources.module.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CourtDamageResources({ children }: { children: React.ReactNode }) {
  return <div className={styles.resources}><header>Court Damage <span>iPhone</span></header>
    <main id="main-content">{children}</main>
    <footer><Link href="/court-damage/support">Game support</Link><Link href="/court-damage/privacy">Privacy policy</Link></footer>
  </div>;
}
