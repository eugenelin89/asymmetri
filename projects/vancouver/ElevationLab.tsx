import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepCar } from "./physics";
import { createElevatedWorld, elevatedCameraTarget, elevationFixture, fixtureGround, surfaceSample } from "./elevation";
import type { ElevatedCar } from "./elevation";
import styles from "./vancouver.module.css";

/** Development-only, synthetic geometry. Never connected to public city driving. */
export default function ElevationLab() {
  const host = useRef<HTMLDivElement>(null);
  const control = useRef<{ start(end: "south" | "north" | "underpass"): void; overview(): void } | null>(null);
  const [telemetry, setTelemetry] = useState("Focus the model; arrows/WASD drive, space brakes.");
  useEffect(() => {
    const mount = host.current; if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { mount.textContent = "The isolated model needs WebGL2. Its geometry and physics tests can still run with npm run test:vancouver."; return () => { mount.textContent = ""; }; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setClearColor(0xd3e0e1);
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute("aria-label", "Synthetic elevated road proof. Focus here and use arrows or WASD to drive. Space brakes."); mount.appendChild(canvas);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, 1, .1, 1500);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x55705b, 2.5));
    const sun = new THREE.DirectionalLight(0xfff4d9, 2); sun.position.set(100, 200, 0); scene.add(sun);
    const materials = [0x485958, 0xd5c79e, 0x32959b, 0x9cad97, 0x116f65, 0x233b45, 0xf1d882].map((color) => new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
    function box(w: number, h: number, d: number, x: number, y: number, z: number, material: number, parent: THREE.Object3D = scene) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials[material]); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    }
    box(180, 2, 255, 0, -1.1, 87.5, 3); box(180, 2, 245, 0, -1.1, 397.5, 3);
    box(180, .2, 60, 0, -.6, 245, 2);
    for (const surface of elevationFixture) {
      const dx = surface.to.x - surface.from.x, dz = surface.to.z - surface.from.z, length = Math.hypot(dx, dz), slices = Math.ceil(length / 2);
      const normalX = dz / length, normalZ = -dx / length, vertices: number[] = [];
      for (let i = 0; i < slices; i++) {
        const edge = (fraction: number, side: number) => {
          const x = surface.from.x + dx * fraction, z = surface.from.z + dz * fraction;
          return [x + normalX * surface.width / 2 * side, surfaceSample(surface, [x, z])!.y + .04, z + normalZ * surface.width / 2 * side];
        };
        const a = edge(i / slices, -1), b = edge(i / slices, 1), c = edge((i + 1) / slices, -1), d = edge((i + 1) / slices, 1);
        vertices.push(...a, ...b, ...c, ...b, ...d, ...c);
      }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); geometry.computeVertexNormals(); scene.add(new THREE.Mesh(geometry, materials[0]));
      for (let t = 4; t < length; t += 10) {
        const x = surface.from.x + dx * t / length, z = surface.from.z + dz * t / length, sample = surfaceSample(surface, [x, z])!;
        const stripe = box(.18, .03, 3, x, sample.y + .07, z, 6); stripe.rotation.set(-Math.atan(sample.grade), sample.direction, 0, "YXZ");
      }
    }
    // Supports are outside the drivable ribbon and do not block the underpass.
    for (const z of [185, 210, 280, 295]) for (const x of [-7, 7]) box(1.4, 8, 1.4, x, 4, z, 1);
    const vehicle = new THREE.Group(); scene.add(vehicle);
    box(1.9, .8, 4, 0, .65, 0, 4, vehicle); box(1.6, .65, 1.8, 0, 1.35, -.2, 5, vehicle);
    const world = createElevatedWorld(elevationFixture, fixtureGround);
    let car: ElevatedCar = { x: 0, z: 8, y: 0, yaw: 0, speed: 0, steer: 0, pitch: 0, surface: "south" };
    let overview = false, travelled = 0, contacts = 0, last = 0, lastReport = 0, raf = 0, visible = true, disposed = false;
    const keys = new Set<string>();
    const stopInput = () => { keys.clear(); car = { ...car, speed: 0, steer: 0 }; };
    const down = (event: KeyboardEvent) => { const key = event.key.toLowerCase(); if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) { event.preventDefault(); keys.add(key); } };
    const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    canvas.addEventListener("keydown", down); window.addEventListener("keyup", up); canvas.addEventListener("blur", stopInput);
    const start = (end: "south" | "north" | "underpass") => {
      stopInput(); travelled = 0; contacts = 0; overview = false;
      car = end === "north" ? { x: 0, z: 472, y: 0, yaw: Math.PI, speed: 0, pitch: 0, surface: "north" } : end === "underpass" ? { x: -50, z: 190, y: 0, yaw: Math.PI / 2, speed: 0, pitch: 0, surface: "underpass" } : { x: 0, z: 8, y: 0, yaw: 0, speed: 0, pitch: 0, surface: "south" };
      canvas.focus({ preventScroll: true });
    };
    control.current = { start, overview() { stopInput(); overview = !overview; canvas.focus({ preventScroll: true }); } };
    const schedule = () => { if (!raf && visible && !document.hidden && !disposed) raf = requestAnimationFrame(frame); };
    const visibility = () => { stopInput(); cancelAnimationFrame(raf); raf = 0; last = 0; schedule(); };
    document.addEventListener("visibilitychange", visibility);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); }); intersection.observe(mount);
    const resize = new ResizeObserver(() => { const { width, height } = mount.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }); resize.observe(mount);
    function frame(now: number) {
      raf = 0; if (disposed || !visible || document.hidden) return;
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, .1); last = now;
      const prior = car, pressed = (...names: string[]) => names.some((name) => keys.has(name));
      if (!overview) car = world.step(stepCar, car, Number(pressed("w", "arrowup")) - Number(pressed("s", "arrowdown")), Number(pressed("a", "arrowleft")) - Number(pressed("d", "arrowright")), pressed(" "), dt);
      travelled += Math.hypot(car.x - prior.x, car.z - prior.z); if (car.blocked && !prior.blocked) contacts++;
      vehicle.position.set(car.x, car.y + .05, car.z); vehicle.rotation.set(-car.pitch, car.yaw, 0, "YXZ");
      const target = elevatedCameraTarget(car);
      if (overview) { camera.position.set(160, 155, 255); camera.lookAt(0, 3, 240); }
      else { camera.position.set(target.x, target.y, target.z); camera.lookAt(car.x + Math.sin(car.yaw) * 4, target.aimY, car.z + Math.cos(car.yaw) * 4); }
      renderer.render(scene, camera);
      if (now - lastReport > 150) {
        lastReport = now;
        Object.assign(canvas.dataset, { surface: car.surface, height: car.y.toFixed(3), pitch: car.pitch.toFixed(4), distance: travelled.toFixed(1), contacts: String(contacts), x: car.x.toFixed(2), z: car.z.toFixed(2) });
        setTelemetry(`${car.surface} · ${Math.round(Math.abs(car.speed) * 3.6)} km/h · height ${car.y.toFixed(2)} m · pitch ${(car.pitch * 180 / Math.PI).toFixed(1)}° · ${travelled.toFixed(1)} m · ${contacts} contacts`);
      }
      schedule();
    }
    schedule();
    return () => {
      disposed = true; control.current = null; cancelAnimationFrame(raf); intersection.disconnect(); resize.disconnect();
      canvas.removeEventListener("keydown", down); canvas.removeEventListener("blur", stopInput); window.removeEventListener("keyup", up); document.removeEventListener("visibilitychange", visibility);
      scene.traverse((object) => { if (object instanceof THREE.Mesh) object.geometry.dispose(); }); materials.forEach((material) => material.dispose()); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    };
  }, []);
  return <section className={styles.elevationLab} aria-label="Isolated elevation proof">
    <h3>Synthetic elevation lab · development only</h3>
    <p>A 480 m corridor with connected ground, smooth ramps, an 8 m deck and a separate underpass. This is not Cambie Bridge or surveyed terrain. Arrows/WASD drive; space brakes. Test both starts and the road underneath.</p>
    <div><button type="button" onClick={() => control.current?.start("south")}>Start south → north</button><button type="button" onClick={() => control.current?.start("north")}>Start north → south</button><button type="button" onClick={() => control.current?.start("underpass")}>Start underpass</button><button type="button" onClick={() => control.current?.overview()}>Side overview / chase</button></div>
    <div className={styles.elevationViewport} ref={host} />
    <output>{telemetry}</output>
  </section>;
}
