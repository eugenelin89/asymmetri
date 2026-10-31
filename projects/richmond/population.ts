// SPDX-License-Identifier: MIT — bounded local actors, independent of demographic identity.
import type { City, Point, Pose } from "./types";
import { distance, point, type World } from "./world";
import { penetration } from "./collision";
export type Actor = Pose & {
  id: number;
  color: number;
  speed: number;
  phase: number;
  a: Point;
  b: Point;
  t: number;
  direction: number;
  edge: number;
  wait: number;
  activity: string;
  vehicle: boolean;
  skin: number;
  stature: number;
};
const colours = [
  0xc85b49, 0x4d8894, 0xe3b54b, 0x8270a1, 0x5c8870, 0xcb8c63, 0x3d5869,
  0xd5c5a0,
];
export function createPopulation(city: City, world: World) {
  let pedestrians: Actor[] = [],
    traffic: Actor[] = [],
    centre: Point = [Infinity, Infinity],
    interiorId: string | null = null,
    lastDensity = 0,
    generation = -1;
  const adj = city.nodes.map(() => [] as { edge: number; direction: number }[]);
  city.edges.forEach((e, i) => {
    if (city.roads[e.road].kind !== "road") return;
    if (e.direction >= 0) adj[e.a].push({ edge: i, direction: 1 });
    if (e.direction <= 0) adj[e.b].push({ edge: i, direction: -1 });
  });
  const base = (id: number): Actor => ({
    id,
    vehicle: false,
    skin: [0xe0b896, 0xc79571, 0xac7753, 0x8a593e, 0xf0ceb0, 0xcba47d][id % 6],
    stature: id % 11 === 0 ? 0.76 : id % 7 === 0 ? 0.93 : 1,
    color: colours[id % colours.length],
    speed: 0,
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    phase: id * 1.7,
    a: [0, 0],
    b: [0, 0],
    t: (id * 0.618) % 1,
    direction: 1,
    edge: 0,
    wait: 0,
    activity: [
      "walking",
      "shopping",
      "waiting",
      "luggage",
      "meeting",
      "working",
      "sitting",
      "eating",
    ][id % 8],
  });
  function configure(
    p: Point,
    density: number,
    interior: {
      id: string;
      width: number;
      depth: number;
      fits: (p: Point) => boolean;
      staff?: Point[];
    } | null,
  ) {
    if (
      distance(p, centre) < 130 &&
      interiorId === (interior?.id ?? null) &&
      lastDensity === density
    )
      return;
    const retain = !interior && interiorId === null && lastDensity === density;
    const retainedPeople = retain
      ? pedestrians.filter((a) => distance(point(a), p) < 85)
      : [];
    const retainedTraffic = retain
      ? traffic.filter((a) => distance(point(a), p) < 85)
      : [];
    generation++;
    centre = [...p];
    lastDensity = density;
    interiorId = interior?.id ?? null;
    pedestrians = retainedPeople;
    traffic = retainedTraffic;
    const place = city.places.reduce((a, b) =>
      distance(a.entrance, p) < distance(b.entrance, p) ? a : b,
    );
    const district = distance(place.entrance, p) < 650 ? place.district : "";
    const activityDensity = interior
      ? 1
      : [
            "City Centre",
            "Golden Village",
            "Sea Island",
            "Steveston",
            "Bridgeport",
          ].includes(district)
        ? 1.1
        : district === "East Richmond" || district === "Hamilton"
          ? 0.65
          : 0.8;
    const count = Math.round(
      (interior
        ? Math.min(96, Math.max(12, (interior.width * interior.depth) / 100))
        : 96) *
        density *
        activityDensity,
    );
    if (interior) {
      for (let i = 0; i < count; i++) {
        const a = base(i);
        a.a = [
          (((i * 0.61803398875) % 1) - 0.5) * interior.width * 0.8,
          (((i * 0.41421356237) % 1) - 0.5) * interior.depth * 0.8,
        ];
        a.b = [a.a[0] + Math.sin(i) * 9, a.a[1] + Math.cos(i) * 13];
        if (!interior.fits(a.a) || !interior.fits(a.b)) {
          a.a = [
            ((i % 5) - 2) * 1.5,
            interior.depth * (i / count - 0.5) * 0.75,
          ];
          a.b = [a.a[0] + 1, Math.min(interior.depth / 2 - 4, a.a[1] + 12)];
        }
        if (["sitting", "eating"].includes(a.activity)) {
          const z =
            -interior.depth * 0.35 +
            (i % Math.max(1, Math.floor((interior.depth * 0.75) / 15))) * 15;
          a.a = [interior.width * 0.39 * (i % 2 ? 1 : -1), z + 1.4];
          a.b = [...a.a];
          a.t = 0;
        }
        const staff = interior.staff?.[i];
        if (staff && interior.fits(staff)) {
          a.a = [...staff];
          a.b = [...staff];
          a.t = 0;
          a.activity = "working";
          a.wait = 999;
          a.stature = 1;
          a.color = 0x537e79;
        }
        a.x = a.a[0];
        a.z = a.a[1];
        pedestrians.push(a);
      }
      return;
    }
    const near = world.segments.filter(
      (s) =>
        s.road.kind === "road" &&
        !s.road.bridge &&
        Math.min(distance(s.a, p), distance(s.b, p)) < 330 &&
        distance(s.a, s.b) > 12,
    );
    for (
      let i = 0;
      pedestrians.length < count && i < count && near.length;
      i++
    ) {
      const s = near[i % near.length],
        a = base(i + generation * 1000),
        dx = s.b[0] - s.a[0],
        dz = s.b[1] - s.a[1],
        length = Math.hypot(dx, dz),
        side = i % 2 ? 1 : -1,
        offset = s.road.width / 2 + 1.2;
      a.a = [
        s.a[0] - (dz / length) * offset * side,
        s.a[1] + (dx / length) * offset * side,
      ];
      a.b = [
        s.b[0] - (dz / length) * offset * side,
        s.b[1] + (dx / length) * offset * side,
      ];
      a.x = a.a[0] + (a.b[0] - a.a[0]) * a.t;
      a.z = a.a[1] + (a.b[1] - a.a[1]) * a.t;
      if (
        world.walkFits(point(a), 0, false) &&
        distance(point(a), p) > (retain && retainedPeople.length ? 85 : 8) &&
        !city.places.some((place) => distance(place.entrance, point(a)) < 4) &&
        !pedestrians.some((b) => distance(point(a), point(b)) < 1.2)
      ) {
        a.y = 0;
        pedestrians.push(a);
      }
    }
    const edges = city.edges
      .map((e, i) => ({ e, i }))
      .filter(
        ({ e }) =>
          city.roads[e.road].kind === "road" &&
          e.length > 15 &&
          distance(city.nodes[e.a].slice(0, 2) as Point, p) < 450,
      );
    for (
      let i = 0;
      traffic.length < Math.round(28 * density * activityDensity) &&
      i < Math.round(28 * density * activityDensity) &&
      edges.length;
      i++
    ) {
      const { e, i: edge } = edges[(i * 7) % edges.length],
        a = base(i + 200 + generation * 1000);
      a.vehicle = true;
      a.edge = edge;
      a.direction = e.direction < 0 ? -1 : 1;
      a.t = (i * 0.371) % 1;
      // Park at a usable curb on wide streets; never block a narrow access lane.
      a.wait = i % 5 === 0 && city.roads[e.road].width >= 8 ? 999 : 0;
      positionCar(a);
      if (
        world.fits(a, false) &&
        distance(point(a), p) > (retain && retainedTraffic.length ? 85 : 12) &&
        !traffic.some((b) => penetration(a, b) > 0)
      )
        traffic.push(a);
    }
  }
  function positionCar(a: Actor) {
    const e = city.edges[a.edge],
      start = city.nodes[a.direction > 0 ? e.a : e.b],
      end = city.nodes[a.direction > 0 ? e.b : e.a],
      dx = end[0] - start[0],
      dz = end[1] - start[1],
      length = Math.hypot(dx, dz) || 1,
      offset =
        a.wait > 20
          ? city.roads[e.road].width / 2 - 1.1
          : Math.min(2.3, city.roads[e.road].width * 0.22);
    a.x = start[0] + dx * a.t - (dz / length) * offset;
    a.z = start[1] + dz * a.t + (dx / length) * offset;
    a.y = start[2] + (end[2] - start[2]) * a.t;
    a.yaw = Math.atan2(dx, dz);
  }
  function step(
    dt: number,
    elapsed: number,
    hero: Pose,
    car: Pose,
    fitsInterior?: (p: Point) => boolean,
  ) {
    for (const a of pedestrians) {
      const length = distance(a.a, a.b) || 1;
      const idle =
        a.wait > 20 ||
        ["waiting", "sitting", "eating"].includes(a.activity) ||
        Math.sin(elapsed * 0.13 + a.id) > 0.94;
      const speed = idle ? 0 : 1.1 + (a.id % 4) * 0.13;
      let t = a.t + ((dt * speed) / length) * a.direction;
      if (t > 1 || t < 0) {
        a.direction *= -1;
        t = Math.max(0, Math.min(1, t));
      }
      const p: Point = [
        a.a[0] + (a.b[0] - a.a[0]) * t,
        a.a[1] + (a.b[1] - a.a[1]) * t,
      ];
      const close =
        pedestrians.some((b) => b.id < a.id && distance(point(b), p) < 0.7) ||
        distance(point(hero), p) < 1.4 ||
        (!interiorId && distance(point(car), p) < 3);
      if (
        !close &&
        (fitsInterior ? fitsInterior(p) : world.walkFits(p, a.y, false))
      ) {
        a.x = p[0];
        a.z = p[1];
        a.t = t;
        a.speed = speed;
        a.yaw = Math.atan2(
          (a.b[0] - a.a[0]) * a.direction,
          (a.b[1] - a.a[1]) * a.direction,
        );
      } else {
        a.speed = 0;
        if (!close) a.direction *= -1;
      }
    }
    const retired = new Set<number>();
    for (const a of traffic) {
      if (a.wait > 20) continue;
      const old = { ...a };
      const e = city.edges[a.edge],
        nearEnd = (1 - a.t) * e.length < 15;
      const signal =
        nearEnd &&
        adj[a.direction > 0 ? e.b : e.a].length > 2 &&
        Math.floor(elapsed / 9) % 2 === a.edge % 2;
      const nose: Point = [
        a.x + Math.sin(a.yaw) * 7,
        a.z + Math.cos(a.yaw) * 7,
      ];
      const obstacle =
        (Math.abs(a.y - car.y) < 2 && distance(nose, point(car)) < 7) ||
        (Math.abs(a.y - hero.y) < 2 && distance(nose, point(hero)) < 5) ||
        traffic.some(
          (b) =>
            b !== a && Math.abs(b.y - a.y) < 2 && distance(nose, point(b)) < 5,
        ) ||
        pedestrians.some(
          (b) => Math.abs(b.y - a.y) < 2 && distance(nose, point(b)) < 3,
        );
      a.speed = signal || obstacle ? 0 : 7;
      a.wait = a.speed ? 0 : a.wait + dt;
      if (a.wait > 15 && !signal) {
        // Recycle distant jammed actors on the next district refresh. Never
        // leave a failed turn as a permanent parked obstacle in an access lane.
        if (distance(point(a), point(hero)) > 60) retired.add(a.id);
        a.wait = 0;
        continue;
      }
      if (a.speed === 0) continue;
      a.t += (a.speed * dt) / e.length;
      if (a.t >= 1) {
        const node = a.direction > 0 ? e.b : e.a,
          options = adj[node].filter((o) => o.edge !== a.edge),
          next = options[(a.id + Math.floor(elapsed)) % options.length];
        if (next) {
          a.edge = next.edge;
          a.direction = next.direction;
          a.t = 0;
        } else if (e.direction === 0) {
          a.direction *= -1;
          a.t = 0;
        } else {
          a.t = 0.98;
          a.speed = 0;
        }
      }
      positionCar(a);
      const yawDelta = Math.atan2(
        Math.sin(a.yaw - old.yaw),
        Math.cos(a.yaw - old.yaw),
      );
      const steps = Math.max(
        1,
        Math.ceil(distance(point(old), point(a)) / 0.15),
        Math.ceil(Math.abs(yawDelta) / 0.04),
      );
      let blocked = false;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps,
          pose = {
            x: old.x + (a.x - old.x) * t,
            z: old.z + (a.z - old.z) * t,
            y: old.y + (a.y - old.y) * t,
            yaw: old.yaw + yawDelta * t,
          };
        if (
          !world.fits(pose, false) ||
          penetration(pose, { ...car, vehicle: true }) > 0 ||
          penetration(pose, { ...hero, vehicle: false }) > 0 ||
          traffic.some((b) => b !== a && penetration(pose, b) > 0) ||
          pedestrians.some((b) => penetration(pose, b) > 0)
        ) {
          blocked = true;
          break;
        }
      }
      if (blocked) {
        Object.assign(a, old);
        a.speed = 0;
        a.wait += dt;
        if (distance(point(a), point(hero)) > 80) retired.add(a.id);
      }
    }
    traffic = traffic.filter((a) => !retired.has(a.id));
  }
  return {
    get pedestrians() {
      return pedestrians;
    },
    get traffic() {
      return traffic;
    },
    configure,
    step,
  };
}
