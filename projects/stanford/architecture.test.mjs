import './test-loader.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {buildArchitecture,architectureEnvelope,usesFootprintContext}=await import('./architecture.ts');
const {buildFootprintContext}=await import('./footprint-context.ts');
const {global,local,floorAt,createCollision,inPolygon}=await import('./spatial.ts');
const {landmarkIds}=await import('./layout.ts');
const data=JSON.parse(readFileSync(new URL('../../public/stanford/v0.1-2026-10-31/data.json',import.meta.url)));
const raw=JSON.parse(readFileSync(new URL('../../public/stanford/v0.1-2026-10-31/anchors.json',import.meta.url)));
const models=landmarkIds.map(id=>{const a=architectureEnvelope(id,raw[id]),source=data.buildings.find(b=>b.id===a.buildingId),asset=buildArchitecture(id,a.width,a.depth,source?.height),interior={anchor:a,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry},context=source&&usesFootprintContext(id)?buildFootprintContext(source,a):null;return{id,a,source,asset,interior,context};});
// Per-building navigation verifies the original interior independently of source
// neighbouring buildings. Full-world acceptance is checked by the campus tests.
for(const m of models){
 const interiors=[m.interior,...m.context?[m.context.interior]:[]],collision=createCollision({...data,buildings:[]},interiors,new Set());
 test(`${m.id}: source-contained core and passable exterior entrance`,()=>{
  if(m.source)for(let x=-m.a.width/2+.5;x<m.a.width/2;x+=2)for(let z=-m.a.depth/2+.5;z<m.a.depth/2;z+=2)assert(inPolygon(global([x,z],m.a),m.source.rings),`${m.id} core outside footprint at ${x},${z}`);
  const startZ=(m.context?.entry[1]??m.asset.entry[1])+1,wp=global([0,startZ],m.a);let pose={x:wp[0],z:wp[1],y:0,yaw:m.a.yaw,pitch:0};
  for(let i=0;i<(startZ-m.a.depth/2+3)/.1;i++)pose=collision.move(pose,-Math.sin(m.a.yaw)*.1,-Math.cos(m.a.yaw)*.1);
  const q=local([pose.x,pose.z],m.a);assert(q[1]<m.a.depth/2-2,`${m.id} doorway blocked at ${q}`);
 });
 test(`${m.id}: every stair or ramp supports unobstructed ascent and descent`,()=>{
  for(const ramp of m.asset.ramps){let y=ramp.fromY;for(const dir of [1,-1]){for(let step=0;step<=100;step++){const t=.001+.998*(dir>0?step:100-step)/100,p=[ramp.axis==='x'?ramp.minX+(ramp.maxX-ramp.minX)*t:(ramp.minX+ramp.maxX)/2,ramp.axis==='z'?ramp.minZ+(ramp.maxZ-ramp.minZ)*t:(ramp.minZ+ramp.maxZ)/2],wp=global(p,m.a);y=floorAt(wp,y,interiors);assert(!collision.blocked(wp,y),`${m.id} ramp obstruction at ${p} y${y}`);}assert(Math.abs(y-(dir>0?ramp.toY:ramp.fromY))<.07,`${m.id} ramp disconnected: y${y}`);}}
 });
}
test('Every landmark has non-placeholder furniture, original geometry and a source manifest',()=>{assert.equal(models.length,32);for(const m of models){assert(m.asset.colliders.length>10);assert(m.asset.floors.length>0);assert(m.asset.group.children.length>=7);assert.equal(m.asset.group.userData.sourceManifest,'projects/stanford/architecture-sources.json');}});
