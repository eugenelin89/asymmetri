// SPDX-License-Identifier: MIT — original fictional layouts, not operational floor plans.
import type { Interior, Place, Point } from "./types";
export const catalogue = [
  {
    id: "meal",
    name: "Warm noodle bowl / 熱湯麵",
    price: 5,
    description: "Restore 30 health and 40 stamina.",
  },
  {
    id: "medkit",
    name: "Recovery kit",
    price: 9,
    description: "Carry a kit; use it to restore 55 health.",
  },
  {
    id: "insulation",
    name: "Insulated delivery bag",
    price: 28,
    description: "Food stays fresh twice as long.",
  },
  {
    id: "repair",
    name: "Roadside repair kit",
    price: 12,
    description: "Restore 55 vehicle condition.",
  },
  {
    id: "jacket",
    name: "Coral courier jacket",
    price: 18,
    description: "A new colour for your next shift.",
  },
] as const;
const layoutCache = new WeakMap<Place, Interior>();
export function interiorFor(place: Place): Interior {
  const cached = layoutCache.get(place);
  if (cached) return cached;
  const layout = makeLayout(place);
  layoutCache.set(place, layout);
  return layout;
}
function makeLayout(place: Place): Interior {
  if (place.interior === "mall")
    return {
      width: 100,
      depth: 110,
      spawn: [0, 48],
      exit: [0, 51],
      alternateExit: [44, 0],
      pickup: [-32, -32],
      customer: [25, -38],
      shops: [
        { id: "food", name: "Harvest Kitchen · 豐盛小館", point: [-32, -34] },
        { id: "outfit", name: "Courier Supply", point: [32, 15] },
        { id: "care", name: "Neighbour Goods", point: [-32, 14] },
      ],
      obstacles: [
        [-48, -21, -16, -4],
        [16, -21, 48, -4],
        [-48, 24, -16, 38],
        [16, 24, 48, 38],
        [-9, -35, -4, -25],
        [4, -35, 9, -25],
      ],
      zones: [
        { name: "FOOD COURT · 美食廣場", point: [0, -43] },
        { name: "GARDEN GALLERIA", point: [0, 7] },
        { name: "SOUTH ENTRANCE", point: [0, 48] },
      ],
    };
  if (place.interior === "terminal")
    return {
      width: 130,
      depth: 150,
      spawn: [0, 68],
      exit: [0, 71],
      pickup: [-45, -44],
      customer: [36, 38],
      shops: [
        { id: "cafe", name: "Cloud Nine Café · 雲上咖啡", point: [-45, -40] },
        { id: "travel", name: "Pacific Travel Goods", point: [45, -40] },
        { id: "meal", name: "Arrivals Market", point: [-45, 36] },
      ],
      obstacles: [
        [-55, 12, -17, 22],
        [17, 12, 55, 22],
        [-55, -13, -17, -3],
        [17, -13, 55, -3],
        [-22, -58, -16, -27],
        [16, -58, 22, -27],
      ],
      zones: [
        { name: "ARRIVALS · 抵達 / MEETING POINT", point: [25, 48] },
        { name: "DEPARTURES · 出發", point: [0, -17] },
        { name: "PASSENGER CONCOURSE", point: [0, -61] },
        { name: "BAGGAGE CLAIM", point: [-36, 7] },
      ],
    };
  if (place.interior === "office")
    return {
      width: 36,
      depth: 38,
      spawn: [0, 15],
      exit: [0, 17],
      pickup: [-11, -10],
      customer: [11, -10],
      shops: [
        {
          id: "supplies",
          name:
            place.id === "airport-office"
              ? "Airfield Crew Supplies"
              : "Courier Supply",
          point: [-11, -10],
        },
      ],
      obstacles: [
        [-14, -4, -5, 3],
        [5, -4, 14, 3],
      ],
      zones: [
        {
          name:
            place.id === "airport-office"
              ? "FICTIONAL AIRPORT OPERATIONS"
              : "WAREHOUSE DISPATCH",
          point: [0, -14],
        },
      ],
    };
  if (place.interior === "lobby")
    return {
      width: 26,
      depth: 30,
      spawn: [0, 11],
      exit: [0, 13],
      pickup: [-8, -8],
      customer: [8, -8],
      shops: [],
      obstacles: [[-10, -3, -5, 3]],
      zones: [{ name: "RESIDENT MEETING LOBBY", point: [0, -11] }],
    };
  return {
    width: 28,
    depth: 32,
    spawn: [0, 12],
    exit: [0, 14],
    pickup: [-8, -10],
    customer: [8, -6],
    shops: [{ id: "counter", name: place.label, point: [8, -9] }],
    obstacles: [
      [-11, -2, -4, 3],
      [4, -2, 11, 3],
    ],
    zones: [{ name: place.label, point: [0, -13] }],
  };
}
const fixtureCache = new WeakMap<
  Interior,
  [number, number, number, number][]
>();
export function interiorFixtures(
  interior: Interior,
): [number, number, number, number][] {
  const cached = fixtureCache.get(interior);
  if (cached) return cached;
  const fixtures: [number, number, number, number][] = interior.shops.map(
    (s) => [
      s.point[0] - 5,
      s.point[1] - 2.65,
      s.point[0] + 5,
      s.point[1] - 0.95,
    ],
  );
  for (let z = -interior.depth * 0.35; z < interior.depth * 0.4; z += 15)
    for (const x of [-interior.width * 0.39, interior.width * 0.39])
      fixtures.push([x - 2, z - 0.65, x + 2, z + 0.75]);
  if (interior.width === 100) fixtures.push([-3.5, 6.5, 3.5, 13.5]);
  fixtureCache.set(interior, fixtures);
  return fixtures;
}
export function interiorFits(p: Point, interior: Interior, r = 0.45) {
  return (
    Math.abs(p[0]) < interior.width / 2 - r &&
    Math.abs(p[1]) < interior.depth / 2 - r &&
    ![...interior.obstacles, ...interiorFixtures(interior)].some(
      ([a, b, c, d]) =>
        p[0] > a - r && p[0] < c + r && p[1] > b - r && p[1] < d + r,
    )
  );
}

/** Small four-neighbour floor grid; segment validation keeps endpoints off fixtures. */
export function interiorRoute(
  from: Point,
  to: Point,
  layout: Interior,
): Point[] {
  const key = (p: Point) => p.join(","),
    grid = 2;
  const clear = (a: Point, b: Point) => {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let d = 0; d <= length; d += 0.25) {
      const t = length ? d / length : 0;
      if (
        !interiorFits(
          [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
          layout,
        )
      )
        return false;
    }
    return interiorFits(b, layout);
  };
  if (clear(from, to)) return [from, to];
  const snap = (p: Point): Point | null => {
    const options: Point[] = [];
    for (let x = -2; x <= 2; x++)
      for (let z = -2; z <= 2; z++)
        options.push([
          Math.round(p[0] / grid) + x,
          Math.round(p[1] / grid) + z,
        ]);
    options.sort(
      (a, b) =>
        Math.hypot(a[0] * grid - p[0], a[1] * grid - p[1]) -
        Math.hypot(b[0] * grid - p[0], b[1] * grid - p[1]),
    );
    return (
      options.find(
        (q) =>
          interiorFits([q[0] * grid, q[1] * grid], layout, 0.7) &&
          clear(p, [q[0] * grid, q[1] * grid]),
      ) ?? null
    );
  };
  const start = snap(from),
    goal = snap(to);
  if (!start || !goal) return [];
  const queue = [start],
    previous = new Map<string, Point | null>([[key(start), null]]);
  let found: Point | null = null;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (key(p) === key(goal)) {
      found = p;
      break;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const next: Point = [p[0] + dx, p[1] + dz];
      if (
        !previous.has(key(next)) &&
        interiorFits([next[0] * grid, next[1] * grid], layout, 0.7) &&
        clear([p[0] * grid, p[1] * grid], [next[0] * grid, next[1] * grid])
      ) {
        previous.set(key(next), p);
        queue.push(next);
      }
    }
  }
  if (!found) return [];
  const path: Point[] = [to];
  for (let p: Point | null = found; p; p = previous.get(key(p)) ?? null)
    path.push([p[0] * grid, p[1] * grid]);
  path.push(from);
  path.reverse();
  return path.filter(
    (p, i) =>
      i === 0 ||
      i === path.length - 1 ||
      (p[0] - path[i - 1][0]) * (path[i + 1][1] - p[1]) !==
        (p[1] - path[i - 1][1]) * (path[i + 1][0] - p[0]),
  );
}
