import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { carFits, createDrivingWorld, inPolygon, stepCar } from "./physics";
import { angleDifference, createNavigator, cruiseInput, pointAt, projectRoute } from "./navigation";
import { buildScenery } from "./scenery";
import { createInputState } from "./input";
import { fitDrivingCamera } from "./camera";
import { clearanceAhead, createManualDriver } from "./handling";
import type { City, DriveRoute, DriveTelemetry, Explorer, Input, Mode } from "./types";

type Callbacks = { select(id: string): void; telemetry(value: DriveTelemetry): void; map(city: City): void; route(route: DriveRoute | null): void; fail(message: string): void; recover(): void };
const DATA = "/vancouver/v0.4-2026-10-30/city.json";

export async function createExplorer(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal): Promise<Explorer> {
  const response = await fetch(DATA, { signal });
  if (!response.ok) throw new Error("The city data could not be loaded. Please retry.");
  const city: City = await response.json(); signal.throwIfAborted();
  const research = process.env.NODE_ENV !== "production" ? await import("./development/driving-v06") : null;
  signal.throwIfAborted();
  if (city.version !== "v0.4-2026-10-30" || !Array.isArray(city.pavement) || !city.buildings.length || !city.graph || !city.roadCells || city.drives?.length !== 3) throw new Error("The city data is incomplete. Please retry.");
  const world = createDrivingWorld(city);
  const cameraClear = research?.createCameraClearance(city.buildings, inPolygon);
  const navigator = createNavigator(city, (pose) => carFits(pose, world.allowed), !!research);
  const coarse = matchMedia("(pointer: coarse)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0xd3e0e1); renderer.shadowMap.enabled = !coarse; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement; canvas.tabIndex = 0;
  canvas.dataset.version = city.version;
  canvas.dataset.release = "v0.5";
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
  let route: DriveRoute | null = null, progress = 0, cruising = false, laps = 0, travelled = 0;
  let driveSeconds = 0, driveFrames = 0, collisions = 0, minFps = Infinity;
  let recoveries = 0, resets = 0, movingSeconds = 0;
  let runStart = { distance: 0, seconds: 0, collisions: 0, recoveries: 0, resets: 0, movingSeconds: 0 };
  let paused = false;
  let pace: "relaxed" | "normal" = "relaxed", cameraMode: "chase" | "wide" = "chase";
  const frameTimes: number[] = [];
  let renderHeight = 700;
  let pixelRatio = Math.min(devicePixelRatio, coarse ? 1.25 : 1.6);
  renderer.setPixelRatio(pixelRatio);
  const inputs = createInputState();
  const baselineDriver = createManualDriver(stepCar), candidateDriver = research?.createManualDriver(stepCar);
  let baseline = true, manualDriver = baselineDriver, evidence = research?.createDrivingEvidence();
  const pressed = inputs.has;
  const clearInput = () => { inputs.clear(); manualDriver.clear(); };
  const beginRun = () => { runStart = { distance: travelled, seconds: driveSeconds, collisions, recoveries, resets, movingSeconds }; evidence = research?.createDrivingEvidence(); };
  let flight: { from: THREE.Vector3; targetFrom: THREE.Vector3; to: THREE.Vector3; targetTo: THREE.Vector3; progress: number } | null = null;
  const overviewTarget = new THREE.Vector3(30, 0, -25), overviewPosition = new THREE.Vector3(950, 850, 1050);
  const aerial = { position: overviewPosition.clone(), target: overviewTarget.clone() };
  const cameraAim = new THREE.Vector3(); let cameraYaw = car.yaw;
  function report() {
    Object.assign(canvas.dataset, { distance: travelled.toFixed(1), collisions: String(collisions), recoveries: String(recoveries), resets: String(resets),
      runDistance: (travelled - runStart.distance).toFixed(1), runSeconds: (driveSeconds - runStart.seconds).toFixed(1), runMovingSeconds: (movingSeconds - runStart.movingSeconds).toFixed(1),
      runContacts: String(collisions - runStart.collisions), runRecoveries: String(recoveries - runStart.recoveries), runResets: String(resets - runStart.resets),
      carX: car.x.toFixed(2), carZ: car.z.toFixed(2), carYaw: car.yaw.toFixed(4), carSpeed: car.speed.toFixed(2), cruising: String(cruising), pace,
      handling: baseline ? "v0.5-baseline" : "v0.6-candidate-d", camera: cameraMode, ...(evidence ? { drivingEvidence: JSON.stringify(evidence.read()) } : {}) });
    const nextTurn = route?.turns.find((turn) => turn.at > progress - 6 && !(baseline && turn.direction.startsWith("Bear")));
    const turnDistance = nextTurn ? Math.max(0, nextTurn.at - progress) : 0;
    const turnCue = turnDistance < 6 ? "at this junction" : `${Math.round(turnDistance / (turnDistance < 40 ? 5 : 10)) * (turnDistance < 40 ? 5 : 10)} m`;
    const projection = route ? projectRoute(route, [car.x, car.z], progress) : null;
    const remaining = route ? Math.max(0, route.length - progress) : 0;
    const ahead = route ? pointAt(route, Math.min(route.length, progress + 8)) : null;
    const facingAway = ahead && remaining > 12 && Math.abs(angleDifference(Math.atan2(ahead[0] - car.x, ahead[1] - car.z), car.yaw)) > 2.2;
    const clearance = mode === "drive" ? clearanceAhead(car, (pose) => carFits(pose, world.allowed)) : 10;
    callbacks.telemetry({ speed: Math.round(Math.abs(car.speed) * 3.6), reverse: car.speed < -.1, street: world.streetAt([car.x, car.z]), x: car.x, z: car.z, yaw: car.yaw, blocked: !!car.blocked, blockedReason: car.blocked ? world.obstruction(car) : undefined, travelled, steering: car.steer ?? 0, clearance,
      navigation: route ? { instruction: projection && projection.distance > 18 ? "Return to the highlighted streets" : !route.loop && remaining < 12 ? "At your roadside stop" : facingAway ? "Turn around at a junction to follow the route" : nextTurn ? `${nextTurn.direction} onto ${nextTurn.street} · ${turnCue}` : route.loop ? "Follow the waterfront loop" : "Continue to your roadside stop", remaining: Math.round(remaining), offRoute: !!projection && projection.distance > 18, arrived: !route.loop && remaining < 12 && !!projection && projection.distance < 18, cruising, laps, progress } : undefined });
  }
  function setRoute(next: DriveRoute | null) { route = next; progress = 0; laps = 0; cruising = false; scenery.setRoute(next); callbacks.route(next); report(); }
  function startScenic(reverse = false) {
    startRoute(navigator.scenic(reverse));
  }
  function startRoute(next: DriveRoute) {
    const first = next.points[0], ahead = pointAt(next, 3);
    spawn = { x: first[0], z: first[1], yaw: Math.atan2(ahead[0] - first[0], ahead[1] - first[1]), speed: 0, steer: 0 };
    car = { ...spawn }; setMode("drive"); beginRun(); setRoute(next); clearInput(); snapDriveCamera(); report();
  }
  function navigate(id: string) {
    const next = navigator.navigate([car.x, car.z], id, `To ${id.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
    setMode("drive"); setRoute(next); select(id); clearInput(); report();
  }
  const startDrive = (id: string, reverse = false) => startRoute(navigator.drive(id, reverse));
  function navigatePoint(point: [number, number]) {
    const next = navigator.navigatePoint([car.x, car.z], point);
    setMode("drive"); setRoute(next); clearInput(); report();
  }
  function recover() { recoveries++; car = world.recoverNear(car); cruising = false; clearInput(); snapDriveCamera(); if (route) progress = projectRoute(route, [car.x, car.z]).progress; report(); }

  function select(id: string) {
    const p = city.anchors[id]; if (!p) return;
    selected = id; scenery.highlight.position.set(p[0], .35, p[1]);
    scenery.labels.forEach((label, key) => { label.material.opacity = key === id ? 1 : .78; });
  }
  function snapDriveCamera() {
    const distance = cameraMode === "wide" ? (baseline ? 23 : 24) : 15;
    const height = cameraMode === "wide" ? (baseline ? 15 : 17) : (baseline ? 8.5 : 10);
    cameraYaw = car.yaw; camera.position.set(car.x - Math.sin(car.yaw) * distance, height, car.z - Math.cos(car.yaw) * distance);
    cameraAim.set(car.x + Math.sin(car.yaw) * 4, 1.4, car.z + Math.cos(car.yaw) * 4); camera.lookAt(cameraAim);
  }
  const reset = () => {
    clearInput(); flight = null; cruising = false;
    if (mode === "aerial") { controls.target.copy(overviewTarget); camera.position.copy(overviewPosition); controls.update(); }
    else { resets++; car = { ...spawn }; if (route) { progress = projectRoute(route, [car.x, car.z]).progress; laps = 0; } snapDriveCamera(); report(); }
  };
  const setMode = (next: Mode) => {
    if (next === mode) return;
    clearInput(); flight = null; cruising = false;
    if (mode === "aerial") { aerial.position.copy(camera.position); aerial.target.copy(controls.target); }
    mode = next; controls.enabled = mode === "aerial" && !paused; scenery.car.visible = mode === "drive"; scenery.markers.visible = true; scenery.highlight.visible = mode === "aerial";
    if (mode === "drive") { car.speed = 0; car.steer = 0; beginRun(); snapDriveCamera(); report(); }
    else { camera.position.copy(aerial.position); controls.target.copy(aerial.target); controls.update(); }
  };
  scenery.car.visible = false; reset(); select(selected); callbacks.map(city); callbacks.route(null); report();
  function focus(id: string) {
    const p = city.anchors[id]; if (!p) return;
    setMode("aerial"); select(id);
    const to = new THREE.Vector3(p[0] + 170, 205, p[1] + 230), targetTo = new THREE.Vector3(p[0], 10, p[1]);
    if (reducedMotion) { camera.position.copy(to); controls.target.copy(targetTo); controls.update(); }
    else flight = { from: camera.position.clone(), targetFrom: controls.target.clone(), to, targetTo, progress: 0 };
  }
  function driveNear(id: string) { const p = city.anchors[id]; if (!p) return; spawn = world.spawnNear(p); car = { ...spawn }; setRoute(null); select(id); setMode("drive"); beginRun(); snapDriveCamera(); clearInput(); report(); }
  const keyMap: Record<string, Input> = { ArrowUp: "forward", w: "forward", ArrowDown: "back", s: "back", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", " ": "brake" };
  const key = (event: KeyboardEvent) => event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const keyDown = (event: KeyboardEvent) => { if (paused || event.altKey || event.ctrlKey || event.metaKey) return; if (keyMap[key(event)]) { event.preventDefault(); cruising = false; inputs.set(`key:${key(event)}`, keyMap[key(event)], true); flight = null; } if (key(event) === "r") { event.preventDefault(); reset(); } };
  const keyUp = (event: KeyboardEvent) => inputs.set(`key:${key(event)}`, keyMap[key(event)], false);
  const pointerStart = new THREE.Vector2();
  const pointers = new Set<number>(); let gesture = false;
  const pointerDown = (event: PointerEvent) => { pointers.add(event.pointerId); if (pointers.size > 1) gesture = true; else { gesture = false; pointerStart.set(event.clientX, event.clientY); } canvas.focus({ preventScroll: true }); flight = null; };
  const pointerUp = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (gesture || mode !== "aerial" || event.button !== 0 || pointerStart.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6) return;
    const rect = canvas.getBoundingClientRect(), ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = ray.intersectObjects(scenery.pickTargets, false)[0];
    if (hit) { focus(hit.object.userData.place); callbacks.select(hit.object.userData.place); }
  };
  const pointerCancel = (event: PointerEvent) => { pointers.delete(event.pointerId); gesture = true; };
  let raf = 0, last = 0, lastHud = 0, sampleStart = 0, frames = 0, slowSamples = 0;
  const schedule = () => { if (!raf && !disposed && !lost && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; sampleStart = 0; frames = 0; };
  const pauseMotion = () => { clearInput(); pointers.clear(); cruising = false; car.speed = 0; car.steer = 0; if (mode === "drive") report(); };
  const visibility = () => { pauseMotion(); if (document.hidden) stop(); else schedule(); };
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; clearInput(); stop(); callbacks.fail("The graphics connection was interrupted. Your place information is still here. Retry 3D to continue."); };
  const contextRestored = () => { if (!disposed) callbacks.recover(); };
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (width && height) { renderHeight = height; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); schedule(); }
  }); resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else { pauseMotion(); stop(); } }); intersection.observe(host);
  canvas.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("blur", pauseMotion); canvas.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", visibility); canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerCancel);
  canvas.addEventListener("webglcontextlost", contextLost); canvas.addEventListener("webglcontextrestored", contextRestored);
  const nextCamera = new THREE.Vector3(), nextAim = new THREE.Vector3(), carSightTarget = new THREE.Vector3();
  let lastBridgeSight = 0;
  function frame(now: number) {
    raf = 0; if (disposed || lost || !visible || document.hidden) return;
    const rawDt = last ? (now - last) / 1000 : 1 / 60, dt = paused ? 0 : Math.min(rawDt, .1); last = now;
    if (mode === "drive") {
      if (route) {
        const projected = projectRoute(route, [car.x, car.z], progress); progress = projected.progress;
        if (route.loop && progress > route.length - .5 && projected.distance < 8) { progress = 0; laps++; }
        if (projected.distance > 18) cruising = false;
        if (!route.loop && route.length - progress < 3) cruising = false;
      }
      const automatic = cruising && route ? cruiseInput(car, route, progress) : null;
      const prior = car;
      const throttle = automatic?.throttle ?? Number(pressed("forward")) - Number(pressed("back"));
      car = automatic
        ? stepCar(car, automatic.throttle, automatic.steering, automatic.brake, dt, world.allowed)
        : manualDriver.step(car, { throttle, steering: Number(pressed("left")) - Number(pressed("right")), brake: pressed("brake") }, pace, dt, world.allowed);
      if (!automatic) evidence?.step(prior, car, Number(pressed("left")) - Number(pressed("right")), dt, rawDt * 1000);
      travelled += Math.hypot(car.x - prior.x, car.z - prior.z); if (!paused) { driveSeconds += rawDt; driveFrames++; }
      if (Math.abs(car.speed) > .1) movingSeconds += dt;
      frameTimes.push(rawDt * 1000); if (frameTimes.length > 600) frameTimes.shift();
      if (car.blocked) { if (!prior.blocked) collisions++; cruising = false; }
      scenery.car.position.set(car.x, 0, car.z); scenery.car.rotation.y = car.yaw;
      scenery.body.rotation.z = !baseline && reducedMotion ? 0 : -(car.steer ?? 0) * car.speed * .012;
      scenery.frontWheels.forEach((wheel) => { wheel.rotation.y = car.steer ?? 0; }); scenery.wheels.forEach((wheel) => { wheel.rotation.x += car.speed * dt / .36; });
      scenery.brakeMaterial.emissiveIntensity = pressed("brake") || (pressed("back") && car.speed > 0) ? 2 : .12;
      const anticipation = baseline || reducedMotion ? 0 : THREE.MathUtils.clamp((car.steer ?? 0) * car.speed * .045, -.10, .10);
      cameraYaw += angleDifference(car.yaw + anticipation, cameraYaw) * (1 - Math.exp(-11 * dt));
      if (baseline || !research || !cameraClear) {
      const distance = (cameraMode === "wide" ? 23 : 15) + Math.abs(car.speed) * .18;
      const safe = fitDrivingCamera([car.x, car.z], [car.x - Math.sin(cameraYaw) * distance, car.z - Math.cos(cameraYaw) * distance], world.cameraClear);
      nextCamera.set(safe.x, (cameraMode === "wide" ? 15 : 8.5) + Math.abs(car.speed) * .06 + (1 - safe.fraction) * 5, safe.z);
      camera.position.lerp(nextCamera, 1 - Math.exp(-9 * dt));
      // Interpolation itself can cut through a building on the inside of a turn.
      const lagged = fitDrivingCamera([car.x, car.z], [camera.position.x, camera.position.z], world.cameraClear);
      if (lagged.fraction < 1) { camera.position.x = lagged.x; camera.position.z = lagged.z; camera.position.y = Math.max(camera.position.y, nextCamera.y); }
      nextAim.set(car.x + Math.sin(car.yaw) * (4 + car.speed * .25), 1.4, car.z + Math.cos(car.yaw) * (4 + car.speed * .25));
      cameraAim.lerp(nextAim, 1 - Math.exp(-8 * dt)); camera.lookAt(cameraAim);
      } else {
        const distance = (cameraMode === "wide" ? 24 : 15) + Math.abs(car.speed) * .12;
        const height = (cameraMode === "wide" ? 17 : 10) + Math.abs(car.speed) * .06;
        const origin = { x: car.x, y: 1.4, z: car.z };
        const margin = Math.max(.8, camera.near * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.sqrt(1 + camera.aspect ** 2));
        const safe = research.fitSpatialCamera(origin, { x: car.x - Math.sin(cameraYaw) * distance, y: height, z: car.z - Math.cos(cameraYaw) * distance }, cameraClear, margin);
        nextCamera.set(safe.x, safe.y, safe.z); camera.position.lerp(nextCamera, 1 - Math.exp(-9 * dt));
        const lagged = research.fitSpatialCamera(origin, camera.position, cameraClear, margin);
        camera.position.set(lagged.x, lagged.y, lagged.z);
        nextAim.set(car.x + Math.sin(car.yaw + anticipation) * (5 + Math.max(0, car.speed) * .25), 1.4, car.z + Math.cos(car.yaw + anticipation) * (5 + Math.max(0, car.speed) * .25));
        cameraAim.lerp(nextAim, 1 - Math.exp(-10 * dt)); camera.lookAt(cameraAim);
      }
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
    }
    const scaleFor = (position: THREE.Vector3) => camera.position.distanceTo(position) * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / renderHeight;
    scenery.labels.forEach((label, id) => { const size = scaleFor(label.position); label.visible = id === selected && (mode === "aerial" || camera.position.distanceTo(label.position) < 320); label.scale.set(212 * size, 33 * size, 1); });
    scenery.numberLabels.forEach((label) => { const size = 30 * scaleFor(label.position); label.visible = mode === "aerial" || camera.position.distanceTo(label.position) < 300; label.scale.set(size, size, 1); });
    if (!reducedMotion) scenery.shimmerMaterial.opacity = .18 + Math.sin(now / 1900) * .045;
    if (now - lastBridgeSight > 100) {
      scenery.revealCar(camera.position, mode === "drive" ? carSightTarget.set(car.x, 1, car.z) : null);
      lastBridgeSight = now;
    }
    renderer.render(scene, camera); frames++;
    if (!sampleStart) sampleStart = now;
    if (now - sampleStart >= 1000) {
      const fps = Math.round(frames * 1000 / (now - sampleStart));
      canvas.dataset.fps = String(fps); canvas.dataset.drawCalls = String(renderer.info.render.calls); canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.geometries = String(renderer.info.memory.geometries); canvas.dataset.textures = String(renderer.info.memory.textures);
      canvas.dataset.pixelRatio = String(pixelRatio); canvas.dataset.mode = mode;
      if (mode === "drive") minFps = Math.min(minFps, fps);
      canvas.dataset.driveSeconds = driveSeconds.toFixed(1); canvas.dataset.distance = travelled.toFixed(1); canvas.dataset.collisions = String(collisions);
      canvas.dataset.averageDriveFps = driveSeconds ? (driveFrames / driveSeconds).toFixed(1) : "0"; canvas.dataset.minimumDriveFps = Number.isFinite(minFps) ? String(minFps) : "0";
      canvas.dataset.frameP95 = (frameTimes.length ? [...frameTimes].sort((a, b) => a - b)[Math.floor(frameTimes.length * .95)] : 0).toFixed(1);
      canvas.dataset.routeLength = String(route?.length ?? 0); canvas.dataset.progress = progress.toFixed(1); canvas.dataset.laps = String(laps); canvas.dataset.cruising = String(cruising);
      canvas.dataset.carX = car.x.toFixed(2); canvas.dataset.carZ = car.z.toFixed(2); canvas.dataset.carYaw = car.yaw.toFixed(4); canvas.dataset.carSpeed = car.speed.toFixed(2); canvas.dataset.pace = pace;
      canvas.dataset.routeId = route?.driveId ?? (route?.loop ? "scenic" : "destination");
      slowSamples = fps < 35 ? slowSamples + 1 : 0;
      if (quality === "auto" && slowSamples >= 3 && pixelRatio > 1) { pixelRatio = 1; renderer.setPixelRatio(pixelRatio); slowSamples = 0; }
      sampleStart = now; frames = 0;
    }
    schedule();
  }
  schedule();
  return {
    setPaused(next) { if (next && !paused) pauseMotion(); paused = next; controls.enabled = mode === "aerial" && !paused; canvas.dataset.paused = String(paused); },
    setMode, reset, focus, driveNear, recover, navigate, navigatePoint, startDrive, scenic: startScenic,
    clearRoute() { setRoute(null); },
    setCruise(enabled) { cruising = !!route?.loop && enabled && !car.blocked; clearInput(); report(); },
    setInput(action, held, source = `touch:${action}`) { if (held && paused) return; if (held) cruising = false; inputs.set(source, action, held); },
    setPace(next) { pace = next; },
    setCamera(next) { cameraMode = next; },
    compareHandling(next) { if (candidateDriver) { clearInput(); car.speed = 0; baseline = next; manualDriver = next ? baselineDriver : candidateDriver; manualDriver.clear(); beginRun(); report(); } },
    testGraphics(interrupt) { if (process.env.NODE_ENV !== "production") { if (interrupt) renderer.forceContextLoss(); else renderer.forceContextRestore(); } },
    setQuality(next) { quality = next; pixelRatio = next === "low" ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, coarse ? 1.25 : 1.6); renderer.setPixelRatio(pixelRatio); renderer.shadowMap.enabled = next === "auto" && !coarse; renderer.shadowMap.needsUpdate = true; },
    dispose() {
      if (disposed) return; disposed = true; stop(); clearInput(); resize.disconnect(); intersection.disconnect(); controls.dispose();
      canvas.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("blur", pauseMotion); canvas.removeEventListener("blur", clearInput);
      document.removeEventListener("visibilitychange", visibility); canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerCancel);
      canvas.removeEventListener("webglcontextlost", contextLost); canvas.removeEventListener("webglcontextrestored", contextRestored); disposeScene();
    },
  };
}
