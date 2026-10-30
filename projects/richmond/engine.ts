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
import { interiorFor, interiorFits, interiorRoute } from "./interiors";
import { readSave, writeSave } from "./save";
import { distance, point } from "./world";
import type { City, Game, Input, Point, Snapshot, Building } from "./types";
export function createGame(
  canvas: HTMLCanvasElement,
  city: City,
  onSnapshot: (s: Snapshot) => void,
  onError: (text: string) => void,
): Game {
  const sim = createSimulation(city);
  let storage: Storage | null = null,
    saveAllowed = true,
    saveNotice = "Local progress · fictional game money";
  try {
    storage = localStorage;
    const loaded = readSave(storage, city);
    if (loaded.state) sim.restore(loaded.state);
    saveNotice = loaded.message;
    saveAllowed = !loaded.invalid;
  } catch {
    saveNotice = "Storage unavailable. Progress may not survive reload.";
  }
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
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
    lastTarget = "",
    adaptive = 1.5;
  const input = new Map<string, Input>(),
    pending = new Map<string, AbortController>(),
    tiles = new Map<string, THREE.Group>(),
    farIndices = new Map(city.buildingIndex.map((b, i) => [b.id, i]));
  const setInput = (action: Input, pressed: boolean, source: string) => {
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
    const target =
      sim.target() ??
      (!sim.state.interior && navigation
        ? (sim.places.get(navigation)?.entrance ?? null)
        : null);
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
      paused: sim.paused,
      fps: Math.round(fps),
      pedestrians: pop.pedestrians.length,
      traffic: pop.traffic.length,
      saveNotice,
      distance: target ? distance(point(sim.state.player), target) : 0,
    });
  }
  function mutate(fn: () => void) {
    fn();
    input.clear();
    routeTime = 0;
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
      sim.state.interior ||
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
    const t =
      sim.targetPlace() ?? (navigation ? sim.places.get(navigation) : null);
    if (sim.state.interior) {
      route = sim.target()
        ? interiorRoute(
            point(sim.state.player),
            sim.target()!,
            interiorFor(sim.places.get(sim.state.interior.place)!),
          )
        : [];
      return;
    }
    if (!t) {
      route = [];
      return;
    }
    if (sim.state.locomotion === "walk") {
      route = sim.world.entranceRoute(sim.state.player, t, sim.state.airfield);
    } else {
      route =
        distance(point(sim.state.car), t.parking) < 8
          ? [point(sim.state.car), t.parking]
          : sim.world.route(point(sim.state.car), t.roadNode);
      if (route.length) route.push(t.parking, t.entrance);
    }
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
          ? !interiorFits(
              [p.x, p.z],
              interiorFor(sim.places.get(s.interior.place)!),
              0.2,
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
    const dt = Math.min(0.1, (time - last) / 1000 || 0);
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
    }
    updateInterior();
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
    hero.visible = s.locomotion === "walk" && s.camera !== "first";
    car.position.set(s.car.x, s.car.y, s.car.z);
    car.rotation.y = s.car.yaw;
    car.visible =
      !s.interior && !(s.camera === "first" && s.locomotion === "drive");
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
    const target =
      sim.target() ??
      (!s.interior && navigation ? sim.places.get(navigation)?.entrance : null);
    marker.visible = beacon.visible = !!target;
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
      s.active?.stage;
    if (targetId !== lastTarget || elapsed - routeTime > 4) {
      nav();
      drawRoute();
      lastTarget = targetId;
      routeTime = elapsed;
    }
    cameraFrame();
    overview.labels.children.forEach((o) => {
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
      mutate(() => sim.recover());
    }
    if (
      e.code === "Digit1" ||
      e.code === "Digit2" ||
      e.code === "Digit3" ||
      e.code === "Digit4"
    ) {
      mutate(() =>
        sim.camera(
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
  const up = () => {
    pointer = null;
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
  canvas.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("contextmenu", context);
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", blur);
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
    camera: (mode) =>
      mutate(() => {
        sim.camera(mode);
        cam.view.follow = true;
        if (mode === "first") cam.view.pitch = 0.5;
      }),
    focus: (target) => {
      const s = sim.state;
      if (target === "player") {
        cam.view.follow = true;
      } else if (target === "car") {
        if (s.interior) {
          sim.say(
            "Your car is parked outside. Leave the building to view its position.",
          );
          emit();
          return;
        }
        cam.focus(point(s.car));
      } else {
        const p = sim.places.get(target);
        if (p) {
          if (s.interior) {
            sim.say("Leave this interior to survey the outdoor city.");
            emit();
            return;
          }
          cam.focus(p.entrance);
        }
      }
      sim.camera("aerial");
      emit();
    },
    navigate: (id) => {
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
    recover: () => mutate(() => sim.recover()),
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
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("contextmenu", context);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
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
