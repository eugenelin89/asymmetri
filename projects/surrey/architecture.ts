// SPDX-License-Identifier: MIT — deterministic artistic reconstruction, not surveyed facades.
import type { City, Point } from "./types";
export type BuildingKind = "glass" | "residential" | "apartment" | "commercial" | "storefront" | "civic";
export function buildingProfile(building: City["buildings"][number]) {
  let seed = 2166136261;
  for (const character of building.facilityId) seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  const ring = building.shape[0], xs = ring.map(p => p[0]), zs = ring.map(p => p[1]);
  const bounds = [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)] as const;
  const area = Math.abs(ring.slice(1).reduce((sum, p, i) => sum + ring[i][0] * p[1] - p[0] * ring[i][1], 0)) / 2;
  const centre: Point = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
  const landmark = building.name && /SFU|CENTRAL CITY|CITY HALL|CITY CENTRE LIBRARY|CIVIC PLAZA/.test(building.name);
  const kind: BuildingKind = landmark ? "civic" : building.height > 45 ? seed % 3 === 0 ? "glass" : "residential" : area > 1500 ? "commercial" : building.height > 12 ? "apartment" : "storefront";
  return { seed, kind, centre, bounds, area, height: building.id === "1665" ? 16 : building.height,
    setback: !landmark && building.height > 45 && area > 250 && seed % 3 === 1,
    roof: !landmark && building.height < 12 && area < 700 && seed % 3 === 0 ? "pitched" : "flat",
    variant: seed % 3, floorHeight: kind === "glass" ? 3.8 : 3.1 };
}
