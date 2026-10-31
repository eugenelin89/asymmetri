import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";

const { gatewayAnchor, gatewaySpawn, gatewayProvenance, initialGatewayPose, applyGatewayAnchors } =
  await import("./gateway-layout.ts");
const { buildGatewayLetters } = await import("./gateway-model.ts");
const { createCollision, createRoutes, global, local, inPolygon, segmentDistance } =
  await import("./spatial.ts");
const { architectureEnvelope, buildArchitecture } = await import("./architecture.ts");
const { buildStadium } = await import("./stadium.ts");
const { buildResidence } = await import("./residence.ts");
const { orchardAnchor } = await import("./residence-layout.ts");
const data = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url)));
const sourceAnchors = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/anchors.json", import.meta.url)));
const expansionAnchors = JSON.parse(readFileSync(new URL("./data/expansion-anchors.json", import.meta.url)));

function gatewayInterior(model) {
  return {
    anchor: gatewayAnchor,
    colliders: model.colliders,
    floors: [],
    ramps: [],
    entry: local(gatewaySpawn, gatewayAnchor),
  };
}

function dispose(group) {
  const materials = new Set(), textures = new Set();
  group.traverse((o) => {
    o.geometry?.dispose();
    for (const m of o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []) {
      materials.add(m);
      for (const value of Object.values(m)) if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());
}

test("gateway base and arrival stand within pinned pedestrian paving, clear of roads and source buildings", () => {
  const pad = data.surfaces.find((s) => s.id === gatewayProvenance.sourcePadId);
  assert.equal(pad?.kind, "Pedestrian");
  const model = buildGatewayLetters();
  const plinth = model.group.getObjectByName("gateway-concrete-plinth");
  plinth.geometry.computeBoundingBox();
  const bounds = plinth.geometry.boundingBox;
  const corners = [bounds.min.x, bounds.max.x].flatMap((x) =>
    [bounds.min.z, bounds.max.z].map((z) => global([x, z], gatewayAnchor)),
  );
  for (const p of [...corners, gatewaySpawn]) {
    assert.ok(inPolygon(p, pad.rings), `Outside source pedestrian paving: ${p}`);
    assert.ok(!data.surfaces.some((s) => /road|parking|drive/i.test(s.kind) && inPolygon(p, s.rings)), `Road placement: ${p}`);
    assert.ok(!data.buildings.some((b) => inPolygon(p, b.rings)), `Building placement: ${p}`);
  }
  const clearance = Math.min(...pad.rings.flatMap((ring) =>
    ring.slice(1).map((b, i) => segmentDistance(gatewaySpawn, ring[i], b)),
  ));
  assert.ok(clearance > 1, "Visitor starts more than a metre inside the source pedestrian island");
  const referenceDistance = Math.hypot(gatewayAnchor.x - gatewayProvenance.referencePinLocal[0], gatewayAnchor.z - gatewayProvenance.referencePinLocal[1]);
  assert.ok(referenceDistance < 5, "Model remains near the published UBC Letters map pin");
  dispose(model.group);
});

test("gateway arrival faces the real 3D letters and frames their full width at a portrait phone viewport", () => {
  const model = buildGatewayLetters();
  model.group.position.set(gatewayAnchor.x, 0, gatewayAnchor.z);
  model.group.rotation.y = gatewayAnchor.yaw;
  model.group.updateMatrixWorld(true);
  const pose = initialGatewayPose();
  const camera = new THREE.PerspectiveCamera(62, 390 / 844, 0.08, 6500);
  camera.position.set(pose.x, pose.y + 1.68, pose.z);
  camera.rotation.set(pose.pitch, pose.yaw, 0, "YXZ");
  camera.updateMatrixWorld(true);
  const hit = new THREE.Raycaster();
  hit.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = hit.intersectObject(model.group, true);
  assert.ok(hits.some((h) => h.object.name.startsWith("gateway-letter-")), "Initial view looks directly at a letter, not away toward the old stadium spawn");
  assert.ok(hits[0].distance > 8 && hits[0].distance < 15);
  for (const mesh of model.group.children.filter((o) => o.name.startsWith("gateway-letter-"))) {
    const positions = mesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const p = new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).project(camera);
      assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && p.z > -1 && p.z < 1, "Letters fit the initial portrait view");
    }
  }
  const before = structuredClone(sourceAnchors);
  const overlay = applyGatewayAnchors(sourceAnchors);
  assert.deepEqual(sourceAnchors, before, "Overlay preserves immutable source anchors");
  assert.deepEqual(overlay[gatewayAnchor.id].entry, gatewaySpawn);
  assert.equal(overlay.spawn.yaw, pose.yaw);
  overlay[gatewayAnchor.id].entry[0] += 1;
  assert.equal(gatewayAnchor.entry[0], gatewaySpawn[0], "Returned entry is not shared mutable placement state");
  dispose(model.group);
});

test("gateway blocks walking through the letters but permits walking around the landmark", () => {
  const model = buildGatewayLetters();
  const collision = createCollision(data, [gatewayInterior(model)], new Set());
  assert.equal(collision.blocked(gatewaySpawn, 0), false);
  assert.equal(collision.blocked([gatewayAnchor.x, gatewayAnchor.z], 0), true);
  let point = global([0, 4], gatewayAnchor);
  let pose = { x: point[0], z: point[1], y: 0, yaw: 0, pitch: 0 };
  const behind = global([0, -4], gatewayAnchor);
  const blocked = collision.move(pose, behind[0] - pose.x, behind[1] - pose.z);
  assert.ok(Math.hypot(blocked.x - behind[0], blocked.z - behind[1]) > 3, "Cannot tunnel through the solid base");
  for (const p of [[4.4, 4], [4.4, -4], [-4.4, -4], [-4.4, 4], [0, 4]]) {
    point = global(p, gatewayAnchor);
    pose = collision.move(pose, point[0] - pose.x, point[1] - pose.z);
    assert.ok(Math.hypot(pose.x - point[0], pose.z - point[1]) < 0.06, "Walk-around route is clear");
  }
  dispose(model.group);
});

test("gateway arrival retains walkable source-route connections to all existing main public interiors and stadium", () => {
  const anchors = applyGatewayAnchors({ ...structuredClone(sourceAnchors), ...structuredClone(expansionAnchors) });
  const kinds = ["rose", "bookstore", "nest", "sauder", "hennings", "war-memorial"];
  const models = [];
  const interiors = kinds.map((kind) => {
    anchors[kind] = architectureEnvelope(kind, anchors[kind]);
    const a = anchors[kind];
    const model = buildArchitecture(kind, a.width, a.depth, data.buildings.find((b) => b.id === a.buildingId).height);
    models.push(model.group);
    a.entry = global(model.entry, a);
    return { anchor: a, ...model };
  });
  const stadium = buildStadium();
  models.push(stadium.group);
  anchors.stadium.entry = global(stadium.entry, anchors.stadium);
  interiors.push({ anchor: anchors.stadium, ...stadium });
  const gateway = buildGatewayLetters();
  models.push(gateway.group);
  interiors.push(gatewayInterior(gateway));
  const orchard = buildResidence();
  const orchardGeography = JSON.parse(readFileSync(new URL("../../public/ubc/orchard-v0.2-2026-10-31/geography.json", import.meta.url)));
  const orchardRings = orchardGeography.footprintParts.map((part) =>
    part.rings.map((ring) => ring.map((p) => local(p, orchardAnchor))),
  );
  anchors.orchard = { ...orchardAnchor };
  models.push(orchard.group);
  interiors.push({ anchor: anchors.orchard, ...orchard });
  interiors.push({
    anchor: { ...orchardAnchor, id: "orchard-exterior", width: 220, depth: 180 },
    colliders: [], floors: [], ramps: [], entry: [0, 12],
    dynamicBlocked(p) {
      if (Math.abs(p[0]) <= 17.9 && Math.abs(p[1]) <= 8.9) return false;
      if (Math.abs(p[0]) <= 1.6 && p[1] >= 8.7 && p[1] <= 12.3) return false;
      return orchardRings.some((rings) => inPolygon(p, rings));
    },
  });
  const excluded = new Set([
    ...kinds.map((k) => anchors[k].buildingId),
    ...orchardGeography.footprintParts.map((part) => part.id),
  ]);
  const collision = createCollision(data, interiors, excluded);
  const routes = createRoutes(data, collision.blocked);
  for (const kind of [...kinds, "stadium", "orchard"]) {
    const path = routes.find(gatewaySpawn, anchors[kind].entry);
    assert.ok(path && path.length > 1, `Source route from entrance to ${kind}`);
    let pose = initialGatewayPose();
    for (const p of path) {
      pose = collision.move(pose, p[0] - pose.x, p[1] - pose.z);
      assert.ok(Math.hypot(pose.x - p[0], pose.z - p[1]) < 0.06, `Continuous walkable route to ${kind}`);
    }
    assert.equal(collision.blocked(anchors[kind].entry, 0), false, `${kind} arrival remains clear`);
  }
  models.forEach(dispose);
});
