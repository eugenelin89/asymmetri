import * as THREE from "three";
import { Builder } from "./builder";
import { person } from "./people";
import type { Anchors, Point, Pose, Settings } from "./types";
import { global, type Interior } from "./spatial";
/** Original US-football/soccer field. Dimensions follow regulation markings;
 * fixture locations and practice movement are illustrative, not an event feed. */
export function createOutdoor(anchors:Anchors){
  const group=new THREE.Group(), interiors:Interior[]=[];
  const a=anchors.disanto;
  const runners:ReturnType<typeof person>[]=[];
  if(a){
    const b=new Builder(a.width,a.depth);
    const length=109.728,width=48.768;
    b.materials.turf.color.setHex(0x3f7257);b.materials.blue.color.setHex(0x18355a);
    b.box("turf",0,0.04,0,length,0.08,width);
    for(let x=-length/2+9.144;x<=length/2-9.144+0.1;x+=9.144){
      b.box("white",x,0.095,0,0.09,0.025,width);
      for(const z of [-width/2+1,width/2-1])b.sign(String(Math.round(50-Math.abs(x)/0.9144)),x,0.13,z,1.3,0.75);
    }
    for(const side of [-1,1]){
      b.box("blue",side*(length/2-4.572),0.091,0,9.144,0.02,width);
      b.box("white",0,0.1,side*width/2,length,0.025,0.1);
      const x=side*(length/2+1.4);
      b.cylinder("goldBook",x,2.1,0,0.12,4.2);
      b.beam("goldBook",new THREE.Vector3(x,3.05,-2.82),new THREE.Vector3(x,3.05,2.82),0.11);
      for(const z of [-2.82,2.82])b.cylinder("goldBook",x,6,z,0.08,6);
    }
    // Soccer overlay: source-field-sized interpretation with goals and penalty areas.
    for(const side of [-1,1]){
      const x=side*48;
      b.box("white",x,0.115,0,0.08,0.02,62);
      b.box("white",side*32,0.115,0,0.08,0.02,40);
      for(const z of [-20,20])b.box("white",side*40,0.115,z,16,0.02,0.08);
      for(const z of [-3.66,3.66])b.cylinder("white",x,1.22,z,0.055,2.44);
      b.box("white",x,2.44,0,0.1,0.1,7.32);
    }
    // An open grandstand with supported steps; no gates obstruct the field.
    const standZ=a.depth/2-2;
    for(let row=0;row<6;row++){
      const y=row*.32,z=standZ+row*.9;
      b.floor(-22,22,z,z+.9,y,"concrete");
      for(const side of [-1,1])b.box("blue",side*11.8,y+.38,z+.35,19.2,.12,.42,true);
    }
    b.ramps.push({minX:-1.4,maxX:1.4,minZ:standZ,maxZ:standZ+5.4,fromY:0,toY:1.6,axis:"z"});
    const asset=b.finish("disanto");asset.group.position.set(a.x,0,a.z);asset.group.rotation.y=a.yaw;asset.group.userData.info="disanto";group.add(asset.group);
    interiors.push({anchor:a,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:[0,a.depth/2+1]});
    for(let n=0;n<10;n++){const p=person(`practice-${n}`,90+n,false,n%2?"#d6dadd":"#204675");runners.push(p);group.add(p.group);}
  }
  return {group,interiors,update(dt:number,settings:Settings,pose:Pose){
    group.visible=!!a;
    runners.forEach((p,i)=>{
      p.group.visible=settings.population&&Math.hypot(pose.x-a.x,pose.z-a.z)<240;
      const phase=(p.group.userData.phase||i*.63)+(settings.reducedMotion?0:dt*.12);p.group.userData.phase=phase;
      const point:Point=[Math.sin(phase)*37,Math.cos(phase)*17],q=global(point,a);
      p.group.position.set(q[0],.12,q[1]);p.group.rotation.y=a.yaw-Math.atan2(Math.cos(phase)*37,Math.sin(phase)*17);
      p.legs.forEach((leg,j)=>leg.rotation.x=settings.reducedMotion?0:Math.sin(phase*48+j*Math.PI)*.44);
    });
  }};
}
