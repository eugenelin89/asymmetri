import type { City } from "./types";
export const DATA_URL = "/surrey/v0.1-2026-10-30/city.json";
export function validateCity(value: unknown): City {
  const c = value as City;
  if (
    !c ||
    c.version !== "v0.1-2026-10-30" ||
    !Array.isArray(c.buildings) ||
    c.buildings.length < 100 ||
    c.buildings.length > 1500 ||
    !Array.isArray(c.bounds) ||
    c.bounds.length !== 4 ||
    !c.bounds.every(Number.isFinite) ||
    !c.walkCells ||
    !c.roads?.length ||
    !c.sidewalks?.length ||
    !c.rail?.length ||
    !c.pavement?.length
  )
    throw new Error(
      "The Surrey map is incomplete. Please retry loading the city.",
    );
  for (const name of [
    "spawn",
    "owner",
    "clue",
    "thief",
    "escape",
    "community",
    "mystery",
    "danger",
  ])
    if (
      !Array.isArray(c.anchors?.[name]) ||
      c.anchors[name].length !== 2 ||
      !c.anchors[name].every(Number.isFinite)
    )
      throw new Error("The Surrey mission locations could not be loaded.");
  return c;
}
export async function loadCity(signal: AbortSignal): Promise<City> {
  const r = await fetch(DATA_URL, { signal });
  if (!r.ok)
    throw new Error("The Surrey map could not be loaded. Please retry.");
  const text = await r.text();
  signal.throwIfAborted();
  if (text.length > 4_000_000)
    throw new Error("The Surrey map exceeds this release’s size limit.");
  return validateCity(JSON.parse(text));
}
