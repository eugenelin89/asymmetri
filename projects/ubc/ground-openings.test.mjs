import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import "./test-loader.mjs";

const { subtractGroundOpenings } = await import("./ground-openings.ts");
const { floorAt, createCollision, global } = await import("./spatial.ts");
const { buildLandscape } = await import("./scenery.ts");
const empty = {
  origin: [0, 0], buildings: [], surfaces: [], trees: [], routes: [], entrances: [],
};
const anchor = { id: "lower-level", x: 90, z: -70, width: 30, depth: 12, yaw: 0.7 };
const rectangle = (x, z, width, depth, yaw = 0) => {
  const frame = { ...anchor, x, z, yaw };
  return [[-width / 2, -depth / 2], [width / 2, -depth / 2],
    [width / 2, depth / 2], [-width / 2, depth / 2]].map((p) => global(p, frame));
};
const plane = (width = 40, depth = 40) =>
  new THREE.PlaneGeometry(width, depth).rotateX(-Math.PI / 2);
function area(geometry) {
  const p = geometry.getAttribute("position"), index = geometry.index;
  let total = 0;
  for (let i = 0; i < (index?.count ?? p.count); i += 3) {
    const [a, b, c] = [0, 1, 2].map((j) => index ? index.getX(i + j) : i + j);
    total += Math.abs((p.getX(b) - p.getX(a)) * (p.getZ(c) - p.getZ(a)) -
      (p.getZ(b) - p.getZ(a)) * (p.getX(c) - p.getX(a))) / 2;
  }
  return total;
}
function hits(object, x, z) {
  object.updateMatrixWorld(true);
  return new THREE.Raycaster(new THREE.Vector3(x, 10, z), new THREE.Vector3(0, -1, 0))
    .intersectObject(object, true).length;
}
function dispose(group) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const value of [...geometries, ...materials, ...textures]) value.dispose();
}

test("explicit lower floors beat the implicit ground, with ramp priority and outdoor fallback", () => {
  const interior = {
    anchor, colliders: [], entry: [-11, 0],
    floors: [
      { minX: 0, maxX: 9, minZ: -4, maxZ: 4, y: -3.4 },
      { minX: 3, maxX: 5, minZ: -4, maxZ: 4, y: -2 },
      { minX: 3, maxX: 5, minZ: -4, maxZ: 4, y: 3 },
    ],
    ramps: [{ minX: -10, maxX: 0, minZ: -1.2, maxZ: 1.2, fromY: 0, toY: -3.4, axis: "x" }],
  };
  assert.equal(floorAt(global([2, 0], anchor), -3.4, [interior]), -3.4);
  assert.equal(floorAt(global([4, 0], anchor), -2, [interior]), -2);
  assert.equal(floorAt(global([4, 0], anchor), -3.4, [interior]), -3.4);
  assert.equal(floorAt(global([4, 0], anchor), 3, [interior]), 3);
  assert.equal(floorAt(global([12, 0], anchor), -3.4, [interior]), 0);
  assert.equal(floorAt(global([12, 0], anchor), 0, [interior]), 0);
  assert.ok(Math.abs(floorAt(global([-5, 0], anchor), -1.7, [interior]) + 1.7) < 1e-12);
});

test("collision movement descends below grade, crosses the lower floor and climbs back outside", () => {
  const interior = {
    anchor, entry: [-11, 0],
    colliders: [
      { minX: -10, maxX: 9, minZ: -1.8, maxZ: -1.5, minY: -3.4, maxY: 2 },
      { minX: -10, maxX: 9, minZ: 1.5, maxZ: 1.8, minY: -3.4, maxY: 2 },
    ],
    floors: [{ minX: 0, maxX: 9, minZ: -1.5, maxZ: 1.5, y: -3.4 }],
    ramps: [{ minX: -10, maxX: 0, minZ: -1.5, maxZ: 1.5, fromY: 0, toY: -3.4, axis: "x" }],
  };
  const collision = createCollision(empty, [interior], new Set()),
    start = global([-11, 0], anchor);
  let pose = { x: start[0], z: start[1], y: 0, yaw: 0, pitch: 0 };
  function walkTo(localPoint, expectedY) {
    const [x, z] = global(localPoint, anchor);
    for (let i = 0; i < 500 && Math.hypot(x - pose.x, z - pose.z) > 0.01; i++) {
      const distance = Math.hypot(x - pose.x, z - pose.z), step = Math.min(0.12, distance), previousY = pose.y;
      pose = collision.move(pose, (x - pose.x) * step / distance, (z - pose.z) * step / distance);
      assert.ok(Math.abs(pose.y - previousY) <= 0.1, "No jump between ground and lower-level floor");
    }
    assert.ok(Math.hypot(x - pose.x, z - pose.z) < 0.02, `Reached ${localPoint}`);
    assert.ok(Math.abs(pose.y - expectedY) < 0.02, `Standing at ${expectedY}m`);
  }
  walkTo([-5, 0], -1.7);
  walkTo([1, 0], -3.4);
  walkTo([8, 0], -3.4);
  assert.ok(collision.blocked(global([8, 1.5], anchor), pose.y), "Below-grade walls retain collision");
  walkTo([1, 0], -3.4);
  walkTo([-5, 0], -1.7);
  walkTo([-11, 0], 0);
});

test("rotated openings remove exact area without removing nearby ground or corrupting texture coordinates", () => {
  const original = plane(), originalPositions = Array.from(original.attributes.position.array),
    opening = rectangle(1, -2, 13.2, 25.3, 0.61), savedOpening = JSON.stringify(opening),
    cut = subtractGroundOpenings(original, [opening]);
  assert.ok(Math.abs(area(cut) - (1600 - 13.2 * 25.3)) < 0.001);
  assert.deepEqual(Array.from(original.attributes.position.array), originalPositions);
  assert.equal(JSON.stringify(opening), savedOpening);
  const mesh = new THREE.Mesh(cut, new THREE.MeshBasicMaterial());
  assert.equal(hits(mesh, 1, -2), 0, "Opening is transparent through all triangles");
  const frame = { ...anchor, x: 1, z: -2, yaw: 0.61 };
  for (const localPoint of [[0, -12.8], [0, 12.8], [-6.75, 0], [6.75, 0]]) {
    const [x, z] = global(localPoint, frame);
    assert.ok(hits(mesh, x, z) > 0, "Ground immediately outside each opening edge survives");
  }
  const p = cut.attributes.position, uv = cut.attributes.uv, normal = cut.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    assert.ok(Math.abs(uv.getX(i) - (p.getX(i) / 40 + 0.5)) < 1e-6);
    assert.ok(Math.abs(uv.getY(i) - (0.5 - p.getZ(i) / 40)) < 1e-6);
    assert.ok(normal.getY(i) > 0.999, "Ground lighting still faces upward");
  }
  dispose(mesh); original.dispose();
});

test("multiple openings, closed clockwise rings and contained source surfaces clip correctly", () => {
  const original = plane(20, 20), a = rectangle(0, 0, 6, 4), b = rectangle(3, 0, 6, 4).reverse();
  b.push(b[0]);
  const cut = subtractGroundOpenings(original, [a, b]);
  assert.ok(Math.abs(area(cut) - (400 - 36)) < 1e-6, "Overlapping holes subtract their union once");
  const small = plane(2, 2), emptyCut = subtractGroundOpenings(small, [a]);
  assert.equal(emptyCut.attributes.position.count, 0);
  const distant = subtractGroundOpenings(original, [rectangle(100, 100, 4, 4)]);
  assert.equal(area(distant), area(original));
  assert.throws(() => subtractGroundOpenings(original, [[[0, 0], [4, 0], [1, 1], [4, 4], [0, 4]]]), /convex/);
  for (const geometry of [original, cut, small, emptyCut, distant]) geometry.dispose();
});

test("landscape carves both ground and source paving while preserving adjacent surfaces and source records", () => {
  // Canvas is used only to construct material textures; geometry is tested with
  // actual Three meshes and rays, without needing a browser or WebGL renderer.
  const previousDocument = globalThis.document;
  globalThis.document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => ({
      createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      putImageData() {}, fillRect() {},
    }) }),
  };
  const data = { ...empty, surfaces: [
    { id: "crossing-paving", kind: "Pedestrian", rings: [rectangle(0, 0, 30, 70)] },
    { id: "adjacent-lawn", kind: "Lawn", rings: [rectangle(30, 0, 12, 12)] },
  ] }, snapshot = JSON.stringify(data);
  let scene, baseline;
  try {
    scene = buildLandscape(data, new Set(), [rectangle(0, 0, 13.2, 55.3, 0.15)]);
    baseline = buildLandscape(data, new Set());
    assert.equal(hits(scene.group, 0, 0), 0, "Both the campus base and source paving are open");
    assert.ok(hits(baseline.group, 0, 0) > 0, "Omitting openings retains the original landscape");
    assert.ok(hits(scene.group, 10, 0) >= 2, "Nearby paving and underlying ground both survive");
    assert.ok(hits(scene.group, 30, 0) >= 2, "Adjacent lawn remains above the base");
    assert.equal(JSON.stringify(data), snapshot, "Immutable source records are untouched");
  } finally {
    if (scene) dispose(scene.group);
    if (baseline) dispose(baseline.group);
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
