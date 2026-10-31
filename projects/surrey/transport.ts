// SPDX-License-Identifier: MIT — bounded local transport, no external routing service.
import raw from "../../public/surrey/v0.5-2026-10-30/transport.json" with { type: "json" };
import networkRaw from "../../public/surrey/v0.6-2026-10-30/network.json" with { type: "json" };
import type { City, Point, Polygon } from "./types";
import type { World } from "./world";
import { distance } from "./world";
import { bodyDistance, corners, intersects, createVehicleSurface, obstacleFree, type Car, type Body, type Obstacle } from "./vehicle";
import { createNavigator, createGuidance, projectPath, type RoadNetwork } from "./navigation";
import { signalState } from "./signals";
export type Delivery = { stage: "available" | "accepted" | "arrived" | "closed"; checkpoint: number; reward: 0 | 55 };
export type VehicleState = { available: true; occupied: boolean; car: Car };
export type Detour = { stage: "available" | "accepted" | "arrived" | "closed"; reward: 0 | 85; driven: number; roads: string[] };
export const newDetour = (): Detour => ({ stage: "available", reward: 0, driven: 0, roads: [] });
export const PACKAGE = "Case 05: community archive package";
export const roadNetwork = networkRaw as unknown as RoadNetwork;
export const roadVersion = networkRaw.version;
export const roadReport = networkRaw.validation;
export const roadworks = networkRaw.closure;
export const railStationDistance = raw.rail.stationDistanceM;
export const detourMission = networkRaw.mission as { giver: Point; recipient: Point; destination: string; minimumDrivenM: number; minimumRoads: number };
export function closureOverlaps(car: Body) {
  const halfW = roadworks.widthM / 2, halfL = roadworks.lengthM / 2, sin = Math.sin(roadworks.yaw), cos = Math.cos(roadworks.yaw);
  const zone: Point[] = [[-halfW,-halfL],[halfW,-halfL],[halfW,halfL],[-halfW,halfL]].map(([x,z])=>[roadworks.point[0]+x*cos+z*sin,roadworks.point[1]-x*sin+z*cos]);
  const body = corners(car);
  if (body.some(p=>{const dx=p[0]-roadworks.point[0],dz=p[1]-roadworks.point[1];return Math.abs(dx*cos-dz*sin)<halfW&&Math.abs(dx*sin+dz*cos)<halfL;})) return true;
  return body.some((p,i)=>zone.some((q,j)=>intersects(p,body[(i+1)%4],q,zone[(j+1)%4])));
}
export const PARCEL = "Case 04: community screening projector";
export type TransportData = {
  version: string; polygons: Polygon[]; route: Point[]; spawn: Body; giver: Point; recipient: Point;
  trafficPath: Point[]; rail: Point[]; graph: { nodes: Point[]; edges: [number,number][] };
};
export const transportData: TransportData = {
  version: networkRaw.version, polygons: networkRaw.driveSurface as Polygon[], route: raw.route as Point[],
  spawn: { x: raw.spawn.point[0], z: raw.spawn.point[1], yaw: raw.spawn.yaw },
  giver: raw.foot.request as Point, recipient: raw.foot.delivery as Point,
  trafficPath: networkRaw.trafficRoutes[0].points as Point[], rail: raw.rail.points as Point[],
  graph: { nodes: raw.route as Point[], edges: raw.route.slice(1).map((_,i)=>[i,i+1]) },
};
export const newDelivery = ():Delivery => ({ stage:"available", checkpoint:0, reward:0 });
export const newVehicle = ():VehicleState => ({ available:true, occupied:false, car:{...transportData.spawn,speed:0,steer:0,blocked:false} });
export function pathMetrics(points:Point[]) {
  const lengths=[0]; for(let i=1;i<points.length;i++) lengths.push(lengths[i-1]+distance(points[i-1],points[i]));
  return {points,lengths,length:lengths.at(-1)??0};
}
export type PathMetrics = ReturnType<typeof pathMetrics>;
export function onPath(path:PathMetrics,progress:number):Body {
  const d=Math.max(0,Math.min(path.length,progress)); let i=1;
  while(i<path.points.length-1 && path.lengths[i]<d) i++;
  const a=path.points[i-1], b=path.points[i], t=(d-path.lengths[i-1])/(path.lengths[i]-path.lengths[i-1]||1);
  return {x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,yaw:Math.atan2(b[0]-a[0],b[1]-a[1])};
}
/** A smooth out-and-back shuttle on ONE connected guideway, with 8s end dwells.
 * Bidirectional cars reverse travel, not their body orientation; no track jump. */
export function trainProgress(seconds:number,length:number) {
  const station=raw.rail.stationDistanceM, stops=[24,station,length-24,station,24],dwell=8;
  const durations=stops.slice(1).map((v,i)=>Math.max(5,Math.abs(v-stops[i])/8));
  const cycle=durations.reduce((sum,d)=>sum+d+dwell,0);let t=((seconds%cycle)+cycle)%cycle;
  for(let i=0;i<durations.length;i++) {
    if(t<dwell) return stops[i];t-=dwell;
    if(t<durations[i]) return stops[i]+(stops[i+1]-stops[i])*(1-Math.cos(Math.PI*t/durations[i]))/2;
    t-=durations[i];
  }
  return stops[0];
}
export function createTransport(city:City,world:World,data=transportData) {
  const surface=createVehicleSurface(data.polygons),route=pathMetrics(data.route),rail=pathMetrics(data.rail),trafficPath=pathMetrics(data.trafficPath);
  const navigator=createNavigator(roadNetwork,surface.fits),guidance=createGuidance(roadNetwork,navigator);
  if(!surface.fits(data.spawn) || route.length<100 || rail.length<60) throw new Error("Surrey transport geometry failed validation. Reload the city.");
  const recovery=[...data.route.map((p,i)=>onPath(route,route.lengths[i])),...roadNetwork.edges.flatMap(edge=>{
    const path=pathMetrics(edge.points);return Array.from({length:Math.max(1,Math.floor(path.length/12))},(_,i)=>onPath(path,Math.min(path.length-3,3+i*12)));
  })].flatMap(p=>[p,{...p,yaw:p.yaw+Math.PI}]).map(p=>({...p,speed:0,steer:0,blocked:false})).filter(p=>surface.fits(p));
  function recover(car:Car,obstacles:Obstacle[]=[],closed=false):Car|null {
    return [...recovery].sort((a,b)=>distance([a.x,a.z],[car.x,car.z])-distance([b.x,b.z],[car.x,car.z])).find(p=>(!closed||!closureOverlaps(p))&&obstacleFree(p,obstacles)&&exit(p,obstacles))??null;
  }
  function exit(car:Car,obstacles:Obstacle[]=[]):Point|null {
    for(const side of [-1,1]) for(const fore of [0,-1.5,1.5]) {
      const x=side*2.0, z=fore;
      const p:Point=[car.x+x*Math.cos(car.yaw)+z*Math.sin(car.yaw),car.z-x*Math.sin(car.yaw)+z*Math.cos(car.yaw)];
      if(world.fits(p) && world.clear([car.x,car.z],p) && obstacles.every(o=>"car" in o?bodyDistance(o.car,p)>.65:distance(o.point,p)>o.radius+.65)) return p;
    }
    return null;
  }
  const traffic=Array.from({length:6},(_,id)=>({id,progress:trafficPath.length*(id+.5)/6,speed:0,pose:onPath(trafficPath,trafficPath.length*(id+.5)/6),wait:0,distant:0,active:true}));
  function placeTraffic(obstacles:Obstacle[]) {
    const occupied:Obstacle[]=[...obstacles];
    for(const actor of traffic) {
      for(let i=0;i<Math.ceil(trafficPath.length/8);i++) {
        const progress=(actor.progress+i*8)%trafficPath.length,pose=onPath(trafficPath,progress);
        if(surface.fits(pose)&&obstacleFree(pose,occupied)){actor.progress=progress;actor.pose=pose;actor.speed=0;break;}
      }
      occupied.push({car:actor.pose});
    }
  }
  function tickTraffic(dt:number,player:Point,obstacles:Obstacle[],budget=6,seconds=0) {
    for(const actor of traffic) {
      // Reduced budgets park distant actors; never visibly remove/respawn a car.
      const far=distance([actor.pose.x,actor.pose.z],player)>160;
      actor.active=actor.id<budget || !far;
      if(!actor.active){actor.speed=0;continue;}
      actor.distant+=dt; if(far&&actor.distant<.25) continue;
      const elapsed=Math.min(.1,actor.distant); actor.distant=0;
      const ahead=onPath(trafficPath,(actor.progress+Math.max(5,actor.speed*1.4))%trafficPath.length);
      const nearSignal=city.signals.some(p=>distance(p,[actor.pose.x,actor.pose.z])<14);
      const light=signalState(seconds);
      const signalAhead=city.signals.some(p=>{const dx=p[0]-actor.pose.x,dz=p[1]-actor.pose.z,along=dx*Math.sin(actor.pose.yaw)+dz*Math.cos(actor.pose.yaw),side=Math.abs(dx*Math.cos(actor.pose.yaw)-dz*Math.sin(actor.pose.yaw));return along>3&&along<17&&side<18;});
      const other:Obstacle[]=[...obstacles,...traffic.filter(a=>a!==actor).map(a=>({car:a.pose}))];
      const clear=obstacleFree({...ahead},other) && obstacleFree(actor.pose,other) && !(signalAhead&&light.phase!=="green");
      const limit=nearSignal?2:3;
      actor.speed=Math.max(0,Math.min(limit,actor.speed+(clear?2.2:-12)*elapsed));
      // Every intermediate footprint is checked; traffic yields safely in place.
      const steps=Math.max(1,Math.ceil(actor.speed*elapsed/.10));
      for(let i=0;i<steps;i++) {
        const next=(actor.progress+actor.speed*elapsed/steps)%trafficPath.length,pose=onPath(trafficPath,next);
        if(!surface.fits(pose)||!obstacleFree(pose,other)){actor.speed=0;break;}
        actor.progress=next;actor.pose=pose;
      }
    }
  }
  const remaining=(checkpoint:number,car:Body)=>distance([car.x,car.z],data.route[Math.min(checkpoint,data.route.length-1)])+route.length-route.lengths[Math.min(checkpoint,data.route.length-1)];
  const edgeAt=(p:Point)=>roadNetwork.edges.map(edge=>({edge,distance:projectPath(edge.points,p).distance})).sort((a,b)=>a.distance-b.distance)[0];
  return {data,surface,route,rail,traffic,tickTraffic,placeTraffic,recover,exit,remaining,navigator,guidance,edgeAt};
}
