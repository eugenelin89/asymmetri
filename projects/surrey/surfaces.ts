// SPDX-License-Identifier: MIT
import { inPolygon } from "../vancouver/physics";
import type { City, Point, Polygon } from "./types";
export function onSurface(point: Point, polygons: Polygon[]) {
  return polygons.some(p => inPolygon(point, p));
}
// Explicit fallback, shared by geometry tests and the renderer. Zero is a local
// game plane, not sea level or a claim about Surrey's surveyed ground elevation.
export function groundHeight(city: City, point: Point) { return point.every(Number.isFinite) ? city.terrain.elevation : NaN; }
export const TRANSIT_DECK_HEIGHT = 8.2;
