"use client";

import { useEffect, useMemo, useState } from "react";
import { actualSun, campusDate, choiceKey, persistentChoice, scheduledEdition, stagedSun,
  type Campus, type Choice, type Edition, type Scene } from "./calendar";
import type { WeatherReport } from "./weather-types";

const maxObservationAge = 90 * 60_000;
const refreshInterval = 15 * 60_000;
const initialTime = new Date(0);

function readChoice(campus: Campus) {
  try { return localStorage.getItem(choiceKey(campus)); } catch { return null; }
}

export function useCampusVisit(campus: Campus) {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(initialTime);
  const [stored, setStored] = useState<string | null>(null);
  const [regularThisVisit, setRegularThisVisit] = useState(false);
  const [replay, setReplay] = useState<Exclude<Edition, "regular"> | null>(null);
  const [staged, setStaged] = useState<Scene | null>(null);
  const [report, setReport] = useState<WeatherReport | null>(null);

  useEffect(() => {
    let disposed = false;
    let request: AbortController | null = null;
    let nextCheck = 0, expires = 0;
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      clearTimeout(timer);
      if (disposed || document.hidden) return;
      const time = Date.now();
      setNow(new Date(time));
      if (!request && time >= nextCheck) {
        const controller = new AbortController();
        request = controller;
        nextCheck = time + refreshInterval;
        void fetch(`/labs/campus-weather-api/${campus}`, { signal: controller.signal, cache: "no-store" })
          .then(async response => {
            if (!response.ok) throw new Error("Station request failed");
            const result: WeatherReport = await response.json();
            if (disposed || controller.signal.aborted) return;
            expires = result.observation ? Date.parse(result.observation.observedAt) + maxObservationAge + 1 : 0;
            const due = Date.parse(result.nextCheckAt);
            if (Number.isFinite(due)) nextCheck = Math.max(Date.now() + 1000, due);
            setReport(result);
          })
          .catch(() => {
            // The original observation timestamp still governs a local fallback.
            if (!disposed && !controller.signal.aborted) setReport(last => last && { ...last, cached: true });
          })
          .finally(() => {
            if (request === controller) { request = null; tick(); }
          });
      }
      const nextMinute = time + 60_000 - time % 60_000;
      const wakeAt = Math.min(nextMinute, request ? Infinity : nextCheck, expires > time ? expires : Infinity);
      timer = setTimeout(tick, Math.max(1, wakeAt - time));
    }
    function start() {
      setStored(readChoice(campus));
      setRegularThisVisit(false);
      setReplay(null);
      setStaged(null);
      setReady(true);
      tick();
    }
    const pageShow = (event: PageTransitionEvent) => { if (event.persisted) start(); else tick(); };
    const pageHide = () => { clearTimeout(timer); request?.abort(); request = null; };
    const storage = (event: StorageEvent) => {
      if (!event.key || event.key === choiceKey(campus)) setStored(readChoice(campus));
    };
    start();
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("pageshow", pageShow);
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("storage", storage);
    return () => {
      disposed = true;
      pageHide();
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("pagehide", pageHide);
      window.removeEventListener("storage", storage);
    };
  }, [campus]);

  const local = useMemo(() => campusDate(campus, now), [campus, now]);
  const choice: Choice = regularThisVisit ? "regular" : persistentChoice(stored, local.date);
  const edition = replay ?? (choice === "regular" ? "regular" : scheduledEdition(local.date));
  const age = report?.observation ? +now - Date.parse(report.observation.observedAt) : Infinity;
  const observation = age >= 0 && age <= maxObservationAge ? report?.observation ?? null : null;
  const atmosphere = useMemo(() => staged ? {
    ...staged, live: false, solar: stagedSun(campus, staged.season, staged.hour), fog: staged.weather === "fog",
    intensity: 0.6, windKph: 0,
  } : {
    season: local.season, hour: local.hour, live: true, solar: actualSun(campus, local),
    weather: observation?.weather ?? "neutral", intensity: observation?.intensity ?? 0,
    windKph: observation?.windKph ?? 0, fog: observation?.fog || observation?.weather === "fog",
  }, [campus, local, observation, staged]);

  function select(value: Edition | "automatic") {
    const selectedAt = new Date();
    setNow(selectedAt);
    if (value === "halloween" || value === "christmas") { setReplay(value); return; }
    setReplay(null);
    const visitOnly = value === "regular" && campusDate(campus, selectedAt).date > "2026-12-31";
    setRegularThisVisit(visitOnly);
    if (visitOnly) return;
    const record = value === "regular" ? "regular-through-2026" : null;
    try {
      if (record) localStorage.setItem(choiceKey(campus), record);
      else localStorage.removeItem(choiceKey(campus));
    } catch { /* Private browsing still supports this visit. */ }
    setStored(record);
  }
  function stage(patch: Partial<Scene>) {
    setStaged(previous => ({ hour: atmosphere.hour, season: atmosphere.season, weather: atmosphere.weather, ...previous, ...patch }));
  }
  return { ready, now, edition, choice, replay, select, endReplay: () => { setNow(new Date()); setReplay(null); },
    live: !staged, stage, returnLive: () => { setNow(new Date()); setStaged(null); }, atmosphere, observation, cached: !!report?.cached };
}
