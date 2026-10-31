import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import "./test-loader.mjs";
const { createChaseController, createHalloweenChase, buildMaskedPursuer, halloweenPursuitSpeed, halloweenFollowDistance } = await import("./halloween-chase.ts");
const { createCollision, createRoutes, inPolygon } = await import("./spatial.ts");
const { defaults } = await import("./environment.ts");
const { runSpeed } = await import("./navigation.ts");
const enabled = { ...defaults, halloween: true, halloweenChase: true, population: true, reducedMotion: false };
const context = { mode: "walk", paused: false, indoor: false };
const pose = (x = 0, z = 0, yaw = -Math.PI / 2, y = 0) => ({ x, y, z, yaw, pitch: 0 });
function fixture(buildings = [], routePoints = [[[-300, 0], [300, 0]]]) {
  const data = { origin: [0, 0], buildings, surfaces: [], trees: [], entrances: [], routes: routePoints.map((points, i) => ({ id: `route-${i}`, points })) };
  const collision = createCollision(data, [], new Set()), routes = createRoutes(data, collision.blocked);
  return { data, collision, routes, chase: createChaseController(data, [], collision, routes) };
}
function dispose(group) {
  const resources = new Set(); group.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) resources.add(material);
  }); resources.forEach((r) => r.dispose());
}
const point = (state) => [state.position.x, state.position.z];

test("original masked workwear figure has a visible prop knife, finite geometry and a bounded mesh budget", () => {
  const model = buildMaskedPursuer();
  try {
    assert.ok(model.group.getObjectByName("halloween-mask"));
    const knife = model.group.getObjectByName("halloween-prop-knife"); assert.ok(knife);
    assert.equal(knife.parent, model.arms[1]);
    let meshes = 0, triangles = 0;
    model.group.traverse((mesh) => {
      if (!mesh.geometry) return; meshes++;
      triangles += (mesh.geometry.index?.count || mesh.geometry.attributes.position.count) / 3;
      for (const key of ["position", "normal"]) assert.ok(Array.from(mesh.geometry.attributes[key].array).every(Number.isFinite));
    });
    assert.ok(meshes <= 12 && triangles < 6000);
    const bounds = new THREE.Box3().setFromObject(model.group);
    assert.ok(bounds.max.y > 1.9 && bounds.max.y < 2.05 && Math.abs(bounds.min.y) < 0.01);
    assert.equal(model.group.userData.info, undefined, "The costume is not a named faculty/film-person simulation");
  } finally { dispose(model.group); }
});

test("the pursuer approaches, stops short, and can be outrun without teleporting after a continuous run", () => {
  const f = fixture(), visitor = pose(); f.chase.update(0.05, enabled, visitor, context);
  const start = f.chase.state.position.x; assert.ok(start >= 8 && start <= 32);
  for (let i = 0; i < 240; i++) {
    const before = point(f.chase.state); f.chase.update(0.05, enabled, visitor, context);
    assert.ok(Math.hypot(f.chase.state.position.x - before[0], f.chase.state.position.z - before[1]) <= halloweenPursuitSpeed * 0.05 + 1e-8);
  }
  assert.ok(Math.abs(Math.hypot(...point(f.chase.state)) - halloweenFollowDistance) < 0.02);
  assert.ok(halloweenPursuitSpeed < runSpeed);
  const spawns = f.chase.state.spawnCount;
  for (let i = 0; i < 400; i++) { visitor.x -= runSpeed * 0.05; f.chase.update(0.05, enabled, visitor, context); }
  assert.ok(Math.hypot(f.chase.state.position.x - visitor.x, f.chase.state.position.z - visitor.z) > 50);
  assert.equal(f.chase.state.spawnCount, spawns, "Running away does not make the pursuer respawn beside the player");
});

test("pursuit follows the real route graph around an intervening building without wall tunnelling", () => {
  const wall = { id: "building", name: "Test building", height: 10, rings: [[[-3, -10], [3, -10], [3, 10], [-3, 10], [-3, -10]]] };
  const f = fixture([wall], [[[-20, 0], [-20, -20], [20, -20], [20, 0]]]);
  f.chase.update(0.05, enabled, pose(-8, 0, Math.PI / 2), context);
  assert.ok(f.chase.state.position.x < -3);
  const visitor = pose(8); let wentAround = false;
  for (let i = 0; i < 1000; i++) {
    const before = point(f.chase.state); f.chase.update(0.05, enabled, visitor, context);
    const after = point(f.chase.state);
    assert.equal(f.collision.blocked(after, f.chase.state.position.y), false);
    assert.equal(inPolygon(after, wall.rings), false);
    assert.ok(f.chase.clearSegment(before, after));
    wentAround ||= after[1] < -10.3;
  }
  assert.ok(wentAround, "The actor travels beyond the wall end");
  assert.ok(Math.hypot(f.chase.state.position.x - visitor.x, f.chase.state.position.z - visitor.z) < 3);
});

test("disconnected paths never cross a wall and failed route searches remain throttled", () => {
  const wall = { id: "wall", name: "No passage", height: 10, rings: [[[-3, -100], [3, -100], [3, 100], [-3, 100], [-3, -100]]] };
  const f = fixture([wall], [[[-30, 0], [-5, 0]], [[5, 0], [30, 0]]]);
  let searches = 0;
  const find = f.routes.find;
  f.routes.find = (...args) => { searches++; return find(...args); };
  f.chase.update(0.05, enabled, pose(-8, 0, Math.PI / 2), context);
  const start = point(f.chase.state);
  for (let i = 0; i < 200; i++) f.chase.update(0.05, enabled, pose(8), context);
  assert.deepEqual(point(f.chase.state), start);
  assert.equal(f.chase.outdoor([0, 0]), false);
  assert.ok(searches > 0 && searches <= 9, `Ten seconds should retry only at the 1.2 s cadence, observed ${searches} searches`);
});

test("edition/chase/population controls, reduced motion, modals, aerial mode and indoor shelter work independently", () => {
  const f = fixture(), visitor = pose(); f.chase.update(0.05, enabled, visitor, context);
  for (const patch of [{ halloween: false }, { halloweenChase: false }, { population: false }]) {
    const before = point(f.chase.state); f.chase.update(0.05, { ...enabled, ...patch }, visitor, context);
    assert.equal(f.chase.state.visible, false); assert.deepEqual(point(f.chase.state), before);
    f.chase.update(0, enabled, visitor, context);
  }
  for (const [settings, options, target] of [[{ ...enabled, reducedMotion: true }, context, visitor], [enabled, { ...context, paused: true }, visitor], [enabled, { ...context, mode: "aerial" }, visitor], [enabled, { ...context, indoor: true }, visitor], [enabled, context, pose(0, 0, 0, 4)]]) {
    const before = { ...f.chase.state.position }; f.chase.update(20, settings, target, options);
    assert.deepEqual(f.chase.state.position, before); assert.equal(f.chase.state.moving, false);
  }
  const before = point(f.chase.state); f.chase.update(60, enabled, visitor, context);
  assert.ok(Math.hypot(f.chase.state.position.x - before[0], f.chase.state.position.z - before[1]) <= 0.12 + 1e-8, "Long frame stalls cannot teleport the actor");
});

test("chase toggles reuse one model, freeze its pose and keep it clear of the camera", () => {
  const f = fixture(), visual = createHalloweenChase(f.data, [], f.collision, f.routes), visitor = pose();
  try {
    visual.update(0.05, enabled, visitor, context);
    let meshes = 0; visual.group.traverse((object) => { if (object.isMesh) meshes++; });
    const snapshot = () => { visual.group.updateMatrixWorld(true); const matrices = []; visual.group.traverse((object) => matrices.push([...object.matrixWorld.elements])); return matrices; };
    const before = snapshot(); visual.update(0.05, { ...enabled, reducedMotion: true }, visitor, context); assert.deepEqual(snapshot(), before);
    for (let i = 0; i < 100; i++) {
      visual.update(0, { ...enabled, halloweenChase: false }, visitor, context);
      visual.update(0, enabled, visitor, context);
    }
    let after = 0; visual.group.traverse((object) => { if (object.isMesh) after++; }); assert.equal(after, meshes);
    const p = visual.state.position;
    visual.update(0.05, enabled, visitor, { ...context, mode: "third", cameraPosition: { x: p.x, y: p.y + 1.5, z: p.z } });
    assert.equal(visual.group.visible, false, "The model cannot fill or clip the third-person camera");
  } finally { dispose(visual.group); }
});

test("reduced-motion fast travel synchronizes the rendered spawn while keeping animation frozen", () => {
  const f = fixture(), visual = createHalloweenChase(f.data, [], f.collision, f.routes);
  const settings = { ...enabled, reducedMotion: true };
  try {
    visual.update(0.05, enabled, pose(), context);
    const original = visual.group.position.clone(), spawns = visual.state.spawnCount;
    const limbPoses = visual.group.children.map((child) => child.rotation.toArray());
    visual.update(0.05, settings, pose(200), context);
    const p = visual.state.position;
    assert.equal(visual.state.spawnCount, spawns + 1);
    assert.equal(visual.group.visible, true);
    assert.ok(visual.group.position.distanceTo(original) > 100);
    assert.deepEqual(visual.group.position.toArray(), [p.x, p.y, p.z]);
    assert.deepEqual(visual.group.children.map((child) => child.rotation.toArray()), limbPoses);
    const position = visual.group.position.clone(), rotation = visual.group.rotation.toArray();
    for (let i = 0; i < 30; i++) visual.update(0.05, settings, pose(200), context);
    assert.deepEqual(visual.group.position, position);
    assert.deepEqual(visual.group.rotation.toArray(), rotation);
  } finally { dispose(visual.group); }
});
