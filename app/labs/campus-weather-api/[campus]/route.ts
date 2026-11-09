import { fetchCampusObservation, isFreshObservation } from "../../../../projects/campus-atmosphere/weather-provider";
import type { WeatherObservation, WeatherReport } from "../../../../projects/campus-atmosphere/weather-types";

export const dynamic = "force-dynamic";

type CampusCache = {
  observation: WeatherObservation | null;
  nextCheck: number;
  refresh?: Promise<WeatherObservation | null>;
};
const campusCaches = new Map<string, CampusCache>();

export async function GET(_request: Request, { params }: { params: Promise<{ campus: string }> }) {
  const { campus } = await params;
  if (campus !== "ubc" && campus !== "stanford" && campus !== "cwru") {
    return Response.json({ error: "Unknown campus." }, { status: 404 });
  }
  let entry = campusCaches.get(campus);
  if (!entry) {
    entry = { observation: null, nextCheck: 0 };
    campusCaches.set(campus, entry);
  }
  const now = Date.now();
  if (now >= entry.nextCheck && !entry.refresh) {
    entry.nextCheck = now + 15 * 60_000;
    const cache = entry;
    cache.refresh = fetchCampusObservation(campus)
      .then((observation) => {
        if (observation) cache.observation = observation;
        return observation;
      })
      .finally(() => { delete cache.refresh; });
  }
  const refreshed = await entry.refresh;
  const observation = isFreshObservation(entry.observation) ? entry.observation : null;
  const report: WeatherReport = {
    observation,
    cached: !!observation && !refreshed,
    nextCheckAt: new Date(entry.nextCheck).toISOString(),
  };
  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
