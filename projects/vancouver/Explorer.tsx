"use client";

import { useEffect, useRef, useState } from "react";
import { places } from "./places";
import type { Explorer, Input, Mode } from "./types";
import styles from "./vancouver.module.css";

export function VancouverExplorer() {
  const mount = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const engine = useRef<Explorer | null>(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<Mode>("aerial");
  const [selected, setSelected] = useState<string>("science-world");
  const [speed, setSpeed] = useState(0);
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState(true);
  const place = places.find((p) => p.id === selected) ?? places[0];

  useEffect(() => {
    const controller = new AbortController();
    let instance: Explorer | null = null;
    const host = mount.current;
    if (!host || !enabled) return;
    import("./engine").then(({ createExplorer }) => createExplorer(host, {
      select: setSelected,
      speed: setSpeed,
      fail(message) { setError(message); setStatus("error"); },
    }, controller.signal)).then((created) => {
      instance = created;
      if (controller.signal.aborted) { created.dispose(); return; }
      engine.current = created; setStatus("ready");
    }).catch((reason: unknown) => {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error && reason.message.includes("data") ? reason.message : "The 3D view needs WebGL2. You can still explore every place and source below.");
      setStatus("error");
    });
    return () => { controller.abort(); instance?.dispose(); engine.current = null; };
  }, [attempt, enabled]);

  function changeMode(next: Mode) { setMode(next); engine.current?.setMode(next); setSpeed(0); mount.current?.querySelector("canvas")?.focus({ preventScroll: true }); }
  function focus(id: string) { setSelected(id); setMode("aerial"); engine.current?.focus(id); }
  function touch(action: Input, pressed: boolean) { engine.current?.setInput(action, pressed); }

  return (
    <section className={styles.experience} aria-label="Explore eastern False Creek">
      <div className={styles.viewport} ref={viewport}>
        <div className={styles.canvas} ref={mount} />
        <div className={styles.toolbar}>
          <div className={styles.modes} aria-label="Navigation mode">
            <button type="button" aria-pressed={mode === "aerial"} onClick={() => changeMode("aerial")} disabled={status !== "ready"}>↗ Aerial</button>
            <button type="button" aria-pressed={mode === "drive"} onClick={() => changeMode("drive")} disabled={status !== "ready"}>◇ Drive</button>
          </div>
          <div className={styles.viewActions}>
            <button type="button" onClick={() => engine.current?.reset()} disabled={status !== "ready"}>Reset view</button>
            <button type="button" aria-label="Toggle fullscreen city view" onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void viewport.current?.requestFullscreen?.().catch(() => undefined); }}>⛶</button>
          </div>
        </div>
        {(status !== "ready" || !enabled) && <div className={styles.loading} role="status">
          <span className={styles.loadingMark}>V.</span>
          <h2>{!enabled ? "The city can wait." : status === "loading" ? "A little piece of Vancouver." : "Explore at your own pace."}</h2>
          <p>{!enabled ? "3D is paused. Every place and source is still available below." : status === "loading" ? "Preparing the waterfront, streets and skyline…" : error}</p>
          {(status === "error" || !enabled) && <button type="button" onClick={() => { setEnabled(true); setStatus("loading"); setError(""); setMode("aerial"); setAttempt((n) => n + 1); }}>Reload 3D view</button>}
          <a href="#vancouver-places">Browse the places ↓</a>
        </div>}
        <div className={styles.locationBadge}><span className={styles.liveDot} /> EASTERN FALSE CREEK <span>49.273° N · 123.111° W</span></div>
        <div className={styles.controlsHint}>
          {mode === "aerial" ? <><strong>Make yourself at home.</strong><span>Drag to orbit · scroll / pinch to zoom · right-drag / two fingers to pan</span><span>Click a teal beacon or choose a place below.</span></> : <><strong>{speed} <small>km/h</small> <span className={styles.arcadeLabel}>ARCADE</span></strong><span>WASD / arrows to drive · space to brake · R to reset</span><span>Flat streets only. Bridge driving is not available yet.</span></>}
        </div>
        {mode === "drive" && status === "ready" && <div className={styles.driveControls} aria-label="Driving controls">
          {([{ action: "left", label: "Steer left", text: "←" }, { action: "right", label: "Steer right", text: "→" }, { action: "back", label: "Reverse", text: "↓" }, { action: "forward", label: "Accelerate", text: "↑" }, { action: "brake", label: "Brake", text: "■" }] as const).map(({ action, label, text }) => <button type="button" key={action} aria-label={label}
            onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); touch(action, true); }}
            onPointerUp={() => touch(action, false)} onPointerCancel={() => touch(action, false)} onLostPointerCapture={() => touch(action, false)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); touch(action, true); } }}
            onKeyUp={() => touch(action, false)} onBlur={() => touch(action, false)}>{text}</button>)}
        </div>}
        <div className={styles.sceneNote}>2015 footprints · illustrative heights · simplified geography</div>
      </div>
      <div className={styles.discovery} id="vancouver-places">
        <div className={styles.directory}>
          <div className={styles.sectionLabel}>YOUR NEXT STOP <button type="button" className={styles.textToggle} onClick={() => { setEnabled((value) => !value); setStatus("loading"); setMode("aerial"); }}>{enabled ? "Pause 3D" : "Resume 3D"}</button></div>
          <label className={styles.search}><span className={styles.srOnly}>Find a landmark</span><span aria-hidden="true">⌕</span><input type="search" aria-label="Find a landmark" placeholder="Find a place…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <div className={styles.placeList}>
            {places.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())).map((p) => <button type="button" key={p.id} aria-pressed={selected === p.id} onClick={() => focus(p.id)}><span className={styles.placeNumber}>{p.number}</span><span>{p.name}<small>{p.category}</small></span><span aria-hidden="true">↗</span></button>)}
            {!places.some((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())) && <p>No matching places. Try “park” or “Science World”.</p>}
          </div>
        </div>
        <article className={styles.detail} aria-live="polite" aria-atomic="true">
          <div className={styles.sectionLabel}>{place.category} <span>{place.number} / 06</span></div>
          <h2>{place.name}</h2>
          <p>{place.detail}</p>
          <p className={styles.detailNote}>{place.note}</p>
          <div className={styles.sourceRow}><a href={place.url} target="_blank" rel="noreferrer">{place.source} ↗</a><span>Checked 30 Oct 2026</span></div>
          <button type="button" className={styles.visitButton} onClick={() => { focus(place.id); viewport.current?.scrollIntoView({ behavior: "auto", block: "center" }); }} disabled={status !== "ready"}>Go to this place <span>↗</span></button>
        </article>
      </div>
    </section>
  );
}
