import type { Point, Pose, Telemetry } from "./types";

/** Map travel only lands on a checked outdoor pedestrian-network vertex. */
export function resolveMapDestination(
  requested: Point,
  nodes: Point[],
  safe: (point: Point) => boolean,
): Point | null {
  if (!requested.every(Number.isFinite)) return null;
  const nearby = nodes
    .map((point) => ({
      point,
      distance: Math.hypot(point[0] - requested[0], point[1] - requested[1]),
    }))
    .filter((p) => p.distance <= 120)
    .sort((a, b) => a.distance - b.distance);
  const result = nearby.find((p) => safe(p.point));
  return result ? [...result.point] : null;
}

/** Project onto the polyline to retain turns and compute remaining route distance. */
export function walkingGuidance(
  pose: Pose,
  points: Point[],
  label: string,
  indoors: boolean,
): Telemetry["guidance"] {
  if (!points.length) return null;
  const end = points.at(-1)!;
  const endDistance = Math.hypot(end[0] - pose.x, end[1] - pose.z);
  let closest = points[0],
    gap = Math.hypot(closest[0] - pose.x, closest[1] - pose.z),
    segment = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i],
      b = points[i + 1],
      dx = b[0] - a[0],
      dz = b[1] - a[1];
    const t = Math.max(
      0,
      Math.min(
        1,
        ((pose.x - a[0]) * dx + (pose.z - a[1]) * dz) /
          (dx * dx + dz * dz || 1),
      ),
    );
    const p: Point = [a[0] + dx * t, a[1] + dz * t],
      d = Math.hypot(p[0] - pose.x, p[1] - pose.z);
    if (d < gap) {
      closest = p;
      gap = d;
      segment = i;
    }
  }
  let distance = gap,
    lookAhead = 7,
    target = closest,
    previous = closest;
  for (let i = segment + 1; i < points.length; i++) {
    const point = points[i],
      length = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    distance += length;
    if (lookAhead > 0 && gap < 8) {
      const t = Math.min(1, lookAhead / (length || 1));
      target = [
        previous[0] + (point[0] - previous[0]) * t,
        previous[1] + (point[1] - previous[1]) * t,
      ];
      lookAhead -= length;
    }
    previous = point;
  }
  const heading = Math.atan2(-(target[0] - pose.x), -(target[1] - pose.z));
  const relative = pose.yaw - heading;
  return {
    label,
    distance: endDistance < 3 && !indoors ? 0 : distance,
    turn: (Math.atan2(Math.sin(relative), Math.cos(relative)) * 180) / Math.PI,
    status: indoors
      ? "exit-building"
      : endDistance < 3
        ? "arrived"
        : gap > 18
          ? "off-route"
          : "following",
  };
}
