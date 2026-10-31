// SPDX-License-Identifier: MIT
import * as THREE from "three";
import { surrey } from "@/content/site";
import { loadCity } from "./data";
import { createSimulation } from "./simulation";
import { buildScenery } from "./scenery";
import { distance } from "./world";
import { createAerial, fitStreetCamera } from "./camera";
import { populationPlan, stepPedestrians } from "./population";
import { writeSave } from "./save";
import type { SavedGame } from "./save";
import { landmarks } from "./landmarks";
import { viewShortcut } from "./viewPolicy";
import type { City, Game, Input, Snapshot } from "./types";
import { lightLevel, timePhase } from "./time";
import { missingReady } from "./missing";
import { disposeScene } from "./resources";
import { buildTransport } from "./transportScene";
import { bodyDistance } from "./vehicle";
import { createCityAudio } from "./audio";
import { railSupports } from "./surfaces";
import { segmentDistance } from "../vancouver/physics";
import { createInputState } from "./input";
type Callbacks = {
  map(city: City): void;
  update(state: Snapshot): void;
  fail(message: string): void;
  pause(): void;
  mapToggle(): void;
  saved?(success: boolean): void;
};
export async function createGame(
  host: HTMLElement,
  callbacks: Callbacks,
  signal: AbortSignal,
  initial?: SavedGame,
): Promise<Game> {
  const city = await loadCity(signal);
  const supports = railSupports(city);
  signal.throwIfAborted();
  let sim = createSimulation(city);
  if (initial) sim.restore(initial);
  const aerial = createAerial(city.bounds, [sim.state.player.x, sim.state.player.z]);
  aerial.state.follow = sim.state.follow;
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
    `${surrey.name}. Select Street Adventure to walk or Aerial Explore to see the city. Touch: arrows move, drag looks around, Interact talks, two fingers pan and pinch in Aerial Explore. Menu opens status, map and help. Keyboard: WASD moves, Shift sprints, E enters/exits a stopped car or interacts, Space handbrakes, V switches perspective, F finds your character, M opens map, Escape pauses, R recovers the character or car. Tab reaches controls.`,
  );
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbdd6df);
  scene.fog = new THREE.Fog(0xbdd6df, 260, 1150);
  const fill = new THREE.HemisphereLight(0xd1edff, 0x9c9871, 2.4); scene.add(fill);
  const audio = createCityAudio();
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
  const camera = new THREE.PerspectiveCamera(53, 1, 0.15, 5000);
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
    quality: "auto" | "low" = initial?.quality ?? "auto";
  let lastSave = 0;
  let renderHeight = 740;
  renderer.setPixelRatio(pixelRatio);
  function release() {
    disposeScene(scene, renderer, sun.shadow.map, canvas); audio.dispose();
  }
  let scenery: ReturnType<typeof buildScenery>;
  try {
    scenery = buildScenery(scene, city, sim.world);
  } catch (error) {
    release();
    throw error;
  }
  const transportScene = buildTransport(scene, sim.transport);
  let trafficBudget = coarse ? 3 : 6;
  let drivingOrbit = 0, previousOccupancy = sim.state.vehicle.occupied;
  let populationBudget = coarse ? 12 : 24;
  const ambient = populationPlan(city, sim.world, populationBudget).map((person, i) => {
    const model = scenery.makePerson([0x5b8bba, 0xb98b64, 0xb7a0c3, 0x7a9e70, 0xcea764][i % 5]);
    scene.add(model.group);
    return { ...person, model };
  });
  let lastShadowMinute = -10;
  const held = createInputState();
  const clear = () => {
    held.clear();
  };
  const pressed = (i: Input) => held.has(i);
  const report = () => {
    sim.state.cameraYaw = aerial.state.yaw;
    callbacks.update(structuredClone(sim.state));
    canvas.dataset.vehicle = sim.state.vehicle.occupied ? "driving" : "walking";
    canvas.dataset.car = `${sim.state.vehicle.car.x.toFixed(2)},${sim.state.vehicle.car.z.toFixed(2)},${sim.state.vehicle.car.yaw.toFixed(3)}`;
    canvas.dataset.speed = sim.state.vehicle.car.speed.toFixed(2);
    canvas.dataset.delivery = sim.state.delivery.stage;
    canvas.dataset.checkpoint = String(sim.state.delivery.checkpoint);
    canvas.dataset.detour = sim.state.detour.stage;
    canvas.dataset.detourDistance = sim.state.detour.driven.toFixed(1);
    canvas.dataset.navigation = sim.state.navigation.destination ?? "none";
    canvas.dataset.navigationStatus = sim.state.navigation.status;
    canvas.dataset.reroutes = String(sim.state.navigation.reroutes);
    canvas.dataset.traffic = String(sim.transport.traffic.filter(a => a.speed > .1).length);
    canvas.dataset.cityTime = sim.state.time.minutes.toFixed(2);
    canvas.dataset.missing = sim.state.missing.stage;
    canvas.dataset.population = String(ambient.filter(a => a.active).length);
    canvas.dataset.stage = sim.state.stage;
    canvas.dataset.mode = sim.state.mode;
    canvas.dataset.mystery = sim.state.investigation.stage;
    canvas.dataset.elapsed = sim.state.elapsed.toFixed(2);
    canvas.dataset.encounter = sim.state.encounter?.id ?? "none";
    canvas.dataset.cameraTarget = aerial.state.target.map(n => n.toFixed(2)).join(",");
    canvas.dataset.cameraDistance = aerial.state.distance.toFixed(1);
    canvas.dataset.cameraYaw = aerial.state.yaw.toFixed(3);
    canvas.dataset.cameraPitch = aerial.state.pitch.toFixed(3);
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
  function save() {
    let success = false;
    try { success = writeSave(localStorage, sim.serialize(quality)); } catch { /* Restricted browser storage: play remains available. */ }
    callbacks.saved?.(success);
    return success;
  }
  function mode(value: Snapshot["mode"]) {
    if (paused || sim.state.dialogue || value === sim.state.mode) return;
    clear(); sim.mode(value);
    if (value === "aerial" && aerial.state.follow) aerial.focus([sim.state.player.x, sim.state.player.z]);
    renderer.shadowMap.enabled = value === "ground" && quality !== "low" && !coarse;
    renderer.shadowMap.needsUpdate = true;
    if (reduced) render(1); report(); save();
  }
  function returnToPlayer() { aerial.focus([sim.state.player.x, sim.state.player.z]); sim.state.follow = true; clear(); report(); }
  function track(point: [number, number], name: string) { sim.state.waypoint = { point: [...point], name }; report(); save(); }
  if (sim.state.mode === "aerial") { const p = aerial.pose(); camera.position.set(...p.position); aim.set(...p.target); camera.lookAt(aim); }
  else { snapCamera(); aim.set(sim.state.player.x, 1.65, sim.state.player.z); }
  function render(dt: number) {
    const s = sim.state,
      p = s.player;
    const daylight = lightLevel(s.time.minutes, s.stableVisibility), night = timePhase(s.time.minutes) === "Night";
    const sky = new THREE.Color(0x23394f).lerp(new THREE.Color(0xbdd6df), daylight);
    (scene.background as THREE.Color).copy(sky); (scene.fog as THREE.Fog).color.copy(sky);
    fill.intensity = 1.25 + daylight * 1.15; sun.intensity = .35 + daylight * 2.65;
    const angle = (s.stableVisibility ? 780 : s.time.minutes) / 1440 * Math.PI * 2;
    sun.position.set(Math.cos(angle) * 300, 130 + daylight * 190, Math.sin(angle) * 230);
    sun.color.set(daylight < .9 ? 0xefb68c : 0xffe7c3);
    if (Math.abs(s.time.minutes - lastShadowMinute) > 8) { renderer.shadowMap.needsUpdate = true; lastShadowMinute = s.time.minutes; }
    transportScene.update(s, sim.transport);
    scenery.living(s.elapsed, daylight, night, reduced || s.stableVisibility);
    audio.tick(s.elapsed, distance([p.x, p.z], scenery.performerPoint), !paused && s.mode === "ground" && !s.dialogue && !night);
    const showPeople = s.mode === "ground" || aerial.state.distance < 350;
    scenery.player.group.visible = showPeople && !s.vehicle.occupied;
    scenery.staticPeople.forEach(person => { person.visible = showPeople; });
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
    scenery.thief.group.visible = showPeople && s.stage === "chase";
    scenery.thief.bag.visible = s.stage === "chase";
    scenery.pickpocket.group.visible = showPeople && s.danger.active;
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
    const isAerial = s.mode === "aerial";
    if (isAerial) {
      if (aerial.state.follow) aerial.focus([p.x, p.z]);
      const view = aerial.pose(); desired.set(...view.position);
      aim.lerp(new THREE.Vector3(...view.target), reduced ? 1 : 1 - Math.exp(-6 * dt));
      (scene.fog as THREE.Fog).near = 1300; (scene.fog as THREE.Fog).far = 4200;
    } else {
      if (previousOccupancy !== s.vehicle.occupied) { drivingOrbit = 0; previousOccupancy = s.vehicle.occupied; }
      if (s.vehicle.occupied) {
        const target = s.vehicle.car.yaw + Math.PI + drivingOrbit;
        yaw += Math.atan2(Math.sin(target-yaw),Math.cos(target-yaw)) * (reduced ? 1 : 1-Math.exp(-5*dt));
      }
      let d = s.vehicle.occupied ? Math.max(9, zoom+3) : zoom;
      const clear = (a: [number,number], b: [number,number]) => sim.world.clear(a,b) && supports.every(q=>segmentDistance(q,a,b)>1.3);
      while (d > 3 && !clear([p.x, p.z], [p.x + Math.sin(yaw) * d, p.z + Math.cos(yaw) * d])) d -= .5;
      desired.set(p.x + Math.sin(yaw) * d, 2.3 + pitch * d, p.z + Math.cos(yaw) * d);
      aim.lerp(new THREE.Vector3(p.x, 1.65, p.z), reduced ? 1 : 1 - Math.exp(-9 * dt));
      (scene.fog as THREE.Fog).near = 300; (scene.fog as THREE.Fog).far = 1500;
    }
    camera.position.lerp(desired, reduced ? 1 : 1 - Math.exp(-6 * dt));
    if (!isAerial) { const fit = fitStreetCamera([p.x, p.z], [camera.position.x, camera.position.z], (a,b)=>sim.world.clear(a,b)&&supports.every(q=>segmentDistance(q,a,b)>1.3)); camera.position.x = fit[0]; camera.position.z = fit[1]; }
    camera.lookAt(aim);
    scenery.you.visible = isAerial;
    scenery.you.position.set(p.x, 9, p.z);
    const pixelScale = (position: THREE.Vector3) => camera.position.distanceTo(position) * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / renderHeight;
    const youScale = 42 * pixelScale(scenery.you.position); scenery.you.scale.set(youScale, youScale, 1);
    const occupied: { x: number; y: number }[] = [];
    scenery.labels.forEach(label => {
      const scale = pixelScale(label.position);
      label.material.depthTest = !isAerial; label.material.depthWrite = false;
      label.visible = isAerial || camera.position.distanceTo(label.position) < 210;
      if (isAerial) {
        const labelWidth = camera.aspect < .9 ? 112 : 155;
        label.scale.set(labelWidth * scale, labelWidth * 29 / 155 * scale, 1);
        const projected = label.position.clone().project(camera), x = projected.x * renderHeight * camera.aspect / 2, y = projected.y * renderHeight / 2;
        label.visible = projected.z < 1 && !occupied.some(p => Math.abs(x - p.x) < labelWidth + 10 && Math.abs(y - p.y) < 40);
        if (label.visible) occupied.push({ x, y });
      } else label.scale.set(26, 4.875, 1);
    });
    scenery.waypoint.visible = !!s.waypoint;
    if (s.waypoint) { scenery.waypoint.position.set(s.waypoint.point[0], 6, s.waypoint.point[1]); scenery.waypoint.scale.setScalar(Math.max(1, pixelScale(scenery.waypoint.position) * 14)); }
    scenery.encounter.group.visible = showPeople && !!s.encounter;
    scenery.encounterMarker.visible = !!s.encounter;
    if (s.encounter) {
      scenery.encounter.animate({ x: s.encounter.position[0], z: s.encounter.position[1], yaw: Math.atan2(p.x - s.encounter.position[0], p.z - s.encounter.position[1]), moving: s.encounter.phase !== "offer", running: false }, s.elapsed, reduced);
      scenery.encounterMarker.position.set(s.encounter.position[0], 3.6, s.encounter.position[1]);
      scenery.encounterMarker.scale.setScalar(Math.max(1, pixelScale(scenery.encounterMarker.position) * 14));
    }
    scenery.evidence.forEach((object, id) => { object.visible = s.investigation.stage !== "available" && (!isAerial || s.investigation.evidence.includes(id)); });
    scenery.witnessMarkers.forEach(object => { object.visible = s.investigation.stage !== "available"; if (isAerial) object.scale.setScalar(Math.max(1, pixelScale(object.position) * 12)); else object.scale.setScalar(1); });
    ambient.forEach(a => { a.model.group.visible = a.active !== false && (!isAerial || aerial.state.distance < 350); });
    scenery.missingActors.forEach((actor, id) => { actor.visible = showPeople && (id !== "riley" || missingReady(s.missing)); });
    scenery.missingMarkers.forEach((marker, id) => { marker.visible = id === "tess" || (s.missing.stage !== "available" && s.missing.stage !== "closed" && (id !== "riley" || missingReady(s.missing))); if (isAerial) marker.scale.setScalar(Math.max(1, pixelScale(marker.position) * 12)); else marker.scale.setScalar(1); });
    scenery.missingObjects.forEach((object, id) => { object.visible = s.missing.stage !== "available" && (!isAerial || s.missing.clues.includes(id)); });
    scenery.closeDetails.forEach(tile => { tile.mesh.visible = (!isAerial || aerial.state.distance < 350) && Math.hypot(camera.position.x - tile.centre[0], camera.position.z - tile.centre[1]) < 280; });
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
    clear(); audio.mute();
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
    sim.setPedestrians(ambient.filter(a=>a.active!==false).map(a=>[a.pose.x,a.pose.z]),trafficBudget);
    sim.tick(
      dt,
      -Math.sin(yaw) * forward + Math.cos(yaw) * right,
      -Math.cos(yaw) * forward - Math.sin(yaw) * right,
      pressed("sprint"),
      { throttle: forward, steering: -right, brake: pressed("handbrake") || pressed("sprint") },
    );
    if (sim.state.mode === "aerial") {
      if (right || forward) aerial.pan(right * dt * aerial.state.distance * .6, forward * dt * aerial.state.distance * .6);
      sim.state.follow = aerial.state.follow;
    } else if (!sim.state.dialogue) {
      stepPedestrians(ambient, [sim.state.player.x, sim.state.player.z], sim.state.danger.active ? sim.state.danger.position : sim.state.encounter?.phase === "pursuit" ? sim.state.encounter.position : null, dt, sim.world, sim.state.time.minutes, populationBudget, p=>bodyDistance(sim.state.vehicle.car,p)>.65 && sim.transport.traffic.every(a=>bodyDistance(a.pose,p)>.75), sim.state.elapsed);
      ambient.forEach(a => a.model.animate(a.pose, sim.state.elapsed, reduced, a.activity));
    }
    if (now - lastSave > 5000) { save(); lastSave = now; }
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
        populationBudget = Math.max(8, populationBudget - 4);
        trafficBudget = Math.max(1, trafficBudget - 1);
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
    " ": "handbrake",
  };
  const key = (e: KeyboardEvent) =>
    e.key.length === 1 ? e.key.toLowerCase() : e.key;
  function down(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (paused || target.isContentEditable || target.closest("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (sim.state.volume > 0) void audio.volume(sim.state.volume);
    const k = key(e);
    if (keyMap[k]) {
      e.preventDefault();
      held.set(`key:${k}`, keyMap[k], true);
    } else if (!e.repeat) {
      if (k === "e") {
        e.preventDefault();
        sim.interact();
        clear();
        report(); save();
      }
      if (viewShortcut(e, !!sim.state.dialogue, false)) { e.preventDefault(); mode(sim.state.mode === "ground" ? "aerial" : "ground"); }
      if (k === "f" && sim.state.mode === "aerial") { e.preventDefault(); returnToPlayer(); }
      if (k === "r" && sim.state.mode === "ground") {
        sim.recover();
        snapCamera();
        report(); save();
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
  const up = (e: KeyboardEvent) => held.set(`key:${key(e)}`, keyMap[key(e)], false);
  const pointers = new Map<number, { x: number; y: number; button: number }>();
  const pointerDown = (e: PointerEvent) => {
    if (sim.state.volume > 0) void audio.volume(sim.state.volume);
    canvas.focus({ preventScroll: true }); canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, button: e.button });
  };
  const pointerMove = (e: PointerEvent) => {
    const prev = pointers.get(e.pointerId); if (!prev || sim.state.dialogue) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    if (sim.state.mode === "aerial") {
      const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)?.[1];
      if (other) {
        const before = Math.hypot(prev.x - other.x, prev.y - other.y), after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (before > 1 && after > 1) aerial.zoom(Math.log(before / after) / .0015);
        aerial.pan(-dx * aerial.state.distance / 900, dy * aerial.state.distance / 900);
      } else if (prev.button === 2) aerial.pan(-dx * aerial.state.distance / 600, dy * aerial.state.distance / 600);
      else aerial.orbit(dx, dy);
      sim.state.follow = aerial.state.follow;
    } else if (prev.button === 0) { if(sim.state.vehicle.occupied) drivingOrbit -= dx*.006; else yaw -= dx * .006; pitch = THREE.MathUtils.clamp(pitch + dy * .003, .15, .85); }
    pointers.set(e.pointerId, { ...prev, x: e.clientX, y: e.clientY });
    if (paused) render(1);
  };
  const pointerEnd = (e: PointerEvent) => { pointers.delete(e.pointerId); };
  const contextMenu = (e: Event) => e.preventDefault();
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    if (sim.state.mode === "aerial") aerial.zoom(e.deltaY);
    else zoom = THREE.MathUtils.clamp(zoom + e.deltaY * .015, 5, 22);
    if (paused) render(1);
  };
  const visibility = () => {
    if (document.hidden) { save(); stop(); }
    else schedule();
  };
  const contextLost = (e: Event) => {
    e.preventDefault();
    save(); lost = true;
    stop();
    callbacks.fail(
      "The graphics connection was interrupted. Retry resumes the last local save when storage is available. Try Lite graphics.",
    );
  };
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || disposed || lost) return;
    renderHeight = height;
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
  canvas.addEventListener("contextmenu", contextMenu);
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
    input(i, value, source = `touch:${i}`) {
      if (!value || (!paused && !document.hidden && !sim.state.dialogue)) held.set(source, i, value);
    },
    interact() {
      sim.interact();
      clear();
      report(); save();
    },
    dismiss() {
      sim.dismiss();
      report(); save();
    },
    choose(id) { sim.choose(id); clear(); report(); save(); },
    mode, returnToPlayer, track, save,
    timeRate(value) { if ([1, 4, 12].includes(value)) sim.state.time.rate = value; report(); save(); },
    rest(value) { sim.rest(value); report(); save(); render(1); },
    visibility(value) { sim.state.stableVisibility = value; renderer.shadowMap.needsUpdate = true; report(); save(); render(1); },
    audio(value) { sim.state.volume = Math.max(0, Math.min(1, value)); void audio.volume(sim.state.volume); report(); save(); },
    follow(value) { aerial.state.follow = value; sim.state.follow = value; if (value) returnToPlayer(); report(); save(); },
    selectPlace(id) { const place = landmarks(city).find(p => p.id === id); if (place) { mode("aerial"); aerial.focus(place.point, false); sim.state.follow = false; track(place.point, place.name); } },
    clearWaypoint() { sim.state.waypoint = null; report(); save(); },
    navigate(destination) { clear(); sim.navigate(destination); report(); save(); render(1); },
    trafficDensity(value) { sim.state.trafficDensity=value; report(); save(); },
    mature(value) { sim.mature(value); report(); save(); },
    pause(value) {
      paused = value;
      if (paused) { save(); stop(); }
      else schedule();
    },
    recover() {
      if (sim.state.mode === "aerial") return;
      sim.recover();
      snapCamera();
      report(); save();
      render(1);
    },
    reset() {
      const { calm, mature, stableVisibility, volume } = sim.state, rate = sim.state.time.rate;
      sim = createSimulation(city);
      sim.calm(calm); sim.mature(mature); Object.assign(sim.state, { stableVisibility, volume }); sim.state.time.rate = rate; aerial.focus(city.anchors.spawn);
      yaw = 0;
      clear();
      snapCamera();
      report();
      render(1);
    },
    calm(value) {
      sim.calm(value);
      report(); save();
    },
    quality(value) {
      quality = value;
      pixelRatio =
        quality === "low" ? 1 : Math.min(devicePixelRatio, coarse ? 1 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.shadowMap.enabled = value !== "low" && !coarse && sim.state.mode === "ground";
      renderer.shadowMap.needsUpdate = true;
      render(1); save();
    },
    rotate(value) {
      if (sim.state.mode === "aerial") aerial.orbit(-value / .006, 0); else if(sim.state.vehicle.occupied) drivingOrbit += value; else yaw += value;
      render(1);
    },
    zoom(value) {
      if (sim.state.mode === "aerial") aerial.zoom(value * 75); else zoom = THREE.MathUtils.clamp(zoom + value, 5, 22);
      render(1);
    },
    focus() {
      canvas.focus({ preventScroll: true });
    },
    dispose() {
      if (disposed) return;
      save(); disposed = true;
      stop();
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
      window.removeEventListener("focus", schedule);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("keydown", down);
      canvas.removeEventListener("blur", clear);
      canvas.removeEventListener("contextmenu", contextMenu);
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
