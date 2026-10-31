import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";
const { createTraffic, alongPath, transit } = await import("./traffic.ts");
const { createActivities, arcPoint } = await import("./activities.ts");
const { createPeople } = await import("./people.ts");
const { extendGeography } = await import("./extensions.ts");
const { normalizeAppearance, defaultAppearance } =
  await import("./appearance.ts");
const { createVisitor } = await import("./follow-camera.ts");
const data = extendGeography(
  JSON.parse(
    readFileSync(
      new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url),
    ),
  ),
);
const anchors = {
  ...JSON.parse(
    readFileSync(
      new URL("../../public/ubc/v0.1-2026-10-30/anchors.json", import.meta.url),
    ),
  ),
  ...JSON.parse(
    readFileSync(new URL("./data/expansion-anchors.json", import.meta.url)),
  ),
};
function dispose(g) {
  g.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) o.material.dispose();
  });
}
test("traffic follows directed source routes and freezes for reduced motion and nearby visitor", () => {
  assert.deepEqual([...new Set(transit.routes.map((r) => r.number))].sort(), [
    "25",
    "33",
    "49",
  ]);
  for (const name of [
    "West 16th Avenue",
    "West 10th Avenue",
    "Wesbrook Mall",
    "East Mall",
  ])
    assert.ok(data.roads.some((r) => r.name === name));
  const t = createTraffic(data),
    a = t.actors.find((a) => a.bus);
  const before = a.distance;
  t.update(1 / 30, [10000, 10000], 12, true, true);
  assert.equal(a.distance, before);
  t.update(1 / 30, [10000, 10000], 12, true, false);
  assert.ok(a.distance > before);
  const p = alongPath(a.points, a.distance),
    stop = a.distance;
  t.update(1 / 30, [p.x, p.z], 12, true, false);
  assert.equal(a.distance, stop);
  assert.ok(
    a.model.passengers.children.length > 0,
    "batched seated passenger geometry exists",
  );
  assert.deepEqual(
    alongPath(
      [
        [0, 0],
        [10, 0],
      ],
      5,
      1,
    ),
    { x: 5, z: -1, yaw: Math.PI / 2 },
  );
  dispose(t.group);
});
test("sports trajectories land correctly; activities stay finite and reduced motion holds positions", () => {
  const a = new THREE.Vector3(0, 1, 0),
    b = new THREE.Vector3(10, 2, 0);
  assert.deepEqual(arcPoint(a, b, 0, 3), a);
  assert.deepEqual(arcPoint(a, b, 1, 3), b);
  assert.ok(arcPoint(a, b, 0.5, 3).y > 4);
  const activity = createActivities(data, anchors, () => false);
  assert.ok(activity.animals.length > 0);
  assert.ok(activity.cyclists.length > 0);
  for (const point of [
    [anchors.stadium.x, anchors.stadium.z],
    [anchors.nest.x, anchors.nest.z],
    [anchors["war-memorial"].x, anchors["war-memorial"].z],
  ])
    for (let i = 0; i < 30; i++) activity.update(1 / 30, point, true, false);
  const before = activity.animals.map((a) => a.model.position.clone());
  activity.update(1 / 30, [0, 0], true, true);
  activity.animals.forEach((a, i) =>
    assert.deepEqual(a.model.position, before[i]),
  );
  activity.group.traverse((o) =>
    assert.ok(
      [...o.position, ...o.scale, ...o.quaternion].every(Number.isFinite),
    ),
  );
  dispose(activity.group);
});
test("streamed faculty and athletes stay bounded and do not leak identity labels", () => {
  const p = createPeople(data, anchors, () => false);
  for (const zone of [
    "hennings",
    "stadium",
    "computer-science",
    "war-memorial",
  ]) {
    const a = anchors[zone];
    for (let i = 0; i < 60; i++)
      p.update(1 / 30, i / 30, [a.x, a.z], 12, true, null, false);
    assert.ok(p.actors.filter((a) => a.named).length <= 26);
    assert.ok(p.actors.filter((a) => a.named).length > 3);
    for (const actor of p.actors)
      assert.ok(
        !actor.group.children.some((c) => c.isSprite),
        "No floating person name labels",
      );
  }
  dispose(p.group);
});
test("untrusted saved appearance normalizes safely and replacement preserves visitor pose", () => {
  assert.deepEqual(
    normalizeAppearance({
      skin: "url(javascript:bad)",
      presentation: "Unknown",
    }),
    defaultAppearance,
  );
  const v = createVisitor();
  v.update({ x: 4, z: 9, y: 3.4, yaw: 1, pitch: 0 }, 0, true, false);
  const pose = v.group.position.clone();
  v.appearance({ ...defaultAppearance, hairstyle: "Long", footwear: "Boots" });
  assert.deepEqual(v.group.position, pose);
  dispose(v.group);
});
