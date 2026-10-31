import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {buildArchitecture,architectureEnvelope,usesFootprintContext}=await import('./architecture.ts');
const {buildFootprintContext}=await import('./footprint-context.ts');
const {createOutdoor,outdoorIds}=await import('./outdoor.ts');
const {createCollision,createRoutes,global,local,inPolygon}=await import('./spatial.ts');
const {landmarkIds,applyCampusAnchors,initialCampusPose}=await import('./layout.ts');
const {characters,places,safeExternalUrl}=await import('./registry.ts');
const {createPeople}=await import('./people.ts');
const {createHalloween,halloweenMonsterKinds}=await import('./halloween.ts');
const {defaults,initialHalloweenPreference,serializeHalloweenPreference,setHalloween,solarPosition}=await import('./environment.ts');
const {campusThemes,scheduledTheme}=await import('./themes.ts');
const {sampleWalkingRoute}=await import('./population-schedule.ts');
const {proximityMix}=await import('./sound.ts');
const root=new URL('../../public/stanford/v0.1-2026-10-31/',import.meta.url);
const data=JSON.parse(readFileSync(new URL('data.json',root))),anchors=applyCampusAnchors(JSON.parse(readFileSync(new URL('anchors.json',root))));
const compiledNavigation=JSON.parse(readFileSync(new URL('./data/navigation-graph.json',import.meta.url)));
const models=[],interiors=[],excluded=new Set(outdoorIds.flatMap(id=>anchors[id].buildingId?[anchors[id].buildingId]:[]));
for(const id of landmarkIds){const a=anchors[id]=architectureEnvelope(id,anchors[id]),source=data.buildings.find(b=>b.id===a.buildingId),asset=buildArchitecture(id,a.width,a.depth,source?.height);excluded.add(a.buildingId);a.connectedBuildingIds?.forEach(id=>excluded.add(id));const interior={anchor:a,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry};interiors.push(interior);const context=source&&usesFootprintContext(id)?buildFootprintContext(source,a,id==='main-quad'?data.buildings.filter(b=>b.id===anchors['memorial-church'].buildingId):[]):null;if(context){interiors.push(context.interior);asset.entry=context.entry;}a.entry=global(asset.entry,a);models.push({id,a,asset,interior,context});}
const outdoor=createOutdoor(anchors);interiors.push(...outdoor.interiors);const collision=createCollision(data,interiors,excluded);
test('source geography and landmark references are finite, unique and Stanford-based',()=>{assert.deepEqual(data.origin,[-122.17,37.4275]);assert(data.buildings.length>4000);assert(data.routes.length>3000);assert.equal(new Set(data.buildings.map(b=>b.id)).size,data.buildings.length);for(const b of data.buildings)for(const ring of b.rings){assert.deepEqual(ring[0],ring.at(-1));assert(ring.flat().every(Number.isFinite));}for(const p of places)assert(anchors[p.id],p.id);});
for(const m of models)test(`${m.id}: entrance remains walkable in the complete campus`,()=>{const start=m.asset.entry,from=global([start[0],start[1]+1],m.a);let pose={x:from[0],z:from[1],y:0,yaw:m.a.yaw,pitch:0};const distance=start[1]+1-m.a.depth/2+3;for(let i=0;i<distance/.1;i++)pose=collision.move(pose,-Math.sin(m.a.yaw)*.1,-Math.cos(m.a.yaw)*.1);assert(local([pose.x,pose.z],m.a)[1]<m.a.depth/2-2,`blocked ${m.id} at ${JSON.stringify(local([pose.x,pose.z],m.a))}`);});
test('arrival and Redwood City waterfront support walking at their true coordinates',()=>{const p=initialCampusPose(anchors);assert(!collision.blocked([p.x,p.z],0));const routes=createRoutes(data,collision.blocked,compiledNavigation),r=anchors.rowing;const near=routes.nearest([r.x,r.z]);assert(near.id>=0);const point=routes.nodes[near.id];assert(Math.hypot(point[0]-r.x,point[1]-r.z)<160);assert(!collision.blocked(point,0));assert(Math.hypot(r.x,r.z)>9000);});
test('all imported varsity memberships and public characters retain source identity and safe links',()=>{const coverage=JSON.parse(readFileSync(new URL('./data/roster-coverage.json',import.meta.url))),people=JSON.parse(readFileSync(new URL('./data/people.json',import.meta.url)));assert.equal(coverage.uniqueAthletes,people.filter(p=>p.kind==='athlete').length);assert.equal(coverage.teams.length,32);assert.equal(coverage.teams.reduce((n,t)=>n+t.count,0),855);for(const c of characters){assert(anchors[c.zone],c.id+' zone');assert(c.sources.every(s=>safeExternalUrl(s.url)),c.id+' link');}for(const id of ['fei-fei-li','andrew-ng','chris-manning'])assert(characters.find(c=>c.id===id),id);assert.equal(people.filter(p=>p.kind==='student').length,515);assert.equal(people.filter(p=>p.kind==='student'&&p.sourceAccess==='public-search-excerpt').length,17);const provenance=JSON.parse(readFileSync(new URL('./data/people-sources.json',import.meta.url)));assert.equal(provenance.suppliedStudentImport.suppliedRows,500);assert.equal(provenance.suppliedStudentImport.rows.length,500);assert.equal(new Set(provenance.suppliedStudentImport.rows.map(r=>r.personId)).size,500);assert.equal(provenance.suppliedStudentImport.contactColumnsImported,false);assert(!JSON.stringify(people).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i));assert.equal(safeExternalUrl('https://stanford.edu.attacker.example'),null);assert.equal(safeExternalUrl('javascript:alert(1)'),null);});
test('every source-linked person has a collision-clear walking route, including all varsity venues',()=>{const people=createPeople(data,anchors,collision.blocked),coverage=people.coverage();assert.deepEqual(coverage.unrouted,[]);assert.equal(coverage.routed,characters.length);});
test('the complete roster moves virtually independent of nearby model limits',()=>{const route=[[0,0],[20,0],[20,20]],a=sampleWalkingRoute(route,0,183),b=sampleWalkingRoute(route,30,183);assert.notDeepEqual(a.point,b.point);assert(a.point.every(Number.isFinite));assert.deepEqual(sampleWalkingRoute([],1,0),{point:[0,0],target:0});});
test('holiday defaults honor Oct24–Nov7 in Stanford time, with December reserved until Christmas ships',()=>{assert.equal(initialHalloweenPreference(new Date('2026-10-24T06:59:00Z')),false);assert.equal(initialHalloweenPreference(new Date('2026-10-24T07:00:00Z')),true);assert.equal(initialHalloweenPreference(new Date('2026-11-08T07:59:00Z')),true);assert.equal(initialHalloweenPreference(new Date('2026-11-08T08:00:00Z')),false);const pref=serializeHalloweenPreference(new Date('2026-10-31T20:00:00Z'),true);assert.equal(initialHalloweenPreference(new Date('2026-11-08T08:00:00Z'),pref),false);assert.equal(scheduledTheme(new Date('2026-12-25T20:00:00Z')).id,'base');const christmas=campusThemes.find(t=>t.id==='christmas');assert.equal(christmas.available,false);assert.deepEqual(christmas.automatic,{start:[12,1],end:[12,31]});const base={...defaults,hour:12,season:'summer'},on=setHalloween(base,true),off=setHalloween(on.settings,false,on.previous);assert.equal(off.settings.hour,12);assert.equal(off.settings.season,'summer');const sun=solarPosition('summer',12);assert(sun.sunrise>5&&sun.sunrise<7);assert(sun.sunset>19&&sun.sunset<21);});
test('positional sound fades with distance and changes stereo direction with camera yaw',()=>{const p={x:0,z:0,y:0,yaw:0};assert.equal(proximityMix(p,[100,0]).gain,0);assert(proximityMix(p,[4,0]).gain>proximityMix(p,[25,0]).gain);assert(proximityMix(p,[8,0]).pan>0);assert(proximityMix({...p,yaw:Math.PI},[8,0]).pan<0);});
const halloween=createHalloween(data,anchors,interiors,collision.blocked);
test('expanded Halloween includes every folklore kind and comic/manga/robot visitor on clear routes',()=>{assert.equal(halloweenMonsterKinds.length,22);assert(halloween.monsters.length>=150);assert.equal(new Set(halloween.monsters.map(m=>m.kind)).size,22);assert.equal(halloween.heroes.actors.length,24);for(const m of halloween.monsters){assert(!collision.blocked(m.point,0));assert(!data.buildings.some(b=>inPolygon(m.point,b.rings)));}for(const name of ['Spider-Man','Superman','Batman','Naruto','Goku'])assert(halloween.heroes.actors.some(a=>a.name===name));});
test('Halloween population, reduced motion and base-edition controls apply to all seasonal figures',()=>{const m=halloween.monsters[0],p={x:m.point[0]+10,z:m.point[1]+10,y:0},settings={...defaults,halloween:true,quality:'ultra'};halloween.update(.1,settings,p);const before=JSON.stringify(halloween.monsters);halloween.update(10,{...settings,reducedMotion:true},p);assert.equal(JSON.stringify(halloween.monsters),before);halloween.update(.1,{...settings,population:false},p);assert.equal(halloween.heroes.group.visible,false);halloween.update(.1,{...settings,halloween:false},p);assert.equal(halloween.group.visible,false);});

test('compiled simulation assets match source geography, people and collision geometry',()=>{
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 for(const file of ['seasonal-layout.json','people-routes.json','navigation-graph.json']){
  const value=JSON.parse(readFileSync(new URL('./data/'+file,import.meta.url)));
  for(const source of Object.values(value.provenance.sources))assert.equal(hash(readFileSync(new URL('../../'+source.path,import.meta.url))),source.sha256,source.path);
  for(const [file,digest]of Object.entries(value.provenance.modelInputs))assert.equal(hash(readFileSync(new URL('./'+file,import.meta.url))),digest,file);
 }
});
test('cached monsters are independent between worlds and all graph edges have finite endpoints',()=>{
 const layout=JSON.parse(readFileSync(new URL('./data/seasonal-layout.json',import.meta.url)));
 assert.equal(layout.monsters.length,220);assert.equal(layout.decorations.length,96);
 assert(compiledNavigation.nodes.every(p=>p.length===2&&p.every(Number.isFinite)));
 for(const [id,edges]of compiledNavigation.edges){assert(compiledNavigation.nodes[id]);for(const edge of edges){assert(compiledNavigation.nodes[edge.to]);assert(Number.isFinite(edge.cost)&&edge.cost>=0);}}
 assert.notEqual(halloween.monsters[0].point,layout.monsters[0].point);
});
