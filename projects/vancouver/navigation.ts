// Local routing and optional scenic cruise. All geometry is the validated city graph.
import type { City, DriveRoute, Point2, RoadGraph } from "./types";
import type { CarState } from "./physics";

export const distance = (a: Point2, b: Point2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const angleDifference = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
export const streetName = (name: string) => name.replace(/^\d+(?:-\d+)?\s+/, "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bAv\b/g, "Ave");
type Vertex = { point: Point2; street: string };

export function createNavigator(city: City, fits: (pose: Pick<CarState, "x" | "z" | "yaw">) => boolean, includeBendCues = false) {
  if (!city.graph) throw new Error("The local street graph is unavailable.");
  const graph: RoadGraph = city.graph;
  const adjacent = graph.nodes.map(() => [] as { to: number; edge: number }[]);
  graph.edges.forEach((edge, i) => { adjacent[edge.a].push({ to: edge.b, edge: i }); adjacent[edge.b].push({ to: edge.a, edge: i }); });
  function shortest(from: number, to: number): { points: Vertex[]; cost: number } | null {
    const costs = graph.nodes.map(() => Infinity), previous = new Map<number, { node: number; edge: number }>(), open = new Set([from]); costs[from] = 0;
    while (open.size) {
      const current = [...open].reduce((a, b) => costs[a] < costs[b] ? a : b); open.delete(current);
      if (current === to) break;
      for (const next of adjacent[current]) {
        const cost = costs[current] + graph.edges[next.edge].length;
        if (cost < costs[next.to]) { costs[next.to] = cost; previous.set(next.to, { node: current, edge: next.edge }); open.add(next.to); }
      }
    }
    if (!Number.isFinite(costs[to])) return null;
    const legs: Vertex[][] = []; let current = to;
    while (current !== from) {
      const item = previous.get(current)!; const edge = graph.edges[item.edge];
      const points = current === edge.b ? edge.points : [...edge.points].reverse();
      legs.unshift(points.map((point) => ({ point, street: streetName(edge.name) }))); current = item.node;
    }
    return { points: legs.flat(), cost: costs[to] };
  }
  function finish(vertices: Vertex[], title: string, loop: boolean, destination?: string): DriveRoute {
    const raw = vertices.filter((p, i) => !i || distance(p.point, vertices[i - 1].point) > .02);
    if (raw.length < 2) throw new Error("You are already at this roadside stop.");
    // Survey centrelines sometimes meet the opposite side of an intersection
    // a few metres apart (Manitoba / 1st). Guide a checked gentle offset through
    // its pavement instead of demanding two immediate right-angle turns.
    for (let i = 1; i < raw.length - 2; i++) {
      const a = raw[i - 1].point, b = raw[i].point, c = raw[i + 1].point, d = raw[i + 2].point;
      const incoming = Math.atan2(b[0] - a[0], b[1] - a[1]), outgoing = Math.atan2(d[0] - c[0], d[1] - c[1]);
      const join = distance(b, c), before = distance(a, b), after = distance(c, d);
      if (join < 1 || join > 18 || before < 25 || after < 25 || Math.abs(angleDifference(incoming, outgoing)) > .25) continue;
      const enter: Point2 = [b[0] - Math.sin(incoming) * 13, b[1] - Math.cos(incoming) * 13];
      const exit: Point2 = [c[0] + Math.sin(outgoing) * 13, c[1] + Math.cos(outgoing) * 13];
      const yaw = Math.atan2(exit[0] - enter[0], exit[1] - enter[1]), steps = Math.ceil(distance(enter, exit));
      if (Array.from({ length: steps + 1 }, (_, n) => n / steps).every((t) => fits({ x: enter[0] + (exit[0] - enter[0]) * t, z: enter[1] + (exit[1] - enter[1]) * t, yaw }))) {
        raw[i] = { point: enter, street: raw[i].street }; raw[i + 1] = { point: exit, street: raw[i + 2].street }; i++;
      }
    }
    const smooth: Vertex[] = [raw[0]], turnIndices: { index: number; direction: string; street: string }[] = [];
    for (let i = 1; i < raw.length - 1; i++) {
      const a = raw[i - 1].point, b = raw[i].point, c = raw[i + 1].point;
      const before = distance(a, b), after = distance(b, c);
      const angle = angleDifference(Math.atan2(c[0] - b[0], c[1] - b[1]), Math.atan2(b[0] - a[0], b[1] - a[1]));
      const trim = Math.min(11, before * .38, after * .38);
      const enter: Point2 = [b[0] + (a[0] - b[0]) * trim / before, b[1] + (a[1] - b[1]) * trim / before];
      const exit: Point2 = [b[0] + (c[0] - b[0]) * trim / after, b[1] + (c[1] - b[1]) * trim / after];
      const curve: Vertex[] = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12, x = (1 - t) ** 2 * enter[0] + 2 * (1 - t) * t * b[0] + t * t * exit[0], z = (1 - t) ** 2 * enter[1] + 2 * (1 - t) * t * b[1] + t * t * exit[1];
        curve.push({ point: [x, z], street: t < .5 ? raw[i].street : raw[i + 1].street });
      }
      const clear = curve.every((p, n) => { const next = curve[Math.min(n + 1, curve.length - 1)].point; return fits({ x: p.point[0], z: p.point[1], yaw: Math.atan2(next[0] - p.point[0], next[1] - p.point[1]) }); });
      if (Math.abs(angle) > .5 || (includeBendCues && Math.abs(angle) > .16 && before > 12 && after > 12)) {
        const direction = Math.abs(angle) > 2.5 ? "Turn around" : Math.abs(angle) <= .5 ? (angle > 0 ? "Bear left" : "Bear right") : angle > 0 ? "Left" : "Right";
        turnIndices.push({ index: smooth.length + (clear ? 6 : 0), direction, street: raw[i + 1].street });
      }
      smooth.push(...(clear && Math.abs(angle) > .05 ? curve : [raw[i]]));
    }
    smooth.push(raw[raw.length - 1]);
    const points = smooth.map((p) => p.point), distances = [0];
    for (let i = 1; i < points.length; i++) distances.push(distances[i - 1] + distance(points[i - 1], points[i]));
    return { points, distances, length: distances.at(-1)!, turns: turnIndices.map((t) => ({ at: distances[Math.min(t.index, distances.length - 1)], direction: t.direction, street: t.street })), title, loop, destination };
  }
  function scenic(reverse = false): DriveRoute {
    const stops = [...(city.scenicWaypoints ?? [])]; if (reverse) stops.reverse();
    const vertices: Vertex[] = [];
    for (let i = 1; i < stops.length; i++) {
      const leg = shortest(stops[i - 1], stops[i]); if (!leg) throw new Error("This scenic route is unavailable."); vertices.push(...leg.points);
    }
    return finish(vertices, reverse ? "False Creek loop · reverse" : "False Creek loop", true);
  }
  function drive(id: string, reverse = false): DriveRoute {
    const selected = city.drives?.find((item) => item.id === id);
    if (!selected) throw new Error("Choose an available drive.");
    const stops = [...selected.waypoints]; if (reverse) stops.reverse();
    const vertices: Vertex[] = [];
    for (let i = 1; i < stops.length; i++) {
      const leg = shortest(stops[i - 1], stops[i]);
      if (!leg) throw new Error("These streets are disconnected. Choose another start.");
      vertices.push(...leg.points);
    }
    return { ...finish(vertices, selected.title + (reverse ? " · reverse" : ""), false), driveId: id };
  }
  function nearest(p: Point2) {
    let best = { edge: 0, segment: 0, t: 0, point: graph.nodes[0], distance: Infinity };
    graph.edges.forEach((edge, e) => edge.points.slice(1).forEach((b, i) => {
      const a = edge.points[i], dx = b[0] - a[0], dz = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1)));
      const point: Point2 = [a[0] + t * dx, a[1] + t * dz], d = distance(p, point);
      if (d < best.distance) best = { edge: e, segment: i, t, point, distance: d };
    })); return best;
  }
  function navigatePoint(from: Point2, target: Point2, title = "Your roadside destination", id?: string): DriveRoute {
    const start = nearest(from), end = nearest(target);
    // Do not silently jump a disconnected pocket onto another street through a
    // building or shoreline. The join from the actual car must fit continuously.
    const yaw = Math.atan2(start.point[0] - from[0], start.point[1] - from[1]);
    const steps = Math.max(1, Math.ceil(start.distance));
    if (start.distance > 12 || Array.from({ length: steps + 1 }, (_, i) => i / steps).some((t) => !fits({ x: from[0] + (start.point[0] - from[0]) * t, z: from[1] + (start.point[1] - from[1]) * t, yaw }))) {
      throw new Error("This street is outside the connected route network. Recover the car or choose another drive.");
    }
    if (!id && end.distance > 35) throw new Error("Choose a ground street on the map. Water, bridges and buildings are not destinations.");
    const startEdge = graph.edges[start.edge], endEdge = graph.edges[end.edge];
    const options: { vertices: Vertex[]; length: number }[] = [];
    const vertex = (points: Point2[], name: string) => points.map((point) => ({ point, street: streetName(name) }));
    if (start.edge === end.edge) {
      const forward = start.segment < end.segment || (start.segment === end.segment && start.t <= end.t);
      const middle = startEdge.points.slice(Math.min(start.segment, end.segment) + 1, Math.max(start.segment, end.segment) + 1);
      const points = [start.point, ...(forward ? middle : middle.reverse()), end.point];
      options.push({ vertices: vertex(points, startEdge.name), length: points.slice(1).reduce((s, p, i) => s + distance(points[i], p), 0) });
    }
    for (const s of [startEdge.a, startEdge.b]) for (const e of [endEdge.a, endEdge.b]) {
      const leg = shortest(s, e); if (!leg) continue;
      const first = s === startEdge.a ? [start.point, ...startEdge.points.slice(0, start.segment + 1).reverse()] : [start.point, ...startEdge.points.slice(start.segment + 1)];
      const last = e === endEdge.a ? [...endEdge.points.slice(0, end.segment + 1), end.point] : [...endEdge.points.slice(end.segment + 1).reverse(), end.point];
      const vertices = [...vertex(first, startEdge.name), ...leg.points, ...vertex(last, endEdge.name)];
      options.push({ vertices, length: vertices.slice(1).reduce((sum, p, i) => sum + distance(vertices[i].point, p.point), 0) });
    }
    options.sort((a, b) => a.length - b.length);
    if (!options.length) throw new Error("No connected ground-street route. Try a nearby start.");
    return finish(options[0].vertices, title, false, id);
  }
  function navigate(from: Point2, id: string, title: string): DriveRoute {
    return navigatePoint(from, city.anchors[id], title, id);
  }
  return { scenic, drive, navigate, navigatePoint, shortest };
}

export function pointAt(route: DriveRoute, position: number): Point2 {
  const d = Math.max(0, Math.min(route.length, position));
  let i = 1; while (i < route.distances.length - 1 && route.distances[i] < d) i++;
  const a = route.points[i - 1], b = route.points[i], t = (d - route.distances[i - 1]) / (route.distances[i] - route.distances[i - 1] || 1);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
export function projectRoute(route: DriveRoute, point: Point2, previous?: number): { progress: number; distance: number } {
  let best = { progress: 0, distance: Infinity };
  for (let i = 1; i < route.points.length; i++) {
    if (previous !== undefined && (route.distances[i] < previous - 60 || route.distances[i - 1] > previous + 80)) continue;
    const a = route.points[i - 1], b = route.points[i], dx = b[0] - a[0], dz = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dz) / (dx * dx + dz * dz || 1)));
    const d = distance(point, [a[0] + t * dx, a[1] + t * dz]);
    if (d < best.distance) best = { progress: route.distances[i - 1] + t * (route.distances[i] - route.distances[i - 1]), distance: d };
  }
  return best.distance > 35 && previous !== undefined ? projectRoute(route, point) : best;
}
export function cruiseInput(car: CarState, route: DriveRoute, progress: number) {
  const aheadAt = (d: number) => pointAt(route, route.loop ? d % route.length : d);
  const target = aheadAt(progress + Math.max(4, Math.abs(car.speed) * .6));
  const heading = Math.atan2(target[0] - car.x, target[1] - car.z), alpha = angleDifference(heading, car.yaw);
  const length = Math.max(1, Math.hypot(target[0] - car.x, target[1] - car.z));
  const wheel = Math.atan2(2 * 2.65 * Math.sin(alpha), length);
  const steering = Math.max(-1, Math.min(1, wheel * (1 + Math.abs(car.speed) / 22) / .72));
  const ahead = aheadAt(progress + 22), near = aheadAt(progress + 4);
  const bend = Math.abs(angleDifference(Math.atan2(ahead[0] - near[0], ahead[1] - near[1]), car.yaw));
  let targetSpeed = Math.max(4.2, 12 - bend * 9);
  if (!route.loop) targetSpeed = Math.min(targetSpeed, Math.max(0, (route.length - progress - 2) * .7));
  return { steering, throttle: car.speed < targetSpeed - .35 ? 1 : 0, brake: car.speed > targetSpeed + .7, targetSpeed };
}
