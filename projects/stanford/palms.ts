import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
/** Original palm crown: arched rachises with paired narrow leaflets.
 * Unit geometry is instanced at source tree positions, never downloaded imagery. */
export function palmCrownGeometry() {
  const pieces: THREE.BufferGeometry[]=[];
  for(let f=0;f<11;f++) {
    const yaw=f*Math.PI*2/11, length=.85+(f%3)*.12;
    for(let n=0;n<9;n++) {
      const t=n/9, t2=(n+1)/9;
      const point=(r:number)=>new THREE.Vector3(Math.sin(yaw)*length*r,Math.sin(r*Math.PI)*.22-r*r*.24,Math.cos(yaw)*length*r);
      const p=point(t),q=point(t2),delta=q.clone().sub(p),g=new THREE.CylinderGeometry(.011,.016,delta.length(),4);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate((p.x+q.x)/2,(p.y+q.y)/2,(p.z+q.z)/2);pieces.push(g);
      for(const side of [-1,1]) {
        const width=.22*(1-t)+.025,mid=p.clone().add(new THREE.Vector3(Math.cos(yaw)*side*width,-.035,-Math.sin(yaw)*side*width));
        const tip=mid.clone().add(new THREE.Vector3(Math.sin(yaw)*.09,-.04,Math.cos(yaw)*.09));
        const leaf=new THREE.BufferGeometry();leaf.setAttribute("position",new THREE.Float32BufferAttribute([...p.toArray(),...mid.toArray(),...tip.toArray(),...p.toArray(),...tip.toArray(),...q.toArray()],3));leaf.computeVertexNormals();pieces.push(leaf);
      }
    }
  }
  const aligned=pieces.map(g=>{const q=g.index?g.toNonIndexed():g;q.deleteAttribute("uv");if(q!==g)g.dispose();return q;});
  const result=mergeGeometries(aligned)!;aligned.forEach(g=>g.dispose());result.computeBoundingSphere();return result;
}
