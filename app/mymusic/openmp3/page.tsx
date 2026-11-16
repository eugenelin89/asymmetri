import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { openMP3 } from "@/content/site";
import styles from "./openmp3.module.css";
export const metadata: Metadata = { title: "OpenMP3 — Your folders. Your music.", description: openMP3.description, alternates: { canonical: openMP3.path } };
export default function OpenMP3Page() {
  return <main id="main-content">
    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>A simple music player for iPhone</p><h1>Your folders.<br />Your music.</h1><p className={styles.lead}>{openMP3.description}</p><p className={styles.price}>{openMP3.price}</p><p className={styles.status}>{openMP3.availability} · {openMP3.minimumOS}</p><Link className={styles.action} href={openMP3.supportPath}>See how it works →</Link></div>
      <Image className={styles.icon} src={openMP3.icon} alt="OpenMP3: a lime open circle and play symbol on graphite" width={320} height={320} priority />
    </section>
    <section className={styles.features} aria-label="Player features">{openMP3.features.map(feature => <article key={feature.title}><h2>{feature.title}</h2><p>{feature.text}</p></article>)}</section>
    <section className={styles.note}><h2>A player for the music you choose.</h2><p>{openMP3.limitation}</p><p>OpenMP3 is independent of Google and is not affiliated with or endorsed by Google. No music catalogue is included.</p></section>
  </main>;
}
