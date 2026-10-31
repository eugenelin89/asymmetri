import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";

const { createHalloween, halloweenInteriors, halloweenMonsterKinds, halloweenPopulationLimits } = await import("./halloween.ts");
const { buildArchitecture, architectureEnvelope } = await import("./architecture.ts");
const { buildResidence } = await import("./residence.ts");
const { buildStadium } = await import("./stadium.ts");
const { createAthletics } = await import("./athletics.ts");
const { athleticsAnchors } = await import("./athletics-layout.ts");
const { extendGeography } = await import("./extensions.ts");
const { orchardAnchor } = await import("./residence-layout.ts");
const { beatyAnchor } = await import("./beaty-layout.ts");
const { applyGatewayAnchors, gatewayAnchor, gatewaySpawn } = await import("./gateway-layout.ts");
const { buildGatewayLetters } = await import("./gateway-model.ts");
const { createCollision, floorAt, inPolygon, local, segmentDistance } = await import("./spatial.ts");
const { defaults } = await import("./environment.ts");
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url)));
const data = extendGeography(read("../../public/ubc/v0.1-2026-10-30/data.json"));
const anchors = applyGatewayAnchors({ ...read("../../public/ubc/v0.1-2026-10-30/anchors.json"), ...read("./data/expansion-anchors.json"), orchard: orchardAnchor, beaty: beatyAnchor, ...athleticsAnchors });
const interiors = halloweenInteriors.map((id) => {
  anchors[id] = id === "orchard" ? anchors[id] : architectureEnvelope(id, anchors[id]);
  const a = anchors[id], architecture = id === "orchard" ? buildResidence() : buildArchitecture(id, a.width, a.depth);
  return { anchor: a, ...architecture };
});
const gateway = buildGatewayLetters();
interiors.push({ anchor: gatewayAnchor, colliders: gateway.colliders, floors: [], ramps: [], entry: [0, 0], group: gateway.group });
const orchard = read("../../public/ubc/orchard-v0.2-2026-10-31/geography.json");
const stadium = buildStadium();
interiors.push({ anchor: anchors.stadium, ...stadium });
const athletics = createAthletics(data, anchors, (p, y) => collision.blocked(p, y));
interiors.push(...athletics.interiors);
const collision = createCollision(data, interiors, new Set([...interiors.map((i) => i.anchor.buildingId), ...orchard.footprintParts.map((p) => p.id)]));
const baseline = JSON.stringify({ data, anchors, interiors: interiors.map(({ anchor, floors, ramps, colliders }) => ({ anchor, floors, ramps, colliders })) });
const enabled = { ...defaults, halloween: true, population: true, reducedMotion: false };
const poseAt = (point) => ({ x: point[0], z: point[1], y: 0 });
const groups = [...interiors.map((i) => i.group).filter(Boolean), athletics.group];
function overlay(blocked = collision.blocked) {
  const value = createHalloween(data, anchors, interiors, blocked);
  groups.push(value.group); return value;
}
function matrices(value) {
  return value.group.children.map((mesh) => ({ count: mesh.count, matrices: Array.from(mesh.instanceMatrix.array) }));
}
function actors(value) {
  return value.monsters.map((m) => ({ point: [...m.point], distance: m.distance, direction: m.direction, pause: m.pause, stride: m.stride }));
}
after(() => {
  const resources = new Set();
  for (const group of groups) group.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.dispose();
});

test("Halloween decor reaches all nine actual interiors with standing room away from doors and stairs", () => {
  const h = overlay();
  assert.equal(h.decorations.length, 29, "Existing dispersed interior decoration coverage is preserved");
  assert.deepEqual([...new Set(h.decorations.map((d) => d.building))].sort(), [...halloweenInteriors].sort());
  for (const id of halloweenInteriors) {
    const sets = h.decorations.filter((d) => d.building === id);
    assert.ok(sets.length >= 2 && sets.length <= 4, `${id} has several sparse decoration sets`);
    for (const [index, first] of sets.entries()) for (const second of sets.slice(index + 1))
      assert.ok(Math.abs(first.y - second.y) >= 2.8 || Math.hypot(first.point[0] - second.point[0], first.point[1] - second.point[1]) >= 8,
        `${id} decorations are dispersed instead of clustering at its entrance`);
  }
  for (const [id, minimum] of [["beaty", 2], ["nest", 3], ["irving", 4], ["orchard", 2]])
    assert.ok(new Set(h.decorations.filter((d) => d.building === id).map((d) => Math.round(d.y * 2))).size >= minimum,
      `${id} decorations extend across supported floors`);
  for (const d of h.decorations) {
    const interior = interiors.find((i) => i.anchor.id === d.building), q = local(d.point, interior.anchor);
    assert.equal(floorAt(d.point, d.y, interiors), d.y);
    assert.ok(Math.hypot(q[0] - interior.entry[0], q[1] - interior.entry[1]) >= 3.3);
    for (let n = 0; n < 12; n++) {
      const p = [d.point[0] + Math.cos(n * Math.PI / 6) * 0.6, d.point[1] + Math.sin(n * Math.PI / 6) * 0.6];
      assert.equal(collision.blocked(p, d.y), false, `${d.building} pumpkin clearance`);
      assert.equal(collision.blocked(p, d.y + 0.9), false, `${d.building} ghost clearance`);
    }
    assert.equal(interior.floors.some((f) => f.y > d.y + 0.1 && f.y < d.y + 2.7 && q[0] >= f.minX && q[0] <= f.maxX && q[1] >= f.minZ && q[1] <= f.maxZ), false);
  }
  assert.equal(h.group.children.find((m) => m.name === "halloween-interior-ghosts").count, h.decorations.length);
  assert.equal(h.group.children.find((m) => m.name === "halloween-interior-cobwebs").count, h.decorations.length);
});

test("gateway opening has two glowing pumpkins on clear pedestrian paving and a nearby route creature", () => {
  const h = overlay(), pad = data.surfaces.find((s) => s.id === "LSHARD_TYPE-642-0");
  assert.equal(h.gatewayPumpkins.length, 2);
  for (const point of h.gatewayPumpkins) {
    assert.ok(inPolygon(point, pad.rings));
    assert.equal(collision.blocked(point, 0), false);
    assert.ok(Math.hypot(point[0] - gatewaySpawn[0], point[1] - gatewaySpawn[1]) > 7, "Spawn walking space remains open");
  }
  assert.ok(h.monsters.some((m) => Math.hypot(m.point[0] - gatewaySpawn[0], m.point[1] - gatewaySpawn[1]) < 100));
  assert.ok(h.group.children.find((m) => m.name === "halloween-pumpkins").material.emissiveIntensity > 0);
});

test("roaming creatures follow real clear source paths, remain outdoors and start naturally spaced", () => {
  const h = overlay();
  assert.ok(h.monsters.length >= 60 && h.monsters.length <= 90, "Dozens of actors fit the actual source routes without crowding");
  assert.deepEqual([...new Set(h.monsters.map((m) => m.kind))].sort(), [...halloweenMonsterKinds].sort());
  for (const kind of halloweenMonsterKinds) assert.ok(h.monsters.filter((m) => m.kind === kind).length >= 10, `${kind} has a useful campus population`);
  for (const [i, m] of h.monsters.entries()) {
    const route = data.routes.find((r) => r.id === m.routeId);
    assert.ok(route.points.some((p, n) => n && JSON.stringify([route.points[n - 1], p]) === JSON.stringify(m.route)));
    for (const other of h.monsters.slice(i + 1)) assert.ok(Math.hypot(m.point[0] - other.point[0], m.point[1] - other.point[1]) >= 18, "Every initial position is naturally spaced");
    for (let n = 0; n <= 12; n++) {
      const p = [m.route[0][0] + (m.route[1][0] - m.route[0][0]) * n / 12, m.route[0][1] + (m.route[1][1] - m.route[0][1]) * n / 12];
      assert.equal(collision.blocked(p, 0), false);
      assert.equal(floorAt(p, 0, interiors), 0, "Outdoor actors stay on the source path's ground floor");
      const dx = (m.route[1][0] - m.route[0][0]) / m.length, dz = (m.route[1][1] - m.route[0][1]) / m.length;
      for (const sign of [-1, 1]) assert.equal(collision.blocked([p[0] - dz * 0.55 * sign, p[1] + dx * 0.55 * sign], 0), false, "Wide shoulders/capes have clearance");
      assert.equal(data.buildings.some((b) => inPolygon(p, b.rings)), false);
    }
  }
  assert.ok(h.monsters.filter((m) => Math.hypot(m.point[0] - gatewaySpawn[0], m.point[1] - gatewaySpawn[1]) < 100).length <= 12, "The extra population is spread across campus rather than dumped at arrival");
  assert.ok(Math.max(...h.monsters.map((m) => m.point[0])) - Math.min(...h.monsters.map((m) => m.point[0])) > 500);
  assert.ok(Math.max(...h.monsters.map((m) => m.point[1])) - Math.min(...h.monsters.map((m) => m.point[1])) > 1000);
  const first = h.monsters[0], start = [...first.point];
  for (let n = 0; n < 240; n++) {
    const before = [...first.point];
    h.update(0.1, enabled, poseAt([first.point[0] + 8, first.point[1]]));
    assert.ok(Math.hypot(first.point[0] - before[0], first.point[1] - before[1]) <= first.speed * 0.1 + 1e-8);
    assert.ok(segmentDistance(first.point, ...first.route) < 1e-8);
    assert.equal(collision.blocked(first.point, 0), false);
  }
  assert.ok(Math.hypot(first.point[0] - start[0], first.point[1] - start[1]) > 1, "Creatures actually roam");
  for (const [i, actor] of h.monsters.entries()) for (const other of h.monsters.slice(i + 1))
    assert.ok(Math.hypot(actor.point[0] - other.point[0], actor.point[1] - other.point[1]) >= 2.1, "Passing actors remain separated after movement");
});

test("Halloween disabling and reduced motion freeze animation; population controls only roaming creatures", () => {
  const h = overlay(), point = h.decorations[0].point, pose = poseAt(point);
  assert.equal(h.group.visible, false);
  h.update(0.1, enabled, pose);
  const frozenActors = actors(h), frozenMatrices = matrices(h);
  h.update(15, { ...enabled, halloween: false }, pose);
  assert.equal(h.group.visible, false);
  assert.deepEqual(actors(h), frozenActors);
  assert.deepEqual(matrices(h), frozenMatrices);
  h.update(0, enabled, pose);
  assert.deepEqual(matrices(h), frozenMatrices, "Toggling does not reset or jump animations");
  h.update(15, { ...enabled, reducedMotion: true }, pose);
  assert.deepEqual(actors(h), frozenActors);
  assert.deepEqual(matrices(h), frozenMatrices);
  h.update(0.1, { ...enabled, population: false }, pose);
  assert.deepEqual(actors(h), frozenActors);
  const matrix = new THREE.Matrix4(), scale = new THREE.Vector3();
  h.group.children.find((m) => m.name === "halloween-pumpkins").getMatrixAt(0, matrix);
  scale.setFromMatrixScale(matrix); assert.ok(scale.x > 0, "Interior decorations stay visible without population");
  for (const mesh of h.group.children.filter((m) => /-(near|far|legs)$/.test(m.name))) assert.equal(mesh.count, 0, "Population off submits no monster geometry");
});

test("creatures yield to a nearby visitor and newly blocked paths; overlay stays additive and batched", () => {
  let block = false;
  const h = overlay((p, y) => block || collision.blocked(p, y)), actor = h.monsters[0];
  actor.pause = 0;
  const point = [...actor.point];
  h.update(0.1, enabled, poseAt(point));
  assert.deepEqual(actor.point, point, "Visitor proximity makes the creature wait");
  block = true;
  h.update(0.1, enabled, poseAt([point[0] + 8, point[1]]));
  assert.deepEqual(actor.point, point, "New obstacles prevent movement");
  assert.ok(h.group.children.length <= 20, "Distinct articulated species share a fixed batch count, not per-actor scene meshes");
  for (const mesh of h.group.children) {
    assert.ok(mesh.isInstancedMesh);
    assert.ok(Array.from(mesh.geometry.attributes.position.array).every(Number.isFinite));
  }
  const childCount = h.group.children.length;
  for (let i = 0; i < 20; i++) h.update(0, { ...enabled, halloween: !!(i % 2) }, poseAt(point));
  assert.equal(h.group.children.length, childCount, "Repeated toggles create no new render objects");
  assert.equal(JSON.stringify({ data, anchors, interiors: interiors.map(({ anchor, floors, ramps, colliders }) => ({ anchor, floors, ramps, colliders })) }), baseline, "Normal source data and collisions are unchanged");
});


test("six original silhouettes have finite distinct geometry, useful low-detail models and animated legs or hops", () => {
  const h = overlay(), matrix = new THREE.Matrix4(), scale = new THREE.Vector3();
  const signatures = new Set();
  let geometryBytes = 0;
  for (const kind of halloweenMonsterKinds) {
    const near = h.group.children.find((m) => m.name === `halloween-${kind}-near`);
    const far = h.group.children.find((m) => m.name === `halloween-${kind}-far`);
    near.geometry.computeBoundingBox();
    const bounds = near.geometry.boundingBox;
    signatures.add(JSON.stringify([bounds.min.toArray(), bounds.max.toArray(), near.geometry.attributes.position.count]));
    assert.ok(far.geometry.attributes.position.count < near.geometry.attributes.position.count, `${kind} far LOD reduces vertices`);
    for (const mesh of [near, far]) {
      assert.ok(Array.from(mesh.geometry.attributes.position.array).every(Number.isFinite));
      geometryBytes += Object.values(mesh.geometry.attributes).reduce((n, attribute) => n + attribute.array.byteLength, 0);
    }
    if (kind === "werewolf") assert.ok(bounds.max.y > 2.25, "Pointed ears extend above the wolf head");
    if (kind === "lizard") assert.ok(bounds.min.z < -0.8, "Tail makes the reptile silhouette unmistakable");
    if (kind === "jiangshi") assert.ok(bounds.max.z > 0.7, "The hopping figure's stiff arms reach forward");
    if (kind === "vampire") assert.ok(bounds.max.x - bounds.min.x >= 1.1, "A broad cape defines the vampire silhouette");
    const actor = h.monsters.find((m) => m.kind === kind); actor.pause = 0; actor.stride = 0;
    const pose = poseAt([actor.point[0] + 4, actor.point[1] + 4]);
    h.update(0, enabled, pose);
    const before = Array.from(near.instanceMatrix.array), stride = actor.stride;
    h.update(0.1, enabled, pose);
    assert.ok(actor.stride > stride, `${kind} actually advances on its route`);
    assert.notDeepEqual(Array.from(near.instanceMatrix.array), before, `${kind} model follows its simulated movement`);
    near.getMatrixAt(0, matrix); scale.setFromMatrixScale(matrix); assert.ok(scale.x > 0);
    if (kind === "jiangshi") {
      let actualHeight = -1;
      for (let i = 0; i < near.count; i++) {
        near.getMatrixAt(i, matrix);
        if (Math.hypot(matrix.elements[12] - actor.point[0], matrix.elements[14] - actor.point[1]) < 0.001) actualHeight = matrix.elements[13];
      }
      assert.ok(actualHeight > 0.04 && actualHeight < 0.23, "The rendered hopping figure rises above the path by a bounded amount");
    } else if (kind !== "ghost") {
      const legs = h.group.children.find((m) => m.name === `halloween-${kind}-legs`);
      let bentLegs = 0;
      for (let i = 0; i < legs.count; i++) {
        legs.getMatrixAt(i, matrix);
        if (Math.hypot(matrix.elements[12] - actor.point[0], matrix.elements[14] - actor.point[1]) < 0.2 && matrix.elements[5] < 0.9999) bentLegs++;
      }
      assert.equal(bentLegs, 2, `${kind} actually swings both rendered legs instead of sliding a rigid figure`);
    }
  }
  assert.equal(signatures.size, 6, "Species are geometrically distinct, not simple palette swaps");
  assert.ok(geometryBytes < 2_000_000, "Shared species geometry stays below two megabytes");
});

test("population uses compact near/far instance counts and bounded quality selection", (t) => {
  const h = overlay();
  const point = h.monsters[0].point;
  const geometries = [...new Set(h.group.children.map((mesh) => mesh.geometry))];
  t.diagnostic(JSON.stringify({ actors: h.monsters.length, kinds: Object.fromEntries(halloweenMonsterKinds.map((kind) => [kind, h.monsters.filter((m) => m.kind === kind).length])), batches: h.group.children.length,
    geometryBytes: geometries.reduce((total, g) => total + Object.values(g.attributes).reduce((n, attribute) => n + attribute.array.byteLength, 0), 0),
    nearTriangles: Object.fromEntries(halloweenMonsterKinds.map((kind) => [kind, h.group.children.filter((m) => m.name === `halloween-${kind}-near` || m.name === `halloween-${kind}-legs`).reduce((n, m) => n + m.geometry.attributes.position.count / 3 * (m.name.endsWith("legs") ? 2 : 1), 0)])),
    farTriangles: Object.fromEntries(halloweenMonsterKinds.map((kind) => [kind, h.group.children.find((m) => m.name === `halloween-${kind}-far`).geometry.attributes.position.count / 3])) }));
  const totals = () => h.group.children.filter((m) => /-(near|far)$/.test(m.name)).reduce((n, mesh) => n + mesh.count, 0);
  h.update(0, { ...enabled, quality: "ultra" }, poseAt(point));
  const ultra = totals();
  assert.ok(ultra > 0 && ultra <= halloweenPopulationLimits.ultra);
  assert.ok(h.group.children.some((m) => /-near$/.test(m.name) && m.count > 0), "Nearby detailed models are rendered");
  assert.ok(h.group.children.some((m) => /-far$/.test(m.name) && m.count > 0), "Distant silhouettes use the cheaper LOD");
  h.update(0, { ...enabled, quality: "low" }, poseAt(point));
  assert.ok(totals() <= halloweenPopulationLimits.low && totals() <= ultra);
  const original = [...h.group.children];
  for (let n = 0; n < 20; n++) h.update(0.1, { ...enabled, population: false }, poseAt(point));
  assert.equal(totals(), 0);
  h.update(0, enabled, poseAt(point));
  assert.ok(totals() > 0);
  assert.deepEqual(h.group.children, original, "Toggles reuse the same mesh/geometry/material identities");
  // A deliberately denser but still spaced path fixture makes every cap bind;
  // the real campus above may have fewer actors within the distance cutoff.
  const denseData = { ...data, buildings: [], surfaces: [], routes: Array.from({ length: 96 }, (_, i) => {
    const x = i % 8 * 28 - 98, z = Math.floor(i / 8) * 22 - 110;
    return { id: `clear-stress-path-${i}`, points: [[x - 10, z], [x + 10, z]] };
  }) };
  const denseAnchors = Object.fromEntries(Object.entries(anchors).map(([id, a]) => [id, { ...a, x: 0, z: 0 }]));
  const dense = createHalloween(denseData, denseAnchors, [], () => false); groups.push(dense.group);
  for (const [quality, expected] of [["low", 24], ["medium", 48], ["auto", 60], ["high", 72], ["ultra", 84]]) {
    dense.update(0, { ...enabled, quality }, poseAt([0, 0]));
    const submitted = dense.group.children.filter((m) => /-(near|far)$/.test(m.name)).reduce((n, mesh) => n + mesh.count, 0);
    assert.equal(submitted, expected, `${quality} enforces its population budget when enough clear routes are available`);
  }
});


test("same-floor proximity yields while a visitor on an upper floor does not stop the path below", () => {
  const h = overlay(), actor = h.monsters[0];
  actor.pause = 0;
  const point = [...actor.point];
  h.update(0.1, enabled, poseAt(point));
  assert.deepEqual(actor.point, point);
  h.update(0.1, enabled, { ...poseAt(point), y: 5 });
  assert.ok(Math.hypot(actor.point[0] - point[0], actor.point[1] - point[1]) > 0);
});
