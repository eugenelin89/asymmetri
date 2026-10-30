import type { inPolygon } from "../physics";
import type { City } from "../types";

type Position = { x: number; y: number; z: number };

/** Height-aware camera clearance. Water is visible space, not a camera wall. */
export function createCameraClearance(buildings: City["buildings"], contains: typeof inPolygon) {
  const cells = new Map<string, City["buildings"]>();
  for (const building of buildings) {
    const xs = building.shape[0].map(p => p[0]), zs = building.shape[0].map(p => p[1]);
    for (let x = Math.floor(Math.min(...xs) / 64); x <= Math.floor(Math.max(...xs) / 64); x++)
      for (let z = Math.floor(Math.min(...zs) / 64); z <= Math.floor(Math.max(...zs) / 64); z++) {
        const id = `${x},${z}`, cell = cells.get(id) ?? []; cell.push(building); cells.set(id, cell);
      }
  }
  return ({ x, y, z }: Position) => !(cells.get(`${Math.floor(x / 64)},${Math.floor(z / 64)}`) ?? [])
    .some(b => y <= b.height + 3 && contains([x, z], b.shape));
}

/** Constrain a sight-line volume and near plane, preserving camera height. */
export function fitSpatialCamera(origin: Position, desired: Position, clear: (p: Position) => boolean, margin = 1) {
  let target = { ...desired };
  for (let attempt = 0; attempt < 4; attempt++) {
    const dx = target.x - origin.x, dy = target.y - origin.y, dz = target.z - origin.z;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy, dz) / .75));
    let safe = 1;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, x = origin.x + dx * t, y = origin.y + dy * t, z = origin.z + dz * t;
      // Widen toward the lens and cover both axial and diagonal directions.
      const radius = .25 + (Math.max(.25, margin) - .25) * t, diagonal = radius / Math.SQRT2;
      if ([[0, 0], [radius, 0], [-radius, 0], [0, radius], [0, -radius], [diagonal, diagonal], [-diagonal, diagonal], [diagonal, -diagonal], [-diagonal, -diagonal]].some(([ox, oz]) => !clear({ x: x + ox, y, z: z + oz }))) { safe = Math.max(0, (i - 2) / steps); break; }
    }
    if (safe === 1) break;
    target = { x: origin.x + dx * safe, y: desired.y, z: origin.z + dz * safe };
  }
  return target;
}
