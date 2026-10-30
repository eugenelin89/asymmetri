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

const v2Directory = new URL("../../public/vancouver/v0.2-2026-10-30/", import.meta.url);
const v2Bytes = readFileSync(new URL("city.json", v2Directory));
const v2 = JSON.parse(v2Bytes), v2Manifest = JSON.parse(readFileSync(new URL("manifest.json", v2Directory)));
const { createDrivingWorld, carFits } = await import("./physics.ts");
const world = createDrivingWorld(v2);
test("V0.2 preserves its published parent and records bounded road-clearance changes", () => {
  assert.equal(v2Manifest.refinement.parentSha256, createHash("sha256").update(bytes).digest("hex"));
  assert.equal(createHash("sha256").update(v2Bytes).digest("hex"), v2Manifest.sha256);
  assert.equal(v2Bytes.length, v2Manifest.bytes); assert.ok(v2Bytes.length < 350000);
  assert.equal(v2.version, "v0.2-2026-10-30"); assert.equal(v2.refinement.trimmedBuildings, 24);
  assert.ok(v2.refinement.trimmedAreaM2 < 4000); assert.ok(v2.buildings.length >= city.buildings.length * .98);
  assert.ok(v2.buildings.every((b) => b.heightMethod === "illustrative"));
  assert.deepEqual(v2Manifest.sources, manifest.sources);
});
test("every landmark has a full-body-valid start with at least 30m of forward travel", () => {
  for (const [id, point] of Object.entries(v2.anchors)) {
    const start = world.spawnNear(point); let car = { ...start };
    assert.ok(carFits(start, world.allowed), id);
    for (let i = 0; i < 240; i++) car = stepCar(car, 1, 0, false, 1/60, world.allowed);
    assert.ok(Math.hypot(car.x - start.x, car.z - start.z) >= 30, id);
    assert.ok(carFits(car, world.allowed), id);
  }
});
test("landward road centres remain clear for the whole car after footprint trimming", () => {
  const land = (p) => v2.land.some((g) => inPolygon(p, g)) && !v2.water.some((g) => inPolygon(p, g));
  let checked = 0;
  for (const road of v2.roads.filter((r) => !r.bridge)) for (let i = 1; i < road.points.length; i++) {
    const a = road.points[i - 1], b = road.points[i], dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
    for (let distance = 5; distance < length - 5; distance += 5) {
      const pose = { x: a[0] + dx * distance / length, z: a[1] + dz * distance / length, yaw: Math.atan2(dx, dz) };
      if (!carFits(pose, land)) continue;
      assert.ok(carFits(pose, world.allowed), road.name + " " + JSON.stringify(pose)); checked++;
    }
  }
  assert.ok(checked > 3500);
});
test("water, buildings, map edges and bridge-only water spans reject a car", () => {
  for (const p of [[-73, 0],[-1200, 0],[0, 900]]) assert.equal(world.allowed(p), false);
  let rejected = 0;
  for (const b of v2.buildings) {
    const ring = b.shape[0], p = [ring.reduce((s,v)=>s+v[0],0)/ring.length, ring.reduce((s,v)=>s+v[1],0)/ring.length];
    if (inPolygon(p,b.shape)) { assert.equal(world.allowed(p),false); rejected++; }
  }
  assert.ok(rejected > 200);
});
test("opposite throttle brakes before reversing and steering follows travel direction", () => {
  const open = () => true; const start = { x:0,z:0,yaw:0,speed:10,steer:0 };
  let car = stepCar(start,-1,0,false,.05,open); assert.ok(car.speed >= 0 && car.speed < 10);
  for (let i=0;i<150;i++)car=stepCar(car,-1,0,false,1/60,open);
  assert.ok(car.speed < -2 && car.speed >= -5.5);
  const left=stepCar(start,1,1,false,.05,open), right=stepCar(start,1,-1,false,.05,open);
  assert.ok(left.yaw > 0 && right.yaw < 0);
  const reverseLeft=stepCar({...start,speed:-3},-1,1,false,.05,open);assert.ok(reverseLeft.yaw < 0);
});
test("full-length body clearance stops before a wall and prevents high-speed tunnelling", () => {
  let car={x:0,z:0,yaw:0,speed:19};const allowed=([x,z])=>Math.abs(x)<20 && z<8;
  for(let i=0;i<80;i++)car=stepCar(car,1,0,false,.05,allowed);
  assert.ok(car.z < 6 && car.z > 4);assert.equal(car.speed,0);assert.ok(car.blocked);
  assert.equal(carFits({x:0,z:7,yaw:0},allowed),false);
});
test("steering, drag and acceleration remain close across 30Hz and 60Hz frames", () => {
  function run(dt){let car={x:0,z:0,yaw:0,speed:0};for(let t=0;t<3-dt/2;t+=dt)car=stepCar(car,1,.3,false,dt,()=>true);return car;}
  const a=run(1/30),b=run(1/60);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<1);assert.ok(Math.abs(a.yaw-b.yaw)<.08);
});
