"use client";
import { PlaySession, CampusPrivacyPreferences } from "../campus-analytics/PlaySession";
import { applyCampusAnchors } from "./layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
import { activeEdition, campusEditions, editionStorageKey, readEditionChoice, serializeEditionChoice, type EditionChoice } from "./editions";
import { audioPreferenceKey, createHalloweenAudio } from "./halloween-audio";
import { ResidenceGuide } from "./ResidenceGuide";
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
import { ProfilePanel } from "./community/ProfilePanel";
import { profileCharacter, type PublicProfile } from "./community/model";
import { Conversation } from "./ConversationPanel";
import { emptyConversation, type ConversationState } from "./conversation";
import { groupBuildings, sourceBuildingId } from "./building-directory";

const version = "/cwru/v0.1-2026-10-31";
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
  const playRegion = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null),
    api = useRef<CampusAPI | null>(null),
    panelRef = useRef<HTMLElement>(null),
    opener = useRef<HTMLElement | null>(null),
    resumeSceneFocus = useRef(false),
    previousPanel = useRef<string | null>(null);
  const previousAtmosphere = useRef<Atmosphere | null>(null);
  const soundscape = useRef<ReturnType<typeof createHalloweenAudio> | null>(null);
  useEffect(()=>()=>{soundscape.current?.dispose();soundscape.current=null;},[]);
  const unlockSound = () => {
    soundscape.current ||= createHalloweenAudio();
    return soundscape.current.unlock().then(ok=>{if(!ok)setNotice("Audio could not start. Try the sound control again in this browser.");return ok;});
  };
  const focusScene = useCallback(() => {
    host.current?.querySelector("canvas")?.focus({ preventScroll: true });
  }, []);
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
  const [editionChoice, setEditionChoice] = useState<EditionChoice | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let stored: string | null = null, legacy: string | null = null;
      try { stored = localStorage.getItem(editionStorageKey); legacy = localStorage.getItem(halloweenStorageKey); } catch {}
      setEditionChoice(readEditionChoice(stored, legacy));
      try {
        const audio=JSON.parse(localStorage.getItem(audioPreferenceKey)||"null");
        if(audio&&typeof audio.halloweenSound==='boolean'&&typeof audio.halloweenVolume==='number')setSettings(s=>normalizeSettings({...s,halloweenSound:audio.halloweenSound,halloweenVolume:audio.halloweenVolume}));
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!editionChoice) return;
    const synchronize = () => {
      const enabled = campusEditions[activeEdition(editionChoice, new Date())].halloween;
      if (settings.halloween === enabled) return;
      const next = setHalloween(settings, enabled, previousAtmosphere.current);
      previousAtmosphere.current = next.previous;
      setSettings(next.settings);
    };
    const frame = requestAnimationFrame(synchronize);
    const timer = setInterval(synchronize, 30000);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  }, [editionChoice, settings]);
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
  const communityCharacters = useMemo(
    () => community.map(profileCharacter),
    [community],
  );
  const allCharacters = useMemo(
    () => [...characters, ...communityCharacters],
    [communityCharacters],
  );
  const refreshCommunity = useCallback(() => {
    void fetch("/labs/cwru/community-api/community", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (v?.profiles) setCommunity(v.profiles);
      })
      .catch(() => {
        /* The campus remains usable if profiles are unavailable. */
      });
  }, []);
  useEffect(() => {
    if (!started) return;
    refreshCommunity();
    const timer = setInterval(refreshCommunity, 60000);
    return () => clearInterval(timer);
  }, [started, refreshCommunity]);
  useEffect(() => {
    if (ready) api.current?.community(communityCharacters);
  }, [ready, communityCharacters]);
  const openPanel = useCallback(
    (id: string) => {
      opener.current = document.activeElement as HTMLElement;
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
      .then(([module, world, locations]) => {
        if (cancelled || !host.current) return;
        const expandedWorld = world;
        setData(world);
        Object.assign(locations, applyCampusAnchors(locations));
        setAnchors(locations);
        engine = module.createCampus(
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
          soundscape.current || undefined,
        );
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
    const dismissed = previousPanel.current !== null && panel === null;
    previousPanel.current = panel;
    if (!panel) {
      const resume = resumeSceneFocus.current;
      resumeSceneFocus.current = false;
      if (dismissed || resume) {
        if (mode === "map" && !resume) opener.current?.focus?.();
        else focusScene();
      }
      return;
    }
    panelRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  }, [panel, ready, allCharacters, focusScene, mode]);
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
  const changeEdition = (choice: EditionChoice) => {
    if (campusEditions[activeEdition(choice,new Date())].halloween && settings.halloweenSound) unlockSound();
    setEditionChoice(choice);
    const next = setHalloween(settings, campusEditions[activeEdition(choice, new Date())].halloween, previousAtmosphere.current);
    previousAtmosphere.current = next.previous;
    setSettings(next.settings);
    try { localStorage.setItem(editionStorageKey, serializeEditionChoice(choice)); }
    catch { setNotice("Edition changed for this visit; device storage is unavailable."); }
  };
  const updateAudio = (patch: Partial<Pick<Settings,"halloweenSound"|"halloweenVolume">>) => {
    const next=normalizeSettings({...settings,...patch});
    if(next.halloweenSound)unlockSound();
    soundscape.current?.configure(next);setSettings(next);
    try {localStorage.setItem(audioPreferenceKey,JSON.stringify({halloweenSound:next.halloweenSound,halloweenVolume:next.halloweenVolume}));}catch{}
  };
  const changeHalloween = (enabled: boolean) => changeEdition(enabled ? "halloween" : "regular");

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
              ? "Run: hold this button and a movement arrow together"
              : label
      }
      className={key === "shift" ? styles.runButton : undefined}
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
      {key === "shift" ? <><span>Hold to</span><strong>RUN</strong></> : label}
    </button>
  );
  return (
    <section
      className={`${styles.experience} ${!started ? styles.welcomeHost : ""} ${!started && settings.halloween ? styles.halloweenWelcomeHost : ""} ${expanded ? styles.expanded : ""} ${photo ? styles.photo : ""} ${character ? styles.conversing : ""}`}
      ref={playRegion}
      aria-label="CWRU Virtual Campus explorer"
    >
      <PlaySession campus="cwru" playing={started && ready && !error} regionRef={playRegion} />
      <div className={styles.canvas} ref={host} />
      {!started && (
        <div className={`${styles.welcome} ${settings.halloween ? styles.halloweenWelcome : ""}`}>
          {settings.halloween ? <HalloweenWelcome /> : <div className={styles.welcomeMap} aria-hidden="true">
            <span>UNIVERSITY CIRCLE</span>
            <Image
              src="/cwru/preview-map.svg"
              alt=""
              width={640}
              height={800}
              loading="eager"
              unoptimized
            />
            <small>41.50° N · 81.61° W</small>
          </div>}
          <div className={styles.welcomeCopy}>
            <span className={styles.eyebrow}>
              ASYMMETRI &nbsp; / &nbsp; FIELD NOTES 03
            </span>
            <h2>
              {settings.halloween ? <>A campus after<br />the witching hour.</> : <>Think beyond<br />the possible.</>}
            </h2>
            <p>
              Begin at the Kelvin Smith Library oval. Step inside,
              meet a virtual guide, and take your time.
            </p>
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
                soundscape.current ||= createHalloweenAudio();
                if(settings.halloween && settings.halloweenSound)unlockSound();
                setStarted(true);
                setExpanded(true);
              }}
            >
              Start exploring <span>↗</span>
            </button>
            <div className={styles.runInstructions}>
              <strong>Want to move faster?</strong>
              <span><kbd>Shift</kbd> + <kbd>W A S D</kbd> <b>Hold to run</b></span>
              <small>On touch: hold <b>Run</b> and a movement arrow together.</small>
            </div>
            <button className={styles.editionSwitch} onClick={() => changeHalloween(!settings.halloween)}>
              {settings.halloween ? "Prefer daylight? Explore the regular campus" : "Explore the Halloween edition"}
            </button>
            {settings.halloween && <label className={styles.welcomeChase}>
              <input type="checkbox" checked={settings.halloweenChase} onChange={e=>update({halloweenChase:e.target.checked})} />
              Hockey-masked pursuer <span>Run to get away · switch off anytime</span>
            </label>}
            <p className={styles.quiet}>
              Desktop & touch · No account required
            </p>
          </div>
          <div className={styles.welcomeFoot}>
            CASE WESTERN RESERVE{" "}
            <span>
              Independent research preview · Reconstructed architecture
            </span>
          </div>
        </div>
      )}
      {started && !ready && !error && (
        <div className={styles.loading} role="status">
          <span className={styles.spinner} />
          <h2>Arriving at Case Western</h2>
          <p>Loading campus geography and architectural models…</p>
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
                  <strong>CWRU Virtual Campus</strong>
                  <span>CLEVELAND, OHIO</span>
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
                  <strong>{telemetry?.location || "Kelvin Smith Library"}</strong>
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
                {telemetry && anchors.clarke && Math.hypot(telemetry.pose.x-anchors.clarke.x,telemetry.pose.z-anchors.clarke.z)<90 &&
                  <button aria-label="Open residence floor guide" onClick={()=>openPanel("residence-floor")}>▤ <span>Residence guide</span></button>}
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
                {settings.halloween && <button aria-label={settings.halloweenSound ? "Mute Halloween soundscape" : "Enable Halloween soundscape"} aria-pressed={settings.halloweenSound} onClick={()=>updateAudio({halloweenSound:!settings.halloweenSound})}>♫ <span>{settings.halloweenSound ? "Sound on" : "Sound off"}</span></button>}
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
                <span className={onFoot(mode) ? styles.movementHint : undefined}>
                  {onFoot(mode)
                    ? <><span><kbd>W A S D</kbd> Walk</span><strong>Hold <kbd>Shift</kbd> to run</strong><span>Drag or ←/→ to turn</span></>
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
                  download={`cwru-${settings.season}-${settings.weather}.png`}
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
            {panel === "residence-floor" ? <ResidenceGuide pose={telemetry?.pose} anchor={anchors.clarke} close={()=>setPanel(null)} /> : panel === "appearance" ? (
              <AppearancePanel
                value={appearance}
                onChange={updateAppearance}
                onPreview={() => {
                  changeMode("third");
                  setPanel(null);
                }}
              />
            ) : panel === "profile" ? (
              <ProfilePanel onChange={refreshCommunity} appearance={appearance} />
            ) : panel === "directory" ? (
              <>
                <h2>Find your place.</h2>
                <button onClick={() => setPanel("appearance")}>
                  Customize my appearance
                </button>
                <button onClick={() => setPanel("profile")}>Create or manage my character</button>
                <p>
                  Search campus places and enterable buildings. Meet people as
                  you explore.
                </p>
                <label className={styles.search}>
                  Search campus
                  <input
                    autoFocus
                    type="search"
                    placeholder="Try Kelvin Smith, Strosacker or Clarke"
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
                  Choose a season and a Cleveland day. These are simulated
                  conditions.
                </p>
                <fieldset>
                  <legend>Campus edition</legend>
                  <label>Theme
                    <select value={editionChoice || "automatic"} onChange={e=>changeEdition(e.target.value as EditionChoice)}>
                      <option value="automatic">Automatic seasonal theme</option>
                      {Object.entries(campusEditions).map(([id,edition])=><option key={id} value={id} disabled={!edition.available}>{edition.label}</option>)}
                    </select>
                  </label>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={settings.halloween}
                      aria-describedby="cwru-halloween-description"
                      onChange={(e) => changeHalloween(e.target.checked)}
                    />
                    Halloween campus
                  </label>
                  <p id="cwru-halloween-description">
                    {settings.halloween
                      ? "An autumn evening with a full moon, haunted decorations and 16 roaming creature and costume types. Turn it off to restore your season, weather and time."
                      : "Explore a moonlit campus with hopping jiangshi, monsters, comic heroes, manga-inspired costumes, robots and mecha."}
                  </p>
                  <small>Automatic uses Cleveland dates: Halloween October 24–November 7; Christmas December 1–31 once available. Other dates use the regular campus. Manual themes stay selected until you change them. Your choice is remembered on this device.</small>
                </fieldset>
                <label className={styles.check}>
                  <input type="checkbox" checked={settings.halloweenChase} disabled={!settings.halloween} onChange={e=>update({halloweenChase:e.target.checked})} />
                  Friday the 13th–inspired pursuer
                </label>
                <p className={styles.quiet}>An optional hockey-masked character carrying a prop knife follows on campus paths. Hold Shift or Run to get away; buildings provide shelter. No attacks or damage.</p>
                <fieldset>
                  <legend>Halloween soundscape</legend>
                  <label className={styles.check}><input type="checkbox" checked={settings.halloweenSound} onChange={e=>updateAudio({halloweenSound:e.target.checked})}/>Scary music and creature sounds</label>
                  <label>Sound volume · {Math.round(settings.halloweenVolume*100)}%
                    <input aria-label="Halloween sound volume" type="range" min="0" max="100" step="1" value={Math.round(settings.halloweenVolume*100)} onChange={e=>updateAudio({halloweenVolume:Number(e.target.value)/100})}/>
                  </label>
                  <p className={styles.quiet}>An original eerie score, distant wolf howls, and nearby ghost cries and screams. Direction and loudness follow your position. Sound stops in the regular campus or when this tab is hidden.</p>
                  <button disabled={!settings.halloween||!settings.halloweenSound} onClick={()=>{void unlockSound().then(ok=>{if(ok){soundscape.current?.configure(settings);soundscape.current?.preview();}});}}>Preview wolf howl</button>
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
                    {sp.date} · Cleveland local time<br />
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
                    {settings.halloween && <> Audio: {telemetry?.audioState || "not started"}.</>}
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
                {selectedPlace.id === "clarke" && <><button onClick={()=>setPanel("residence-floor")}>Open residence floor guide</button><p>Enter the lobby, then take the stairs or call and ride the lift. Open bedroom and bathroom doors with E or tap on the demonstration floor.</p></>}
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
                    W/S move forward/back; A/D move sideways.
                  </dd>
                  <dt>Run</dt>
                  <dd><strong>Hold Shift while moving with WASD.</strong> Release Shift to walk again. On touch, hold Run and a movement arrow together.</dd>
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
                  Return to Kelvin Smith Library
                </button>
              </>
            ) : (
              <>
                <span className={styles.badge}>ASYMMETRI LABS · GIS APPS</span>
                <h2>A campus, in progress.</h2>
                <p className={styles.lead}>{unofficial}</p>
                <p>Walk through University Circle, explore the public-space reconstructions, and meet source-linked faculty, athletes and students.</p>
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
                <p>All walking paths, dialogue and appearances are simulated. Research characters support only the facts cited in each encounter. Optional community characters publish the information participants submit about themselves, with owner editing, recovery and removal. LinkedIn student affiliations come from public search excerpts and may be stale. No real whereabouts are tracked; play-data collection is described below.</p>
                <CampusPrivacyPreferences compact />
              </>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
