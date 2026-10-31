import './test-loader.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {createOutdoor,outdoorIds}=await import('./outdoor.ts');
const {global,floorAt,createCollision}=await import('./spatial.ts');
const {defaults}=await import('./environment.ts');
const anchors=JSON.parse(readFileSync(new URL('../../public/stanford/v0.1-2026-10-31/anchors.json',import.meta.url)));
const venue=createOutdoor(anchors);
const empty={origin:[-122.17,37.4275],buildings:[],surfaces:[],trees:[],routes:[],entrances:[]};
const collision=createCollision(empty,venue.interiors,new Set());
test('All twelve distinct venue models are built once; sailing shares rowing waterfront',()=>{assert.equal(outdoorIds.length,12);assert.equal(venue.interiors.length,12);assert.equal(venue.group.children.filter(c=>c.userData.info).length,12);assert(anchors.sailing);assert.equal(anchors.sailing.x,anchors.rowing.x);});
for(const v of venue.interiors)test(`${v.anchor.id}: seating ramps have continuous support and clear central aisles`,()=>{
 for(const ramp of v.ramps){let y=ramp.fromY;for(let n=0;n<=100;n++){const t=.001+.998*n/100,p=[ramp.axis==='x'?ramp.minX+(ramp.maxX-ramp.minX)*t:(ramp.minX+ramp.maxX)/2,ramp.axis==='z'?ramp.minZ+(ramp.maxZ-ramp.minZ)*t:(ramp.minZ+ramp.maxZ)/2],wp=global(p,v.anchor);y=floorAt(wp,y,[v]);assert(!collision.blocked(wp,y),`${v.anchor.id} aisle blocked at${p} y${y}`);}assert(Math.abs(y-ramp.toY)<.08,`${v.anchor.id} disconnected seating ramp`);}
});
test('Reduced motion freezes venue practice figures; population off hides them',()=>{
 const a=anchors.cagan,pose={x:a.x,z:a.z,y:0,yaw:0,pitch:0};venue.update(.1,{...defaults,population:true},pose);const figures=venue.group.children.filter(c=>c.name===''&&!c.userData.info),before=figures.map(c=>c.position.clone());venue.update(9,{...defaults,population:true,reducedMotion:true},pose);for(let i=0;i<figures.length;i++)assert(figures[i].position.equals(before[i]));venue.update(.1,{...defaults,population:false},pose);assert(figures.every(c=>!c.visible));
});
