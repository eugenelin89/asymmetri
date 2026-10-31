import * as THREE from "three";
import { createDoors } from "./doors";
import { residenceFloor, residenceLift as shaft, residenceRooms } from "./residence-layout";
import type { Architecture } from "./builder";
import type { Point, Settings } from "./types";
import type { Floor } from "./spatial";

/** Same E/tap, hinged-door and call/board/ride convention as the UBC residence.
 * The Clarke demonstration layout is an interpretation, not an actual lift plan.
 */
export function createResidenceControls(asset: Architecture) {
  const doors = createDoors([
    ...residenceRooms.map(r=>({id:`clarke-door-${r.id}`,name:`Room ${r.id} · ${r.beds===2?"double":"single"}`,hinge:[r.x-.89,r.doorZ] as Point,y:residenceFloor,width:1.78,angle:0,swing:-1 as const})),
    {id:"clarke-door-bath",name:"shared bathroom",hinge:[-7.59,-1.8] as Point,y:residenceFloor,width:1.78,angle:0,swing:1 as const},
  ]);
  const group=new THREE.Group(); group.add(doors.group);asset.group.add(group);
  const metal=new THREE.MeshStandardMaterial({color:0x7f9691,metalness:.5,roughness:.4});
  const glass=new THREE.MeshStandardMaterial({color:0xabc9c5,transparent:true,opacity:.25,roughness:.2});
  const cab=new THREE.Group();group.add(cab);
  const box=(parent:THREE.Group,m:THREE.Material,x:number,y:number,z:number,w:number,h:number,d:number)=>{
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  };
  const cx=(shaft.minX+shaft.maxX)/2,cz=(shaft.minZ+shaft.maxZ)/2;
  box(cab,metal,cx,-.06,cz,2,.12,2.6);
  for(const x of [shaft.minX,shaft.maxX]){
    box(group,glass,x,4.2,cz,.1,8.4,2.6);
    asset.colliders.push({minX:x-.06,maxX:x+.06,minZ:shaft.minZ,maxZ:shaft.maxZ,minY:0,maxY:8.4});
    box(cab,metal,x,1,cz,.06,.06,2.6);
  }
  box(group,glass,cx,4.2,shaft.minZ,2,8.4,.1);
  asset.colliders.push({minX:shaft.minX,maxX:shaft.maxX,minZ:shaft.minZ-.06,maxZ:shaft.minZ+.06,minY:0,maxY:8.4});
  const gates=[0,residenceFloor].map(y=>box(group,metal,cx,y+.65,shaft.maxZ,1.8,.08,.07));
  for(const y of [0,residenceFloor]){
    const button=box(group,metal,shaft.minX-.25,y+1.1,shaft.maxZ+.25,.18,.3,.09);
    button.userData.info=y?"clarke-lift-upper":"clarke-lift-lobby";
  }
  const ride=box(cab,metal,cx,1.1,shaft.minZ+.12,.3,.3,.1);ride.userData.info="clarke-lift-ride";
  const liftFloor:Floor={...shaft,y:0};asset.floors.push(liftFloor);
  let liftY=0,target=0,rider=false,threshold=false;
  const inside=(p:Point)=>p[0]>shaft.minX+.32&&p[0]<shaft.maxX-.32&&p[1]>shaft.minZ+.32&&p[1]<shaft.maxZ-.4;
  function update(dt:number,p:Point,y:number,settings:Settings){
    doors.update(dt,p,y,settings.reducedMotion);
    const before=liftY;rider=inside(p)&&Math.abs(y-liftY)<.15;
    threshold=p[0]>shaft.minX-.2&&p[0]<shaft.maxX+.2&&p[1]>shaft.maxZ-.4&&p[1]<shaft.maxZ+.5&&Math.abs(y-liftY)<.2&&Math.abs(target-y)>.2;
    if(!threshold)liftY+=Math.sign(target-liftY)*Math.min(Math.abs(target-liftY),Math.max(0,Math.min(.1,dt))*.9);
    liftFloor.y=liftY;cab.position.y=liftY;
    gates.forEach((g,i)=>g.visible=!threshold&&(Math.abs(liftY-i*residenceFloor)>.15||Math.abs(target-liftY)>.01));
    return rider?liftY-before:0;
  }
  function dynamicBlocked(p:Point,y:number){
    if(doors.blocked(p,y))return true;
    return p[0]>shaft.minX-.25&&p[0]<shaft.maxX+.25&&p[1]>shaft.maxZ-.32&&p[1]<shaft.maxZ+.32&&!threshold&&(Math.abs(liftY-y)>.15||Math.abs(target-liftY)>.01);
  }
  function interactions(){return [...doors.interactions(),
    {id:"clarke-lift-lobby",name:"Call lift to lobby",x:shaft.minX-.25,y:1.1,z:shaft.maxZ+.25},
    {id:"clarke-lift-upper",name:"Call lift to demonstration floor",x:shaft.minX-.25,y:residenceFloor+1.1,z:shaft.maxZ+.25},
    ...(rider?[{id:"clarke-lift-ride",name:target>0?"Ride lift to lobby":"Ride lift to demonstration floor",x:cx,y:liftY+1.1,z:shaft.minZ+.12}]:[])];}
  function interact(id:string){
    if(id==="clarke-lift-lobby")target=0;
    else if(id==="clarke-lift-upper")target=residenceFloor;
    else if(id==="clarke-lift-ride"&&rider)target=target>0?0:residenceFloor;
    else return doors.toggle(id);
    return true;
  }
  function canSee(from:Point,to:Point,y:number){
    const length=Math.hypot(to[0]-from[0],to[1]-from[1]);
    for(let d=.3;d<length-.55;d+=.15){
      const p:Point=[from[0]+(to[0]-from[0])*d/length,from[1]+(to[1]-from[1])*d/length];
      if(asset.colliders.some(b=>y>b.minY&&y<b.maxY&&p[0]>b.minX&&p[0]<b.maxX&&p[1]>b.minZ&&p[1]<b.maxZ)||doors.blocked(p,y-1.65))return false;
    }
    return true;
  }
  return {group,doors,liftFloor,update,dynamicBlocked,interactions,interact,canSee};
}
