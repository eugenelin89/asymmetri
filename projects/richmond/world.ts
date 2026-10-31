// SPDX-License-Identifier: MIT
import { inPolygon, segmentDistance } from "../vancouver/physics";
import type { City, Place, Point, Polygon, Pose, Road } from "./types";
import {
  bodyCorners,
  bodyLocal,
  halfWidth,
  halfLength,
  segmentsCross,
} from "./collision";
export const distance = (a: Point, b: Point) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);
export const point = (p: Pose): Point => [p.x, p.z];
export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));
type Segment = {
  a: Point;
  b: Point;
  ya: number;
  yb: number;
  road: Road;
  index: number;
};
export function indexItems<T>(
  items: T[],
  bounds: (item: T) => number[],
  size = 64,
) {
  const grid = new Map<string, T[]>();
  for (const item of items) {
    const [a, b, c, d] = bounds(item);
    for (let x = Math.floor(a / size); x <= Math.floor(c / size); x++)
      for (let z = Math.floor(b / size); z <= Math.floor(d / size); z++) {
        const key = `${x},${z}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(item);
      }
  }
  return (p: Point) =>
    grid.get(`${Math.floor(p[0] / size)},${Math.floor(p[1] / size)}`) ?? [];
}
const boundsOf = (p: Polygon) => [
  Math.min(...p[0].map((v) => v[0])),
  Math.min(...p[0].map((v) => v[1])),
  Math.max(...p[0].map((v) => v[0])),
  Math.max(...p[0].map((v) => v[1])),
];
export function projection(p: Point, a: Point, b: Point) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1];
  const t = clamp(
    ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1),
    0,
    1,
  );
  return {
    t,
    p: [a[0] + dx * t, a[1] + dz * t] as Point,
    d: segmentDistance(p, a, b),
  };
}
const worldCache = new WeakMap<City, World>();
export function createWorld(city: City) {
  const existing = worldCache.get(city);
  if (existing) return existing;
  const world = buildWorld(city);
  worldCache.set(city, world);
  return world;
}
function buildWorld(city: City) {
  const segments: Segment[] = city.roads.flatMap((road) =>
    road.points.slice(1).map((b, index) => ({
      a: road.points[index],
      b,
      ya: road.heights[index],
      yb: road.heights[index + 1],
      road,
      index,
    })),
  );
  const localRoads = indexItems(segments, (s) => [
    Math.min(s.a[0], s.b[0]) - s.road.width,
    Math.min(s.a[1], s.b[1]) - s.road.width,
    Math.max(s.a[0], s.b[0]) + s.road.width,
    Math.max(s.a[1], s.b[1]) + s.road.width,
  ]);
  const localBuildings = indexItems(city.buildingIndex, (b) => b.bounds);
  const localWater = indexItems(city.water, boundsOf, 256);
  const localLand = indexItems(city.land, boundsOf, 256);
  const routable = new Set(
    city.edges
      .filter((e) => city.roads[e.road].kind === "road")
      .map((e) => `${city.roads[e.road].id}:${e.a}:${e.b}`),
  );
  const localLots = indexItems(city.lots, (l) => boundsOf(l.shape), 128);
  const inside = (p: Point) =>
    p[0] > city.bounds[0] + 2 &&
    p[1] > city.bounds[1] + 2 &&
    p[0] < city.bounds[2] - 2 &&
    p[1] < city.bounds[3] - 2;
  const building = (p: Point, y = 0) =>
    localBuildings(p).some((b) => y < b.height && inPolygon(p, b.shape));
  const water = (p: Point) => localWater(p).some((g) => inPolygon(p, g));
  function support(
    p: Point,
    y: number,
    airfield = false,
    walking = false,
  ): number | null {
    if (!inside(p) || building(p, y)) return null;
    // Authored entrance approaches remain at ground level under elevated access roads.
    if (
      walking &&
      Math.abs(y) < 1.4 &&
      !water(p) &&
      localLots(p).some(
        (l) => l.id.startsWith("approach:") && inPolygon(p, l.shape),
      )
    )
      return 0;
    let best: number | null = null;
    for (const s of localRoads(p)) {
      if (
        (s.road.kind === "airfield" && !airfield) ||
        (s.road.kind === "path" && !walking)
      )
        continue;
      const q = projection(p, s.a, s.b),
        height = s.ya + (s.yb - s.ya) * q.t;
      if (
        q.d > s.road.width / 2 + (walking ? 2 : 0) ||
        Math.abs(height - y) > 1.4
      )
        continue;
      if (water(p) && !s.road.bridge) continue;
      if (best === null || Math.abs(height - y) < Math.abs(best - y))
        best = height;
    }
    if (best !== null) return best;
    if (Math.abs(y) < 1.4 && !water(p)) {
      if (
        localLots(p).some(
          (l) => (!l.airfield || airfield) && inPolygon(p, l.shape),
        )
      )
        return 0;
      if (airfield && inPolygon(p, city.airportGate.shape)) return 0;
      if (walking && localLand(p).some((g) => inPolygon(p, g))) return 0;
    }
    return null;
  }
  const walkFits = (p: Point, y: number, airfield: boolean) =>
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].every(
      (a) =>
        support(
          [p[0] + Math.sin(a) * 0.4, p[1] + Math.cos(a) * 0.4],
          y,
          airfield,
          true,
        ) !== null,
    );
  function rejection(pose: Pose, airfield: boolean): string | null {
    const corners = bodyCorners(pose);
    const samples: Point[] = [[pose.x, pose.z]];
    for (let i = 0; i < 4; i++) {
      const a = corners[i],
        b = corners[(i + 1) % 4],
        n = Math.ceil(distance(a, b) / 0.3);
      for (let j = 0; j <= n; j++)
        samples.push([
          a[0] + ((b[0] - a[0]) * j) / n,
          a[1] + ((b[1] - a[1]) * j) / n,
        ]);
    }
    for (const p of samples)
      if (support(p, pose.y, airfield) === null) {
        const b = localBuildings(p).find(
          (b) => pose.y < b.height && inPolygon(p, b.shape),
        );
        return b
          ? `building:${b.id}`
          : `${inside(p) ? (water(p) ? "water" : "surface/elevation") : "bounds"}@${p.map((v) => v.toFixed(2)).join(",")},y=${pose.y.toFixed(2)}`;
      }
    // Also catch a small footprint entirely between sample points, or an edge
    // crossing the body. Checking only nine points can miss either case.
    const nearby = new Set(samples.flatMap(localBuildings));
    for (const b of nearby) {
      if (pose.y >= b.height) continue;
      for (const ring of b.shape)
        for (let i = 0; i < ring.length; i++) {
          const a = ring[i],
            c = ring[(i + 1) % ring.length],
            local = bodyLocal(pose, a);
          if (
            (Math.abs(local[0]) < halfWidth &&
              Math.abs(local[1]) < halfLength) ||
            corners.some((p, j) => segmentsCross(p, corners[(j + 1) % 4], a, c))
          )
            return `building:${b.id}`;
        }
    }
    return null;
  }
  const fits = (pose: Pose, airfield: boolean) =>
    rejection(pose, airfield) === null;
  function clear(a: Point, b: Point, y = 0, airfield = false, walking = true) {
    const n = Math.max(1, Math.ceil(distance(a, b) / 0.45));
    for (let i = 0; i <= n; i++) {
      const p: Point = [
        a[0] + ((b[0] - a[0]) * i) / n,
        a[1] + ((b[1] - a[1]) * i) / n,
      ];
      const next = support(p, y, airfield, walking);
      if (next === null) return false;
      y = next;
    }
    return true;
  }
  function nearest(p: Point, kind: "road" | "airfield" = "road") {
    let best: { segment: Segment; point: Point; d: number } | null = null;
    for (const segment of segments) {
      if (
        segment.road.kind !== kind ||
        (kind === "road" &&
          !routable.has(
            `${segment.road.id}:${segment.road.nodes[segment.index]}:${segment.road.nodes[segment.index + 1]}`,
          ))
      )
        continue;
      const q = projection(p, segment.a, segment.b);
      if (!best || q.d < best.d) best = { segment, point: q.p, d: q.d };
    }
    return best;
  }
  function poseNear(p: Point, heading?: number, airfield = false): Pose {
    const candidates = segments
      .filter(
        (s) =>
          (airfield && s.road.kind === "airfield") ||
          (s.road.kind === "road" &&
            routable.has(
              `${s.road.id}:${s.road.nodes[s.index]}:${s.road.nodes[s.index + 1]}`,
            )),
      )
      .map((s) => ({ s, q: projection(p, s.a, s.b) }))
      .sort((a, b) => a.q.d - b.q.d)
      .slice(0, 64);
    for (const { s, q } of candidates) {
      let yaw = Math.atan2(s.b[0] - s.a[0], s.b[1] - s.a[1]);
      if (
        s.road.oneway < 0 ||
        (s.road.oneway === 0 &&
          heading !== undefined &&
          Math.cos(yaw - heading) < 0)
      )
        yaw += Math.PI;
      const length = distance(s.a, s.b) || 1;
      for (const offset of [0, 3, -3, 6, -6, 10, -10]) {
        const t = clamp(q.t + offset / length, 0, 1),
          pose = {
            x: s.a[0] + (s.b[0] - s.a[0]) * t,
            z: s.a[1] + (s.b[1] - s.a[1]) * t,
            y: s.ya + (s.yb - s.ya) * t,
            yaw,
          };
        if (fits(pose, airfield)) return pose;
      }
    }
    throw Error("No safe connected street placement near this location");
  }
  function exit(
    car: Pose,
    airfield: boolean,
    blocked: (p: Point) => boolean = () => false,
  ): Pose | null {
    for (const side of [1, -1])
      for (const off of [0, -3, 3]) {
        const p: Point = [
          car.x + Math.cos(car.yaw) * 2.7 * side + Math.sin(car.yaw) * off,
          car.z - Math.sin(car.yaw) * 2.7 * side + Math.cos(car.yaw) * off,
        ];
        if (
          !blocked(p) &&
          walkFits(p, car.y, airfield) &&
          clear(point(car), p, car.y, airfield)
        )
          return {
            x: p[0],
            z: p[1],
            y: support(p, car.y, airfield, true) ?? car.y,
            yaw: car.yaw,
          };
      }
    return null;
  }
  function street(p: Point) {
    let name = "Richmond",
      d = Infinity;
    for (const s of localRoads(p)) {
      const q = projection(p, s.a, s.b);
      if (q.d < d) {
        d = q.d;
        name = s.road.name;
      }
    }
    return name;
  }
  const adjacency = city.nodes.map(() => [] as { to: number; edge: number }[]);
  const walkingAdjacency = city.nodes.map(
    () => [] as { to: number; edge: number }[],
  );
  city.edges.forEach((e, edge) => {
    if (city.roads[e.road].kind !== "road") return;
    if (e.direction >= 0) adjacency[e.a].push({ to: e.b, edge });
    if (e.direction <= 0) adjacency[e.b].push({ to: e.a, edge });
    walkingAdjacency[e.a].push({ to: e.b, edge });
    walkingAdjacency[e.b].push({ to: e.a, edge });
  });
  function route(from: Point, toNode: number, walking = false): Point[] {
    const destination = city.nodes[toNode]?.slice(0, 2) as Point | undefined;
    if (destination && distance(from, destination) < 3)
      return [from, destination];
    const near = nearest(from);
    if (!near || near.d > 35) return [];
    const { road, index } = near.segment;
    const starts =
      !walking && road.oneway > 0
        ? [road.nodes[index + 1]]
        : !walking && road.oneway < 0
          ? [road.nodes[index]]
          : [road.nodes[index], road.nodes[index + 1]];
    const cost = new Float64Array(city.nodes.length).fill(Infinity),
      previous = new Int32Array(city.nodes.length).fill(-1),
      heap: { n: number; c: number }[] = [];
    const push = (v: { n: number; c: number }) => {
      heap.push(v);
      let i = heap.length - 1;
      while (i) {
        const p = (i - 1) >> 1;
        if (heap[p].c <= v.c) break;
        heap[i] = heap[p];
        i = p;
      }
      heap[i] = v;
    };
    const pop = () => {
      const top = heap[0],
        last = heap.pop()!;
      if (heap.length) {
        let i = 0;
        while (i * 2 + 1 < heap.length) {
          let child = i * 2 + 1;
          if (child + 1 < heap.length && heap[child + 1].c < heap[child].c)
            child++;
          if (heap[child].c >= last.c) break;
          heap[i] = heap[child];
          i = child;
        }
        heap[i] = last;
      }
      return top;
    };
    for (const n of starts) {
      cost[n] = distance(from, city.nodes[n].slice(0, 2) as Point);
      push({ n, c: cost[n] });
    }
    while (heap.length) {
      const cur = pop();
      if (cur.c > cost[cur.n]) continue;
      if (cur.n === toNode) break;
      for (const e of (walking ? walkingAdjacency : adjacency)[cur.n]) {
        const c = cur.c + city.edges[e.edge].length;
        if (c < cost[e.to]) {
          cost[e.to] = c;
          previous[e.to] = cur.n;
          push({ n: e.to, c });
        }
      }
    }
    if (!Number.isFinite(cost[toNode])) return [];
    const path: Point[] = [];
    let n = toNode;
    while (n >= 0) {
      path.push(city.nodes[n].slice(0, 2) as Point);
      n = previous[n];
    }
    path.reverse();
    return [from, near.point, ...path];
  }
  function entranceRoute(from: Pose, place: Place, airfield = false): Point[] {
    const start = point(from);
    if (clear(start, place.entrance, from.y, airfield))
      return [start, place.entrance];
    if (clear(start, place.parking, from.y, airfield))
      return [start, place.parking, place.entrance];
    const path = route(start, place.roadNode, true);
    return path.length ? [...path, place.parking, place.entrance] : [];
  }
  return {
    city,
    segments,
    localRoads,
    localBuildings,
    water,
    building,
    support,
    walkFits,
    fits,
    rejection,
    clear,
    nearest,
    poseNear,
    exit,
    street,
    route,
    entranceRoute,
  };
}
export type World = ReturnType<typeof buildWorld>;
