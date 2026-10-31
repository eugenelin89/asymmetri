// Original procedural fan-costume geometry. No external assets or actor likenesses.
// Character names remain their respective owners' fictional properties; these
// decorative visitors do not imply affiliation, endorsement or a complete roster.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Point, Pose, Settings } from "./types";
import { floorAt, type Interior } from "./spatial";

export const halloweenHeroRoster = [
  { id: "spider-man", name: "Spider-Man", suit: 0xb73139, pants: 0x224d8c, boots: 0xb73139, skin: 0xb73139 },
  { id: "superman", name: "Superman", suit: 0x27599c, pants: 0x27599c, boots: 0xb53b3c, skin: 0xc99b79 },
  { id: "superwoman", name: "Superwoman", suit: 0x275992, pants: 0x275992, boots: 0xad3545, skin: 0xb88c6c },
  { id: "wonder-woman", name: "Wonder Woman", suit: 0xa53642, pants: 0x2c527d, boots: 0xa93f46, skin: 0xb88b68 },
  { id: "batman", name: "Batman", suit: 0x5a6571, pants: 0x414c59, boots: 0x222b39, skin: 0x293344 },
  { id: "iron-man", name: "Iron Man", suit: 0xa42e35, pants: 0x97333a, boots: 0xa72c31, skin: 0x9f3037 },
  { id: "captain-america", name: "Captain America", suit: 0x32567f, pants: 0x32567f, boots: 0x8c3538, skin: 0x32567f },
  { id: "thor", name: "Thor", suit: 0x44535d, pants: 0x35434d, boots: 0x695144, skin: 0xc9a081 },
  { id: "hulk", name: "Hulk", suit: 0x679b4b, pants: 0x635176, boots: 0x679b4b, skin: 0x679b4b },
  { id: "black-panther", name: "Black Panther", suit: 0x252d3c, pants: 0x252d3c, boots: 0x252d3c, skin: 0x252d3c },
  { id: "flash", name: "The Flash", suit: 0xb83636, pants: 0xb83636, boots: 0xd2aa4c, skin: 0xb83636 },
  { id: "wolverine", name: "Wolverine", suit: 0xd6b339, pants: 0x324f76, boots: 0x2d4667, skin: 0xd6b339 },
  { id: "captain-marvel", name: "Captain Marvel", suit: 0x27465f, pants: 0x27465f, boots: 0x9b333b, skin: 0xcfa282 },
  { id: "supergirl", name: "Supergirl", suit: 0x315f91, pants: 0xbb957c, boots: 0xb43c46, skin: 0xc6a082 },
  { id: "doctor-strange", name: "Doctor Strange", suit: 0x35526a, pants: 0x35526a, boots: 0x514449, skin: 0xb88e70 },
  { id: "deadpool", name: "Deadpool", suit: 0xac353e, pants: 0xac353e, boots: 0x292c39, skin: 0xac353e },
  { id: "naruto", name: "Naruto", suit: 0xd77b34, pants: 0xd77b34, boots: 0x344052, skin: 0xcda080 },
  { id: "goku", name: "Goku", suit: 0xd67b34, pants: 0xd67b34, boots: 0x365581, skin: 0xc59a77 },
  { id: "sailor-moon", name: "Sailor Moon", suit: 0xe5e1d2, pants: 0xcda587, boots: 0xa83b4d, skin: 0xcda587 },
  { id: "luffy", name: "Luffy", suit: 0xb5473f, pants: 0x3d6c9c, boots: 0x795b42, skin: 0xc5a079 },
  { id: "astro-boy", name: "Astro Boy", suit: 0xd3ab8f, pants: 0x303544, boots: 0xc83c3f, skin: 0xd3ab8f },
  { id: "campus-mecha", name: "Atlas · campus mecha", suit: 0xc8d3cf, pants: 0x3d637d, boots: 0x334c63, skin: 0xc8d3cf },
  { id: "retro-robot", name: "Rivet · retro robot", suit: 0x8caba8, pants: 0x6b8585, boots: 0x9a5c45, skin: 0xb4c2b6 },
  { id: "service-robot", name: "Pip · service robot", suit: 0xd8dfd4, pants: 0x465662, boots: 0x3d5362, skin: 0xd8dfd4 },
] as const;
type Hero = typeof halloweenHeroRoster[number];
type RouteSeed = { routeId: string; route: [Point, Point]; point: Point };
export type HalloweenHeroActor = { id: string; name: string; point: Point; routeId: string; route: [Point, Point]; length: number; distance: number; direction: number; speed: number; pause: number; stride: number; scale: number };
export const halloweenHeroLimits = { low: 8, medium: 12, auto: 16, high: 24, ultra: 24 } as const;
const gold = 0xd4b45d, red = 0xa83541, dark = 0x252d3b, white = 0xe6e4d7;
const heightScale = (id: string) => id === "hulk" ? 1.12 : id === "campus-mecha" ? 1.06 : id === "astro-boy" ? 0.74 : id === "service-robot" ? 0.54 : 1;

/** Public for geometry validation; every costume is built from original primitives. */
export function buildHeroGeometry(hero: Hero, detailed: boolean) {
  const pieces: THREE.BufferGeometry[] = [], id = hero.id, segments = detailed ? 9 : 5;
  const add = (g: THREE.BufferGeometry, colour: number, x = 0, y = 0, z = 0) => {
    g.translate(x, y, z); const geometry = g.index ? g.toNonIndexed() : g;
    if (geometry !== g) g.dispose(); geometry.deleteAttribute("uv");
    const c = new THREE.Color(colour), values = new Float32Array(geometry.attributes.position.count * 3);
    for (let i = 0; i < geometry.attributes.position.count; i++) c.toArray(values, i * 3);
    geometry.setAttribute("color", new THREE.BufferAttribute(values, 3)); pieces.push(geometry);
  };
  const box = (c: number, x: number, y: number, z: number, w: number, h: number, d: number) => add(new THREE.BoxGeometry(w, h, d), c, x, y, z);
  const orb = (c: number, x: number, y: number, z: number, w: number, h: number, d: number) => add(new THREE.SphereGeometry(1, segments, detailed ? 6 : 3).scale(w, h, d), c, x, y, z);
  const line = (c: number, a: number[], b: number[], radius: number) => {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b), delta = to.clone().sub(from);
    const g = new THREE.CylinderGeometry(radius, radius, delta.length(), detailed ? 6 : 4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    const mid = from.add(to).multiplyScalar(0.5); add(g, c, mid.x, mid.y, mid.z);
  };
  const disk = (c: number, x: number, y: number, z: number, radius: number) => add(new THREE.CircleGeometry(radius, detailed ? 18 : 8), c, x, y, z);
  const star = (c: number, x: number, y: number, z: number, radius: number) => {
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) { const angle = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? radius * 0.42 : radius; if (!i) s.moveTo(Math.cos(angle) * r, Math.sin(angle) * r); else s.lineTo(Math.cos(angle) * r, Math.sin(angle) * r); }
    s.closePath(); add(new THREE.ShapeGeometry(s), c, x, y, z);
  };
  const cape = (c: number, collar = false) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([-0.26,1.53,-0.16,-0.55,0.25,-0.28,0.55,0.25,-0.28, -0.26,1.53,-0.16,0.55,0.25,-0.28,0.26,1.53,-0.16, -0.26,1.53,-0.16,0.26,1.53,-0.16,0.55,0.25,-0.28, -0.26,1.53,-0.16,0.55,0.25,-0.28,-0.55,0.25,-0.28],3)); g.computeVertexNormals(); add(g,c);
    if (collar) for (const x of [-0.24,0.24]) add(new THREE.ConeGeometry(0.15,0.34,3),c,x,1.69,-0.13);
  };
  const hair = (c: number, long = false) => { orb(c,0,1.99,-0.025,0.215,0.13,0.19); if (long) orb(c,0,1.72,-0.13,0.23,0.30,0.11); };
  const spikes = (c: number, count = 5) => { for (let i = 0; i < count; i++) add(new THREE.ConeGeometry(0.105,0.31+(i%2)*0.09,4).rotateZ((i-(count-1)/2)*-0.23),c,(i-(count-1)/2)*0.077,2.04+(i%2)*0.045,-0.02); };
  const shield = (letter: "S" | "W") => {
    add(new THREE.PlaneGeometry(0.29,0.29).rotateZ(Math.PI/4),red,0,1.34,0.222);
    add(new THREE.PlaneGeometry(0.23,0.23).rotateZ(Math.PI/4),gold,0,1.34,0.226);
    if (detailed) {
      const p = letter === "S" ? [[0.07,0.09],[-0.06,0.09],[-0.08,0.02],[0.07,-0.02],[0.06,-0.09],[-0.07,-0.09]] : [[-0.09,0.07],[-0.045,-0.08],[0,0.025],[0.045,-0.08],[0.09,0.07]];
      for(let i=1;i<p.length;i++)line(red,[p[i-1][0],1.34+p[i-1][1],0.232],[p[i][0],1.34+p[i][1],0.232],0.016);
    }
  };
  const robot = id === "campus-mecha" || id === "retro-robot" || id === "service-robot";
  if (robot) {
    box(hero.suit,0,1.2,0,id === "campus-mecha" ? 0.71 : 0.55,0.65,0.36);
    box(hero.skin,0,1.81,0,0.44,0.36,0.35);
    box(0x22445a,0,1.85,0.182,0.34,0.12,0.025); box(0x8ad8cc,0,1.86,0.20,0.25,0.035,0.01);
    if(detailed)for(const x of [-.41,.41])for(const y of [1.13,1.46])orb(0x789291,x,y,.02,.10,.10,.12);
    for (const x of [-0.42,0.42]) { box(hero.pants,x,1.27,0,0.19,0.51,0.23); box(gold,x,0.98,0.035,0.17,0.14,0.20); }
    if (id === "campus-mecha") { for(const x of [-0.41,0.41])box(hero.suit,x,1.55,0,0.24,0.23,0.32); line(gold,[-0.14,1.98,0],[-0.26,2.19,0],0.024); line(gold,[0.14,1.98,0],[0.26,2.19,0],0.024); box(0xa65f3f,0,1.30,0.195,0.23,0.22,0.028); }
    else if (id === "retro-robot") { line(dark,[0,1.98,0],[0,2.21,0],0.025); orb(red,0,2.23,0,0.06,0.06,0.06); for(const x of [-0.27,0.27])orb(gold,x,1.82,0,0.06,0.09,0.09); for(const y of [1.12,1.22,1.32])box(dark,0,y,0.19,0.28,0.025,0.02); }
    else { orb(white,0,1.23,0,0.38,0.49,0.29); disk(0x5c9cab,0,1.34,0.29,0.12); for(const x of [-0.28,0.28])orb(dark,x,0.68,0,0.13,0.15,0.12); }
  } else {
    orb(hero.suit,0,1.21,0,id === "hulk" ? 0.38 : 0.29,0.39,0.205);
    orb(hero.skin,0,1.79,0,0.205,0.25,0.18);
    for(const sign of [-1,1]) { const x=sign*(id === "hulk" ? 0.42 : 0.34); line(hero.suit,[x,1.46,0],[x+sign*0.07,0.99,0.02],id === "hulk" ? 0.135 : 0.095); orb(["spider-man","deadpool","black-panther","iron-man","flash","batman"].includes(id) ? hero.suit : hero.skin,x+sign*0.07,0.94,0.025,0.09,0.11,0.09); }
    box(hero.boots,0,0.96,0,0.46,0.13,0.32);
    if (detailed) for(const x of [-0.075,0.075])orb(dark,x,1.83,0.174,0.025,0.025,0.009);
  }
  if (!detailed) for(const x of [-0.14,0.14]) { box(hero.pants,x,0.48,0,0.18,0.85,0.19); box(hero.boots,x,0.085,0.075,0.21,0.17,0.32); }
  if (id === "spider-man") {
    for(const x of [-0.09,0.09]) { orb(dark,x,1.85,0.174,0.079,0.057,0.022); orb(white,x,1.85,0.193,0.060,0.041,0.012); }
    if(detailed) { for(const y of [1.09,1.25,1.42,1.69,1.97])line(dark,[-0.17,y,0.19],[0.17,y,0.19],0.007); for(const x of [-0.12,0,0.12])line(dark,[x,1.05,0.21],[x,1.5,0.21],0.007); orb(dark,0,1.33,0.23,0.035,0.065,0.014); for(const sign of [-1,1])for(let n=0;n<4;n++)line(dark,[0,1.32,0.23],[sign*0.11,1.23+n*0.055,0.23],0.008); }
    for(const x of [-0.20,0.20])box(hero.pants,x,1.23,0.12,0.09,0.36,0.19);
  } else if (["superman","superwoman","supergirl"].includes(id)) { cape(red); shield(id === "superwoman" ? "W" : "S"); hair(id === "supergirl" ? gold : dark,id !== "superman"); if(id === "supergirl")add(new THREE.CylinderGeometry(0.24,0.36,0.32,9),red,0,0.91,0); }
  else if (id === "wonder-woman") { hair(dark,true); box(gold,0,1.94,0.16,0.31,0.035,0.04); star(red,0,1.95,0.187,0.028); for(const sign of [-1,1]){line(gold,[sign*0.22,1.44,0.17],[0,1.3,0.23],0.026);box(gold,sign*0.40,1.05,0.02,0.18,0.12,0.18);} add(new THREE.TorusGeometry(0.15,0.012,4,16),gold,0.31,0.96,0.17); }
  else if (id === "batman") { cape(dark); for(const x of [-0.14,0.14])add(new THREE.ConeGeometry(0.075,0.30,4),dark,x,2.03,0); orb(0xc39a7c,0,1.67,0.12,0.12,0.08,0.075); disk(gold,0,1.32,0.214,0.14); if(detailed){ for(const sign of [-1,1])add(new THREE.ConeGeometry(0.12,0.18,3).rotateZ(sign*0.8),dark,sign*0.07,1.32,0.226); } box(gold,0,0.98,0.17,0.43,0.07,0.03); }
  else if (id === "iron-man") { orb(gold,0,1.81,0.13,0.145,0.19,0.085); for(const x of [-0.065,0.065])box(0xb3e7e3,x,1.85,0.215,0.075,0.028,0.01);disk(0x8ed6dc,0,1.34,0.22,0.075); for(const x of [-0.29,0.29])orb(gold,x,1.45,0,0.13,0.15,0.14); }
  else if (id === "captain-america") { star(white,0,1.35,0.221,0.12); box(white,0,1.96,0.15,0.055,0.06,0.025);for(const [radius,c] of [[0.28,red],[0.22,white],[0.16,red],[0.11,0x345f8b]])disk(c,-0.43,1.2,0.16+(.3-radius)*.04,radius);star(white,-0.43,1.2,0.176,0.08); }
  else if (id === "thor") { cape(red); hair(gold,true);add(new THREE.SphereGeometry(1,segments,4).scale(0.22,0.13,0.19),0xa5b5b6,0,1.99,0);for(const x of [-0.26,0.26])add(new THREE.ConeGeometry(0.09,0.25,3).rotateZ(x>0?-.45:.45),white,x,2.02,0);for(const x of [-0.14,0.14])for(const y of [1.16,1.39])disk(0xaebec0,x,y,0.20,0.055);line(0x755342,[0.43,0.84,0.07],[0.43,1.16,0.07],0.035);box(0x9eaeac,0.43,1.21,0.07,0.35,0.23,0.24); }
  else if (id === "hulk") { hair(dark); for(const x of [-0.18,0.18])orb(hero.skin,x,1.37,0.14,0.19,0.16,0.13); }
  else if (id === "black-panther") {for(const x of [-0.13,0.13])add(new THREE.ConeGeometry(0.075,0.18,3),dark,x,2.02,0);for(let i=0;i<7;i++)add(new THREE.ConeGeometry(0.025,0.10,3).rotateX(Math.PI),0xb6c3c7,(i-3)*0.055,1.46-Math.abs(i-3)*0.025,0.19);for(const x of [-0.075,0.075])box(white,x,1.85,0.18,0.06,0.02,0.015);}
  else if (id === "flash") {disk(white,0,1.33,0.22,0.12);line(gold,[0.05,1.45,0.229],[-0.04,1.32,0.229],0.026);line(gold,[-0.04,1.32,0.229],[0.04,1.34,0.229],0.026);line(gold,[0.04,1.34,0.229],[-0.05,1.21,0.229],0.026);for(const sign of [-1,1])line(gold,[sign*.19,1.80,0],[sign*.27,1.94,0],.025);}
  else if (id === "wolverine") {for(const sign of [-1,1]){add(new THREE.ConeGeometry(0.15,.44,3).rotateZ(-sign*.30),dark,sign*.17,2.03,0);for(let i=0;i<3;i++)line(0xcbd5d0,[sign*.41+(i-1)*.035,.94,.08],[sign*.41+(i-1)*.035,.72,.27],.012);}box(dark,0,1.04,.20,.30,.04,.02);}
  else if (id === "captain-marvel") {hair(gold);box(red,0,1.43,.17,.47,.19,.08);star(gold,0,1.35,.23,.13);line(gold,[-.25,1.4,.19],[.25,1.4,.19],.014);}
  else if (id === "doctor-strange") {cape(red,true);hair(dark);orb(dark,0,1.63,.13,.09,.07,.07);disk(gold,0,1.36,.22,.06);box(0x805446,0,.99,.18,.45,.10,.03);}
  else if (id === "deadpool") {for(const x of [-.09,.09]){orb(dark,x,1.83,.16,.083,.115,.04);orb(white,x,1.85,.196,.048,.026,.012);}line(dark,[-.25,1.48,.17],[.23,1.0,.18],.055);for(const sign of [-1,1])line(dark,[sign*.12,1.17,-.22],[-sign*.33,1.90,-.22],.033);}
  else if (id === "naruto") {spikes(gold,7);box(0x334b65,0,1.94,.17,.34,.075,.045);box(0xa7b8b8,0,1.94,.198,.19,.055,.014);box(dark,0,1.39,.16,.44,.21,.08); if(detailed)for(const sign of [-1,1])for(let i=0;i<3;i++)line(dark,[sign*.10,1.76-i*.035,.176],[sign*.16,1.75-i*.035,.176],.005);}
  else if (id === "goku") {spikes(dark,6);box(0x2b5083,0,.99,.18,.44,.10,.035);for(const x of [-.40,.40])box(0x34578a,x,1.03,.02,.18,.13,.17);disk(white,.15,1.36,.20,.065);}
  else if (id === "sailor-moon") {hair(gold,true);for(const sign of [-1,1]){orb(gold,sign*.21,2.0,0,.085,.085,.085);line(gold,[sign*.22,1.97,-.05],[sign*.29,1.13,-.04],.045);line(0x355888,[sign*.22,1.48,.15],[0,1.27,.23],.052);add(new THREE.ConeGeometry(.12,.15,3).rotateZ(sign*Math.PI/2),red,sign*.09,1.28,.25);}add(new THREE.CylinderGeometry(.23,.35,.31,10),0x355888,0,.92,0);box(gold,0,1.95,.17,.25,.025,.03);}
  else if (id === "luffy") {hair(dark);add(new THREE.CylinderGeometry(.30,.31,.14,segments),gold,0,2.08,0);add(new THREE.CylinderGeometry(.43,.43,.035,segments+3),gold,0,2.01,0);add(new THREE.CylinderGeometry(.31,.31,.035,segments),red,0,2.04,0);box(hero.skin,0,1.30,.19,.13,.41,.06);}
  else if (id === "astro-boy") {spikes(dark,3); for(const x of [-.074,.074])orb(white,x,1.84,.175,.047,.06,.018); }
  const geometry = mergeGeometries(pieces)!; pieces.forEach((g)=>g.dispose()); geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}

/** Uses the existing Halloween route eligibility, without rebuilding a second
 * source graph. Seeds retain live monster positions for reciprocal yielding. */
export function createHalloweenHeroes(seeds: readonly RouteSeed[], interiors: Interior[], blocked: (p: Point, y: number) => boolean, gatewaySpawn: Point = [0, 0]) {
  const group = new THREE.Group();group.name="halloween-fictional-visitors";group.visible=false;
  const actors: HalloweenHeroActor[]=[];
  const routeClearance=new Map<RouteSeed,boolean>();
  const clearRoute=(seed:RouteSeed,length:number)=>{
    if(routeClearance.has(seed))return routeClearance.get(seed)!;
    const steps=Math.ceil(length/.75);let clear=true;
    for(let n=0;n<=steps&&clear;n++)for(let side=0;side<8;side++){
      const p:Point=[seed.route[0][0]+(seed.route[1][0]-seed.route[0][0])*n/steps+Math.cos(side*Math.PI/4)*.6,seed.route[0][1]+(seed.route[1][1]-seed.route[0][1])*n/steps+Math.sin(side*Math.PI/4)*.6];
      if(blocked(p,0)||Math.abs(floorAt(p,0,interiors))>.05){clear=false;break;}
    }
    routeClearance.set(seed,clear);return clear;
  };
  for(const hero of halloweenHeroRoster) {
    let selected: HalloweenHeroActor | undefined;
    for(const seed of seeds) {
      const length=Math.hypot(seed.route[1][0]-seed.route[0][0],seed.route[1][1]-seed.route[0][1]);
      if(length<26 || actors.some((a)=>a.routeId===seed.routeId))continue;
      for(const t of [.18,.82,.28,.72]) {
        const point: Point=[seed.route[0][0]+(seed.route[1][0]-seed.route[0][0])*t,seed.route[0][1]+(seed.route[1][1]-seed.route[0][1])*t];
        if(Math.hypot(point[0]-gatewaySpawn[0],point[1]-gatewaySpawn[1])<8 || [...seeds,...actors].some((a)=>Math.hypot(point[0]-a.point[0],point[1]-a.point[1])<8))continue;
        if(Array.from({length:8},(_,i):Point=>[point[0]+Math.cos(i*Math.PI/4)*.6,point[1]+Math.sin(i*Math.PI/4)*.6]).some((p)=>blocked(p,0)||Math.abs(floorAt(p,0,interiors))>.05))continue;
        if(!clearRoute(seed,length))continue;
        selected={id:hero.id,name:hero.name,routeId:seed.routeId,route:[[...seed.route[0]],[...seed.route[1]]],point,length,distance:length*t,direction:actors.length%2?-1:1,speed:.8+(actors.length%5)*.08,pause:actors.length%3,stride:0,scale:heightScale(hero.id)};break;
      }
      if(selected)break;
    }
    if(selected)actors.push(selected);
  }
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.76});
  const geometries=halloweenHeroRoster.flatMap((h)=>[buildHeroGeometry(h,true),buildHeroGeometry(h,false)]);
  const bodies=new THREE.BatchedMesh(halloweenHeroRoster.length*2,geometries.reduce((n,g)=>n+g.attributes.position.count,0),0,material);bodies.name="halloween-hero-costume-batch";bodies.frustumCulled=false;
  const instances=geometries.map((g)=>{const id=bodies.addInstance(bodies.addGeometry(g));bodies.setVisibleAt(id,false);g.dispose();return id;});group.add(bodies);
  const limbMaterial=new THREE.MeshStandardMaterial({roughness:.8});
  const legGeometry=new THREE.CylinderGeometry(.09,.10,.7,7).translate(0,-.35,0),bootGeometry=new THREE.BoxGeometry(.21,.16,.34).translate(0,-.73,.065);
  const legs=new THREE.InstancedMesh(legGeometry,limbMaterial,actors.length*2),boots=new THREE.InstancedMesh(bootGeometry,limbMaterial,actors.length*2);
  legs.name="halloween-hero-legs";boots.name="halloween-hero-boots";legs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);boots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);legs.frustumCulled=boots.frustumCulled=false;group.add(legs,boots);
  const canvas=typeof document!=="undefined"?document.createElement("canvas"):null;if(canvas){canvas.width=640;canvas.height=96;}
  const texture=canvas?new THREE.CanvasTexture(canvas):new THREE.DataTexture(new Uint8Array([0,0,0,0]),1,1);texture.colorSpace=THREE.SRGBColorSpace;
  const label=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));label.name="halloween-nearby-fictional-label";label.scale.set(3.5,.525,1);label.visible=false;group.add(label);
  let labelId="",disposed=false;
  const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),scale=new THREE.Vector3(),rotation=new THREE.Quaternion(),tilt=new THREE.Quaternion(),axisY=new THREE.Vector3(0,1,0),axisX=new THREE.Vector3(1,0,0),colour=new THREE.Color();
  function update(dt:number,settings:Settings,pose:Pick<Pose,"x"|"y"|"z">) {
    if(disposed)return;
    group.visible=settings.halloween&&settings.population;if(!group.visible)return;
    const step=settings.reducedMotion?0:Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
    const visible=actors.map((a)=>({a,d:Math.hypot(a.point[0]-pose.x,a.point[1]-pose.z)})).filter(({d})=>d<(settings.quality==="low"?110:240)).sort((a,b)=>a.d-b.d).slice(0,halloweenHeroLimits[settings.quality]);
    for(const id of instances)bodies.setVisibleAt(id,false);legs.count=boots.count=0;label.visible=false;
    for(const {a,d} of visible) {
      if(step){if(a.pause>0)a.pause=Math.max(0,a.pause-step);else{
        const next=Math.max(1.2,Math.min(a.length-1.2,a.distance+a.direction*a.speed*step));
        const p:Point=[a.route[0][0]+(a.route[1][0]-a.route[0][0])*next/a.length,a.route[0][1]+(a.route[1][1]-a.route[0][1])*next/a.length];
        const visitorClose=Math.abs(pose.y)<2.5&&Math.hypot(p[0]-pose.x,p[1]-pose.z)<2.1;
        // The complete swept costume envelope was checked once on this source
        // segment; movement never leaves it. Recheck the centre for dynamic doors.
        if(!visitorClose&&!blocked(p,0)&&Math.abs(floorAt(p,0,interiors))<.05&&![...seeds,...actors].some((other)=>other!==a&&Math.hypot(p[0]-other.point[0],p[1]-other.point[1])<2.3)){a.stride+=Math.abs(next-a.distance)*4.3;a.distance=next;a.point=p;}
        if(next<=1.2||next>=a.length-1.2){a.direction*=-1;a.pause=1.8;}
      }}
      const index=halloweenHeroRoster.findIndex((h)=>h.id===a.id),hero=halloweenHeroRoster[index],near=d<(settings.quality==="low"?25:50);
      const yaw=Math.atan2((a.route[1][0]-a.route[0][0])*a.direction,(a.route[1][1]-a.route[0][1])*a.direction),bob=Math.abs(Math.sin(a.stride))*.016;
      matrix.compose(position.set(a.point[0],.035+bob,a.point[1]),rotation.setFromAxisAngle(axisY,yaw),scale.setScalar(a.scale));const instance=instances[index*2+(near?0:1)];bodies.setMatrixAt(instance,matrix);bodies.setVisibleAt(instance,true);
      if(near)for(const sign of [-1,1]){
        const slot=legs.count++,x=a.point[0]+Math.cos(yaw)*sign*.14*a.scale,z=a.point[1]-Math.sin(yaw)*sign*.14*a.scale;
        matrix.compose(position.set(x,.85*a.scale+.035+bob,z),rotation.setFromAxisAngle(axisY,yaw).multiply(tilt.setFromAxisAngle(axisX,Math.sin(a.stride)*sign*.32)),scale.setScalar(a.scale));
        legs.setMatrixAt(slot,matrix);boots.setMatrixAt(slot,matrix);legs.setColorAt(slot,colour.setHex(hero.pants));boots.setColorAt(slot,colour.setHex(hero.boots));boots.count++;
      }
      if(!label.visible&&d<9&&Math.abs(pose.y)<2.5&&settings.markers){
        const steps=Math.ceil(d/.5);let clear=true;for(let i=1;i<steps;i++)if(blocked([pose.x+(a.point[0]-pose.x)*i/steps,pose.z+(a.point[1]-pose.z)*i/steps],0)){clear=false;break;}
        if(clear){label.visible=true;label.position.set(a.point[0],2.48*a.scale,a.point[1]);label.userData.text=`${a.name} · Fictional visitor`;
          if(labelId!==a.id){labelId=a.id;const ctx=canvas?.getContext("2d");if(ctx){ctx.clearRect(0,0,640,96);ctx.fillStyle="rgba(18,30,40,.88)";ctx.fillRect(0,0,640,96);ctx.fillStyle="#f3e7cb";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="500 28px sans-serif";ctx.fillText(label.userData.text,320,48,610);texture.needsUpdate=true;}}
        }
      }
    }
    legs.instanceMatrix.needsUpdate=boots.instanceMatrix.needsUpdate=true;if(legs.instanceColor)legs.instanceColor.needsUpdate=true;if(boots.instanceColor)boots.instanceColor.needsUpdate=true;
  }
  function dispose(){if(disposed)return;disposed=true;group.removeFromParent();bodies.dispose();material.dispose();legs.dispose();boots.dispose();legGeometry.dispose();bootGeometry.dispose();limbMaterial.dispose();texture.dispose();label.material.dispose();group.clear();}
  return{group,actors,bodies,legs,boots,label,update,dispose};
}
