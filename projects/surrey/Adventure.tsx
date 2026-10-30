"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { surrey } from "@/content/site";
import { MiniMap } from "./MiniMap";
import { Journal } from "./Journal";
import { ViewControls, ViewHint, ViewHelp, AerialTips } from "./ViewControls";
import { needsViewHelp, rememberViewHelp, viewShortcut } from "./viewPolicy";
import { readSave, parseSave, SAVE_KEY } from "./save";
import type { SavedGame } from "./save";
import { landmarks } from "./landmarks";
import { clockLabel } from "./time";
import { missingLocations } from "./missing";
import { storyLocations } from "./story";
import { createWorld } from "./world";
import type { City, Game, Input, Snapshot } from "./types";
import styles from "./surrey.module.css";
const subscribeSave = (notify: () => void) => { window.addEventListener("storage", notify); return () => window.removeEventListener("storage", notify); };
const saveSnapshot = () => { try { return localStorage.getItem(SAVE_KEY); } catch { return "!unavailable"; } };
export function SurreyAdventure() {
  const savedRaw = useSyncExternalStore(subscribeSave, saveSnapshot, () => null);
  const validStoredSave = useMemo(() => parseSave(savedRaw), [savedRaw]);
  const host = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null),
    engine = useRef<Game | null>(null),
    dialogueButton = useRef<HTMLButtonElement>(null),
    startButton = useRef<HTMLButtonElement>(null),
    loaded = useRef<SavedGame | undefined>(undefined);
  const [status, setStatus] = useState("idle"),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0),
    [state, setState] = useState<Snapshot | null>(null),
    [city, setCity] = useState<City | null>(null);
  const [started, setStarted] = useState(false),
    [paused, setPaused] = useState(false),
    [wide, setWide] = useState(false),
    [lite, setLite] = useState(false),
    [calm, setCalm] = useState(false),
    [expanded, setExpanded] = useState(false),
    [inventory, setInventory] = useState(false),
    [mature, setMature] = useState(false),
    [saveUnavailable, setSaveUnavailable] = useState(false),
    [replaceSave, setReplaceSave] = useState(false),
    [saveMessage, setSaveMessage] = useState(""),
    [viewHelp, setViewHelp] = useState(false),
    [aerialTools, setAerialTools] = useState(false),
    [selectedPlace, setSelectedPlace] = useState("");
  const locations = useMemo(() => city ? storyLocations(city, createWorld(city)) : null, [city]);
  const missingPoints = useMemo(() => city ? missingLocations(city, createWorld(city)) : null, [city]);
  const saveAvailable = !!validStoredSave && !saveUnavailable;
  const saveText = saveMessage || (savedRaw === "!unavailable" ? "Browser storage is unavailable. Progress will not survive reloads." : savedRaw && !validStoredSave ? "The local save is damaged or incompatible. New Game starts safely; the old save stays until replaced." : saveAvailable ? "Progress saved on this browser only." : "Autosaves stay on this browser only.");
  const ready = status === "ready";
  useEffect(() => {
    if (!started || !host.current) return;
    const abort = new AbortController();
    let instance: Game | null = null;
    import("./engine")
      .then(({ createGame }) =>
        createGame(
          host.current!,
          {
            map: setCity,
            saved(success) { setSaveMessage(success ? "Saved on this browser · no account or upload" : "Saving unavailable · keep this page open to retain progress"); },
            update: setState,
            fail(message) {
              setError(message);
              setStatus("error");
            },
            pause() {
              setPaused((v) => !v);
            },
            mapToggle() {
              setWide((v) => !v);
            },
          },
          abort.signal,
          loaded.current,
        ),
      )
      .then((game) => {
        instance = game;
        if (abort.signal.aborted) {
          game.dispose();
          return;
        }
        engine.current = game;
        setStatus("ready");
        game.pause(false);
        game.focus();
      })
      .catch((e: unknown) => {
        if (abort.signal.aborted) return;
        setError(
          e instanceof Error && e.message.includes("Surrey")
            ? e.message
            : "This browser could not start WebGL2. Try a current browser with graphics acceleration enabled. The controls and geographic sources remain available below.",
        );
        setStatus("error");
      });
    return () => {
      abort.abort();
      instance?.dispose();
      engine.current = null;
    };
  }, [started, attempt]);
  useEffect(() => {
    engine.current?.pause(paused || inventory || wide || viewHelp);
    if (!paused && !inventory && !wide && !viewHelp && ready) engine.current?.focus();
  }, [paused, inventory, wide, viewHelp, ready]);
  useEffect(() => {
    engine.current?.quality(lite ? "low" : "auto");
  }, [lite, ready]);
  useEffect(() => {
    engine.current?.calm(calm);
  }, [calm, ready]);
  useEffect(() => { engine.current?.mature(mature); }, [mature, ready]);
  const dialogue = state?.dialogue,
    dialogueSpeaker = dialogue?.speaker,
    dialogueText = dialogue?.text;
  useEffect(() => {
    if (dialogueSpeaker) dialogueButton.current?.focus({ preventScroll: true });
  }, [dialogueSpeaker, dialogueText]); // Focus only when the actual dialogue changes.
  useEffect(() => {
    if (paused) startButton.current?.focus({ preventScroll: true });
  }, [paused]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = [
        ...(viewport.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),canvas[tabindex="0"],input,select',
        ) ?? []),
      ].filter((el) => el.getClientRects().length);
      const first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", trap);
    };
  }, [expanded]);
  function start(continuing = false) {
    if (continuing) {
      let save: SavedGame | null = null;
      try { save = readSave(localStorage).save; } catch { /* An unavailable save never prevents a new game. */ }
      if (!save) { setSaveUnavailable(true); setSaveMessage("The save could not be read. New Game is available."); return; }
      loaded.current = save; setCalm(save.state.calm); setMature(save.state.mature); setLite(save.quality === "low");
    } else {
      if (saveAvailable && !replaceSave) { setReplaceSave(true); return; }
      loaded.current = undefined;
    }
    setReplaceSave(false);
    try { setViewHelp(needsViewHelp(localStorage)); } catch { setViewHelp(true); }
    setStatus("loading");
    setStarted(true);
    setPaused(false);
    if (matchMedia("(pointer: coarse), (max-width: 700px)").matches) setExpanded(true);
  }
  function retry() {
    try { loaded.current = readSave(localStorage).save ?? undefined; } catch { loaded.current = undefined; }
    setStatus("loading");
    setError("");
    setPaused(false);
    setAttempt((v) => v + 1);
  }
  function action(fn: (g: Game) => void) {
    if (engine.current) {
      fn(engine.current);
      if (!paused && !inventory && !wide && !viewHelp) engine.current.focus();
    }
  }
  function hold(input: Input, pressed: boolean) {
    engine.current?.input(input, pressed);
  }
  function closeViewHelp() {
    setViewHelp(false);
    try { rememberViewHelp(localStorage); } catch { /* Storage can be unavailable. */ }
    engine.current?.focus();
  }
  return (
    <section className={styles.experience} aria-label={`${surrey.name} game`}>
      <div
        className={`${styles.viewport} ${expanded ? styles.expanded : ""}`}
        ref={viewport}
        data-mode={state?.mode ?? "ground"}
        data-driving={state?.vehicle.occupied ?? false}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          if (viewShortcut(e, !ready || paused || inventory || wide || viewHelp || !!dialogue, target.isContentEditable || !!target.closest("input, textarea, select"))) {
            e.preventDefault();
            action(g => g.mode(state?.mode === "aerial" ? "ground" : "aerial"));
          }
          if (e.key === "Escape" && !e.defaultPrevented) {
            e.preventDefault();
            if (inventory) setInventory(false); else if (wide) setWide(false); else if (viewHelp) closeViewHelp(); else setPaused((v) => !v);
          }
          if (e.key === "Tab" && (paused || dialogue || inventory || wide || viewHelp)) {
            const overlay = viewport.current?.querySelector<HTMLElement>(
              paused ? `.${styles.screen}` : inventory ? `.${styles.journal}` : dialogue ? `.${styles.dialogue}` : wide ? `.${styles.wideMap}` : `.${styles.viewHelp}`,
            );
            const buttons = [
              ...(overlay?.querySelectorAll<HTMLElement>("button:not(:disabled), input, select") ?? []),
            ].filter(el => el.getClientRects().length);
            if (!buttons.length) return;
            const first = buttons[0],
              last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded || undefined}
        aria-label={expanded ? `${surrey.name} expanded game` : undefined}
      >
        <div className={styles.canvas} ref={host} />
        {started && (
          <div className={styles.toolbar}>
            <ViewControls mode={state?.mode ?? "ground"} disabled={!ready || paused || !!dialogue || inventory || wide || viewHelp} select={mode => action(g => g.mode(mode))} />
            <button className={styles.mobileMenu} disabled={!ready} aria-label="Open game menu" onClick={() => setPaused(true)}>Menu</button>
            <div className={styles.utilityControls}>
              <button disabled={!ready || !!dialogue || paused} onClick={() => setInventory(v => !v)}>Journal</button>
              <button
                onClick={() => setWide((v) => !v)}
                disabled={!ready}
                aria-pressed={wide}
              >
                Map <kbd>M</kbd>
              </button>
              <button onClick={() => setPaused((v) => !v)} disabled={!ready}>
                {paused ? "Resume" : "Pause"}
              </button>
              <button disabled={!ready || !!dialogue || inventory || paused} aria-expanded={viewHelp} aria-label="Help with Street Adventure and Aerial Explore" onClick={() => setViewHelp(v => !v)}>Help</button>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Exit expanded view" : "Expand game"}
              >
                {expanded ? "↙" : "↗"}
              </button>
            </div>
            <ViewHint mode={state?.mode ?? "ground"} />
          </div>
        )}
        {!started && (
          <div className={styles.startScreen}>
            <div className={styles.coverCity} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.startCopy}>
              <p className={styles.eyebrow}>49.1895° N / 122.8490° W</p>
              <h2>
                Every street
                <br />
                has a story.
              </h2>
              <p>
                Four stories. A city on the move.
                <br />Walk. Drive. Explore from above.
              </p>
              <div className={styles.startActions}>
                {saveAvailable && <button className={styles.primary} onClick={() => start(true)}>Continue Game <span>→</span></button>}
                <button className={saveAvailable ? "" : styles.primary} onClick={() => start(false)}>{replaceSave ? "Replace save & start new" : saveAvailable ? "New Game" : "Play Now"} <span>↗</span></button>
                {replaceSave && <button onClick={() => setReplaceSave(false)}>Keep my save</button>}
              </div>
              <small>V0.5 · On the Move · No sign-in</small>
              <p className={styles.startModes}>Street Adventure · Aerial Explore<br />Choose either view using the buttons in the game.</p>
              <p className={styles.contentNotice}>Fictional adult cast. Non-graphic homicide, theft and scams. Optional mature dialogue mentions sex work and drugs. Gentle Streets and Mature Encounters controls are below.</p>
            </div>
            <div className={styles.startTag}>
              WELCOME TO
              <br />
              <strong>SURREY</strong>
              <span>A FICTIONAL CITY ADVENTURE</span>
            </div>
          </div>
        )}
        {started && !ready && (
          <div className={styles.screen} role="status">
            <p className={styles.eyebrow}>{surrey.name}</p>
            <h2>
              {status === "loading"
                ? "Next stop: Surrey Central."
                : "The city is still here."}
            </h2>
            <p>
              {status === "loading"
                ? "Preparing your neighbourhood and its first story…"
                : error}
            </p>
            {status === "error" && (
              <button className={styles.primary} onClick={retry}>
                Retry game
              </button>
            )}
          </div>
        )}
        {ready && state && (
          <>
            {!paused && !inventory && !dialogue && <button className={styles.compactObjective} onClick={() => setPaused(true)} aria-label={`Mission and player status: ${state.objective}`}><span>◆ {Math.round(Math.hypot(state.marker[0] - state.player.x, state.marker[1] - state.player.z))} m</span><span>{state.objective}</span><span>›</span></button>}
            {state.vehicle.occupied && !paused && !inventory && !dialogue && !wide && !viewHelp && <div className={styles.driveStatus} aria-label="Driving status"><strong>{Math.round(Math.abs(state.vehicle.car.speed)*3.6)} <small>km/h</small></strong><span>{state.mode === "aerial" ? "Paused in Aerial Explore" : state.vehicle.car.blocked ? "Road edge or actor · brake, reverse or recover" : state.delivery.stage === "accepted" ? `${Math.round(state.drivingDistance)} m · cyan route` : "Central Ave · City Parkway"}</span></div>}
            {viewHelp && !paused && !inventory && !dialogue && <ViewHelp close={closeViewHelp} />}
            {state.mode === "aerial" && !paused && !inventory && !viewHelp && <AerialTips />}
            <div className={styles.mission}>
              <span className={styles.eyebrow}>
                {state.delivery.stage === "accepted" || state.delivery.stage === "arrived" ? "04 / A RIDE ACROSS SURREY" : state.missing.stage === "investigating" || state.missing.stage === "return" ? "03 / THE MISSING PERSON" : state.investigation.stage === "closed" && state.stage === "completed" ? "FIRST TWO CASES CLOSED" : state.stage === "completed"
                  ? state.investigation.stage === "available" ? "01 / CASE CLOSED" : "02 / THE SURREY CENTRAL MYSTERY"
                  : state.stage === "available" && ["active", "inconclusive"].includes(state.investigation.stage) ? "02 / THE SURREY CENTRAL MYSTERY" : state.stage === "failed"
                    ? "01 / TRY AGAIN"
                    : "01 / WELCOME TO SURREY"}
              </span>
              <strong>{state.objective}</strong>
              <span>
                ◆{" "}
                {Math.round(
                  Math.hypot(
                    state.marker[0] - state.player.x,
                    state.marker[1] - state.player.z,
                  ),
                )}{" "}
                m <span className={styles.muted}>· gold marker</span>
              </span>
            </div>
            <div className={styles.vitals} aria-label="Player status">
              <div>
                <span>HEALTH</span>
                <meter
                  min="0"
                  max="100"
                  value={state.health}
                  aria-label="Health"
                />
                <b>{Math.round(state.health)}</b>
              </div>
              <div>
                <span>STAMINA</span>
                <meter
                  min="0"
                  max="100"
                  value={state.stamina}
                  aria-label="Stamina"
                />
                <b>{Math.round(state.stamina)}</b>
              </div>
              <button
                disabled={!!dialogue}
                onClick={() => setInventory((v) => !v)}
                aria-expanded={inventory}
              >
                $ {state.money}{" "}
                <span>Evidence & inventory {state.inventory.length} ↗</span>
              </button>
            </div>
            {inventory && locations && missingPoints && <Journal state={state} locations={locations} missingPoints={missingPoints} close={() => setInventory(false)} track={(point, name) => { action(g => g.track(point, name)); setInventory(false); }} />}
            {state.mode === "aerial" && !inventory && !paused && <div className={styles.aerialDock} data-open={aerialTools}>
              <button className={styles.closeAerialTools} onClick={() => { setAerialTools(false); engine.current?.focus(); }}>Close aerial tools ×</button>
              <div className={styles.compass}><span style={{ transform: `rotate(${-(state.cameraYaw ?? 0) * 180 / Math.PI}deg)` }}>N ↑</span><strong>AERIAL EXPLORE</strong></div>
              <p>Street activity paused. Your character stays at the YOU marker.</p>
              <div><button aria-pressed={state.follow} onClick={() => action(g => g.follow(true))}>Follow Player</button><button aria-pressed={!state.follow} onClick={() => action(g => g.follow(false))}>Free Explore</button></div>
              <button className={styles.returnPlayer} onClick={() => action(g => g.returnToPlayer())}>Return to Player <kbd className={styles.keyboardCopy}>F</kbd></button>
              <label>Landmark<select value={selectedPlace} onChange={e => { setSelectedPlace(e.target.value); action(g => g.selectPlace(e.target.value)); setAerialTools(false); }}><option value="">Choose a viewpoint</option>{city && landmarks(city).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <div><button aria-label="Aerial rotate left" onClick={() => action(g => g.rotate(.3))}>↶</button><button aria-label="Aerial rotate right" onClick={() => action(g => g.rotate(-.3))}>↷</button><button aria-label="Aerial zoom in" onClick={() => action(g => g.zoom(-2))}>＋</button><button aria-label="Aerial zoom out" onClick={() => action(g => g.zoom(2))}>−</button></div>
              <small><span className={styles.keyboardCopy}>Drag to orbit · right drag to pan · scroll to zoom · WASD to move</span><span className={styles.touchCopy}>Drag to orbit · two fingers to pan and pinch · use the arrows to move</span></small>
            </div>}
            {state.mode === "aerial" && !inventory && !paused && <div className={styles.mobileAerialActions}><button onClick={() => action(g => g.returnToPlayer())}>Return to Player</button><button aria-expanded={aerialTools} onClick={() => { setAerialTools(v => !v); setWide(false); }}><span className={styles.mobileCompass} style={{ transform: `rotate(${-(state.cameraYaw ?? 0) * 180 / Math.PI}deg)` }}>N ↑</span>Aerial tools</button></div>}
            {state.waypoint && !inventory && <div className={styles.waypoint}><span>◇ {state.waypoint.name}</span><button onClick={() => action(g => g.clearWaypoint())} aria-label="Clear waypoint">×</button></div>}
            {city && <MiniMap city={city} state={state} wide={wide} close={() => { setWide(false); engine.current?.focus(); }} />}
            <div className={styles.location}>
              <span className={styles.dot} /> {state.street} · {clockLabel(state.time)}
            </div>
            {!paused && !dialogue && !inventory && !wide && !viewHelp && (
              <div className={styles.prompt}>
                {state.mode === "aerial" ? <span>Select Street Adventure to return</span> : state.nearby ? (
                  <button onClick={() => action((g) => g.interact())}>
                    <kbd>E</kbd> {state.nearby}
                  </button>
                ) : (
                  <span>
                    <span className={styles.keyboardCopy}>{state.vehicle.occupied ? "W accelerate · S brake/reverse · A/D steer · Space handbrake" : state.player.blocked ? "Path blocked · move around or press R" : "WASD to walk · Shift to sprint"}</span>
                    <span className={styles.touchCopy}>{state.vehicle.occupied ? "Hold pedals and steering · stop to exit" : state.player.blocked ? "Path blocked · move around or use Recover" : "Hold arrows to walk · hold Sprint to run"}</span>
                  </span>
                )}
              </div>
            )}
            {state.message && !dialogue && !paused && !inventory && state.mode === "ground" && (
              <div
                className={`${styles.notice} ${(state.danger.active || state.encounter) ? styles.danger : ""}`}
                role="status"
              >
                {state.message}
              </div>
            )}
            {!paused && !dialogue && !inventory && !wide && !viewHelp && (
              <div
                className={styles.touchControls}
                aria-label="Touch movement controls"
              >
                <div className={styles.dpad}>
                  {(
                    [
                      { input: "forward", text: "↑", label: "Walk forward" },
                      { input: "left", text: "←", label: "Walk left" },
                      { input: "back", text: "↓", label: "Walk backward" },
                      { input: "right", text: "→", label: "Walk right" },
                    ] as const
                  ).map(({ input, text, label }) => (
                    <button
                      key={input}
                      data-direction={input}
                      aria-label={state.mode === "aerial" ? label.replace("Walk", "Pan") : state.vehicle.occupied ? ({forward:"Accelerate",back:"Brake and reverse",left:"Steer left",right:"Steer right"})[input] : label}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        hold(input, true);
                      }}
                      onPointerUp={() => hold(input, false)}
                      onPointerCancel={() => hold(input, false)}
                      onLostPointerCapture={() => hold(input, false)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          hold(input, true);
                        }
                      }}
                      onKeyUp={() => hold(input, false)}
                      onBlur={() => hold(input, false)}
                    >
                      {state.vehicle.occupied && state.mode === "ground" ? ({forward:"Go",back:"Brake",left:"←",right:"→"})[input] : text}
                    </button>
                  ))}
                </div>
                <div className={styles.touchActions}>
                  <button
                    disabled={state.mode === "aerial"}
                    aria-label={state.vehicle.occupied ? "Hold handbrake" : "Hold to sprint"}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.setPointerCapture(e.pointerId);
                      hold("sprint", true);
                    }}
                    onPointerUp={() => hold("sprint", false)}
                    onPointerCancel={() => hold("sprint", false)}
                    onLostPointerCapture={() => hold("sprint", false)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter")
                        hold("sprint", true);
                    }}
                    onKeyUp={() => hold("sprint", false)}
                    onBlur={() => hold("sprint", false)}
                  >
                    {state.vehicle.occupied ? "Handbrake" : "Sprint"}
                  </button>
                  <button
                    onClick={() => action((g) => g.interact())}
                    disabled={!state.nearby || state.mode === "aerial"}
                  >
                    {state.vehicle.occupied ? "Exit car" : state.nearby === "Enter vehicle" ? "Enter car" : "Interact"}
                  </button>
                  {state.vehicle.occupied && <button disabled={state.mode === "aerial"} onClick={() => action(g=>g.recover())}>Recover</button>}
                </div>
              </div>
            )}
            {dialogue && !paused && (
              <div
                className={styles.dialogue}
                role="dialog"
                aria-modal="true"
                aria-label={dialogue.speaker}
              >
                <span className={styles.eyebrow}>A SURREY STORY</span>
                <h3>{dialogue.speaker}</h3>
                <p>{dialogue.text}</p>
                <div className={styles.choices}>
                  {dialogue.choices ? dialogue.choices.map((choice, i) => <button key={choice.id} ref={i === 0 ? dialogueButton : undefined} onClick={() => action(g => g.choose(choice.id))}>{choice.label} →</button>) : <button ref={dialogueButton} className={styles.primary} onClick={() => action(g => g.dismiss())}>{dialogue.action ?? "Continue"} <span>→</span></button>}
                </div>
              </div>
            )}
            {paused && (
              <div className={`${styles.screen} ${styles.pauseScreen}`} role="dialog" aria-modal="true" aria-label="Game menu">
                <p className={styles.eyebrow}>TAKE A BREATHER</p>
                <h2>The story can wait.</h2>
                <p>{clockLabel(state.time)} · Jo’s trust {state.trust}/3</p>
                <p className={styles.menuObjective}><strong>{state.objective}</strong><br />Health {Math.round(state.health)} · Stamina {Math.round(state.stamina)} · ${state.money} · {state.inventory.length} inventory items</p>
                <p>Street Adventure brings you back to your character. Aerial Explore lets you see the whole neighbourhood. Choose a view at the top when you resume.</p>
                <p>{saveText}. Saves belong to this browser and this site address.</p>
                <button
                  ref={startButton}
                  className={styles.primary}
                  onClick={() => setPaused(false)}
                >
                  Back to the city →
                </button>
                <div className={styles.menuActions}>
                  <button onClick={() => { setPaused(false); setInventory(true); setWide(false); setAerialTools(false); }}>Journal & inventory</button>
                  <button onClick={() => { setPaused(false); setWide(true); setAerialTools(false); setViewHelp(false); }}>Open map</button>
                  <button onClick={() => { setPaused(false); setViewHelp(true); setWide(false); setAerialTools(false); }}>View help</button>
                  {!expanded && <button onClick={() => setExpanded(true)}>Expand game</button>}
                  <button
                    disabled={state.mode === "aerial"}
                    onClick={() => {
                      action((g) => g.recover());
                      setPaused(false);
                    }}
                  >
                    {state.vehicle.occupied ? "Recover car on clear road" : "Recover at station"}
                  </button>
                  <button
                    onClick={() => {
                      if (replaceSave) { action((g) => { g.reset(); g.save(); }); setPaused(false); setReplaceSave(false); } else setReplaceSave(true);
                    }}
                  >
                    {replaceSave ? "Confirm new game · replace save" : "New Game"}
                  </button>
                  {expanded && (
                    <button onClick={() => setExpanded(false)}>
                      Exit expanded view
                    </button>
                  )}
                </div>
                <div className={styles.citySettings}>
                  <label>City clock <select value={state.time.rate} onChange={e => action(g => g.timeRate(Number(e.target.value) as 1 | 4 | 12))}><option value="1">1 minute per second</option><option value="4">4 minutes per second</option><option value="12">12 minutes per second</option></select></label>
                  <div><button onClick={() => action(g => g.rest(480))}>Rest until morning</button><button onClick={() => action(g => g.rest(1260))}>Rest until night</button></div>
                  <label><input type="checkbox" checked={state.stableVisibility} onChange={e => action(g => g.visibility(e.target.checked))} /> Stable daylight visibility</label>
                  <label>City sounds <input aria-label="City sounds volume" type="range" min="0" max="1" step="0.1" value={state.volume} onChange={e => action(g => g.audio(Number(e.target.value)))} /><span>{state.volume === 0 ? "Muted" : `${Math.round(state.volume * 100)}%`}</span></label>
                  <button onClick={() => action(g => g.audio(state.volume ? 0 : .4))}>{state.volume ? "Mute sounds" : "Enable sounds"}</button>
                </div>
                <div className={styles.menuSettings}>
                  <label><input type="checkbox" checked={calm} onChange={e => setCalm(e.target.checked)} /> Gentle streets</label>
                  <label><input type="checkbox" checked={mature} onChange={e => setMature(e.target.checked)} /> Mature encounters</label>
                  <label><input type="checkbox" checked={lite} onChange={e => setLite(e.target.checked)} /> Lite graphics</label>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.settings}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={calm}
              onChange={(e) => setCalm(e.target.checked)}
            />{" "}
            Gentle streets <span>no random threats</span>
          </label>
          <label><input type="checkbox" checked={mature} onChange={e => setMature(e.target.checked)} /> Mature encounters <span>optional adult dialogue</span></label>
          <label>
            <input
              type="checkbox"
              checked={lite}
              onChange={(e) => setLite(e.target.checked)}
            />{" "}
            Lite graphics
          </label>
        </div>
        <div>
          <button
            disabled={!ready}
            aria-label="Rotate camera left"
            onClick={() => action((g) => g.rotate(0.35))}
          >
            Camera ←
          </button>
          <button
            disabled={!ready}
            aria-label="Rotate camera right"
            onClick={() => action((g) => g.rotate(-0.35))}
          >
            →
          </button>
          <button
            disabled={!ready}
            aria-label="Zoom camera in"
            onClick={() => action((g) => g.zoom(-2))}
          >
            +
          </button>
          <button
            disabled={!ready}
            aria-label="Zoom camera out"
            onClick={() => action((g) => g.zoom(2))}
          >
            −
          </button>
          <button disabled={!ready || state?.mode === "aerial"} onClick={() => action((g) => g.recover())}>
            Recover <kbd>R</kbd>
          </button>
        </div>
      </div>
      <p className={styles.saveStatus} role="status">{saveText}</p>
      <details className={styles.instructions}>
        <summary>
          How to play <span>Keyboard, mouse & touch</span>
        </summary>
        <p>
          Walk with WASD or arrow keys. Hold Shift to sprint. Approach the teal community car and press E to enter. When driving, W accelerates, S brakes and reverses, A/D steer and Space handbrakes. Stop before E exits; R recovers the car. Drive on the marked Central Avenue / City Parkway area. Cyan markers and Journal lead to Jules and the complete projector delivery. All three earlier cases remain available on foot. Drag the city to
          rotate the camera, scroll to change distance. E interacts. M switches
          between local and full maps. Escape pauses; R returns you safely to
          the station. Camera buttons offer a keyboard alternative. On touch
          screens, hold the direction pad and Sprint, drag the city to look
          around, and tap Interact. Select Street Adventure or Aerial Explore at the top
          to change perspective. V is the keyboard shortcut; Return to Player or F finds
          your character in Aerial Explore. Aerial WASD / the touch pad pans; drag orbits,
          right drag or two fingers pan, wheel or pinch zooms. Selecting a landmark
          places a waypoint; it never moves the character. Street activity pauses in Aerial Explore.
        </p>
        <p>
          Green markers begin The Missing Person: talk to Tess near the station, compare witnesses or follow the paper trail, and respect Riley’s decision. The clock, cases and pedestrians pause in menus, dialogue and Aerial Explore. Menu provides clock speed, rest, stable daylight and optional sound controls.
          Find Alex at the gold marker, accept the case, inspect the transit
          slip, recover the backpack and return it. You can chase the runner or
          speak to Sam and Jo at the blue marker for help. Purple marks a complete
          fictional homicide investigation. Read the Journal, talk to witnesses, inspect
          nearby clues with E and compare their accounts. Dialogue and Journal pause
          the action. Gentle Streets suppresses threats; Mature Encounters enables
          optional non-explicit adult dialogue. Progress and settings autosave locally
          every five seconds and after decisions. Nothing in the save is uploaded;
          clearing browser site data removes it. Use New Game to replace it.
        </p>
      </details>
    </section>
  );
}
