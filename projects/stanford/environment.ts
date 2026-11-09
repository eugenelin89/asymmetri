import type { Season, Settings } from "./types";
import { stagedSun } from "../campus-atmosphere/calendar";
export { clock } from "../campus-atmosphere/calendar";

export const defaults: Settings = {
  season: "autumn",
  weather: "clear",
  hour: 15,
  quality: "auto",
  markers: true,
  population: true,
  reducedMotion: false,
  halloween: false,
  christmas: false,
  halloweenChase: true,
  sound: true,
  soundVolume: .45,
};

export const solarPosition = (season: Season, hour: number) => stagedSun("stanford", season, hour);

export function normalizeSettings(settings: Settings): Settings {
  const volume = settings.soundVolume;
  return {
    ...settings,
    hour: Math.max(0, Math.min(23.999999, settings.hour)),
    soundVolume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : defaults.soundVolume,
  };
}
