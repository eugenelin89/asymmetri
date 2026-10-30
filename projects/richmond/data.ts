// SPDX-License-Identifier: MIT
import type { City } from "./types";
export const DATA_ROOT = "/richmond/v0.1-2026-10-30/";
export function validateCity(value: unknown): City {
  if (!value || typeof value !== "object")
    throw Error("Richmond map is unavailable.");
  const c = value as City;
  if (
    c.version !== "v0.1-2026-10-30" ||
    !Array.isArray(c.bounds) ||
    c.bounds.length !== 4 ||
    !c.bounds.every(Number.isFinite) ||
    !Array.isArray(c.roads) ||
    c.roads.length < 100 ||
    !Array.isArray(c.nodes) ||
    !Array.isArray(c.places) ||
    ![
      "yvr",
      "richmond-centre",
      "steveston",
      "terra-nova",
      "ikea",
      "no6",
      "knight",
    ].every((id) => c.places.some((p) => p.id === id))
  )
    throw Error("Richmond map is incomplete. Retry loading the versioned map.");
  if (
    !c.roads.every(
      (r) =>
        r.points.length === r.heights.length &&
        r.points.length === r.nodes.length &&
        r.points.every((p) => p.length === 2 && p.every(Number.isFinite)) &&
        r.heights.every(Number.isFinite) &&
        r.nodes.every((n) => Number.isInteger(n) && !!c.nodes[n]),
    )
  )
    throw Error("Invalid road geometry.");
  if (
    !c.edges.every(
      (e) =>
        c.nodes[e.a] &&
        c.nodes[e.b] &&
        c.roads[e.road] &&
        Number.isFinite(e.length) &&
        e.length > 0,
    )
  )
    throw Error("Invalid road topology.");
  return c;
}
export async function loadCity(signal: AbortSignal) {
  const r = await fetch(DATA_ROOT + "city.json", { signal });
  if (!r.ok)
    throw Error("Map download failed. Retry when the connection is available.");
  return validateCity(await r.json());
}
