import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { resolveMapDestination, walkingGuidance } = await import("./wayfinding.ts");
const pose = (x, z, yaw = 0, y = 0) => ({ x, z, yaw, y, pitch: 0 });

test("map destinations reject unsafe, distant and nonfinite spots without altering source nodes", () => {
  const nodes = [[0, 0], [5, 0], [10, 10]], before = structuredClone(nodes);
  assert.deepEqual(resolveMapDestination([1, 0], nodes, p => p[0] !== 0), [5, 0]);
  assert.equal(resolveMapDestination([500, 500], nodes, () => true), null);
  assert.equal(resolveMapDestination([NaN, 0], nodes, () => true), null);
  assert.equal(resolveMapDestination([0, 0], nodes, () => false), null);
  const selected = resolveMapDestination([0, 0], nodes, () => true); selected[0] = 999;
  assert.deepEqual(nodes, before);
});
test("GPS remaining distance follows route corners and grows when walking backwards", () => {
  const route = [[0, 0], [0, -20], [20, -20]];
  const a = walkingGuidance(pose(0, 0), route, "Library", false);
  const b = walkingGuidance(pose(0, -10), route, "Library", false);
  const c = walkingGuidance(pose(10, -20, -Math.PI / 2), route, "Library", false);
  assert.equal(a.distance, 40); assert.equal(b.distance, 30); assert.equal(c.distance, 10);
  assert.equal(a.turn, 0); assert.equal(c.turn, 0);
  assert.ok(walkingGuidance(pose(0, -18), route, "Library", false).turn > 0, "Turn right at the corner");
  assert.equal(a.status, 'following');
  assert.equal(walkingGuidance(pose(0, -5), route, "Library", false).distance, 35);
});
test("GPS distinguishes off-route, arrival and indoor exit guidance", () => {
  const route = [[0, 0], [0, -20]];
  const off = walkingGuidance(pose(25, -10), route, 'Destination', false);
  assert.equal(off.status, 'off-route'); assert.ok(off.turn < 0);
  assert.equal(walkingGuidance(pose(0, -19), route, 'Destination', false).status, 'arrived');
  assert.equal(walkingGuidance(pose(0, -19, 0, 3.4), route, 'Destination', true).status, 'exit-building');
  assert.equal(walkingGuidance(pose(0, 0), [], 'Destination', false), null);
  assert.equal(walkingGuidance(pose(0, 0), [[0, -10]], 'Destination', false).distance, 10);
});
