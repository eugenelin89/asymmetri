import type { WeatherObservation } from "./weather-types";

const eccc = "Environment and Climate Change Canada";
const yvr = "https://api.weather.gc.ca/collections/citypageweather-realtime/items/bc-74?f=json";
type Localized = { en?: unknown };
type CityPage = {
  properties?: { currentConditions?: {
    station?: { code?: Localized };
    timestamp?: Localized;
    condition?: Localized;
    wind?: { speed?: { units?: Localized; value?: Localized } };
  } };
};

function isoTime(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function reportedCondition(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && !/^(unknown|n\/a|not (?:available|observed|reported))$/i.test(text) ? text : null;
}

function measuredValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function sky(condition: string): Pick<WeatherObservation, "weather" | "fog" | "intensity"> {
  const fog = /fog|mist/i.test(condition);
  const intensity = /heavy/i.test(condition) ? 1 : /light|drizzle|flurr/i.test(condition) ? 0.3 : 0.65;
  if (/snow|flurr|ice pellets|sleet/i.test(condition)) return { weather: "snow", fog, intensity };
  if (/rain|drizzle|shower/i.test(condition)) return { weather: "rain", fog, intensity };
  if (fog) return { weather: "fog", fog, intensity };
  if (/overcast|^cloudy$/i.test(condition)) return { weather: "overcast", intensity: 0 };
  if (/cloud/i.test(condition)) return { weather: "cloudy", intensity: 0 };
  if (/clear|sunny|fair/i.test(condition)) return { weather: "clear", intensity: 0 };
  return { weather: "neutral", intensity: 0 };
}

async function request(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/geo+json, application/json", "User-Agent": "Asymmetri Campus Weather (https://www.asymmetri.co)" },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return null;
  return response.json();
}

async function vancouverAirport(): Promise<WeatherObservation | null> {
  const page = await request(yvr) as CityPage | null;
  const data = page?.properties?.currentConditions;
  if (data?.station?.code?.en !== "yvr") return null;
  const observedAt = isoTime(data.timestamp?.en);
  const condition = reportedCondition(data.condition?.en);
  if (!observedAt || !condition) return null;
  const wind = data.wind?.speed;
  return {
    provider: eccc + " · Observational data provided by NAV CANADA. All rights reserved.",
    station: "Vancouver International Airport (YVR)",
    observedAt,
    condition,
    ...sky(condition),
    windKph: wind?.units?.en === "km/h" ? measuredValue(wind.value?.en) ?? 0 : 0,
  };
}

async function westVancouver(): Promise<WeatherObservation | null> {
  const url = "https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108824&sortby=-obs_date_tm&limit=1&f=json";
  const feed = await request(url) as { features?: { properties?: Record<string, unknown> }[] } | null;
  const data = feed?.features?.[0]?.properties;
  if (data?.["msc_id-value"] !== "1108824" || data["data_pvdr-value"] !== "MSC") return null;
  const observedAt = isoTime(data.obs_date_tm);
  if (!observedAt) return null;
  function measure(field: string, unit: string) {
    if (data?.[field + "-uom"] !== unit || (data[field + "-qa"] !== undefined && data[field + "-qa"] !== 100)) return null;
    return measuredValue(data[field]);
  }
  const wind = measure("avg_wnd_spd_10m_pst1mt", "km/h") ?? measure("avg_wnd_spd_10m_pst2mts", "km/h");
  const rain = measure("rnfl_amt_pst1mt", "mm");
  if (wind === null && rain === null) return null;
  const raining = rain !== null && rain > 0;
  const reading = rain !== null ? (raining ? `Rain (${rain} mm in the last minute)` : "No rain measured in the last minute") : "Wind observed";
  return {
    provider: eccc,
    station: "West Vancouver (CWWA)",
    observedAt,
    condition: raining ? reading : reading + " · sky condition unreported",
    weather: raining ? "rain" : "neutral",
    windKph: wind ?? 0,
    intensity: raining ? Math.min(1, rain * 6) : 0,
  };
}

const usStations = {
  KPAO: "Palo Alto Airport",
  KNUQ: "Mountain View, Moffett Field",
  KBKL: "Cleveland, Burke Lakefront Airport",
  KCLE: "Cleveland Hopkins International Airport",
} as const;
type UsStation = keyof typeof usStations;
type NwsReport = {
  properties?: {
    station?: string;
    stationId?: string;
    timestamp?: unknown;
    textDescription?: unknown;
    presentWeather?: { weather: string; intensity?: string; inVicinity?: boolean }[];
    cloudLayers?: { amount: string }[];
    windSpeed?: { value?: unknown; unitCode?: string; qualityControl?: string };
  };
};

const layerDescriptions: Readonly<Record<string, string>> = {
  CLR: "Clear", SKC: "Clear", FEW: "Few clouds", SCT: "Scattered clouds",
  BKN: "Mostly cloudy", OVC: "Overcast",
};

async function usObservation(id: UsStation): Promise<WeatherObservation | null> {
  const stationUrl = "https://api.weather.gov/stations/" + id;
  const report = await request(stationUrl + "/observations/latest") as NwsReport | null;
  const data = report?.properties;
  if (data?.station !== stationUrl || (data.stationId && data.stationId !== id)) return null;
  const observedAt = isoTime(data.timestamp);
  if (!observedAt) return null;
  const phenomena = (data.presentWeather ?? []).filter((p) => !p.inVicinity && p.weather !== "unknown");
  const present = phenomena.map((p) => [p.intensity, p.weather.replaceAll("_", " ")].filter(Boolean).join(" ")).join(", ");
  const layers = (data.cloudLayers ?? []).map((layer) => layer.amount);
  const cover = ["OVC", "BKN", "SCT", "FEW", "CLR", "SKC"].find((code) => layers.includes(code));
  const condition = reportedCondition(data.textDescription) || present || (cover && layerDescriptions[cover]);
  if (!condition) return null;
  const localCondition = /vicinity/i.test(condition) ? (cover ? layerDescriptions[cover] : "") : condition;
  const effects = sky(present || localCondition);
  const wind = data.windSpeed;
  const unit = wind?.unitCode?.split(":").at(-1);
  const factor = unit === "km_h-1" ? 1 : unit === "m_s-1" ? 3.6 : unit === "kt" ? 1.852 : 0;
  return {
    provider: "U.S. National Weather Service",
    station: usStations[id] + " (" + id + ")",
    observedAt,
    condition,
    ...effects,
    windKph: wind?.qualityControl === "X" ? 0 : (measuredValue(wind?.value) ?? 0) * factor,
  };
}

export function isFreshObservation(observation: WeatherObservation | null): observation is WeatherObservation {
  if (!observation) return false;
  const age = Date.now() - Date.parse(observation.observedAt);
  return age >= 0 && age <= 90 * 60_000;
}

export async function fetchCampusObservation(campus: "ubc" | "stanford" | "cwru") {
  const stations = {
    ubc: [vancouverAirport, westVancouver],
    stanford: [() => usObservation("KPAO"), () => usObservation("KNUQ")],
    cwru: [() => usObservation("KBKL"), () => usObservation("KCLE")],
  };
  for (const station of stations[campus]) {
    try {
      const observation = await station();
      if (isFreshObservation(observation)) return observation;
    } catch {
      // Timeouts, malformed responses and outages can affect only one station.
    }
  }
  return null;
}
