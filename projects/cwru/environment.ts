import type { Season, Settings } from "./types";
export const defaults: Settings = {
  season: "autumn",
  weather: "clear",
  hour: 15,
  quality: "auto",
  markers: true,
  population: true,
  reducedMotion: false,
  halloween: false,
  halloweenChase: true,
  halloweenSound: true,
  halloweenVolume: .35,
};
export type Atmosphere = Pick<Settings, "season" | "weather" | "hour">;
export const halloweenAtmosphere: Atmosphere = {
  season: "autumn", weather: "overcast", hour: 19.5,
};
export const halloweenStorageKey = "cwru-halloween-preference-v1";
/** Halloween spans one week before and after October31 in Cleveland local dates.
 * Subsequent years use the recurring seasonal window; manual choice wins.
 */
export const halloweenSchedule = {
  timeZone: "America/New_York",
  release: { year: 2026, start: [10, 24], end: [11, 7] },
  annual: { start: [10, 24], end: [11, 7] },
} as const;
function clevelandDate(date: Date) {
  if (!Number.isFinite(date.getTime())) return undefined;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: halloweenSchedule.timeZone, year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}
export function parseHalloweenPreference(stored: unknown): { year: number; enabled: boolean } | null {
  if (typeof stored === "string") {
    try { return parseHalloweenPreference(JSON.parse(stored)); } catch { return null; }
  }
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return null;
  const record = stored as Record<string, unknown>;
  return typeof record.year === "number" && Number.isInteger(record.year) && record.year >= 2026 && record.year <= 9999 && typeof record.enabled === "boolean"
    ? { year: record.year, enabled: record.enabled } : null;
}
export function initialHalloweenPreference(date: Date, stored?: unknown) {
  const calendar = clevelandDate(date);
  if (!calendar) return false;
  const preference = parseHalloweenPreference(stored);
  if (preference?.year === calendar.year) return preference.enabled;
  const window = calendar.year === halloweenSchedule.release.year ? halloweenSchedule.release : halloweenSchedule.annual;
  const day = calendar.month * 100 + calendar.day;
  return day >= window.start[0] * 100 + window.start[1] && day <= window.end[0] * 100 + window.end[1];
}
export function serializeHalloweenPreference(date: Date, enabled: boolean) {
  const calendar = clevelandDate(date);
  if (!calendar) return null;
  return JSON.stringify({ year: calendar.year, enabled });
}
/** Pure transition keeps the previous atmosphere separate from the edition,
 * and carries quality, accessibility and population choices through unchanged.
 */
export function setHalloween(s: Settings, enabled: boolean, previous: Atmosphere | null = null): { settings: Settings; previous: Atmosphere | null } {
  if (enabled) return {
    settings: normalizeSettings({ ...s, halloween: true }),
    previous: s.halloween
      ? previous || { season: defaults.season, weather: defaults.weather, hour: defaults.hour }
      : { season: s.season, weather: s.weather, hour: s.hour },
  };
  const atmosphere = s.halloween ? previous || { season: defaults.season, weather: defaults.weather, hour: defaults.hour } : {};
  return { settings: normalizeSettings({ ...s, ...atmosphere, halloween: false }), previous: null };
}
export function toggleHalloween(s: Settings, previous: Atmosphere | null = null) {
  return setHalloween(s, !s.halloween, previous);
}
const dates: Record<Season, [number, number, number]> = {
  spring: [3, 21, -4],
  summer: [7, 15, -4],
  autumn: [10, 15, -4],
  winter: [1, 15, -5],
};
/** NOAA solar approximation. Civil time is Cleveland local time on the displayed representative date. */
export function solarPosition(
  season: Season,
  hour: number,
  latitude = 41.504,
  longitude = -81.608,
) {
  const [month, day, offset] = dates[season],
    date = new Date(Date.UTC(2026, month - 1, day, hour - offset));
  const n = (date.getTime() - Date.UTC(2026, 0, 0)) / 86400000;
  const gamma =
    ((2 * Math.PI) / 365) * (n - 1 + (date.getUTCHours() - 12) / 24);
  const eq =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const dec =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const ha =
      (((hour * 60 + eq + 4 * longitude - 60 * offset) / 4 - 180) * Math.PI) /
      180,
    lat = (latitude * Math.PI) / 180;
  const altitude = Math.asin(
    Math.sin(lat) * Math.sin(dec) +
      Math.cos(lat) * Math.cos(dec) * Math.cos(ha),
  );
  const azimuth =
    Math.atan2(
      Math.sin(ha),
      Math.cos(ha) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat),
    ) + Math.PI;
  const cosHour =
    Math.cos((90.833 * Math.PI) / 180) / (Math.cos(lat) * Math.cos(dec)) -
    Math.tan(lat) * Math.tan(dec);
  const angle = (Math.acos(Math.max(-1, Math.min(1, cosHour))) * 180) / Math.PI;
  const noon = (720 - 4 * longitude - eq + 60 * offset) / 60;
  return {
    altitude,
    azimuth,
    sunrise: noon - angle / 15,
    sunset: noon + angle / 15,
    date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    offset,
  };
}
export function normalizeSettings(s: Settings): Settings {
  const atmosphere = s.halloween ? { ...s, ...halloweenAtmosphere } : s;
  return {
    ...atmosphere,
    halloweenSound: atmosphere.halloweenSound !== false,
    halloweenVolume: Number.isFinite(atmosphere.halloweenVolume) ? Math.max(0,Math.min(1,atmosphere.halloweenVolume)) : .35,
    hour: Math.max(0, Math.min(23.99, atmosphere.hour)),
    weather:
      atmosphere.weather === "snow" && atmosphere.season !== "winter" ? "clear" : atmosphere.weather,
  };
}
export const clock = (h: number) =>
  `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
