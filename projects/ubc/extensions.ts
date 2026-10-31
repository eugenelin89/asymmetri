import type { CampusData, Point } from "./types";
import westTenth from "./data/west-tenth.json" with { type: "json" };
/** Extend the immutable campus snapshot without rewriting its source bytes. */
export function extendGeography(data: CampusData): CampusData {
  const roads = westTenth.roads.map((r) => ({
    ...r,
    points: r.points as Point[],
  }));
  const surfaces = roads.flatMap((r) =>
    r.points.slice(1).map((b, i) => {
      const a = r.points[i],
        dx = b[0] - a[0],
        dz = b[1] - a[1],
        n = Math.hypot(dx, dz),
        ox = (dz / n) * 4.5,
        oz = (-dx / n) * 4.5;
      const ring: Point[] = [
        [a[0] + ox, a[1] + oz],
        [b[0] + ox, b[1] + oz],
        [b[0] - ox, b[1] - oz],
        [a[0] - ox, a[1] - oz],
        [a[0] + ox, a[1] + oz],
      ];
      return {
        id: r.id + "-" + i,
        kind: "Road · representative width",
        rings: [ring],
      };
    }),
  );
  return {
    ...data,
    roads: [...(data.roads || []), ...roads],
    surfaces: [...data.surfaces, ...surfaces],
  };
}
