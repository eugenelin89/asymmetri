import Link from "next/link";
import styles from "./resources.module.css";

export default function ResourceArticle({ children }: { children: React.ReactNode }) {
  return <div className={styles.resources}><header><Link href="/court-damage/play">Court Damage</Link> <span>Game resources</span></header>
    <main id="main-content">{children}</main>
    <footer><Link href="/court-damage/play">Play in browser</Link><Link href="/court-damage/support">Game support</Link><Link href="/court-damage/privacy">Privacy policy</Link></footer>
  </div>;
}
