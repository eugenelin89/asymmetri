"use client";
import { useEffect, useRef, useState } from "react";
import { MiniMap } from "./MiniMap";
import type { City, Game, Input, Snapshot } from "./types";
import styles from "./surrey.module.css";
export function SurreyAdventure() {
  const host = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null),
    engine = useRef<Game | null>(null),
    dialogueButton = useRef<HTMLButtonElement>(null),
    startButton = useRef<HTMLButtonElement>(null);
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
    [inventory, setInventory] = useState(false);
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
    engine.current?.pause(paused);
    if (!paused && ready) engine.current?.focus();
  }, [paused, ready]);
  useEffect(() => {
    engine.current?.quality(lite ? "low" : "auto");
  }, [lite, ready]);
  useEffect(() => {
    engine.current?.calm(calm);
  }, [calm, ready]);
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
          'button:not(:disabled),canvas[tabindex="0"],input',
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
  function start() {
    setStatus("loading");
    setStarted(true);
    setPaused(false);
  }
  function retry() {
    setStatus("loading");
    setError("");
    setPaused(false);
    setAttempt((v) => v + 1);
  }
  function action(fn: (g: Game) => void) {
    if (engine.current) {
      fn(engine.current);
      engine.current.focus();
    }
  }
  function hold(input: Input, pressed: boolean) {
    engine.current?.input(input, pressed);
  }
  return (
    <section className={styles.experience} aria-label="Surrey Adventure game">
      <div
        className={`${styles.viewport} ${expanded ? styles.expanded : ""}`}
        ref={viewport}
        onKeyDown={(e) => {
          if (e.key === "Escape" && !e.defaultPrevented) {
            e.preventDefault();
            setPaused((v) => !v);
          }
          if (e.key === "Tab" && (paused || dialogue)) {
            const overlay = viewport.current?.querySelector<HTMLElement>(
              paused ? `.${styles.screen}` : `.${styles.dialogue}`,
            );
            const buttons = [
              ...(overlay?.querySelectorAll<HTMLButtonElement>("button") ?? []),
            ];
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
        aria-label={expanded ? "Surrey Adventure expanded game" : undefined}
      >
        <div className={styles.canvas} ref={host} />
        {started && (
          <div className={styles.toolbar}>
            <span className={styles.worldLabel}>
              SURREY <span>ADVENTURE</span>
            </span>
            <div>
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
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Exit expanded view" : "Expand game"}
              >
                {expanded ? "↙" : "↗"}
              </button>
            </div>
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
                One missing backpack.
                <br />A city full of unexpected turns.
              </p>
              <button className={styles.primary} onClick={start}>
                Play Now <span>↗</span>
              </button>
              <small>V0.1 · Free to explore · No sign-in</small>
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
            <p className={styles.eyebrow}>SURREY ADVENTURE</p>
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
            <div className={styles.mission}>
              <span className={styles.eyebrow}>
                {state.stage === "completed"
                  ? "01 / CASE CLOSED"
                  : state.stage === "failed"
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
                onClick={() => setInventory((v) => !v)}
                aria-expanded={inventory}
              >
                $ {state.money}{" "}
                <span>Inventory {state.inventory.length} ↗</span>
              </button>
            </div>
            {inventory && (
              <div className={styles.inventory}>
                <strong>In your pockets</strong>
                {state.inventory.length ? (
                  <ul>
                    {state.inventory.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Room for a story.</p>
                )}
                <button onClick={() => setInventory(false)}>Close</button>
              </div>
            )}
            {city && <MiniMap city={city} state={state} wide={wide} />}
            <div className={styles.location}>
              <span className={styles.dot} /> {state.street}
            </div>
            {!paused && !dialogue && (
              <div className={styles.prompt}>
                {state.nearby ? (
                  <button onClick={() => action((g) => g.interact())}>
                    <kbd>E</kbd> {state.nearby}
                  </button>
                ) : (
                  <span>
                    {state.player.blocked
                      ? "Path blocked · move around or press R"
                      : "WASD to walk · Shift to sprint"}
                  </span>
                )}
              </div>
            )}
            {state.message && !dialogue && !paused && (
              <div
                className={`${styles.notice} ${state.danger.active ? styles.danger : ""}`}
                role="status"
              >
                {state.message}
              </div>
            )}
            {!paused && !dialogue && (
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
                      aria-label={label}
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
                      {text}
                    </button>
                  ))}
                </div>
                <div className={styles.touchActions}>
                  <button
                    aria-label="Hold to sprint"
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
                    Sprint
                  </button>
                  <button
                    onClick={() => action((g) => g.interact())}
                    disabled={!state.nearby}
                  >
                    E
                  </button>
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
                <button
                  ref={dialogueButton}
                  className={styles.primary}
                  onClick={() => action((g) => g.dismiss())}
                >
                  {dialogue.action ?? "Continue"} <span>→</span>
                </button>
              </div>
            )}
            {paused && (
              <div className={styles.screen}>
                <p className={styles.eyebrow}>TAKE A BREATHER</p>
                <h2>The story can wait.</h2>
                <p>Your progress stays here while this page is open.</p>
                <button
                  ref={startButton}
                  className={styles.primary}
                  onClick={() => setPaused(false)}
                >
                  Back to the city →
                </button>
                <div className={styles.menuActions}>
                  <button
                    onClick={() => {
                      action((g) => g.recover());
                      setPaused(false);
                    }}
                  >
                    Recover at station
                  </button>
                  <button
                    onClick={() => {
                      action((g) => g.reset());
                      setPaused(false);
                    }}
                  >
                    Restart story
                  </button>
                  {expanded && (
                    <button onClick={() => setExpanded(false)}>
                      Exit expanded view
                    </button>
                  )}
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
          <button disabled={!ready} onClick={() => action((g) => g.recover())}>
            Recover <kbd>R</kbd>
          </button>
        </div>
      </div>
      <details className={styles.instructions}>
        <summary>
          How to play <span>Keyboard, mouse & touch</span>
        </summary>
        <p>
          Walk with WASD or arrow keys. Hold Shift to sprint. Drag the city to
          rotate the camera, scroll to change distance. E interacts. M switches
          between local and full maps. Escape pauses; R returns you safely to
          the station. Camera buttons offer a keyboard alternative. On touch
          screens, hold the direction pad and Sprint, drag the city to look
          around, and tap E to interact.
        </p>
        <p>
          Find Alex at the gold marker, accept the case, inspect the transit
          slip, recover the backpack and return it. You can chase the runner or
          speak to Sam and Jo at the blue marker for help. Purple marks a future
          mystery. Dialogue pauses the action. Gentle streets removes optional
          pickpocket encounters. The story resets when you reload; no progress
          is stored or transmitted.
        </p>
      </details>
    </section>
  );
}
