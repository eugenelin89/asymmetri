"use client";
import { useEffect, useState } from "react";
import type { Mode } from "./types";
import { views } from "./viewPolicy";
import styles from "./surrey.module.css";

export function ViewControls({ mode, disabled, select }: { mode: Mode; disabled: boolean; select: (mode: Mode) => void }) {
  return <div className={styles.viewSelector} role="group" aria-label="Explore Surrey">
    {views.map(view => <button key={view.mode} disabled={disabled} aria-pressed={mode === view.mode} onClick={() => select(view.mode)}>
      <span aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{view.mode === "ground" ? <><circle cx="13" cy="4" r="2" /><path d="M9 21l3-7 3 3 1 4M7 12l3-5 4 2 3 3h3M12 8l-1 6-4 3" /></> : <><path d="M3 20h18M5 20V9h5v11M10 20V4h5v16M15 20v-8h4v8M7 12h1m-1 3h1m4-8h1m-1 4h1m-1 4h1" /></>}</svg></span><span>{view.label}<small>{mode === view.mode ? "✓ Active" : "Select view"}</small></span>
    </button>)}
  </div>;
}
export function ViewHint({ mode }: { mode: Mode }) {
  return <p className={styles.viewHint}>{mode === "ground" ? "Explore Surrey from above — select Aerial Explore" : "Return to your character — select Street Adventure"}<span className={styles.keyboardCopy}> or press V</span>.</p>;
}
export function ViewHelp({ close }: { close: () => void }) {
  return <aside className={styles.viewHelp} aria-labelledby="surrey-view-help-title">
    <span className={styles.eyebrow}>YOUR CITY. TWO PERSPECTIVES.</span>
    <h3 id="surrey-view-help-title">Two ways to explore Surrey</h3>
    <p><strong>Street Adventure:</strong> Walk through the city, meet people and complete missions.</p>
    <p><strong>Aerial Explore:</strong> Fly above Surrey to find landmarks and see where you are.</p>
    <p>Switch anytime using the buttons at the top of the game.<span className={styles.keyboardCopy}> On a keyboard, press V.</span></p>
    <button className={styles.primary} onClick={close}>Got it →</button>
  </aside>;
}
export function AerialTips() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(false), 8500); return () => window.clearTimeout(timer); }, []);
  if (!visible) return null;
  return <div className={styles.aerialTips} role="status"><strong>AERIAL EXPLORE</strong><span className={styles.keyboardCopy}>Drag to orbit · Scroll to zoom · WASD to move · F to find your character</span><span className={styles.touchCopy}>Drag to orbit · Two fingers to pan and pinch · Tap Return to Player to find your character</span></div>;
}
