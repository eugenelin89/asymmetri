import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";

const { buildArchitecture } = await import("./architecture.ts");
const { beatyAnchor: anchor, beatyGroundOpening } = await import("./beaty-layout.ts");
const { createCollision, global, local, inPolygon, segmentDistance } = await import("./spatial.ts");
const { buildLandscape } = await import("./scenery.ts");
const source = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url)));
const footprint = source.buildings.find((building) => building.id === "VBL10086");

function fixture() {
  const architecture = buildArchitecture("beaty", anchor.width, anchor.depth, footprint.height);
  const collision = createCollision(source, [{ anchor, ...architecture }], new Set(["VBL10086"]));
  const entry = global(architecture.entry, anchor);
  return { architecture, collision, pose: { x: entry[0], z: entry[1], y: 0, yaw: 0, pitch: 0 } };
}
function dispose(group) {
  const resources = new Set();
  group.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.dispose();
}
function walkTo(f, target, expectedY) {
  const [x, z] = global(target, anchor);
  for (let i = 0; i < 2000 && Math.hypot(x - f.pose.x, z - f.pose.z) > 0.015; i++) {
    const distance = Math.hypot(x - f.pose.x, z - f.pose.z), step = Math.min(0.09, distance), oldY = f.pose.y;
    f.pose = f.collision.move(f.pose, (x - f.pose.x) * step / distance, (z - f.pose.z) * step / distance);
    assert.ok(Math.abs(f.pose.y - oldY) < 0.1, "Ramp transitions change height continuously");
    assert.equal(f.collision.blocked([f.pose.x, f.pose.z], f.pose.y), false, "Visitor remains clear of architectural and source-building collision");
  }
  assert.ok(Math.hypot(x - f.pose.x, z - f.pose.z) < 0.025,
    `Reached local ${target}; actual ${local([f.pose.x, f.pose.z], anchor)}`);
  assert.ok(Math.abs(f.pose.y - expectedY) < 0.02, `Reached floor ${expectedY}, actual ${f.pose.y}`);
}

test("Beaty pavilion follows the pinned thin Main Mall footprint, with a clear northern entrance", () => {
  assert.ok(footprint);
  assert.equal(footprint.address, "2212 Main Mall");
  assert.equal(anchor.buildingId, footprint.id);
  assert.ok(inPolygon([anchor.x, anchor.z], footprint.rings));
  for (const vertex of footprint.rings[0]) {
    const [x, z] = local(vertex, anchor);
    assert.ok(Math.abs(Math.abs(x) - anchor.width / 2) < 0.15, "Pavilion width matches the source corners");
    assert.ok(Math.abs(Math.abs(z) - anchor.depth / 2) < 0.15, "Long axis and ends match the source corners");
  }
  const f = fixture();
  try {
    const entrance = global(f.architecture.entry, anchor);
    assert.ok(entrance[1] < anchor.z - 20, "Public entrance is at the pavilion's geographic north end");
    assert.equal(inPolygon(entrance, footprint.rings), false, "Arrival starts outside the wall");
    assert.equal(f.collision.blocked(entrance, 0), false);
    walkTo(f, [0, 24], 0);
    assert.equal(inPolygon([f.pose.x, f.pose.z], footprint.rings), true, "Walked through the doorway into the real footprint");
  } finally { dispose(f.architecture.group); }
});

test("Beaty's original 26 m suspended skeleton has finite geometry and stays within its pavilion", () => {
  const f = fixture();
  try {
    const whale = f.architecture.group.getObjectByName("beaty-blue-whale-skeleton");
    assert.ok(whale);
    const bounds = new THREE.Box3().setFromObject(whale), size = bounds.getSize(new THREE.Vector3());
    assert.ok(Math.abs(size.z - 26) < 0.002, "Rendered specimen length, rather than metadata alone, is 26 m");
    assert.ok(size.x > 4 && size.x < anchor.width - 1, "Ribs and flippers fit inside the pavilion");
    assert.ok(bounds.min.y > -1 && bounds.max.y < 5.6, "Skeleton hangs above the lower visitor floor and below the roof");
    assert.ok(bounds.min.z > -anchor.depth / 2 && bounds.max.z < anchor.depth / 2);
    for (const name of ["skull", "mandibles", "vertebrae", "ribs", "flippers"]) {
      const part = whale.getObjectByName(`whale-${name}`);
      assert.ok(part?.geometry?.attributes.position.count > 0, `${name} has rendered 3D geometry`);
    }
    whale.traverse((mesh) => {
      if (!mesh.geometry) return;
      for (const name of ["position", "normal"])
        assert.ok(Array.from(mesh.geometry.attributes[name].array).every(Number.isFinite), `${mesh.name} ${name} is finite`);
    });
  } finally { dispose(f.architecture.group); }
});

test("visitors on sourced Main Mall paving can see the skeleton through pavilion glazing", () => {
  const f = fixture();
  try {
    const eyeLocal = [26, 4], eyeWorld = global(eyeLocal, anchor);
    const paving = source.surfaces.find((surface) => surface.id === "LSHARD_TYPE-692-8");
    assert.equal(paving?.kind, "Pedestrian");
    assert.ok(inPolygon(eyeWorld, paving.rings));
    const mallDistance = Math.min(...source.roads.filter((road) => road.name === "Main Mall")
      .flatMap((road) => road.points.slice(1).map((p, i) => segmentDistance(eyeWorld, road.points[i], p))));
    assert.ok(mallDistance < 2, "Viewpoint is on the source Main Mall alignment");
    f.architecture.group.updateMatrixWorld(true);
    const whale = f.architecture.group.getObjectByName("beaty-blue-whale-skeleton"),
      eye = new THREE.Vector3(eyeLocal[0], 1.68, eyeLocal[1]), visibleParts = new Set();
    let visibleSamples = 0, samples = 0;
    for (const part of whale.children) {
      const position = part.geometry.attributes.position;
      for (let i = 0; i < position.count; i += Math.max(1, Math.floor(position.count / 35))) {
        const target = new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(part.matrixWorld),
          ray = new THREE.Raycaster(eye, target.clone().sub(eye).normalize(), 0, eye.distanceTo(target) + 0.03),
          hits = ray.intersectObject(f.architecture.group, true),
          opaque = hits.find((hit) => !hit.object.material?.transparent);
        samples++;
        if (!opaque?.object.name.startsWith("whale-")) continue;
        assert.ok(hits.some((hit) => hit.distance < opaque.distance && hit.object.material?.transparent),
          "The exterior sightline crosses real transparent glazing");
        visibleSamples++;
        visibleParts.add(opaque.object.name);
      }
    }
    assert.ok(visibleSamples / samples > 0.5, "Most sampled skeleton sightlines are clear of opaque architectural obstructions");
    for (const part of ["skull", "mandibles", "vertebrae", "ribs", "flippers"])
      assert.ok(visibleParts.has(`whale-${part}`), `Visible ${part} from Main Mall`);
  } finally { dispose(f.architecture.group); }
});

test("Beaty visitor enters, descends both ramps, explores the whale atrium and collections, and walks back outside", () => {
  const f = fixture();
  const route = [
    [[0, 24], 0], [[5.34, 23], 0], [[5.34, -16], -1.7],
    [[3.45, -16], -1.7], [[3.45, 22], -3.4], [[0, 22], -3.4],
    [[0, 8], -3.4], [[-15, 8], -3.4],
  ];
  try {
    for (const [point, floor] of route) walkTo(f, point, floor);
    assert.ok(f.architecture.displays.some((display) => display.id === "beaty-collections" && display.y < 0));
    for (const [point, floor] of route.slice(0, -1).reverse()) walkTo(f, point, floor);
    walkTo(f, f.architecture.entry, 0);
    assert.equal(inPolygon([f.pose.x, f.pose.z], footprint.rings), false);
  } finally { dispose(f.architecture.group); }
});

test("Beaty's first ramp permits walking on both sides of its centre without hitting columns", () => {
  for (const x of [5.1, 5.6]) {
    const f = fixture();
    try {
      walkTo(f, [0, 24], 0);
      walkTo(f, [x, 23], 0);
      // These offset walking lines pass every structural column, including the
      // former pinch at z=12/0/−12. They exercise the visitor's collision radius,
      // not just a ray or a precisely centred path down the ramp.
      for (let z = 20; z >= -15; z -= 0.5)
        walkTo(f, [x, z], -1.7 * (21 - z) / 36);
      for (let z = -14.5; z <= 20; z += 0.5)
        walkTo(f, [x, z], -1.7 * (21 - z) / 36);
      walkTo(f, [x, 23], 0);
      walkTo(f, [0, 24], 0);
      walkTo(f, f.architecture.entry, 0);
    } finally { dispose(f.architecture.group); }
  }
});

test("source terrain and paving do not seal the below-grade whale atrium", () => {
  const priorDocument = globalThis.document;
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ({
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {}, fillRect() {}, fillText() {},
  }) }) };
  const near = source.surfaces.filter((surface) => surface.rings[0].some((p) => Math.hypot(p[0] - anchor.x, p[1] - anchor.z) < 100));
  const snapshot = JSON.stringify(near), f = fixture();
  let landscape;
  try {
    landscape = buildLandscape({ ...source, buildings: [], trees: [], roads: [], surfaces: near }, new Set(), [beatyGroundOpening]);
    landscape.group.updateMatrixWorld(true);
    f.architecture.group.position.set(anchor.x, 0, anchor.z);
    f.architecture.group.rotation.y = anchor.yaw;
    f.architecture.group.updateMatrixWorld(true);
    for (const point of [[0, -8], [0, 0], [0, 8], [-3, 10]]) {
      const [x, z] = global(point, anchor), ray = new THREE.Raycaster(new THREE.Vector3(x, 0.1, z), new THREE.Vector3(0, -1, 0), 0, 1);
      assert.equal(ray.intersectObject(landscape.group, true).length, 0, `No base or sourced paving seals the atrium at ${point}`);
      ray.set(new THREE.Vector3(x, -1, z), new THREE.Vector3(0, -1, 0)); ray.far = 4;
      const floor = ray.intersectObject(f.architecture.group, true)[0];
      assert.ok(floor && Math.abs(floor.point.y + 3.4) < 0.02, "Actual rendered lower floor supports the open atrium");
    }
    const [x, z] = global([10, 0], anchor), outside = new THREE.Raycaster(new THREE.Vector3(x, 1, z), new THREE.Vector3(0, -1, 0), 0, 2);
    assert.ok(outside.intersectObject(landscape.group, true).length > 0, "Adjacent landscape is retained");
    assert.equal(JSON.stringify(near), snapshot, "Pinned source surfaces stay immutable");
  } finally {
    if (landscape) dispose(landscape.group);
    dispose(f.architecture.group);
    if (priorDocument === undefined) delete globalThis.document; else globalThis.document = priorDocument;
  }
});
