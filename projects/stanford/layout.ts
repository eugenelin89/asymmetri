import type { Anchors, Pose } from "./types";

/** Individually modelled public-space reconstructions; venue aliases are omitted. */
export const landmarkIds = [
  "memorial-church", "main-quad", "hoover-tower", "green-library", "bing-wing",
  "cantor", "anderson", "bing-concert", "memorial-auditorium", "gates", "huang",
  "packard", "hewlett", "clark", "peterson", "knight", "law", "tresidder",
  "old-union", "bookstore", "toyon", "branner", "roble", "encina", "maples",
  "mcmurtry", "windhover", "dinkelspiel", "mausoleum", "burnham", "ford", "squash",
] as const;

/** Source vertex shared by OSM ways 613233643, 676154811, 696196340 and 906388223.
 * The arrival is south of the Oval, looking toward Memorial Court and the Quad.
 * It is fixed independently of the smaller reconstructed interior envelopes. */
export const arrivalPose: Pose = { x: 19.96, z: -160.08, y: 0, yaw: 2.8808615, pitch: 0 };
export const mainCampusBounds = { minX: -2208, maxX: 1766, minZ: -1835, maxZ: 1057 };
export const waterfrontBounds = { minX: -4502, maxX: -3972, minZ: -8951, maxZ: -8284 };

export function initialCampusPose(anchors: Anchors): Pose {
  const arrival = anchors.arrival;
  return arrival
    ? { x: arrival.x, z: arrival.z, y: 0, yaw: arrival.yaw, pitch: 0 }
    : { ...arrivalPose };
}
export function applyCampusAnchors(anchors: Anchors): Anchors {
  return {
    ...anchors,
    arrival: { id: "arrival", ...arrivalPose, width: 1, depth: 1, entry: [arrivalPose.x, arrivalPose.z] },
    spawn: { id: "spawn", ...arrivalPose, width: 1, depth: 1 },
  };
}
