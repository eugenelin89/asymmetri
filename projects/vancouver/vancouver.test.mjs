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

const v4Directory = new URL('../../public/vancouver/v0.4-2026-10-30/', import.meta.url);
const v4Bytes = readFileSync(new URL('city.json',v4Directory));
const v4 = JSON.parse(v4Bytes), v4Manifest = JSON.parse(readFileSync(new URL('manifest.json',v4Directory)));
const v4World = createDrivingWorld(v4), v4Nav = createNavigator(v4,p=>carFits(p,v4World.allowed));
test('V0.4 retains all old footprints/water and pins selective NRCan height evidence',()=>{
  assert.equal(v4Manifest.parentSha256,v3Manifest.sha256);
  assert.equal(createHash('sha256').update(v4Bytes).digest('hex'),v4Manifest.sha256);
  assert.equal(v4Bytes.length,v4Manifest.bytes);assert.ok(v4Bytes.length<600000);
  assert.deepEqual(v4.buildings.map(b=>b.shape),v3.buildings.map(b=>b.shape));
  assert.deepEqual(v4.water,v3.water);assert.deepEqual(v4.roads,v3.roads);
  const matches=v4.buildings.filter(b=>b.heightSource?.dataset==='nrcan-auto-building-opti-2');
  assert.equal(matches.length,18);
  for(const b of matches){assert.equal(b.heightSource.acquisitionStart,'20130207');assert.equal(b.heightSource.acquisitionEnd,'20130219');assert.equal(b.heightSource.qualityCode,23);assert.ok(b.heightSource.intersectionOverUnion>=.8);assert.equal(b.height,b.heightSource.heightMaxM);}
  assert.equal(v4.sources.at(-1).records,372);assert.ok(v4.sources.at(-1).downloadedBytes<16*1024*1024);
  assert.equal(v4.heightRefinement.counts.illustrative,316);
  assert.ok(v4.networkAudit.components[0].lengthM>21000);assert.ok(v4.networkAudit.addedPavementM2<4000);
});
test('V0.4 visible pavement, cells and exclusions agree throughout the map',()=>{
  const rendered=Object.values(v4.roadCells).flat();
  for(let x=-870;x<875;x+=12)for(let z=-615;z<615;z+=12){
    const p=[x,z],visible=rendered.some(poly=>inPolygon(p,poly));assert.equal(v4World.allowed(p),visible,JSON.stringify(p));
    if(visible!==v4.pavement.some(poly=>inPolygon(p,poly))) assert.ok(v4.pavement.some(poly=>poly.some(ring=>ring.slice(1).some((b,i)=>segmentDistance(p,ring[i],b)<.02))), 'only sub-centimetre clipping differences');
    if(visible){assert.ok(!v4.water.some(poly=>inPolygon(p,poly)));assert.ok(!v4.buildings.some(b=>inPolygon(p,b.shape)));}
  }
  for(const p of [[-73,0],[-274,100],[-1200,0],[0,900]])assert.equal(v4World.allowed(p),false);
});
for(const item of v4.drives)for(const reverse of [false,true])test(`${item.title} ${reverse?'reverse':'forward'} has continuous whole-car clearance beyond the loop`,()=>{
  const route=v4Nav.drive(item.id,reverse);assert.ok(route.length>650 && route.length<1250);assert.equal(route.loop,false);
  for(let d=0;d<route.length-1;d+=.75){const p=pointAt(route,d),q=pointAt(route,d+1);assert.ok(carFits({x:p[0],z:p[1],yaw:Math.atan2(q[0]-p[0],q[1]-p[1])},v4World.allowed),`${item.id} ${d}`);}
  const loop=v4Nav.scenic();let outside=0;
  for(let d=0;d<route.length;d+=5)if(projectRoute(loop,pointAt(route,d)).distance>20)outside+=5;
  assert.ok(outside>route.length*.65,`${item.id}: ${outside}m beyond existing loop`);
});
for(const reverse of [false,true])for(const hz of [15,30,60,120])test(`V0.4 preserves scenic Cruise ${reverse?'reverse':'forward'} at ${hz}Hz`,()=>{
  const route=v4Nav.scenic(reverse),a=pointAt(route,0),b=pointAt(route,3);
  let car={x:a[0],z:a[1],yaw:Math.atan2(b[0]-a[0],b[1]-a[1]),speed:0},progress=0,laps=0;
  for(let i=0;i<260*hz;i++){
    const projection=projectRoute(route,[car.x,car.z],progress);progress=projection.progress;
    if(progress>route.length-.5 && projection.distance<8){progress=0;laps++;}
    const input=cruiseInput(car,route,progress);car=stepCar(car,input.throttle,input.steering,input.brake,1/hz,v4World.allowed);
    assert.ok(!car.blocked,JSON.stringify({car,progress}));if(laps && progress>100)break;
  }
  assert.equal(laps,1);assert.ok(progress>100);
});
test('map routing refuses distant origins, water targets and disconnected streets',()=>{
  const start=v4Nav.scenic().points[0];
  assert.throws(()=>v4Nav.navigatePoint([-73,0],start),/connected/);
  assert.throws(()=>v4Nav.navigatePoint(start,[-73,0]),/ground street/);
  assert.throws(()=>v4Nav.navigatePoint(start,[-474.2,516.9]),/connected/);
  for(const id of Object.keys(v4.anchors)){const r=v4Nav.navigate(start,id,id);assert.ok(r.length>0);}
  const target=pointAt(v4Nav.drive('village-blocks'),400),r=v4Nav.navigatePoint(start,target);assert.ok(r.length>100);assert.equal(r.loop,false);
});
test('each finger and keyboard key owns its press until release or reset',async()=>{
  const {createInputState}=await import('./input.ts');const inputs=createInputState();
  inputs.set('finger1','forward',true);inputs.set('finger2','left',true);
  assert.ok(inputs.has('forward')&&inputs.has('left'));
  inputs.set('finger3','forward',true);inputs.set('finger1','forward',false);assert.ok(inputs.has('forward'));
  inputs.set('finger2','left',false);assert.equal(inputs.has('left'),false);assert.ok(inputs.has('forward'));
  inputs.set('key:w','forward',true);inputs.set('finger3','forward',false);assert.ok(inputs.has('forward'));
  inputs.clear();assert.equal(inputs.has('forward'),false);
});

const {createManualDriver,clearanceAhead}=await import('./handling.ts');
test('V0.5 manual taps turn less abruptly and release recentres without route assistance',()=>{
 const allowed=()=>true,driver=createManualDriver(stepCar);
 let manual={x:0,z:0,yaw:0,speed:6,steer:0},legacy={...manual};
 for(let i=0;i<15;i++){
  manual=driver.step(manual,{throttle:1,steering:1,brake:false},'relaxed',1/60,allowed);
  legacy=stepCar(legacy,legacy.speed>=6?0:1,1,false,1/60,allowed);
 }
 assert.ok(manual.yaw>0 && manual.yaw<legacy.yaw*.6,{manual,legacy});
 const releaseYaw=manual.yaw;
 for(let i=0;i<20;i++)manual=driver.step(manual,{throttle:1,steering:0,brake:false},'relaxed',1/60,allowed);
 assert.ok(Math.abs(manual.steer)<.001);
 assert.ok(manual.yaw-releaseYaw<.04,'letting go must stop the turn promptly');
});
test('V0.5 normal pace retains speed while held steering becomes gentler at speed',()=>{
 const open=()=>true,driver=createManualDriver(stepCar);
 let car={x:0,z:0,yaw:0,speed:0};
 for(let i=0;i<360;i++)car=driver.step(car,{throttle:1,steering:0,brake:false},'normal',1/60,open);
 assert.ok(car.speed>18 && car.speed<=19);assert.equal(car.yaw,0);
 const fast=createManualDriver(stepCar),slow=createManualDriver(stepCar);
 let a={x:0,z:0,yaw:0,speed:18},b={...a,speed:3};
 for(let i=0;i<40;i++){
  a=fast.step(a,{throttle:1,steering:1,brake:false},'normal',1/60,open);
  b=slow.step(b,{throttle:0,steering:1,brake:false},'normal',1/60,open);
 }
 assert.ok(Math.abs(a.steer)<Math.abs(b.steer)*.7);
});
test('V0.5 manual handling remains equivalent across frame rates and caps stalls',()=>{
 function run(hz){const driver=createManualDriver(stepCar);let car={x:0,z:0,yaw:0,speed:0};for(let i=0;i<hz*3;i++)car=driver.step(car,{throttle:1,steering:.7,brake:false},'relaxed',1/hz,()=>true);return car;}
 const reference=run(120);
 for(const hz of [15,30,60]){const car=run(hz);assert.ok(Math.hypot(car.x-reference.x,car.z-reference.z)<.02);assert.ok(Math.abs(car.yaw-reference.yaw)<.005);}
 const stalled=createManualDriver(stepCar).step({x:0,z:0,yaw:0,speed:19},{throttle:1,steering:0,brake:false},'normal',10,()=>true);
 assert.ok(stalled.z<=1.91);
});
test('V0.5 input shaping keeps full-body collision, braking and reverse escape',()=>{
 const allowed=([x,z])=>Math.abs(x)<6&&z<20,driver=createManualDriver(stepCar);
 let car={x:0,z:0,yaw:0,speed:0};
 for(let i=0;i<500;i++)car=driver.step(car,{throttle:1,steering:0,brake:false},'relaxed',1/60,allowed);
 assert.ok(car.blocked&&car.z<18&&carFits(car,allowed));
 const stopped=car.z;
 for(let i=0;i<80;i++)car=driver.step(car,{throttle:-1,steering:0,brake:false},'relaxed',1/60,allowed);
 assert.ok(!car.blocked&&car.z<stopped-1&&car.speed<0);
 car=driver.step(car,{throttle:0,steering:0,brake:true},'relaxed',.1,allowed);
 assert.ok(car.speed>-3);
});
test('V0.5 road-edge preview warns without changing pose or permitting obstacles',()=>{
 const car={x:0,z:12,yaw:0,speed:6,steer:0},original={...car};
 const ahead=clearanceAhead(car,p=>carFits(p,([x,z])=>Math.abs(x)<6&&z<20));
 assert.ok(ahead>5 && ahead<7);assert.deepEqual(car,original);
 assert.equal(clearanceAhead({...car,z:0},()=>true),10);
});

const {createElevatedWorld,elevationFixture,fixtureGround,surfaceSample,elevatedCameraTarget}=await import('./elevation.ts');
const elevated=createElevatedWorld(elevationFixture,fixtureGround);
for(const reverse of [false,true])for(const hz of [15,60,120])test(`isolated elevation proof crosses ramps/deck ${reverse?'reverse':'forward'} at ${hz}Hz`,()=>{
 let car={x:0,z:reverse?470:10,y:0,yaw:reverse?Math.PI:0,speed:0,pitch:0,surface:reverse?'north':'south'};
 let highest=0,maxStep=0,visited=new Set();
 for(let i=0;i<40*hz;i++){
  const before=car;car=elevated.step(stepCar,car,1,0,false,1/hz);visited.add(car.surface);highest=Math.max(highest,car.y);maxStep=Math.max(maxStep,Math.abs(car.y-before.y));
  assert.ok(!car.blocked,JSON.stringify(car));
  assert.ok(car.y>=0&&car.y<=8);
  assert.equal(elevatedCameraTarget(car).y,car.y+9);
  if(reverse?car.z<12:car.z>468)break;
 }
 assert.ok(reverse?car.z<12:car.z>468);assert.equal(highest,8);assert.ok(maxStep<.13);
 assert.equal(visited.size,5);assert.ok(Math.abs(car.pitch)<.0001);
});
test('elevation graph distinguishes an underpass from the deck above it',()=>{
 assert.deepEqual(elevated.route('south','north'),['south','up','deck','down','north']);
 assert.equal(elevated.route('south','underpass'),null);
 assert.equal(elevated.sample([0,190],'deck').y,8);
 assert.equal(elevated.sample([0,190],'underpass').y,0);
 const illegal={x:0,z:190,y:0,yaw:0,speed:5,pitch:0,surface:'deck'};
 assert.ok(elevated.step(stepCar,illegal,1,0,false,.1).blocked);
});
test('elevated road boundaries retain a full-car footprint and never admit water below',()=>{
 let car={x:0,z:240,y:8,yaw:Math.PI/2,speed:0,pitch:0,surface:'deck'};
 for(let i=0;i<200;i++)car=elevated.step(stepCar,car,1,0,false,1/60);
 assert.ok(car.blocked&&car.x<4&&car.y===8);
 assert.equal(elevated.sample([8,240],'deck'),null);
 assert.equal(elevated.sample([0,240],'underpass'),null);
});
test('elevation joins reject discontinuous heights and ramps meet decks at zero grade',()=>{
 for(const surface of elevationFixture){assert.ok(Math.abs(surfaceSample(surface,[surface.from.x,surface.from.z]).grade)<1e-12);assert.ok(Math.abs(surfaceSample(surface,[surface.to.x,surface.to.z]).grade)<1e-12);}
 assert.throws(()=>createElevatedWorld(elevationFixture.map(s=>s.id==='deck'?{...s,from:{...s.from,y:9}}:s),fixtureGround),/endpoints/);
});

const { fitDrivingCamera } = await import('./camera.ts');
test('camera sight line cannot pass through a facade even when the endpoint is clear',()=>{
 const fit=fitDrivingCamera([0,0],[0,-20],([x,z])=>!(Math.abs(x)<3&&z<-3&&z>-7));
 assert.ok(fit.z>=-3&&fit.z<=0&&fit.fraction<1);
 const close=fitDrivingCamera([0,0],[0,-8],([,z])=>z>=-.5);
 assert.equal(close.z,0);
});
test('camera follows a clear street and constrains a lagged position inside a corner',()=>{
 const clear=([x,z])=>x<2||z>2;
 const target=fitDrivingCamera([0,5],[0,-18],clear);
 assert.equal(target.fraction,1);
 const lagged=fitDrivingCamera([0,5],[8,-5],clear);
 assert.ok(lagged.fraction<1&&clear([lagged.x,lagged.z]));
});

const {createCameraClearance,fitSpatialCamera}=await import('./development/camera-v06.ts');
const {createManualDriver:createCandidateDriver}=await import('./development/handling-v06.ts');
test('spatial camera permits open water and low roofs but rejects tall facades across index seams',()=>{
 const clear=createCameraClearance([{id:'wall',height:10,heightMethod:'fixture',shape:[[[62,-8],[68,-8],[68,8],[62,8],[62,-8]]]}],inPolygon);
 assert.equal(clear({x:63,y:8,z:0}),false);assert.equal(clear({x:65,y:8,z:0}),false);
 assert.equal(clear({x:65,y:14,z:0}),true);assert.equal(clear({x:0,y:10,z:0}),true);
 const origin={x:60,y:1.4,z:0},desired={x:75,y:22,z:0};
 const fit=fitSpatialCamera(origin,desired,clear);assert.ok(fit.x<desired.x);assert.equal(fit.y,22);assert.ok(clear(fit));
});
test('spatial camera protects a near-plane side missed by diagonal-only clearance',()=>{
 const origin={x:0,y:1.4,z:0},desired={x:0,y:10,z:-15};
 const clear=p=>!(p.x>.6&&p.z<-10);
 const fit=fitSpatialCamera(origin,desired,clear,1.2);
 assert.ok(fit.z>-10);assert.equal(fit.y,10);
 assert.deepEqual(fitSpatialCamera(origin,desired,()=>true),desired);
});
test('manual heading response remains bounded at speed without sacrificing a low-speed turn',()=>{
 const run=(speed,hold)=>{const driver=createCandidateDriver(stepCar);let car={x:0,z:0,yaw:0,speed,steer:0};for(let i=0;i<(hold+.4)*120;i++)car=driver.step({...car,speed},{throttle:1,steering:i<hold*120?1:0,brake:false},'normal',1/120,()=>true);return car.yaw;};
 // Short presses remain useful at low speed; holding longer is more nearly
 // proportional. Faster travel must never amplify the heading response.
 assert.ok(run(19,.3)<run(6,.3));
 assert.ok(run(6,2)>1.6&&run(6,2)<2);
 assert.ok(run(19,2)<1.7);
});
test('candidate handling preserves the V0.5 Relaxed response, including release and reverse',async()=>{
 const legacy=createManualDriver(stepCar),candidate=createCandidateDriver(stepCar);
 let a={x:0,z:0,yaw:0,speed:0,steer:0},b={...a};
 for(let i=0;i<1800;i++){
   const input={throttle:i<1200?1:-1,steering:i%180<80?1:i%180<130?-1:0,brake:i%400>380};
   a=legacy.step(a,input,'relaxed',1/120,()=>true);b=candidate.step(b,input,'relaxed',1/120,()=>true);
   assert.deepEqual(b,a);
 }
});
const {createDrivingEvidence}=await import('./development/driving-evidence.ts');
test('driving evidence distinguishes presses, rapid reversals, release rotation and pauses',()=>{
 const evidence=createDrivingEvidence(),start={x:0,z:0,yaw:0,speed:6},turned={...start,yaw:.05};
 evidence.step(start,turned,1,.1,16);evidence.step(turned,{...turned,yaw:.06},0,.1,17);
 evidence.step(turned,turned,-1,.1,18);const before=evidence.read();evidence.step(start,turned,1,0,1000);
 assert.deepEqual(evidence.read(),before);assert.equal(before.steeringPresses,2);assert.equal(before.rapidOppositePresses,1);
 assert.ok(before.maxReleaseDegrees>.5&&before.maxReleaseDegrees<.6);assert.equal(before.frameP95Ms,18);
});

const cambie=JSON.parse(readFileSync(new URL('./development/cambie-research-v06-2026-10-30.json',import.meta.url),'utf8'));
const cambieGround=p=>!cambie.water.some(polygon=>inPolygon(p,polygon));
const cambieWorld=createElevatedWorld(cambie.surfaces,cambieGround);
const {createProfileSampler}=await import('./elevation.ts');
test('Cambie research data has immutable identity, one datum, real source dates and explicit limits',()=>{
 assert.equal(createHash('sha256').update(readFileSync(new URL('./development/cambie-research-v06-2026-10-30.json',import.meta.url))).digest('hex'),'7ea36275bfd34834efa7e404efe5a5ce6379503919b4064efc4636990b0928d8');
 assert.equal(cambie.publicDriving,false);assert.equal(cambie.lidarAcquiredAt,'2025-08-26');assert.match(cambie.verticalCrs,/CGVD2013/);assert.match(cambie.notice,/not surveyed/);
 const deck=cambie.surfaces.find(s=>s.id==='main-deck');assert.ok(Math.max(...deck.profile.map(p=>p.y))>18);assert.ok(Math.max(...deck.profile.map(p=>p.y))<18.2);
 assert.equal(cambieWorld.route('north-ground','south-ground').length,6);assert.equal(cambieWorld.route('main-deck','marinaside-underpass'),null);
});
test('curved profile heights are continuous, bounded and preserve every explicit seam',()=>{
 for(const s of cambie.surfaces){
  const sample=createProfileSampler(s);
  for(let i=0;i<s.profile.length-1;i++){
   const a=s.profile[i],b=s.profile[i+1];
   for(let j=0;j<=10;j++){
    const p=sample([a.x+(b.x-a.x)*j/10,a.z+(b.z-a.z)*j/10]);assert.ok(p);
    assert.ok(p.y>=Math.min(a.y,b.y)-.001&&p.y<=Math.max(a.y,b.y)+.001);
    assert.ok(Math.abs(p.grade)<.12);
   }
  }
  assert.equal(sample([s.from.x,s.from.z]).y,s.from.y);assert.equal(sample([s.to.x,s.to.z]).y,s.to.y);
 }
 const first=cambie.surfaces[0];assert.throws(()=>createElevatedWorld([{...first,profile:[{...first.from,y:0},first.to]}],()=>true),/Profile endpoints/);
});
function researchPath(reverse=false){
 let points=cambie.surfaces.slice(0,6).flatMap((s,i)=>i?s.profile.slice(1):s.profile);
 if(reverse)points=points.toReversed();
 const stations=[0];for(let i=1;i<points.length;i++)stations.push(stations.at(-1)+Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z));
 const at=d=>{let i=1;while(i<stations.length-1&&stations[i]<d)i++;const t=Math.max(0,Math.min(1,(d-stations[i-1])/(stations[i]-stations[i-1]))),a=points[i-1],b=points[i];return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t};};
 const nearest=car=>{let best=Infinity,distance=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((car.x-a.x)*dx+(car.z-a.z)*dz)/(dx*dx+dz*dz))),dist=Math.hypot(car.x-a.x-t*dx,car.z-a.z-t*dz);if(dist<best){best=dist;distance=stations[i-1]+t*(stations[i]-stations[i-1]);}}return distance;};
 return {at,nearest,length:stations.at(-1)};
}
// Scripted path tracking is a physics/geometry regression test, NEVER a manual
// driving acceptance result. UI driving is recorded separately in the report.
for(const reverse of [false,true])for(const hz of [15,60,120])test(`real Cambie corridor automated full-car traversal ${reverse?'northbound':'southbound'} ${hz}Hz`,()=>{
 const path=researchPath(reverse),start=path.at(8),aim=path.at(9),surface=reverse?'south-ground':'north-ground';
 let car={...start,y:cambieWorld.sample([start.x,start.z],surface).y,yaw:Math.atan2(aim.x-start.x,aim.z-start.z),speed:0,steer:0,pitch:0,surface},progress=8,maxHeight=0,visited=new Set();
 for(let i=0;i<260*hz&&progress<path.length-9;i++){
  progress=path.nearest(car);const target=path.at(progress+7),error=Math.atan2(Math.sin(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw),Math.cos(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw));
  const wheel=Math.atan2(2*2.65*Math.sin(error),7),steering=wheel*(1+Math.abs(car.speed)/22)/.72,before=car;
  car=cambieWorld.step(stepCar,car,car.speed<6?.65:0,steering,false,1/hz);visited.add(car.surface);maxHeight=Math.max(maxHeight,car.y);
  assert.ok(!car.blocked,JSON.stringify({car,progress,hz,reverse}));assert.ok(Math.abs(car.y-before.y)<.1);assert.ok(Math.abs(car.pitch)<.13);
  assert.equal(elevatedCameraTarget(car).y,car.y+9);
 }
 assert.ok(progress>path.length-10);assert.equal(visited.size,6);assert.ok(maxHeight>18);
});
test('Cambie deck cannot fall to an intersecting underpass or leave support over water',()=>{
 const deck=cambie.surfaces.find(s=>s.id==='main-deck'),p=deck.profile[Math.floor(deck.profile.length/2)],sample=cambieWorld.sample([p.x,p.z],deck.id);
 assert.equal(cambieGround([p.x,p.z]),false);
 let car={...p,y:sample.y,yaw:Math.PI/2,speed:0,pitch:0,surface:deck.id};
 for(let i=0;i<180;i++)car=cambieWorld.step(stepCar,car,1,0,false,1/60);
 assert.ok(car.blocked);assert.ok(car.y>17);assert.equal(cambieWorld.sample([car.x+15,car.z],deck.id),null);
 const wrong={...car,y:0};assert.ok(cambieWorld.step(stepCar,wrong,1,0,false,.1).blocked);
});

// Research cue annotations must never alter the stable route or public cues.
test('optional bend cues preserve public navigation and every route point',()=>{
 const research=createNavigator(v4,p=>carFits(p,v4World.allowed),true);
 let bends=0;
 for(const [stable,candidate] of [[v4Nav.scenic(),research.scenic()],[v4Nav.scenic(true),research.scenic(true)],...v4.drives.map(d=>[v4Nav.drive(d.id),research.drive(d.id)])]){
  assert.deepEqual(candidate.points,stable.points);assert.equal(candidate.length,stable.length);
  assert.ok(!stable.turns.some(t=>t.direction.startsWith('Bear')));
  assert.deepEqual(candidate.turns.filter(t=>!t.direction.startsWith('Bear')),stable.turns);
  bends+=candidate.turns.filter(t=>t.direction.startsWith('Bear')).length;
 }
 assert.ok(bends>0);
});
