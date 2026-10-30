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
  assert.ok(car.z <= 1.91);
  const stopped = stepCar({ x: 0, z: 0, yaw: 0, speed: 19 }, 1, 0, false, 20, ([,z]) => z < 3 || z > 3.3);
  assert.ok(stopped.z < 1 && stopped.blocked);
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


const v3Directory = new URL("../../public/vancouver/v0.3-2026-10-30/", import.meta.url);
const v3Bytes = readFileSync(new URL("city.json", v3Directory));
const v3 = JSON.parse(v3Bytes), v3Manifest = JSON.parse(readFileSync(new URL("manifest.json", v3Directory)));
const v3World = createDrivingWorld(v3);
const { createNavigator, cruiseInput, pointAt, projectRoute } = await import("./navigation.ts");
const navigator = createNavigator(v3, (pose) => carFits(pose, v3World.allowed));
test("V0.3 preserves published snapshots and building geometry, pins bounded height provenance", () => {
  assert.equal(v3Manifest.navigationRefinement.parentSha256, v2Manifest.sha256);
  assert.equal(createHash("sha256").update(v3Bytes).digest("hex"), v3Manifest.sha256);
  assert.equal(v3Bytes.length,v3Manifest.bytes); assert.ok(v3Bytes.length<550000);
  assert.deepEqual(v3.buildings.map(b=>b.shape),v2.buildings.map(b=>b.shape));
  const measured=v3.buildings.filter(b=>b.heightSource);
  assert.equal(measured.length,v3.heightRefinement.matchedBuildings); assert.ok(measured.length>100);
  assert.ok(measured.every(b=>b.heightSource.intersectionOverUnion>=.8 && b.height>=3 && b.height<=150 && b.heightMethod.includes("2009")));
  assert.equal(v3.sources.length,5); assert.equal(v3.sources[4].records,915);
  assert.ok(v3.navigationRefinement.endpointRepairs.every(r=>r.metres<.75));
  assert.equal(v3.navigationRefinement.bridgeDriving,false);
  assert.ok(v3.graph.edges.some(e=>e.length>2 && e.length<3),"retain the short Ontario / 1st Ave junction connector");
});
test("tiled collision matches the visible pavement, including exact spatial-bin seams", () => {
  let checked=0;
  for(let x=-832;x<850;x+=16)for(let z=-576;z<610;z+=16){
    const p=[x,z],visible=v3.pavement.some(poly=>inPolygon(p,poly));
    assert.equal(v3World.allowed(p),visible,JSON.stringify(p));checked++;
  }
  assert.ok(checked>7000);
  for(const p of [[-73,0],[-1200,0],[0,900]])assert.equal(v3World.allowed(p),false);
  for(const b of v3.buildings){const r=b.shape[0],p=[r.reduce((s,v)=>s+v[0],0)/r.length,r.reduce((s,v)=>s+v[1],0)/r.length];if(inPolygon(p,b.shape))assert.equal(v3World.allowed(p),false);}
});
test("blocked feedback persists at rest and nearby recovery restores a clear forward run", () => {
  let car={x:0,z:0,yaw:0,speed:19}; const allowed=([,z])=>z<8;
  for(let i=0;i<100;i++)car=stepCar(car,1,0,false,1/60,allowed);
  assert.ok(car.blocked);
  car=stepCar(car,0,0,false,1/60,allowed);assert.ok(car.blocked);
  car=stepCar(car,-1,0,false,.1,allowed);assert.equal(car.blocked,false);
  for(const anchor of Object.values(v3.anchors)){
    const start=v3World.spawnNear(anchor),recovered=v3World.recoverNear({...start,yaw:start.yaw+.7,blocked:true});
    assert.ok(Math.hypot(recovered.x-start.x,recovered.z-start.z)<35);
    assert.ok(carFits(recovered,v3World.allowed));let moving=recovered;
    for(let i=0;i<150;i++)moving=stepCar(moving,1,0,false,1/60,v3World.allowed);
    assert.ok(!moving.blocked && Math.hypot(moving.x-recovered.x,moving.z-recovered.z)>8);
  }
});
for(const reverse of [false,true])for(const hz of [15,30,60,120])test(`scenic loop ${reverse?"reverse":"forward"} completes and crosses its seam at ${hz}Hz without collision`,()=>{
  const route=navigator.scenic(reverse),first=pointAt(route,0),ahead=pointAt(route,3);
  assert.ok(route.length>2300 && route.length<2450);
  let car={x:first[0],z:first[1],yaw:Math.atan2(ahead[0]-first[0],ahead[1]-first[1]),speed:0},progress=0,laps=0,maxDeviation=0,travelled=0;
  for(let tick=0;tick<260*hz;tick++){
    const projection=projectRoute(route,[car.x,car.z],progress);progress=projection.progress;maxDeviation=Math.max(maxDeviation,projection.distance);
    if(progress>route.length-.5 && projection.distance<8){progress=0;laps++;}
    const input=cruiseInput(car,route,progress),prior=car;
    car=stepCar(car,input.throttle,input.steering,input.brake,1/hz,v3World.allowed);
    travelled+=Math.hypot(car.x-prior.x,car.z-prior.z);
    assert.ok(!car.blocked,JSON.stringify({tick,progress,car}));
    if(laps && progress>100)break;
  }
  assert.equal(laps,1);assert.ok(progress>100);assert.ok(maxDeviation<2);assert.ok(travelled>route.length);
});
test("all six destinations route from the scenic start to safe roadside stops",()=>{
  const start=navigator.scenic().points[0];
  for(const [id,anchor]of Object.entries(v3.anchors)){
    const route=navigator.navigate(start,id,id);assert.equal(route.destination,id);assert.equal(route.loop,false);
    assert.ok(route.length>10 && route.length<4000);const end=pointAt(route,route.length);
    assert.ok(v3World.allowed(end),id);assert.ok(Math.hypot(end[0]-anchor[0],end[1]-anchor[1])<230,id);
    assert.ok(route.turns.every(t=>t.at>=0 && t.at<=route.length));
    for(let d=0;d<route.length;d+=2){const p=pointAt(route,d),q=pointAt(route,Math.min(route.length,d+1));assert.ok(carFits({x:p[0],z:p[1],yaw:Math.atan2(q[0]-p[0],q[1]-p[1])},v3World.allowed),id+" "+d);}
  }
});
