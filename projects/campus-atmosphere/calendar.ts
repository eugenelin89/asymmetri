export const campuses = {
  ubc: { timeZone: "America/Vancouver", latitude: 49.26, longitude: -123.245 },
  stanford: { timeZone: "America/Los_Angeles", latitude: 37.4275, longitude: -122.17 },
  cwru: { timeZone: "America/New_York", latitude: 41.504, longitude: -81.608 },
} as const;
export type Campus = keyof typeof campuses;
export type Edition = "christmas" | "halloween" | "regular";
export type Choice = "automatic" | "regular";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Weather = "neutral" | "clear" | "cloudy" | "overcast" | "fog" | "rain" | "snow";
export type Scene = { hour: number; season: Season; weather: Weather };

const formatters = new Map<string, Intl.DateTimeFormat>();

export function campusDate(campus: Campus, instant: Date) {
  // B.C.'s final clock change was March 8, 2026. Older browser ICU data
  // still rolls Vancouver back in November. Preserve historical IANA rules.
  const zone = campus === "ubc" && +instant >= Date.UTC(2026, 2, 8, 10)
    ? "Etc/GMT+7" : campuses[campus].timeZone;
  let formatter = formatters.get(zone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric",
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
    formatters.set(zone, formatter);
  }
  const parts = Object.fromEntries(formatter.formatToParts(instant).map(p => [p.type, Number(p.value)]));
  const { year, month, day, hour, minute, second } = parts;
  const offset = (Date.UTC(year, month - 1, day, hour, minute, second) - Math.floor(+instant / 1000) * 1000) / 3600000;
  const date = [year, String(month).padStart(2,"0"), String(day).padStart(2,"0")].join("-");
  const season: Season = month < 3 || month === 12 ? "winter" : month < 6 ? "spring" : month < 9 ? "summer" : "autumn";
  return { year, month, day, date, season, hour: hour + minute / 60 + second / 3600, offset };
}

export function scheduledEdition(date: string): Edition {
  const day = date.slice(5);
  if (day >= "10-24" && day <= "11-07") return "halloween";
  if (date >= "2026-11-08" && date <= "2026-12-31") return "christmas";
  return "regular";
}

export const choiceKey = (campus: Campus) => `${campus}-campus-choice-v2`;
export function persistentChoice(stored: string | null, date: string): Choice {
  return stored === "regular-through-2026" && date <= "2026-12-31" ? "regular" : "automatic";
}

/** NOAA fractional-year approximation, angles in radians, event times in campus civil hours. */
function solar(campus: Campus, year: number, month: number, day: number, hour: number, offset: number, daylightOffset: number) {
  const { latitude, longitude } = campuses[campus];
  const radians = Math.PI / 180;
  const start = Date.UTC(year, 0, 1);
  const days = (Date.UTC(year + 1, 0, 1) - start) / 86400000;
  const elapsed = (Date.UTC(year, month - 1, day) - start) / 86400000;
  const gamma = 2 * Math.PI / days * (elapsed + (hour - 12) / 24);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const dec = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const lat = latitude * radians;
  const ha = ((hour - offset) * 15 + eq / 4 + longitude - 180) * radians;
  const altitude = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha));
  const azimuth = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)) + Math.PI;
  const noon = (720 - 4 * longitude - eq) / 60 + daylightOffset;
  const hoursTo = (angle: number) => Math.acos((Math.sin(angle * radians) - Math.sin(lat) * Math.sin(dec))
    / (Math.cos(lat) * Math.cos(dec))) / radians / 15;
  const daylight = hoursTo(-0.833), twilight = hoursTo(-6);
  return { altitude, azimuth, sunrise: noon - daylight, sunset: noon + daylight, dawn: noon - twilight, dusk: noon + twilight,
    date: new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0,10), offset };
}
export type Solar = ReturnType<typeof solar>;

export function actualSun(campus: Campus, local: ReturnType<typeof campusDate>) {
  const { year, month, day, hour, offset } = local;
  const daylightOffset = campusDate(campus, new Date(Date.UTC(year, month - 1, day, 19))).offset;
  return solar(campus, year, month, day, hour, offset, daylightOffset);
}

const representative = { spring: [3,21], summer: [7,15], autumn: [10,15], winter: [1,15] } as const;
export function stagedSun(campus: Campus, season: Season, hour: number) {
  const [month, day] = representative[season];
  const offset = campusDate(campus, new Date(Date.UTC(2026, month - 1, day, 19))).offset;
  return solar(campus, 2026, month, day, hour, offset, offset);
}

export const clock = (hour: number) => {
  const minute = (Math.floor(hour * 60 + 0.000001) + 1440) % 1440;
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
};
