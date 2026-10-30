// SPDX-License-Identifier: MIT — original low-poly compact cars and unbranded rail cars.
import * as THREE from "three";
import type { Snapshot } from "./types";
import type { createTransport } from "./transport";
import { onPath, trainProgress } from "./transport";
import { TRANSIT_DECK_HEIGHT } from "./surfaces";
import type { Car } from "./vehicle";
export function buildTransport(scene:THREE.Scene, transport:ReturnType<typeof createTransport>) {
  const box=new THREE.BoxGeometry(1,1,1), wheel=new THREE.CylinderGeometry(.32,.32,.22,12); wheel.rotateZ(Math.PI/2);
  const materials=new Map<number,THREE.MeshStandardMaterial>();
  const mat=(color:number)=>{if(!materials.has(color)) materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.12}));return materials.get(color)!;};
  const headlights=new THREE.MeshStandardMaterial({color:0xffeaca,emissive:0xffe3a5,emissiveIntensity:.8});
  const tail=new THREE.MeshStandardMaterial({color:0xc8493e,emissive:0xd53324,emissiveIntensity:.4});
  function part(parent:THREE.Group,color:number|THREE.Material,w:number,h:number,d:number,x:number,y:number,z:number) {
    const mesh=new THREE.Mesh(box,typeof color==="number"?mat(color):color);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function car(color:number) {
    const group=new THREE.Group();scene.add(group);
    part(group,color,1.82,.65,3.95,0,.77,0);
    part(group,0x284a59,1.55,.61,1.9,0,1.37,-.05);
    part(group,color,1.56,.12,1.78,0,1.72,-.1);
    part(group,0xb9c5c1,1.7,.12,.14,0,.63,2.0);part(group,0x36434a,1.7,.12,.14,0,.63,-2.0);
    for(const x of [-.62,.62]){part(group,headlights,.43,.19,.06,x,.88,2.0);part(group,tail,.4,.19,.06,x,.88,-2.0);}
    const wheels: {pivot:THREE.Group; tire:THREE.Mesh; front:boolean}[]=[];
    for(const x of [-.89,.89]) for(const z of [-1.3,1.3]) {const pivot=new THREE.Group(),tire=new THREE.Mesh(wheel,mat(0x222b30));pivot.position.set(x,.37,z);pivot.add(tire);group.add(pivot);wheels.push({pivot,tire,front:z>0});}
    return {group,update(p:Car,seconds:number){group.position.set(p.x,.04,p.z);group.rotation.y=p.yaw;for(const w of wheels){w.pivot.rotation.y=w.front?p.steer:0;w.tire.rotation.x=seconds*p.speed/.32;}}};
  }
  const player=car(0x39a79d),traffic=transport.traffic.map((_,i)=>car([0xe7b961,0xa46e5a,0xa3afb8][i]));
  const ribbon=new THREE.Line(new THREE.BufferGeometry().setFromPoints(transport.data.route.map(p=>new THREE.Vector3(p[0],.16,p[1]))),new THREE.LineDashedMaterial({color:0x67d9df,dashSize:3,gapSize:2,depthWrite:false}));ribbon.computeLineDistances();scene.add(ribbon);
  const destination=transport.data.route.at(-1)!;
  const parking=new THREE.Mesh(new THREE.RingGeometry(3.5,3.8,36),new THREE.MeshBasicMaterial({color:0x67d9df,side:THREE.DoubleSide}));parking.rotation.x=-Math.PI/2;parking.position.set(destination[0],.17,destination[1]);scene.add(parking);
  const trains=Array.from({length:3},()=>{
    const group=new THREE.Group();scene.add(group);
    part(group,0xcbd4ce,2.5,2.15,8.1,0,1.45,0);part(group,0x466e83,2.55,.77,7.1,0,1.7,0);part(group,0xd3b762,2.57,.16,8.0,0,1.05,0);part(group,0x637c82,2.55,.23,8.2,0,2.65,0);
    for(const z of [-2.5,2.5]) part(group,0xb9c6c1,2.58,1.78,.64,0,1.3,z);
    for(const z of [-3.9,3.9]) {part(group,0x315264,1.95,.78,.07,0,1.8,z);part(group,headlights,1.1,.12,.08,0,.8,z);}
    return group;
  });
  const steel=new THREE.LineBasicMaterial({color:0x45575b});
  for(const sign of [-1,1]) {
    const points=transport.data.rail.map((p,i)=>{const q=transport.data.rail[Math.min(i+1,transport.data.rail.length-1)],a=transport.data.rail[Math.max(0,i-1)];const yaw=Math.atan2(q[0]-a[0],q[1]-a[1]);return new THREE.Vector3(p[0]+Math.cos(yaw)*sign*.85,TRANSIT_DECK_HEIGHT+.56,p[1]-Math.sin(yaw)*sign*.85);});
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),steel));
  }
  // Platform lights are shared emissive geometry, not extra dynamic light sources.
  const platform=new THREE.Group();scene.add(platform);
  for(const z of [-25,-12,0,12,25]) part(platform,headlights,.7,.1,1,83,12.45,z);
  function update(state:Snapshot, network=transport) {
    player.update(state.vehicle.car,state.elapsed);
    traffic.forEach((model,i)=>{const actor=network.traffic[i];model.update({...actor.pose,speed:actor.speed,steer:0,blocked:false},state.elapsed);});
    ribbon.visible=state.delivery.stage==="accepted" || state.vehicle.occupied;
    parking.visible=state.delivery.stage==="accepted"||state.delivery.stage==="arrived"||state.vehicle.occupied;
    const progress=trainProgress(state.elapsed,transport.rail.length);
    trains.forEach((train,i)=>{const p=onPath(transport.rail,progress+(i-1)*8.8);train.position.set(p.x,TRANSIT_DECK_HEIGHT+.62,p.z);train.rotation.y=p.yaw;});
  }
  return {update,player,traffic,ribbon,parking,trains};
}
