"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CameraMode, City, Game, Input, Snapshot } from "./types";
import { loadCity } from "./data";
import { createSimulation } from "./simulation";
import { catalogue } from "./interiors";
import { RichmondMap } from "./Map";
import styles from "./richmond.module.css";
import { scenarios, scenarioState } from "./qa";
import { readSave, SAVE_KEY } from "./save";
const cameras: { id: CameraMode; label: string; zh: string; key: string }[] = [
  { id: "third", label: "Third person", zh: "第三人稱", key: "1" },
  { id: "first", label: "First person", zh: "第一人稱", key: "2" },
  { id: "top", label: "Top down", zh: "俯視", key: "3" },
  { id: "aerial", label: "Aerial explore", zh: "空中探索", key: "4" },
];
export function RichmondGame() {
  const [started, setStarted] = useState(false),
    [revision, setRevision] = useState(0),
    [city, setCity] = useState<City | null>(null),
    [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [regionalMap, setRegionalMap] = useState(false),
    [panel, setPanel] = useState<
      "orders" | "map" | "settings" | "bag" | "help" | "shift" | null
    >(null),
    [resetConfirm, setResetConfirm] = useState(false),
    [qa, setQa] = useState(""),
    [qaChoice, setQaChoice] = useState("core");
  const [saveStatus, setSaveStatus] = useState<
    "checking" | "valid" | "empty" | "invalid"
  >("checking");
  const entry = useRef<"continue" | "shift" | "explore" | "airfield">(
    "continue",
  );
  const canvas = useRef<HTMLCanvasElement>(null),
    loadedCity = useRef<City | null>(null),
    game = useRef<Game | null>(null),
    dialog = useRef<HTMLDivElement>(null),
    panelRef = useRef(panel);
  useEffect(() => {
    panelRef.current = panel;
  }, [panel]);
  const update = useCallback((s: Snapshot) => setSnapshot(s), []);
  useEffect(() => {
    if (started) return;
    const abort = new AbortController();
    void Promise.resolve().then(async () => {
      try {
        if (!localStorage.getItem(SAVE_KEY)) {
          if (!abort.signal.aborted) setSaveStatus("empty");
          return;
        }
        const data = await loadCity(abort.signal);
        if (abort.signal.aborted) return;
        loadedCity.current = data;
        setCity(data);
        const saved = readSave(localStorage, data);
        setSaveStatus(
          saved.state ? "valid" : saved.invalid ? "invalid" : "empty",
        );
      } catch {
        if (!abort.signal.aborted) setSaveStatus("empty");
      }
    });
    return () => abort.abort();
  }, [started]);
  useEffect(() => {
    if (!started || !canvas.current) return;
    const abort = new AbortController();
    let owned: Game | null = null;
    setLoading(true);
    setError("");
    void Promise.all([
      loadedCity.current ?? loadCity(abort.signal),
      import("./engine"),
    ])
      .then(([data, module]) => {
        if (abort.signal.aborted || !canvas.current) return;
        loadedCity.current = data;
        setCity(data);
        owned = module.createGame(
          canvas.current,
          data,
          update,
          setError,
          process.env.NODE_ENV === "development" && qa
            ? scenarioState(data, qa)
            : undefined,
        );
        game.current = owned;
        if (!qa && entry.current === "explore") owned.focus("city");
        if (!qa && entry.current === "airfield") {
          owned.airfield(true);
          owned.focus("airport-office");
          owned.navigate("airport-office");
        }
        if (!qa && entry.current === "shift") {
          setPanel("orders");
          panelRef.current = "orders";
        }
        owned.pause(!!panelRef.current);
        setLoading(false);
        canvas.current.focus();
      })
      .catch((e) => {
        if (!abort.signal.aborted) {
          setError(
            e instanceof Error ? e.message : "The game could not start.",
          );
          setLoading(false);
        }
      });
    return () => {
      abort.abort();
      owned?.dispose();
      if (game.current === owned) game.current = null;
    };
  }, [started, revision, update, qa]);
  useEffect(() => {
    game.current?.pause(!!panel);
    if (panel) dialog.current?.focus();
    else if (started) canvas.current?.focus();
  }, [panel, started]);
  const sequence = snapshot?.state.sequence ?? 0;
  const carX = snapshot?.state.car.x,
    carZ = snapshot?.state.car.z;
  const offers = useMemo(() => {
    if (!city || panel !== "orders" || carX === undefined || carZ === undefined)
      return [];
    const sim = createSimulation(city);
    sim.state.car.x = carX;
    sim.state.car.z = carZ;
    return sim.offers(Math.max(1, sequence));
  }, [city, panel, sequence, carX, carZ]);
  const state = snapshot?.state,
    zh = state?.settings.locale === "zh";
  useEffect(() => {
    if (snapshot?.state.shopping) dialog.current?.focus();
    else if (started && !panel) canvas.current?.focus();
  }, [snapshot?.state.shopping, started, panel]);
  function open(value: typeof panel) {
    if (value && (!game.current || loading || error)) return;
    game.current?.pause(value !== null);
    setPanel((p) => (p === value ? null : value));
  }
  function invoke(fn: (g: Game) => void) {
    if (game.current) fn(game.current);
    canvas.current?.focus();
  }
  function touch(action: Input, label: string) {
    return (
      <button
        type="button"
        aria-label={label}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          game.current?.input(action, true, "touch:" + e.pointerId);
        }}
        onPointerUp={(e) =>
          game.current?.input(action, false, "touch:" + e.pointerId)
        }
        onPointerCancel={(e) =>
          game.current?.input(action, false, "touch:" + e.pointerId)
        }
        onLostPointerCapture={(e) =>
          game.current?.input(action, false, "touch:" + e.pointerId)
        }
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            game.current?.input(
              action,
              true,
              "button:" + action + ":" + e.code,
            );
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            game.current?.input(
              action,
              false,
              "button:" + action + ":" + e.code,
            );
          }
        }}
        onBlur={() => {
          for (const code of ["Space", "Enter"])
            game.current?.input(action, false, "button:" + action + ":" + code);
        }}
      >
        {label}
      </button>
    );
  }
  function trap(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setPanel(null);
      if (state?.shopping) game.current?.pause(false);
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = Array.from(
      dialog.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled)",
      ) ?? [],
    ).filter((node) => node.getClientRects().length > 0);
    if (!nodes?.length) return;
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    if (
      e.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === dialog.current)
    ) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  return (
    <section
      className={`${styles.game} ${started ? styles.playing : ""} ${state?.camera === "aerial" ? styles.survey : ""}`}
      aria-label="Richmond Learns to Drive"
      style={{ fontSize: `${state?.settings.textScale ?? 1}em` }}
    >
      {!started ? (
        <div className={styles.start}>
          <div className={styles.startMap} aria-hidden="true">
            <span>SEA ISLAND</span>
            <span>RICHMOND</span>
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className={styles.startCopy}>
            <span className={styles.eyebrow}>
              PLAYABLE PREVIEW · YOUR NEXT SHIFT STARTS HERE
            </span>
            <h2>
              A city to explore.
              <br />A living to make.
            </h2>
            <p>
              Pick up something delicious. Find your way from the city centre to
              Steveston and Sea Island. Park, step inside and meet the
              neighbourhood.
            </p>
            <div className={styles.entryActions}>
              {saveStatus === "valid" && (
                <button
                  className={styles.primary}
                  onClick={() => {
                    setQa("");
                    entry.current = "continue";
                    setStarted(true);
                  }}
                >
                  Continue
                </button>
              )}
              <button
                className={saveStatus === "valid" ? "" : styles.primary}
                onClick={() => {
                  setQa("");
                  entry.current = "shift";
                  setStarted(true);
                }}
              >
                Start Delivery Shift
              </button>
              <button
                onClick={() => {
                  setQa("");
                  entry.current = "explore";
                  setStarted(true);
                }}
              >
                Explore Richmond
              </button>
              <button
                onClick={() => {
                  setQa("");
                  entry.current = "airfield";
                  setStarted(true);
                }}
              >
                Open Airfield
              </button>
            </div>
            {saveStatus === "invalid" && (
              <p role="status">
                Your saved data needs attention. It stays untouched until you
                explicitly choose a new career in Settings.
              </p>
            )}
            <p className={styles.small}>
              A compact car · $20 fictional CAD · a delivery bag
              <br />
              Continue, shifts and exploration preserve your career. Progress
              saves only in this browser.
            </p>
            <a href="#richmond-controls">Controls & accessibility ↓</a>
            {process.env.NODE_ENV === "development" && (
              <details>
                <summary>
                  Developer journeys · isolated initial fixtures
                </summary>
                <p>
                  Fresh start only. No career reads or writes. Lite, density 1,
                  Gentle Streets, fixed seed 18273. Normal controls throughout.
                </p>
                <select
                  aria-label="Initial journey fixture"
                  value={qaChoice}
                  onChange={(e) => setQaChoice(e.target.value)}
                >
                  {scenarios.map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setQa(qaChoice);
                    setStarted(true);
                  }}
                >
                  Begin isolated check
                </button>
              </details>
            )}
          </div>
          <div className={styles.startFooter}>
            <b>RICHMOND LEARNS TO DRIVE</b>
            <span>Real geography. Original fictional stories.</span>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.toolbar} inert={!!panel || !!state?.shopping}>
            <div className={styles.location}>
              <span className={styles.dot} />{" "}
              {snapshot?.street ?? "Preparing your shift…"}
            </div>
            <div className={styles.toolbarButtons}>
              {state?.camera === "aerial" ? (
                <select
                  aria-label="Survey a landmark"
                  defaultValue=""
                  onChange={(e) => invoke((g) => g.focus(e.target.value))}
                >
                  <option value="" disabled>
                    Landmarks
                  </option>
                  <option value="richmond-centre">Richmond Centre</option>
                  <option value="steveston">Steveston</option>
                  <option value="terra-nova">Terra Nova</option>
                  <option value="ikea">IKEA / Bridgeport</option>
                  <option value="yvr">YVR</option>
                  <option value="knight">Knight Street Bridge</option>
                </select>
              ) : (
                <button
                  disabled={loading || !!error || !snapshot}
                  onClick={() => open("orders")}
                >
                  {zh ? "接單" : "Orders"} <span>↗</span>
                </button>
              )}
              <button
                disabled={loading || !!error || !snapshot}
                onClick={() => open("map")}
              >
                {zh ? "地圖" : "Map"}
              </button>
              <button
                className={styles.secondaryTool}
                disabled={loading || !!error || !snapshot}
                onClick={() => open("bag")}
              >
                {zh ? "背包" : "Bag"}
              </button>
              <button
                className={styles.secondaryTool}
                disabled={loading || !!error || !snapshot}
                onClick={() => open("settings")}
              >
                {zh ? "設定" : "Settings"}
              </button>
              <button
                aria-label="Pause and controls"
                disabled={loading || !!error || !snapshot}
                onClick={() => open("help")}
              >
                Menu
              </button>
              <button
                className={styles.doneButton}
                onClick={() => {
                  game.current?.save();
                  setStarted(false);
                  setPanel(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
          {snapshot && (
            <button
              className={styles.mobileSummary}
              aria-label="Shift details: cash, health, stamina, car and current delivery"
              onClick={() => open("shift")}
              inert={!!panel || !!state?.shopping}
            >
              <b>${state!.cash}</b>
              <span>Health {Math.round(state!.health)}</span>
              <span className={styles.summaryOrder}>
                {state!.active
                  ? `${state!.active.stage === "accepted" ? "Pickup" : "Deliver"} · ${Math.ceil(state!.active.remaining / 60)} min`
                  : "Free roam"}
              </span>
              <span>Details ⌃</span>
            </button>
          )}
          <div className={styles.viewport}>
            <canvas
              key={revision}
              ref={canvas}
              inert={!!panel || !!state?.shopping}
              data-testid="richmond-world"
              data-x={state?.player.x.toFixed(2)}
              data-z={state?.player.z.toFixed(2)}
              data-y={state?.player.y.toFixed(2)}
              data-yaw={state?.player.yaw.toFixed(3)}
              data-car-x={state?.car.x.toFixed(2)}
              data-car-z={state?.car.z.toFixed(2)}
              data-speed={state?.car.speed.toFixed(2)}
              data-fps={snapshot?.fps}
              data-goal={snapshot?.target?.join(",")}
              data-diagnostics={
                snapshot?.diagnostics
                  ? JSON.stringify(snapshot.diagnostics)
                  : undefined
              }
              className={styles.canvas}
              tabIndex={0}
              aria-label="Richmond game. WASD or arrows move, Shift sprints, Space brakes, F enters or exits your car, E interacts. Drag to look. Keys 1 to 4 change camera. R recovers. Tab reaches controls."
              onKeyDown={(e) => {
                if (e.code === "KeyM") {
                  e.preventDefault();
                  open("map");
                }
                if (e.code === "KeyO") {
                  e.preventDefault();
                  open("orders");
                }
              }}
            />
            {loading && (
              <div className={styles.loading} role="status">
                <span className={styles.eyebrow}>
                  RICHMOND / BRITISH COLUMBIA
                </span>
                <h3>Opening the city…</h3>
                <p>Loading your local world and delivery shift.</p>
              </div>
            )}
            {error && (
              <div className={styles.loading} role="alert">
                <h3>Let’s get you moving again.</h3>
                <p>{error}</p>
                <button onClick={() => setRevision((n) => n + 1)}>
                  Retry graphics & map
                </button>
                <button onClick={() => open("help")}>
                  Text guide and controls
                </button>
              </div>
            )}
            {snapshot && (
              <>
                <div className={styles.stats}>
                  <div>
                    <small>{zh ? "現金" : "CASH / CAD"}</small>
                    <strong>${state!.cash}</strong>
                  </div>
                  <div>
                    <small>{zh ? "健康" : "HEALTH"}</small>
                    <strong>
                      {Math.round(state!.health)}
                      <em>/100</em>
                    </strong>
                  </div>
                  <div>
                    <small>{zh ? "體力" : "STAMINA"}</small>
                    <strong>{Math.round(state!.stamina)}</strong>
                  </div>
                  <div>
                    <small>{zh ? "車況" : "CAR"}</small>
                    <strong>
                      {Math.round(state!.car.condition)}
                      <em>%</em>
                    </strong>
                  </div>
                </div>
                <div
                  className={styles.objective}
                  inert={!!panel || !!state?.shopping}
                >
                  <span className={styles.eyebrow}>
                    {state!.active
                      ? state!.active.title
                      : "ON YOUR OWN SCHEDULE"}
                  </span>
                  <p>{snapshot.objective}</p>
                  {state!.active ? (
                    <div className={styles.orderMeta}>
                      <span>
                        {state!.active.stage === "accepted"
                          ? "01 / PICKUP"
                          : "02 / DELIVERY"}
                      </span>
                      <span>
                        {Math.ceil(state!.active.remaining / 60)} min ·{" "}
                        {Math.round(state!.active.condition)}% fresh
                      </span>
                    </div>
                  ) : (
                    <button onClick={() => open("orders")}>
                      Find your first delivery →
                    </button>
                  )}
                </div>
                <div className={styles.mapCorner}>
                  {city && <RichmondMap city={city} snapshot={snapshot} />}
                  <span>
                    N ↑ ·{" "}
                    <b>
                      {state!.locomotion === "drive"
                        ? Math.round(Math.abs(state!.car.speed) * 3.6) + " km/h"
                        : "ON FOOT"}
                    </b>{" "}
                    ·{" "}
                    {
                      state!.history.filter((h) => h.outcome === "delivered")
                        .length
                    }{" "}
                    deliveries
                  </span>
                </div>
                <div className={styles.prompt}>
                  {state!.camera === "aerial"
                    ? "Drag to orbit · arrows / right-drag to pan · +/− or wheel to zoom"
                    : state!.locomotion === "drive"
                      ? snapshot.navigation
                      : snapshot.prompt}
                  {state!.camera !== "aerial" && snapshot.distance > 5 && (
                    <span>
                      {snapshot.distance >= 1000
                        ? (snapshot.distance / 1000).toFixed(1) + " km"
                        : Math.round(snapshot.distance) + " m"}{" "}
                      to target
                    </span>
                  )}
                </div>
                {(state!.camera === "aerial" || snapshot.paused) && (
                  <div className={styles.pauseTag}>
                    Ⅱ{" "}
                    {state!.camera === "aerial"
                      ? "Aerial surveying · shift paused"
                      : "Shift paused"}
                    {state!.airfield && " · fictional airfield"}
                  </div>
                )}
                {state!.airfield &&
                  state!.camera !== "aerial" &&
                  !snapshot.paused && (
                    <div className={styles.airfieldTag}>
                      OPEN AIRFIELD · FICTIONAL SANDBOX
                    </div>
                  )}
                <div
                  className={styles.touch}
                  inert={!!panel || !!state?.shopping}
                >
                  <div className={styles.pad}>
                    {touch("left", "←")}
                    {touch("forward", "↑")}
                    {touch("right", "→")}
                    {touch("back", "↓")}
                  </div>
                  <div className={styles.actions}>
                    {state!.camera === "aerial" ? (
                      <>
                        <button
                          onClick={() => invoke((g) => g.returnToPlayer())}
                        >
                          Return to Player
                        </button>
                        <button
                          onClick={() => invoke((g) => g.focus("player"))}
                        >
                          Find Me
                        </button>
                        <button onClick={() => invoke((g) => g.focus("car"))}>
                          Find My Car
                        </button>
                        <button onClick={() => invoke((g) => g.focus("city"))}>
                          Whole City
                        </button>
                      </>
                    ) : (
                      <>
                        {touch(
                          state!.locomotion === "drive" ? "brake" : "sprint",
                          state!.locomotion === "drive" ? "Brake" : "Sprint",
                        )}
                        <button onClick={() => invoke((g) => g.vehicle())}>
                          F · {state!.locomotion === "drive" ? "Exit" : "Car"}
                        </button>
                        <button onClick={() => invoke((g) => g.interact())}>
                          E · {zh ? "互動" : "Interact"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {state!.encounter && (
                  <div className={styles.encounter} role="status">
                    <b>Street encounter</b>
                    <p>{state!.encounter.warning}</p>
                    <div>
                      <button
                        onClick={() => invoke((g) => g.encounter("leave"))}
                      >
                        Leave safely
                      </button>
                      <button
                        onClick={() => invoke((g) => g.encounter("help"))}
                      >
                        Seek help / report
                      </button>
                      <button
                        onClick={() => invoke((g) => g.encounter("give"))}
                      >
                        Give up to $8
                      </button>
                    </div>
                  </div>
                )}
                {state!.shopping && (
                  <div
                    ref={dialog}
                    className={styles.shop}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Shop"
                    tabIndex={-1}
                    onKeyDown={trap}
                  >
                    <h3>Shop / 購物</h3>
                    <p>Fictional CAD · balance ${state!.cash}</p>
                    {catalogue.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          game.current?.buy(item.id);
                          dialog.current?.focus();
                        }}
                        disabled={
                          state!.cash < item.price ||
                          (["insulation", "jacket"].includes(item.id) &&
                            !!state!.inventory[item.id])
                        }
                      >
                        <span>
                          {item.name}
                          <small>{item.description}</small>
                        </span>
                        <b>${item.price}</b>
                      </button>
                    ))}
                    <button onClick={() => invoke((g) => g.pause(false))}>
                      Close shop
                    </button>
                  </div>
                )}
              </>
            )}
            {panel && (
              <div className={styles.scrim}>
                <div
                  ref={dialog}
                  className={`${styles.dialog} ${panel === "map" ? styles.mapDialog : ""}`}
                  role="dialog"
                  aria-modal="true"
                  aria-label={panel === "orders" ? "Delivery board" : panel}
                  tabIndex={-1}
                  onKeyDown={trap}
                >
                  <div className={styles.dialogHeader}>
                    <span className={styles.eyebrow}>
                      SHIFT PAUSED · TAKE YOUR TIME
                    </span>
                    <button
                      onClick={() => setPanel(null)}
                      aria-label="Close panel"
                    >
                      Close ×
                    </button>
                  </div>
                  {panel === "orders" && (
                    <>
                      <h2>Something good to deliver.</h2>
                      <p>
                        Choose a shift. Pick up on foot, carry the correct order
                        and meet your customer. Every delivery is free to start.
                      </p>
                      {state?.active && (
                        <div className={styles.activeOrder}>
                          <b>Current: {state.active.title}</b>
                          <p>
                            {state.active.food} for {state.active.customer}
                          </p>
                          <button
                            onClick={() => {
                              game.current?.cancel();
                              setPanel(null);
                            }}
                          >
                            Cancel current order
                          </button>
                        </div>
                      )}
                      <div className={styles.orderGrid}>
                        {offers.map((o) => (
                          <article key={o.id}>
                            <span className={styles.eyebrow}>
                              {o.id.startsWith("shift")
                                ? "NEW NEIGHBOURHOOD ORDER"
                                : "REGIONAL STORY"}
                            </span>
                            <h3>{o.title}</h3>
                            <p>{o.description}</p>
                            <div className={styles.journey}>
                              <span>
                                ↑{" "}
                                {
                                  city?.places.find((p) => p.id === o.pickup)
                                    ?.name
                                }
                              </span>
                              <span>
                                ↓{" "}
                                {
                                  city?.places.find(
                                    (p) => p.id === o.destination,
                                  )?.name
                                }
                              </span>
                            </div>
                            <footer>
                              <span>
                                <b>${o.quote!.basePay}</b> + tip
                                <small>
                                  {(o.quote!.distance / 1000).toFixed(1)} km
                                  delivery ·{" "}
                                  {(o.quote!.approachDistance / 1000).toFixed(
                                    1,
                                  )}{" "}
                                  km to pickup · about{" "}
                                  {Math.ceil(o.quote!.duration / 60)} min
                                </small>
                              </span>
                              <button
                                disabled={!!state?.active}
                                onClick={() => {
                                  game.current?.accept(o.id);
                                  setPanel(null);
                                }}
                              >
                                Accept →
                              </button>
                            </footer>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                  {panel === "map" && city && snapshot && (
                    <>
                      <h2>Find your next corner.</h2>
                      <p>
                        Camera visits never move your player. Select a place to
                        survey it or set a route. An active order keeps its own
                        route until you complete or cancel it.
                      </p>
                      {!state?.interior && (
                        <div className={styles.mapTools} aria-label="Map area">
                          <button
                            aria-pressed={!regionalMap}
                            onClick={() => setRegionalMap(false)}
                          >
                            Nearby streets
                          </button>
                          <button
                            aria-pressed={regionalMap}
                            onClick={() => setRegionalMap(true)}
                          >
                            Richmond region
                          </button>
                        </div>
                      )}
                      <div className={styles.cityMap}>
                        <RichmondMap
                          city={city}
                          snapshot={snapshot}
                          wide={regionalMap}
                          localSpan={300}
                          onSelect={(id) => {
                            game.current?.focus(id);
                            setPanel(null);
                          }}
                        />
                      </div>
                      <div className={styles.mapTools}>
                        <button
                          onClick={() => {
                            game.current?.focus("player");
                            setPanel(null);
                          }}
                        >
                          Find me
                        </button>
                        <button
                          onClick={() => {
                            game.current?.focus("car");
                            setPanel(null);
                          }}
                        >
                          Find my car
                        </button>
                        <button
                          onClick={() => {
                            game.current?.returnToPlayer();
                            setPanel(null);
                          }}
                        >
                          Return to player
                        </button>
                        <button
                          onClick={() => {
                            game.current?.focus("city");
                            setPanel(null);
                          }}
                        >
                          Whole City
                        </button>
                        <button
                          onClick={() => {
                            game.current?.airfield(!state?.airfield);
                            setPanel(null);
                          }}
                        >
                          {state?.airfield ? "Close" : "Enable"} Open Airfield
                        </button>
                      </div>
                      <div className={styles.placeList}>
                        {city.places.map((p) => (
                          <div key={p.id}>
                            <span>
                              <b>{p.name}</b>
                              <small>
                                {p.district} ·{" "}
                                {p.interior
                                  ? "Enterable " + p.interior
                                  : "Outdoor meeting / landmark"}
                              </small>
                            </span>
                            <button
                              onClick={() => {
                                game.current?.focus(p.id);
                                setPanel(null);
                              }}
                            >
                              View
                            </button>
                            <button
                              disabled={!!state?.active}
                              onClick={() => {
                                if (!state?.active)
                                  game.current?.navigate(p.id);
                                setPanel(null);
                              }}
                            >
                              Route
                            </button>
                          </div>
                        ))}
                      </div>
                      <p>
                        Open Airfield is available immediately. Follow the route
                        to Airport Operations Office and use the marked
                        fictional connection to runways. The gold connection leads
                        from office parking onto the shaded apron; turn west to
                        join the marked taxiways. No real-world access or
                        security procedure is represented.
                      </p>
                    </>
                  )}
                  {panel === "settings" && state && (
                    <>
                      <h2>Make the shift yours.</h2>
                      <div className={styles.settings}>
                        <label>
                          <input
                            type="checkbox"
                            checked={state.settings.gentle}
                            onChange={(e) =>
                              game.current?.settings({
                                gentle: e.target.checked,
                              })
                            }
                          />{" "}
                          Gentle Streets — disable optional threats
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={state.settings.lite}
                            onChange={(e) =>
                              game.current?.settings({ lite: e.target.checked })
                            }
                          />{" "}
                          Lite Mode — fewer actors and lower resolution
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={state.settings.reducedMotion}
                            onChange={(e) =>
                              game.current?.settings({
                                reducedMotion: e.target.checked,
                              })
                            }
                          />{" "}
                          Reduced motion
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={state.settings.northUp}
                            onChange={(e) =>
                              game.current?.settings({
                                northUp: e.target.checked,
                              })
                            }
                          />{" "}
                          North-up overhead camera
                        </label>
                        <label>
                          Street encounters{" "}
                          <select
                            value={state.settings.encounterRate}
                            onChange={(e) =>
                              game.current?.settings({
                                encounterRate: Number(e.target.value),
                              })
                            }
                          >
                            <option value="0.5">Occasional</option>
                            <option value="1">Standard</option>
                            <option value="1.5">More frequent</option>
                          </select>
                        </label>
                        <label>
                          Encounter consequences{" "}
                          <select
                            value={state.settings.encounterSeverity}
                            onChange={(e) =>
                              game.current?.settings({
                                encounterSeverity: Number(e.target.value),
                              })
                            }
                          >
                            <option value="0.5">Mild</option>
                            <option value="1">Standard</option>
                          </select>
                        </label>
                        <label>
                          Local population{" "}
                          <input
                            type="range"
                            min=".25"
                            max="1.5"
                            step=".25"
                            value={state.settings.density}
                            onChange={(e) =>
                              game.current?.settings({
                                density: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                        <label>
                          Text size{" "}
                          <select
                            value={state.settings.textScale}
                            onChange={(e) =>
                              game.current?.settings({
                                textScale: Number(e.target.value),
                              })
                            }
                          >
                            <option value="1">Normal</option>
                            <option value="1.2">Large</option>
                            <option value="1.5">Extra large</option>
                          </select>
                        </label>
                        <label>
                          Interface labels{" "}
                          <select
                            value={state.settings.locale}
                            onChange={(e) =>
                              game.current?.settings({
                                locale: e.target.value as "en" | "zh",
                              })
                            }
                          >
                            <option value="en">English</option>
                            <option value="zh">繁體中文 / English</option>
                          </select>
                        </label>
                      </div>
                      <p>{snapshot?.saveNotice}</p>
                      <button onClick={() => game.current?.save()}>
                        Save now
                      </button>{" "}
                      <button onClick={() => setResetConfirm(true)}>
                        Start a new career
                      </button>
                      {resetConfirm && (
                        <div className={styles.activeOrder}>
                          <p>
                            Replace this browser’s Richmond progress? This
                            resets cash, orders and purchases.
                          </p>
                          <button
                            onClick={() => {
                              game.current?.reset();
                              setResetConfirm(false);
                              setPanel(null);
                            }}
                          >
                            Yes, reset Richmond
                          </button>{" "}
                          <button onClick={() => setResetConfirm(false)}>
                            Keep my progress
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {panel === "bag" && state && (
                    <>
                      <h2>Your bag. Your story.</h2>
                      <p>
                        ${state.cash} fictional CAD ·{" "}
                        {
                          state.history.filter((h) => h.outcome === "delivered")
                            .length
                        }{" "}
                        completed deliveries
                      </p>
                      <div className={styles.placeList}>
                        {Object.entries(state.inventory)
                          .filter(([, n]) => n > 0)
                          .map(([id, n]) => (
                            <div key={id}>
                              <span>
                                {id === state.active?.id
                                  ? state.active.food + " · " + id
                                  : (catalogue.find((x) => x.id === id)?.name ??
                                    "Delivery bag")}{" "}
                                × {n}
                              </span>
                              {["meal", "medkit", "repair"].includes(id) && (
                                <button onClick={() => game.current?.use(id)}>
                                  Use
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                      <h3>Delivery history</h3>
                      {state.history.length ? (
                        state.history.map((h) => (
                          <p key={h.id}>
                            <b>{h.title}</b> · {h.outcome} · ${h.pay + h.tip} ·{" "}
                            {h.rating}/5
                          </p>
                        ))
                      ) : (
                        <p>Your first completed delivery will appear here.</p>
                      )}
                    </>
                  )}
                  {panel === "shift" && state && (
                    <>
                      <h2>Your shift</h2>
                      <div className={styles.shiftStats}>
                        <span>
                          Cash <b>${state.cash} CAD</b>
                        </span>
                        <span>
                          Health <b>{Math.round(state.health)}/100</b>
                        </span>
                        <span>
                          Stamina <b>{Math.round(state.stamina)}/100</b>
                        </span>
                        <span>
                          Car <b>{Math.round(state.car.condition)}%</b>
                        </span>
                        <span>
                          Completed{" "}
                          <b>
                            {
                              state.history.filter(
                                (h) => h.outcome === "delivered",
                              ).length
                            }
                          </b>
                        </span>
                      </div>
                      <h3>{state.active?.title ?? "Free roam"}</h3>
                      <p>{snapshot?.objective}</p>
                      {state.active && (
                        <p>
                          {Math.ceil(state.active.remaining / 60)} minutes left
                          · {Math.round(state.active.condition)}% fresh ·{" "}
                          {state.active.food}
                        </p>
                      )}
                      <p>{snapshot?.message}</p>
                      <div className={styles.mapTools}>
                        <button onClick={() => setPanel("orders")}>
                          Orders
                        </button>
                        <button onClick={() => setPanel("bag")}>
                          Bag & history
                        </button>
                        <button onClick={() => setPanel("map")}>Map</button>
                      </div>
                    </>
                  )}
                  {panel === "help" && (
                    <>
                      <h2>Take the wheel.</h2>
                      <div className={styles.mapTools}>
                        <button onClick={() => setPanel("shift")}>
                          Shift details
                        </button>
                        <button onClick={() => setPanel("bag")}>
                          Bag & history
                        </button>
                        <button onClick={() => setPanel("settings")}>
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            game.current?.save();
                            setPanel(null);
                            setStarted(false);
                          }}
                        >
                          Save & leave game
                        </button>
                      </div>
                      <p>
                        WASD or arrows move. Shift sprints on foot. Space
                        brakes. Stop, then F to exit or enter the same car. E
                        enters buildings, collects orders and hands over food.
                        Drag to look; right-drag pans aerial view. Wheel zooms.
                      </p>
                      <p>
                        1 third person · 2 first person · 3 top down · 4 aerial
                        explore. M opens the map; O opens orders. R recovers
                        safely. All menus, aerial surveying and hidden tabs
                        pause delivery and encounter timers.
                      </p>
                      <p>
                        Touch: hold the arrow controls, Sprint/Brake, F and E.
                        Drag the clear playing view to look around. Camera and
                        zoom buttons remain below it. On a phone, tap Details
                        for your full shift status or Map for navigation; close
                        the panel to resume. First-person walking uses the
                        direction you look.
                      </p>
                      <p>
                        Meet fictional neighbours such as Mei, a Chinese
                        Canadian garden volunteer; Jun, a Cantonese-speaking
                        kitchen lead; Wei, a Chinese Canadian shopkeeper; Lena,
                        a student visiting with her grandparents; Arjun, a
                        commuter; and Rosa, an airport traveller. Everyday
                        community life fills the streets. Background and
                        language never determine danger or driving behaviour.
                      </p>
                      <h3>Your first delivery</h3>
                      {process.env.NODE_ENV === "development" && (
                        <button
                          onClick={() => {
                            setPanel(null);
                            canvas.current
                              ?.getContext("webgl2")
                              ?.getExtension("WEBGL_lose_context")
                              ?.loseContext();
                          }}
                        >
                          Developer check: graphics loss
                        </button>
                      )}
                      <ol>
                        <li>Accept First Day in Richmond.</li>
                        <li>
                          Park, exit with F and walk to the gold entrance
                          marker.
                        </li>
                        <li>
                          Press E to enter, walk to the marked counter and press
                          E to collect.
                        </li>
                        <li>
                          Leave through EXIT, find the same car and drive to the
                          customer.
                        </li>
                        <li>
                          Park and walk to the meeting point. E hands over your
                          labelled order and pays once.
                        </li>
                      </ol>
                      <p>
                        All characters, incidents, businesses used for
                        interactions and interiors are fictional. Gentle Streets
                        disables optional threats. The title refers to the
                        fictional courier learning to drive.
                      </p>
                      <button
                        onClick={() => {
                          setPanel(null);
                          game.current?.lockPointer();
                        }}
                      >
                        Lock mouse look (Escape releases)
                      </button>{" "}
                      <button
                        onClick={() => {
                          game.current?.recover();
                          setPanel(null);
                        }}
                      >
                        Recover safely
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className={styles.bottomBar}
            inert={!!panel || !!state?.shopping}
          >
            <div className={styles.cameraButtons}>
              {cameras.map((c) => (
                <button
                  key={c.id}
                  aria-pressed={state?.camera === c.id}
                  onClick={() => invoke((g) => g.camera(c.id))}
                >
                  <kbd>{c.key}</kbd>
                  {zh ? c.zh : c.label}
                </button>
              ))}
            </div>
            <div>
              <button
                aria-label="Zoom in"
                onClick={() => invoke((g) => g.zoom(-180))}
              >
                ＋
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => invoke((g) => g.zoom(180))}
              >
                −
              </button>
              <button
                className={styles.secondaryTool}
                onClick={() => invoke((g) => g.recover())}
              >
                Recover
              </button>
            </div>
          </div>
          <div className={styles.status}>
            <p role="status" aria-live="polite">
              {snapshot?.message ?? "Loading the city…"}
            </p>
            <span>
              {snapshot?.fps ?? 0} FPS · {snapshot?.pedestrians ?? 0} people ·{" "}
              {snapshot?.traffic ?? 0} cars
            </span>
          </div>
        </>
      )}
      <div className={styles.attribution}>
        <a href="https://www.openstreetmap.org/copyright">
          © OpenStreetMap contributors
        </a>{" "}
        · <a href="https://opendatacommons.org/licenses/odbl/1-0/">ODbL data</a>
        <span>Fictional CAD · local progress · original interiors</span>
      </div>
    </section>
  );
}
