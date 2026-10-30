"use client";

import { useEffect, useRef, useState } from "react";
import { places } from "./places";
import { MiniMap } from "./MiniMap";
import type { City, DriveRoute, DriveTelemetry, Explorer, Input, Mode } from "./types";
import styles from "./vancouver.module.css";

const initialDrive: DriveTelemetry = { speed: 0, reverse: false, street: "Olympic Village", x: 298, z: 89, yaw: 0, blocked: false };
export function VancouverExplorer() {
  const mount = useRef<HTMLDivElement>(null), viewport = useRef<HTMLDivElement>(null), fullscreenButton = useRef<HTMLButtonElement>(null);
  const engine = useRef<Explorer | null>(null), selectedRef = useRef("science-world");
  const [status, setStatus] = useState("loading"), [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0), [mode, setMode] = useState<Mode>("aerial");
  const [selected, setSelected] = useState("science-world"), [query, setQuery] = useState("");
  const [drive, setDrive] = useState(initialDrive), [city, setCity] = useState<City | null>(null);
  const [enabled, setEnabled] = useState(true), [lite, setLite] = useState(false), [expanded, setExpanded] = useState(false);
  const [route, setRoute] = useState<DriveRoute | null>(null), [reverseLoop, setReverseLoop] = useState(false), [notice, setNotice] = useState("");
  const place = places.find((p) => p.id === selected) ?? places[0];
  const ready = status === "ready" && enabled;

  useEffect(() => {
    const controller = new AbortController(); let instance: Explorer | null = null;
    const host = mount.current; if (!host || !enabled) return;
    import("./engine").then(({ createExplorer }) => createExplorer(host, {
      select(id) { selectedRef.current = id; setSelected(id); },
      telemetry: setDrive, map: setCity, route: setRoute,
      fail(message) { if (!controller.signal.aborted) { setError(message); setStatus("error"); } },
      recover() { if (!controller.signal.aborted) { setStatus("loading"); setMode("aerial"); setAttempt((n) => n + 1); } },
    }, controller.signal)).then((created) => {
      instance = created; if (controller.signal.aborted) { created.dispose(); return; }
      engine.current = created; setStatus("ready");
      if (selectedRef.current !== "science-world") created.focus(selectedRef.current);
    }).catch((reason: unknown) => {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error && reason.message.includes("data") ? reason.message : "This browser could not start WebGL2. Every place and source is still available below."); setStatus("error");
    });
    return () => { controller.abort(); instance?.dispose(); engine.current = null; };
  }, [attempt, enabled]);
  useEffect(() => { engine.current?.setQuality(lite ? "low" : "auto"); }, [lite, status]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setExpanded(false); fullscreenButton.current?.focus(); }
      if (event.key !== "Tab") return;
      const elements = [...(viewport.current?.querySelectorAll<HTMLElement>('button:not(:disabled), canvas[tabindex="0"], a[href]') ?? [])].filter((e) => e.getClientRects().length);
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", key); };
  }, [expanded]);
  const focusCanvas = () => mount.current?.querySelector("canvas")?.focus({ preventScroll: true });
  function changeMode(next: Mode) { setMode(next); engine.current?.setMode(next); focusCanvas(); }
  function focus(id: string) { selectedRef.current = id; setSelected(id); setMode("aerial"); engine.current?.focus(id); }
  function driveNear() { engine.current?.driveNear(selected); setMode("drive"); viewport.current?.scrollIntoView({ block: "center", behavior: "auto" }); focusCanvas(); }
  function startScenic(reverse = false) {
    try { engine.current?.scenic(reverse); setReverseLoop(reverse); setMode("drive"); setNotice(""); viewport.current?.scrollIntoView({ block: "center", behavior: "auto" }); focusCanvas(); }
    catch { setNotice("The scenic route could not be started. Try a nearby start."); }
  }
  function navigateHere() {
    try { engine.current?.navigate(selected); setMode("drive"); setNotice(""); viewport.current?.scrollIntoView({ block: "center", behavior: "auto" }); focusCanvas(); }
    catch (reason) { setNotice(reason instanceof Error ? reason.message : "Try a nearby start."); }
  }
  function restart() { setEnabled(true); setStatus("loading"); setError(""); setMode("aerial"); setAttempt((n) => n + 1); }
  function fullscreen() {
    // A viewport-filling mode also works in embedded browsers and mobile Safari,
    // where the native fullscreen API can reject or immediately exit.
    setExpanded((value) => !value);
    if (expanded) fullscreenButton.current?.focus(); else focusCanvas();
  }
  function touch(action: Input, pressed: boolean) { engine.current?.setInput(action, pressed); }

  return <section className={styles.experience} aria-label="Explore eastern False Creek">
    <div className={`${styles.viewport} ${expanded ? styles.expanded : ""}`} data-mode={mode} ref={viewport} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Vancouver city view" : undefined}>
      <div className={styles.canvas} ref={mount} />
      <div className={styles.toolbar}>
        <div className={styles.modes} aria-label="Navigation mode">
          <button type="button" aria-pressed={mode === "aerial"} onClick={() => changeMode("aerial")} disabled={!ready}>Explore</button>
          <button type="button" aria-pressed={mode === "drive"} onClick={() => changeMode("drive")} disabled={!ready}>Drive</button>
        </div>
        <div className={styles.viewActions}>
          <button type="button" onClick={() => { engine.current?.reset(); focusCanvas(); }} disabled={!ready} aria-label={mode === "drive" ? "Reset car" : "Reset overview"}>Reset</button>
          <button type="button" aria-pressed={lite} aria-label="Lighter graphics for slower devices" title="Lighter graphics for slower devices" onClick={() => setLite((value) => !value)}>Lite</button>
          <button type="button" ref={fullscreenButton} aria-label={expanded ? "Exit expanded city view" : "Expand city view"} onClick={() => void fullscreen()}>{expanded ? "×" : "⛶"}</button>
        </div>
      </div>
      {(!ready) && <div className={styles.loading} role="status">
        <span className={styles.loadingMark}>V.</span>
        <h2>{!enabled ? "The city can wait." : status === "loading" ? "Meet me by the water." : "Explore at your own pace."}</h2>
        <p>{!enabled ? "3D is paused. Every place and source is still available below." : status === "loading" ? "Preparing False Creek, one small detail at a time…" : error}</p>
        {(status === "error" || !enabled) && <button type="button" onClick={restart}>Retry 3D</button>}
        <a href="#vancouver-places" onClick={() => { if (expanded) void fullscreen(); }}>Browse the places ↓</a>
      </div>}
      {mode === "aerial" ? <>
        <div className={styles.locationBadge}><span className={styles.liveDot} /> EASTERN FALSE CREEK <span>VANCOUVER, BC</span></div>
        <div className={styles.exploreDock}>
          <span>Find your corner of the city.</span>
          <div>{places.filter((p) => ["science-world", "olympic-village", "hinge-park"].includes(p.id)).map((p) => <button type="button" key={p.id} disabled={!ready} aria-pressed={p.id === selected} onClick={() => focus(p.id)}>{p.number} <span>{p.name}</span> ↗</button>)}</div>
          <button className={styles.scenicStart} type="button" disabled={!ready} onClick={() => startScenic()}>Drive the False Creek loop → <small>2.4 km · about 4 minutes with Cruise</small></button>
          <small>Drag to orbit · scroll / pinch to zoom · two fingers to pan</small>
        </div>
      </> : <>
        <div className={styles.drivingHud} aria-label="Driving status"><span className={styles.streetName}>{drive.street}</span><div><strong>{drive.speed}</strong> <small>km/h</small><span className={styles.gear}>{drive.reverse ? "R" : "D"}</span></div><span className={styles.drivingHint}>{drive.blocked ? drive.blockedReason : drive.navigation?.cruising ? "Cruising · any driving input takes over" : "WASD / arrows · space brakes"}</span>{drive.blocked && <button type="button" onClick={() => { engine.current?.recover(); focusCanvas(); }}>Recover car ↗</button>}</div>
        {city && <MiniMap city={city} drive={drive} route={route} />}
        <div className={styles.routePanel} aria-label="Driving directions">
          {route ? <><strong>{route.title}</strong><span>{drive.navigation?.instruction}</span><small>{drive.navigation?.laps ? `${drive.navigation.laps} loop${drive.navigation.laps === 1 ? "" : "s"} complete · ` : ""}{((drive.navigation?.remaining ?? route.length) / 1000).toFixed(1)} km remaining{!route.loop ? " · roadside stop" : ""}</small><div>{route.loop && <><button type="button" onClick={() => { engine.current?.setCruise(!drive.navigation?.cruising); focusCanvas(); }}>{drive.navigation?.cruising ? "Take the wheel" : "Cruise"}</button><button type="button" onClick={() => startScenic(!reverseLoop)}>Reverse loop</button></>}<button type="button" onClick={() => engine.current?.clearRoute()}>Clear route</button></div></> : <><strong>Find your way around.</strong><span>A connected drive past the Village, Hinge Park and Science World.</span><button type="button" disabled={!ready} onClick={() => startScenic()}>Start scenic loop →</button></>}
        </div>
        {ready && <div className={styles.driveControls} aria-label="Driving controls">
          {([{ action: "left", label: "Steer left", text: "←" }, { action: "right", label: "Steer right", text: "→" }, { action: "back", label: "Brake and reverse", text: "↓" }, { action: "forward", label: "Accelerate", text: "↑" }, { action: "brake", label: "Brake", text: "■" }] as const).map(({ action, label, text }) => <button type="button" key={action} aria-label={label}
            onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); touch(action, true); }}
            onPointerUp={() => touch(action, false)} onPointerCancel={() => touch(action, false)} onLostPointerCapture={() => touch(action, false)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); touch(action, true); } }} onKeyUp={() => touch(action, false)} onBlur={() => touch(action, false)}>{text}</button>)}
        </div>}
      </>}
      <div className={styles.sceneNote}>{mode === "drive" ? "Flat streets only · bridges are view-only" : "2015 footprints · historic / illustrative heights"}</div>
    </div>
    <div className={styles.discovery} id="vancouver-places">
      <div className={styles.directory}>
        <div className={styles.sectionLabel}>SIX PLACES TO START <button type="button" className={styles.textToggle} onClick={() => { setEnabled((value) => !value); setStatus("loading"); setMode("aerial"); }}>{enabled ? "Pause 3D" : "Resume 3D"}</button></div>
        <label className={styles.search}><span className={styles.srOnly}>Find a landmark</span><span aria-hidden="true">⌕</span><input type="search" aria-label="Find a landmark" placeholder="Find a place…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <div className={styles.placeList}>
          {places.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())).map((p) => <button type="button" key={p.id} aria-pressed={selected === p.id} onClick={() => focus(p.id)}><span className={styles.placeNumber}>{p.number}</span><span>{p.name}<small>{p.category}</small></span><span aria-hidden="true">↗</span></button>)}
          {!places.some((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())) && <p>No matching places. Try “park” or “Science World”.</p>}
        </div>
      </div>
      <article className={styles.detail} aria-live="polite" aria-atomic="true">
        <div className={styles.sectionLabel}>{place.category} <span>{place.number} / 06</span></div>
        <h2>{place.name}</h2><p>{place.detail}</p><p className={styles.detailNote}>{place.note}</p>
        <div className={styles.sourceRow}><a href={place.url} target="_blank" rel="noreferrer">{place.source} ↗</a><span>Checked 30 Oct 2026</span></div>
        <div className={styles.placeActions}><button type="button" className={styles.visitButton} onClick={() => { focus(place.id); viewport.current?.scrollIntoView({ behavior: "auto", block: "center" }); }} disabled={!ready}>Explore here ↗</button><button type="button" className={styles.driveButton} onClick={driveNear} disabled={!ready}>Start nearby →</button><button type="button" className={styles.driveButton} onClick={navigateHere} disabled={!ready}>Route from car →</button></div><p className={styles.routeNotice} role="status">{notice}</p>
      </article>
    </div>
  </section>;
}
