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
/** Illustrative supports stay off paved roads and avoid dense source vertices. */
export function railSupports(city: City): Point[] {
  const supports: Point[] = [];
  for (const line of city.rail) for (const p of line) {
    if (supports.some(q => Math.hypot(p[0]-q[0],p[1]-q[1]) < 24)) continue;
    if (Array.from({length:8},(_,i)=>[p[0]+Math.cos(i*Math.PI/4)*1.5,p[1]+Math.sin(i*Math.PI/4)*1.5] as Point).some(q=>onSurface(q,city.pavement))) continue;
    supports.push(p);
  }
  return supports;
}
