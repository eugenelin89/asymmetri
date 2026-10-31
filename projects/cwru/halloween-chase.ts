// Original procedural Friday-the-13th-inspired hockey-mask costume and knife; no external assets.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { CampusData, Mode, Point, Pose, Settings } from "./types";
import { floorAt, inPolygon, type Interior, type createCollision, type createRoutes } from "./spatial";
import { onFoot } from "./navigation";

export const halloweenPursuitSpeed = 2.4;
export const halloweenFollowDistance = 2.8;
type Collision = ReturnType<typeof createCollision>;
type Routes = ReturnType<typeof createRoutes>;
export type ChaseContext = {
  paused: boolean;
  mode: Mode;
  indoor: boolean;
  cameraPosition?: { x: number; y: number; z: number };
};
export type ChaseState = {
  position: Pose | null;
  visible: boolean;
  moving: boolean;
  path: Point[];
  travelled: number;
  spawnCount: number;
};

/** One fictional outdoor pursuer. Interior floors, private footprints and
 * unsupported elevation changes are deliberately excluded from its navigation.
 * It waits outside when visitors enter a building and never attacks or damages.
 */
export function createChaseController(data: CampusData, interiors: Interior[], collision: Collision, routes: Routes) {
  const state: ChaseState = { position: null, visible: false, moving: false, path: [], travelled: 0, spawnCount: 0 };
  const buildingCells = new Map<string, CampusData["buildings"]>();
  for (const building of data.buildings) {
    if (!building.rings[0]?.length) continue;
    const xs = building.rings[0].map((p) => p[0]), zs = building.rings[0].map((p) => p[1]);
    for (let x = Math.floor(Math.min(...xs) / 64); x <= Math.floor(Math.max(...xs) / 64); x++)
      for (let z = Math.floor(Math.min(...zs) / 64); z <= Math.floor(Math.max(...zs) / 64); z++) {
        const key = `${x},${z}`; buildingCells.set(key, [...(buildingCells.get(key) || []), building]);
      }
  }
  const sourceSegments = data.routes.flatMap((route) => route.points.slice(1).map((b, i) => {
    const a = route.points[i], dx = b[0] - a[0], dz = b[1] - a[1];
    return { a, b, dx, dz, length: Math.hypot(dx, dz) };
  })).filter((segment) => segment.length > 1);
  const outdoor = (point: Point) => {
    const y = floorAt(point, 0, interiors);
    if (Math.abs(y) > 0.3 || collision.blocked(point, y)) return false;
    return !(buildingCells.get(`${Math.floor(point[0] / 64)},${Math.floor(point[1] / 64)}`) || [])
      .some((building) => inPolygon(point, building.rings));
  };
  const clearSegment = (a: Point, b: Point) => {
    const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.3));
    for (let i = 0; i <= steps; i++) if (!outdoor([a[0] + (b[0] - a[0]) * i / steps, a[1] + (b[1] - a[1]) * i / steps])) return false;
    return true;
  };
  function spawn(visitor: Pose) {
    const point: Point = [visitor.x, visitor.z], candidates: { point: Point; score: number }[] = [];
    const flank = state.spawnCount % 3 === 2 ? Math.PI : state.spawnCount % 2 ? -0.35 : 0.35;
    const forward: Point = [-Math.sin(visitor.yaw + flank), -Math.cos(visitor.yaw + flank)];
    for (const segment of sourceSegments) {
      if (Math.max(segment.a[0], segment.b[0]) < point[0] - 35 || Math.min(segment.a[0], segment.b[0]) > point[0] + 35 || Math.max(segment.a[1], segment.b[1]) < point[1] - 35 || Math.min(segment.a[1], segment.b[1]) > point[1] + 35) continue;
      const closest = ((point[0] - segment.a[0]) * segment.dx + (point[1] - segment.a[1]) * segment.dz) / segment.length ** 2;
      for (const offset of [-24, -16, -12, -8, 0, 8, 12, 16, 24]) {
        const t = Math.max(0, Math.min(1, closest + offset / segment.length));
        const candidate: Point = [segment.a[0] + segment.dx * t, segment.a[1] + segment.dz * t];
        const dx = candidate[0] - point[0], dz = candidate[1] - point[1], distance = Math.hypot(dx, dz);
        if (distance < 8 || distance > 32 || !outdoor(candidate)) continue;
        candidates.push({ point: candidate, score: Math.abs(distance - 14) + (1 - (dx * forward[0] + dz * forward[1]) / distance) * 14 });
      }
    }
    candidates.sort((a, b) => a.score - b.score);
    const selected = candidates.find((candidate) => clearSegment(candidate.point, point));
    if (!selected) return false;
    const p = selected.point;
    state.position = { x: p[0], y: floorAt(p, 0, interiors), z: p[1], yaw: Math.atan2(visitor.x - p[0], visitor.z - p[1]), pitch: 0 };
    state.path = []; state.spawnCount++; return true;
  }
  let enabledBefore = false, needsSpawn = true, lastVisitor: Point | null = null, planAfter = 0;
  function update(seconds: number, settings: Settings, visitor: Pose, context: ChaseContext) {
    const enabled = settings.halloween && settings.halloweenChase && settings.population;
    const target: Point = [visitor.x, visitor.z];
    if (lastVisitor && Math.hypot(target[0] - lastVisitor[0], target[1] - lastVisitor[1]) > 60) needsSpawn = true;
    lastVisitor = target;
    if (!enabled) { enabledBefore = false; state.visible = false; state.moving = false; return state; }
    if (!enabledBefore) {
      needsSpawn = !state.position || Math.hypot(state.position.x - visitor.x, state.position.z - visitor.z) > 50;
      state.path = []; planAfter = 0;
    }
    enabledBefore = true;
    const outdoors = !context.indoor && Math.abs(visitor.y) < 0.35 && outdoor(target);
    const canAct = !context.paused && onFoot(context.mode) && outdoors;
    if (needsSpawn && canAct) { needsSpawn = !spawn(visitor); planAfter = 0; }
    const p = state.position;
    if (!p) { state.visible = false; return state; }
    const distance = Math.hypot(visitor.x - p.x, visitor.z - p.z), camera = context.cameraPosition;
    const cameraClear = (q: Point) => !camera || Math.abs(camera.y - p.y - 1) > 2.5 || Math.hypot(q[0] - camera.x, q[1] - camera.z) >= 1.6;
    state.visible = !needsSpawn && distance < 160 && outdoor([p.x, p.z]) && cameraClear([p.x, p.z]);
    state.moving = false;
    if (!canAct || settings.reducedMotion || needsSpawn || distance > 120) return state;
    const dt = Math.max(0, Math.min(0.05, Number.isFinite(seconds) ? seconds : 0));
    if (!dt) return state;
    planAfter -= dt;
    const start: Point = [p.x, p.z];
    let goal: Point | undefined;
    let speed = halloweenPursuitSpeed;
    if (distance < 2.3) {
      const dx = p.x - visitor.x || Math.sin(p.yaw), dz = p.z - visitor.z || Math.cos(p.yaw), length = Math.hypot(dx, dz) || 1;
      goal = [p.x + dx / length * 3, p.z + dz / length * 3]; speed = 3;
    } else if (distance > halloweenFollowDistance) {
      if (clearSegment(start, target)) { goal = target; state.path = []; }
      else {
        if (planAfter <= 0) {
          const path = routes.find(start, target);
          state.path = path && path.every((point, index) => !index || clearSegment(path[index - 1], point)) ? path : [];
          planAfter = 1.2;
        }
        while (state.path.length && Math.hypot(state.path[0][0] - p.x, state.path[0][1] - p.z) < 0.5) state.path.shift();
        for (let i = state.path.length - 1; i >= 0; i--) if (clearSegment(start, state.path[i])) {
          state.path = state.path.slice(i); goal = state.path[0]; break;
        }
      }
    }
    if (goal) {
      const dx = goal[0] - p.x, dz = goal[1] - p.z, length = Math.hypot(dx, dz);
      const amount = Math.min(speed * dt, length, distance > halloweenFollowDistance && goal === target ? distance - halloweenFollowDistance : Infinity);
      if (length > 0.01 && amount > 0) {
        const advance = (x: number, z: number) => {
          const next = collision.move(p, x, z), q: Point = [next.x, next.z];
          if (!outdoor(q) || !clearSegment(start, q) || !cameraClear(q)) return false;
          const moved = Math.hypot(next.x - p.x, next.z - p.z);
          if (moved < amount * 0.1) return false;
          state.position = next; state.travelled += moved; state.moving = true; return true;
        };
        const stepX = dx / length * amount, stepZ = dz / length * amount;
        if (!advance(stepX, stepZ)) {
          // A side step keeps the third-person camera clear without entering a
          // wall, crossing the visitor, or teleporting to the next waypoint.
          if (!advance(-stepZ, stepX)) advance(stepZ, -stepX);
          planAfter = 0;
        }
      }
    }
    if (state.position) state.position.yaw = Math.atan2(visitor.x - state.position.x, visitor.z - state.position.z);
    return state;
  }
  return { state, update, outdoor, clearSegment };
}

export function createHalloweenChase(data: CampusData, interiors: Interior[], collision: Collision, routes: Routes) {
  const model = buildMaskedPursuer(), controller = createChaseController(data, interiors, collision, routes);
  model.group.visible = false;
  let placed = false, placedSpawn = -1;
  function update(dt: number, settings: Settings, visitor: Pose, context: ChaseContext) {
    const state = controller.update(dt, settings, visitor, context);
    model.group.visible = state.visible;
    if (!state.position) return;
    const frozen = settings.reducedMotion || context.paused || !onFoot(context.mode);
    const p = state.position;
    // Reduced motion freezes animation, but a fast-travel spawn must still
    // place the figure at its newly validated world coordinates.
    if (!placed || !frozen || placedSpawn !== state.spawnCount) {
      model.group.position.set(p.x, p.y, p.z); model.group.rotation.y = p.yaw;
      placed = true; placedSpawn = state.spawnCount;
    }
    if (frozen) return;
    const step = state.travelled * 4.7;
    model.legs.forEach((leg, i) => leg.rotation.x = state.moving ? Math.sin(step + i * Math.PI) * 0.54 : 0);
    model.arms.forEach((arm, i) => arm.rotation.x = state.moving ? -Math.sin(step + i * Math.PI) * (i ? 0.16 : 0.32) : 0);
    if (state.moving) model.group.position.y += Math.abs(Math.sin(step)) * 0.022;
  }
  return { group: model.group, state: controller.state, update };
}

export function buildMaskedPursuer(): {
  group: THREE.Group;
  arms: THREE.Group[];
  legs: THREE.Group[];
  head: THREE.Group;
} {
  const group = new THREE.Group();
  group.name = "halloween-masked-pursuer";
  const arms: THREE.Group[] = [], legs: THREE.Group[] = [];
  const cloth = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94 });
  const maskMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.84,
    emissive: 0xb9b5a9, emissiveIntensity: 0.12,
  });
  const metal = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.36, metalness: 0.68,
    emissive: 0x777c7b, emissiveIntensity: 0.07,
  });
  type V3 = [number, number, number];
  function part(
    parts: THREE.BufferGeometry[], geometry: THREE.BufferGeometry, color: number,
    position: V3 = [0, 0, 0], scale: V3 = [1, 1, 1], rotation: V3 = [0, 0, 0],
  ) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    if (g !== geometry) geometry.dispose();
    g.deleteAttribute("uv");
    g.applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    ));
    const c = new THREE.Color(color), count = g.getAttribute("position").count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) c.toArray(colors, i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    parts.push(g);
  }
  function batch(parent: THREE.Object3D, parts: THREE.BufferGeometry[], material: THREE.Material, name: string) {
    const geometry = mergeGeometries(parts, false)!;
    for (const part of parts) part.dispose();
    geometry.computeBoundingSphere();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function box(parts: THREE.BufferGeometry[], color: number, p: V3, s: V3, r: V3 = [0, 0, 0]) {
    part(parts, new THREE.BoxGeometry(1, 1, 1), color, p, s, r);
  }
  const jacket = 0x303d39, faded = 0x48534b, seams = 0x6a6a58, trouser = 0x282d2b;
  const body: THREE.BufferGeometry[] = [];
  part(body, new THREE.CylinderGeometry(0.31, 0.25, 0.64, 8), jacket, [0, 1.235, 0], [1, 1, 0.70]);
  part(body, new THREE.CylinderGeometry(0.245, 0.23, 0.17, 8), trouser, [0, 0.92, 0], [1, 1, 0.78]);
  part(body, new THREE.CylinderGeometry(0.087, 0.10, 0.15, 8), 0x625e50, [0, 1.58, 0]);
  box(body, 0x202724, [0, 1.24, 0.210], [0.025, 0.56, 0.015]);
  for (const side of [-1, 1]) {
    box(body, faded, [side * 0.115, 1.35, 0.208], [0.135, 0.13, 0.018]);
    box(body, seams, [side * 0.115, 1.408, 0.22], [0.137, 0.017, 0.012]);
    box(body, faded, [side * 0.098, 1.53, 0.15], [0.14, 0.12, 0.05], [0.12, 0, side * 0.27]);
    box(body, 0x37423c, [side * 0.18, 1.01, 0.181], [0.085, 0.14, 0.027], [0, 0, side * 0.10]);
  }
  box(body, seams, [-0.18, 1.18, 0.204], [0.057, 0.024, 0.008], [0, 0, -0.18]);
  box(body, 0x55594e, [0.14, 1.05, -0.176], [0.13, 0.05, 0.014], [0, 0, 0.12]);
  batch(group, body, cloth, "halloween-work-jacket");

  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.name = side < 0 ? "halloween-left-leg" : "halloween-right-leg";
    leg.position.set(side * 0.14, 0.92, 0);
    const bits: THREE.BufferGeometry[] = [];
    part(bits, new THREE.CapsuleGeometry(0.101, 0.58, 2, 7), trouser, [0, -0.33, 0], [1, 1, 0.91]);
    box(bits, 0x42473e, [0, -0.38, 0.087], [0.14, 0.16, 0.023], [0.06, 0, side * 0.06]);
    box(bits, 0x555449, [side * 0.05, -0.22, 0.083], [0.025, 0.10, 0.012], [0, 0, side * 0.12]);
    box(bits, 0x171e1c, [0, -0.79, 0.044], [0.20, 0.22, 0.33]);
    box(bits, 0x323932, [0, -0.815, 0.13], [0.205, 0.095, 0.20]);
    box(bits, 0x111714, [0, -0.90, 0.044], [0.215, 0.04, 0.345]);
    for (const y of [-0.70, -0.75, -0.80])
      box(bits, 0x6e6b59, [0, y, 0.214], [0.095, 0.012, 0.006]);
    batch(leg, bits, cloth, "halloween-trousers-and-boot");
    group.add(leg);
    legs.push(leg);
    const arm = new THREE.Group();
    arm.name = side < 0 ? "halloween-left-arm" : "halloween-right-arm";
    arm.position.set(side * 0.355, 1.47, 0);
    arm.rotation.z = side * 0.10;
    const sleeve: THREE.BufferGeometry[] = [];
    part(sleeve, new THREE.CapsuleGeometry(0.091, 0.36, 2, 7), jacket, [0, -0.205, 0]);
    box(sleeve, faded, [0, -0.28, -0.072], [0.135, 0.13, 0.045]);
    box(sleeve, seams, [0, -0.419, 0.012], [0.14, 0.032, 0.14]);
    part(sleeve, new THREE.SphereGeometry(0.077, 7, 5), 0x756f5b, [0, -0.493, 0.017], [0.88, 1.16, 0.92]);
    if (side > 0) {
      // Right-hand prop: the grip and guard meet the fist; blade points down and out.
      box(sleeve, 0x242a26, [0.022, -0.555, 0.064], [0.065, 0.16, 0.055], [0, 0, 0.22]);
      for (const y of [-0.51, -0.56, -0.60])
        box(sleeve, 0x67675b, [0.023, y, 0.094], [0.035, 0.008, 0.005]);
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(-0.043, 0);
      bladeShape.lineTo(0.065, 0);
      bladeShape.lineTo(0.086, -0.31);
      bladeShape.lineTo(0.015, -0.47);
      bladeShape.lineTo(-0.043, -0.38);
      bladeShape.closePath();
      const blade: THREE.BufferGeometry[] = [];
      part(blade, new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.012, bevelEnabled: true, bevelThickness: 0.005,
        bevelSize: 0.004, bevelSegments: 1, steps: 1,
      }), 0xc9d0cc, [0.042, -0.63, 0.064], [1, 1, 1], [0, 0, 0.22]);
      box(blade, 0x919e9b, [0.042, -0.63, 0.066], [0.15, 0.026, 0.071], [0, 0, 0.22]);
      batch(arm, blade, metal, "halloween-prop-knife");
    }
    batch(arm, sleeve, cloth, "halloween-sleeve-and-hand");
    group.add(arm);
    arms.push(arm);
  }

  const head = new THREE.Group();
  head.name = "halloween-head";
  head.position.set(0, 1.733, 0);
  group.add(head);
  const skull: THREE.BufferGeometry[] = [];
  part(skull, new THREE.SphereGeometry(0.16, 12, 8), 0x393e34, [0, 0, 0], [1, 1.34, 0.94]);
  part(skull, new THREE.TorusGeometry(0.153, 0.018, 4, 14), 0x181e1b, [0, 0.031, 0], [1, 1, 0.88], [Math.PI / 2, 0, 0]);
  box(skull, 0x222924, [0, 0.12, -0.12], [0.035, 0.16, 0.045], [-0.40, 0, 0]);
  batch(head, skull, cloth, "halloween-mask-straps");

  const shape = new THREE.Shape();
  shape.moveTo(0, -0.205);
  shape.bezierCurveTo(-0.105, -0.205, -0.17, -0.07, -0.164, 0.065);
  shape.bezierCurveTo(-0.16, 0.175, -0.095, 0.209, 0, 0.209);
  shape.bezierCurveTo(0.095, 0.209, 0.16, 0.175, 0.164, 0.065);
  shape.bezierCurveTo(0.17, -0.07, 0.105, -0.205, 0, -0.205);
  const hole = (x: number, y: number, rx: number, ry: number) => {
    const path = new THREE.Path();
    path.absellipse(x, y, rx, ry, 0, Math.PI * 2, true);
    shape.holes.push(path);
  };
  for (const side of [-1, 1]) {
    hole(side * 0.076, 0.061, 0.045, 0.026);
    for (const y of [-0.058, -0.105, -0.146]) hole(side * 0.046, y, 0.010, 0.012);
    hole(side * 0.112, -0.035, 0.009, 0.011);
  }
  const shell = new THREE.ExtrudeGeometry(shape, {
    depth: 0.016, bevelEnabled: true, bevelThickness: 0.007,
    bevelSize: 0.006, bevelSegments: 1, steps: 1, curveSegments: 8,
  });
  const positions = shell.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i);
    positions.setZ(i, positions.getZ(i) + 0.174 + 0.035 * (1 - (x / 0.17) ** 2) - 0.018 * (y / 0.22) ** 2);
  }
  shell.computeVertexNormals();
  const mask: THREE.BufferGeometry[] = [];
  part(mask, shell, 0xd5d1bb);
  // Classic hockey-mask red markings make the requested slasher costume readable.
  for (const side of [-1, 1]) {
    box(mask, 0x983c32, [side*.118, -.055, .214], [.018,.073,.01], [0,side*.25,side*-.35]);
    box(mask, 0x983c32, [side*.032, .145, .219], [.016,.080,.009], [0,0,side*-.62]);
  }
  part(mask, new THREE.ConeGeometry(0.028, 0.095, 4), 0xbebca6, [0, -0.005, 0.211], [1, 1, 0.65], [0.20, 0, Math.PI]);
  batch(head, mask, maskMaterial, "halloween-mask");
  return { group, arms, legs, head };
}
