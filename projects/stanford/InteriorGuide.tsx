"use client";
import { useEffect, useState } from "react";
import type { Anchor, Pose } from "./types";
import type { Architecture } from "./builder";
import { local } from "./spatial";
import styles from "./campus.module.css";
type Plan=Pick<Architecture,"colliders"|"floors"|"ramps"|"entry">;
export function InteriorGuide({id,name,anchor,pose}:{id:string;name:string;anchor:Anchor;pose?:Pose}) {
  const [plan,setPlan]=useState<Plan|null>(null),[floor,setFloor]=useState(0);
  useEffect(()=>{
    let cancelled=false;
    void import("./architecture").then(({buildArchitecture})=>{
      const asset=buildArchitecture(id,anchor.width,anchor.depth);
      if(!cancelled)setPlan({colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry});
      const materials=new Set<import("three").Material>();
      asset.group.traverse(o=>{const m=o as import("three").Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(v=>materials.add(v));}});
      materials.forEach(m=>{const v=m as import("three").MeshStandardMaterial;v.map?.dispose();m.dispose();});
    });return()=>{cancelled=true;};
  },[id,anchor.width,anchor.depth]);
  if(!plan)return <p role="status">Opening the floor guide…</p>;
  const levels=[...new Set(plan.floors.map(f=>f.y))].sort((a,b)=>a-b),w=anchor.width,d=anchor.depth;
  const pos=pose?local([pose.x,pose.z],anchor):null;
  return <><span className={styles.badge}>WALK-THROUGH FLOOR GUIDE</span><h2>{name}</h2><p>This diagram shows the virtual interior you can explore. Stairs are gold, walls and furniture are dark, and your position is cardinal red. It is a reconstruction, not an official building plan.</p><label>Floor <select value={floor} onChange={e=>setFloor(Number(e.target.value))}>{levels.map((y,i)=><option key={y} value={y}>Level {i+1} · {y.toFixed(1)} m</option>)}</select></label>
    <svg className={styles.residencePlan} viewBox={`${-w/2-3} ${-d/2-3} ${w+6} ${d+9}`} role="img" aria-label={`Virtual floor diagram of ${name}`}>
      <rect x={-w/2-3} y={-d/2-3} width={w+6} height={d+9} fill="#d6d7c9" />
      {plan.floors.filter(f=>Math.abs(f.y-floor)<.1).map((f,i)=><rect key={i} x={f.minX} y={f.minZ} width={f.maxX-f.minX} height={f.maxZ-f.minZ} fill="#f5f0df" />)}
      {plan.colliders.filter(c=>c.minY<floor+2&&c.maxY>floor+.3).map((c,i)=><rect key={i} x={c.minX} y={c.minZ} width={c.maxX-c.minX} height={c.maxZ-c.minZ} fill="#52685e" opacity=".7" />)}
      {plan.ramps.filter(r=>Math.abs(r.fromY-floor)<.1||Math.abs(r.toY-floor)<.1).map((r,i)=><rect key={i} x={r.minX} y={r.minZ} width={r.maxX-r.minX} height={r.maxZ-r.minZ} fill="#be9256" />)}
      {pos&&pose&&Math.abs(pose.y-floor)<1&&Math.abs(pos[0])<w/2&&Math.abs(pos[1])<d/2&&<circle cx={pos[0]} cy={pos[1]} r={Math.max(.45,w/65)} fill="#a43139" stroke="white" strokeWidth=".2"><title>You are here</title></circle>}
      <text x="0" y={d/2+4} textAnchor="middle" fontSize={Math.max(.9,w/35)} fill="#3d514b">ENTRANCE</text>
    </svg></>;
}
