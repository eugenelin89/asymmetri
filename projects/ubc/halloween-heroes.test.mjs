import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";

const { createHalloween, halloweenInteriors } = await import("./halloween.ts");
const { buildArchitecture, architectureEnvelope } = await import("./architecture.ts");
const { buildResidence } = await import("./residence.ts");
const { buildStadium } = await import("./stadium.ts");
const { createAthletics } = await import("./athletics.ts");
const { athleticsAnchors } = await import("./athletics-layout.ts");
const { extendGeography } = await import("./extensions.ts");
const { orchardAnchor } = await import("./residence-layout.ts");
const { beatyAnchor } = await import("./beaty-layout.ts");
const { applyGatewayAnchors, gatewayAnchor, gatewaySpawn } = await import("./gateway-layout.ts");
const { buildGatewayLetters } = await import("./gateway-model.ts");
const { createCollision, floorAt, inPolygon, segmentDistance } = await import("./spatial.ts");
const { defaults } = await import("./environment.ts");
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url)));
const data = extendGeography(read("../../public/ubc/v0.1-2026-10-30/data.json"));
const anchors = applyGatewayAnchors({ ...read("../../public/ubc/v0.1-2026-10-30/anchors.json"), ...read("./data/expansion-anchors.json"), orchard: orchardAnchor, beaty: beatyAnchor, ...athleticsAnchors });
const interiors = halloweenInteriors.map((id) => {
  anchors[id] = id === "orchard" ? anchors[id] : architectureEnvelope(id, anchors[id]);
  const a = anchors[id], architecture = id === "orchard" ? buildResidence() : buildArchitecture(id, a.width, a.depth);
  return { anchor: a, ...architecture };
});
const gateway = buildGatewayLetters();
interiors.push({ anchor: gatewayAnchor, colliders: gateway.colliders, floors: [], ramps: [], entry: [0, 0], group: gateway.group });
const orchard = read("../../public/ubc/orchard-v0.2-2026-10-31/geography.json");
const stadium = buildStadium();
interiors.push({ anchor: anchors.stadium, ...stadium });
const athletics = createAthletics(data, anchors, (p, y) => collision.blocked(p, y));
interiors.push(...athletics.interiors);
const collision = createCollision(data, interiors, new Set([...interiors.map((i) => i.anchor.buildingId), ...orchard.footprintParts.map((p) => p.id)]));
const baseline = JSON.stringify({ data, anchors, interiors: interiors.map(({ anchor, floors, ramps, colliders }) => ({ anchor, floors, ramps, colliders })) });
const enabled = { ...defaults, halloween: true, population: true, reducedMotion: false };
const poseAt = (point) => ({ x: point[0], z: point[1], y: 0 });
const groups = [...interiors.map((i) => i.group).filter(Boolean), athletics.group];
function overlay(blocked = collision.blocked) {
  const value = createHalloween(data, anchors, interiors, blocked);
  groups.push(value.group); return value;
}
after(() => {
  const resources = new Set();
  for (const group of groups) group.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.dispose();
});

const { createHalloweenHeroes, halloweenHeroRoster, buildHeroGeometry, halloweenHeroLimits } = await import("./halloween-heroes.ts");
const heroGroups=[];
after(()=>heroGroups.forEach((h)=>h.dispose()));
function heroes() { const monsters=overlay();const h=createHalloweenHeroes(monsters.monsters,interiors,collision.blocked);heroGroups.push(h);return {h,monsters}; }
const actorState=(h)=>h.actors.map((a)=>({point:[...a.point],stride:a.stride,pause:a.pause,direction:a.direction}));
const renderedState=(h)=>({ bodies:[...h.bodies._matricesTexture.image.data],visible:h.bodies._instanceInfo.map((i)=>i.visible),legs:[...h.legs.instanceMatrix.array],boots:[...h.boots.instanceMatrix.array],count:h.legs.count });

test("all 24 representative comic, manga and original robot visitors have distinct original finite models",(t)=>{
  assert.equal(halloweenHeroRoster.length,24);
  const names=halloweenHeroRoster.map((h)=>h.name);
  for(const name of ["Spider-Man","Superman","Superwoman","Batman","Hulk","Wolverine","Naruto","Goku","Sailor Moon","Luffy","Astro Boy"])assert.ok(names.includes(name));
  const signatures=new Set();let bytes=0;
  for(const hero of halloweenHeroRoster){
    const near=buildHeroGeometry(hero,true),far=buildHeroGeometry(hero,false);
    try{
      for(const g of [near,far])for(const name of ["position","normal","color"])assert.ok(Array.from(g.attributes[name].array).every(Number.isFinite));
      const bounds=near.boundingBox;assert.ok(bounds.min.y>=0&&bounds.max.y<2.5&&bounds.min.x>-.81&&bounds.max.x<.81,"Costumes fit human-scale outdoor circulation");
      assert.ok(far.attributes.position.count<near.attributes.position.count,`${hero.id} has cheaper far geometry`);
      signatures.add(JSON.stringify([Array.from(near.attributes.position.array),Array.from(near.attributes.color.array)]));
      bytes+=Object.values(near.attributes).reduce((n,a)=>n+a.array.byteLength,0)+Object.values(far.attributes).reduce((n,a)=>n+a.array.byteLength,0);
    }finally{near.dispose();far.dispose();}
  }
  assert.equal(signatures.size,24,"Every costume differs beyond its name");assert.ok(bytes<4_000_000,"Entire 24-person near/far geometry atlas remains bounded");t.diagnostic(`Costume atlas: ${bytes} bytes for 24 near/far models`);
});

test("actual-campus placements cover the roster and use distinct clear source segments away from monsters and arrival",()=>{
  const {h,monsters}=heroes();assert.equal(h.actors.length,24);
  assert.equal(new Set(h.actors.map((a)=>a.routeId)).size,24,"No army of heroes on one path");
  for(const [i,a]of h.actors.entries()){
    assert.ok(monsters.monsters.some((m)=>m.routeId===a.routeId&&JSON.stringify(m.route)===JSON.stringify(a.route)));
    for(const peer of [...monsters.monsters,...h.actors.slice(i+1)])assert.ok(Math.hypot(a.point[0]-peer.point[0],a.point[1]-peer.point[1])>=8);
    assert.ok(Math.hypot(a.point[0]-gatewaySpawn[0],a.point[1]-gatewaySpawn[1])>=8);
    for(let n=0;n<=20;n++){const p=[a.route[0][0]+(a.route[1][0]-a.route[0][0])*n/20,a.route[0][1]+(a.route[1][1]-a.route[0][1])*n/20];
      assert.equal(collision.blocked(p,0),false);assert.equal(floorAt(p,0,interiors),0);assert.equal(data.buildings.some((b)=>inPolygon(p,b.rings)),false);
      for(let side=0;side<8;side++)assert.equal(collision.blocked([p[0]+Math.cos(side*Math.PI/4)*.5,p[1]+Math.sin(side*Math.PI/4)*.5],0),false,"Shoulder and prop envelope clears buildings");
    }
  }
  assert.ok(Math.max(...h.actors.map((a)=>a.point[1]))-Math.min(...h.actors.map((a)=>a.point[1]))>1000,"Visitors are dispersed across campus");
  assert.equal(JSON.stringify({data,anchors,interiors:interiors.map(({anchor,floors,ramps,colliders})=>({anchor,floors,ramps,colliders}))}),baseline);
});

test("heroes walk with bounded steps, animate legs, and reciprocally yield to monsters and visitors",()=>{
  const {h,monsters}=heroes(),a=h.actors[0];a.pause=0;const start=[...a.point],pose=poseAt([a.point[0]+5,a.point[1]+5]);
  h.update(0,enabled,pose);const before=Array.from(h.legs.instanceMatrix.array);
  for(let i=0;i<120;i++){const old=[...a.point];monsters.update(.05,enabled,pose,h.actors);h.update(.05,enabled,pose);assert.ok(Math.hypot(a.point[0]-old[0],a.point[1]-old[1])<=a.speed*.05+1e-8);assert.ok(segmentDistance(a.point,...a.route)<1e-7);assert.equal(collision.blocked(a.point,0),false);}
  assert.ok(Math.hypot(a.point[0]-start[0],a.point[1]-start[1])>.5);assert.notDeepEqual(Array.from(h.legs.instanceMatrix.array),before);
  for(const hero of h.actors)for(const m of monsters.monsters)assert.ok(Math.hypot(hero.point[0]-m.point[0],hero.point[1]-m.point[1])>=2.3,"Cross-population yielding prevents overlaps");
  const point=[...a.point];h.update(.1,enabled,poseAt(point));assert.deepEqual(a.point,point);
  const m=monsters.monsters[0];m.pause=0;const mp=[...m.point];monsters.update(.1,enabled,poseAt([mp[0]+5,mp[1]+5]),[{point:mp}]);assert.deepEqual(m.point,mp,"Monsters also yield to hero positions");
});

test("edition/population off hide and freeze visitors, reduced motion freezes models, toggles reuse resources",()=>{
  const {h}=heroes(),pose=poseAt(h.actors[0].point);h.update(.1,enabled,pose);const state=actorState(h),rendered=renderedState(h),children=[...h.group.children];
  for(const patch of [{halloween:false},{population:false}]){h.update(10,{...enabled,...patch},pose);assert.equal(h.group.visible,false);assert.deepEqual(actorState(h),state);assert.deepEqual(renderedState(h),rendered);}
  h.update(10,{...enabled,reducedMotion:true},pose);assert.equal(h.group.visible,true);assert.deepEqual(actorState(h),state);assert.deepEqual(renderedState(h),rendered);
  for(let i=0;i<20;i++)h.update(0,{...enabled,halloween:!!(i%2)},pose);assert.deepEqual(h.group.children,children);assert.equal(children.length,4,"One costume batch, two shared limb meshes and one reused label");
});

test("only a nearby fictional label appears, respects markers, and does not introduce directory records",()=>{
  const {h}=heroes(),a=h.actors[0],pose=poseAt([a.point[0]+3,a.point[1]]);h.update(0,enabled,pose);
  assert.equal(h.label.visible,true);assert.match(h.label.userData.text,/Fictional visitor/);assert.ok(h.label.userData.text.includes(a.name));
  assert.equal(h.group.children.filter((o)=>o.isSprite).length,1);h.update(0,{...enabled,markers:false},pose);assert.equal(h.label.visible,false);
  h.update(0,enabled,poseAt([a.point[0]+5000,a.point[1]]));assert.equal(h.label.visible,false);
  assert.equal(h.group.userData.info,undefined);
});

test("quality budgets limit submitted costumes and disposal releases batch textures and shared resources once",()=>{
  const {h}=heroes(),pose=poseAt(h.actors[0].point);
  for(const quality of ["low","medium","auto","high","ultra"]){h.update(0,{...enabled,quality},pose);assert.ok(h.bodies._instanceInfo.filter((i)=>i.visible).length<=halloweenHeroLimits[quality]);}
  const resources=[h.bodies.geometry,h.bodies.material,h.bodies._matricesTexture,h.bodies._indirectTexture,h.legs.geometry,h.boots.geometry,h.legs.material,h.label.material.map,h.label.material];
  const counts=new Map(resources.map((r)=>[r,0]));for(const r of resources)r.addEventListener("dispose",()=>counts.set(r,counts.get(r)+1));
  const scene=new THREE.Scene();scene.add(h.group);h.dispose();h.dispose();
  for(const count of counts.values())assert.equal(count,1);assert.equal(scene.children.length,0);assert.equal(h.group.children.length,0);h.update(.1,enabled,pose);assert.equal(h.group.children.length,0);
});


test("route eligibility rejects a shoulder-level obstruction even when its entire centreline is clear",()=>{
  const {h,monsters}=heroes(),a=h.actors[0],dx=(a.route[1][0]-a.route[0][0])/a.length,dz=(a.route[1][1]-a.route[0][1])/a.length;
  const centre=[(a.route[0][0]+a.route[1][0])/2,(a.route[0][1]+a.route[1][1])/2],obstacle=[centre[0]-dz*.58,centre[1]+dx*.58];
  const blocked=(p,y)=>collision.blocked(p,y)||Math.hypot(p[0]-obstacle[0],p[1]-obstacle[1])<.22;
  assert.equal(blocked(centre,0),false,"The old centre-only check would accept this path");
  const revised=createHalloweenHeroes(monsters.monsters,interiors,blocked);heroGroups.push(revised);
  assert.equal(revised.actors.some((hero)=>hero.routeId===a.routeId),false,"Swept costume envelope excludes the unsafe segment");
  assert.equal(revised.actors.length,24,"A different safe source path preserves full roster coverage");
});
