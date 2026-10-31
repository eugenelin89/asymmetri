// Original placement derived from the pinned UBC VBL10086 Main Mall pavilion footprint.
import type { Anchor, Point } from "./types";
import { global } from "./spatial";
export const beatyAnchor: Anchor = {
  id: "beaty", x: -430.905, z: -360.145, width: 13.22, depth: 55.32,
  yaw: -2.6528, buildingId: "VBL10086",
};
// Grade/drop and furnishings are interpreted from Patkau's public section, not measured plans.
export const beatyLowerLevel = -3.4;
export const beatyGallery = { minX: -31.5, maxX: -6.2, minZ: -16, maxZ: 18 };
export const beatyGroundOpening: Point[] = [
  [-6.43, -16.95], [6.43, -16.95], [6.43, 21], [-6.43, 21],
].map((p) => global(p as Point, beatyAnchor));
export function inBeaty(p: Point, y: number) {
  return (Math.abs(p[0]) < 6.61 && Math.abs(p[1]) < 27.66) ||
    (y < -1 && p[0] > beatyGallery.minX && p[0] < beatyGallery.maxX &&
      p[1] > beatyGallery.minZ && p[1] < beatyGallery.maxZ);
}
