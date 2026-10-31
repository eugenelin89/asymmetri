// SPDX-License-Identifier: MIT — local routing on source-supported roads only.
import type { Point } from "./types";
import type { Body } from "./vehicle";
import { distance } from "./world";

export type RoadNode = { id: string; point: Point };
export type RoadEdge = { id: string; from: string; to: string; roadName: string; points: Point[]; lengthM: number; sourceIndex: number };
export type RoadStop = { id: string; name: string; point: Point; yaw: number; foot: Point; kind: "parking" | "stopping"; roadName: string; distanceToLandmarkM: number };
export type RoadNetwork = { nodes: RoadNode[]; edges: RoadEdge[]; destinations: RoadStop[]; turns?: string[] };
export type DriveRoute = { points: Point[]; distances: number[]; length: number; edges: string[]; names: string[]; turns: { at: number; direction: "left" | "right"; street: string }[] };
export type Navigation = {
  destination: string | null; status: "idle" | "guiding" | "arrived" | "unreachable";
  route: DriveRoute | null; remaining: number; instruction: string; arrow: "↑" | "←" | "→" | "✓";
  reroutes: number; revision: number;
};
export const newNavigation = (): Navigation => ({ destination: null, status: "idle", route: null, remaining: 0, instruction: "Choose a roadside stop on the map", arrow: "↑", reroutes: 0, revision: 0 });
const angle = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const bearing = (a: Point, b: Point) => Math.atan2(b[0] - a[0], b[1] - a[1]);
export function projectPath(points: Point[], p: Point) {
  let best = { index: 0, t: 0, point: points[0], distance: Infinity, progress: 0 }, length = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], len = distance(a, b);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / (len * len || 1)));
    const point: Point = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], d = distance(point, p);
    if (d < best.distance) best = { index: i - 1, t, point, distance: d, progress: length + t * len };
    length += len;
  }
  return best;
}
/** Reject impossible sharp corners rather than drawing a route through them. */
function prepareRoad(points: Point[], fits: (p: Body) => boolean): { clean: Point[]; smooth: Point[] } | null {
  const clean = points.filter((p, i) => !i || distance(points[i - 1], p) > .03).map(p => [...p] as Point);
  const segmentFits = (a: Point, b: Point) => {
    const len = distance(a, b), yaw = bearing(a, b), count = Math.max(1, Math.ceil(len / .2));
    for (let i = 0; i <= count; i++) if (!fits({x:a[0]+(b[0]-a[0])*i/count, z:a[1]+(b[1]-a[1])*i/count, yaw})) return false;
    return true;
  };
  // A lattice can leave a sub-metre kink at a source endpoint. Remove only a
  // kink whose replacement segment continuously supports the actual body.
  let changed = true;
  while (changed && clean.length > 2) {
    changed = false;
    for (let i = 1; i < clean.length - 1; i++) {
      const turn = Math.abs(angle(bearing(clean[i], clean[i+1]), bearing(clean[i-1], clean[i])));
      if ((turn < .01 || Math.min(distance(clean[i-1],clean[i]),distance(clean[i],clean[i+1])) < 3) && segmentFits(clean[i-1],clean[i+1])) {
        clean.splice(i,1); changed=true; break;
      }
    }
  }
  if (clean.length < 2) return { clean, smooth: clean };
  const out: Point[] = [clean[0]];
  for (let i = 1; i < clean.length - 1; i++) {
    const a=clean[i-1],b=clean[i],c=clean[i+1],la=distance(a,b),lb=distance(b,c);
    const u:Point=[(b[0]-a[0])/la,(b[1]-a[1])/la],v:Point=[(c[0]-b[0])/lb,(c[1]-b[1])/lb];
    const delta=Math.atan2(u[0]*v[1]-u[1]*v[0],u[0]*v[0]+u[1]*v[1]);
    if(Math.abs(delta)<.01){out.push(b);continue;}
    if(Math.abs(delta)>2.5)return null;
    let found:Point[]|null=null;
    for(const radius of [12,8,6,4.8,4.2]) {
      const trim=radius*Math.tan(Math.abs(delta)/2);
      if(trim>Math.min(la,lb)*.45)continue;
      const start:Point=[b[0]-u[0]*trim,b[1]-u[1]*trim],sign=Math.sign(delta);
      const centre:Point=[start[0]-u[1]*radius*sign,start[1]+u[0]*radius*sign];
      const first=Math.atan2(start[1]-centre[1],start[0]-centre[0]),count=Math.max(2,Math.ceil(Math.abs(delta)*radius/.15));
      const arc:Point[]=[];let safe=true;
      for(let k=0;k<=count;k++){
        const theta=first+delta*k/count,p:Point=[centre[0]+radius*Math.cos(theta),centre[1]+radius*Math.sin(theta)];
        const yaw=Math.atan2(-Math.sin(theta)*sign,Math.cos(theta)*sign);
        if(!fits({x:p[0],z:p[1],yaw})){safe=false;break;}
        arc.push(p);
      }
      if(safe){found=arc;break;}
    }
    if(!found)return null;
    out.push(...found);
  }
  out.push(clean.at(-1)!);
  // Check the straight joins as well as the curved samples.
  return out.every((p,i)=>!i||segmentFits(out[i-1],p))?{ clean, smooth: out }:null;
}

export function roundRoad(points: Point[], fits: (p: Body) => boolean): Point[] | null {
  return prepareRoad(points, fits)?.smooth ?? null;
}

export function createNavigator(network: RoadNetwork, fits: (p: Body) => boolean) {
  type Leg = { edge: RoadEdge; from: string; to: string; points: Point[]; key: string };
  const adjacent = new Map<string, Leg[]>(), legs = new Map<string, Leg>();
  for (const edge of network.edges) for (const reverse of [false, true]) {
    const from = reverse ? edge.to : edge.from, to = reverse ? edge.from : edge.to;
    const leg = { edge, from, to, points: reverse ? [...edge.points].reverse() : edge.points, key: `${edge.id}:${reverse ? 1 : 0}` };
    adjacent.set(from, [...(adjacent.get(from) ?? []), leg]); legs.set(leg.key, leg);
  }
  const turns = new Map<string, boolean>();
  const validatedTurns = network.turns ? new Set(network.turns) : null;
  function tail(points: Point[], length = 35): Point[] {
    const result = [points.at(-1)!]; let remaining = length;
    for (let i = points.length - 2; i >= 0; i--) {
      const a = points[i], b = result[0], d = distance(a,b);
      if (d >= remaining) { result.unshift([b[0]+(a[0]-b[0])*remaining/d,b[1]+(a[1]-b[1])*remaining/d]); break; }
      result.unshift(a); remaining -= d;
    }
    return result;
  }
  function canTurn(a: Leg, b: Leg) {
    if (a.edge.id === b.edge.id) return false;
    const key = `${a.key}>${b.key}`;
    if (validatedTurns) return validatedTurns.has(key);
    if (!turns.has(key)) turns.set(key, !!roundRoad([...tail(a.points), ...tail([...b.points].reverse()).reverse().slice(1)], fits));
    return turns.get(key)!;
  }
  function nearest(p: Point, blocked: ReadonlySet<string>) {
    return network.edges.filter(e => !blocked.has(e.id)).map(edge => ({ edge, ...projectPath(edge.points, p) })).sort((a, b) => a.distance - b.distance);
  }
  function finish(points: Point[], edges: RoadEdge[]): DriveRoute | null {
    const prepared = prepareRoad(points, fits);
    if (!prepared || prepared.smooth.length < 2) return null;
    const { smooth, clean: guidancePoints } = prepared;
    const distances = [0];
    for (let i = 1; i < smooth.length; i++) distances.push(distances[i - 1] + distance(smooth[i - 1], smooth[i]));
    const routeTurns: DriveRoute["turns"] = [];
    // Use the same cleaned vertices as the accepted curve. Raw shared endpoints
    // and tiny lattice kinks have no meaningful turn, even when traversed backwards.
    for (let i = 1; i < guidancePoints.length - 1; i++) {
      const delta = angle(bearing(guidancePoints[i], guidancePoints[i + 1]), bearing(guidancePoints[i - 1], guidancePoints[i]));
      if (Math.abs(delta) > .5) {
        const at = projectPath(smooth, guidancePoints[i]).progress;
        const outgoing = guidancePoints[i + 1];
        const street = edges.reduce<RoadEdge | null>((closest, edge) => !closest ||
          projectPath(edge.points, outgoing).distance < projectPath(closest.points, outgoing).distance ? edge : closest, null)?.roadName ?? "next street";
        if (!routeTurns.length || at - routeTurns.at(-1)!.at > 8) routeTurns.push({ at, direction: delta > 0 ? "left" : "right", street });
      }
    }
    return { points: smooth, distances, length: distances.at(-1)!, edges: edges.map(e => e.id), names: [...new Set(edges.map(e => e.roadName))], turns: routeTurns };
  }
  function calculate(car: Body, destination: string, blocked: ReadonlySet<string> = new Set()): DriveRoute | null {
    const stop = network.destinations.find(d => d.id === destination);
    if (!stop) return null;
    const target = nearest(stop.point, blocked)[0];
    if (!target || target.distance > 12) return null;
    const starts = nearest([car.x, car.z], blocked).filter(s => s.distance < 22).slice(0, 4);
    const candidates: { points: Point[]; edges: RoadEdge[]; score: number }[] = [];
    const offer = (points: Point[], edges: RoadEdge[], extra: number) => candidates.push({points, edges, score: extra + points.slice(1).reduce((sum,p,i)=>sum+distance(points[i],p),0)});
    for (const start of starts) {
      // A nearby centreline across a median is not a connected start.
      const joinYaw = bearing([car.x, car.z], start.point), samples = Math.max(1, Math.ceil(start.distance / .2));
      if (start.distance > .2 && Array.from({ length: samples + 1 }, (_, i) => i / samples).some(t => !fits({ x: car.x + (start.point[0] - car.x) * t, z: car.z + (start.point[1] - car.z) * t, yaw: joinYaw }))) continue;
      if (start.edge.id === target.edge.id) {
        const forward = start.progress <= target.progress;
        const middle = start.edge.points.slice(Math.min(start.index, target.index) + 1, Math.max(start.index, target.index) + 1);
        const points = [start.point, ...(forward ? middle : middle.reverse()), target.point];
        offer(points, [start.edge], start.distance);
      }
      for (const reverse of [false, true]) {
        const initial = legs.get(`${start.edge.id}:${reverse ? 1 : 0}`)!;
        const first = [start.point, ...(reverse ? start.edge.points.slice(0, start.index + 1).reverse() : start.edge.points.slice(start.index + 1))];
        const costs = new Map([[initial.key, first.slice(1).reduce((sum, p, i) => sum + distance(first[i], p), 0)]]), previous = new Map<string, string>(), open = new Set([initial.key]);
        const goals: Leg[] = [];
        while (open.size) {
          // A* state includes incoming edge, so rejected turns cannot reappear.
          const current = [...open].reduce((a, b) => costs.get(a)! + distance(legs.get(a)!.points.at(-1)!, target.point) < costs.get(b)! + distance(legs.get(b)!.points.at(-1)!, target.point) ? a : b);
          open.delete(current); const leg = legs.get(current)!;
          if (leg.edge.id === target.edge.id && current !== initial.key) { goals.push(leg); break; }
          for (const next of adjacent.get(leg.to) ?? []) {
            if (blocked.has(next.edge.id) || !canTurn(leg, next)) continue;
            const cost = costs.get(current)! + next.edge.lengthM;
            if (cost >= (costs.get(next.key) ?? Infinity)) continue;
            costs.set(next.key, cost); previous.set(next.key, current); open.add(next.key);
          }
        }
        for (const goal of goals) {
          const path: Leg[] = [goal]; let key = goal.key;
          while (previous.has(key)) { key = previous.get(key)!; path.unshift(legs.get(key)!); }
          const last = goal.from === target.edge.from ? [...target.edge.points.slice(0, target.index + 1), target.point] : [...target.edge.points.slice(target.index + 1).reverse(), target.point];
          const points = [...first, ...path.slice(1, -1).flatMap(l => l.points), ...last];
          offer(points, path.map(l => l.edge), start.distance + Math.abs(angle(bearing(first[0], first[1] ?? initial.points.at(-1)!), car.yaw)) * 8);
        }
      }
    }
    for (const candidate of candidates.sort((a,b)=>a.score-b.score)) { const route=finish(candidate.points,candidate.edges); if(route)return route; }
    return null;
  }
  return { calculate, canTurn, legs, round: (points: Point[]) => roundRoad(points, fits) };
}

/** Guidance never moves the car. Aerial/menu pause callers simply do not tick. */
export function createGuidance(network: RoadNetwork, navigator: ReturnType<typeof createNavigator>) {
  let deviation = 0, cooldown = 0, attemptedAt: Point | null = null;
  function select(state: Navigation, car: Body, destination: string | null, blocked: ReadonlySet<string> = new Set(), reroute = false) {
    const revision = state.revision + 1, reroutes = reroute ? state.reroutes + 1 : 0;
    Object.assign(state, newNavigation(), { revision, reroutes }); deviation = 0; cooldown = .5;
    attemptedAt = [car.x, car.z];
    if (!destination) return;
    state.destination = destination;
    const stop = network.destinations.find(d => d.id === destination);
    if (!stop) { state.status = "unreachable"; state.instruction = "This destination is unavailable"; return; }
    if (distance([car.x, car.z], stop.point) < 7) {
      state.status = "guiding"; state.instruction = `${stop.name} · stop safely to arrive`; return;
    }
    state.route = navigator.calculate(car, destination, blocked);
    if (!state.route) { state.status = "unreachable"; state.instruction = "No clear connected route here · reposition or recover"; return; }
    state.status = "guiding"; state.remaining = state.route.length;
    state.instruction = `${reroute ? "Route updated · " : ""}Join ${state.route.names[0]}`;
  }
  function tick(state: Navigation, car: Body & { speed: number }, dt: number, blocked: ReadonlySet<string> = new Set()) {
    if (!state.destination) return;
    const stop = network.destinations.find(d => d.id === state.destination);
    if (!stop) return;
    const targetDistance = distance([car.x, car.z], stop.point);
    if (targetDistance < 7 && Math.abs(car.speed) < .05) {
      state.status = "arrived"; state.remaining = 0; state.arrow = "✓";
      state.instruction = `Arrived · ${stop.kind === "parking" ? "park and exit" : "temporary stop · exit when clear"}`; return;
    }
    cooldown = Math.max(0, cooldown - dt);
    if (!state.route || state.status === "arrived") {
      if (targetDistance > 15 && !cooldown && (!attemptedAt || distance(attemptedAt, [car.x,car.z]) > 5)) select(state, car, state.destination, blocked, true);
      return;
    }
    const projection = projectPath(state.route.points, [car.x, car.z]);
    state.remaining = Math.max(0, state.route.length - projection.progress) + projection.distance;
    // A whole intersection's width is tolerated before declaring a deviation.
    deviation = projection.distance > 12 ? deviation + dt : 0;
    if (deviation > .8 && !cooldown) { select(state, car, state.destination, blocked, true); return; }
    const turn = state.route.turns.find(t => t.at > projection.progress + 4);
    if (turn && turn.at - projection.progress < 110) {
      state.arrow = turn.direction === "left" ? "←" : "→";
      state.instruction = `${Math.round(turn.at - projection.progress)} m · ${turn.direction === "left" ? "Left" : "Right"} onto ${turn.street}`;
    } else {
      state.arrow = "↑"; state.instruction = state.remaining < 25 ? "Slow down · roadside stop ahead" : `Continue · ${stop.name}`;
    }
  }
  return { select, tick };
}
