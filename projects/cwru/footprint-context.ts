import * as THREE from "three";
import { Builder } from "./builder";
import { subtractGroundOpenings } from "./ground-openings";
import { shape } from "./scenery";
import { local, segmentDistance, type Interior } from "./spatial";
import type { Anchor, Building, Point } from "./types";
/** Keep the mapped source outline around a smaller furnished public core.
 * A clearly interpreted entrance passage links the core to the exterior. */
export function buildFootprintContext(building:Building,core:Anchor):{group:THREE.Group;interior:Interior;entry:Point}{
  const rings=building.rings.map(r=>r.map(p=>local(p,core)));
  const w=core.width,d=core.depth;
  const inCore=(p:Point)=>Math.abs(p[0])<w/2+.5&&Math.abs(p[1])<d/2+.5;
  const passage=(p:Point)=>Math.abs(p[0])<2.5&&p[1]>=d/2-.5;
  const extent=Math.max(...rings.flat().map(p=>Math.hypot(...p)))*2;
  const b=new Builder(extent,extent,building.height),edges:[Point,Point][]=[];
  const glazed=core.id==="tinkham-veale"||core.id==="nursing";
  const height=core.id==="tinkham-veale"?8.8:core.id==="veale"?14:Math.max(8,Math.min(38,building.height));
  b.materials.stone.map=b.materials.concrete.map;
  b.materials.stone.color.setHex(core.id==="peter-lewis"?0xa5624e:0xc6bba6);
  let facadeDistance=0;
  for(const ring of rings)for(let j=1;j<ring.length;j++){
    const p=ring[j-1],q=ring[j],length=Math.hypot(q[0]-p[0],q[1]-p[1]);
    const count=Math.max(1,Math.ceil(length/2.4)),angle=-Math.atan2(q[1]-p[1],q[0]-p[0]);
    for(let n=0;n<count;n++){
      const from:Point=[p[0]+(q[0]-p[0])*n/count,p[1]+(q[1]-p[1])*n/count];
      const to:Point=[p[0]+(q[0]-p[0])*(n+1)/count,p[1]+(q[1]-p[1])*(n+1)/count];
      const m:Point=[(from[0]+to[0])/2,(from[1]+to[1])/2];
      if(inCore(m))continue;
      const door=passage(m),start=door?3.5:0;
      b.box(glazed?"glass":"stone",m[0],start+(height-start)/2,m[1],length/count+.03,height-start,.24,false,angle);
      if(!door){
        edges.push([from,to]);
        facadeDistance+=length/count;
        if(facadeDistance>=3.4){
        facadeDistance=0;
        for(let y=2;y<height-1;y+=4.2){
          b.box("glass",m[0],y,m[1],1.5,1.9,.28,false,angle);
          b.box("metal",m[0],y,m[1],.07,2.1,.32,false,angle);
        }
      }
      }
      b.box("concrete",m[0],height,m[1],length/count+.03,.3,.45,false,angle);
    }
  }
  const plane=new THREE.ShapeGeometry(shape(rings));plane.rotateX(-Math.PI/2);plane.translate(0,height,0);
  const cut:Point[]=[[-w/2-.6,-d/2-.6],[w/2+.6,-d/2-.6],[w/2+.6,d/2+.6],[-w/2-.6,d/2+.6]];
  const roofGeometry=subtractGroundOpenings(plane,[cut]);plane.dispose();
  const roof=new THREE.Mesh(roofGeometry,core.id==="tinkham-veale"?b.materials.turf:b.materials.roof);roof.userData.roof=true;roof.receiveShadow=true;b.group.add(roof);
  // Room floors remain in the detailed core; surrounding wings are an exterior shell.
  const asset=b.finish(core.id+"-source-outline");
  let facadeZ=Infinity;
  for(const ring of rings)for(let j=1;j<ring.length;j++){
    const p=ring[j-1],q=ring[j];
    if((p[0]<=0&&q[0]>=0)||(q[0]<=0&&p[0]>=0)){
      const t=-p[0]/(q[0]-p[0]||1),z=p[1]+t*(q[1]-p[1]);
      if(t>=0&&t<=1&&z>=d/2-.5)facadeZ=Math.min(facadeZ,z);
    }
  }
  const entry:Point=[0,(Number.isFinite(facadeZ)?facadeZ:d/2)+2];
  return {group:asset.group,entry,interior:{anchor:{...core,width:extent,depth:extent,id:core.id+"-outline"},colliders:[],floors:[],ramps:[],entry:[0,d/2+2],dynamicBlocked:(p,y)=>y<height&&!passage(p)&&edges.some(([a,z])=>segmentDistance(p,a,z)<.4)}};
}
