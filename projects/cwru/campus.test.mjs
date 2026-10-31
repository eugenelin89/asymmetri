import './test-loader.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {buildArchitecture,architectureEnvelope} = await import('./architecture.ts');
const {buildFootprintContext} = await import('./footprint-context.ts');
const {createCollision,global,local,floorAt,createRoutes,segmentDistance,inPolygon} = await import('./spatial.ts');
const {landmarkIds,initialCampusPose} = await import('./layout.ts');
const {characters,places,safeExternalUrl,answerQuestion} = await import('./registry.ts');
const {defaults,initialHalloweenPreference,setHalloween,solarPosition} = await import('./environment.ts');
const {createHalloween,halloweenMonsterKinds,halloweenPopulationLimits} = await import('./halloween.ts');
const root=new URL('../../public/cwru/v0.1-2026-10-31/',import.meta.url);
const data=JSON.parse(readFileSync(new URL('data.json',root)));
const sourceAnchors=JSON.parse(readFileSync(new URL('anchors.json',root)));
const models=landmarkIds.map(id=>{
 const anchor=architectureEnvelope(id,structuredClone(sourceAnchors[id]));
 const building=data.buildings.find(b=>b.id===anchor.buildingId);
 const asset=buildArchitecture(id,anchor.width,anchor.depth,building.height);
 anchor.entry=global(asset.entry,anchor);
 const interior={anchor,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry};
 const context=buildFootprintContext(building,anchor);
 anchor.entry=global(context.entry,anchor);
 return {id,anchor,asset,interior,context};
});
const anchors=Object.fromEntries(models.map(m=>[m.id,m.anchor]));
const interiors=models.flatMap(m=>[m.interior,m.context.interior]);
const excluded=new Set(models.map(m=>m.anchor.buildingId));
const collision=createCollision(data,interiors,excluded);
test('Cleveland source geography has unique real footprints and closed finite rings',()=>{
 assert.deepEqual(data.origin,[-81.608,41.504]);assert(data.buildings.length>1000);assert(data.routes.length>1000);
 assert.equal(new Set(data.buildings.map(b=>b.id)).size,data.buildings.length);
 for(const b of data.buildings){assert.match(b.id,/^osm-/);assert(b.heightSource);for(const ring of b.rings){assert.deepEqual(ring[0],ring.at(-1));assert(ring.flat().every(Number.isFinite));}}
 assert.equal(new Set(models.map(m=>m.anchor.buildingId)).size,models.length);
});
for(const m of models){
 test(`${m.id}: exterior entrance is physically passable into the furnished core`,()=>{
  const from=global([m.asset.entry[0],m.anchor.depth/2+5],m.anchor);
  let pose={x:from[0],z:from[1],y:0,yaw:m.anchor.yaw,pitch:0};
  for(let n=0;n<100;n++)pose=collision.move(pose,-Math.sin(m.anchor.yaw)*.1,-Math.cos(m.anchor.yaw)*.1);
  const point=local([pose.x,pose.z],m.anchor);
  assert(point[1]<m.anchor.depth/2-2,`${m.id} blocked at local ${point} against depth ${m.anchor.depth}`);
 });
 test(`${m.id}: source outline doorway connects to the detailed interior`,()=>{
  const startZ=m.context.entry[1]+3,from=global([0,startZ],m.anchor);
  let pose={x:from[0],z:from[1],y:0,yaw:m.anchor.yaw,pitch:0};
  const distance=startZ-m.anchor.depth/2+3;
  for(let n=0;n<Math.ceil(distance/.1);n++)pose=collision.move(pose,-Math.sin(m.anchor.yaw)*.1,-Math.cos(m.anchor.yaw)*.1);
  const point=local([pose.x,pose.z],m.anchor);
  assert(point[1]<m.anchor.depth/2-2,`${m.id} exterior passage blocked at ${point}`);
 });
 test(`${m.id}: every supported stair/ramp can ascend and descend`,()=>{
  for(const ramp of m.asset.ramps){
   let y=ramp.fromY;
   for(let n=0;n<=100;n++){
    const t=.001+.998*n/100;
    const p=[ramp.axis==='x'?ramp.minX+(ramp.maxX-ramp.minX)*t:(ramp.minX+ramp.maxX)/2,ramp.axis==='z'?ramp.minZ+(ramp.maxZ-ramp.minZ)*t:(ramp.minZ+ramp.maxZ)/2];
    const wp=global(p,m.anchor); y=floorAt(wp,y,[m.interior]);
    assert(!collision.blocked(wp,y),`${m.id} ramp collision at ${p}, y ${y}`);
   }
   assert(Math.abs(y-ramp.toY)<.06,`${m.id} did not reach upper floor ${ramp.toY}; got ${y}`);
   for(let n=100;n>=0;n--){
    const t=.001+.998*n/100;
    const p=[ramp.axis==='x'?ramp.minX+(ramp.maxX-ramp.minX)*t:(ramp.minX+ramp.maxX)/2,ramp.axis==='z'?ramp.minZ+(ramp.maxZ-ramp.minZ)*t:(ramp.minZ+ramp.maxZ)/2];
    y=floorAt(global(p,m.anchor),y,[m.interior]);
   }
   assert(Math.abs(y-ramp.fromY)<.06,`${m.id} did not descend to ${ramp.fromY}; got ${y}`);

  }
 });
}
test('arrival is outside collision',()=>{const p=initialCampusPose(anchors);assert(!collision.blocked([p.x,p.z],p.y));});
test('public character sources, faculty zones and privacy boundaries',()=>{
 assert.equal(characters.filter(c=>c.kind==='faculty').length,13);assert.equal(characters.filter(c=>c.kind==='athlete').length,8);assert.equal(characters.filter(c=>c.kind==='student').length,507);
 for(const c of characters){assert(anchors[c.zone]);assert(c.sources.every(s=>safeExternalUrl(s.url)));assert.equal(answerQuestion(c,'Where are you living?'),null);assert.equal(answerQuestion(c,'What is your private schedule?'),null);}
 assert.equal(safeExternalUrl('https://case.edu.attacker.example/x'),null);assert.equal(safeExternalUrl('javascript:alert(1)'),null);
});
test('Halloween uses Cleveland dates and restores previous atmosphere',()=>{
 assert.equal(initialHalloweenPreference(new Date('2026-10-24T03:59:00Z')),false);
 assert.equal(initialHalloweenPreference(new Date('2026-10-24T04:01:00Z')),true);
 assert.equal(initialHalloweenPreference(new Date('2026-11-08T05:01:00Z')),false);
 const before={...defaults,season:'summer',hour:12,weather:'clear'};const on=setHalloween(before,true);const off=setHalloween(on.settings,false,on.previous);assert.equal(off.settings.hour,12);assert.equal(off.settings.season,'summer');
 const sun=solarPosition('summer',12);assert(sun.sunrise>4&&sun.sunrise<7);assert(sun.sunset>19&&sun.sunset<22);
});
test('Halloween decor reaches supported building floors without collision',()=>{
 const overlay=createHalloween(data,anchors,interiors,collision.blocked);assert(overlay.decorations.length>=models.length);
 for(const d of overlay.decorations)assert(!collision.blocked(d.point,d.y),`${d.building} decoration blocks a wall`);
});
test('source route graph refuses an unreachable location rather than drawing through buildings',()=>{
 const routes=createRoutes(data,collision.blocked);assert(routes.nodes.length>1000);assert.equal(routes.find([90000,90000],[0,0]),null);
 assert(places.some(p=>p.id==='disanto'));assert(places.some(p=>p.id==='village'));
});

const halloween=createHalloween(data,anchors,interiors,collision.blocked);
const seasonal={...defaults,halloween:true,population:true,reducedMotion:false,quality:'ultra'};
const costumeMeshes=()=>halloween.group.children.filter(m=>/-(near|far|legs)$/.test(m.name));
test('sixteen distinct costumes are spread along real outdoor paths',()=>{
 assert.equal(halloweenMonsterKinds.length,16);
 assert(halloween.monsters.length>=96&&halloween.monsters.length<=128);
 assert.deepEqual([...new Set(halloween.monsters.map(m=>m.kind))].sort(),[...halloweenMonsterKinds].sort());
 for(const m of halloween.monsters){
  assert(halloween.monsters.filter(o=>o.kind===m.kind).length>=4);
  const source=data.routes.find(r=>r.id===m.routeId);assert(source);
  assert(source.points.some((p,i)=>i&&JSON.stringify([source.points[i-1],p])===JSON.stringify(m.route)));
  for(let i=0;i<=8;i++){
   const p=[m.route[0][0]+(m.route[1][0]-m.route[0][0])*i/8,m.route[0][1]+(m.route[1][1]-m.route[0][1])*i/8];
   assert(!collision.blocked(p,0));assert(!data.buildings.some(b=>inPolygon(p,b.rings)));
  }
 }
});
test('every creature and costume walks on its route and yields to the visitor',()=>{
 for(const kind of halloweenMonsterKinds){
  const actor=halloween.monsters.find(m=>m.kind===kind);actor.pause=0;
  const from=[...actor.point],pose={x:from[0]+8,z:from[1]+8,y:0};
  for(let i=0;i<30;i++)halloween.update(.1,seasonal,pose);
  assert(Math.hypot(actor.point[0]-from[0],actor.point[1]-from[1])>.3,kind);
  assert(segmentDistance(actor.point,...actor.route)<1e-7);
  assert(!collision.blocked(actor.point,0));
  const stopped=[...actor.point];halloween.update(.1,seasonal,{x:actor.point[0],z:actor.point[1],y:0});
  assert.deepEqual(actor.point,stopped,kind+' yields');
 }
});
test('reduced motion freezes costumes and population off removes all roaming geometry',()=>{
 const actor=halloween.monsters[0],pose={x:actor.point[0]+8,z:actor.point[1],y:0};
 halloween.update(0,seasonal,pose);
 const state=JSON.stringify(halloween.monsters),matrices=costumeMeshes().map(m=>Array.from(m.instanceMatrix.array));
 halloween.update(20,{...seasonal,reducedMotion:true},pose);
 assert.equal(JSON.stringify(halloween.monsters),state);assert.deepEqual(costumeMeshes().map(m=>Array.from(m.instanceMatrix.array)),matrices);
 halloween.update(.1,{...seasonal,population:false},pose);assert(costumeMeshes().every(m=>m.count===0));
 halloween.update(.1,{...seasonal,halloween:false},pose);assert.equal(halloween.group.visible,false);
});
test('costume rendering stays finite, varied and within fixed instanced budgets',()=>{
 const signatures=new Set();
 for(const kind of halloweenMonsterKinds){
  const mesh=halloween.group.children.find(m=>m.name===`halloween-${kind}-near`);
  mesh.geometry.computeBoundingBox();const bounds=mesh.geometry.boundingBox;
  signatures.add(JSON.stringify([bounds.min.toArray(),bounds.max.toArray(),mesh.geometry.attributes.position.count]));
 }
 assert.equal(signatures.size,16);assert(halloween.group.children.length<=51);
 for(const mesh of halloween.group.children){assert(mesh.isInstancedMesh);assert(Array.from(mesh.geometry.attributes.position.array).every(Number.isFinite));}
 const pose={x:anchors['kelvin-smith'].x,z:anchors['kelvin-smith'].z,y:0};
 for(const quality of ['low','medium','auto','high','ultra']){
  halloween.update(0,{...seasonal,quality},pose);
  assert(costumeMeshes().filter(m=>!m.name.endsWith('-legs')).reduce((n,m)=>n+m.count,0)<=halloweenPopulationLimits[quality]);
 }
});

test('a published profile becomes a nearby walking actor and deletion removes it',async()=>{
 const {createPeople}=await import('./people.ts');const {profileCharacter}=await import('./community/model.ts');
 const population=createPeople(data,anchors,collision.blocked);
 const character=profileCharacter({id:'local-validation',name:'Validation visitor',affiliation:'Visitor',department:'',about:'An original test character.',interests:'Architecture',advice:'',zone:'tinkham-veale',color:'teal',updated:'2026-10-31'});
 population.setCommunity([character]);
 const a=anchors['tinkham-veale'];let actor;
 for(const dx of [-60,0,60])for(const dz of [-60,0,60]){
  population.update(1,0,[a.x+dx,a.z+dz],15,true,null,false);actor=population.actors.find(p=>p.id===character.id);if(actor)break;
 }
 assert(actor,'Published profile is streamed into its selected district');
 assert(actor.route.every(p=>!collision.blocked(p,0)));
 const before=actor.group.position.clone();
 for(let i=0;i<50;i++)population.update(.1,i*.1,[actor.group.position.x+12,actor.group.position.z+12],15,true,null,false);
 assert(actor.group.position.distanceTo(before)>.2,'Profile actor walks');
 population.setCommunity([]);assert(!population.actors.some(a=>a.id===character.id));
});


test('expanded university roster streams within a fixed model budget and keeps paths spaced', async()=>{
 const {createPeople,namedActorLimits}=await import('./people.ts');
 const population=createPeople(data,anchors,collision.blocked);
 const identities=new Set();
 let peak=0;
 for(const zone of ['strosacker','medicine','mather-house','peter-lewis','kelvin-smith']){
  const a=anchors[zone];
  for(const offset of [[30,30],[-70,20],[70,-60]]){
   const focus=[a.x+offset[0],a.z+offset[1]];
   population.update(.7,identities.size*90,focus,12,true,null,false);
   const source=population.actors.filter(a=>characters.some(c=>c.id===a.id&&c.routeSpace==='network'));
   assert(source.length<=namedActorLimits.university);
   peak=Math.max(peak,source.length);
   for(const actor of source){
    identities.add(actor.id);
    assert(!collision.blocked([actor.group.position.x,actor.group.position.z],0));
    let meshes=0;actor.group.traverse(o=>{if(o.isMesh)meshes++;});assert(meshes<=32);
   }
   for(let i=0;i<source.length;i++)for(let j=i+1;j<source.length;j++)assert(source[i].group.position.distanceTo(source[j].group.position)>.84);
  }
 }
 assert(peak>0);assert(identities.size>namedActorLimits.university,'walking between districts should reveal different students');
});
