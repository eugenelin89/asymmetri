/** Isolated elevation architecture. Public city driving does not import it. */
import type { CarState, stepCar } from "./physics";
import type { Point2 } from "./types";

export type ElevatedPoint = { x: number; z: number; y: number };
export type RoadSurface = {
  id: string; start: string; end: string; width: number;
  role: "ground" | "ramp" | "deck";
  from: ElevatedPoint; to: ElevatedPoint;
  /** Optional surveyed/derived plan curve and height stations. */
  profile?: ElevatedPoint[];
};
export type ElevatedCar = CarState & { y: number; pitch: number; surface: string };

/** Visible finite joins only at explicitly shared endpoints, never XY crossings. */
export function elevatedJoins(surfaces: RoadSurface[]) {
  const nodes = new Map<string, { point:ElevatedPoint; surfaces:RoadSurface[] }>();
  for(const surface of surfaces) for(const [id,point] of [[surface.start,surface.from],[surface.end,surface.to]] as const){
    const node=nodes.get(id)??{point,surfaces:[]};node.surfaces.push(surface);nodes.set(id,node);
  }
  return [...nodes.values()].filter((node)=>node.surfaces.length>1&&node.surfaces.some(s=>s.profile))
    .map((node)=>({...node,radius:Math.min(...node.surfaces.map(s=>s.width))/2}));
}

/** C1 ramp ends: zero grade where a ramp joins a flat deck/ground surface. */
export function surfaceSample(surface: RoadSurface, point: Point2) {
  if (surface.profile) return createProfileSampler(surface)(point);
  const dx = surface.to.x - surface.from.x, dz = surface.to.z - surface.from.z;
  const length = Math.hypot(dx, dz);
  if (!length || surface.width <= 0) return null;
  const t = ((point[0] - surface.from.x) * dx + (point[1] - surface.from.z) * dz) / (length * length);
  const across = Math.abs((point[0] - surface.from.x) * dz - (point[1] - surface.from.z) * dx) / length;
  if (t < -1e-8 || t > 1 + 1e-8 || across > surface.width / 2) return null;
  const u = Math.max(0, Math.min(1, t)), rise = surface.to.y - surface.from.y;
  return { y: surface.from.y + rise * u * u * (3 - 2 * u), grade: rise * 6 * u * (1 - u) / length, direction: Math.atan2(dx, dz) };
}

/** Bounded ribbons with monotone cubic height interpolation. Curves retain their
 * source stations; only explicit surface endpoints create network connections. */
export function createProfileSampler(surface: RoadSurface): (point: Point2) => { y: number; grade: number; direction: number; distance: number } | null {
  const points = surface.profile ?? [surface.from, surface.to];
  const lengths = points.slice(1).map((b, i) => Math.hypot(b.x-points[i].x, b.z-points[i].z));
  if (points.length < 2 || lengths.some((n) => !Number.isFinite(n) || n <= .001)
    || points.some((p) => ![p.x,p.y,p.z].every(Number.isFinite))) throw new Error("Invalid road profile");
  const slopes = lengths.map((length, i) => (points[i+1].y-points[i].y)/length);
  // Harmonic mean cannot overshoot a monotone pair. End slopes are zero so
  // independently sampled surfaces meet without a pitch/height discontinuity.
  const tangents = points.map((_, i) => !i || i===points.length-1 || slopes[i-1]*slopes[i]<=0 ? 0 : 2/(1/slopes[i-1]+1/slopes[i]));
  const bins = new Map<string, number[]>(), radius = surface.width/2;
  lengths.forEach((_, i) => {
    const a=points[i],b=points[i+1];
    for(let x=Math.floor((Math.min(a.x,b.x)-radius)/32);x<=Math.floor((Math.max(a.x,b.x)+radius)/32);x++)
      for(let z=Math.floor((Math.min(a.z,b.z)-radius)/32);z<=Math.floor((Math.max(a.z,b.z)+radius)/32);z++){
        const key=`${x},${z}`,cell=bins.get(key)??[];cell.push(i);bins.set(key,cell);
      }
  });
  return ([x,z]: Point2) => {
    let nearest: { y:number;grade:number;direction:number;distance:number;index:number;projection:number } | null = null;
    for(const i of bins.get(`${Math.floor(x/32)},${Math.floor(z/32)}`)??[]){
      const a=points[i],b=points[i+1],length=lengths[i],dx=b.x-a.x,dz=b.z-a.z;
      const projection=((x-a.x)*dx+(z-a.z)*dz)/(length*length);
      const t=Math.max(0,Math.min(1,projection)),distance=Math.hypot(x-a.x-t*dx,z-a.z-t*dz);
      if(distance>radius || (nearest&&distance>=nearest.distance))continue;
      const m0=tangents[i]*length,m1=tangents[i+1]*length,t2=t*t,t3=t2*t;
      const y=(2*t3-3*t2+1)*a.y+(t3-2*t2+t)*m0+(-2*t3+3*t2)*b.y+(t3-t2)*m1;
      const grade=((6*t2-6*t)*a.y+(3*t2-4*t+1)*m0+(-6*t2+6*t)*b.y+(3*t2-2*t)*m1)/length;
      nearest={y,grade,direction:Math.atan2(dx,dz),distance,index:i,projection};
    }
    // Clip after finding the nearest segment. Skipping a clipped end earlier
    // could incorrectly return the preceding station's height beyond the end.
    if(nearest&&((nearest.index===0&&nearest.projection< -1e-8)||(nearest.index===lengths.length-1&&nearest.projection>1+1e-8)))return null;
    return nearest;
  };
}

export function createElevatedWorld(surfaces: RoadSurface[], groundAllowed: (point: Point2) => boolean) {
  const byId = new Map(surfaces.map((surface) => [surface.id, surface]));
  if (byId.size !== surfaces.length) throw new Error("Duplicate road surface");
  const nodes = new Map<string, ElevatedPoint>();
  for (const surface of surfaces) {
    if (Math.hypot(surface.to.x - surface.from.x, surface.to.z - surface.from.z) < 4 || surface.width < 3) throw new Error("Invalid road surface");
    if(surface.profile) {
      const first=surface.profile[0],last=surface.profile.at(-1);
      if(!first||!last||Math.hypot(first.x-surface.from.x,first.y-surface.from.y,first.z-surface.from.z)>.001||Math.hypot(last.x-surface.to.x,last.y-surface.to.y,last.z-surface.to.z)>.001) throw new Error("Profile endpoints must match surface endpoints");
    }
    for (const [id, point] of [[surface.start, surface.from], [surface.end, surface.to]] as const) {
      const prior = nodes.get(id);
      if (prior && Math.hypot(prior.x - point.x, prior.y - point.y, prior.z - point.z) > .001) throw new Error("Connected road endpoints must meet in three dimensions");
      nodes.set(id, point);
    }
  }
  const samplers = new Map(surfaces.map((s) => [s.id, s.profile ? createProfileSampler(s) : (p:Point2)=>surfaceSample(s,p)]));
  const joins=elevatedJoins(surfaces);
  const neighbours = new Map(surfaces.map((surface) => [surface.id, surfaces.filter((other) => other.id === surface.id || [surface.start, surface.end].some((node) => node === other.start || node === other.end))]));
  function sample(point: Point2, current: string) {
    // XY crossings are deliberately not connectivity. A surface is reachable
    // only through an explicitly shared endpoint with the same XYZ position.
    for (const surface of neighbours.get(current) ?? []) {
      const value = samplers.get(surface.id)!(point);
      if (value && (surface.role !== "ground" || groundAllowed(point))) return { ...value, id: surface.id };
    }
    // Two angled finite ribbons otherwise leave a small triangular crack at
    // their shared endpoint. This same bounded join is rendered in the lab.
    for(const join of joins) if(join.surfaces.some(s=>s.id===current)
      && Math.hypot(point[0]-join.point.x,point[1]-join.point.z)<=join.radius
      && (join.surfaces.some(s=>s.role!=="ground")||groundAllowed(point)))
      return {y:join.point.y,grade:0,direction:0,id:current};
    return null;
  }
  function step(integrate: typeof stepCar, initial: ElevatedCar, throttle: number, steering: number, brake: boolean, delta: number): ElevatedCar {
    const duration = Math.max(0, Math.min(delta, .1)), count = Math.max(1, Math.ceil(duration * 120)), dt = duration / count;
    let car = initial;
    for (let i = 0; i < count; i++) {
      const centre = sample([car.x, car.z], car.surface);
      if (!centre || Math.abs(centre.y - car.y) > .05) return { ...car, speed: 0, blocked: true };
      const next = integrate(car, throttle, steering, brake, dt, (point) => {
        const support = sample(point, car.surface);
        // Full body probes must stay supported by the same connected deck/ramp.
        return !!support && Math.abs(support.y - car.y) <= .8;
      });
      const support = sample([next.x, next.z], car.surface), travelled = Math.hypot(next.x - car.x, next.z - car.z);
      if (!support || Math.abs(support.y - car.y) > travelled * .3 + .005) return { ...car, speed: 0, blocked: true };
      car = { ...next, y: support.y, pitch: Math.atan(support.grade * Math.cos(next.yaw - support.direction)), surface: support.id };
    }
    return car;
  }
  function route(from: string, to: string): string[] | null {
    const queue: string[][] = [[from]], visited = new Set([from]);
    if (!byId.has(from) || !byId.has(to)) return null;
    for (let i = 0; i < queue.length; i++) {
      const path = queue[i], end = path[path.length - 1];
      if (end === to) return path;
      for (const next of neighbours.get(end) ?? []) if (!visited.has(next.id)) { visited.add(next.id); queue.push([...path, next.id]); }
    }
    return null;
  }
  return { sample, step, route };
}

/** A 480m synthetic corridor and a disconnected road underneath its deck. */
export const elevationFixture: RoadSurface[] = [
  { id: "south", start: "s0", end: "s1", width: 12, role: "ground", from: { x: 0, z: 0, y: 0 }, to: { x: 0, z: 60, y: 0 } },
  { id: "up", start: "s1", end: "s2", width: 12, role: "ramp", from: { x: 0, z: 60, y: 0 }, to: { x: 0, z: 180, y: 8 } },
  { id: "deck", start: "s2", end: "s3", width: 12, role: "deck", from: { x: 0, z: 180, y: 8 }, to: { x: 0, z: 300, y: 8 } },
  { id: "down", start: "s3", end: "s4", width: 12, role: "ramp", from: { x: 0, z: 300, y: 8 }, to: { x: 0, z: 420, y: 0 } },
  { id: "north", start: "s4", end: "s5", width: 12, role: "ground", from: { x: 0, z: 420, y: 0 }, to: { x: 0, z: 480, y: 0 } },
  { id: "underpass", start: "u0", end: "u1", width: 10, role: "ground", from: { x: -60, z: 190, y: 0 }, to: { x: 60, z: 190, y: 0 } },
];
export const fixtureGround = ([, z]: Point2) => z <= 215 || z >= 275;

export function elevatedCameraTarget(car: ElevatedCar, distance = 16, height = 9) {
  return { x: car.x - Math.sin(car.yaw) * distance, y: car.y + height, z: car.z - Math.cos(car.yaw) * distance, aimY: car.y + 1.5 };
}
