import type { Season, Settings } from "./types";
export const defaults: Settings = {
  season: "autumn",
  weather: "clear",
  hour: 15,
  quality: "auto",
  markers: true,
  population: true,
  reducedMotion: false,
};
const dates: Record<Season, [number, number, number]> = {
  spring: [3, 21, -7],
  summer: [7, 15, -7],
  autumn: [10, 15, -7],
  winter: [1, 15, -8],
};
/** NOAA solar approximation. Civil time is Vancouver local time on the displayed representative date. */
export function solarPosition(
  season: Season,
  hour: number,
  latitude = 49.26,
  longitude = -123.245,
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
  return {
    ...s,
    hour: Math.max(0, Math.min(23.99, s.hour)),
    weather:
      s.weather === "snow" && s.season !== "winter" ? "clear" : s.weather,
  };
}
export const clock = (h: number) =>
  `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
