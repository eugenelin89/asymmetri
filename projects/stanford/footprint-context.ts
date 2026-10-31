import * as THREE from "three";
import { Builder } from "./builder";
import { subtractGroundOpenings } from "./ground-openings";
import { shape } from "./scenery";
import { local, segmentDistance, inPolygon, type Interior } from "./spatial";
import type { Anchor, Building, Point } from "./types";
/** Keep the mapped source outline around a smaller furnished public core.
 * A clearly interpreted entrance passage links the core to the exterior. */
export function buildFootprintContext(building:Building,core:Anchor,exclusions:Building[]=[]):{group:THREE.Group;interior:Interior;entry:Point}{
  const rings=building.rings.map(r=>r.map(p=>local(p,core)));
  const excludedRings=exclusions.map(b=>b.rings.map(r=>r.map(p=>local(p,core))));
  const w=core.width,d=core.depth;
  const inCore=(p:Point)=>Math.abs(p[0])<w/2+.5&&Math.abs(p[1])<d/2+.5;
  const passage=(p:Point)=>Math.abs(p[0])<2.5&&p[1]>=d/2-.5;
  const extent=Math.max(...rings.flat().map(p=>Math.hypot(...p)))*2;
  const b=new Builder(extent,extent,building.height),edges:[Point,Point][]=[];
  const glazed=["huang","clark","anderson","knight","mcmurtry"].includes(core.id);
  const height=core.id === "main-quad" ? 6.2 : Math.max(8,Math.min(38,building.height));
  b.materials.stone.map=b.materials.concrete.map;
  b.materials.roof.color.setHex(0xa45f48);
  b.materials.stone.color.setHex(0xd7bd94);
  let facadeDistance=0;
  for(const ring of rings)for(let j=1;j<ring.length;j++){
    const p=ring[j-1],q=ring[j],length=Math.hypot(q[0]-p[0],q[1]-p[1]);
    const count=Math.max(1,Math.ceil(length/2.4)),angle=-Math.atan2(q[1]-p[1],q[0]-p[0]);
    for(let n=0;n<count;n++){
      const from:Point=[p[0]+(q[0]-p[0])*n/count,p[1]+(q[1]-p[1])*n/count];
      const to:Point=[p[0]+(q[0]-p[0])*(n+1)/count,p[1]+(q[1]-p[1])*(n+1)/count];
      const m:Point=[(from[0]+to[0])/2,(from[1]+to[1])/2];
      if(inCore(m)||excludedRings.some(r=>inPolygon(m,r)))continue;
      const arcade = core.id === "main-quad";
      if (arcade) {
        // Retain source courtyards; Romanesque bays stay traversable below the spring line.
        if (!passage(from)) {
          b.cylinder("stone",from[0],1.85,from[1],.27,3.7,true);
          b.box("stone",from[0],.14,from[1],.75,.28,.75,true);
        }
        const radius=length/count/2;
        for(let k=0;k<10;k++) {
          const a=k*Math.PI/10, z=(k+1)*Math.PI/10;
          const point=(t:number)=>new THREE.Vector3(m[0]+Math.cos(t)*radius*Math.cos(angle),3.35+Math.sin(t)*radius,m[1]-Math.cos(t)*radius*Math.sin(angle));
          b.beam("stone",point(a),point(z),.28);
        }
        b.box("stone",m[0],5.45,m[1],length/count+.03,1.2,.44,false,angle);
        b.box("clay",m[0],6.13,m[1],length/count+.05,.22,.85,false,angle);
        continue;
      }
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
  // Source buildings may be concave (Memorial Church is cruciform). Split each
  // exclusion into convex triangles before using the exact clipping routine.
  const excludedTriangles=excludedRings.flatMap(rings=>{
    const clean=rings.map(r=>r.slice(0,r.length>1&&r[0][0]===r.at(-1)?.[0]&&r[0][1]===r.at(-1)?.[1]?-1:undefined));
    const points=clean.flat(),vectors=clean.map(r=>r.map(([x,z])=>new THREE.Vector2(x,z)));
    return THREE.ShapeUtils.triangulateShape(vectors[0],vectors.slice(1)).map(face=>face.map(i=>points[i]));
  });
  const roofGeometry=subtractGroundOpenings(plane,[cut,...excludedTriangles]);plane.dispose();
  const roof=new THREE.Mesh(roofGeometry,b.materials.roof);roof.userData.roof=true;roof.receiveShadow=true;b.group.add(roof);
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
  return {group:asset.group,entry,interior:{anchor:{...core,width:extent,depth:extent,id:core.id+"-outline"},colliders:asset.colliders,floors:[],ramps:[],entry:[0,d/2+2],dynamicBlocked:(p,y)=>y<height&&!passage(p)&&edges.some(([a,z])=>segmentDistance(p,a,z)<.4)}};
}
