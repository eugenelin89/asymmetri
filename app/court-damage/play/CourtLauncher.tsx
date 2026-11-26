"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { COURT_GAME_MANIFEST } from "./game-release";
import { loadCourt, type CourtPlayer } from "./unity-player";
import styles from "./play.module.css";

type Phase = "marquee" | "loading" | "ready" | "paused" | "error" | "unsupported";
const portraitPhone = "(orientation: portrait) and (any-pointer: coarse), (orientation: portrait) and (max-width: 560px)";
const gameplayKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyJ", "KeyK", "KeyL", "Space"]);

function supportsPlayer() {
  if (typeof WebAssembly !== "object") return false;
  const context = document.createElement("canvas").getContext("webgl2");
  context?.getExtension("WEBGL_lose_context")?.loseContext();
  return Boolean(context);
}

export default function CourtLauncher() {
  const [phase, setPhase] = useState<Phase>("marquee");
  const [percentage, setPercentage] = useState(0);
  const [rotate, setRotate] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [screenNotice, setScreenNotice] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useRef<CourtPlayer | null>(null);
  const request = useRef<AbortController | null>(null);
  const interrupted = useRef(false);
  const mutedRef = useRef(false);
  const retry = useRef<HTMLButtonElement>(null);
  const resumeButton = useRef<HTMLButtonElement>(null);

  function pause() {
    if (!request.current || request.current.signal.aborted) return;
    interrupted.current = true;
    if (player.current) {
      player.current.SendMessage("Match", "WebPause");
      setPhase("paused");
    }
  }

  useEffect(() => {
    const orientation = window.matchMedia(portraitPhone);
    const orientationChanged = () => {
      setRotate(orientation.matches);
      if (orientation.matches) pause();
    };
    const visibilityChanged = () => { if (document.hidden) pause(); };
    const updateScreen = () => setFullscreen(document.fullscreenElement === frame.current);
    const focusedElsewhere = (event: FocusEvent) => {
      if (request.current && !stage.current?.contains(event.target as Node)) pause();
    };
    orientationChanged();
    setCanFullscreen(Boolean(document.fullscreenEnabled && frame.current?.requestFullscreen));
    orientation.addEventListener("change", orientationChanged);
    window.addEventListener("blur", pause);
    window.addEventListener("pagehide", pause);
    document.addEventListener("visibilitychange", visibilityChanged);
    document.addEventListener("fullscreenchange", updateScreen);
    document.addEventListener("focusin", focusedElsewhere);
    return () => {
      request.current?.abort();
      void player.current?.Quit();
      request.current = null;
      player.current = null;
      orientation.removeEventListener("change", orientationChanged);
      window.removeEventListener("blur", pause);
      window.removeEventListener("pagehide", pause);
      document.removeEventListener("visibilitychange", visibilityChanged);
      document.removeEventListener("fullscreenchange", updateScreen);
      document.removeEventListener("focusin", focusedElsewhere);
    };
  }, []);

  useEffect(() => {
    if (phase === "error") retry.current?.focus({ preventScroll: true });
    if (phase === "paused" && !rotate && document.hasFocus() &&
        (document.activeElement === document.body || stage.current?.contains(document.activeElement))) {
      resumeButton.current?.focus({ preventScroll: true });
    }
  }, [phase, rotate]);

  const start = useCallback(async () => {
    if (!canvas.current || request.current) return;
    if (!supportsPlayer()) { setPhase("unsupported"); return; }
    const abort = new AbortController();
    request.current = abort;
    interrupted.current = window.matchMedia(portraitPhone).matches || document.hidden;
    setPhase("loading");
    setPercentage(0);
    try {
      const instance = await loadCourt(COURT_GAME_MANIFEST, canvas.current, abort.signal,
        value => { if (!abort.signal.aborted) setPercentage(Math.min(100, Math.max(0, Math.round(value * 100)))); },
        () => { if (!abort.signal.aborted) { abort.abort(); setPhase("error"); } });
      if (abort.signal.aborted) { await instance.Quit(); return; }
      player.current = instance;
      instance.SendMessage("Match", "WebSound", mutedRef.current ? 0 : 1);
      if (interrupted.current || document.hidden) {
        instance.SendMessage("Match", "WebPause");
        setPhase("paused");
      } else {
        setPhase("ready");
        canvas.current?.focus({ preventScroll: true });
      }
    } catch {
      if (!abort.signal.aborted) { abort.abort(); setPhase("error"); }
    }
  }, []);

  useEffect(() => {
    if (location.hash !== "#retry-court") return;
    const timer = window.setTimeout(() => {
      history.replaceState(history.state, "", location.pathname + location.search);
      void start();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [start]);

  function resume() {
    if (!player.current || rotate || document.hidden) return;
    // Finish the button gesture before refocusing the canvas so it cannot act on the court.
    canvas.current?.focus({ preventScroll: true });
    player.current.SendMessage("Match", "WebResume");
    interrupted.current = false;
    setPhase("ready");
  }

  function toggleSound() {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (!request.current?.signal.aborted) player.current?.SendMessage("Match", "WebSound", mutedRef.current ? 0 : 1);
  }

  async function toggleFullscreen() {
    setScreenNotice("");
    try {
      if (document.fullscreenElement === frame.current) await document.exitFullscreen();
      else await frame.current?.requestFullscreen();
    } catch {
      setScreenNotice("Fullscreen is unavailable. You can play in this frame.");
    }
  }

  const isMatch = phase === "ready" || phase === "paused";
  const rotateOverlay = rotate && (phase === "loading" || isMatch);
  const isIdle = phase === "marquee";
  return <section ref={frame} className={styles.arcade} aria-label="Court Damage arcade" id="court" tabIndex={-1}>
    <div className={styles.stage} data-marquee={isIdle} ref={stage}>
      <canvas id="unity-canvas" ref={canvas} className={styles.canvas} tabIndex={phase === "ready" ? 0 : -1}
        aria-label="Court Damage game. Move with WASD or arrow keys. Game controls are listed below."
        onBlur={pause} onPointerCancel={pause}
        onKeyDown={event => { if (gameplayKeys.has(event.code) && !event.altKey && !event.ctrlKey && !event.metaKey) event.preventDefault(); }} />
      {isIdle && <div className={styles.marquee}>
        <div className={styles.art}><Image src="/images/court-damage/waterfront-poster.jpg"
          width={1200} height={800} alt="Illustration of Trevor, June, Val and Barb with their paddles on the False Creek waterfront." unoptimized preload /></div>
        <div className={styles.marqueeCopy}>
          <p className={styles.location}><i aria-hidden="true" />Mercer Yard <span>/</span> False Creek</p>
          <h1 aria-label="Court Damage"><span>Court</span><span>Damage</span></h1>
          <p className={styles.pitch}>Four regulars. First to five.<br />The ball stays live through the chaos.</p>
          <button className={styles.play} onClick={start}><span className={styles.triangle} aria-hidden="true" />Play now</button>
        </div>
      </div>}
      {!isIdle && <h1 className={styles.sr}>Court Damage</h1>}
      {rotateOverlay ? <div className={styles.overlay} role="status"><div className={styles.rotateIcon} aria-hidden="true">↻</div><h2>Turn your phone</h2><p>Rotate to landscape to see the whole court.</p></div>
        : phase === "loading" ? <div className={styles.overlay} role="status"><span className={styles.location}>Mercer Yard / False Creek</span><h2>{percentage >= 90 ? "Preparing court…" : "Loading court"}</h2><div className={styles.loadLine}><progress value={percentage} max="100" aria-label="Game loading progress" /><strong>{percentage}%</strong></div></div>
        : phase === "paused" ? <div className={styles.overlay}><h2>Time out</h2><p>Your court is right where you left it.</p><button ref={resumeButton} onClick={resume} className={styles.play}><span className={styles.triangle} aria-hidden="true" />Resume</button></div>
        : phase === "error" ? <div className={styles.overlay} role="alert"><h2>Court unavailable</h2><p>The game couldn’t load. Check your connection and retry.</p><button className={styles.play} ref={retry} onClick={() => {
          history.replaceState(history.state, "", "#retry-court");
          window.location.reload();
        }}>Retry</button></div>
        : phase === "unsupported" ? <div className={styles.overlay} role="alert"><h2>Browser unsupported</h2><p>This game needs WebGL 2 and WebAssembly. Enable hardware acceleration or try a current desktop browser.</p><a className={styles.simpleLink} href="/court-damage/support">Game support</a></div> : null}
    </div>
    <div className={styles.toolbar}><span className={styles.venue}><i aria-hidden="true" />Waterfront doubles</span>
      <div className={styles.tools}>
        {isMatch && <button type="button" onClick={() => {
          pause();
          requestAnimationFrame(() => resumeButton.current?.focus({ preventScroll: true }));
        }}>Pause</button>}
        <button type="button" aria-pressed={muted} aria-label="Mute game audio" onClick={toggleSound}><span aria-hidden="true">{muted ? "◌" : "◖"}</span> Sound {muted ? "off" : "on"}</button>
        {canFullscreen && <button type="button" onClick={toggleFullscreen}><span aria-hidden="true">⛶</span> {fullscreen ? "Exit fullscreen" : "Fullscreen"}</button>}
      </div></div>
    {screenNotice && <p className={styles.notice} role="status">{screenNotice}</p>}
  </section>;
}
