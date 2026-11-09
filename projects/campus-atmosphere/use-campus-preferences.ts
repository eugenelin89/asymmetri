"use client";

import { useEffect, useRef, useState } from "react";
import type { Quality } from "../ubc/types";
import type { Campus } from "./calendar";

export type CampusPreferences = {
  quality: Quality;
  markers: boolean;
  population: boolean;
  reducedMotion: boolean;
  halloweenChase: boolean;
  sound: boolean;
  volume: number;
};

function defaultPreferences(volume: number): CampusPreferences {
  return { quality: "auto", markers: true, population: true, reducedMotion: false, halloweenChase: true, sound: true, volume };
}

function readRecord(key: string): Record<string, unknown> {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  } catch { /* Device storage is optional. */ }
  return {};
}

export function useCampusPreferences(campus: Campus, defaultVolume: number) {
  const key = `${campus}-explorer-preferences-v1`;
  const [preferences, setPreferences] = useState(() => defaultPreferences(defaultVolume));
  const [ready, setReady] = useState(false);
  const explicitMotion = useRef(false);
  useEffect(() => {
    const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (!explicitMotion.current) setPreferences(previous => ({ ...previous, reducedMotion: systemMotion.matches }));
    };
    systemMotion.addEventListener("change", syncMotion);
    const syncPreferences = () => {
      const saved = readRecord(key);
      const legacy = campus === "cwru" ? readRecord("cwru-halloween-audio-v1") : {};
      const prefs = defaultPreferences(defaultVolume);
      explicitMotion.current = typeof saved.reducedMotion === "boolean";
      prefs.reducedMotion = systemMotion.matches;
      for (const field of ["markers", "population", "reducedMotion", "halloweenChase"] as const) {
        if (typeof saved[field] === "boolean") prefs[field] = saved[field];
      }
      const sound = saved.sound ?? legacy.halloweenSound;
      const volume = saved.volume ?? legacy.halloweenVolume;
      if (typeof sound === "boolean") prefs.sound = sound;
      if (typeof volume === "number" && Number.isFinite(volume)) prefs.volume = Math.min(1, Math.max(0, volume));
      if (["auto", "ultra", "high", "medium", "low"].includes(String(saved.quality))) prefs.quality = saved.quality as Quality;
      setPreferences(prefs);
      setReady(true);
    };
    const storage = (event: StorageEvent) => {
      if (event.storageArea === localStorage && (!event.key || event.key === key)) syncPreferences();
    };
    window.addEventListener("storage", storage);
    const frame = requestAnimationFrame(syncPreferences);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", storage);
      systemMotion.removeEventListener("change", syncMotion);
    };
  }, [campus, defaultVolume, key]);

  const update = (patch: Partial<CampusPreferences>) => {
    if (patch.reducedMotion !== undefined) explicitMotion.current = true;
    setPreferences(previous => ({ ...previous, ...patch }));
    try {
      localStorage.setItem(key, JSON.stringify({ ...readRecord(key), ...patch }));
    } catch { /* The choice still applies to this visit. */ }
  };
  return { ready, preferences, update };
}
