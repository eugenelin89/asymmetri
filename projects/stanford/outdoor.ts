// SPDX-License-Identifier: MIT
// Original public venue interpretations on source-mapped anchors. Sports markings
// follow conventional dimensions; spectator fixtures and activities are inferred.
import * as THREE from "three";
import { Builder } from "./builder";
import { person } from "./people";
import type { Anchor, Anchors, Point, Pose, Settings } from "./types";
import { global, type Interior } from "./spatial";
export const outdoorIds=["stanford-stadium","sunken-diamond","cobb-track","cagan","avery","taube","sand-volleyball","golf","frost","field-hockey","softball","rowing"] as const;
function line(b:Builder,a:Point,c:Point,width=.075,material:"white"|"clay"|"metal"="white",y=.09){const dx=c[0]-a[0],dz=c[1]-a[1];b.box(material,(a[0]+c[0])/2,y,(a[1]+c[1])/2,Math.hypot(dx,dz),.025,width,false,-Math.atan2(dz,dx));}
function arc(b:Builder,x:number,z:number,rx:number,rz:number,start=0,end=Math.PI*2,material:"white"|"clay"|"metal"="white",y=.09){const n=Math.max(20,Math.ceil((end-start)*20));for(let j=0;j<n;j++){const a=start+(end-start)*j/n,c=start+(end-start)*(j+1)/n;line(b,[x+Math.cos(a)*rx,z+Math.sin(a)*rz],[x+Math.cos(c)*rx,z+Math.sin(c)*rz],.075,material,y);}}
function floodlight(b:Builder,x:number,z:number,h=18){b.cylinder("metal",x,h/2,z,.16,h);b.box("metal",x,h,z,4,.22,.3);for(let j=-2;j<=2;j++)b.box("light",x+j*.7,h-.3,z+.15,.48,.48,.15);}
function bleachers(b:Builder,length:number,z:number,rows=7,side=1){for(let row=0;row<rows;row++){const p=z+side*row*.85,y=row*.32;b.floor(-length/2,length/2,p-.42,p+.42,y,"concrete");for(const s of [-1,1])b.box("redBook",s*(length/4+1),y+.4,p,Math.max(1,length/2-2),.12,.42,true);}b.ramps.push({minX:-1.35,maxX:1.35,minZ:Math.min(z,z+side*(rows-1)*.85),maxZ:Math.max(z,z+side*(rows-1)*.85),fromY:side>0?0:(rows-1)*.32,toY:side>0?(rows-1)*.32:0,axis:"z"});}
function fence(b:Builder,w:number,d:number,h=2.5){for(const side of [-1,1]){for(let x=-w/2;x<=w/2;x+=4){if(side>0&&Math.abs(x)<4)continue;b.cylinder("metal",x,h/2,side*d/2,.035,h);b.box("net",x,h/2,side*d/2,3.95,h,.025);}for(let z=-d/2;z<d/2;z+=4){b.cylinder("metal",side*w/2,h/2,z,.035,h);b.box("net",side*w/2,h/2,z,.025,h,3.95);}}}
function goals(b:Builder,length:number,width=7.32,height=2.44){for(const side of [-1,1]){const x=side*length/2;for(const z of [-width/2,width/2])b.cylinder("white",x,height/2,z,.055,height);b.box("white",x,height,0,.1,.1,width);b.box("net",x+side*1,height/2,0,.025,height,width);for(const z of [-width/2,width/2])b.box("net",x+side*.5,height/2,z,1,height,.025);}}
function soccer(b:Builder,hockey=false){const len=hockey?91.4:105.156,w=hockey?55:68.58;b.box("turf",0,.03,0,len+5,.06,w+5);for(const z of [-w/2,w/2])line(b,[-len/2,z],[len/2,z]);for(const x of [-len/2,0,len/2])line(b,[x,-w/2],[x,w/2]);if(!hockey){arc(b,0,0,9.15,9.15);for(const s of [-1,1]){line(b,[s*(len/2-16.5),-20.16],[s*(len/2-16.5),20.16]);for(const z of [-20.16,20.16])line(b,[s*len/2,z],[s*(len/2-16.5),z]);}goals(b,len);}else{for(const s of [-1,1]){line(b,[s*22.9,-w/2],[s*22.9,w/2]);arc(b,s*len/2,0,14.63,14.63,s>0?Math.PI/2:-Math.PI/2,s>0?Math.PI*1.5:Math.PI/2);}goals(b,len,3.66,2.14);}bleachers(b,48,w/2+5,6);for(const s of [-1,1])floodlight(b,s*len*.4,-w/2-4);}
function football(b:Builder){const l=109.728,w=48.768;b.box("turf",0,.03,0,l,.06,w);for(let j=-5;j<=5;j++){const x=j*9.144;line(b,[x,-w/2],[x,w/2]);for(let k=-4;k<=4;k++){const xx=x+k*.9144;for(const z of [-w/2+1,w/2-1,-2.8,2.8])line(b,[xx,z-.22],[xx,z+.22],.05);}}
 for(const s of [-1,1]){b.box("redBook",s*(l/2-4.572),.07,0,9.144,.02,w);b.cylinder("goldBook",s*(l/2+1),2,0,.13,4);b.box("goldBook",s*(l/2+1),3.05,0,.12,.12,5.64);for(const z of [-2.82,2.82])b.cylinder("goldBook",s*(l/2+1),6,z,.07,6);line(b,[-l/2,s*w/2],[l/2,s*w/2]);}
 const rx=b.width*.41,rz=b.depth*.38;
 for(let row=0;row<25;row++){
  const y=.36*row,rxx=rx+row*.6,rzz=rz+row*.53;
  for(let seg=0;seg<72;seg++){const t=seg*Math.PI*2/72,t2=(seg+1)*Math.PI*2/72,x=Math.cos(t)*rxx,z=Math.sin(t)*rzz,x2=Math.cos(t2)*rxx,z2=Math.sin(t2)*rzz;if(Math.abs(x)<3.5)continue;b.box("concrete",(x+x2)/2,y-.1,(z+z2)/2,Math.hypot(x2-x,z2-z)+.04,.22,.85,false,-Math.atan2(z2-z,x2-x));b.box("redBook",(x+x2)/2,y+.35,(z+z2)/2,Math.hypot(x2-x,z2-z),.12,.4,false,-Math.atan2(z2-z,x2-x));}
 }
 // Broad south staircase and landing provide a genuine route up into the bowl.
 const start=rz-1,end=rz+24*.53;
 b.ramps.push({minX:-2.5,maxX:2.5,minZ:start,maxZ:end,fromY:0,toY:8.64,axis:"z"});for(let n=0;n<48;n++)b.box("concrete",0,(n+1)*8.64/48-.06,start+(n+.5)*(end-start)/48,4.8,.12,(end-start)/48+.01);
 b.floor(-7,7,end,end+3,8.64,"concrete");b.rail(-7,end+3,7,end+3,8.64);
 b.box("stone",-rx-8,13,0,8,9,35);b.box("glass",-rx-3.9,14,0,.1,4,31);b.box("metal",rx+10,13,0,.5,10,20);b.sign("STANFORD",rx+9.6,14,0,16,3,-Math.PI/2);
 for(const sx of [-1,1])for(const sz of [-1,1])floodlight(b,sx*rx*.8,sz*rz*.8,28);
 b.sign("STANFORD STADIUM",0,4,b.depth/2-1,28,1.3);
}
function baseball(b:Builder,softball=false){
 const base=softball?18.288:27.432,homeZ=b.depth*.34,sq=base/Math.sqrt(2);
 const foul=softball?60.96:102.108,center=softball?67.056:121.92;
 // Published 335/400/335 ft Sunken dimensions; a smooth interpreted fence
 // between the surveyed foul-line and center-field distances, not a circle.
 const boundary=(t:number):Point=>{const reach=foul+(center-foul)*Math.cos((t+Math.PI/2)*2);return[Math.cos(t)*reach,homeZ+Math.sin(t)*reach];};
 const vertices:number[]=[];for(let j=0;j<48;j++){const p=boundary(-Math.PI*.75+j*Math.PI*.5/48),q=boundary(-Math.PI*.75+(j+1)*Math.PI*.5/48);vertices.push(0,.06,homeZ,...[q[0],.06,q[1]],...[p[0],.06,p[1]]);}
 const turfGeometry=new THREE.BufferGeometry();turfGeometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));turfGeometry.computeVertexNormals();b.group.add(new THREE.Mesh(turfGeometry,b.materials.turf));
 b.box("clay",0,.08,homeZ-sq,base+5,.045,base+5,false,Math.PI/4);
 if(!softball)b.box("turf",0,.108,homeZ-sq,base-5,.025,base-5,false,Math.PI/4);
 const pts:Point[]=[[0,homeZ],[sq,homeZ-sq],[0,homeZ-sq*2],[-sq,homeZ-sq]];
 for(let j=0;j<4;j++){line(b,pts[j],pts[(j+1)%4],.11);b.box("white",pts[j][0],.14,pts[j][1],.38,.07,.38,false,Math.PI/4);}
 b.cylinder("clay",0,.16,homeZ-(softball?13.106:18.44),2.75,.28);b.box("white",0,.32,homeZ-(softball?13.106:18.44),.61,.035,.15);
 for(const side of [-1,1]){const end=boundary(-Math.PI/2+side*Math.PI/4);line(b,[0,homeZ],end,.1);b.cylinder("goldBook",end[0],6,end[1],.07,12);}
 for(let j=0;j<48;j++){const t=-Math.PI*.75+j*Math.PI*.5/48,p=boundary(t),q=boundary(t+Math.PI*.5/48),dx=q[0]-p[0],dz=q[1]-p[1];b.cylinder("metal",p[0],1.524,p[1],.035,3.048);b.box("turf",(p[0]+q[0])/2,1.524,(p[1]+q[1])/2,Math.hypot(dx,dz)+.03,3.048,.18,true,-Math.atan2(dz,dx));}
 for(const side of [-1,1]){
  b.box("stone",side*(sq+9),1.3,homeZ-sq,3,2.6,17,true);b.box("roof",side*(sq+9),2.7,homeZ-sq,4,.2,18);for(let j=-3;j<=3;j++)b.bench(side*(sq+6),homeZ-sq+j*2,1.6);
  for(let row=0;row<9;row++){const x=side*(10+row*.9);b.box("concrete",x,row*.3,homeZ+4,1,.25,18);b.box("turf",x,row*.3+.4,homeZ+4,.45,.12,17);}
  const edge=boundary(-Math.PI/2+side*Math.PI*.23);b.sign(softball?"200":"335",edge[0],2.25,edge[1]+.25,2.5,.7,-side*Math.PI/4);
  if(!softball){const power=boundary(-Math.PI/2+side*.34);b.sign("375",power[0],2.25,power[1]+.25,2.5,.7,-side*.34);}
 }
 b.box("turf",0,6,homeZ-center-1,18,8,.5);b.sign(softball?"STANFORD SOFTBALL":"KLEIN FIELD",0,8,homeZ-center-.7,16,1);
 b.sign(softball?"220":"400",0,2.3,homeZ-center+.2,2.5,.7);
 if(!softball){b.box("metal",26,7,homeZ-center+4,18,7,.45);b.sign("STANFORD",26,9,homeZ-center+4.25,15,1.1);b.sign("HOME  0   GUEST  0",26,6.5,homeZ-center+4.26,15,.7);}
 for(const side of [-1,1])for(const row of [0,1])floodlight(b,side*(sq+17+row*20),homeZ-sq-row*38,24);
 bleachers(b,35,homeZ+9,softball?10:8);b.group.userData.seatingInterpretation=softball?"2026 rebuilt venue reference with expanded seating; individual seats not enumerated":"Open bowl and dugout interpretation";
 if(softball){
  // The 2026 replacement adds an upper deck and hospitality terraces.
  // This walkable circulation is an interpretation, not the construction plan.
  const low=2.88,high=4.6,start=homeZ+20,end=homeZ+26;
  b.floor(-18,18,homeZ+16.5,start+.1,low,"concrete");
  b.ramps.push({minX:-1.6,maxX:1.6,minZ:start,maxZ:end,fromY:low,toY:high,axis:"z"});
  for(let n=0;n<10;n++)b.box("concrete",0,low+(n+1)*(high-low)/10-.08,start+(n+.5)*(end-start)/10,3.2,.16,(end-start)/10+.01);
  b.floor(-24,24,end,homeZ+33,high,"concrete");
  for(const side of [-1,1]){
   for(let n=0;n<3;n++)b.box("redBook",side*10,high+.4+n*.3,end+.8+n,15,.15,.5);
   for(const z of [homeZ+27,homeZ+31])b.cylinder("stone",side*22,high/2,z,.23,high,true);
   b.rail(side*24,end,side*24,homeZ+33,high);b.rail(side*2,homeZ+33,side*24,homeZ+33,high);
  }
  b.box("stone",0,high+1.7,homeZ+32,14,3.4,3,true);b.box("glass",0,high+1.7,homeZ+30.45,13,2.4,.08);b.box("roof",0,high+3.5,homeZ+32,15,.25,4);
 }
 b.group.userData.fieldDimensions={basepaths:base,foulLine:foul,centerField:center};
}
function track(b:Builder){
 const r=36.5,straight=84.39,half=straight/2;b.box("turf",0,.03,0,r*2,.06,straight+r*2);
 for(let lane=0;lane<=9;lane++){
  const radius=r+lane*1.22;arc(b,0,half,radius,radius,0,Math.PI);arc(b,0,-half,radius,radius,Math.PI,Math.PI*2);for(const s of [-1,1])line(b,[s*radius,-half],[s*radius,half]);
  if(lane<9){for(const side of [-1,1])b.box("clay",side*(radius+.61),.065,0,1.2,.04,straight);const ring=new THREE.RingGeometry(radius,radius+1.2,64,1,0,Math.PI);for(const side of [-1,1]){const mesh=new THREE.Mesh(ring.clone(),b.materials.clay);mesh.rotation.x=-Math.PI/2;if(side>0)mesh.rotation.z=Math.PI;mesh.position.set(0,.066,side*half);b.group.add(mesh);}ring.dispose();}
 }
 for(let j=0;j<9;j++)line(b,[-r-(j+1)*1.22,half-7+j*.65],[-r-j*1.22,half-7+j*.65]);
 b.box("clay",0,.08,0,28,.06,48);for(const side of [-1,1])floodlight(b,side*(r+13),0,21);bleachers(b,42,half+r+7,6);
}
function aquatics(b:Builder){
 const w=b.width,d=b.depth;b.floor(-w/2,w/2,-d/2,d/2,0,"concrete");
 const len=37,pw=20;b.colliders.push({minX:-len/2,maxX:len/2,minZ:-pw/2,maxZ:pw/2,minY:-.4,maxY:.4});b.box("blueBook",0,-.06,0,len,.15,pw);b.materials.blueBook.color.setHex(0x3fa8b4);b.materials.blueBook.roughness=.16;
 for(let lane=0;lane<9;lane++){const z=-pw/2+lane*pw/8;for(let x=-len/2+.5;x<len/2;x+=.7)b.box((Math.floor(x*2)%5===0?"redBook":"white"),x,.07,z,.3,.12,.12);}
 for(const s of [-1,1])for(let lane=0;lane<8;lane++){const z=-pw/2+(lane+.5)*pw/8;b.box("white",s*(len/2+1),.45,z,.8,.9,.8,true);b.box("blueBook",s*(len/2+1),.94,z,1,.08,.85);}
 for(const s of [-1,1])bleachers(b,42,s*(pw/2+5),8,s);
 // Publicly documented diving tower heights; layout within this arena is a reconstruction.
 b.box("concrete",-w*.38,5.5,-d*.2,1.2,11,2,true);for(const h of [1,3,5,7.5,10]){b.box("concrete",-w*.38+1.5,h,-d*.2,4.2,.24,2.4);b.rail(-w*.38-.6,-d*.2-1.2,-w*.38+3.6,-d*.2-1.2,h);}
 for(const s of [-1,1])floodlight(b,s*w*.42,-d*.4,18);b.sign("AVERY AQUATIC CENTER",0,3,d/2-1,24,.8);
 b.group.userData.poolCoverage="Main competition pool and interpreted diving tower; other training pools remain source landscape features";
}
function tennis(b:Builder){const across=3,rows=2;for(let i=0;i<across;i++)for(let j=0;j<rows;j++){
 const x=(i-1)*24,z=(j-.5)*29;b.box("blue",x,.04,z,20,.08,27);b.box("turf",x,.086,z,10.97,.02,23.77);
 for(const xx of [-5.485,5.485])line(b,[x+xx,z-11.885],[x+xx,z+11.885]);for(const zz of [-11.885,0,11.885])line(b,[x-5.485,z+zz],[x+5.485,z+zz]);for(const zz of [-6.4,6.4])line(b,[x-4.115,z+zz],[x+4.115,z+zz]);for(const xx of [-4.115,4.115])line(b,[x+xx,z-11.885],[x+xx,z+11.885]);line(b,[x,z-6.4],[x,z+6.4]);b.box("net",x,.5,z,12,.95,.03);for(const side of [-1,1])b.cylinder("metal",x+side*6, .55,z,.045,1.1);
 }fence(b,84,62,3);for(const side of [-1,1])floodlight(b,side*40,0,15);b.sign("TAUBE FAMILY TENNIS CENTER",0,3,b.depth/2-1,26,.7);}
function beach(b:Builder){for(let i=0;i<2;i++)for(let j=0;j<2;j++){
 const x=(i-.5)*24,z=(j-.5)*32;b.box("stone",x,.03,z,16,.06,24);for(const sx of [-1,1])line(b,[x+sx*4,z-8],[x+sx*4,z+8],.07,"clay");for(const zz of [-8,8])line(b,[x-4,z+zz],[x+4,z+zz],.07,"clay");for(const sx of [-1,1])b.cylinder("redBook",x+sx*5,1.5,z,.1,3);b.box("net",x,2,z,10,.85,.03);
 }bleachers(b,28,b.depth/2-8,5);b.sign("STANFORD BEACH VOLLEYBALL",0,3,b.depth/2,24,.7);}
function frost(b:Builder){const w=b.width,d=b.depth;for(let row=0;row<17;row++){
 const z=-d*.25+row*3.5,y=row*.21,width=w*(.4+row*.028);b.floor(-width/2,width/2,z,z+3.5,y,"turf");for(const side of [-1,1])b.box("stone",side*(width/4+1.2),y+.15,z,Math.max(1,width/2-2.4),.3,.35);
 }b.ramps.push({minX:-1.7,maxX:1.7,minZ:-d*.25,maxZ:-d*.25+16*3.5,fromY:0,toY:3.36,axis:"z"});b.floor(-w*.24,w*.24,-d*.48,-d*.28,.2,"darkWood");b.box("roof",0,8,-d*.38,w*.55,.35,d*.23);for(const side of [-1,1])b.cylinder("metal",side*w*.25,4,-d*.38,.14,8);b.sign("FROST AMPHITHEATER",0,4,-d*.45,w*.4,.8);}
function golf(b:Builder){b.floor(-b.width/2,b.width/2,-b.depth/2,b.depth/2);for(const side of [-1,1])b.box("stone",side*b.width/2,2,0,.3,4,b.depth,true);b.box("stone",0,2,-b.depth/2,b.width,4,.3,true);b.box("roof",0,4,0,b.width+.7,.25,b.depth+.7);b.box("timber",b.width*.25,.6,0,b.width*.27,1.2,1,true);b.sign("STANFORD GOLF",0,3.3,b.depth/2,b.width*.8,.5);for(let i=-3;i<=3;i++){b.cylinder("metal",i*1.5,1,-b.depth*.25,.035,2);b.box("metal",i*1.5+.15,.08,-b.depth*.25,.3,.12,.14);}}
function boathouse(b:Builder){const w=b.width,d=b.depth;b.floor(-w/2,w/2,-d/2,d/2);for(const side of [-1,1])b.box("stone",side*w/2,3,0,.3,6,d,true);b.box("stone",0,3,-d/2,w,6,.3,true);b.box("roof",0,6.2,0,w+1,.35,d+1);for(const side of [-1,1])for(let row=0;row<3;row++){
 const x=side*w*.27,y=.9+row*1.3;b.box("metal",x,y,0,4,.12,d*.85);for(let n=0;n<3;n++){const px=x+(n-1)*1.2;b.box("whiteBook",px,y+.25,0,.65,.4,Math.min(17,d*.8));b.box("darkWood",px,y+.48,0,.4,.04,Math.min(14,d*.7));for(let j=-3;j<=3;j++)b.box("metal",px,y+.5,j*1.5,2,.04,.05);}}
 b.sign("ARRILLAGA ROWING & SAILING CENTER",0,4.8,d/2+.2,w*.9,.55);b.light(0,5,0,250);}
export function createOutdoor(anchors:Anchors){
 const group=new THREE.Group(),interiors:Interior[]=[];const runners:{model:ReturnType<typeof person>;anchor:Anchor;kind:string;n:number}[]=[];
 for(const id of outdoorIds){const a=anchors[id];if(!a)continue;const b=new Builder(a.width,a.depth);b.materials.redBook.color.setHex(0x8c1515);b.materials.roof.color.setHex(0xa95f42);b.materials.turf.color.setHex(0x477348);
  if(id==="stanford-stadium")football(b);else if(id==="sunken-diamond"||id==="softball")baseball(b,id==="softball");else if(id==="cobb-track")track(b);else if(id==="cagan"||id==="field-hockey")soccer(b,id==="field-hockey");else if(id==="avery")aquatics(b);else if(id==="taube")tennis(b);else if(id==="sand-volleyball")beach(b);else if(id==="frost")frost(b);else if(id==="golf")golf(b);else if(id==="rowing")boathouse(b);
  const asset=b.finish(id);asset.group.position.set(a.x,.025,a.z);asset.group.rotation.y=a.yaw;asset.group.userData.info=id;group.add(asset.group);interiors.push({anchor:a,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry});
  if(["cagan","stanford-stadium","cobb-track","field-hockey"].includes(id))for(let n=0;n<8;n++){const model=person(`practice-${id}-${n}`,160+n,false,n%2?"#8c1515":"#e6e1d2");delete model.group.userData.info;group.add(model.group);runners.push({model,anchor:a,kind:id,n});}
 }
 let time=0;return{group,interiors,update(dt:number,settings:Settings,pose:Pose){if(!settings.reducedMotion)time+=dt;runners.forEach(({model,anchor:a,kind,n})=>{model.group.visible=settings.population&&Math.hypot(pose.x-a.x,pose.z-a.z)<240;const phase=time*.18+n*.83,point:Point=kind==="cobb-track"?[Math.sin(phase)*37,Math.cos(phase)*70]:[Math.sin(phase)*37,Math.cos(phase)*17],q=global(point,a);model.group.position.set(q[0],.12,q[1]);model.group.rotation.y=a.yaw-Math.atan2(Math.cos(phase)*37,-Math.sin(phase)*(kind==="cobb-track"?70:17));model.legs.forEach((leg,j)=>leg.rotation.x=settings.reducedMotion?0:Math.sin(time*8+n+j*Math.PI)*.42);});}};
}
