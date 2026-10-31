import type { Anchor, CampusData, Point, Pose } from "./types";
export type Box = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
};
export type Floor = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  y: number;
};
export type Ramp = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  fromY: number;
  toY: number;
  axis: "x" | "z";
};
export type Interior = {
  anchor: Anchor;
  colliders: Box[];
  floors: Floor[];
  ramps: Ramp[];
  entry: Point;
  dynamicBlocked?: (point: Point, y: number) => boolean;
};
export function inside(p: Point, ring: Point[]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > p[1] !== b[1] > p[1] &&
      p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      hit = !hit;
  }
  return hit;
}
export function inPolygon(p: Point, rings: Point[][]) {
  return (
    rings.length > 0 &&
    inside(p, rings[0]) &&
    !rings.slice(1).some((r) => inside(p, r))
  );
}
export function segmentDistance(p: Point, a: Point, b: Point) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1],
    t = Math.max(
      0,
      Math.min(
        1,
        ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1),
      ),
    );
  return Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dz * t);
}
export function local(p: Point, a: Anchor): Point {
  const x = p[0] - a.x,
    z = p[1] - a.z;
  return [
    x * Math.cos(a.yaw) - z * Math.sin(a.yaw),
    x * Math.sin(a.yaw) + z * Math.cos(a.yaw),
  ];
}
export function global(p: Point, a: Anchor): Point {
  return [
    a.x + p[0] * Math.cos(a.yaw) + p[1] * Math.sin(a.yaw),
    a.z - p[0] * Math.sin(a.yaw) + p[1] * Math.cos(a.yaw),
  ];
}
function inBox(
  p: Point,
  b: { minX: number; maxX: number; minZ: number; maxZ: number },
  pad = 0,
) {
  return (
    p[0] >= b.minX - pad &&
    p[0] <= b.maxX + pad &&
    p[1] >= b.minZ - pad &&
    p[1] <= b.maxZ + pad
  );
}
export function floorAt(p: Point, y: number, interiors: Interior[]) {
  // Ground is the fallback, not a competing floor: a documented lower-level
  // floor must remain reachable after descending its ramp below campus grade.
  let target: number | undefined;
  for (const i of interiors) {
    const radius=Math.max(i.anchor.width,i.anchor.depth)+20;
    if ((p[0]-i.anchor.x)**2+(p[1]-i.anchor.z)**2>radius*radius) continue;
    const q = local(p, i.anchor);
    for (const ramp of i.ramps) {
      if (inBox(q, ramp, 0.05)) {
        const t =
          ramp.axis === "x"
            ? (q[0] - ramp.minX) / (ramp.maxX - ramp.minX)
            : (q[1] - ramp.minZ) / (ramp.maxZ - ramp.minZ);
        const ry =
          ramp.fromY + (ramp.toY - ramp.fromY) * Math.max(0, Math.min(1, t));
        if (Math.abs(ry - y) < 0.65) return ry;
      }
    }
    for (const f of i.floors)
      if (
        inBox(q, f) &&
        f.y <= y + 0.38 &&
        (target === undefined || f.y > target)
      )
        target = f.y;
  }
  return target ?? 0;
}
export function createCollision(
  data: CampusData,
  interiors: Interior[],
  exempt: Set<string>,
) {
  const cells = new Map<string, CampusData["buildings"]>();
  const interiorCells = new Map<string, Interior[]>();
  for (const interior of interiors) {
    const a=interior.anchor,radius=Math.max(a.width,a.depth)+20;
    for(let x=Math.floor((a.x-radius)/64);x<=Math.floor((a.x+radius)/64);x++)
      for(let z=Math.floor((a.z-radius)/64);z<=Math.floor((a.z+radius)/64);z++) {
        const key=`${x},${z}`;interiorCells.set(key,[...(interiorCells.get(key)||[]),interior]);
      }
  }
  const sourcePoints = data.routes.flatMap(r=>r.points);
  const bounds = sourcePoints.reduce((b,p)=>({minX:Math.min(b.minX,p[0]-100),maxX:Math.max(b.maxX,p[0]+100),minZ:Math.min(b.minZ,p[1]-100),maxZ:Math.max(b.maxZ,p[1]+100)}),{minX:-2500,maxX:2500,minZ:-2500,maxZ:2500});
  for (const b of data.buildings) {
    if (exempt.has(b.id) || !b.rings[0]?.length) continue;
    const xs = b.rings[0].map((p) => p[0]),
      zs = b.rings[0].map((p) => p[1]);
    for (
      let x = Math.floor(Math.min(...xs) / 64);
      x <= Math.floor(Math.max(...xs) / 64);
      x++
    )
      for (
        let z = Math.floor(Math.min(...zs) / 64);
        z <= Math.floor(Math.max(...zs) / 64);
        z++
      ) {
        const k = `${x},${z}`;
        cells.set(k, [...(cells.get(k) || []), b]);
      }
  }
  function blocked(p: Point, y: number) {
    // Include separately mapped districts, notably the real Redwood City boathouse.
    if (p[0] < bounds.minX || p[0] > bounds.maxX || p[1] < bounds.minZ || p[1] > bounds.maxZ) return true;
    for (const b of cells.get(
      `${Math.floor(p[0] / 64)},${Math.floor(p[1] / 64)}`,
    ) || []) {
      if (inPolygon(p, b.rings)) return true;
      for (const ring of b.rings)
        for (let j = 1; j < ring.length; j++)
          if (segmentDistance(p, ring[j - 1], ring[j]) < 0.28) return true;
    }
    for (const i of interiorCells.get(`${Math.floor(p[0]/64)},${Math.floor(p[1]/64)}`)||[]) {
      if (
        Math.hypot(p[0] - i.anchor.x, p[1] - i.anchor.z) >
        Math.max(i.anchor.width, i.anchor.depth) + 20
      )
        continue;
      const q = local(p, i.anchor);
      if (i.dynamicBlocked?.(q, y)) return true;
      for (const b of i.colliders)
        if (y + 1.65 > b.minY + 0.04 && y < b.maxY - 0.04 && inBox(q, b, 0.28))
          return true;
    }
    return false;
  }
  function move(pose: Pose, dx: number, dz: number) {
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.15));
    let p = { ...pose };
    for (let s = 0; s < steps; s++)
      for (const axis of ["x", "z"] as const) {
        const q = { ...p, [axis]: p[axis] + (axis === "x" ? dx : dz) / steps };
        const y = floorAt([q.x, q.z], p.y, interiors);
        if (y < p.y - 0.65) continue;
        if (!blocked([q.x, q.z], y)) p = { ...q, y };
      }
    return p;
  }
  return { blocked, move };
}
/** Route graph joins official route vertices; no direct line fallback across buildings. */
export type NavigationGraph={nodes:Point[];edges:[number,{to:number;cost:number}[]][]};
export function createRoutes(
  data: CampusData,
  isBlocked?: (p: Point, y: number) => boolean,
  compiled?: NavigationGraph,
) {
  const nodes: Point[] = compiled?.nodes || [],
    edges = new Map<number, { to: number; cost: number }[]>(compiled?.edges),
    ids = new Map<string, number>();
  const node = (p: Point) => {
    const key = `${Math.round(p[0])},${Math.round(p[1])}`;
    if (ids.has(key)) return ids.get(key)!;
    const id = nodes.length;
    nodes.push(p);
    ids.set(key, id);
    return id;
  };
  if(!compiled) for (const route of data.routes)
    for (let j = 1; j < route.points.length; j++) {
      const p = route.points[j - 1],
        q = route.points[j],
        cost = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (isBlocked) {
        let clear = true;
        const steps = Math.max(1, Math.ceil(cost / 0.5));
        for (let i = 0; i <= steps; i++)
          if (
            isBlocked(
              [
                p[0] + ((q[0] - p[0]) * i) / steps,
                p[1] + ((q[1] - p[1]) * i) / steps,
              ],
              0,
            )
          ) {
            clear = false;
            break;
          }
        if (!clear) continue;
      }
      const a = node(p),
        b = node(q);
      edges.set(a, [...(edges.get(a) || []), { to: b, cost }]);
      edges.set(b, [...(edges.get(b) || []), { to: a, cost }]);
    }
  const nearest = (p: Point) => {
    let best = -1,
      d = Infinity;
    nodes.forEach((n, i) => {
      const v = Math.hypot(n[0] - p[0], n[1] - p[1]);
      if (v < d) {
        d = v;
        best = i;
      }
    });
    return { id: best, d };
  };
  return {
    nodes,
    edges,
    find(start: Point, end: Point): Point[] | null {
      const a = nearest(start),
        b = nearest(end);
      if (a.id < 0 || a.d > 80 || b.d > 80) return null;
      const distance = new Map<number, number>([[a.id, 0]]),
        prev = new Map<number, number>();
      const heap: { id: number; cost: number }[] = [];
      const push = (id: number, cost: number) => {
        heap.push({ id, cost });
        let i = heap.length - 1;
        while (i > 0) {
          const parent = Math.floor((i - 1) / 2);
          if (heap[parent].cost <= cost) break;
          [heap[i], heap[parent]] = [heap[parent], heap[i]];
          i = parent;
        }
      };
      const pop = () => {
        const root = heap[0],
          last = heap.pop()!;
        if (heap.length) {
          heap[0] = last;
          let i = 0;
          while (true) {
            let j = i;
            for (const c of [i * 2 + 1, i * 2 + 2])
              if (c < heap.length && heap[c].cost < heap[j].cost) j = c;
            if (j === i) break;
            [heap[i], heap[j]] = [heap[j], heap[i]];
            i = j;
          }
        }
        return root;
      };
      push(a.id, 0);
      while (heap.length) {
        const item = pop(),
          u = item.id,
          best = item.cost;
        if (best !== (distance.get(u) ?? Infinity)) continue;
        if (u === b.id) break;
        for (const e of edges.get(u) || []) {
          const d = best + e.cost;
          if (d < (distance.get(e.to) ?? Infinity)) {
            distance.set(e.to, d);
            prev.set(e.to, u);
            push(e.to, d);
          }
        }
      }
      if (!distance.has(b.id)) return null;
      const path = [b.id];
      while (path[0] !== a.id) {
        const v = prev.get(path[0]);
        if (v === undefined) return null;
        path.unshift(v);
      }
      return path.map((i) => nodes[i]);
    },
    nearest,
  };
}
