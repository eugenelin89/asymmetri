import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "../ubc/test-loader.mjs";

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const load = (campus, name) => import(new URL(`../${campus}/${name}.ts`, import.meta.url));

async function walkCampus(campus, destination, landmarks) {
  const version = campus === "ubc" ? "v0.1-2026-10-30" : "v0.1-2026-10-31";
  const dir = `../../public/${campus}/${version}/`;
  const data = json(dir + "data.json"), anchors = json(dir + "anchors.json");
  const { buildArchitecture, architectureEnvelope, usesFootprintContext } = await load(campus, "architecture");
  const { createCollision, global, local } = await load(campus, "spatial");
  const { footInput, walkSpeed } = await load(campus, "navigation");
  const interiors = [], excluded = new Set();
  let arrival;
  if (campus === "ubc") {
    Object.assign(anchors, json("../ubc/data/expansion-anchors.json"));
    const { gatewayAnchor, initialGatewayPose } = await load("ubc", "gateway-layout");
    const { buildGatewayLetters } = await load("ubc", "gateway-model");
    interiors.push({ anchor: gatewayAnchor, colliders: buildGatewayLetters().colliders, floors: [], ramps: [], entry: [0, 0] });
    arrival = initialGatewayPose();
  }
  for (const id of landmarks) {
    const a = anchors[id] = architectureEnvelope(id, anchors[id]);
    const source = data.buildings.find(b => b.id === a.buildingId);
    const model = buildArchitecture(id, a.width, a.depth, source.height);
    excluded.add(a.buildingId);
    a.connectedBuildingIds?.forEach(id => excluded.add(id));
    interiors.push({ anchor: a, ...model });
    let entry = model.entry;
    if (campus !== "ubc" && (!usesFootprintContext || usesFootprintContext(id))) {
      const { buildFootprintContext } = await load(campus, "footprint-context");
      const context = buildFootprintContext(source, a, id === "main-quad" ? data.buildings.filter(b => b.id === anchors["memorial-church"].buildingId) : []);
      interiors.push(context.interior);
      entry = context.entry;
    }
    a.entry = global(entry, a);
  }
  if (!arrival) arrival = (await load(campus, "layout")).initialCampusPose(anchors);
  const collision = createCollision(data, interiors, excluded);
  const { createChristmasWalk } = await import("./christmas-scenery.ts");
  const { christmasWalks } = await import("./christmas-walks.ts");
  const decor = createChristmasWalk(campus, anchors, collision.blocked);
  const a = anchors[destination], checkpoints = christmasWalks[campus].path;
  const scene = new THREE.Scene();
  scene.add(decor.group);
  function displaysFrom(point, yaw) {
    scene.updateMatrixWorld(true);
    const objects = [];
    decor.group.traverseVisible(object => { if (object.isMesh) objects.push(object); });
    const origin = new THREE.Vector3(point[0], 1.65, point[1]);
    for (let angle = -.54; angle <= .55; angle += .04) {
      for (const pitch of [0, .14, .28]) {
        const direction = new THREE.Vector3(-Math.sin(yaw + angle), pitch, -Math.cos(yaw + angle)).normalize();
        if (new THREE.Raycaster(origin, direction, .15, 32).intersectObjects(objects, false).length) return true;
      }
    }
    return false;
  }
  const start = [arrival.x, arrival.z];
  decor.update(false, .55, false);
  assert.equal(displaysFrom(start, arrival.yaw), false, "Ordinary arrival");
  decor.update(true, .55, false);
  assert.ok(displaysFrom(start, arrival.yaw), "Seasonal display in the initial daytime view");

  // Sweep the visible seasonal geometry as well as the explorer's architectural collision.
  // The renderer does not add solid walls for decorations. A branch or pole crossing
  // the walk at chest height would otherwise look obstructed while still allowing movement.
  const obstacles = [];
  decor.group.traverseVisible(object => { if (object.isMesh) obstacles.push(object); });
  let pose = arrival;
  const goals = checkpoints;
  for (const [x, z] of goals) {
    const distance = Math.hypot(x - pose.x, z - pose.z);
    if (distance < .005) continue;
    const direction = new THREE.Vector3(x - pose.x, 0, z - pose.z).normalize();
    for (const shoulder of [-.27, 0, .27]) {
      const start = new THREE.Vector3(pose.x - direction.z * shoulder, 1.4, pose.z + direction.x * shoulder);
      const hits = new THREE.Raycaster(start, direction, 0, distance).intersectObjects(obstacles, false);
      assert.equal(hits.length, 0, `Scenery intersects the walk towards ${x}, ${z}`);
    }
    pose.yaw = Math.atan2(pose.x - x, pose.z - z);
    const count = Math.ceil(distance / (.1 * walkSpeed));
    for (let frame = 0; frame < count; frame++) {
      const { dx, dz } = footInput(pose, ["w"], distance / (count * walkSpeed));
      pose = collision.move(pose, dx, dz);
    }
    assert.ok(Math.hypot(pose.x - x, pose.z - z) < .07, `Walking stops before ${x}, ${z} at ${pose.x}, ${pose.z}`);
  }
  assert.ok(local([pose.x, pose.z], a)[1] <= a.depth / 2 - 5.9, "Arrived inside the furnished core");
  for (const [altitude, low] of [[.55, false], [.01, true], [-.3, true]]) {
    decor.update(true, altitude, low);
    assert.ok(displaysFrom([pose.x, pose.z], a.yaw), "Decor visible from inside at this light and quality");
  }
  decor.update(false, -.3, true);
  assert.equal(displaysFrom([pose.x, pose.z], a.yaw), false, "Returning to Regular removes the display");
  decor.dispose();
}

test("walk from the decorated Gateway into the AMS Nest atrium", () =>
  walkCampus("ubc", "nest", ["nest", "bookstore", "war-memorial"]));

test("walk from the Oval through Main Quad into Green Library", () =>
  walkCampus("stanford", "green-library", ["main-quad", "green-library", "bing-wing", "memorial-church"]));

test("walk from Kelvin Smith Library into the decorated Tinkham Veale commons", () =>
  walkCampus("cwru", "tinkham-veale", ["kelvin-smith", "tinkham-veale"]));
