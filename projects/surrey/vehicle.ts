// SPDX-License-Identifier: MIT — Surrey-only arcade integration, in metres/seconds.
// Bicycle model and 120Hz substeps follow Vancouver's tested principles. Its code is unchanged.
import type { Point, Polygon } from "./types";
import { inPolygon, segmentDistance } from "../vancouver/physics";
export type Car = { x: number; z: number; yaw: number; speed: number; steer: number; blocked: boolean };
export type Body = Pick<Car, "x" | "z" | "yaw">;
export type DriveInput = { throttle: number; steering: number; brake: boolean };
export type Obstacle = { point: Point; radius: number } | { car: Body };
export const HALF_WIDTH = 1.02, HALF_LENGTH = 2.08;
export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function corners(car: Body, margin = 0): Point[] {
  const sin = Math.sin(car.yaw), cos = Math.cos(car.yaw);
  return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z]) => [car.x + x * (HALF_WIDTH + margin) * cos + z * (HALF_LENGTH + margin) * sin, car.z - x * (HALF_WIDTH + margin) * sin + z * (HALF_LENGTH + margin) * cos]);
}
export function bodyDistance(car: Body, p: Point) {
  const dx = p[0] - car.x, dz = p[1] - car.z;
  return Math.hypot(Math.max(0, Math.abs(dx * Math.cos(car.yaw) - dz * Math.sin(car.yaw)) - HALF_WIDTH), Math.max(0, Math.abs(dx * Math.sin(car.yaw) + dz * Math.cos(car.yaw)) - HALF_LENGTH));
}
const cross = (a: Point, b: Point, p: Point) => (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
export function intersects(a: Point, b: Point, c: Point, d: Point) {
  return cross(a,b,c)*cross(a,b,d) <= 0 && cross(c,d,a)*cross(c,d,b) <= 0 && Math.max(a[0],b[0]) >= Math.min(c[0],d[0]) && Math.max(c[0],d[0]) >= Math.min(a[0],b[0]) && Math.max(a[1],b[1]) >= Math.min(c[1],d[1]) && Math.max(c[1],d[1]) >= Math.min(a[1],b[1]);
}
export function bodiesOverlap(a: Body, b: Body, margin = .25) {
  const aa = corners(a, margin), bb = corners(b, margin);
  // Separating-axis test covers edges, corners and one body wholly inside another.
  for (const yaw of [a.yaw,b.yaw]) for (const axis of [[Math.cos(yaw),-Math.sin(yaw)],[Math.sin(yaw),Math.cos(yaw)]]) {
    const pa = aa.map(p=>p[0]*axis[0]+p[1]*axis[1]), pb = bb.map(p=>p[0]*axis[0]+p[1]*axis[1]);
    if (Math.max(...pa)<Math.min(...pb) || Math.max(...pb)<Math.min(...pa)) return false;
  }
  return true;
}
export const obstacleFree = (car: Body, obstacles: Obstacle[]) => obstacles.every(o => "car" in o ? !bodiesOverlap(car,o.car) : bodyDistance(car,o.point)>o.radius+.2);
/** Full oriented rectangle containment. Boundary intersections and enclosed holes
 * are rejected, including obstacles too small to hit a nine-point sample. */
export function createVehicleSurface(polygons: Polygon[]) {
  type Edge = { a: Point; b: Point };
  const cells = new Map<string,{ polygons: Polygon[]; edges: Edge[] }>();
  const cell = (x:number,z:number) => { const key=`${x},${z}`; if(!cells.has(key)) cells.set(key,{polygons:[],edges:[]}); return cells.get(key)!; };
  for(const poly of polygons) {
    const xs=poly[0].map(p=>p[0]), zs=poly[0].map(p=>p[1]);
    for(let x=Math.floor(Math.min(...xs)/32);x<=Math.floor(Math.max(...xs)/32);x++) for(let z=Math.floor(Math.min(...zs)/32);z<=Math.floor(Math.max(...zs)/32);z++) cell(x,z).polygons.push(poly);
    for(const ring of poly) for(let i=0;i<ring.length;i++) {
      const a=ring[i],b=ring[(i+1)%ring.length]; if(a[0]===b[0]&&a[1]===b[1]) continue;
      for(let x=Math.floor(Math.min(a[0],b[0])/32);x<=Math.floor(Math.max(a[0],b[0])/32);x++) for(let z=Math.floor(Math.min(a[1],b[1])/32);z<=Math.floor(Math.max(a[1],b[1])/32);z++) cell(x,z).edges.push({a,b});
    }
  }
  const allowed=(p:Point)=>(cells.get(`${Math.floor(p[0]/32)},${Math.floor(p[1]/32)}`)?.polygons??[]).some(poly=>inPolygon(p,poly));
  function fits(car:Body) {
    const ring=corners(car);
    if(!allowed([car.x,car.z]) || !ring.every(allowed)) return false;
    const edges=new Set<Edge>();
    for(let x=Math.floor((car.x-2.4)/32);x<=Math.floor((car.x+2.4)/32);x++) for(let z=Math.floor((car.z-2.4)/32);z<=Math.floor((car.z+2.4)/32);z++) for(const edge of cells.get(`${x},${z}`)?.edges??[]) edges.add(edge);
    for(const {a,b} of edges) {
      if(bodyDistance(car,a)<.025 || bodyDistance(car,b)<.025) return false;
      for(let i=0;i<4;i++) if(intersects(ring[i],ring[(i+1)%4],a,b) || segmentDistance(ring[i],a,b)<.025) return false;
    }
    return true;
  }
  return {allowed,fits};
}
export function stepVehicle(car:Car,input:DriveInput,delta:number,fits:(p:Body)=>boolean):Car {
  const elapsed=clamp(delta,0,.1), count=Math.max(1,Math.ceil(elapsed*120)),dt=elapsed/count;
  let next={...car};
  for(let i=0;i<count;i++) {
    const throttle=clamp(input.throttle,-1,1), steering=clamp(input.steering,-1,1);
    let speed=next.speed;
    if(input.brake || speed*throttle<-.08) speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-(input.brake?18:11)*dt);
    else if(throttle) speed+=throttle*(speed<0?3.2:4.8)*dt;
    else speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-(1.1+Math.abs(speed)*.23)*dt);
    speed=clamp(speed,-4,13);
    if (Math.abs(speed)<.05 && (input.brake || !throttle)) speed=0; // 47km/h maximum, useful slow manoeuvring and reverse.
    const limit=13-Math.abs(steering)*6;
    if(speed>limit) speed=Math.max(limit,speed-7*dt);
    const wheel=steering*Math.atan2(2.65,4.2+Math.abs(speed)*.45);
    const steer=next.steer+(wheel-next.steer)*(1-Math.exp(-12*dt));
    const yaw=next.yaw+speed/2.65*Math.tan(steer)*dt;
    const candidate={x:next.x+Math.sin(yaw)*speed*dt,z:next.z+Math.cos(yaw)*speed*dt,yaw:Math.atan2(Math.sin(yaw),Math.cos(yaw)),speed,steer,blocked:false};
    // Rotation and translation both checked at <=0.11m travel per step; start
    // plus midpoint guards catch narrow obstructions during a changing footprint.
    const midpoint={x:(next.x+candidate.x)/2,z:(next.z+candidate.z)/2,yaw:next.yaw+(yaw-next.yaw)/2};
    if(!fits(midpoint)||!fits(candidate)) {next={...next,speed:0,steer,blocked:true};break;}
    next=candidate;
  }
  return next;
}
