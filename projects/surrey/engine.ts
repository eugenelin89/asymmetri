// SPDX-License-Identifier: MIT
import * as THREE from "three";
import { loadCity } from "./data";
import { createSimulation, seeded } from "./simulation";
import { buildScenery, person } from "./scenery";
import { distance, move } from "./world";
import type { City, Game, Input, Snapshot } from "./types";
type Callbacks = {
  map(city: City): void;
  update(state: Snapshot): void;
  fail(message: string): void;
  pause(): void;
  mapToggle(): void;
};
export async function createGame(
  host: HTMLElement,
  callbacks: Callbacks,
  signal: AbortSignal,
): Promise<Game> {
  const city = await loadCity(signal);
  signal.throwIfAborted();
  let sim = createSimulation(city);
  const coarse = matchMedia("(pointer: coarse)").matches,
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    antialias: !coarse,
    powerPreference: "low-power",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute(
    "aria-label",
    "Surrey Adventure. WASD or arrows walk. Shift sprints. Drag camera, wheel zoom. E interacts, M opens map, Escape pauses, R recovers. Tab reaches game controls.",
  );
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbdd6df);
  scene.fog = new THREE.Fog(0xbdd6df, 260, 1150);
  scene.add(new THREE.HemisphereLight(0xd1edff, 0x9c9871, 2.4));
  const sun = new THREE.DirectionalLight(0xffd7a1, 3);
  sun.position.set(-200, 320, 100);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -260,
    right: 260,
    top: 260,
    bottom: -260,
    near: 5,
    far: 750,
  });
  sun.shadow.normalBias = 0.5;
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(53, 1, 0.15, 1800);
  let yaw = 0,
    pitch = 0.35,
    zoom = 10;
  let disposed = false,
    lost = false,
    visible = true,
    paused = true,
    raf = 0,
    last = 0,
    lastHud = 0,
    frames = 0,
    fpsStart = 0,
    slow = 0;
  let pixelRatio = Math.min(devicePixelRatio, coarse ? 1 : 1.5),
    quality: "auto" | "low" = "auto";
  renderer.setPixelRatio(pixelRatio);
  function release() {
    const gs = new Set<THREE.BufferGeometry>(),
      ms = new Set<THREE.Material>(),
      ts = new Set<THREE.Texture>();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Sprite) {
        if (o instanceof THREE.Mesh) gs.add(o.geometry);
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          ms.add(m);
          Object.values(m).forEach((t) => {
            if (t instanceof THREE.Texture) ts.add(t);
          });
        });
      }
      if (o instanceof THREE.InstancedMesh) o.dispose();
    });
    gs.forEach((g) => g.dispose());
    ms.forEach((m) => m.dispose());
    ts.forEach((t) => t.dispose());
    sun.shadow.map?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  let scenery: ReturnType<typeof buildScenery>;
  try {
    scenery = buildScenery(scene, city, sim.world);
  } catch (error) {
    release();
    throw error;
  }
  const random = seeded(49189),
    ambient = Array.from({ length: coarse ? 10 : 20 }, (_, i) => {
      const personModel = person(
        [0x5b8bba, 0xb98b64, 0xb7a0c3, 0x7a9e70, 0xcea764][i % 5],
      );
      scene.add(personModel.group);
      const angle = random() * Math.PI * 2,
        p = sim.world.safe([
          city.anchors.spawn[0] + Math.cos(angle) * (15 + random() * 100),
          city.anchors.spawn[1] + Math.sin(angle) * (15 + random() * 120),
        ]);
      return {
        model: personModel,
        pose: {
          x: p[0],
          z: p[1],
          yaw: random() * Math.PI * 2,
          moving: false,
          running: false,
          blocked: false,
        },
        turn: 3 + random() * 6,
      };
    });
  const keys = new Set<Input>(),
    touch = new Set<Input>();
  const clear = () => {
    keys.clear();
    touch.clear();
  };
  const pressed = (i: Input) => keys.has(i) || touch.has(i);
  const report = () => {
    callbacks.update(structuredClone(sim.state));
    canvas.dataset.stage = sim.state.stage;
    canvas.dataset.position = `${sim.state.player.x.toFixed(2)},${sim.state.player.z.toFixed(2)}`;
  };
  function snapCamera() {
    const p = sim.state.player;
    camera.position.set(
      p.x + Math.sin(yaw) * zoom,
      4 + pitch * zoom,
      p.z + Math.cos(yaw) * zoom,
    );
    camera.lookAt(p.x, 1.8, p.z);
  }
  const aim = new THREE.Vector3(),
    desired = new THREE.Vector3();
  snapCamera();
  function render(dt: number) {
    const s = sim.state,
      p = s.player;
    scenery.player.animate(p, s.elapsed, reduced);
    const thiefMoving =
      s.stage === "chase" && distance(s.thief, city.anchors.escape) > 2;
    scenery.thief.animate(
      {
        x: s.thief[0],
        z: s.thief[1],
        yaw: Math.PI,
        moving: thiefMoving,
        running: thiefMoving,
      },
      s.elapsed,
      reduced,
    );
    scenery.thief.group.visible = s.stage === "chase";
    scenery.thief.bag.visible = s.stage === "chase";
    scenery.pickpocket.group.visible = s.danger.active;
    scenery.pickpocket.animate(
      {
        x: s.danger.position[0],
        z: s.danger.position[1],
        yaw: Math.atan2(p.x - s.danger.position[0], p.z - s.danger.position[1]),
        moving: s.danger.active,
        running: false,
      },
      s.elapsed,
      reduced,
    );
    scenery.marker.position.set(
      s.marker[0],
      4 + (reduced ? 0 : Math.sin(s.elapsed * 2) * 0.22),
      s.marker[1],
    );
    scenery.marker.rotation.y = s.elapsed * 0.5;
    scenery.marker.scale.setScalar(
      Math.max(
        1,
        Math.min(
          5,
          camera.position.distanceTo(scenery.marker.position) * 0.025,
        ),
      ),
    );
    scenery.ring.position.set(s.marker[0], 0.16, s.marker[1]);
    let d = zoom;
    while (
      d > 3 &&
      !sim.world.clear(
        [p.x, p.z],
        [p.x + Math.sin(yaw) * d, p.z + Math.cos(yaw) * d],
      )
    )
      d -= 0.5;
    desired.set(
      p.x + Math.sin(yaw) * d,
      2.3 + pitch * d,
      p.z + Math.cos(yaw) * d,
    );
    camera.position.lerp(desired, reduced ? 1 : 1 - Math.exp(-9 * dt));
    aim.set(p.x, 1.65, p.z);
    camera.lookAt(aim);
    renderer.render(scene, camera);
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.geometries = String(renderer.info.memory.geometries);
    canvas.dataset.textures = String(renderer.info.memory.textures);
    canvas.dataset.dpr = String(pixelRatio);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    fpsStart = 0;
    frames = 0;
    clear();
  }
  function schedule() {
    if (!raf && !disposed && !lost && visible && !document.hidden && !paused)
      raf = requestAnimationFrame(frame);
  }
  function frame(now: number) {
    raf = 0;
    if (disposed || lost || paused || !visible || document.hidden) return;
    const raw = last ? (now - last) / 1000 : 1 / 60,
      dt = Math.min(raw, 0.1);
    last = now;
    const forward = Number(pressed("forward")) - Number(pressed("back")),
      right = Number(pressed("right")) - Number(pressed("left"));
    sim.tick(
      dt,
      -Math.sin(yaw) * forward + Math.cos(yaw) * right,
      -Math.cos(yaw) * forward - Math.sin(yaw) * right,
      pressed("sprint"),
    );
    if (!sim.state.dialogue)
      for (const a of ambient) {
        a.turn -= dt;
        if (a.turn < 0 || a.pose.blocked) {
          a.pose.yaw += Math.PI * (0.5 + random());
          a.turn = 3 + random() * 8;
        }
        a.pose = move(
          a.pose,
          Math.sin(a.pose.yaw),
          Math.cos(a.pose.yaw),
          1.1,
          dt,
          sim.world,
        );
        a.model.animate(a.pose, sim.state.elapsed, reduced);
      }
    render(dt);
    if (now - lastHud > 150) {
      report();
      lastHud = now;
    }
    frames++;
    if (!fpsStart) fpsStart = now;
    if (now - fpsStart > 1500) {
      const fps = (frames * 1000) / (now - fpsStart);
      canvas.dataset.fps = fps.toFixed(1);
      if (fps < 38) slow++;
      else slow = 0;
      if (slow >= 2 && pixelRatio > 0.75) {
        pixelRatio = Math.max(0.75, pixelRatio - 0.2);
        renderer.setPixelRatio(pixelRatio);
        slow = 0;
      }
      frames = 0;
      fpsStart = now;
    }
    schedule();
  }
  const keyMap: Record<string, Input> = {
    w: "forward",
    ArrowUp: "forward",
    s: "back",
    ArrowDown: "back",
    a: "left",
    ArrowLeft: "left",
    d: "right",
    ArrowRight: "right",
    Shift: "sprint",
  };
  const key = (e: KeyboardEvent) =>
    e.key.length === 1 ? e.key.toLowerCase() : e.key;
  function down(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = key(e);
    if (keyMap[k]) {
      e.preventDefault();
      keys.add(keyMap[k]);
    } else if (!e.repeat) {
      if (k === "e") {
        e.preventDefault();
        sim.interact();
        clear();
        report();
      }
      if (k === "r") {
        sim.recover();
        snapCamera();
        report();
      }
      if (k === "m") {
        e.preventDefault();
        callbacks.mapToggle();
      }
      if (k === "Escape") {
        e.preventDefault();
        callbacks.pause();
      }
    }
  }
  const up = (e: KeyboardEvent) => keys.delete(keyMap[key(e)]);
  let pointer: { id: number; x: number; y: number } | null = null;
  const pointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };
  const pointerMove = (e: PointerEvent) => {
    if (pointer?.id !== e.pointerId) return;
    yaw -= (e.clientX - pointer.x) * 0.006;
    pitch = THREE.MathUtils.clamp(
      pitch + (e.clientY - pointer.y) * 0.003,
      0.15,
      0.85,
    );
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    if (paused) render(1);
  };
  const pointerEnd = () => {
    pointer = null;
  };
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    zoom = THREE.MathUtils.clamp(zoom + e.deltaY * 0.015, 5, 22);
    if (paused) render(1);
  };
  const visibility = () => {
    if (document.hidden) stop();
    else schedule();
  };
  const contextLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    stop();
    callbacks.fail(
      "The graphics connection was interrupted. Retry starts a fresh game. Your browser may need Lite graphics.",
    );
  };
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || disposed || lost) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render(1);
  });
  resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else stop();
  });
  intersection.observe(host);
  canvas.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", stop);
  canvas.addEventListener("blur", clear);
  window.addEventListener("focus", schedule);
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerEnd);
  canvas.addEventListener("pointercancel", pointerEnd);
  canvas.addEventListener("lostpointercapture", pointerEnd);
  canvas.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("webglcontextlost", contextLost);
  callbacks.map(city);
  report();
  renderer.shadowMap.needsUpdate = true;
  render(1);
  return {
    input(i, value) {
      if (value) touch.add(i);
      else touch.delete(i);
    },
    interact() {
      sim.interact();
      clear();
      report();
    },
    dismiss() {
      sim.dismiss();
      report();
    },
    pause(value) {
      paused = value;
      if (paused) stop();
      else schedule();
    },
    recover() {
      sim.recover();
      snapCamera();
      report();
      render(1);
    },
    reset() {
      const calm = sim.state.calm;
      sim = createSimulation(city);
      sim.calm(calm);
      yaw = 0;
      clear();
      snapCamera();
      report();
      render(1);
    },
    calm(value) {
      sim.calm(value);
      report();
    },
    quality(value) {
      quality = value;
      pixelRatio =
        quality === "low" ? 1 : Math.min(devicePixelRatio, coarse ? 1 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.shadowMap.enabled = value !== "low" && !coarse;
      renderer.shadowMap.needsUpdate = true;
      render(1);
    },
    rotate(value) {
      yaw += value;
      render(1);
    },
    zoom(value) {
      zoom = THREE.MathUtils.clamp(zoom + value, 5, 22);
      render(1);
    },
    focus() {
      canvas.focus({ preventScroll: true });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
      window.removeEventListener("focus", schedule);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("keydown", down);
      canvas.removeEventListener("blur", clear);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerEnd);
      canvas.removeEventListener("pointercancel", pointerEnd);
      canvas.removeEventListener("lostpointercapture", pointerEnd);
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("webglcontextlost", contextLost);
      release();
    },
  };
}
