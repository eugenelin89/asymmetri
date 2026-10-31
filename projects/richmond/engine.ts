// SPDX-License-Identifier: MIT
import * as THREE from "three";
import { createSimulation } from "./simulation";
import { createCamera } from "./camera";
import { streetFurniture } from "./streetscape";
import { createPopulation } from "./population";
import {
  resources,
  buildOverview,
  buildTile,
  buildInterior,
  carModel,
  personModel,
  actorMeshes,
  aircraft,
} from "./scenery";
import { interiorFor, interiorFits, interiorCameraBlocked } from "./interiors";
import { readSave, writeSave } from "./save";
import { distance, point } from "./world";
import { navigationFor } from "./navigation";
import type {
  City,
  Game,
  Input,
  Point,
  Snapshot,
  Building,
  State,
  CameraMode,
} from "./types";
export function createGame(
  canvas: HTMLCanvasElement,
  city: City,
  onSnapshot: (s: Snapshot) => void,
  onError: (text: string) => void,
  fixture?: State,
): Game {
  const sim = createSimulation(
    city,
    process.env.NODE_ENV === "development" ? fixture : undefined,
  );
  let storage: Storage | null = null,
    saveAllowed = true,
    saveNotice = "Local progress · fictional game money";
  try {
    storage =
      fixture && process.env.NODE_ENV === "development" ? null : localStorage;
    if (!storage) throw Error("Isolated check: career saving disabled");
    const loaded = readSave(storage, city);
    if (loaded.state) sim.restore(loaded.state);
    saveNotice = loaded.message;
    saveAllowed = !loaded.invalid;
  } catch {
    saveNotice = fixture
      ? "Isolated check · career save untouched"
      : "Storage unavailable. Progress may not survive reload.";
  }
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    sim.state.settings.lite ? 1 : Math.min(devicePixelRatio, 1.5),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xa5d2d3);
  renderer.shadowMap.enabled = false;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa5d2d3);
  scene.fog = new THREE.Fog(0xa5d2d3, 600, 1700);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 40000),
    cam = createCamera(city),
    r = resources();
  scene.add(new THREE.HemisphereLight(0xe8f6ff, 0x8c9b74, 2));
  const sun = new THREE.DirectionalLight(0xffe4bb, 2.4);
  sun.position.set(-100, 200, 80);
  scene.add(sun);
  const overview = buildOverview(city, r),
    outside = new THREE.Group();
  const furniture = streetFurniture(r, sim.world);
  outside.add(overview.group, aircraft(r, city), furniture.group);
  scene.add(outside);
  const car = carModel(r),
    hero = personModel(r),
    crowds = actorMeshes(r),
    trafficModels = Array.from({ length: 50 }, (_, i) =>
      carModel(
        r,
        [0x9cb9b9, 0xc8654d, 0xddbd73, 0x607e8e, 0xd4d8cf][i % 5],
        i % 7 === 0 ? "van" : i % 3 === 0 ? "sedan" : "compact",
      ),
    );
  scene.add(car, hero, crowds.group);
  trafficModels.forEach((m) => scene.add(m));
  const pop = createPopulation(city, sim.world),
    marker = new THREE.Mesh(
      r.geometry(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 24)),
      r.material(0xf5bd59, true),
    );
  scene.add(marker);
  const beacon = new THREE.Mesh(
    r.geometry(new THREE.ConeGeometry(0.7, 1.3, 6)),
    r.material(0xf5bd59, true),
  );
  scene.add(beacon);
  const surveyMe = r.label(scene, "YOU", [0, 0], 6, 18);
  const surveyCar = r.label(scene, "YOUR CAR", [0, 0], 6, 16, "#bfe9ef");
  let interior: THREE.Group | null = null,
    interiorId: string | null = null,
    disposed = false,
    lost = false,
    visible = true,
    pausedByUi = false,
    frame = 0,
    last = 0,
    elapsed = 0,
    snapshotTime = 0,
    saveTime = 0,
    routeTime = 0,
    tileTime = 0,
    fps = 60,
    navigation: string | null = null,
    route: Point[] = [],
    navTarget: Point | null = null,
    guidance = "",
    lastTarget = "",
    adaptive = 1.5,
    recoveries = 0,
    contacts = 0,
    drivenDistance = 0;
  let lastContact: NonNullable<Snapshot["diagnostics"]>["lastContact"] = null;
  function nearbyActors() {
    return [...pop.traffic, ...pop.pedestrians]
      .filter((a) => distance(point(a), point(sim.state.car)) < 10)
      .map((a) => ({
        id: a.id,
        vehicle: a.vehicle,
        x: a.x,
        z: a.z,
        y: a.y,
        yaw: a.yaw,
        speed: a.speed,
        edge: a.edge,
      }));
  }
  let playCamera: CameraMode =
    sim.state.camera === "aerial" ? "third" : sim.state.camera;
  let playView = {
    yaw: cam.view.yaw,
    pitch: cam.view.pitch,
    distance: cam.view.distance,
  };
  function setCamera(mode: CameraMode) {
    const leavingSurvey = sim.state.camera === "aerial" && mode !== "aerial";
    if (mode === "aerial" && sim.state.camera !== "aerial") {
      playCamera = sim.state.camera;
      playView = {
        yaw: cam.view.yaw,
        pitch: cam.view.pitch,
        distance: cam.view.distance,
      };
      cam.view.pitch = 0.8;
    }
    sim.camera(mode);
    if (leavingSurvey) sim.say("Back with your courier. " + sim.prompt());
    cam.view.follow = true;
    input.clear();
    if (mode === "first") cam.view.pitch = 0.5;
    tileTime = -10;
  }
  function returnToPlayer() {
    mutate(() => {
      if (sim.state.camera === "aerial") {
        setCamera(playCamera);
        Object.assign(cam.view, playView);
      } else cam.view.follow = true;
    });
  }
  const input = new Map<string, Input>(),
    pending = new Map<string, AbortController>(),
    tiles = new Map<string, THREE.Group>(),
    farIndices = new Map(city.buildingIndex.map((b, i) => [b.id, i]));
  const setInput = (action: Input, pressed: boolean, source: string) => {
    if (
      pressed &&
      (disposed || pausedByUi || sim.state.shopping || document.hidden || lost)
    )
      return;
    if (pressed) input.set(source, action);
    else input.delete(source);
  };
  function save() {
    if (storage && saveAllowed) {
      const ok = writeSave(storage, sim.state);
      saveNotice = ok
        ? "Saved on this browser · fictional CAD"
        : "Storage is full or unavailable. This session may not be saved.";
    }
  }
  function emit() {
    if (disposed) return;
    const target = navTarget;
    onSnapshot({
      state: structuredClone(sim.state),
      message: sim.message,
      prompt: sim.prompt(),
      street: sim.state.interior
        ? sim.places.get(sim.state.interior.place)!.name
        : sim.world.street(point(sim.state.player)),
      route,
      target,
      objective: sim.objective(),
      navigation: guidance,
      paused: sim.paused,
      fps: Math.round(fps),
      pedestrians: pop.pedestrians.length,
      traffic: pop.traffic.length,
      saveNotice,
      distance: target ? distance(point(sim.state.player), target) : 0,
      ...(process.env.NODE_ENV === "development"
        ? {
            diagnostics: {
              input: [...input.values()],
              contact: sim.contact,
              elapsed: sim.state.elapsed,
              recoveries,
              contacts,
              distance: drivenDistance,
              seed: sim.state.rng,
              nearby: nearbyActors(),
              lastContact,
            },
          }
        : {}),
    });
  }
  function mutate(fn: () => void) {
    fn();
    input.clear();
    routeTime = -100;
    nav();
    drawRoute();
    save();
    emit();
  }
  function updateInterior() {
    const id = sim.state.interior?.place ?? null;
    if (id === interiorId) return;
    if (interior) {
      scene.remove(interior);
      interior.traverse((o) => {
        if (o instanceof THREE.Sprite) {
          if (o.material.map) r.releaseTexture(o.material.map);
          o.material.dispose();
        }
      });
    }
    interiorId = id;
    interior = id
      ? buildInterior(sim.places.get(id)!, interiorFor(sim.places.get(id)!), r)
      : null;
    if (interior) scene.add(interior);
    outside.visible = !id;
    trafficModels.forEach((m) => (m.visible = !id));
    cam.view.follow = true;
    cam.view.yaw = Math.PI;
    scene.fog = id
      ? new THREE.Fog(0xb5c9c2, 120, 240)
      : new THREE.Fog(0xa5d2d3, 600, 1700);
  }
  const dummy = new THREE.Object3D();
  function farBuilding(id: string, show: boolean) {
    const i = farIndices.get(id);
    if (i === undefined) return;
    const b = city.buildingIndex[i],
      [x, z, X, Z] = b.bounds;
    dummy.position.set((x + X) / 2, b.height / 2, (z + Z) / 2);
    dummy.scale.set(
      show ? Math.max(2, X - x) : 0,
      show ? b.height : 0,
      show ? Math.max(2, Z - z) : 0,
    );
    dummy.updateMatrix();
    overview.far.setMatrixAt(i, dummy.matrix);
    overview.far.instanceMatrix.needsUpdate = true;
  }
  async function loadTile(tile: City["tiles"][number]) {
    const controller = new AbortController();
    pending.set(tile.id, controller);
    try {
      const result = await fetch(tile.url, { signal: controller.signal });
      if (!result.ok) throw Error("District detail unavailable");
      const data = (await result.json()) as { buildings: Building[] };
      if (disposed || controller.signal.aborted) return;
      const group = buildTile(data.buildings, r);
      group.userData.ids = data.buildings.map((b) => b.id);
      outside.add(group);
      tiles.set(tile.id, group);
      data.buildings.forEach((b) => farBuilding(b.id, false));
    } catch (e) {
      if (!controller.signal.aborted && !disposed) {
        saveNotice =
          "Some district detail could not load. The road world remains available; detail will retry.";
        if (!(e instanceof Error)) onError("District detail failed");
      }
    } finally {
      pending.delete(tile.id);
    }
  }
  function stream() {
    const focus =
      sim.state.camera === "aerial" && !cam.view.follow
        ? cam.view.target
        : point(sim.state.player);
    const candidates =
      (sim.state.interior && sim.state.camera !== "aerial") ||
      (sim.state.camera === "aerial" && cam.view.aerialDistance > 3500)
        ? []
        : city.tiles
            .filter((t) => {
              const [a, b, c, d] = t.bounds;
              return (
                Math.hypot(
                  Math.max(a - focus[0], 0, focus[0] - c),
                  Math.max(b - focus[1], 0, focus[1] - d),
                ) < (sim.state.settings.lite ? 440 : 700)
              );
            })
            .slice(0, 16);
    const needed = new Set(candidates.map((t) => t.id));
    for (const [id, controller] of pending)
      if (!needed.has(id)) controller.abort();
    for (const [id, g] of tiles)
      if (!needed.has(id)) {
        outside.remove(g);
        (g.userData.ids as string[]).forEach((id) => farBuilding(id, true));
        g.userData.dispose();
        tiles.delete(id);
      }
    for (const t of candidates)
      if (!tiles.has(t.id) && !pending.has(t.id) && pending.size < 2)
        void loadTile(t);
  }
  function nav() {
    const result = navigationFor(
      sim.state,
      sim.world,
      sim.targetPlace() ??
        (navigation ? (sim.places.get(navigation) ?? null) : null),
      sim.target(),
    );
    route = result.route;
    navTarget = result.target;
    guidance = result.instruction;
  }
  const pathMaterial = new THREE.LineBasicMaterial({
    color: 0xf5c767,
    depthTest: false,
    transparent: true,
    opacity: 0.85,
  });
  let pathLine: THREE.Line | null = null;
  function drawRoute() {
    if (pathLine) {
      scene.remove(pathLine);
      pathLine.geometry.dispose();
      pathLine = null;
    }
    if (route.length < 2) return;
    const positions = route.map(
      (p) =>
        new THREE.Vector3(
          p[0],
          sim.state.interior
            ? 0.1
            : (sim.world.support(p, 0, sim.state.airfield, true) ?? 8) + 0.25,
          p[1],
        ),
    );
    pathLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(positions),
      pathMaterial,
    );
    pathLine.renderOrder = 5;
    scene.add(pathLine);
  }
  function cameraFrame() {
    const s = sim.state,
      pose = cam.pose(s),
      target = new THREE.Vector3(...pose.target),
      position = new THREE.Vector3(...pose.position);
    if (s.camera === "third") {
      const delta = position.clone().sub(target),
        length = delta.length();
      for (let d = 1; d < length; d += 0.35) {
        const p = target.clone().addScaledVector(delta, d / length);
        const blocked = s.interior
          ? interiorCameraBlocked(
              [p.x, p.y, p.z],
              interiorFor(sim.places.get(s.interior.place)!),
            )
          : sim.world.building([p.x, p.z], p.y);
        if (blocked) {
          // A counter immediately behind the courier must not push the camera
          // into their head. Open-roof interiors allow a clear overhead fallback.
          if (s.interior && d < 2.5) {
            position.set(target.x, target.y + 5, target.z + 0.1);
            break;
          }
          position
            .copy(target)
            .addScaledVector(delta, Math.max(0.7, d - 0.5) / length);
          break;
        }
      }
    }
    camera.position.copy(position);
    camera.lookAt(target);
    // Street-level clipping wastes almost all depth precision at city scale,
    // making the centimetre-separated road/land layers flicker through each other.
    const near =
      s.camera === "aerial"
        ? Math.max(0.1, (cam.view.aerialDistance - 100) * 0.2)
        : 0.1;
    const far =
      s.camera === "aerial"
        ? Math.max(40000, cam.view.aerialDistance + 30000)
        : 40000;
    if (camera.near !== near || camera.far !== far) {
      camera.near = near;
      camera.far = far;
      camera.updateProjectionMatrix();
    }
    scene.fog =
      s.camera === "aerial"
        ? null
        : s.interior
          ? new THREE.Fog(0xb5c9c2, 100, 220)
          : new THREE.Fog(0xa5d2d3, 600, 1700);
  }
  function tick(time: number) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    const frameMs = time - last;
    const dt = Math.min(0.1, frameMs / 1000 || 0);
    last = time;
    if (document.hidden || !visible || lost) return;
    elapsed += dt;
    fps = fps * 0.96 + (dt ? 1 / dt : 60) * 0.04;
    const s = sim.state;
    sim.pause(pausedByUi);
    const held = new Set(input.values());
    if (s.camera === "aerial" && !pausedByUi) {
      const rate = cam.view.aerialDistance * 0.4 * dt;
      cam.pan(
        ((held.has("right") ? 1 : 0) - (held.has("left") ? 1 : 0)) * rate,
        ((held.has("back") ? 1 : 0) - (held.has("forward") ? 1 : 0)) * rate,
      );
    } else {
      const before = { ...s.car };
      sim.obstacles([...pop.traffic, ...pop.pedestrians]);
      sim.step(
        dt,
        held,
        s.camera === "top"
          ? s.settings.northUp
            ? Math.PI
            : s.player.yaw
          : cam.view.yaw,
      );
      if (s.locomotion === "drive") {
        drivenDistance += distance(point(before), point(s.car));
        if (s.car.blocked && !before.blocked) {
          contacts++;
          if (process.env.NODE_ENV === "development")
            lastContact = {
              kind: sim.contact,
              elapsed: s.elapsed,
              car: { ...s.car },
              nearby: nearbyActors(),
            };
        }
      }
    }
    updateInterior();
    const survey = s.camera === "aerial";
    outside.visible = !s.interior || survey;
    if (interior) interior.visible = !survey;
    crowds.group.visible = !survey || !s.interior;
    const l = s.interior
      ? interiorFor(sim.places.get(s.interior.place)!)
      : null;
    if (elapsed - tileTime > 0.7) {
      stream();
      tileTime = elapsed;
      pop.configure(
        point(s.player),
        s.settings.density * (s.settings.lite ? 0.5 : 1),
        l
          ? {
              id: s.interior!.place,
              width: l.width,
              depth: l.depth,
              fits: (p) => interiorFits(p, l),
              staff: l.shops.map(
                (shop) => [shop.point[0] + 3, shop.point[1] - 3.8] as Point,
              ),
            }
          : null,
      );
    }
    if (!sim.paused && s.camera !== "aerial")
      pop.step(
        dt,
        s.elapsed,
        s.player,
        s.car,
        l ? (p) => interiorFits(p, l) : undefined,
      );
    (hero.children[0] as THREE.Mesh).material = r.material(
      s.inventory.jacket ? 0xc86b58 : 0xe0964f,
    );
    (hero.children[3] as THREE.Mesh).material = r.material(
      s.active?.stage === "collected" ? 0xe0b460 : 0x2c5960,
    );
    hero.position.set(s.player.x, s.player.y, s.player.z);
    hero.rotation.y = s.player.yaw;
    hero.visible =
      s.locomotion === "walk" &&
      s.camera !== "first" &&
      !(survey && s.interior);
    car.position.set(s.car.x, s.car.y, s.car.z);
    car.rotation.y = s.car.yaw;
    car.visible =
      (!s.interior || survey) &&
      !(s.camera === "first" && s.locomotion === "drive");
    if (!s.interior) furniture.update(point(s.player), s.elapsed);
    crowds.update(pop.pedestrians, s.elapsed, s.settings.reducedMotion);
    trafficModels.forEach((m, i) => {
      const a = pop.traffic[i];
      m.visible = !!a && !s.interior;
      if (a) {
        m.position.set(a.x, a.y, a.z);
        m.rotation.y = a.yaw;
      }
    });
    const target = navTarget;
    marker.visible = beacon.visible = !!target && !survey;
    if (pathLine) pathLine.visible = !survey;
    if (target) {
      const y = s.interior
        ? 0
        : (sim.world.support(target, 0, true, true) ?? 0);
      marker.position.set(target[0], y + 0.2, target[1]);
      beacon.position.set(
        target[0],
        y + 3.2 + (s.settings.reducedMotion ? 0 : Math.sin(elapsed * 2) * 0.3),
        target[1],
      );
      beacon.rotation.z = Math.PI;
    }
    const targetId =
      (sim.targetPlace()?.id ?? navigation ?? "") +
      ":" +
      s.interior?.place +
      ":" +
      s.active?.stage +
      ":" +
      s.locomotion;
    if (targetId !== lastTarget || elapsed - routeTime > 4) {
      nav();
      drawRoute();
      lastTarget = targetId;
      routeTime = elapsed;
    }
    cameraFrame();
    const me = s.interior ? s.interior.entrance : point(s.player);
    surveyMe.visible = survey;
    surveyCar.visible = survey && s.locomotion !== "drive";
    surveyMe.position.set(me[0], s.interior ? 6 : s.player.y + 6, me[1]);
    surveyCar.position.set(s.car.x, s.car.y + 4, s.car.z);
    for (const pin of [surveyMe, surveyCar]) {
      const scale = Math.max(
        7,
        camera.position.distanceTo(pin.position) * 0.12,
      );
      pin.scale.set(scale, scale / 6.4, 1);
    }
    overview.labels.children.forEach((o) => {
      o.position.y =
        s.camera === "aerial"
          ? o.userData.surveyHeight
          : o.userData.streetHeight;
      o.visible =
        s.camera === "aerial"
          ? cam.view.aerialDistance < 2000 ||
            [
              "richmond-centre",
              "steveston",
              "terra-nova",
              "ikea",
              "yvr",
              "hamilton",
            ].includes(o.name)
          : Math.hypot(o.position.x - s.player.x, o.position.z - s.player.z) <
            180;
      const scale = Math.max(3, camera.position.distanceTo(o.position) * 0.19);
      o.scale.set(scale, scale / 6.4, 1);
    });
    renderer.render(scene, camera);
    if (elapsed - snapshotTime > 0.18) {
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      canvas.dataset.geometries = String(renderer.info.memory.geometries);
      canvas.dataset.textures = String(renderer.info.memory.textures);
      canvas.dataset.resolution = `${canvas.width}x${canvas.height}`;
      canvas.dataset.dpr = String(renderer.getPixelRatio());
      canvas.dataset.tiles = String(tiles.size);
      canvas.dataset.people = String(pop.pedestrians.length);
      canvas.dataset.traffic = String(pop.traffic.length);
      canvas.dataset.frameMs = frameMs.toFixed(2);
      emit();
      snapshotTime = elapsed;
    }
    if (elapsed - saveTime > 5) {
      save();
      saveTime = elapsed;
    }
    if (elapsed > 5 && fps < 32 && adaptive > 1) {
      adaptive = Math.max(1, adaptive - 0.1);
      renderer.setPixelRatio(s.settings.lite ? 1 : adaptive);
      resize();
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    if (!visible) {
      input.clear();
      save();
    }
  });
  intersection.observe(canvas);
  const keyMap: Record<string, Input> = {
    KeyW: "forward",
    ArrowUp: "forward",
    KeyS: "back",
    ArrowDown: "back",
    KeyA: "left",
    ArrowLeft: "left",
    KeyD: "right",
    ArrowRight: "right",
    ShiftLeft: "sprint",
    ShiftRight: "sprint",
    Space: "brake",
  };
  function keydown(e: KeyboardEvent) {
    if (document.activeElement !== canvas) return;
    if (keyMap[e.code]) {
      e.preventDefault();
      setInput(keyMap[e.code], true, "key:" + e.code);
      return;
    }
    if (e.repeat) return;
    if (e.code === "KeyE") {
      e.preventDefault();
      mutate(() => sim.interact());
    }
    if (e.code === "KeyF") {
      e.preventDefault();
      mutate(() => sim.vehicle());
    }
    if (e.code === "KeyR") {
      e.preventDefault();
      mutate(() => {
        recoveries++;
        sim.recover();
      });
    }
    if (
      e.code === "Digit1" ||
      e.code === "Digit2" ||
      e.code === "Digit3" ||
      e.code === "Digit4"
    ) {
      mutate(() =>
        setCamera(
          (["third", "first", "top", "aerial"] as const)[
            Number(e.code.slice(-1)) - 1
          ],
        ),
      );
      cam.view.follow = true;
    }
    if (e.code === "Escape") {
      pausedByUi = !pausedByUi;
      input.clear();
      save();
      emit();
    }
  }
  function keyup(e: KeyboardEvent) {
    if (keyMap[e.code]) setInput(keyMap[e.code], false, "key:" + e.code);
  }
  function blur() {
    input.clear();
    if (pointer && canvas.hasPointerCapture(pointer.id))
      canvas.releasePointerCapture(pointer.id);
    pointer = null;
    save();
  }
  function visibility() {
    input.clear();
    last = performance.now();
    save();
  }
  let pointer: { id: number; x: number; y: number; button: number } | null =
    null;
  const down = (e: PointerEvent) => {
    if (pointer || pausedByUi || sim.state.shopping) return;
    canvas.focus();
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, button: e.button };
    canvas.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (document.pointerLockElement === canvas) {
      cam.look(e.movementX, e.movementY);
      return;
    }
    if (!pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.x,
      dy = e.clientY - pointer.y;
    if (pointer.button === 2 && sim.state.camera === "aerial")
      cam.pan(
        -dx * cam.view.aerialDistance * 0.0015,
        -dy * cam.view.aerialDistance * 0.0015,
      );
    else cam.look(dx, dy);
    pointer = { ...pointer, x: e.clientX, y: e.clientY };
  };
  const up = (e: PointerEvent) => {
    if (pointer?.id === e.pointerId) pointer = null;
  };
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    cam.zoom(e.deltaY, sim.state.camera === "aerial");
  };
  const context = (e: Event) => e.preventDefault();
  const loss = (e: Event) => {
    e.preventDefault();
    lost = true;
    input.clear();
    save();
    onError(
      "Graphics paused after WebGL context loss. Your local progress was saved. Press Retry graphics to recreate the scene.",
    );
  };
  canvas.addEventListener("webglcontextlost", loss);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("lostpointercapture", up);
  canvas.addEventListener("blur", blur);
  canvas.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("contextmenu", context);
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", blur);
  window.addEventListener("orientationchange", blur);
  screen.orientation?.addEventListener("change", blur);
  document.addEventListener("visibilitychange", visibility);
  resize();
  updateInterior();
  cameraFrame();
  frame = requestAnimationFrame(tick);
  emit();
  return {
    input: setInput,
    interact: () => mutate(() => sim.interact()),
    vehicle: () => mutate(() => sim.vehicle()),
    accept: (id) => mutate(() => sim.accept(id)),
    cancel: () => mutate(() => sim.cancel()),
    buy: (id) => mutate(() => sim.buy(id)),
    use: (id) => mutate(() => sim.use(id)),
    camera: (mode) => mutate(() => setCamera(mode)),
    returnToPlayer,
    focus: (target) => {
      const s = sim.state;
      setCamera("aerial");
      if (target === "player") {
        cam.view.follow = true;
        cam.view.aerialDistance = 350;
      } else if (target === "car") {
        cam.focus(point(s.car));
        cam.view.aerialDistance = 220;
      } else if (target === "city") {
        cam.focus([
          (city.bounds[0] + city.bounds[2]) / 2,
          (city.bounds[1] + city.bounds[3]) / 2,
        ]);
        cam.view.aerialDistance =
          (Math.max(
            (city.bounds[2] - city.bounds[0]) / camera.aspect,
            city.bounds[3] - city.bounds[1],
          ) /
            (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) *
          1.2;
        cam.view.pitch = 1.3;
        cam.view.yaw = 0;
      } else {
        const p = sim.places.get(target);
        if (p) {
          cam.focus(p.entrance);
          cam.view.aerialDistance = target === "yvr" ? 1100 : 650;
        }
      }
      sim.say(
        s.interior
          ? `Surveying outside. You remain inside ${sim.places.get(s.interior.place)!.name}; Find Me marks its entrance. Return to Player resumes there.`
          : "Aerial surveying. Your courier, car and delivery clock are paused.",
      );
      emit();
    },
    navigate: (id) => {
      if (sim.state.active) {
        sim.say(
          "Your current delivery keeps its route. Finish or cancel it before choosing a free-roam destination.",
        );
        emit();
        return;
      }
      navigation = id;
      routeTime = -100;
      lastTarget = "";
      sim.say("Route set. Your player and car have not moved.");
      emit();
    },
    look: (x, y) => cam.look(x, y),
    lockPointer() {
      if (!canvas.requestPointerLock) {
        sim.say("Mouse lock is unavailable; drag the view to look around.");
        emit();
        return;
      }
      canvas.requestPointerLock()?.catch(() => {
        sim.say("Mouse lock could not start; drag to look instead.");
        emit();
      });
    },
    zoom: (d) => cam.zoom(d, sim.state.camera === "aerial"),
    airfield: (v) => mutate(() => sim.airfield(v)),
    encounter: (c) => mutate(() => sim.resolve(c)),
    settings: (v) =>
      mutate(() => {
        sim.settings(v);
        renderer.setPixelRatio(
          sim.state.settings.lite ? 1 : Math.min(devicePixelRatio, adaptive),
        );
        resize();
        tileTime = -10;
      }),
    pause: (v) => {
      pausedByUi = v;
      sim.pause(v);
      sim.state.shopping = false;
      input.clear();
      save();
      emit();
    },
    recover: () =>
      mutate(() => {
        recoveries++;
        sim.recover();
      }),
    save: () => {
      save();
      emit();
    },
    reset: () =>
      mutate(() => {
        saveAllowed = true;
        sim.reset();
        cam.view.follow = true;
      }),
    dispose() {
      if (disposed) return;
      save();
      disposed = true;
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      cancelAnimationFrame(frame);
      pending.forEach((c) => c.abort());
      tiles.forEach((g) => g.userData.dispose());
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("webglcontextlost", loss);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);
      canvas.removeEventListener("blur", blur);
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("contextmenu", context);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
      window.removeEventListener("orientationchange", blur);
      screen.orientation?.removeEventListener("change", blur);
      document.removeEventListener("visibilitychange", visibility);
      scene.traverse((o) => {
        if (o instanceof THREE.InstancedMesh) o.dispose();
        if (o instanceof THREE.Sprite) o.material.dispose();
      });
      pathLine?.geometry.dispose();
      pathMaterial.dispose();
      overview.dispose();
      r.dispose();
      renderer.dispose();
      queueMicrotask(() => {
        if (!canvas.isConnected) renderer.forceContextLoss();
      });
      input.clear();
    },
  };
}
