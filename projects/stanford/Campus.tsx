"use client";
import Image from "next/image";
import { createCampusSound, type CampusSound } from "./sound";
import { applyCampusAnchors } from "./layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  characters,
  places,
  displays,
  safeExternalUrl,
  unofficial,
  sources,
} from "./registry";
import {
  clock,
  defaults,
  normalizeSettings,
  solarPosition,
  halloweenStorageKey,
  initialHalloweenPreference,
  serializeHalloweenPreference,
  setHalloween,
  type Atmosphere,
} from "./environment";
import type {
  Anchors,
  CampusData,
  Link,
  Mode,
  Point,
  Settings,
  Telemetry,
} from "./types";
import type { CampusAPI, Marker } from "./engine";
import { InteriorGuide } from "./InteriorGuide";
import { ProfilePanel } from "./community/ProfilePanel";
import { profileCharacter, type PublicProfile } from "./community/model";
import { HalloweenWelcome } from "./HalloweenWelcome";
import styles from "./campus.module.css";
import { cameraModes, onFoot } from "./navigation";
import { CampusMap } from "./CampusMap";
import { AppearancePanel } from "./AppearancePanel";
import {
  defaultAppearance,
  normalizeAppearance,
  appearanceStorageKey,
  type Appearance,
} from "./appearance";
import { Conversation } from "./ConversationPanel";
import { emptyConversation, type ConversationState } from "./conversation";
import { groupBuildings, sourceBuildingId } from "./building-directory";

const version = "/stanford/v0.1-2026-10-31";
function Links({ links }: { links: Link[] }) {
  return (
    <div className={styles.links}>
      {links
        .filter((l) => safeExternalUrl(l.url))
        .map((l) => (
          <a
            key={l.url}
            href={safeExternalUrl(l.url)!}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        ))}
    </div>
  );
}
const titleOf = (id: string) =>
  characters.find((c) => c.id === id)?.name ||
  places.find((p) => p.id === id)?.name ||
  displays[id]?.name ||
  id;
export function Campus() {
  const host = useRef<HTMLDivElement>(null),
    api = useRef<CampusAPI | null>(null),
    panelRef = useRef<HTMLElement>(null),
    hadPanel = useRef(false),
    mapPanelOpener = useRef<HTMLElement | null>(null),
    resumeSceneFocus = useRef(false);
  const sound = useRef<CampusSound | null>(null);
  useEffect(() => () => { sound.current?.dispose(); sound.current=null; }, []);
  const enableSound = () => {
    try { sound.current ||= createCampusSound(setNotice); api.current?.audio(sound.current); void sound.current.resume(); } catch { setNotice("Audio is unavailable in this browser."); }
  };
  const previousAtmosphere = useRef<Atmosphere | null>(null);
  const focusScene = useCallback(() => {
    host.current?.querySelector("canvas")?.focus({ preventScroll: true });
  }, []);
  const [loadingMessage,setLoadingMessage]=useState("Loading campus geography and architectural models…");
  const [started, setStarted] = useState(false),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [generation, setGeneration] = useState(0),
    [expanded, setExpanded] = useState(false),
    [photo, setPhoto] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [data, setData] = useState<CampusData | null>(null),
    [anchors, setAnchors] = useState<Anchors>({}),
    [mode, setMode] = useState<Mode>("walk"),
    [settings, setSettings] = useState<Settings>(defaults),
    [panel, setPanel] = useState<string | null>(null),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [notice, setNotice] = useState("");
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null),
    [markers, setMarkers] = useState<Marker[]>([]),
    [route, setRoute] = useState<Point[] | null>(null),
    [histories, setHistories] = useState<Record<string, ConversationState>>({});
  useEffect(() => {
    // Date and device preference are client-only; apply after hydration.
    const frame = requestAnimationFrame(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(halloweenStorageKey); } catch {}
    const edition = setHalloween(defaults, initialHalloweenPreference(new Date(), stored));
    previousAtmosphere.current = edition.previous;
    setSettings(edition.settings);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);
  useEffect(() => {
    if (ready) api.current?.appearance(appearance);
  }, [ready, appearance]);
  const updateAppearance = (value: Appearance) => {
    setAppearance(value);
    try {
      localStorage.setItem(appearanceStorageKey, JSON.stringify(value));
    } catch {
      setNotice(
        "Appearance changed for this visit; device storage is unavailable.",
      );
    }
  };
  const [community, setCommunity] = useState<PublicProfile[]>([]);
  const communityCharacters = useMemo(() => community.map(profileCharacter), [community]);
  const allCharacters = useMemo(() => [...characters, ...communityCharacters], [communityCharacters]);
  const refreshCommunity = useCallback(() => {
    void fetch("/labs/stanford/community-api/community", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(v => { if (v?.profiles) setCommunity(v.profiles); })
      .catch(() => { /* Exploration remains usable during a profile service outage. */ });
  }, []);
  useEffect(() => {
    if (!started) return;
    refreshCommunity();
    const timer = setInterval(refreshCommunity, 60000);
    return () => clearInterval(timer);
  }, [started, refreshCommunity]);
  useEffect(() => { if (ready) api.current?.community(communityCharacters); }, [ready, communityCharacters]);
  const openPanel = useCallback(
    (id: string) => {
      setPanel(Object.values(anchors).find(a => a.buildingId === id)?.id || id);
    },
    [anchors, setPanel],
  );
  useEffect(() => {
    if (!started || !host.current) return;
    let cancelled = false,
      engine: CampusAPI | null = null;
    const controller = new AbortController();
    Promise.all([
      import("./engine"),
      fetch(`${version}/data.json`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error("Campus data did not load.");
        return r.json() as Promise<CampusData>;
      }),
      fetch(`${version}/anchors.json`, { signal: controller.signal }).then(
        (r) => {
          if (!r.ok) throw new Error("Campus locations did not load.");
          return r.json() as Promise<Anchors>;
        },
      ),
    ])
      .then(async ([module, world, locations]) => {
        if (cancelled || !host.current) return;
        const expandedWorld = world;
        setData(world);
        Object.assign(locations, applyCampusAnchors(locations));
        setAnchors(locations);
        engine = await module.createCampus(
          host.current,
          expandedWorld,
          locations,
          (t) => {
            setTelemetry(t);
            setMode(t.mode);
          },
          (id) => setPanel(id),
          setMarkers,
          setRoute,
          setError,
          sound.current,
          message=>{if(!cancelled)setLoadingMessage(message);},
        );
        if(cancelled){engine.dispose();return;}
        api.current = engine;
        setSettings((s) => ({
          ...s,
          reducedMotion:
            matchMedia("(prefers-reduced-motion: reduce)").matches ||
            s.reducedMotion,
        }));
        setReady(true);
      })
      .catch((e) => {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Graphics could not start. Use the directory below.",
          );
      });
    return () => {
      cancelled = true;
      controller.abort();
      engine?.dispose();
      api.current = null;
    };
  }, [started, generation]);
  useEffect(() => {
    api.current?.settings(settings);
  }, [settings, ready]);
  useEffect(() => {
    api.current?.pause(
      !!panel,
      allCharacters.some((c) => c.id === panel) ? panel! : undefined,
    );
  }, [panel, ready, allCharacters]);
  useEffect(() => {
    if (!panel) {
      if (hadPanel.current || resumeSceneFocus.current) {
        resumeSceneFocus.current = false;
        hadPanel.current = false;
        if(mode === "map") mapPanelOpener.current?.focus({preventScroll:true});
        else focusScene();
      }
      return;
    }
    if(!hadPanel.current)mapPanelOpener.current=document.activeElement as HTMLElement;
    hadPanel.current = true;
    panelRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPanel(null);
        return;
      }
      if (e.key === "Tab") {
        const nodes = [
          ...(panelRef.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),a,input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]',
          ) || []),
        ].filter((node) => node.getClientRects().length > 0);
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panelRef.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
    };
  }, [panel, ready, focusScene, mode]);
  useEffect(() => {
    if (!expanded) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [expanded]);
  const changeMode = (m: Mode) => {
    setMode(m);
    setNotice("");
    api.current?.setMode(m);
    if (onFoot(m)) focusScene();
  };
  const update = (patch: Partial<Settings>) =>
    setSettings((s) => normalizeSettings({ ...s, ...patch }));
  const changeHalloween = (enabled: boolean) => {
    const next = setHalloween(settings, enabled, previousAtmosphere.current);
    previousAtmosphere.current = next.previous;
    setSettings(next.settings);
    try {
      const saved = serializeHalloweenPreference(new Date(), enabled);
      if (saved) localStorage.setItem(halloweenStorageKey, saved);
    } catch {
      setNotice("Halloween changed for this visit; device storage is unavailable.");
    }
  };
  const useAutomaticTheme = () => {
    try { localStorage.removeItem(halloweenStorageKey); } catch {}
    const next = setHalloween(settings, initialHalloweenPreference(new Date()), previousAtmosphere.current);
    previousAtmosphere.current = next.previous;
    setSettings(next.settings);
    setNotice("Seasonal schedule restored. Halloween runs October 24–November 7 in Stanford local time.");
  };
  const visit = (id: string) => {
    api.current?.visit(id);
    resumeSceneFocus.current = true;
    setPanel(null);
    setNotice(`Visiting the virtual ${titleOf(id)} area.`);
  };
  const directions = (id: string) => {
    const found = api.current?.route(id);
    setNotice(
      found
        ? "A route on the source pedestrian network is highlighted. Follow the marked network; short approaches may require free walking."
        : "No connected source route was found from this position. Use Visit entrance or consult the official map.",
    );
    setPanel(null);
    if (found) changeMode("map");
  };
  const buildingGroups = useMemo(
    () => groupBuildings(data?.buildings || []),
    [data],
  );
  const selectedPlace = places.find((p) => p.id === panel),
    character = allCharacters.find((c) => c.id === panel),
    display = panel ? displays[panel] : null,
    buildingGroup = buildingGroups.find((g) =>
      g.parts.some((b) => b.id === panel),
    ),
    building = buildingGroup?.building;
  const sp = solarPosition(settings.season, settings.hour);
  const directory = [
    ...places.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      detail:
        p.interior === "B"
          ? "Enterable · reference reconstruction"
          : "Exterior context",
    })),
    ...buildingGroups
      .filter(
        ({ building: b }) =>
          b.name &&
          !b.name.startsWith("Campus context building") &&
          !Object.values(anchors).some(
            (a) =>
              a.buildingId &&
              sourceBuildingId(a.buildingId) === sourceBuildingId(b.id),
          ),
      )
      .map(({ building: b, parts }) => ({
        id: b.id,
        name: b.name,
        category: "Other buildings",
        detail: `${b.address ? `${b.address} · ` : ""}${parts.length > 1 ? `${parts.length} building footprints · ` : ""}GIS exterior · no interior`,
      })),
  ].filter(
    (p) =>
      (category === "All" ||
        p.category === category ||
        (category === "Enterable buildings" &&
          places.find((a) => a.id === p.id)?.interior === "B")) &&
      `${p.name} ${p.category} ${p.detail}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const hold = (key: string, label: string) => (
    <button
      aria-label={
        key === "arrowleft"
          ? "Turn left"
          : key === "arrowright"
            ? "Turn right"
            : key === "shift"
              ? "Run (hold while moving)"
              : label
      }
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        api.current?.input(key, true, String(e.pointerId));
      }}
      onPointerUp={(e) => api.current?.input(key, false, String(e.pointerId))}
      onPointerCancel={(e) =>
        api.current?.input(key, false, String(e.pointerId))
      }
      onLostPointerCapture={(e) =>
        api.current?.input(key, false, String(e.pointerId))
      }
    >
      {label}
    </button>
  );
  return (
    <section
      className={`${styles.experience} ${!started && settings.halloween ? styles.halloweenWelcomeHost : ""} ${expanded ? styles.expanded : ""} ${photo ? styles.photo : ""} ${character ? styles.conversing : ""}`}
      aria-label="Stanford Virtual Campus explorer"
    >
      <div className={styles.canvas} ref={host} />
      {!started && (
        <div className={`${styles.welcome} ${settings.halloween ? styles.halloweenWelcome : ""}`}>
          <HalloweenWelcome night={settings.halloween} />
          <div className={styles.welcomeCopy}>
            <span className={styles.eyebrow}>
              ASYMMETRI LABS &nbsp; / &nbsp; STANFORD
            </span>
            <h2>
              {settings.halloween ? <>The Farm,<br /><em>after dark.</em></> : <>A world of<br /><em>possibility.</em></>}
            </h2>
            <p>
              {settings.halloween ? "Moonlight over the Quad. Ghosts beneath the palms. Step into a Stanford filled with folklore, heroes and unexpected encounters." : "Follow the palms into the heart of Stanford. Step through sandstone arcades, explore remarkable interiors, and meet the minds of the university."}
            </p>
            <div className={styles.editionSwitch} role="group" aria-label="Choose campus edition">
              <button aria-pressed={!settings.halloween} onClick={() => changeHalloween(false)}>☀ Base edition</button>
              <button aria-pressed={settings.halloween} onClick={() => changeHalloween(true)}>☾ Halloween edition</button>
            </div>
            <button
              className={styles.primary}
              onClick={() => {
                try {
                  setAppearance(
                    normalizeAppearance(
                      JSON.parse(
                        localStorage.getItem(appearanceStorageKey) || "null",
                      ),
                    ),
                  );
                } catch {}
                enableSound();
                setStarted(true);
                setExpanded(true);
              }}
            >
              {settings.halloween ? "Enter the Halloween campus" : "Explore Stanford"} <span>↗</span>
            </button>
            {settings.halloween && <label className={styles.check}><input type="checkbox" checked={settings.halloweenChase} onChange={e=>update({halloweenChase:e.target.checked})} /> Masked pursuer with prop knife</label>}
            <p className={styles.quiet}>
              Walk · Third person · Fly · Map · Desktop & touch
            </p>
          </div>
          <div className={styles.welcomeFoot}>
            STANFORD{" "}
            <span>
              37.43° N · 122.17° W · Independent reconstruction
            </span>
          </div>
        </div>
      )}
      {started && !ready && !error && (
        <div className={styles.loading} role="status">
          <span className={styles.spinner} />
          <h2>Arriving at Stanford</h2>
          <p>{loadingMessage}</p>
        </div>
      )}
      {error && (
        <div className={styles.error} role="alert">
          <h2>Graphics need attention</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              setError("");
              setReady(false);
              setGeneration((g) => g + 1);
            }}
          >
            Restart graphics
          </button>
          <button onClick={() => openPanel("directory")}>Open directory</button>
        </div>
      )}
      {ready && (
        <>
          {!photo && (
            <>
              <div className={styles.topbar}>
                <a href="/labs/gis" aria-label="Return to Asymmetri GIS Apps">
                  a<span>·</span>
                </a>
                <div>
                  <strong>Stanford Virtual Campus</strong>
                  <span>STANFORD, CALIFORNIA</span>
                </div>
                <button
                  onClick={() => openPanel("about")}
                  aria-label="Project information"
                >
                  ⓘ
                </button>
                <button onClick={() => setExpanded((v) => !v)}>
                  {expanded ? "Exit full view" : "Full view"}
                </button>
              </div>
              <div className={styles.location}>
                <span className={styles.dot} />
                <div>
                  <strong>{telemetry?.location || "The Oval"}</strong>
                  <span>
                    {clock(settings.hour)} · {settings.season} ·{" "}
                    {settings.weather === "cloudy"
                      ? "Partly cloudy"
                      : settings.weather}
                    {settings.halloween && " · Halloween"}
                  </span>
                </div>
              </div>
              <div className={styles.tools}>
                {settings.halloween && <button aria-label={settings.sound ? "Mute Halloween sound" : "Enable Halloween sound"} aria-pressed={settings.sound} onClick={()=>{enableSound();update({sound:!settings.sound});}}>{settings.sound ? "♫" : "♩"}<span>{settings.sound ? "Sound on" : "Sound off"}</span></button>}
                <button
                  aria-label="Search campus directory"
                  onClick={() => openPanel("directory")}
                >
                  ⌕ <span>Explore campus</span>
                </button>
                <button
                  aria-label="Change atmosphere and Halloween edition"
                  onClick={() => openPanel("settings")}
                >
                  {settings.halloween ? "☾" : "☼"} <span>Atmosphere</span>
                </button>
                <button
                  onClick={() => {
                    if (mode === "map") changeMode("aerial");
                    setPhoto(true);
                  }}
                  aria-label="Open photo mode"
                >
                  ▣
                </button>
              </div>
              {mode !== "map" &&
                markers.map((m) => (
                  <button
                    key={m.id}
                    className={styles.marker}
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    onClick={() => openPanel(m.id)}
                  >
                    <span>i</span>
                    <strong>{m.name}</strong>
                  </button>
                ))}
              <div className={styles.dock}>
                <div role="group" aria-label="Camera mode">
                  {cameraModes.map(({ id: m, label, icon }) => (
                    <button
                      key={m}
                      aria-pressed={mode === m}
                      onClick={() => changeMode(m)}
                    >
                      <span aria-hidden="true">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => openPanel("help")}
                  aria-label="Movement controls and help"
                >
                  ?
                </button>
              </div>
              <div className={styles.status}>
                <span>
                  {onFoot(mode)
                    ? "WASD move · Shift run · Drag or ←/→ turn · V change view"
                    : mode === "aerial"
                      ? "Drag to orbit · Right-drag to pan · Scroll to zoom"
                      : "North up · Select a campus destination"}
                </span>
                <span>Unofficial · Reference reconstructions</span>
              </div>
              {onFoot(mode) && telemetry?.guidance && (
                <section className={styles.gps} aria-label="Walking guide">
                  <span
                    className={styles.gpsArrow}
                    aria-hidden="true"
                    style={{
                      transform: `rotate(${telemetry.guidance.turn}deg)`,
                    }}
                  >
                    ↑
                  </span>
                  <div>
                    <strong>{telemetry.guidance.label}</strong>
                    <span>
                      {telemetry.guidance.status === "arrived"
                        ? "You’ve arrived"
                        : `${Math.round(telemetry.guidance.distance)} m remaining`}
                    </span>
                    <small>
                      {telemetry.guidance.status === "exit-building"
                        ? "Exit the building to follow the outdoor path"
                        : telemetry.guidance.status === "off-route"
                          ? "Off route · follow the arrow back to the path"
                          : telemetry.guidance.status === "arrived"
                            ? "Explore freely or choose another destination"
                            : "Follow the highlighted walking path"}
                    </small>
                  </div>
                  <button
                    aria-label="Recalculate walking route"
                    onClick={() => {
                      if (!api.current?.recalculate())
                        setNotice(
                          "No connected route from here. Return to the highlighted path.",
                        );
                    }}
                  >
                    ↻
                  </button>
                  <button
                    aria-label="Stop walking guide"
                    onClick={() => api.current?.clearRoute()}
                  >
                    ×
                  </button>
                </section>
              )}
              {onFoot(mode) && (
                <>
                  <span className={styles.reticle} aria-hidden="true">
                    ·
                  </span>
                  <div className={styles.touch}>
                    <div className={styles.dpad}>
                      {hold("w", "↑")}
                      {hold("arrowleft", "↶")}
                      {hold("s", "↓")}
                      {hold("arrowright", "↷")}
                    </div>
                    <div>
                      {hold("shift", "Run")}
                      <button
                        onClick={() =>
                          telemetry?.nearby &&
                          api.current?.interact(telemetry.nearby)
                        }
                      >
                        Interact
                      </button>
                    </div>
                  </div>
                  {telemetry?.nearby && (
                    <button
                      className={styles.interact}
                      onClick={() => api.current?.interact(telemetry.nearby!)}
                    >
                      E &nbsp;{" "}
                      {telemetry.nearbyLabel || (
                        <>
                          {allCharacters.some((c) => c.id === telemetry.nearby)
                            ? "Talk"
                            : `Explore ${titleOf(telemetry.nearby)}`}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </>
          )}
          {mode === "map" && data && (
            <CampusMap
              data={data}
              anchors={anchors}
              pose={telemetry ? [telemetry.pose.x, telemetry.pose.z] : [0, 0]}
              route={route}
              onSelect={openPanel}
              resolve={(p) => api.current?.mapPoint(p) || null}
              onTravel={(p) => {
                if (!api.current?.travelTo(p))
                  setNotice("No safe outdoor path was found near that spot.");
                else {
                  focusScene();
                  setNotice("Moved to the selected outdoor path.");
                }
              }}
              onGuide={(p, name) => {
                if (api.current?.guideTo(p, name)) {
                  api.current.resumeWalk();
                  focusScene();
                  setNotice(
                    "Follow the walking guide and highlighted path. This is virtual campus guidance.",
                  );
                } else
                  setNotice(
                    "No connected walking route was found. Choose a closer path or use Go here.",
                  );
              }}
            />
          )}
          {photo && (
            <div className={styles.photoTools}>
              <span>PHOTO MODE</span>
              <label>
                Time{" "}
                <input
                  aria-label="Photo time"
                  type="range"
                  min="0"
                  max="23.75"
                  step=".25"
                  value={settings.hour}
                  disabled={settings.halloween}
                  onChange={(e) => update({ hour: Number(e.target.value) })}
                />
              </label>
              <select
                aria-label="Photo season"
                value={settings.season}
                disabled={settings.halloween}
                onChange={(e) =>
                  update({ season: e.target.value as Settings["season"] })
                }
              >
                {["spring", "summer", "autumn", "winter"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                aria-label="Photo weather"
                value={settings.weather}
                disabled={settings.halloween}
                onChange={(e) =>
                  update({ weather: e.target.value as Settings["weather"] })
                }
              >
                {[
                  "clear",
                  "cloudy",
                  "overcast",
                  "rain",
                  "fog",
                  ...(settings.season === "winter" ? ["snow"] : []),
                ].map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
              {settings.halloween && (
                <button onClick={() => changeHalloween(false)}>Turn off Halloween</button>
              )}
              <select
                aria-label="Photo camera"
                value={mode}
                onChange={(e) => changeMode(e.target.value as Mode)}
              >
                {cameraModes
                  .filter((m) => m.id !== "map")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => setCaptured(api.current?.capture() || null)}
              >
                Capture PNG
              </button>
              <button
                onClick={() => {
                  setPhoto(false);
                  setCaptured(null);
                }}
              >
                Return to exploring
              </button>
            </div>
          )}
          {photo && captured && (
            <section
              className={styles.photoPreview}
              aria-label="Captured campus photo"
            >
              <Image
                src={captured}
                alt="Captured view of the virtual campus"
                width={1440}
                height={900}
                unoptimized
              />
              <div>
                <a
                  href={captured}
                  download={`stanford-${settings.season}-${settings.weather}.png`}
                >
                  Save PNG
                </a>
                <button onClick={() => setCaptured(null)}>
                  Close photo preview
                </button>
              </div>
            </section>
          )}
        </>
      )}
      {notice && !panel && !photo && (
        <div
          className={`${styles.notice} ${mode === "map" ? styles.mapNotice : ""}`}
          role="status"
        >
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {panel && (
        <div
          className={`${styles.scrim} ${character ? styles.conversationScrim : ""}`}
          onClick={() => setPanel(null)}
        >
          <aside
            className={`${styles.panel} ${character ? styles.conversationPanel : ""}`}
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={
              panel === "directory"
                ? "Campus directory"
                : panel === "settings"
                  ? "Atmosphere settings"
                  : (character ? "Campus conversation" : null) ||
                    (panel === "appearance"
                      ? "Your appearance"
                      : titleOf(panel))
            }
            onClick={(e) => e.stopPropagation()}
          >
            {!character && (
              <div className={styles.panelTop}>
                <span>YOUR CAMPUS FIELD GUIDE</span>
                <button aria-label="Close panel" onClick={() => setPanel(null)}>
                  ×
                </button>
              </div>
            )}
            {panel.startsWith("floor:") && anchors[panel.slice(6)] ? (
              <InteriorGuide id={panel.slice(6)} name={titleOf(panel.slice(6))} anchor={anchors[panel.slice(6)]} pose={telemetry?.pose} />
            ) : panel === "appearance" ? (
              <AppearancePanel
                value={appearance}
                onChange={updateAppearance}
                onPreview={() => {
                  changeMode("third");
                  setPanel(null);
                }}
              />
            ) : panel === "profile" ? (
              <ProfilePanel onChange={refreshCommunity} />
            ) : panel === "directory" ? (
              <>
                <h2>Find your place.</h2>
                <button onClick={() => setPanel("profile")}>Create or manage my character</button>
                <button onClick={() => setPanel("appearance")}>
                  Customize my appearance
                </button>
                <p>
                  Search campus places and enterable buildings. Meet people as
                  you explore.
                </p>
                <label className={styles.search}>
                  Search campus
                  <input
                    autoFocus
                    type="search"
                    placeholder="Try Hoover, Gates, Green Library or Maples"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Directory category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {[
                    "All",
                    "Enterable buildings",
                    "Residences",
                    "Athletics",
                    "Faculties",
                    "Student life",
                    "Lecture halls",
                    "Landmarks",
                    "Libraries",
                    "Other buildings",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className={styles.directory}>
                  {directory.slice(0, 50).map((p) => (
                    <button key={p.id} onClick={() => setPanel(p.id)}>
                      <span>{p.category}</span>
                      <strong>{p.name}</strong>
                      <small>{p.detail}</small>
                      <b aria-hidden="true">↗</b>
                    </button>
                  ))}
                </div>
                {!directory.length && (
                  <p>No matching places. Try a building name or faculty.</p>
                )}
                <small>
                  {directory.length} matches
                  {directory.length > 50 ? " · refine search to show more" : ""}
                </small>
              </>
            ) : panel === "settings" ? (
              <>
                <h2>A different light.</h2>
                <p>
                  Choose a season and a Stanford day. These are simulated
                  conditions.
                </p>
                <fieldset>
                  <legend>Halloween edition</legend>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={settings.halloween}
                      aria-describedby="stanford-halloween-description"
                      onChange={(e) => changeHalloween(e.target.checked)}
                    />
                    Halloween campus
                  </label>
                  <p id="stanford-halloween-description">
                    {settings.halloween
                      ? "An autumn evening with a full moon, haunted decorations and 22 creature and costume types, plus 24 comic, manga and robot visitors. Turn it off to restore your season, weather and time."
                      : "Explore a moonlit campus with hopping jiangshi, monsters, Spider-Man, Superman, Batman, manga characters, robots and mecha."}
                  </p>
                  <small>Automatic season: October 24–November 7, Stanford time. Seasonal choices expire on November 8; either edition can also be selected year-round.</small>
                  <button onClick={useAutomaticTheme}>Use automatic holiday schedule</button>
                  <small>Christmas will use December 1–31 when available. Until then, December opens the base campus.</small>
                </fieldset>
                <label className={styles.check}>
                  <input type="checkbox" checked={settings.halloweenChase} disabled={!settings.halloween} onChange={e=>update({halloweenChase:e.target.checked})} />
                  Masked pursuer · Friday the 13th style
                </label>
                <p className={styles.quiet}>An optional fictional character follows on campus paths, stops at a distance, and waits outside buildings. No attacks or damage.</p>
                <fieldset>
                  <legend>Halloween soundscape</legend>
                  <label className={styles.check}><input type="checkbox" checked={settings.sound} onChange={e=>{enableSound();update({sound:e.target.checked});}} /> Eerie music, wolf howls and nearby ghost voices</label>
                  <label className={styles.slider}>Volume <strong>{Math.round(settings.soundVolume*100)}%</strong><input aria-label="Soundscape volume" type="range" min="0" max="1" step=".05" value={settings.soundVolume} onChange={e=>{enableSound();update({soundVolume:Number(e.target.value)});}} /></label>
                  <small>Original synthesized sound. Ghost cries and screams are spatial and grow with proximity. Sound fades out in the base edition.</small>
                </fieldset>
                <fieldset disabled={settings.halloween}>
                  <legend>Season</legend>
                  <div className={styles.options}>
                    {(["spring", "summer", "autumn", "winter"] as const).map(
                      (s) => (
                        <button
                          key={s}
                          aria-pressed={settings.season === s}
                          onClick={() => update({ season: s })}
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                </fieldset>
                <label className={styles.slider}>
                  Time of day <strong>{clock(settings.hour)}</strong>
                  <input
                    type="range"
                    min="0"
                    max="23.75"
                    step=".25"
                    value={settings.hour}
                    disabled={settings.halloween}
                    onChange={(e) => update({ hour: Number(e.target.value) })}
                  />
                </label>
                <small>
                  {settings.halloween ? "Halloween evening · Moonlit seasonal scene" : <>
                    {sp.date} · Stanford local time<br />
                    Approximate sunrise {clock(sp.sunrise)} · sunset {clock(sp.sunset)}
                  </>}
                </small>
                <div className={styles.presets}>
                  {[
                    ["Sunrise", sp.sunrise + 0.3],
                    ["Noon", 12],
                    ["Golden hour", sp.sunset - 0.7],
                    ["Night", 22],
                  ].map(([s, h]) => (
                    <button key={s} disabled={settings.halloween} onClick={() => update({ hour: Number(h) })}>
                      {s}
                    </button>
                  ))}
                </div>
                <label>
                  Weather
                  <select
                    value={settings.weather}
                    disabled={settings.halloween}
                    onChange={(e) =>
                      update({ weather: e.target.value as Settings["weather"] })
                    }
                  >
                    {[
                      "clear",
                      "cloudy",
                      "overcast",
                      "rain",
                      "fog",
                      ...(settings.season === "winter" ? ["snow"] : []),
                    ].map((w) => (
                      <option key={w} value={w}>
                        {w === "cloudy"
                          ? "Partly cloudy"
                          : w === "snow"
                            ? "Snowfall winter"
                            : w === "rain" && settings.season === "winter"
                              ? "Typical rainy winter"
                              : w}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Quality
                  <select
                    value={settings.quality}
                    onChange={(e) =>
                      update({ quality: e.target.value as Settings["quality"] })
                    }
                  >
                    {["auto", "ultra", "high", "medium", "low"].map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={settings.markers}
                    onChange={(e) => update({ markers: e.target.checked })}
                  />
                  Contextual information markers
                </label>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={settings.population}
                    onChange={(e) => update({ population: e.target.checked })}
                  />
                  Simulated campus visitors
                </label>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) =>
                      update({ reducedMotion: e.target.checked })
                    }
                  />
                  Reduce animated movement
                </label>
                <details>
                  <summary>Rendering observations</summary>
                  <p>
                    {telemetry?.fps || "—"} FPS in this browser ·{" "}
                    {telemetry?.draws || 0} draw calls ·{" "}
                    {telemetry?.triangles.toLocaleString() || 0} triangles. This
                    is an observation, not a device certification.
                    {telemetry?.audio && <> Sound: {telemetry.audio.state} · {telemetry.audio.events} atmospheric cues.</>}
                  </p>
                </details>
              </>
            ) : character ? (
              <Conversation
                key={character.id}
                character={character}
                state={histories[character.id] || emptyConversation()}
                onChange={(state) =>
                  setHistories((history) => ({
                    ...history,
                    [character.id]: state,
                  }))
                }
                onReact={(gesture) => api.current?.react(character.id, gesture)}
                onClose={() => {
                  resumeSceneFocus.current = true;
                  setPanel(null);
                }}
              />
            ) : selectedPlace ? (
              <>
                <span className={styles.badge}>{selectedPlace.category}</span>
                <h2>{selectedPlace.name}</h2>
                {selectedPlace.interior === "B" && <button onClick={()=>setPanel(`floor:${selectedPlace.id}`)}>Open building floor guide</button>}
                <p className={styles.address}>{selectedPlace.address}</p>
                <p className={styles.lead}>{selectedPlace.description}</p>
                <div className={styles.actions}>
                  <button
                    className={styles.primary}
                    disabled={!ready}
                    onClick={() => visit(selectedPlace.id)}
                  >
                    Visit{" "}
                    {selectedPlace.interior === "B" ? "entrance" : "location"}{" "}
                    ↗
                  </button>
                  <button
                    disabled={!ready}
                    onClick={() => directions(selectedPlace.id)}
                  >
                    Walking route
                  </button>
                  <button
                    onClick={() => {
                      setPanel(null);
                      changeMode("map");
                    }}
                  >
                    Show on campus map
                  </button>
                </div>
                <h3>
                  {selectedPlace.interior === "B"
                    ? "Walk inside the reconstruction"
                    : "Exterior coverage"}
                </h3>
                <p>{selectedPlace.reconstruction}</p>
                {Object.entries(displays)
                  .filter(([, d]) => d.building === selectedPlace.id)
                  .map(([id, d]) => (
                    <button
                      className={styles.displayLink}
                      key={id}
                      onClick={() => setPanel(id)}
                    >
                      {d.name} ↗
                    </button>
                  ))}
                <Links links={selectedPlace.links} />
                <small>
                  Information checked {selectedPlace.verified}. {unofficial}
                </small>
              </>
            ) : display ? (
              <>
                <span className={styles.badge}>CAMPUS DISPLAY</span>
                <h2>{display.name}</h2>
                <p className={styles.lead}>{display.description}</p>
                <Links links={display.links} />
                <button onClick={() => setPanel(display.building)}>
                  About {titleOf(display.building)}
                </button>
              </>
            ) : building ? (
              <>
                <span className={styles.badge}>
                  GIS BUILDING · EXTERIOR ONLY
                </span>
                <h2>{building.name}</h2>
                {building.address && <p>{building.address}</p>}
                {buildingGroup && buildingGroup.parts.length > 1 && (
                  <p>
                    {buildingGroup.parts.length} separate footprints belong to
                    this source building group. They share one directory entry;
                    each remains visible on the campus map.
                  </p>
                )}
                <p>
                  Source footprint from OpenStreetMap records. This
                  background building uses simplified geometry and an
                  illustrative height where no licensed height measurement is
                  available.
                </p>
                <button onClick={() => visit(building.id)}>
                  Visit nearby pedestrian network
                </button>
                <Links links={[sources.map, sources.geo]} />
              </>
            ) : panel === "help" ? (
              <>
                <h2>Take your time.</h2>
                <p>
                  Explore freely. There are no scores, missions or required
                  objectives.
                </p>
                <dl className={styles.help}>
                  <dt>Move</dt>
                  <dd>
                    W/S move forward/back; A/D move sideways. Hold Shift to run
                    (5.5 m/s).
                  </dd>
                  <dt>Turn and look</dt>
                  <dd>
                    Click and hold the scene, then drag left/right to turn or
                    up/down to look. Left/right arrow keys also turn; up/down
                    arrows move. Mouse-look lock lets you turn without holding a
                    button.
                  </dd>
                  <dt>First / third person</dt>
                  <dd>
                    Select a labelled camera button or press V. Third person
                    follows your visible visitor; the camera moves closer and
                    hides the visitor in tight spaces. Your position stays the
                    same.
                  </dd>
                  <dt>Interact</dt>
                  <dd>
                    Press E near an information point or guide; click a building
                    or display.
                  </dd>
                  <dt>Map</dt>
                  <dd>
                    Press M or select Map. Click or tap a spot, then Go here for
                    immediate travel or Guide me for a walking route. Map arrow
                    keys move a selection; Enter marks it. Switching views
                    preserves your walking position.
                  </dd>
                  <dt>Aerial</dt>
                  <dd>
                    Drag to orbit, right-drag to pan, scroll or pinch to zoom.
                  </dd>
                  <dt>Touch</dt>
                  <dd>
                    Hold ↑/↓ to move, ↶/↷ to turn, and Run while moving to run.
                    You can also drag the scene to look.
                  </dd>
                  <dt>Release</dt>
                  <dd>
                    Esc releases the pointer or closes an information panel.
                  </dd>
                </dl>
                <button
                  onClick={() => {
                    setPanel(null);
                    api.current?.lock();
                  }}
                >
                  Enable mouse-look lock
                </button>
                <button onClick={() => visit("arrival")}>
                  Return to Memorial Court
                </button>
              </>
            ) : (
              <>
                <span className={styles.badge}>ASYMMETRI LABS · GIS APPS</span>
                <h2>A campus, in progress.</h2>
                <p className={styles.lead}>{unofficial}</p>
                <p>Walk through The Farm, explore the public-space reconstructions, and meet source-linked faculty, varsity athletes and alumni.</p>
                <h3>Architecture and interiors</h3>
                <p>Recognizable landmarks use original models informed by public floor maps, building descriptions and photographs. Selected public floors, lecture spaces, and a representative residence suite are enterable. Interior dimensions, furnishings and circulation remain reference interpretations, not measured as-built plans. Campus terrain uses a flat datum.</p>
                <h3>Sources and rights</h3>
                <p>Map data © OpenStreetMap contributors, ODbL. University sources inform building features and public academic facts. Original procedural geometry and generic avatars; no portrait textures or voice imitation.</p>
                <Links links={[sources.geo, sources.map]} />
                <a
                  href={`${version}/manifest.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Data provenance, hashes and reconstruction notes ↗
                </a>
                <p>All walking paths, dialogue and appearances are simulated. Public profiles support only the facts cited in each encounter. No real whereabouts are tracked. Optional community profiles publish only the text participants submit about themselves. Create, edit, recover, report or remove a character through the same controls as UBC.</p>
              </>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
