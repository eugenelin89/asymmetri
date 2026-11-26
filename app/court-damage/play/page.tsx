import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import Link from "next/link";
import CourtLauncher from "./CourtLauncher";
import styles from "./play.module.css";

const title = "Play Court Damage | Asymmetri";
const description = "Play first-to-five doubles pickleball at Mercer Yard. Four waterfront regulars, one live ball, and a little paddle-related chaos.";
const poster = "/images/court-damage/waterfront-poster.jpg";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/court-damage/play" },
  robots: { index: true, follow: true },
  openGraph: { title, description, url: "/court-damage/play", type: "website",
    images: [{ url: poster, width: 1200, height: 800, alt: "The four Court Damage players at False Creek, illustrated." }] },
  twitter: { card: "summary_large_image", title, description, images: [poster] },
};

export default function PlayCourtDamage() {
  return <div className={styles.page}>
    <a className={styles.skip} href="#court">Skip to game</a>
    <header className={styles.header}>
      <Link href="/" aria-label="Asymmetri home"><Logo tone="canvas" /></Link>
      <nav aria-label="Court Damage"><a href="#controls">Controls</a><Link href="/court-damage/support">Support</Link></nav>
    </header>
    <main id="main-content" className={styles.main}>
      <CourtLauncher />
      <section id="controls" className={styles.guide} aria-labelledby="controls-title">
        <div className={styles.guideHead}><h2 id="controls-title">Court controls</h2><p>Let the serve and its return bounce. Then it’s open season.</p></div>
        <dl className={styles.bindings}>
          <div><dt><kbd>WASD</kbd> / <kbd>↑↓←→</kbd></dt><dd>Move</dd></div>
          <div><dt><kbd>J</kbd></dt><dd>Soft shot</dd></div>
          <div><dt><kbd>K</kbd></dt><dd>Hard shot</dd></div>
          <div><dt><kbd>L</kbd></dt><dd>Paddle Bonk</dd></div>
          <div><dt><kbd>Space</kbd></dt><dd>Spit / fight</dd></div>
        </dl>
        <div className={styles.notes}><p><strong>Touch</strong> Turn sideways. Move with the left stick and tap actions with your other thumb.</p><p><strong>Sound</strong> Tap Voice in the game to switch character audio. Captions and court sounds stay on.</p></div>
      </section>
    </main>
    <footer className={styles.footer}><span>Court Damage</span><nav aria-label="Game resources"><Link href="/court-damage/privacy">Privacy</Link><Link href="/court-damage/support">Game support</Link><Link href="/">Asymmetri ↗</Link></nav></footer>
  </div>;
}
