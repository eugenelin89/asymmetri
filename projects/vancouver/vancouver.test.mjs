import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { inPolygon, segmentDistance, stepCar } from "./physics.ts";

const rectangle = [[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]];
test("polygon holes remain navigable courtyards rather than solid buildings", () => {
  const courtyard = [...rectangle, [[-2,-2],[2,-2],[2,2],[-2,2],[-2,-2]]];
  assert.equal(inPolygon([5, 0], courtyard), true);
  assert.equal(inPolygon([0, 0], courtyard), false);
  assert.equal(inPolygon([20, 0], courtyard), false);
});
test("street distance handles endpoints and degenerate segments", () => {
  assert.equal(segmentDistance([5, 3], [0, 0], [10, 0]), 3);
  assert.equal(segmentDistance([13, 4], [0, 0], [10, 0]), 5);
  assert.equal(segmentDistance([3, 4], [0, 0], [0, 0]), 5);
});
test("driving accelerates, reverses, brakes and rejects a blocked corridor", () => {
  const allowed = (point) => inPolygon(point, rectangle);
  let car = { x: 0, z: 0, yaw: 0, speed: 0 };
  for (let i = 0; i < 300; i++) car = stepCar(car, 1, 0, false, 1/60, allowed);
  assert.ok(car.z > 5 && car.z < 9); assert.equal(car.speed, 0);
  const reversed = stepCar(car, -1, 0, false, .05, allowed);
  assert.ok(reversed.z < car.z);
  const moving = { x: 0, z: 0, yaw: 0, speed: 10 };
  assert.ok(stepCar(moving, 0, 0, true, .05, allowed).speed < stepCar(moving, 0, 0, false, .05, allowed).speed);
});
test("long frame gaps cannot teleport through obstacles", () => {
  const car = stepCar({ x: 0, z: 0, yaw: 0, speed: 22 }, 1, 0, false, 20, () => true);
  assert.ok(car.z < 1.2);
});
const directory = new URL("../../public/vancouver/v0.1-2026-10-30/", import.meta.url);
const bytes = readFileSync(new URL("city.json", directory));
const city = JSON.parse(bytes), manifest = JSON.parse(readFileSync(new URL("manifest.json", directory)));
test("the published geographic snapshot matches its provenance manifest", () => {
  assert.equal(createHash("sha256").update(bytes).digest("hex"), manifest.sha256);
  assert.equal(bytes.length, manifest.bytes); assert.ok(bytes.length < 300000);
  assert.equal(manifest.sources.length, 4); assert.ok(manifest.attribution.includes("Open Government Licence"));
  assert.ok(city.buildings.length > 400 && city.buildings.length < 600);
  assert.ok(city.buildings.every((b) => b.heightMethod === "illustrative"));
});
test("False Creek is water while the southern street network remains land", () => {
  assert.ok(city.water.some((p) => inPolygon([-73, 0], p)));
  assert.ok(city.land.some((p) => inPolygon([0, 350], p)));
  assert.equal(city.water.some((p) => inPolygon([0, 350], p)), false);
});
