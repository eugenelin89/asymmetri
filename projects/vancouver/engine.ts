import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createDrivingWorld, stepCar } from "./physics";
import { buildScenery } from "./scenery";
import type { City, DriveTelemetry, Explorer, Input, Mode } from "./types";

type Callbacks = { select(id: string): void; telemetry(value: DriveTelemetry): void; map(city: City): void; fail(message: string): void; recover(): void };
const DATA = "/vancouver/v0.2-2026-10-30/city.json";

export async function createExplorer(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal): Promise<Explorer> {
  const response = await fetch(DATA, { signal });
  if (!response.ok) throw new Error("The city data could not be loaded. Please retry.");
  const city: City = await response.json(); signal.throwIfAborted();
  if (city.version !== "v0.2-2026-10-30" || !Array.isArray(city.pavement) || !city.buildings.length) throw new Error("The city data is incomplete. Please retry.");
  const world = createDrivingWorld(city);
  const coarse = matchMedia("(pointer: coarse)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0xd3e0e1); renderer.shadowMap.enabled = !coarse; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement; canvas.tabIndex = 0;
  canvas.dataset.version = city.version;
  canvas.setAttribute("aria-label", "Interactive False Creek. Drag to orbit, scroll to zoom, two fingers to pan. Driving: W A S D or arrows, space brakes, R resets. Focus here for keyboard controls.");
  host.appendChild(canvas);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xd3e0e1, 1900, 4800);
  const camera = new THREE.PerspectiveCamera(44, 1, .6, 7000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reducedMotion; controls.dampingFactor = .1; controls.minDistance = 45; controls.maxDistance = 2450;
  controls.maxPolarAngle = Math.PI * .475; controls.screenSpacePanning = false;
  scene.add(new THREE.HemisphereLight(0xd8edf3, 0x8b9776, 1.75));
  const sun = new THREE.DirectionalLight(0xffe4ba, 3.1); sun.position.set(-650, 1000, 450);
  sun.castShadow = !coarse; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1100, right: 1100, top: 1000, bottom: -1000, near: 10, far: 2300 });
  sun.shadow.bias = -.00015; sun.shadow.normalBias = .8; scene.add(sun);
  let scenery: ReturnType<typeof buildScenery>;
  function disposeScene() {
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) {
        if ("geometry" in object) geometries.add(object.geometry);
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach((m) => { materials.add(m); for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value); });
      }
      if (object instanceof THREE.InstancedMesh) object.dispose();
    });
    scenery?.materials.forEach((m) => materials.add(m)); scenery?.textures.forEach((t) => textures.add(t));
    geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); textures.forEach((t) => t.dispose());
    sun.shadow.map?.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  }
  try { scenery = buildScenery(scene, city, coarse); } catch (error) { controls.dispose(); disposeScene(); throw error; }
  let disposed = false, lost = false, visible = true, mode: Mode = "aerial", quality: "auto" | "low" = "auto";
  let spawn = world.spawnNear(), car = { ...spawn }, selected = "science-world";
  let renderHeight = 700;
  let pixelRatio = Math.min(devicePixelRatio, coarse ? 1.25 : 1.6);
  renderer.setPixelRatio(pixelRatio);
  const keyboard = new Set<Input>(), touch = new Set<Input>();
  const pressed = (action: Input) => keyboard.has(action) || touch.has(action);
  const clearInput = () => { keyboard.clear(); touch.clear(); };
  let flight: { from: THREE.Vector3; targetFrom: THREE.Vector3; to: THREE.Vector3; targetTo: THREE.Vector3; progress: number } | null = null;
  const overviewTarget = new THREE.Vector3(30, 0, -25), overviewPosition = new THREE.Vector3(950, 850, 1050);
  const aerial = { position: overviewPosition.clone(), target: overviewTarget.clone() };
  const cameraAim = new THREE.Vector3(); let cameraYaw = car.yaw;
  function report() { callbacks.telemetry({ speed: Math.round(Math.abs(car.speed) * 3.6), reverse: car.speed < -.1, street: world.streetAt([car.x, car.z]), x: car.x, z: car.z, yaw: car.yaw, blocked: !!car.blocked }); }
  function select(id: string) {
    const p = city.anchors[id]; if (!p) return;
    selected = id; scenery.highlight.position.set(p[0], .35, p[1]);
    scenery.labels.forEach((label, key) => { label.material.opacity = key === id ? 1 : .78; });
  }
  function snapDriveCamera() {
    cameraYaw = car.yaw; camera.position.set(car.x - Math.sin(car.yaw) * 15, 8.5, car.z - Math.cos(car.yaw) * 15);
    cameraAim.set(car.x + Math.sin(car.yaw) * 4, 1.4, car.z + Math.cos(car.yaw) * 4); camera.lookAt(cameraAim);
  }
  const reset = () => {
    clearInput(); flight = null;
    if (mode === "aerial") { controls.target.copy(overviewTarget); camera.position.copy(overviewPosition); controls.update(); }
    else { car = { ...spawn }; snapDriveCamera(); report(); }
  };
  const setMode = (next: Mode) => {
    if (next === mode) return;
    clearInput(); flight = null;
    if (mode === "aerial") { aerial.position.copy(camera.position); aerial.target.copy(controls.target); }
    mode = next; controls.enabled = mode === "aerial"; scenery.car.visible = mode === "drive"; scenery.markers.visible = mode === "aerial"; scenery.highlight.visible = mode === "aerial";
    if (mode === "drive") { car.speed = 0; car.steer = 0; snapDriveCamera(); report(); }
    else { camera.position.copy(aerial.position); controls.target.copy(aerial.target); controls.update(); }
  };
  scenery.car.visible = false; reset(); select(selected); callbacks.map(city); report();
  function focus(id: string) {
    const p = city.anchors[id]; if (!p) return;
    setMode("aerial"); select(id);
    const to = new THREE.Vector3(p[0] + 170, 205, p[1] + 230), targetTo = new THREE.Vector3(p[0], 10, p[1]);
    if (reducedMotion) { camera.position.copy(to); controls.target.copy(targetTo); controls.update(); }
    else flight = { from: camera.position.clone(), targetFrom: controls.target.clone(), to, targetTo, progress: 0 };
  }
  function driveNear(id: string) { const p = city.anchors[id]; if (!p) return; spawn = world.spawnNear(p); car = { ...spawn }; select(id); setMode("drive"); snapDriveCamera(); clearInput(); report(); }
  const keyMap: Record<string, Input> = { ArrowUp: "forward", w: "forward", ArrowDown: "back", s: "back", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", " ": "brake" };
  const key = (event: KeyboardEvent) => event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const keyDown = (event: KeyboardEvent) => { if (event.altKey || event.ctrlKey || event.metaKey) return; if (keyMap[key(event)]) { event.preventDefault(); keyboard.add(keyMap[key(event)]); flight = null; } if (key(event) === "r") { event.preventDefault(); reset(); } };
  const keyUp = (event: KeyboardEvent) => keyboard.delete(keyMap[key(event)]);
  const pointerStart = new THREE.Vector2();
  const pointerDown = (event: PointerEvent) => { canvas.focus({ preventScroll: true }); pointerStart.set(event.clientX, event.clientY); flight = null; };
  const pointerUp = (event: PointerEvent) => {
    if (mode !== "aerial" || event.button !== 0 || pointerStart.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6) return;
    const rect = canvas.getBoundingClientRect(), ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = ray.intersectObjects(scenery.pickTargets, false)[0];
    if (hit) { focus(hit.object.userData.place); callbacks.select(hit.object.userData.place); }
  };
  let raf = 0, last = 0, lastHud = 0, sampleStart = 0, frames = 0, slowSamples = 0;
  const schedule = () => { if (!raf && !disposed && !lost && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; sampleStart = 0; frames = 0; };
  const visibility = () => { clearInput(); if (document.hidden) stop(); else schedule(); };
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; clearInput(); stop(); callbacks.fail("The graphics connection was interrupted. Your place information is still here. Retry 3D to continue."); };
  const contextRestored = () => { if (!disposed) callbacks.recover(); };
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (width && height) { renderHeight = height; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); schedule(); }
  }); resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else { clearInput(); stop(); } }); intersection.observe(host);
  canvas.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("blur", clearInput); canvas.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", visibility); canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("webglcontextlost", contextLost); canvas.addEventListener("webglcontextrestored", contextRestored);
  const nextCamera = new THREE.Vector3(), nextAim = new THREE.Vector3();
  function frame(now: number) {
    raf = 0; if (disposed || lost || !visible || document.hidden) return;
    const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, .05); last = now;
    if (mode === "drive") {
      car = stepCar(car, Number(pressed("forward")) - Number(pressed("back")), Number(pressed("left")) - Number(pressed("right")), pressed("brake"), dt, world.allowed);
      scenery.car.position.set(car.x, 0, car.z); scenery.car.rotation.y = car.yaw;
      scenery.body.rotation.z = -(car.steer ?? 0) * car.speed * .012;
      scenery.frontWheels.forEach((wheel) => { wheel.rotation.y = car.steer ?? 0; }); scenery.wheels.forEach((wheel) => { wheel.rotation.x += car.speed * dt / .36; });
      scenery.brakeMaterial.emissiveIntensity = pressed("brake") || (pressed("back") && car.speed > 0) ? 2 : .12;
      cameraYaw += Math.atan2(Math.sin(car.yaw - cameraYaw), Math.cos(car.yaw - cameraYaw)) * (1 - Math.exp(-7 * dt));
      let distance = 15 + Math.abs(car.speed) * .18;
      while (distance > 6 && !world.allowed([car.x - Math.sin(cameraYaw) * distance, car.z - Math.cos(cameraYaw) * distance])) distance -= 1.5;
      nextCamera.set(car.x - Math.sin(cameraYaw) * distance, 8.5 + Math.abs(car.speed) * .06, car.z - Math.cos(cameraYaw) * distance);
      camera.position.lerp(nextCamera, 1 - Math.exp(-6 * dt));
      nextAim.set(car.x + Math.sin(car.yaw) * (4 + car.speed * .25), 1.4, car.z + Math.cos(car.yaw) * (4 + car.speed * .25));
      cameraAim.lerp(nextAim, 1 - Math.exp(-8 * dt)); camera.lookAt(cameraAim);
      if (now - lastHud > 200) { report(); lastHud = now; }
    } else {
      if (flight) {
        flight.progress = Math.min(1, flight.progress + dt / .85); const t = flight.progress * flight.progress * (3 - 2 * flight.progress);
        camera.position.lerpVectors(flight.from, flight.to, t); controls.target.lerpVectors(flight.targetFrom, flight.targetTo, t);
        if (flight.progress === 1) flight = null;
      } else {
        const dx = (Number(pressed("right")) - Number(pressed("left"))) * dt * 180, dz = (Number(pressed("back")) - Number(pressed("forward"))) * dt * 180;
        const x = THREE.MathUtils.clamp(controls.target.x + dx, -850, 850), z = THREE.MathUtils.clamp(controls.target.z + dz, -550, 550);
        camera.position.x += x - controls.target.x; camera.position.z += z - controls.target.z; controls.target.x = x; controls.target.z = z;
      }
      controls.update();
      const scaleFor = (position: THREE.Vector3) => camera.position.distanceTo(position) * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / renderHeight;
      scenery.labels.forEach((label, id) => { const size = scaleFor(label.position); label.visible = id === selected; label.scale.set(212 * size, 33 * size, 1); });
      scenery.numberLabels.forEach((label) => { const size = 30 * scaleFor(label.position); label.scale.set(size, size, 1); });
    }
    if (!reducedMotion) scenery.shimmerMaterial.opacity = .18 + Math.sin(now / 1900) * .045;
    renderer.render(scene, camera); frames++;
    if (!sampleStart) sampleStart = now;
    if (now - sampleStart >= 1000) {
      const fps = Math.round(frames * 1000 / (now - sampleStart));
      canvas.dataset.fps = String(fps); canvas.dataset.drawCalls = String(renderer.info.render.calls); canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.geometries = String(renderer.info.memory.geometries); canvas.dataset.textures = String(renderer.info.memory.textures);
      canvas.dataset.pixelRatio = String(pixelRatio); canvas.dataset.mode = mode;
      slowSamples = fps < 35 ? slowSamples + 1 : 0;
      if (quality === "auto" && slowSamples >= 3 && pixelRatio > 1) { pixelRatio = 1; renderer.setPixelRatio(pixelRatio); slowSamples = 0; }
      sampleStart = now; frames = 0;
    }
    schedule();
  }
  schedule();
  return {
    setMode, reset, focus, driveNear,
    setInput(action, held) { if (held) touch.add(action); else touch.delete(action); },
    setQuality(next) { quality = next; pixelRatio = next === "low" ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, coarse ? 1.25 : 1.6); renderer.setPixelRatio(pixelRatio); renderer.shadowMap.enabled = next === "auto" && !coarse; renderer.shadowMap.needsUpdate = true; },
    dispose() {
      if (disposed) return; disposed = true; stop(); clearInput(); resize.disconnect(); intersection.disconnect(); controls.dispose();
      canvas.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("blur", clearInput); canvas.removeEventListener("blur", clearInput);
      document.removeEventListener("visibilitychange", visibility); canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("webglcontextlost", contextLost); canvas.removeEventListener("webglcontextrestored", contextRestored); disposeScene();
    },
  };
}
