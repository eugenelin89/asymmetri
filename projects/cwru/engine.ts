import type { createHalloweenAudio, SoundSource } from "./halloween-audio";
import { createResidenceControls } from "./residence-controls";
import { buildFootprintContext } from "./footprint-context";
import { createOutdoor } from "./outdoor";
import { createHalloweenChase } from "./halloween-chase";
import { createHalloweenSky } from "./halloween-sky";
import { createHalloween } from "./halloween";
import { applyCampusAnchors, initialCampusPose, landmarkIds } from "./layout";
import { normalizeAppearance, type Appearance } from "./appearance";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { disposeScene } from "../surrey/resources";
import { architectureEnvelope, buildArchitecture } from "./architecture";
import { label } from "./labels";
import { buildLandscape, buildingCenter, shape } from "./scenery";
import {
  createCollision,
  createRoutes,
  global,
  local,
  inPolygon,
  type Interior,
} from "./spatial";
import { createPeople } from "./people";
import { footInput, onFoot } from "./navigation";
import { resolveMapDestination, walkingGuidance } from "./wayfinding";
import { createFollowCamera, createVisitor } from "./follow-camera";
import { defaults, normalizeSettings, solarPosition } from "./environment";
import { places, displays, characters } from "./registry";
import type {
  Anchor,
  Anchors,
  CampusData,
  Character,
  Mode,
  Point,
  Pose,
  Settings,
  Telemetry,
} from "./types";

export type Marker = {
  id: string;
  name: string;
  x: number;
  y: number;
  distance: number;
};
export type CampusAPI = {
  react: (id: string, gesture: import("./conversation").Gesture) => void;
  setMode: (mode: Mode) => void;
  community: (characters: Character[]) => void;
  appearance: (value: Appearance) => void;
  settings: (settings: Settings) => void;
  input: (key: string, pressed: boolean, source?: string) => void;
  pause: (paused: boolean, character?: string) => void;
  visit: (id: string) => void;
  route: (id: string) => boolean;
  clearRoute: () => void;
  mapPoint: (point: Point) => Point | null;
  travelTo: (point: Point) => boolean;
  guideTo: (point: Point, label?: string) => boolean;
  resumeWalk: () => void;
  recalculate: () => boolean;
  lock: () => void;
  capture: () => string;
  dispose: () => void;
  position: () => Pose;
  interact: (id: string) => void;
};
export function createCampus(
  host: HTMLElement,
  data: CampusData,
  anchors: Anchors,
  onTelemetry: (t: Telemetry) => void,
  onSelect: (id: string) => void,
  onMarkers: (m: Marker[]) => void,
  onRoute: (p: Point[] | null) => void,
  onError: (message: string) => void,
  audio?: ReturnType<typeof createHalloweenAudio>,
): CampusAPI {
  let settings = { ...defaults },
    mode: Mode = "walk",
    footMode: "walk" | "third" = "walk",
    paused = false,
    activeCharacter: string | null = null,
    disposed = false;
  const scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive 3D campus. WASD to move, Shift to run, drag or left/right arrows to turn, V to switch first/third person, E to interact, M for map.",
  );
  host.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.08, 6500),
    orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false;
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.08;
  orbit.minDistance = 15;
  orbit.maxDistance = 2200;
  orbit.maxPolarAngle = Math.PI * 0.485;
  const sky = new Sky();
  sky.scale.setScalar(10000);
  sky.material.uniforms.turbidity.value = 3;
  sky.material.uniforms.rayleigh.value = 1.5;
  scene.add(sky);
  const halloweenSky = createHalloweenSky();
  scene.add(halloweenSky.group);
  const hemi = new THREE.HemisphereLight(0xd9e8ed, 0x726954, 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe7c4, 3.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -130;
  sun.shadow.camera.right = 130;
  sun.shadow.camera.top = 130;
  sun.shadow.camera.bottom = -130;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 650;
  sun.shadow.normalBias = 0.045;
  sun.shadow.bias = -0.00015;
  scene.add(sun, sun.target);
  const interiors: Interior[] = [],
    landmarks: {
      id: string;
      group: THREE.Group;
      proxy: THREE.Mesh;
      anchor: Anchor;
    }[] = [],
    targets: THREE.Object3D[] = [],
    infoPoints = new Map<string, { x: number; y: number; z: number }>();
  let residence: ReturnType<typeof createResidenceControls> | undefined;
  const excluded = new Set<string>();
  Object.assign(anchors, applyCampusAnchors(anchors));
  const kinds = landmarkIds.filter(id => anchors[id]);
  for (const key of kinds) {
    anchors[key] = architectureEnvelope(key, anchors[key]);
    if (anchors[key].buildingId) excluded.add(anchors[key].buildingId!);
  }
  const landscape = buildLandscape({ ...data, trees: data.trees.filter(tree => !kinds.some(kind => {
    const a = anchors[kind], p = local([tree.x, tree.z], a);
    return Math.abs(p[0]) < a.width/2+3 && Math.abs(p[1]) < a.depth/2+3;
  })) }, excluded);
  scene.add(landscape.group);
  targets.push(...landscape.buildingMeshes);
  for (const kind of kinds) {
    const a = anchors[kind];
    if (!a) continue;
    const source = data.buildings.find((b) => b.id === a.buildingId);
    const asset = buildArchitecture(kind, a.width, a.depth, source?.height);
    if (kind === "clarke") residence = createResidenceControls(asset);
    if (source) {
      const context = buildFootprintContext(source, a);
      asset.group.add(context.group);
      asset.entry = context.entry;
      interiors.push(context.interior);
    }
    asset.group.position.set(a.x, 0.035, a.z);
    asset.group.rotation.y = a.yaw;
    asset.group.userData.info = kind;
    scene.add(asset.group);
    targets.push(asset.group);
    interiors.push({
      anchor: a,
      colliders: asset.colliders,
      floors: asset.floors,
      ramps: asset.ramps,
      entry: asset.entry,
      dynamicBlocked: kind === "clarke" ? residence?.dynamicBlocked : undefined,
    });
    const entry = global(asset.entry, a);
    a.entry = entry;
    infoPoints.set(kind, { x: entry[0], y: 1.6, z: entry[1] });
    const pg = source
      ? new THREE.ExtrudeGeometry(shape(source.rings), {
          depth: source.height || 15,
          bevelEnabled: false,
        })
      : new THREE.BoxGeometry(a.width, 15, a.depth);
    if (source) pg.rotateX(-Math.PI / 2);
    else pg.translate(a.x, 7.5, a.z);
    const proxy = new THREE.Mesh(
      pg,
      new THREE.MeshStandardMaterial({ color: 0xa7aaa1, roughness: 0.9 }),
    );
    proxy.userData.info = kind;
    proxy.visible = false;
    scene.add(proxy);
    targets.push(proxy);
    landmarks.push({ id: kind, group: asset.group, proxy, anchor: a });
    for (const d of asset.displays) {
      const p = global([d.x, d.z], a);
      infoPoints.set(d.id, { x: p[0], y: d.y, z: p[1] });
      const board = label(
        displays[d.id]?.name || "Campus information",
        600,
        120,
      );
      board.scale.set(2.5, 0.5, 1);
      board.position.set(d.x, d.y + 0.5, d.z + 0.12);
      board.userData.info = d.id;
      asset.group.add(board);
      targets.push(board);
    }
  }
  const outdoor = createOutdoor(anchors);
  scene.add(outdoor.group);
  interiors.push(...outdoor.interiors);
  targets.push(outdoor.group);
  const collision = createCollision(data, interiors, excluded),
    routes = createRoutes(data, collision.blocked);
  const halloween = createHalloween(data, anchors, interiors, collision.blocked);
  scene.add(halloween.group);
  const halloweenChase = createHalloweenChase(data, interiors, collision, routes);
  scene.add(halloweenChase.group);
  let campusCharacters = characters;
  const population = createPeople(data, anchors, collision.blocked);
  scene.add(population.group);
  const visitor = createVisitor();
  scene.add(visitor.group);
  const followCamera = createFollowCamera([
    landscape.group,
    outdoor.group,
    ...landmarks.map((l) => l.group),
  ]);
  targets.push(population.group);
  for (const p of places) {
    const a = anchors[p.id];
    if (a && !infoPoints.has(p.id))
      infoPoints.set(p.id, { x: a.x, y: 2, z: a.z });
  }
  let pose: Pose = initialCampusPose(anchors);
  const inputs = new Map<string, string>(),
    listeners: (() => void)[] = [];
  let routeLine: THREE.Line | null = null,
    routePoints: Point[] | null = null,
    routeLabel = "Selected map spot",
    routeTarget: Point | null = null,
    nearby: string | null = null,
    lastTime = performance.now(),
    lastTelemetry = 0,
    fps = 0,
    frames = 0,
    frameSeconds = 0,
    raf = 0,
    down: {
      x: number;
      y: number;
      lastX: number;
      lastY: number;
      id: number;
    } | null = null,
    dragged = false;
  const rainGeo = new THREE.BufferGeometry(),
    rainPositions = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 70;
    rainPositions[i * 3 + 1] = Math.random() * 28;
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 70;
  }
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
  const precipitation = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({
      color: 0xe4eeee,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    }),
  );
  precipitation.frustumCulled = false;
  scene.add(precipitation);
  function listen<K extends keyof WindowEventMap>(
    target: Window,
    type: K,
    fn: (e: WindowEventMap[K]) => void,
  ) {
    target.addEventListener(type, fn);
    listeners.push(() => target.removeEventListener(type, fn));
  }
  function clear() {
    inputs.clear();
    down = null;
  }
  function setMode(next: Mode) {
    // Aerial distances need a larger near plane to preserve depth precision
    // between the centimetre-separated GIS surfaces and field markings.
    camera.near = next === "aerial" ? 2 : 0.08;
    camera.updateProjectionMatrix();
    clear();
    mode = next;
    if (next === "walk" || next === "third") footMode = next;
    document.exitPointerLock?.();
    orbit.enabled = next === "aerial";
    if (next === "aerial") {
      camera.position.set(pose.x + 100, pose.y + 180, pose.z + 160);
      orbit.target.set(pose.x, pose.y, pose.z);
      orbit.update();
    }
    if (onFoot(next)) renderer.domElement.focus({ preventScroll: true });
  }
  function applySettings(next: Settings) {
    audio?.configure(next);
    settings = normalizeSettings(next);
    const q = settings.quality;
    renderer.setPixelRatio(
      Math.min(
        devicePixelRatio,
        q === "ultra"
          ? 2
          : q === "high"
            ? 1.6
            : q === "low"
              ? 0.75
              : q === "medium"
                ? 1
                : 1.25,
      ),
    );
    renderer.shadowMap.enabled = q !== "low";
    resize();
    updateEnvironment();
  }
  function updateEnvironment() {
    const sp = solarPosition(settings.season, settings.hour),
      alt = sp.altitude,
      day = Math.max(0, Math.min(1, (alt + 0.12) / 0.35)),
      cloud =
        settings.weather === "clear"
          ? 1
          : settings.weather === "cloudy"
            ? 0.75
            : 0.35;
    const dir = new THREE.Vector3(
      Math.sin(sp.azimuth) * Math.cos(alt),
      Math.sin(alt),
      -Math.cos(sp.azimuth) * Math.cos(alt),
    );
    sun.position.copy(
      new THREE.Vector3(pose.x, 0, pose.z).addScaledVector(dir, 240),
    );
    sun.target.position.set(pose.x, 0, pose.z);
    sun.intensity = day * 3.2 * cloud;
    sun.color.set(alt < 0.3 ? 0xffcf94 : 0xffedda);
    hemi.intensity = settings.halloween ? 0.9 : 0.32 + day * 1.8;
    hemi.color.setHex(settings.halloween ? 0xa0abc6 : 0xd9e8ed);
    renderer.toneMappingExposure = settings.halloween ? 1 : 0.8 + day * 0.25;
    sky.material.uniforms.sunPosition.value.copy(dir);
    sky.material.uniforms.turbidity.value =
      settings.weather === "clear" ? 3 : 8;
    sky.visible = !settings.halloween && day > 0.05 && settings.weather !== "fog";
    const fogColor = settings.halloween
      ? new THREE.Color(0x141b2b)
      : new THREE.Color().setHSL(0.55, 0.12, 0.08 + day * 0.65);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(
      fogColor,
      settings.halloween
        ? 0.0009
        : settings.weather === "fog"
        ? 0.009
        : settings.weather === "rain"
          ? 0.0018
          : 0.00035,
    );
    precipitation.visible =
      settings.weather === "rain" || settings.weather === "snow";
    const pm = precipitation.material;
    pm.size = settings.weather === "snow" ? 0.13 : 0.045;
    landscape.update(settings, [pose.x, pose.z]);
  }
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (w && h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (activeCharacter) camera.setViewOffset(w, h, 0, h * 0.28, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  function pick(x: number, y: number) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((x - rect.left) / rect.width) * 2 - 1,
      (-(y - rect.top) / rect.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(targets, true);
    for (const h of hits) {
      let obj: THREE.Object3D | null = h.object;
      if (!obj.visible) continue;
      let visible = true;
      for (let n: THREE.Object3D | null = obj; n; n = n.parent)
        if (!n.visible) visible = false;
      if (!visible) continue;
      while (obj && !obj.userData.info) obj = obj.parent;
      if (obj?.userData.info) return obj.userData.info as string;
    }
    return null;
  }
  function canMeet(id: string) {
    const actor = population.actors.find((a) => a.id === id && a.named);
    if (!actor || !onFoot(mode) || !actor.group.visible) return false;
    const p = actor.group.position;
    const distance = Math.hypot(p.x - pose.x, p.z - pose.z);
    if (distance >= 5 || Math.abs(p.y - pose.y) > 1.1) return false;
    // Use the same physical boundaries as walking, including closed doors.
    const steps = Math.max(1, Math.ceil(distance / 0.2));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (
        collision.blocked(
          [pose.x + (p.x - pose.x) * t, pose.z + (p.z - pose.z) * t],
          pose.y,
        )
      )
        return false;
    }
    return true;
  }
  function interact(id: string) {
    if (id.startsWith("clarke-door-") || id.startsWith("clarke-lift-")) {
      const action = residence?.interactions().find(a=>a.id===id), a=anchors.clarke;
      if (!action || !a || !onFoot(mode) || paused) return;
      const p=local([pose.x,pose.z],a);
      if (Math.hypot(p[0]-action.x,p[1]-action.z)<2.8 && Math.abs(pose.y+1.6-action.y)<1.5 && residence?.canSee(p,[action.x,action.z],pose.y+1.6)) residence.interact(id);
      return;
    }
    if (campusCharacters.some((c) => c.id === id) && !canMeet(id)) return;
    onSelect(id);
  }
  const pointerdown = (e: PointerEvent) => {
    if (paused || e.button !== 0) return;
    if (down) return;
    down = {
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      id: e.pointerId,
    };
    dragged = false;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.focus({ preventScroll: true });
  };
  const pointermove = (e: PointerEvent) => {
    if (paused || (down && down.id !== e.pointerId)) return;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4)
      dragged = true;
    if (
      onFoot(mode) &&
      (document.pointerLockElement === renderer.domElement || down)
    ) {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4)
        dragged = true;
      const locked = document.pointerLockElement === renderer.domElement;
      const dx = locked ? e.movementX : e.clientX - down!.lastX;
      const dy = locked ? e.movementY : e.clientY - down!.lastY;
      if (down) {
        down.lastX = e.clientX;
        down.lastY = e.clientY;
      }
      pose.yaw -= dx * 0.003;
      pose.pitch = Math.max(-1.3, Math.min(1.3, pose.pitch - dy * 0.003));
    } else if (!down)
      renderer.domElement.style.cursor = pick(e.clientX, e.clientY)
        ? "pointer"
        : "grab";
  };
  const pointerup = (e: PointerEvent) => {
    if (down && down.id !== e.pointerId) return;
    if (down && !dragged) {
      const id = pick(e.clientX, e.clientY);
      if (id) interact(id);
    }
    down = null;
  };
  for (const [event, handler] of [
    ["pointerdown", pointerdown],
    ["pointermove", pointermove],
    ["pointerup", pointerup],
    ["pointercancel", clear],
  ] as const) {
    renderer.domElement.addEventListener(event, handler as EventListener);
    listeners.push(() =>
      renderer.domElement.removeEventListener(event, handler as EventListener),
    );
  }
  listen(window, "keydown", (e) => {
    if (
      (e.target as HTMLElement)?.closest("input,textarea,select,button,a") ||
      paused
    )
      return;
    const key = e.key.toLowerCase();
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "shift",
      ].includes(key)
    ) {
      e.preventDefault();
      inputs.set(`key:${key}`, key);
    }
    if (key === "e" && nearby && !e.repeat) interact(nearby);
    if (key === "m") {
      setMode(mode === "map" ? footMode : "map");
    }
    if (key === "v" && !e.repeat)
      setMode(footMode === "walk" ? "third" : "walk");
    if (key === "escape") {
      clear();
      document.exitPointerLock?.();
    }
  });
  listen(window, "keyup", (e) => inputs.delete(`key:${e.key.toLowerCase()}`));
  listen(window, "blur", clear);
  const visibility = () => {
    clear();
    lastTime = performance.now();
    audio?.visibility(document.hidden);
  };
  document.addEventListener("visibilitychange", visibility);
  listeners.push(() =>
    document.removeEventListener("visibilitychange", visibility),
  );
  const contextLost = (e: Event) => {
    e.preventDefault();
    paused = true;
    clear();
    onError(
      "The graphics context was interrupted. Use Restart graphics to resume; the directory remains available.",
    );
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  listeners.push(() =>
    renderer.domElement.removeEventListener("webglcontextlost", contextLost),
  );
  function visit(id: string) {
    if (id === "arrival") {
      pose = initialCampusPose(anchors);
      setMode(footMode);
      updateEnvironment();
      return;
    }
    // People are encountered in the world, never fast-travel destinations.
    if (campusCharacters.some((c) => c.id === id)) return;
    const a =
      anchors[id] || anchors[data.buildings.find((b) => b.id === id)?.id || ""];
    let target: Point | undefined = a?.entry || (a && [a.x, a.z]);
    if (!target) {
      const b = data.buildings.find((b) => b.id === id);
      if (b) {
        const c = buildingCenter(b),
          r = routes.nearest(c);
        target = r.id >= 0 ? routes.nodes[r.id] : undefined;
      }
    }
    if (!target) return;
    let safe: Point | undefined;
    const interior = interiors.find((i) => i.anchor === a);
    // Start on the exterior side of the modelled entrance, facing the door.
    // A world-axis offset can fall inside a rotated building.
    if (interior) {
      for (let distance = 4; distance <= 24 && !safe; distance += 2) {
        const p = global(
          [interior.entry[0], interior.entry[1] + distance],
          interior.anchor,
        );
        if (!collision.blocked(p, 0)) safe = p;
      }
    }
    for (let r = 3; r <= 25 && !safe; r += 2)
      for (let i = 0; i < 16; i++) {
        const p: Point = [
          target[0] + Math.sin((i * Math.PI) / 8) * r,
          target[1] + Math.cos((i * Math.PI) / 8) * r,
        ];
        if (
          !collision.blocked(p, 0) &&
          (!interior || local(p, interior.anchor)[1] > interior.entry[1])
        ) {
          safe = p;
          break;
        }
      }
    if (!safe) return;
    pose = {
      x: safe[0],
      z: safe[1],
      y: 0,
      pitch: 0,
      yaw: Math.atan2(-(target[0] - safe[0]), -(target[1] - safe[1])),
    };
    setMode(footMode);
    updateEnvironment();
  }
  function clearRoute() {
    if (routeLine) {
      scene.remove(routeLine);
      routeLine.geometry.dispose();
      (routeLine.material as THREE.Material).dispose();
      routeLine = null;
    }
    routePoints = null;
    routeTarget = null;
    onRoute(null);
  }
  function route(id: string) {
    clearRoute();
    if (campusCharacters.some((c) => c.id === id)) return false;
    const a = anchors[id];
    const target: Point | undefined = a?.entry || (a && [a.x, a.z]);
    if (!target) return false;
    return guideTo(
      target,
      places.find((p) => p.id === id)?.name || "Campus destination",
    );
  }
  function mapPoint(point: Point) {
    return resolveMapDestination(
      point,
      routes.nodes,
      (p) =>
        !collision.blocked(p, 0) &&
        !data.buildings.some((b) => inPolygon(p, b.rings)),
    );
  }
  function travelTo(point: Point) {
    const safe = mapPoint(point);
    if (!safe) return false;
    clearRoute();
    pose = { ...pose, x: safe[0], z: safe[1], y: 0, pitch: 0 };
    setMode(footMode);
    return true;
  }
  function guideTo(target: Point, name = "Selected map spot") {
    const points = routes.find([pose.x, pose.z], target);
    if (!points) return false;
    clearRoute();
    routeLabel = name;
    routeTarget = [...target];
    routePoints = points;
    routeLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p[0], 0.16, p[1])),
      ),
      new THREE.LineBasicMaterial({ color: 0xf5d594, depthTest: true }),
    );
    routeLine.renderOrder = 5;
    scene.add(routeLine);
    onRoute(points);
    return true;
  }
  function tick(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(tick);
    const elapsed = (now - lastTime) / 1000,
      dt = Math.min(0.05, elapsed);
    lastTime = now;
    if (document.hidden) return;
    const beforeX = pose.x,
      beforeZ = pose.z;
    if (!paused && onFoot(mode)) {
      const movement = footInput(
        pose,
        [...inputs.values()],
        Math.min(0.1, elapsed),
      );
      pose = collision.move(
        { ...pose, yaw: movement.yaw },
        movement.dx,
        movement.dz,
      );
    }
    if (residence && anchors.clarke) {
      pose.y += residence.update(!paused && onFoot(mode) ? dt : 0, local([pose.x,pose.z],anchors.clarke), pose.y, settings);
    }
    let cameraClearance = 0;
    if (mode === "walk") {
      camera.position.set(pose.x, pose.y + 1.68, pose.z);
      camera.rotation.set(pose.pitch, pose.yaw, 0, "YXZ");
    } else if (mode === "third") cameraClearance = followCamera(camera, pose);
    else orbit.update();
    visitor.update(
      pose,
      Math.hypot(pose.x - beforeX, pose.z - beforeZ),
      mode === "third" && cameraClearance > 2.15,
      settings.reducedMotion,
    );
    halloweenSky.update(dt, settings, camera.position);
    halloween.update(dt, settings, pose);
    if(audio && settings.halloween && settings.halloweenSound){
      const sources:SoundSource[]=halloween.decorations.map((d,i)=>({id:`interior-ghost-${i}`,x:d.point[0],y:d.y,z:d.point[1],kind:"ghost"}));
      if(settings.population)for(const m of halloween.monsters)if(m.kind==="ghost"||m.kind==="werewolf")sources.push({id:m.id,x:m.point[0],y:0,z:m.point[1],kind:m.kind==="ghost"?"ghost":"wolf"});
      audio.update(dt,pose,sources,paused||!onFoot(mode));
    }
    outdoor.update(dt, settings, pose);
    population.update(
      paused && !activeCharacter ? 0 : dt,
      now / 1000,
      [pose.x, pose.z],
      settings.hour,
      settings.population,
      activeCharacter,
      settings.reducedMotion,
      dt,
    );
    const indoor = landmarks.find((l) => {
      const p = local([pose.x, pose.z], l.anchor);
      return (
        Math.abs(p[0]) < l.anchor.width / 2 &&
        Math.abs(p[1]) < l.anchor.depth / 2
      );
    });
    halloweenChase.update(dt, settings, pose, { paused, mode, indoor: !!indoor, cameraPosition: camera.position });
    if (precipitation.visible && !settings.reducedMotion) {
      for (let i = 0; i < 900; i++) {
        rainPositions[i * 3 + 1] -=
          dt * (settings.weather === "snow" ? 1.6 : 18);
        if (rainPositions[i * 3 + 1] < 0) rainPositions[i * 3 + 1] = 28;
      }
      rainGeo.attributes.position.needsUpdate = true;
    }
    precipitation.position.set(camera.position.x, 0, camera.position.z);
    precipitation.visible =
      !indoor &&
      (settings.weather === "rain" || settings.weather === "snow");
    for (const l of landmarks) {
      const near = camera.position.distanceTo(l.group.position) < 520;
      l.group.visible = near;
      l.proxy.visible = !near;
    }
    if (now - lastTelemetry > 250) {
      lastTelemetry = now;
      updateEnvironment();
      precipitation.visible =
        !indoor &&
          (settings.weather === "rain" || settings.weather === "snow");
      let distance = Infinity;
      nearby = null;
      const all = new Map(infoPoints);
      const residenceActions = residence?.interactions() || [];
      for (const action of residenceActions) {
        const p = global([action.x,action.z],anchors.clarke);
        all.set(action.id,{x:p[0],y:action.y,z:p[1]});
      }
      for (const a of population.actors.filter((a) => a.named))
        all.set(a.id, {
          x: a.group.position.x,
          y: a.group.position.y + 2.3,
          z: a.group.position.z,
        });
      const markers: Marker[] = [];
      for (const [id, p] of all) {
        const d = Math.hypot(p.x - pose.x, p.z - pose.z);
        const action = residenceActions.find(a=>a.id===id);
        if (action && !residence?.canSee(local([pose.x,pose.z],anchors.clarke),[action.x,action.z],pose.y+1.6)) continue;
        const character = campusCharacters.some((c) => c.id === id);
        if (character && !canMeet(id)) continue;
        const facing =
          d > 0.01
            ? (-(p.x - pose.x) * Math.sin(pose.yaw) -
                (p.z - pose.z) * Math.cos(pose.yaw)) /
              d
            : 1;
        const score = d + (action ? (1 - facing) * 1.2 : 0);
        if (
          d < (action ? 2.8 : 5) &&
          score < distance &&
          Math.abs(p.y - (pose.y + 1.6)) < (action ? 1.5 : 2.1)
        ) {
          distance = score;
          nearby = id;
        }
        if (
          !action &&
          !character &&
          settings.markers &&
          d < 80 &&
          Math.abs(p.y - pose.y - 1.6) < 2.1
        ) {
          const v = new THREE.Vector3(p.x, p.y + 1, p.z).project(camera);
          if (v.z < 1 && v.z > 0 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.9)
            markers.push({
              id,
              name:
                places.find((p) => p.id === id)?.name ||
                displays[id]?.name ||
                id,
              x: (v.x + 1) * 50,
              y: (1 - v.y) * 50,
              distance: d,
            });
        }
      }
      onMarkers(markers.sort((a, b) => a.distance - b.distance).slice(0, 5));
      const closest = places
        .map((p) => ({
          p,
          d: anchors[p.id]
            ? Math.hypot(anchors[p.id].x - pose.x, anchors[p.id].z - pose.z)
            : Infinity,
        }))
        .sort((a, b) => a.d - b.d)[0];
      const location = indoor
        ? `${places.find(p => p.id === indoor.id)?.name} · Level ${Math.round(pose.y / 4.2) + 1} · Reconstructed`
        : closest?.d < 150 ? closest.p.name : "CWRU · University Circle";
      const guidance = routePoints
        ? walkingGuidance(
            pose,
            routePoints,
            routeLabel,
            !!indoor,
          )
        : null;
      const routeDistance = guidance?.distance ?? null;
      onTelemetry({
        pose: { ...pose },
        mode,
        location,
        nearby,
        nearbyLabel: residenceActions.find(a=>a.id===nearby)?.name,
        fps,
        audioState: audio?.status(),
        draws: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        loaded: landmarks.filter((l) => l.group.visible).length,
        routeDistance,
        guidance,
      });
    }
    if (mode !== "map") {
      renderer.render(scene, camera);
      frames++;
      frameSeconds += elapsed;
      if (frameSeconds >= 1) {
        fps = Math.round(frames / frameSeconds);
        frames = 0;
        frameSeconds = 0;
        if (
          settings.quality === "auto" &&
          fps < 28 &&
          renderer.getPixelRatio() > 0.8
        )
          renderer.setPixelRatio(
            Math.max(0.8, renderer.getPixelRatio() - 0.05),
          );
      }
    }
  }
  applySettings(settings);
  resize();
  raf = requestAnimationFrame(tick);
  return {
    setMode,
    appearance: (value) => visitor.appearance(normalizeAppearance(value)),
    community: (values) => {
      campusCharacters = [...characters, ...values];
      population.setCommunity(values);
    },
    settings: applySettings,
    input: (key, pressed, source = key) => {
      if (pressed) inputs.set(`touch:${source}`, key);
      else inputs.delete(`touch:${source}`);
    },
    pause: (value, character) => {
      if (value && character && character !== activeCharacter) {
        const actor = population.actors.find((a) => a.id === character);
        if (actor && canMeet(character)) {
          const dx = actor.group.position.x - pose.x,
            dz = actor.group.position.z - pose.z;
          pose.yaw = Math.atan2(-dx, -dz);
          pose.pitch = Math.atan2(
            actor.group.position.y + 1.4 - pose.y - 1.68,
            Math.max(0.5, Math.hypot(dx, dz)),
          );
        }
      }
      paused = value;
      activeCharacter = character || null;
      resize();
      clear();
      if (value) document.exitPointerLock?.();
    },
    react: (id, gesture) => {
      if (activeCharacter === id && canMeet(id)) population.react(id, gesture);
    },
    visit,
    route,
    clearRoute,
    mapPoint,
    travelTo,
    guideTo,
    resumeWalk: () => setMode(footMode),
    recalculate: () => (routeTarget ? guideTo(routeTarget, routeLabel) : false),
    position: () => ({ ...pose }),
    interact,
    lock: () => {
      if (!onFoot(mode)) setMode(footMode);
      renderer.domElement.requestPointerLock?.();
    },
    capture: () => {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL("image/png");
    },
    dispose: () => {
      disposed = true;
      audio?.stop();
      cancelAnimationFrame(raf);
      clear();
      orbit.dispose();
      resizeObserver.disconnect();
      listeners.forEach((fn) => fn());
      document.exitPointerLock?.();
      rainGeo.dispose();
      precipitation.material.dispose();
      disposeScene(scene, renderer, sun.shadow.map, renderer.domElement);
    },
  };
}
