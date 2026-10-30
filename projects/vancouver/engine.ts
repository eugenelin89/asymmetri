import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { inPolygon, segmentDistance, stepCar, type CarState } from "./physics";
import type { City, Explorer, Input, Mode, Point2, Polygon2 } from "./types";

type Callbacks = { select(id: string): void; speed(kmh: number): void; fail(message: string): void };
const DATA = "/vancouver/v0.1-2026-10-30/city.json";

function shapeOf(polygon: Polygon2) {
  const result = new THREE.Shape(polygon[0].map(([x, z]) => new THREE.Vector2(x, -z)));
  result.holes = polygon.slice(1).map((hole) => new THREE.Path(hole.map(([x, z]) => new THREE.Vector2(x, -z))));
  return result;
}

export async function createExplorer(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal): Promise<Explorer> {
  const response = await fetch(DATA, { signal });
  if (!response.ok) throw new Error("The city data could not be loaded. Please try again.");
  const city: City = await response.json();
  signal.throwIfAborted();
  const coarse = matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.25 : 1.75));
  renderer.setClearColor(0xc5d8dd);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", "Interactive False Creek. Drag to orbit, scroll to zoom, arrow keys to pan. In driving mode use arrow keys or W A S D; space brakes; R resets.");
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xc5d8dd, 1700, 4200);
  const camera = new THREE.PerspectiveCamera(48, 1, 1, 6500);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.dampingFactor = 0.12;
  controls.minDistance = 45;
  controls.maxDistance = 2100;
  controls.maxPolarAngle = Math.PI * 0.475;
  controls.screenSpacePanning = false;
  controls.target.set(50, 0, 0);
  scene.add(new THREE.HemisphereLight(0xe8f2f5, 0x7e8b78, 2.5));
  const sun = new THREE.DirectionalLight(0xfff0d8, 3);
  sun.position.set(-700, 1100, 500);
  scene.add(sun);
  const materials: THREE.Material[] = [];
  const material = (color: number) => {
    const m = new THREE.MeshLambertMaterial({ color });
    materials.push(m); return m;
  };
  const waterMaterial = material(0x418f9d), landMaterial = material(0xc7c7b7);
  const parkMaterial = material(0x8aa581), roadMaterial = material(0x687473);
  const white = material(0xede9da), dark = material(0x273d43), teal = material(0x08ad9e);

  function flat(polys: Polygon2[], mat: THREE.Material, y: number) {
    const geo = new THREE.ShapeGeometry(polys.map(shapeOf));
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, mat); mesh.position.y = y; scene.add(mesh); return mesh;
  }
  flat(city.water, waterMaterial, -0.3);
  flat(city.land, landMaterial, 0);
  flat(city.parks.map((p) => p.shape), parkMaterial, 0.18);

  // Merge static building geometry into one draw call with per-building colour.
  const buildingGeometries: THREE.BufferGeometry[] = [];
  const edgeGeometries: THREE.BufferGeometry[] = [];
  const palette = [0xd5dad4, 0xa8babb, 0xe0d8c9, 0xbac6c2, 0xc0c3b6, 0xa2b4b8];
  city.buildings.forEach((building, index) => {
    const geometry = new THREE.ExtrudeGeometry(shapeOf(building.shape), { depth: building.height, bevelEnabled: false, steps: 1, curveSegments: 1 });
    geometry.rotateX(-Math.PI / 2);
    const count = geometry.getAttribute("position").count;
    const color = new THREE.Color(palette[index % palette.length]);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) color.toArray(colors, i * 3);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    buildingGeometries.push(geometry);
    if (!coarse) edgeGeometries.push(new THREE.EdgesGeometry(geometry, 25));
    // A large stadium footprint gets an original, illustrative pale roof.
    const bounds = new THREE.Box3().setFromBufferAttribute(geometry.getAttribute("position") as THREE.BufferAttribute);
    const size = bounds.getSize(new THREE.Vector3());
    if (size.x > 170 && size.z > 170 && building.height === 24) {
      const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
      roof.scale.set(size.x * .46, 16, size.z * .46); roof.position.copy(bounds.getCenter(new THREE.Vector3())); roof.position.y = building.height; scene.add(roof);
    }
  });
  const buildingMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });
  materials.push(buildingMaterial);
  const merged = mergeGeometries(buildingGeometries);
  if (merged) scene.add(new THREE.Mesh(merged, buildingMaterial));
  buildingGeometries.forEach((g) => g.dispose());
  if (edgeGeometries.length) {
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x718683, transparent: true, opacity: 0.3 });
    materials.push(edgeMaterial);
    const edges = mergeGeometries(edgeGeometries);
    if (edges) scene.add(new THREE.LineSegments(edges, edgeMaterial));
    edgeGeometries.forEach((g) => g.dispose());
  }

  // Road geometry is grounded; bridge decks are intentionally visual-only.
  const roads: THREE.BufferGeometry[] = [];
  for (const road of city.roads) {
    for (let i = 1; i < road.points.length; i++) {
      const [ax, az] = road.points[i - 1], [bx, bz] = road.points[i];
      const dx = bx - ax, dz = bz - az, length = Math.hypot(dx, dz);
      const bridge = road.bridge || (road.name.includes("CAMBIE") && city.water.some((p) => inPolygon([(ax + bx) / 2, (az + bz) / 2], p)));
      const g = new THREE.BoxGeometry(road.width, bridge ? 2 : 0.15, length + 1);
      g.rotateY(Math.atan2(dx, dz)); g.translate((ax + bx) / 2, bridge ? 13 : 0.25, (az + bz) / 2); roads.push(g);
    }
  }
  const roadMesh = mergeGeometries(roads);
  if (roadMesh) scene.add(new THREE.Mesh(roadMesh, roadMaterial));
  roads.forEach((g) => g.dispose());

  const treePositions: Point2[] = [];
  for (const park of city.parks) {
    const points = park.shape[0];
    const xs = points.map((p) => p[0]), zs = points.map((p) => p[1]);
    for (let x = Math.min(...xs) + 10; x < Math.max(...xs); x += 22) {
      for (let z = Math.min(...zs) + 10; z < Math.max(...zs); z += 22) {
        if (inPolygon([x, z], park.shape) && treePositions.length < 900) treePositions.push([x, z]);
      }
    }
  }
  const trees = new THREE.InstancedMesh(new THREE.ConeGeometry(3.7, 12, 5), material(0x4c7763), treePositions.length);
  const matrix = new THREE.Matrix4();
  treePositions.forEach(([x, z], i) => { matrix.makeTranslation(x, 6, z); trees.setMatrixAt(i, matrix); });
  scene.add(trees);

  function boxMesh(w: number, h: number, d: number, mat: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  const [sx, sz] = city.anchors["science-world"];
  const science = new THREE.Group(); science.position.set(sx, 0, sz); scene.add(science);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(28, 30, 8, 32), white); base.position.y = 7; science.add(base);
  const domeGeometry = new THREE.IcosahedronGeometry(22, 2);
  const dome = new THREE.Mesh(domeGeometry, material(0xabc9d0)); dome.position.y = 28; science.add(dome);
  const wireMaterial = new THREE.LineBasicMaterial({ color: 0xf1f1dd }); materials.push(wireMaterial);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(domeGeometry, 1), wireMaterial); wire.position.y = 28; science.add(wire);
  boxMesh(35, 7, 22, dark, science, 24, 5, 6);

  // Landmark beacons have larger invisible pick targets for touch.
  const beacons = new THREE.Group(); scene.add(beacons);
  const pickTargets: THREE.Object3D[] = [];
  const transparent = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); materials.push(transparent);
  Object.entries(city.anchors).forEach(([id, [x, z]]) => {
    const height = id === "science-world" ? 68 : 52;
    const group = new THREE.Group(); group.position.set(x, height, z); beacons.add(group);
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(7), teal); group.add(marker);
    const pick = new THREE.Mesh(new THREE.SphereGeometry(20, 8, 6), transparent); pick.userData.place = id; group.add(pick); pickTargets.push(pick);
    const line = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -height + 3, 0), new THREE.Vector3(0, -10, 0)]);
    group.add(new THREE.Line(line, wireMaterial));
  });
  // Original arcade car: no external models, textures, scripts or physics engine.
  const carModel = new THREE.Group(); scene.add(carModel);
  boxMesh(1.9, 0.7, 3.8, teal, carModel, 0, 0.85, 0);
  boxMesh(1.6, 0.65, 1.9, dark, carModel, 0, 1.48, -0.2);
  for (const x of [-1, 1]) for (const z of [-1.15, 1.15]) boxMesh(0.35, 0.6, 0.7, dark, carModel, x, 0.45, z);
  boxMesh(1.5, 0.18, 0.12, white, carModel, 0, 0.95, 1.94);

  const buildingBounds = city.buildings.map((b) => ({ shape: b.shape, minX: Math.min(...b.shape[0].map((p) => p[0])), maxX: Math.max(...b.shape[0].map((p) => p[0])), minZ: Math.min(...b.shape[0].map((p) => p[1])), maxZ: Math.max(...b.shape[0].map((p) => p[1])) }));
  const segments = city.roads.filter((r) => !r.bridge).flatMap((r) => r.points.slice(1).map((b, i) => ({ a: r.points[i], b, width: r.width })));
  function allowed(p: Point2) {
    if (!city.land.some((land) => inPolygon(p, land))) return false;
    if (buildingBounds.some((b) => p[0] >= b.minX && p[0] <= b.maxX && p[1] >= b.minZ && p[1] <= b.maxZ && inPolygon(p, b.shape))) return false;
    return segments.some((s) => segmentDistance(p, s.a, s.b) < s.width / 2 + 1);
  }
  const spawnRoads = city.roads.filter((r) => r.name.includes("1ST") && !r.bridge);
  const spawnCandidates = [...spawnRoads, ...city.roads.filter((r) => !r.bridge)];
  let spawn: CarState | undefined;
  for (const road of spawnCandidates) {
    for (let i = 1; i < road.points.length; i++) {
      const a = road.points[i - 1], b = road.points[i];
      const p: Point2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (p[1] > 100 && allowed(p) && allowed([p[0] + 1.5, p[1]]) && allowed([p[0], p[1] + 1.5])) { spawn = { x: p[0], z: p[1], yaw: Math.atan2(b[0] - a[0], b[1] - a[1]), speed: 0 }; break; }
    }
    if (spawn) break;
  }
  if (!spawn) spawn = { x: 0, z: 350, yaw: 0, speed: 0 };
  let car = { ...spawn }, mode: Mode = "aerial", disposed = false;
  const input = new Set<Input>();
  const reset = () => {
    input.clear(); car = { ...spawn } as CarState;
    if (mode === "aerial") { controls.target.set(40, 0, 0); camera.position.set(1000, 880, 1100); controls.update(); }
    else { camera.position.set(car.x - Math.sin(car.yaw) * 14, 8, car.z - Math.cos(car.yaw) * 14); camera.lookAt(car.x, 1, car.z); }
  };
  const setMode = (next: Mode) => { mode = next; controls.enabled = mode === "aerial"; carModel.visible = mode === "drive"; beacons.visible = mode === "aerial"; reset(); };
  setMode("aerial");
  const keyMap: Record<string, Input> = { ArrowUp: "forward", w: "forward", ArrowDown: "back", s: "back", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", " ": "brake" };
  const keyDown = (event: KeyboardEvent) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; if (keyMap[key]) { event.preventDefault(); input.add(keyMap[key]); } if (key === "r") reset(); };
  const keyUp = (event: KeyboardEvent) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; if (keyMap[key]) input.delete(keyMap[key]); };
  const clearInput = () => input.clear();
  const pointerStart = new THREE.Vector2();
  const pointerDown = (e: PointerEvent) => { canvas.focus({ preventScroll: true }); pointerStart.set(e.clientX, e.clientY); };
  const pointerUp = (e: PointerEvent) => {
    if (mode !== "aerial" || pointerStart.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 6) return;
    const rect = canvas.getBoundingClientRect();
    const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = ray.intersectObjects(pickTargets, false)[0];
    if (hit) callbacks.select(hit.object.userData.place);
  };
  const contextLost = (event: Event) => { event.preventDefault(); callbacks.fail("The 3D view paused because graphics memory became unavailable. Reload the scene or explore the places below."); };
  canvas.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("blur", clearInput);
  canvas.addEventListener("blur", clearInput); document.addEventListener("visibilitychange", clearInput);
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("webglcontextlost", contextLost);
  const resize = new ResizeObserver(() => { const { width, height } = host.getBoundingClientRect(); if (width && height) { renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); } }); resize.observe(host);
  let last = 0, lastSpeed = 0, raf = 0, sampleStart = 0, sampleFrames = 0;
  function frame(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now;
    if (document.hidden || renderer.getContext().isContextLost()) return;
    if (mode === "drive") {
      car = stepCar(car, Number(input.has("forward")) - Number(input.has("back")), Number(input.has("left")) - Number(input.has("right")), input.has("brake"), dt, allowed);
      carModel.position.set(car.x, 0, car.z); carModel.rotation.y = car.yaw;
      const next = new THREE.Vector3(car.x - Math.sin(car.yaw) * 13, 7, car.z - Math.cos(car.yaw) * 13);
      camera.position.lerp(next, 1 - Math.exp(-7 * dt)); camera.lookAt(car.x + Math.sin(car.yaw) * 8, 1.6, car.z + Math.cos(car.yaw) * 8);
      if (now - lastSpeed > 250) { callbacks.speed(Math.round(Math.abs(car.speed) * 3.6)); lastSpeed = now; }
    } else {
      const shift = new THREE.Vector3(Number(input.has("right")) - Number(input.has("left")), 0, Number(input.has("back")) - Number(input.has("forward"))).multiplyScalar(dt * 180);
      controls.target.add(shift); camera.position.add(shift);
      const old = controls.target.clone(); controls.target.x = THREE.MathUtils.clamp(old.x, -850, 850); controls.target.z = THREE.MathUtils.clamp(old.z, -550, 550); camera.position.add(controls.target.clone().sub(old));
      controls.update();
    }
    renderer.render(scene, camera);
    sampleFrames++;
    if (now - sampleStart >= 1000) {
      // Read-only DOM diagnostics for release verification; no telemetry.
      canvas.dataset.fps = String(Math.round(sampleFrames * 1000 / (now - sampleStart)));
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      sampleStart = now; sampleFrames = 0;
    }
  }
  raf = requestAnimationFrame(frame);
  return {
    setMode, reset,
    setInput(action, pressed) { if (pressed) input.add(action); else input.delete(action); },
    focus(id) { const point = city.anchors[id]; if (!point) return; setMode("aerial"); controls.target.set(point[0], 10, point[1]); camera.position.set(point[0] + 170, 220, point[1] + 240); controls.update(); },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); resize.disconnect(); controls.dispose(); input.clear();
      canvas.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("blur", clearInput); canvas.removeEventListener("blur", clearInput); document.removeEventListener("visibilitychange", clearInput);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.Line) geometries.add(object.geometry); if (object instanceof THREE.InstancedMesh) object.dispose(); });
      geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
