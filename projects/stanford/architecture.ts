// SPDX-License-Identifier: MIT
// Original Stanford reference reconstructions. Public photographs inform form,
// material and room character; dimensions and circulation are interpretations.
import * as THREE from "three";
import { Builder, type Architecture, type MaterialName } from "./builder";
import type { Anchor } from "./types";
import { residenceFloor, residenceRooms, residenceLift, residenceBathroom, residenceDoorWidth } from "./residence-layout";

export type ArchitectureKind = string;
// Conservative public cores fitted inside final OSM polygons at 1 m sampling,
// with a one-metre envelope margin. Source outline wings remain separate.
export const interiorCoreBounds: Record<string, [number, number, number, number]> = {"memorial-church":[-0.5,3.5,21,47],"main-quad":[53.0,105.5,64,17],"hoover-tower":[-0.5,-2.5,16,16],"green-library":[0.5,6.5,47,45],"bing-wing":[-4.0,1.0,56,64],"cantor":[17.5,22.0,57,18],"anderson":[0.5,1.0,53,24],"bing-concert":[-8.0,-4.0,64,58],"memorial-auditorium":[1.0,0.0,32,64],"gates":[-17.0,-4.0,26,64],"huang":[18.0,0.0,26,64],"packard":[6.5,-3.5,57,37],"hewlett":[-8.5,4.5,21,29],"clark":[-54.0,0.0,24,64],"peterson":[-0.5,-12.5,51,13],"knight":[-1.0,-0.5,20,47],"law":[-29.5,1.5,55,47],"tresidder":[-3.0,10.0,64,20],"old-union":[-0.5,4.5,41,13],"bookstore":[-1.0,-4.5,46,43],"toyon":[-9,25,10,62],"branner":[0.0,6.5,24,25],"roble":[-15.0,-4.0,32,18],"encina":[-1.0,10.0,56,16],"maples":[-3.0,2.0,64,64],"mcmurtry":[-23.5,1.5,27,39],"windhover":[-0.5,-1.0,9,60],"dinkelspiel":[0.0,1.0,26,42],"mausoleum":[0,0,5,10],"burnham":[2,-1,44,30],"ford":[-15.0,2.5,64,35],"squash":[-1.0,-1.0,56,56]};
export function architectureEnvelope(kind: string, anchor: Anchor): Anchor {
  const core = interiorCoreBounds[kind];
  if (!core) return { ...anchor };
  const [x,z,width,depth] = core, c=Math.cos(anchor.yaw), s=Math.sin(anchor.yaw);
  return {...anchor,x:anchor.x+x*c+z*s,z:anchor.z-x*s+z*c,width,depth};
}
/** Source wings surround a conservative core; towers/rotundas use bespoke shells. */
export function usesFootprintContext(kind: string) {
  return !["hoover-tower","maples","mausoleum","windhover"].includes(kind);
}
export const titles:Record<string,string>={
  "memorial-church":"MEMORIAL CHURCH", "main-quad":"MAIN QUAD", "hoover-tower":"HOOVER TOWER",
  "green-library":"CECIL H. GREEN LIBRARY", "bing-wing":"GREEN LIBRARY · BING WING", cantor:"CANTOR ARTS CENTER",
  anderson:"ANDERSON COLLECTION", "bing-concert":"BING CONCERT HALL", "memorial-auditorium":"MEMORIAL AUDITORIUM",
  gates:"WILLIAM GATES COMPUTER SCIENCE", huang:"JEN-HSUN HUANG ENGINEERING CENTER", packard:"DAVID PACKARD ELECTRICAL ENGINEERING",
  hewlett:"WILLIAM R. HEWLETT TEACHING CENTER", clark:"JAMES H. CLARK CENTER", peterson:"d.school · PETERSON LABORATORY",
  knight:"KNIGHT MANAGEMENT CENTER", law:"STANFORD LAW SCHOOL", tresidder:"TRESIDDER MEMORIAL UNION", "old-union":"OLD UNION",
  bookstore:"STANFORD BOOKSTORE", toyon:"TOYON HALL", branner:"BRANNER HALL", roble:"ROBLE HALL", encina:"ENCINA HALL",
  maples:"MAPLES PAVILION", burnham:"BURNHAM PAVILION", ford:"FORD CENTER", squash:"ARRILLAGA CENTER · SQUASH", mcmurtry:"McMURTRY BUILDING", windhover:"WINDHOVER", dinkelspiel:"DINKELSPIEL AUDITORIUM", mausoleum:"STANFORD MAUSOLEUM",
};
const H=4.2;
function wall(b:Builder,m:MaterialName,x:number,z:number,w:number,d:number,y:number,h:number){b.box(m,x,y+h/2,z,w,h,d,true);}
function arch(b:Builder,x:number,y:number,z:number,r:number,thickness=.35,side=false,m:MaterialName="stone"){
  const point=(a:number)=>new THREE.Vector3(x+(side?0:Math.cos(a)*r),y+Math.sin(a)*r,z+(side?Math.cos(a)*r:0));
  for(let n=0;n<18;n++)b.beam(m,point(n*Math.PI/18),point((n+1)*Math.PI/18),thickness);
}
function column(b:Builder,x:number,z:number,h:number,y=0,r=.32){
  b.cylinder("stone",x,y+h/2,z,r,h,true);b.box("stone",x,y+.16,z,r*2.8,.32,r*2.8,true);b.box("stone",x,y+h-.13,z,r*3,.26,r*3);
  for(let n=0;n<8;n++){const t=n*Math.PI/4;b.cylinder("concrete",x+Math.sin(t)*r*.95,y+h/2,z+Math.cos(t)*r*.95,.025,h-.6);}
}
function roof(b:Builder,eave:number,rise=3,hip=false){
  const w=b.width+1.2,d=b.depth+1.2;
  const points=[[-w/2,eave,d/2],[w/2,eave,d/2],[w/2,eave,-d/2],[-w/2,eave,-d/2]];
  const vertices:number[]=[];
  const add=(a:number[],c:number[],d2:number[])=>vertices.push(...a,...c,...d2);
  if(hip){const r1=[-w*.3,eave+rise,0],r2=[w*.3,eave+rise,0];add(points[0],points[1],r2);add(points[0],r2,r1);add(points[1],points[2],r2);add(points[2],points[3],r1);add(points[2],r1,r2);add(points[3],points[0],r1);}
  else {const a=[-w/2,eave+rise,0],c=[w/2,eave+rise,0];add(points[0],points[1],c);add(points[0],c,a);add(points[2],points[3],a);add(points[2],a,c);add(points[3],points[0],a);add(points[1],points[2],c);}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,b.materials.roof);mesh.castShadow=true;mesh.userData.roof=true;b.group.add(mesh);
  b.beam("clay",new THREE.Vector3(-w/2,eave+rise+.08,0),new THREE.Vector3(w/2,eave+rise+.08,0),.18);
  for(let x=-w/2+.3;x<w/2;x+=.85)for(const side of [-1,1]){
    if(hip&&Math.abs(x)>w*.29)continue;
    b.beam("clay",new THREE.Vector3(x,eave+.04,side*d/2),new THREE.Vector3(x,eave+rise+.04,0),.075);
  }
  for(const side of [-1,1])b.box("darkWood",0,eave-.2,side*d/2,w,.22,.28);
}
function windowBay(b:Builder,x:number,z:number,width:number,y:number,side=false,arched=false){
  const wh=2.25,win=Math.max(.7,width-.75),wallW=width-win;
  const part=(xx:number,yy:number,ww:number,hh:number,m:MaterialName="stone")=>b.box(m,side?x:xx,yy,side?xx:z,side?.3:ww,hh,side?ww:.3,true);
  part(side?z:x,y+.5,width,1);
  part(side?z:x,y+3.72,width,.96);
  for(const s of [-1,1])part((side?z:x)+s*(win/2+wallW/4),y+2.1,wallW/2,wh);
  b.box("glass",x,y+2.1,z,side?.08:win,wh,side?win:.08,true);
  b.box("metal",x+(side?.12:0),y+2.1,z+(side?0:.12),side?.12:.07,wh,side?.07:.12);
  b.box("stone",x+(side?.2:0),y+.92,z+(side?0:.2),side?.5:win+.22,.14,side?win+.22:.5);
  if(arched)arch(b,x,y+2.7,z,win/2,.25,side);
}
function shell(b:Builder,floors:number,options:{modern?:boolean;arcade?:boolean;roof?:boolean;height?:number}={}){
  const w=b.width,d=b.depth,h=options.height??floors*H,gap=Math.min(5,w*.3);
  b.floor(-w/2,w/2,-d/2,d/2,0,"stone");
  const nx=Math.max(2,Math.floor(w/4.1)),nz=Math.max(2,Math.floor(d/4.1));
  for(let f=0;f<floors;f++){
    for(let j=0;j<nx;j++)for(const side of [-1,1]){
      const x=-w/2+(j+.5)*w/nx;
      if(f===0&&side===1&&Math.abs(x)<gap/2+w/nx*.4)continue;
      windowBay(b,x,side*d/2,w/nx,f*H,false,options.arcade);
    }
    for(let j=0;j<nz;j++)for(const side of [-1,1])windowBay(b,side*w/2,-d/2+(j+.5)*d/nz,d/nz,f*H,true,false);
    for(const side of [-1,1])b.box(options.modern?"metal":"stone",0,f*H+H-.1,side*(d/2+.15),w+.4,.2,.4);
  }
  for(const side of [-1,1])b.box("stone",side*(gap/2+.12),1.6,d/2,.24,3.2,.4,true);
  b.box("stone",0,3.65,d/2,gap,.7,.35,true);
  b.box("glass",-gap/2-.14,1.6,d/2-.7,.08,3.2,1.4);
  b.box("glass",gap/2+.14,1.6,d/2-.7,.08,3.2,1.4);
  b.floor(-gap/2-1,gap/2+1,d/2,d/2+3,0,"concrete");
  if(options.roof!==false){if(options.modern)b.box("roof",0,h+.1,0,w+.8,.25,d+.8);else roof(b,h,Math.max(2,Math.min(5,d*.12)),true);}
}
export function stairSlot(b:Builder){const len=Math.min(15,b.width-5),z=-b.depth/2+3.1;return{minX:-len/2,maxX:len/2,minZ:z-1.25,maxZ:z+1.25};}
function levels(b:Builder,count:number,step=H,liftHole=false){
  const s=stairSlot(b),w=b.width,d=b.depth;
  for(let i=1;i<count;i++){
    const y=i*step,y0=y-step;
    const slab=(x0:number,x1:number,z0:number,z1:number)=>{
      const h=residenceLift;
      if(!liftHole||i!==1||x1<=h.minX||x0>=h.maxX||z1<=h.minZ||z0>=h.maxZ){b.floor(x0,x1,z0,z1,y);return;}
      const left=Math.max(x0,h.minX),right=Math.min(x1,h.maxX),back=Math.max(z0,h.minZ),front=Math.min(z1,h.maxZ);
      if(x0<left)b.floor(x0,left,z0,z1,y);if(right<x1)b.floor(right,x1,z0,z1,y);
      if(z0<back)b.floor(left,right,z0,back,y);if(front<z1)b.floor(left,right,front,z1,y);
    };
    slab(-w/2,w/2,-d/2,s.minZ);slab(-w/2,s.minX,s.minZ,s.maxZ);slab(s.maxX,w/2,s.minZ,s.maxZ);slab(-w/2,w/2,s.maxZ,d/2);
    b.ramps.push({...s,fromY:y0,toY:y,axis:"x"});
    const len=s.maxX-s.minX,n=28;
    for(let j=0;j<n;j++)b.box("concrete",s.minX+(j+.5)*len/n,y0+(j+1)*step/n-.07,(s.minZ+s.maxZ)/2,len/n+.01,.14,s.maxZ-s.minZ);
    for(const z of [s.minZ,s.maxZ]){b.beam("metal",new THREE.Vector3(s.minX,y0+1.1,z),new THREE.Vector3(s.maxX,y+1.1,z),.055);}
    b.rail(s.minX,s.maxZ+.06,s.maxX-1.1,s.maxZ+.06,y);
    b.sign(`LEVEL ${i+1}`,s.maxX+1.1,y+1.8,s.maxZ+.1,1.7,.3);
  }
}
function lights(b:Builder,count:number,height=3.6){
  for(let i=0;i<count;i++){
    // Emissive fixtures remain detailed without dozens of simultaneous lights.
    if(i<2)b.light(0,i*H+height,0,140);
    for(let x=-b.width*.35;x<b.width*.4;x+=4)for(const z of [-b.depth*.18,b.depth*.18])b.box("light",x,i*H+height,z,.75,.035,.22);
  }
}
function bookcase(b:Builder,x:number,z:number,y=0,w=3){
  b.box("darkWood",x,y+1.12,z,w,2.24,.45,true);
  for(let j=0;j<5;j++){
    b.box("timber",x,y+.13+j*.43,z+.22,w,.055,.56);
    for(let i=0;i<Math.floor(w/.16);i++){const m:MaterialName[]=["redBook","goldBook","blueBook","whiteBook","greenBook"];b.box(m[(i+j*3)%5],x-w/2+.1+i*.16,y+.31+j*.43,z+.28,.12,.28+(i%3)*.025,.2);}
  }
}
function desk(b:Builder,x:number,z:number,y=0,computer=false){b.table(x,z,y,false);b.chair(x,z+.85,y);if(computer){b.box("metal",x,y+1.12,z-.1,.65,.38,.06);b.box("blue",x,y+1.12,z-.06,.58,.3,.02);b.box("metal",x,y+.86,z-.08,.06,.23,.06);b.box("white",x,y+.8,z+.2,.5,.025,.2);}}
function sofa(b:Builder,x:number,z:number,y=0,w=2.4){b.box("fabric",x,y+.38,z,w,.5,.9,true);b.box("fabric",x,y+.75,z-.4,w,.65,.14);for(const s of [-1,1])b.box("fabric",x+s*w/2,y+.6,z,.16,.65,.9);b.box("timber",x,y+.35,z+1.6,w*.6,.12,.7,true);}
function meetingRoom(b:Builder,x:number,z:number,w:number,d:number,y=0,title="SEMINAR ROOM"){
  // Two side walls and rear teaching wall; the front stays open to public circulation.
  wall(b,"white",x,z-d/2,w,.16,y,3.3);for(const s of [-1,1])wall(b,"glass",x+s*w/2,z,.12,d,y,3.3);
  b.box("white",x,y+2,z-d/2+.13,w*.7,1.2,.04);b.sign(title,x,y+2.8,z+d/2,Math.min(w,5),.4);
  for(let xx=x-w*.3;xx<x+w*.4;xx+=2.5)for(let zz=z-d*.22;zz<z+d*.35;zz+=2.7)desk(b,xx,zz,y);
}
function arcade(b:Builder,width:number,z:number,h=3.6,y=0){
  const n=Math.max(3,Math.floor(width/4.6)|1),span=width/n;
  for(let i=0;i<=n;i++){const x=-width/2+i*span;column(b,x,z,h,y,.34);}
  for(let i=0;i<n;i++)arch(b,-width/2+(i+.5)*span,y+h,z,span/2,.44);
  b.box("stone",0,y+h+span/2+.5,z,width+.8,.65,.8);
}
function masonry(b:Builder,w:number,h:number,z:number){
  for(let y=.5;y<h;y+=.65)for(let x=-w/2+.4;x<w/2;x+=1.8)b.box("concrete",x+((Math.round(y/.65)%2)*.3),y,z,1.5,.026,.035);
}
function memorial(b:Builder){
  const w=b.width,d=b.depth,h=16.5,r=w*.32;b.materials.stone.color.setHex(0xc5aa7a);b.materials.fabric.color.setHex(0x8c2129);
  b.floor(-w/2,w/2,-d/2,d/2);wall(b,"stone",0,-d/2,w,.6,0,h);
  for(const s of [-1,1])wall(b,"stone",s*w/2,0,.6,d,0,h);
  const front=d/2,gap=Math.min(w*.22,4.6);
  for(const s of [-1,1])wall(b,"stone",s*(w+gap)/4,front,(w-gap)/2,.7,0,h);
  wall(b,"stone",0,front,gap,.7,5.4,h-5.4);arch(b,0,3.5,front+.4,gap/2,.7);
  for(const x of [-w*.33,w*.33]){arch(b,x,3.4,front+.5,w*.13,.6);b.box("darkWood",x,1.6,front+.4,w*.2,3.2,.12);}
  for(let z=-d*.32;z<d*.36;z+=5.4){
    for(const s of [-1,1]){column(b,s*r,z,7,0,.48);arch(b,s*r,7,z,2.7,.55,true);}
    b.beam("darkWood",new THREE.Vector3(-r,15.7,z),new THREE.Vector3(0,20.8,z),.28);b.beam("darkWood",new THREE.Vector3(0,20.8,z),new THREE.Vector3(r,15.7,z),.28);
  }
  b.box("fabric",0,.02,0,2.5,.025,d*.88);
  for(let z=-d*.24;z<d*.34;z+=1.4)for(const s of [-1,1])b.bench(s*w*.2,z,w*.25);
  b.floor(-w*.28,w*.28,-d*.45,-d*.29,.24,"white");b.ramps.push({minX:-1.5,maxX:1.5,minZ:-d*.29,maxZ:-d*.29+1.8,fromY:.24,toY:0,axis:"z"});
  b.box("white",0,1,-d*.39,3.2,1.5,1.1,true);
  for(let i=-3;i<=3;i++){const x=i*w*.12;arch(b,x,9.8,-d/2+.35,w*.05,.3);b.box(i%2?"blueBook":"goldBook",x,8,-d/2+.38,w*.075,3.5,.08);}
  // Original geometric mosaic: tesserae and abstract figure silhouettes, no photo texture.
  for(let row=0;row<24;row++)for(let col=0;col<50;col++){
    const x=-w/2+(col+.5)*w/50,y=6.3+row*.45;if(y>h+(1-Math.abs(x)/(w/2))*5)continue;
    const colors:MaterialName[]=["goldBook","stone","goldBook","blueBook","greenBook","clay"];const material=colors[(col*11+row*7)%colors.length];
    if(Math.abs(x)<w*.11&&y<10.5)continue;b.box(material,x,y,front+.39,w/50*.92,.42,.035);
  }
  for(let i=-5;i<=5;i++){const x=i*w*.075,y=12.6+Math.cos(i*.55)*1.3;b.cylinder(i%2?"blueBook":"redBook",x,y,front+.46,.32,1.6);b.cylinder("goldBook",x,y+1.05,front+.46,.18,.35);}
  arch(b,0,8,front+.55,w*.16,.5);b.box("blueBook",0,8.7,front+.5,w*.27,3.5,.07);
  for(const s of [-1,1])for(let i=0;i<3;i++){const x=s*(w*.23+i*w*.085);arch(b,x,8.7,front+.55,w*.033,.18);b.box("blueBook",x,8.1,front+.5,w*.05,1.8,.06);}
  // Pipe-organ interpretation at the back of the nave.
  for(let i=-10;i<=10;i++){const x=i*.28;b.cylinder("metal",x,6.2+Math.abs(i)*.08,front-1,.095,2.4+Math.abs(i)*.16);}
  roof(b,h,6);b.box("stone",0,h+6.7,front,.28,2.6,.28);b.box("stone",0,h+7,front,1.5,.24,.28);
  b.sign("MEMORIAL CHURCH",0,5.8,front+.46,Math.min(w*.6,12),.5);b.light(0,10,0,500);
}
function mainQuad(b:Builder){
  shell(b,1,{roof:false});roof(b,H,3.1);arcade(b,b.width,dFront(b)+1.8,3.4);b.floor(-b.width/2,b.width/2,dFront(b),dFront(b)+3.6);
  for(let x=-b.width*.35;x<b.width*.4;x+=7){b.table(x,0);bookcase(b,x,-b.depth*.28,0,3);}
  b.sign("MAIN QUAD · HISTORIC LEARNING SPACES",0,3.4,dFront(b)+.1,Math.min(b.width*.75,16),.45);lights(b,1);
}
function dFront(b:Builder){return b.depth/2;}
function hoover(b:Builder){
  const w=b.width,d=b.depth,deck=75.6;b.materials.stone.color.setHex(0xd5c3a0);
  b.floor(-w/2,w/2,-d/2,d/2);levels(b,19); // A continuous interpreted stair route to the belvedere.
  for(const s of [-1,1]){b.box("stone",s*(w/2-.12),deck/2,0,.4,deck,d,true);if(s<0)b.box("stone",0,deck/2,s*(d/2-.12),w,deck,.4,true);}
  // Preserve the central ground doorway in the south-facing wall.
  const door=4;for(const s of [-1,1])b.box("stone",s*(w+door)/4,deck/2,d/2,(w-door)/2,deck,.4,true);b.box("stone",0,(deck+3.5)/2,d/2,door,deck-3.5,.4,true);
  for(let y=12;y<deck-5;y+=9)for(const s of [-1,1])b.box("metal",s*w*.23,y,d/2+.24,.6,2.1,.08);
  const radius=Math.min(w,d)*.43;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,x=i===7?radius:Math.cos(a)*radius,z=Math.sin(a)*radius;column(b,x,z,6,deck,.42);}
  for(let i=0;i<8;i++){const a=i*Math.PI/4,a2=(i+1)*Math.PI/4;b.beam("stone",new THREE.Vector3(Math.cos(a)*radius,deck+6.5,Math.sin(a)*radius),new THREE.Vector3(Math.cos(a2)*radius,deck+6.5,Math.sin(a2)*radius),.9);}
  for(const s of [-1,1]){b.rail(-w/2+.5,s*(d/2-.5),w/2-.5,s*(d/2-.5),deck);b.rail(s*(w/2-.5),-d/2+.5,s*(w/2-.5),d/2-.5,deck);}
  const cap=new THREE.Mesh(new THREE.SphereGeometry(radius*1.03,24,12,0,Math.PI*2,0,Math.PI/2),b.materials.roof);cap.position.set(0,82.1,0);cap.scale.y=.66;cap.userData.roof=true;b.group.add(cap);
  b.cylinder("goldBook",0,86,0,.15,1.7);b.cylinder("goldBook",0,86.9,0,.32,.45);
  b.sign("HOOVER TOWER · EXHIBITION GALLERIES",0,3.2,d/2+.3,w*.85,.4);
  for(const x of [-w*.32,w*.32]){b.box("darkWood",x,1.2,0,1.5,1.8,.2,true);b.box("goldBook",x,1.25,.12,1.25,1.45,.04);}
  b.sign("CAMPUS OBSERVATION DECK",0,deck+2.4,-d/2+.4,w*.8,.4);lights(b,1);b.group.userData.observationDeckHeight=deck;
}
function library(b:Builder,bing:boolean){
  const levelsN=bing?5:3;shell(b,levelsN,{arcade:bing});levels(b,levelsN);b.materials.fabric.color.setHex(0x845e48);
  if(bing){arcade(b,b.width,dFront(b)+1,4);for(const x of [-b.width*.29,0,b.width*.29])arch(b,x,8.3,dFront(b)+.5,b.width*.1,.6);}
  for(let level=0;level<levelsN;level++){
    const y=level*H;
    for(let z=-b.depth*.23;z<b.depth*.26;z+=3.5)bookcase(b,-b.width*.34,z,y,Math.min(6,b.width*.22));
    for(let x=b.width*.08;x<b.width*.4;x+=3.2)for(let z=-b.depth*.22;z<b.depth*.26;z+=3.5){desk(b,x,z,y,level===0);b.cylinder("metal",x,y+1.07,z-.23,.025,.5);b.box("greenBook",x,y+1.34,z-.23,.38,.1,.22);}
    sofa(b,-b.width*.25,b.depth*.33,y);
    const labels=bing?["JONSSON SOCIAL SCIENCES READING ROOM","LANE READING ROOM","HISTORY SEMINAR ROOM","DAVID RUMSEY MAP CENTER","ALBERT M. BENDER ROOM"]:["HOHBACH HALL · SILICON VALLEY ARCHIVES","HUMANITIES & SOCIAL SCIENCES","QUIET STUDY"];
    b.sign(labels[level],0,y+2.6,dFront(b)-.5,Math.min(b.width*.78,15),.5,Math.PI);
    if(bing&&level===3){b.box("metal",b.width*.28,y+2.1,-b.depth*.2,6,2.6,.15);for(let i=0;i<3;i++)b.box("greenBook",b.width*.28-2+i*2,y+2.1,-b.depth*.2+.1,1.9,2.4,.02);}
  }
  b.box("timber",b.width*.27,.65,dFront(b)-3.7,5.5,1.3,1.3,true);b.sign(titles[bing?"bing-wing":"green-library"],0,3.45,dFront(b)+.3,Math.min(b.width*.8,18),.55);lights(b,2);
}
function art(b:Builder,kind:string){
  const contemporary=kind!=="cantor",levelsN=kind==="mcmurtry"?3:2;shell(b,levelsN,{modern:contemporary,roof:kind!=="mcmurtry"});levels(b,kind==="mcmurtry"?4:levelsN);
  b.materials.stone.color.setHex(contemporary?0xd9d4c5:0xcfc2a2);b.materials.fabric.color.setHex(0x766c62);
  if(kind==="cantor"){
    for(const x of [-b.width*.34,-b.width*.2,-b.width*.07,b.width*.07,b.width*.2,b.width*.34])column(b,x,dFront(b)+2,6.8,0,.45);
    b.box("stone",0,7.2,dFront(b)+2,b.width*.86,.85,3.4);b.sign("IRIS & B. GERALD CANTOR CENTER FOR VISUAL ARTS",0,7.25,dFront(b)+3.75,b.width*.8,.4);
  }else if(kind==="anderson"){
    b.box("white",0,H+.3,dFront(b)+.4,b.width+.7,.65,1);for(let x=-b.width/2+1;x<b.width/2;x+=1.7)b.box("white",x,2*H+.6,0,.1,1.2,b.depth+.2);
  }else{
    for(const s of [-1,1])b.box(s>0?"metal":"stone",s*b.width*.3,3*H+.2,0,b.width*.38,.5,b.depth+.6);
    b.rail(-b.width/2,dFront(b),b.width/2,dFront(b),3*H);
    for(const x of [-b.width*.35,b.width*.35]){b.box("turf",x,3*H+.12,0,b.width*.18,.24,b.depth*.4);}
  }
  for(let floor=0;floor<levelsN;floor++){
    const y=floor*H;for(const x of [-b.width*.28,b.width*.28]){
      wall(b,"white",x,-b.depth*.05,b.width*.22,.24,y,3.1);
      for(let n=0;n<3;n++){const px=x+(n-1)*b.width*.065;b.box("darkWood",px,y+1.8,-b.depth*.05+.15,b.width*.055,1.4,.05);b.box(n%2?"redBook":"blueBook",px,y+1.8,-b.depth*.05+.19,b.width*.05,1.3,.025);}
      b.bench(x,b.depth*.2,Math.min(4,b.width*.18),y);
      b.box("white",x,y+.55,-b.depth*.24,1.4,1.1,1.4,true);b.cylinder("metal",x,y+1.6,-b.depth*.24,.45,1);
    }
    b.sign(kind==="mcmurtry"?(floor===0?"GALLERY ARCADE & OSHMAN HALL":floor===1?"ART PRACTICE STUDIOS":"ART & ARCHITECTURE LIBRARY"):floor?"UPPER GALLERIES":"WELCOME · GALLERIES",0,y+2.8,dFront(b)-.4,Math.min(b.width*.7,14),.4,Math.PI);
  }
  b.sign(titles[kind],0,3.4,dFront(b)+.25,Math.min(b.width*.75,16),.5);lights(b,2);b.group.userData.artworks="Original abstract study objects; not reproductions of collection works";
}
function concert(b:Builder){
  const w=b.width,d=b.depth,h=16,rx=w*.46,rz=d*.43;b.materials.fabric.color.setHex(0x76282c);
  b.floor(-w/2,w/2,-d/2,d/2);
  for(let i=0;i<64;i++){
    const a=i*Math.PI*2/64,a2=(i+1)*Math.PI*2/64,x=Math.sin(a)*rx,z=Math.cos(a)*rz;
    if(z>rz*.8&&Math.abs(x)<4)continue;
    const xn=Math.sin(a2)*rx,zn=Math.cos(a2)*rz,len=Math.hypot(xn-x,zn-z);b.box("stone",(x+xn)/2,h/2,(z+zn)/2,len+.05,h,.3,false,-Math.atan2(zn-z,xn-x));
    b.colliders.push({minX:x-.35,maxX:x+.35,minZ:z-.35,maxZ:z+.35,minY:0,maxY:h});
  }
  // Glazed, low entrance pavilion in front of the oval acoustic shell.
  for(const s of [-1,1])b.box("glass",s*w*.28,2.7,d/2,w*.38,5.4,.1,true);
  b.box("white",0,5.5,d*.4,w+.8,.3,d*.22);b.sign(titles["bing-concert"],0,4.6,d/2+.2,w*.7,.6);
  b.floor(-w*.16,w*.16,-d*.17,d*.05,.35,"timber");b.ramps.push({minX:-1.3,maxX:1.3,minZ:d*.05,maxZ:d*.05+2.5,fromY:.35,toY:0,axis:"z"});
  b.box("darkWood",-1,.95,-d*.04,1.7,1.1,2.3,true);b.box("metal",-1,1.65,-d*.04,1.9,.08,2.3);b.chair(-1,d*.03,.35);
  // Vineyard terraces separated by broad radial aisles. Circulation stays at
  // ground level between blocks; ramps rise within the two side seating blocks.
  for(const side of [-1,1])for(let row=0;row<7;row++){
    const y=row*.28,x=side*(w*.2+row*1.25);b.floor(x-.62,x+.62,-d*.28,d*.21,y,"timber");
    for(let z=-d*.24;z<d*.2;z+=.82){b.chair(x,z,y,side*Math.PI/2);}
  }
  for(let row=0;row<6;row++){
    const z=-d*.22-row*1.25,y=row*.28;b.floor(-w*.17,w*.17,z-.62,z+.62,y,"timber");
    for(let x=-w*.15;x<w*.16;x+=.8)if(Math.abs(x)>1.3)b.chair(x,z,y,Math.PI);
  }
  for(const side of [-1,1])b.ramps.push({minX:side<0?-w*.2-7.5:w*.2,maxX:side<0?-w*.2:w*.2+7.5,minZ:d*.21,maxZ:d*.21+1.5,fromY:side<0?1.68:0,toY:side<0?0:1.68,axis:"x"});
  // Suspended acoustic sails, modelled from the photographed soft curved panels.
  for(let n=0;n<7;n++){
    const a=n*Math.PI*2/7,g=new THREE.PlaneGeometry(w*.2,7,8,8),pos=g.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setZ(i,Math.cos(pos.getX(i)/(w*.1)*1.1)*1.1+Math.pow(pos.getY(i)/7,2));g.computeVertexNormals();
    const sail=new THREE.Mesh(g,b.materials.white);sail.position.set(Math.sin(a)*w*.27,10.5,Math.cos(a)*d*.27);sail.rotation.y=a+Math.PI;sail.material.side=THREE.DoubleSide;b.group.add(sail);
  }
  const ceiling=new THREE.Mesh(new THREE.CircleGeometry(1,64),b.materials.timber);ceiling.scale.set(rx,rz,1);ceiling.rotation.x=Math.PI/2;ceiling.position.y=h;ceiling.material.side=THREE.DoubleSide;ceiling.userData.roof=true;b.group.add(ceiling);b.light(0,11,0,550);
}
function auditorium(b:Builder,kind:string){
  const w=b.width,d=b.depth,h=11;shell(b,1,{modern:kind==="dinkelspiel",height:h,roof:false});b.box("roof",0,h,0,w+.6,.3,d+.6);
  for(const s of [-1,1])wall(b,"stone",s*w/2,0,.35,d,H,h-H);wall(b,"stone",0,-d/2,w,.35,H,h-H);
  b.materials.fabric.color.setHex(0x82333b);
  if(kind!=="dinkelspiel")arcade(b,w*.9,dFront(b)+1.5,4);
  b.floor(-w*.36,w*.36,-d*.43,-d*.24,.75,"darkWood");
  b.ramps.push({minX:w*.37,maxX:w*.45,minZ:-d*.42,maxZ:-d*.2,fromY:.75,toY:0,axis:"z"});
  b.box("redBook",0,4.4,-d*.44,w*.76,7,.2);b.box("metal",0,8,-d*.28,w*.86,.2,.2);
  for(let x=-w*.35;x<w*.4;x+=3)b.cylinder("metal",x,7.6,-d*.28,.18,.45);
  for(let row=0;row<15;row++){
    const z=-d*.16+row*(d*.035),y=row*.15;b.floor(-w*.37,w*.37,z-.4,z+d*.0175,y,"darkWood");
    for(let x=-w*.34;x<w*.35;x+=.82){if(Math.abs(x)<1.3||Math.abs(Math.abs(x)-w*.19)<.8)continue;b.chair(x,z,y);}
  }
  b.ramps.push({minX:-1.15,maxX:1.15,minZ:-d*.16,maxZ:-d*.16+14*d*.035,fromY:0,toY:2.1,axis:"z"});
  b.ramps.push({minX:-1.15,maxX:1.15,minZ:d*.33,maxZ:d*.46,fromY:2.1,toY:0,axis:"z"});
  b.sign(titles[kind],0,3.5,dFront(b)+.25,w*.75,.55);b.light(0,9,0,400);
}
function academic(b:Builder,kind:string){
  const w=b.width,d=b.depth,modern=["huang","clark","hewlett","peterson"].includes(kind),n=kind==="hewlett"?2:3;
  shell(b,n,{modern,arcade:kind==="gates"});levels(b,n);
  if(kind==="gates"){
    arch(b,0,5.4,dFront(b)+.45,Math.min(w*.22,6),.8);for(const s of [-1,1])column(b,s*Math.min(w*.22,6),dFront(b)+.4,5.4,0,.55);
    for(const x of [-w*.33,w*.33]){b.box("metal",x,1.2,d*.27,3,2.2,.8,true);for(let j=0;j<5;j++)b.box("white",x-1.2+j*.6,1.55,d*.27+.42,.35,.65,.03);b.sign("COMPUTING HISTORY",x,2.6,d*.27+.48,3.8,.3);}
  }
  if(kind==="huang"){
    // Octagonal rotunda at the public entrance, with open ground-level bays.
    const r=Math.min(7,w*.21);for(let i=0;i<8;i++){if(i===0||i===4)continue;const a=i*Math.PI/4;column(b,Math.sin(a)*r,dFront(b)+Math.cos(a)*r*.55,8,0,.35);}
    const rotunda=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1,8),b.materials.roof);rotunda.position.set(0,10,dFront(b));rotunda.scale.z=.6;rotunda.userData.roof=true;b.group.add(rotunda);
    // Steel braces and bleacher commons echo the photographed engineering atrium.
    for(const s of [-1,1])b.beam("white",new THREE.Vector3(s*w*.3,.2,d*.24),new THREE.Vector3(s*w*.1,11,d*.24),.4);
    for(let row=0;row<6;row++)b.box("timber",-w*.3,.2+row*.32,-d*.12-row*.85,w*.3,.32,.9,true);
  }
  if(kind==="clark"){
    b.box("white",0,n*H+.6,dFront(b),w+.5,.65,2);for(let x=-w/2+2;x<w/2;x+=3)b.box("metal",x,n*H+.25,dFront(b)+1,.12,.5,3.3);
  }
  if(kind==="packard")for(const side of [-1,1])for(let z=-d/2+2;z<d/2;z+=4)b.box("stone",side*(w/2+.25),n*H/2,z,.6,n*H,.65);
  for(let level=0;level<n;level++){
    const y=level*H;
    if(kind==="peterson"){
      for(const side of [-1,1])for(let z=-d*.18;z<d*.25;z+=4){b.table(side*w*.26,z,y);b.box("white",side*w*.39,y+1.6,z,2.3,1.4,.12,true);for(let j=0;j<9;j++)b.box(j%2?"goldBook":"redBook",side*w*.39-.9+(j%3)*.6,y+1.2+Math.floor(j/3)*.35,z+.08,.35,.22,.02);}
    }else{
      meetingRoom(b,-w*.27,0,w*.38,d*.43,y,kind==="law"?"SEMINAR & MOOT COURT":kind==="hewlett"?"TEACHING AUDITORIUM":kind==="knight"?"CASE DISCUSSION ROOM":"PUBLIC LEARNING SPACE");
      for(let z=-d*.2;z<d*.28;z+=3.5)desk(b,w*.26,z,y,["gates","packard","clark"].includes(kind));
    }
    if(kind==="law"&&level===0){b.box("darkWood",-w*.27,1.1,-d*.18,w*.25,2.2,.8,true);b.box("timber",-w*.27,.4,-d*.1,w*.3,.15,1.8);}
    sofa(b,w*.25,d*.3,y);
  }
  b.sign(titles[kind],0,3.4,dFront(b)+.3,Math.min(w*.85,23),.55);lights(b,2);
}
function social(b:Builder,kind:string){
  const w=b.width,d=b.depth,n=kind==="bookstore"?2:2;shell(b,n,{modern:kind!=="old-union",arcade:kind==="old-union"});levels(b,n);
  if(kind==="old-union")arcade(b,w,dFront(b)+1.5,3.5);
  if(kind==="bookstore"){
    b.materials.fabric.color.setHex(0x8c1515);
    for(let floor=0;floor<2;floor++)for(const side of [-1,1]){
      const y=floor*H;
      for(let z=-d*.25;z<d*.25;z+=3.8){bookcase(b,side*w*.28,z,y,Math.min(w*.25,8));}
      for(let j=0;j<6;j++){const x=side*w*.28+(j-2.5)*.7;b.box("metal",x,y+1.5,d*.32,.025,1.7,.025);b.box("fabric",x,y+1.25,d*.32,.46,.65,.15);b.box("fabric",x,y+1.43,d*.32,.72,.2,.15);}
    }
    b.box("timber",w*.26,.6,d*.4,w*.25,1.2,1.3,true);b.sign("BOOKS · COURSE MATERIALS · CAMPUS SUPPLIES",0,2.7,-d*.1,Math.min(w*.8,17),.4);
  }else{
    for(let floor=0;floor<2;floor++){
      const y=floor*H;for(const side of [-1,1])for(let z=-d*.2;z<d*.31;z+=4.5){b.table(side*w*.25,z,y);}
      b.box("timber",-w*.28,y+.6,Math.max(-d*.31,-d/2+6.5),w*.33,1.2,1.5,true);b.sign(floor?"STUDENT MEETING & LOUNGE SPACES":"CAFÉ & CAMPUS COMMONS",0,y+2.8,dFront(b)-.5,w*.72,.4,Math.PI);
      sofa(b,w*.27,-d*.22,y);
    }
  }
  b.sign(titles[kind],0,3.4,dFront(b)+.3,Math.min(w*.8,18),.55);lights(b,2);
}
function residenceDemonstrator(b:Builder){
  const y=residenceFloor,doorWidth=residenceDoorWidth;
  for(const [i,r] of residenceRooms.entries()){
    const z=r.doorZ+r.depth/2,sideWidth=(r.width-doorWidth)/2;
    wall(b,"white",r.x-r.width/2,z,.16,r.depth,y,3.3);
    if(i===residenceRooms.length-1)wall(b,"white",r.x+r.width/2,z,.16,r.depth,y,3.3);
    wall(b,"white",r.x,r.doorZ+r.depth,r.width,.16,y,3.3);
    for(const side of [-1,1])wall(b,"white",r.x+side*(r.width/2-sideWidth/2),r.doorZ,sideWidth,.16,y,3.3);
    wall(b,"white",r.x,r.doorZ,doorWidth,.16,y+2.25,1.05);
    for(const side of [-1,1])b.box("darkWood",r.x+side*(doorWidth/2+.045),y+1.12,r.doorZ,.09,2.24,.22);
    b.sign(`ROOM ${r.id} · ${r.beds===2?"DOUBLE":"SINGLE"}`,r.x,y+2.75,r.doorZ-.12,3.1,.28,Math.PI);
    for(let bed=0;bed<r.beds;bed++){
      const x=r.x+(r.beds===2?(bed?1:-1):-1),zBed=5.3;
      b.box("darkWood",x,y+.3,zBed,.95,.4,2.2,true);b.box("whiteBook",x,y+.55,zBed,.91,.18,2.1);b.box("fabric",x,y+.68,zBed+.2,.9,.08,1.5);b.box("white",x,y+.71,zBed-.73,.8,.12,.4);
      b.box("timber",x,y+.42,8.5,1.25,.8,.7,true);b.box("timber",x,y+.85,8.5,1.35,.08,.8);b.chair(x,7.65,y,Math.PI);
    }
    b.box("timber",r.x+1.3,y+1.15,9.45,.9,2.3,1.05,true);b.box("white",r.x,y+2.1,10.19,1.6,.9,.035);
  }
  const bath=residenceBathroom;
  for(const side of [-1,1])wall(b,"white",bath.x+side*bath.width/2,bath.z,.16,bath.depth,y,3.3);
  wall(b,"white",bath.x,bath.z-bath.depth/2,bath.width,.16,y,3.3);
  const piece=(bath.width-doorWidth)/2;
  for(const side of [-1,1])wall(b,"white",bath.x+side*(bath.width/2-piece/2),bath.doorZ,piece,.16,y,3.3);
  wall(b,"white",bath.x,bath.doorZ,doorWidth,.16,y+2.25,1.05);
  for(const x of [bath.x-1,bath.x+1]){
    b.box("white",x,y+.28,bath.z-1.25,.55,.56,.72,true);b.box("white",x,y+.85,bath.z-1.57,.55,.58,.22);b.box("whiteBook",x,y+.59,bath.z-1.2,.65,.08,.75);
  }
  b.box("white",bath.x+1.3,y+.78,bath.z+.6,.6,.18,.6,true);b.box("glass",bath.x+1.8,y+1.55,bath.z+.6,.035,.75,.7);
  b.sign("SHARED BATHROOM",bath.x,y+2.7,bath.doorZ+.12,3.5,.27);
  b.sign("BRANNER RESIDENCE DEMONSTRATION · INTERPRETED PLAN",0,y+2.8,-1.4,15,.32);
  b.sign("LIFT · LOBBY ↔ DEMONSTRATION FLOOR",9.5,y+2.6,-2.7,3.8,.22);
  b.group.userData.residenceDemonstrator={floor:y,rooms:residenceRooms,lift:residenceLift,bathroom:residenceBathroom,notice:"Original demonstration plan; no current room assignments or surveyed lift location."};
}
function residence(b:Builder,kind:string){
  const w=b.width,d=b.depth;shell(b,3,{arcade:kind!=="roble"});levels(b,3,H,kind==="branner");
  if(kind==="roble")for(const x of [-w*.19,w*.19])column(b,x,dFront(b)+.7,6.5,0,.42);
  if(kind==="encina"){
    for(const side of [-1,1])b.box("stone",side*w*.4,6,dFront(b)+1.2,w*.18,12,2.4);masonry(b,w,12,dFront(b)+.24);
  }
  for(const side of [-1,1])sofa(b,side*w*.27,0,0,Math.min(4,w*.25));
  b.box("stone",0,1.6,Math.max(-d*.28,-d/2+6.5),4,3.2,.7,true);b.box("darkWood",0,.8,Math.max(-d*.28,-d/2+6.5)+.4,2.5,1.6,.12);b.sign("COMMON ROOM",0,2.7,dFront(b)-.5,w*.55,.5,Math.PI);
  for(let floor=1;floor<3;floor++){
    const y=floor*H;
    if(kind==="branner"&&floor===1){residenceDemonstrator(b);continue;}
    if(kind==="encina"){meetingRoom(b,-w*.25,2,w*.35,d*.4,y,"INTERNATIONAL STUDIES SEMINAR");for(let z=-d*.2;z<d*.28;z+=3.5){desk(b,w*.28,z,y);bookcase(b,-w*.35,z,y,3);}continue;}
    for(const side of [-1,1]){
      const x=side*w*.27;
      wall(b,"white",x,-d*.2,w*.4,.15,y,3.3);b.box("darkWood",x,y+.3,0,1.25,.4,2.2,true);b.box("whiteBook",x,y+.55,0,1.2,.18,2.1);b.box("fabric",x,y+.68,.2,1.2,.08,1.55);b.box("white",x,y+.7,-.75,.9,.12,.4);
      desk(b,x,d*.24,y,true);b.box("timber",x+side*w*.13,y+1.1,0,.7,2.2,1.1,true);
    }
    b.sign(kind==="encina"?"PUBLIC SEMINAR & READING SPACE":"DEMONSTRATION RESIDENCE · NO ROOM ASSIGNMENTS",0,y+2.5,dFront(b)-.5,Math.min(w*.8,18),.38,Math.PI);
  }
  b.sign(titles[kind],0,3.4,dFront(b)+.25,Math.min(w*.8,17),.5);lights(b,2);
}
function maples(b:Builder){
  const w=b.width,d=b.depth,h=16;b.materials.fabric.color.setHex(0x8c1515);shell(b,1,{modern:true,roof:false});
  b.floor(-w/2,w/2,-d/2,d/2,0,"concrete");b.box("timber",0,.035,0,28.65,.07,15.24);
  for(const x of [-14.325,14.325]){b.box("white",x,.09,0,.07,.015,15.24);b.box("metal",x+Math.sign(x)*1.3,2.2,0,.15,4.4,.15);b.box("white",x,3.35,0,.1,1.05,1.8);b.beam("metal",new THREE.Vector3(x+Math.sign(x)*1.3,3.6,0),new THREE.Vector3(x,3.6,0),.1);const hoop=new THREE.Mesh(new THREE.TorusGeometry(.23,.025,6,24),b.materials.clay);hoop.rotation.x=Math.PI/2;hoop.position.set(x-Math.sign(x)*.35,3.05,0);b.group.add(hoop);}
  for(const z of [-7.62,7.62])b.box("white",0,.09,z,28.65,.015,.07);b.box("white",0,.09,0,.07,.015,15.24);
  for(const side of [-1,1])for(let row=0;row<12;row++){
    const z=side*(10+row*.85),y=row*.34;b.floor(-w*.38,w*.38,z-.42,z+.42,y,"concrete");for(let x=-w*.35;x<w*.36;x+=.76)if(Math.abs(x)>1.6)b.chair(x,z,y,side<0?Math.PI:0);
  }
  for(const side of [-1,1])b.ramps.push({minX:-1.3,maxX:1.3,minZ:side<0?-19.35:10,maxZ:side<0?-10:19.35,fromY:side<0?3.74:0,toY:side<0?0:3.74,axis:"z"});
  for(let x=-w/2+1;x<w/2;x+=4){const rise=3*(1-Math.pow(x/(w/2),2));b.beam("timber",new THREE.Vector3(x,h-rise,-d/2),new THREE.Vector3(x,h-rise,d/2),.42);}
  const g=new THREE.PlaneGeometry(w+1,d+1,20,20),p=g.attributes.position;g.rotateX(-Math.PI/2);for(let i=0;i<p.count;i++)p.setY(i,h+2.7*(Math.pow(p.getX(i)/(w/2),2)-Math.pow(p.getZ(i)/(d/2),2)));g.computeVertexNormals();const roofMesh=new THREE.Mesh(g,b.materials.roof);roofMesh.userData.roof=true;roofMesh.material.side=THREE.DoubleSide;b.group.add(roofMesh);
  b.box("metal",0,8,0,4,2.2,3);for(const side of [-1,1])b.sign("STANFORD",0,8,side*1.51,3.5,1.2,side<0?Math.PI:0);
  b.sign(titles.maples,0,3.5,dFront(b)+.2,w*.6,.6);b.light(0,10,0,600);
}
function trainingGym(b:Builder,kind:string){
  const w=b.width,d=b.depth;shell(b,1,{modern:true,roof:false});b.box("roof",0,8,0,w+.5,.3,d+.5);
  for(const side of [-1,1])wall(b,"stone",side*w/2,0,.3,d,H,8-H);wall(b,"stone",0,-d/2,w,.3,H,8-H);
  if(kind==="squash"){
    for(const side of [-1,1]){const x=side*w*.25;b.box("timber",x,.04,0,6.4,.08,9.75);wall(b,"white",x,-4.87,6.4,.15,0,5.64);wall(b,"glass",x+side*3.2,0,.1,9.75,0,5.64);b.box("redBook",x,1.78,-4.75,6.4,.055,.03);b.box("redBook",x,4.57,-4.75,6.4,.055,.03);b.box("white",x,.5,-4.72,6.4,.7,.03);b.box("redBook",x,.09,0,6.4,.02,.05);}
  }else{
    b.box("fabric",-w*.22,.05,0,Math.min(12,w*.4),.1,Math.min(12,d*.7));
    for(const x of [w*.18,w*.32]){b.cylinder("metal",x,1.3,-d*.15,.05,2.6);b.cylinder("metal",x,1.3,d*.15,.05,2.6);b.beam("timber",new THREE.Vector3(x,2.6,-d*.15),new THREE.Vector3(x,2.6,d*.15),.07);}
    b.box("darkWood",w*.25,1.15,d*.3,1.7,.5,.5);for(const x of [w*.25-.5,w*.25+.5])b.box("metal",x,.55,d*.3,.07,1.1,.07);
    for(const side of [-1,1]){b.bench(side*w*.3,-d*.34,Math.min(w*.25,7));}
  }
  for(let x=-w*.4;x<w*.45;x+=5)b.beam("metal",new THREE.Vector3(x,7.5,-d/2),new THREE.Vector3(x,7.5,d/2),.2);
  b.sign(titles[kind],0,3.4,dFront(b)+.2,w*.8,.5);b.light(0,7,0,350);
}
function windhover(b:Builder){
  shell(b,1,{modern:true});b.materials.stone.color.setHex(0xa38b70);b.materials.roof.color.setHex(0x403d34);
  for(const side of [-1,1])for(let y=.2;y<3.8;y+=.16)b.box("clay",side*(b.width/2+.18),y,0,.035,.023,b.depth);
  for(let z=-b.depth/2+1;z<b.depth/2;z+=2)b.box("timber",0,4,z,b.width,.16,.14);
  for(const side of [-1,1]){b.bench(side*b.width*.27,0,b.width*.24);b.box("darkWood",side*b.width*.3,2,-b.depth*.28,b.width*.25,2.6,.12);b.box("goldBook",side*b.width*.3,2,-b.depth*.28+.08,b.width*.23,2.4,.02);}
  b.sign("WINDHOVER · CONTEMPLATION",0,3.1,dFront(b)+.2,b.width*.8,.4);lights(b,1);
}
function mausoleum(b:Builder){
  const w=b.width,d=b.depth;shell(b,1,{roof:false});b.materials.stone.color.setHex(0x9c9d96);b.box("stone",0,4.4,0,w+1,.7,d+1);b.box("stone",0,4.85,0,w+.5,.3,d+.5);
  for(const side of [-1,1])column(b,side*w*.33,dFront(b)+.8,3.6,0,.45);
  b.sign("STANFORD",0,3.5,dFront(b)+.35,w*.7,.5);
  for(const x of [-w*.28,0,w*.28]){b.box("stone",x,.65,-d*.14,w*.22,1.3,d*.36,true);b.box("whiteBook",x,1.33,-d*.14,w*.23,.1,d*.37);}
  b.sign("VIRTUAL MEMORIAL CHAMBER",0,2.8,-dFront(b)+.3,w*.75,.32);lights(b,1);
}
export function buildArchitecture(kind:ArchitectureKind,width:number,depth:number,sourceHeight?:number):Architecture{
  if(!Number.isFinite(width)||!Number.isFinite(depth)||width<4||depth<4)throw new Error(`Invalid ${kind} model dimensions`);
  const b=new Builder(width,depth,sourceHeight);b.materials.stone.color.setHex(0xd5c3a2);b.materials.roof.color.setHex(0xa85c3d);b.materials.clay.color.setHex(0xb56e49);b.materials.metal.color.setHex(0x46554a);b.materials.fabric.color.setHex(0x8c3f39);
  if(kind==="memorial-church")memorial(b);else if(kind==="main-quad")mainQuad(b);else if(kind==="hoover-tower")hoover(b);
  else if(["green-library","bing-wing"].includes(kind))library(b,kind==="bing-wing");else if(["cantor","anderson","mcmurtry"].includes(kind))art(b,kind);
  else if(kind==="bing-concert")concert(b);else if(["memorial-auditorium","dinkelspiel"].includes(kind))auditorium(b,kind);
  else if(["tresidder","old-union","bookstore"].includes(kind))social(b,kind);else if(["toyon","branner","roble","encina"].includes(kind))residence(b,kind);
  else if(["burnham","ford","squash"].includes(kind))trainingGym(b,kind);else if(kind==="maples")maples(b);else if(kind==="windhover")windhover(b);else if(kind==="mausoleum")mausoleum(b);else academic(b,kind);
  b.display(`${kind}-info`,titles[kind]||kind,width*.32,depth/2-2.2);
  b.group.userData.referenceModel="Original photograph-informed reference reconstruction; interpreted dimensions, furniture and circulation";
  b.group.userData.sourceManifest="projects/stanford/architecture-sources.json";
  b.group.userData.supportedLevels=kind==="hoover-tower"?19:kind==="bing-wing"?5:kind==="mcmurtry"?4:["memorial-church","main-quad","bing-concert","memorial-auditorium","dinkelspiel","maples","windhover","mausoleum","burnham","ford","squash"].includes(kind)?1:["green-library","gates","huang","packard","clark","peterson","knight","law","toyon","branner","roble","encina","mcmurtry"].includes(kind)?3:2;
  return b.finish(kind);
}
