import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";

const { createHalloween, halloweenInteriors } = await import("./halloween.ts");
const { buildArchitecture, architectureEnvelope } = await import("./architecture.ts");
const { buildResidence } = await import("./residence.ts");
const { orchardAnchor } = await import("./residence-layout.ts");
const { beatyAnchor } = await import("./beaty-layout.ts");
const { applyGatewayAnchors, gatewayAnchor, gatewaySpawn } = await import("./gateway-layout.ts");
const { buildGatewayLetters } = await import("./gateway-model.ts");
const { createCollision, floorAt, inPolygon, local, segmentDistance } = await import("./spatial.ts");
const { defaults } = await import("./environment.ts");
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url)));
const data = read("../../public/ubc/v0.1-2026-10-30/data.json");
const anchors = applyGatewayAnchors({ ...read("../../public/ubc/v0.1-2026-10-30/anchors.json"), ...read("./data/expansion-anchors.json"), orchard: orchardAnchor, beaty: beatyAnchor });
const interiors = halloweenInteriors.map((id) => {
  anchors[id] = id === "orchard" ? anchors[id] : architectureEnvelope(id, anchors[id]);
  const a = anchors[id], architecture = id === "orchard" ? buildResidence() : buildArchitecture(id, a.width, a.depth);
  return { anchor: a, ...architecture };
});
const gateway = buildGatewayLetters();
interiors.push({ anchor: gatewayAnchor, colliders: gateway.colliders, floors: [], ramps: [], entry: [0, 0], group: gateway.group });
const orchard = read("../../public/ubc/orchard-v0.2-2026-10-31/geography.json");
const collision = createCollision(data, interiors, new Set([...interiors.map((i) => i.anchor.buildingId), ...orchard.footprintParts.map((p) => p.id)]));
const baseline = JSON.stringify({ data, anchors, interiors: interiors.map(({ anchor, floors, ramps, colliders }) => ({ anchor, floors, ramps, colliders })) });
const enabled = { ...defaults, halloween: true, population: true, reducedMotion: false };
const poseAt = (point) => ({ x: point[0], z: point[1], y: 0 });
const groups = interiors.map((i) => i.group);
function overlay(blocked = collision.blocked) {
  const value = createHalloween(data, anchors, interiors, blocked);
  groups.push(value.group); return value;
}
function matrices(value) {
  return value.group.children.map((mesh) => Array.from(mesh.instanceMatrix.array));
}
function actors(value) {
  return value.monsters.map((m) => ({ point: [...m.point], distance: m.distance, direction: m.direction, pause: m.pause }));
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
  assert.ok(h.monsters.length >= 12);
  for (const [i, m] of h.monsters.entries()) {
    const route = data.routes.find((r) => r.id === m.routeId);
    assert.ok(route.points.some((p, n) => n && JSON.stringify([route.points[n - 1], p]) === JSON.stringify(m.route)));
    for (const other of h.monsters.slice(i + 1)) assert.ok(Math.hypot(m.point[0] - other.point[0], m.point[1] - other.point[1]) >= 24);
    for (let n = 0; n <= 12; n++) {
      const p = [m.route[0][0] + (m.route[1][0] - m.route[0][0]) * n / 12, m.route[0][1] + (m.route[1][1] - m.route[0][1]) * n / 12];
      assert.equal(collision.blocked(p, 0), false);
      assert.equal(data.buildings.some((b) => inPolygon(p, b.rings)), false);
    }
  }
  const first = h.monsters[0], start = [...first.point];
  for (let n = 0; n < 240; n++) {
    const before = [...first.point];
    h.update(0.1, enabled, poseAt([first.point[0] + 8, first.point[1]]));
    assert.ok(Math.hypot(first.point[0] - before[0], first.point[1] - before[1]) <= first.speed * 0.1 + 1e-8);
    assert.ok(segmentDistance(first.point, ...first.route) < 1e-8);
    assert.equal(collision.blocked(first.point, 0), false);
  }
  assert.ok(Math.hypot(first.point[0] - start[0], first.point[1] - start[1]) > 1, "Creatures actually roam");
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
  for (const mesh of h.group.children.filter((m) => /roaming|sprites|creatures/.test(m.name))) {
    for (let i = 0; i < mesh.count; i++) { mesh.getMatrixAt(i, matrix); scale.setFromMatrixScale(matrix); assert.equal(scale.length(), 0); }
  }
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
  assert.equal(h.group.children.length, 6, "All interior decor and roaming figures use six instanced draws");
  for (const mesh of h.group.children) {
    assert.ok(mesh.isInstancedMesh);
    assert.ok(Array.from(mesh.geometry.attributes.position.array).every(Number.isFinite));
  }
  const childCount = h.group.children.length;
  for (let i = 0; i < 20; i++) h.update(0, { ...enabled, halloween: !!(i % 2) }, poseAt(point));
  assert.equal(h.group.children.length, childCount, "Repeated toggles create no new render objects");
  assert.equal(JSON.stringify({ data, anchors, interiors: interiors.map(({ anchor, floors, ramps, colliders }) => ({ anchor, floors, ramps, colliders })) }), baseline, "Normal source data and collisions are unchanged");
});
