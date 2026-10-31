import type { Season, Weather } from "./types";

export type CampusTheme = {
  id: string;
  available: boolean;
  name: string;
  editionLabel: string;
  overlay: "none" | "halloween" | "christmas";
  atmosphere?: { season: Season; weather: Weather; hour: number };
  automatic?: { start: readonly [number, number]; end: readonly [number, number] };
};
/** Holiday overlays are independent of geography, profiles and walking controls.
 * Add a theme and its overlay adapter here; never fork the underlying campus.
 * End dates are inclusive Stanford civil dates. */
export const campusThemes: readonly CampusTheme[] = [
  { id: "base", available: true, name: "Base campus", editionLabel: "Stanford · Base edition", overlay: "none" },
  { id: "halloween", available: true, name: "Halloween", editionLabel: "The Farm, after dark", overlay: "halloween",
    atmosphere: { season: "autumn", weather: "overcast", hour: 19.5 },
    automatic: { start: [10, 24], end: [11, 7] } },
  { id: "christmas", available: false, name: "Christmas", editionLabel: "Christmas on the Farm", overlay: "christmas", automatic: { start: [12, 1], end: [12, 31] } },
];
export const campusTimeZone = "America/Los_Angeles";
export function localCalendar(date: Date) {
  if (!Number.isFinite(date.getTime())) return undefined;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: campusTimeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}
export function scheduledTheme(date: Date): CampusTheme {
  const c = localCalendar(date), day = c ? c.month * 100 + c.day : 0;
  return campusThemes.find(t => t.available && t.automatic && day >= t.automatic.start[0] * 100 + t.automatic.start[1] && day <= t.automatic.end[0] * 100 + t.automatic.end[1]) || campusThemes[0];
}
