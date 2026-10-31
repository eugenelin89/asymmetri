import type { Building } from "./types";

/** The importer splits one source MultiPolygon into ID, ID-part1, ID-part2… */
export const sourceBuildingId = (id: string) => id.replace(/-part\d+$/, "");

export function groupBuildings(buildings: Building[]) {
  const groups = new Map<string, { building: Building; parts: Building[] }>();
  for (const building of buildings) {
    const id = sourceBuildingId(building.id);
    const group = groups.get(id);
    if (group) {
      group.parts.push(building);
      if (building.id === id) group.building = building;
    } else groups.set(id, { building, parts: [building] });
  }
  return [...groups.values()];
}
