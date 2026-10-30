import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import data from "./cambie-research-v06-2026-10-30.json";
import { createElevatedWorld, createProfileSampler, elevatedCameraTarget, elevatedJoins } from "../elevation";
import type { ElevatedCar, RoadSurface } from "../elevation";
import { inPolygon, stepCar } from "../physics";
import { createManualDriver } from "./handling-v06";
import type { Polygon2 } from "../types";
import styles from "../vancouver.module.css";

const surfaces = data.surfaces as RoadSurface[];
const water = data.water as Polygon2[];
const groundAllowed = (point: [number, number]) => !water.some((polygon) => inPolygon(point, polygon));

/** Local-only real alignment/DSM candidate. No public city or graph connection. */
export default function CambieLab() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ start(which: "north" | "south" | "underpass"): void; overview(): void; pace(): void } | null>(null);
  const [telemetry, setTelemetry] = useState("Preparing the isolated Cambie candidate…");
  useEffect(() => {
    const mount = host.current; if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch {
      const failure = requestAnimationFrame(() => setTelemetry("WebGL2 unavailable. The elevation tests remain available without a renderer."));
      return () => cancelAnimationFrame(failure);
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setClearColor(0xd3e0e1);
    const canvas = renderer.domElement; canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "Isolated Cambie Bridge candidate. Arrows or WASD drive; space brakes. Elevations are in CGVD2013 metres."); mount.appendChild(canvas);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(48, 1, .2, 3000);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x55705b, 2.5));
    const sun = new THREE.DirectionalLight(0xfff4d9, 2); sun.position.set(100, 200, 0); scene.add(sun);
    const materials = [0x485958, 0xd5c79e, 0x32959b, 0x9cad97, 0x116f65, 0x233b45, 0xf1d882].map((color) => new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
    function mesh(vertices: number[], material: number) {
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); geometry.computeVertexNormals();
      const object = new THREE.Mesh(geometry, materials[material]); scene.add(object); return object;
    }
    for (const polygon of water) {
      const shape = new THREE.Shape(polygon[0].map(([x,z]) => new THREE.Vector2(x,-z)));
      for (const hole of polygon.slice(1)) shape.holes.push(new THREE.Path(hole.map(([x,z]) => new THREE.Vector2(x,-z))));
      const geometry = new THREE.ShapeGeometry(shape); geometry.rotateX(-Math.PI/2);
      scene.add(new THREE.Mesh(geometry, materials[2]));
    }
    // Water at datum zero is a labelled display reference, not a tide model.
    // Road meshes and support queries use the same finite-width sampled ribbon.
    for (const surface of surfaces) {
      const points = surface.profile!, sample = createProfileSampler(surface), vertices: number[] = [];
      const vertex = (x: number, z: number, fallback: number) => [x, (sample([x,z])?.y ?? fallback)+.04, z];
      for (let i=0;i<points.length-1;i++) {
        const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz),slices=Math.ceil(length);
        for(let j=0;j<slices;j++) {
          const edge=(t:number,side:number)=>vertex(a.x+dx*t+dz/length*surface.width/2*side,a.z+dz*t-dx/length*surface.width/2*side,a.y+(b.y-a.y)*t);
          const p=edge(j/slices,-1),q=edge(j/slices,1),r=edge((j+1)/slices,-1),s=edge((j+1)/slices,1);
          vertices.push(...p,...q,...r,...q,...s,...r);
        }
        if(i) for(let j=0;j<16;j++) {
          const point=(angle:number)=>vertex(a.x+Math.sin(angle)*surface.width/2,a.z+Math.cos(angle)*surface.width/2,a.y);
          vertices.push(...vertex(a.x,a.z,a.y),...point(j*Math.PI/8),...point((j+1)*Math.PI/8));
        }
      }
      mesh(vertices,0);
      const markings:number[]=[];
      for(let i=1;i<points.length-1;i+=2) {
        const p=points[i],next=points[i+1],dx=next.x-p.x,dz=next.z-p.z,length=Math.hypot(dx,dz),nx=dz/length*.1,nz=-dx/length*.1;
        const a=[p.x-nx,p.y+.08,p.z-nz],b=[p.x+nx,p.y+.08,p.z+nz];
        const x=p.x+dx/length*2,z=p.z+dz/length*2,y=(sample([x,z])?.y??p.y)+.08,c=[x-nx,y,z-nz],d=[x+nx,y,z+nz];
        markings.push(...a,...b,...c,...b,...d,...c);
      }
      mesh(markings,6);
    }
    for(const join of elevatedJoins(surfaces)) {
      const {x,y,z}=join.point,vertices:number[]=[];
      for(let i=0;i<24;i++)vertices.push(x,y+.035,z,x+Math.sin(i*Math.PI/12)*join.radius,y+.035,z+Math.cos(i*Math.PI/12)*join.radius,x+Math.sin((i+1)*Math.PI/12)*join.radius,y+.035,z+Math.cos((i+1)*Math.PI/12)*join.radius);
      mesh(vertices,0);
    }
    const vehicle = new THREE.Group(); scene.add(vehicle);
    for(const [w,h,d,x,y,z,material] of [[1.9,.8,4,0,.65,0,4],[1.6,.65,1.8,0,1.35,-.2,5]]) {
      const body = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), materials[material]); body.position.set(x,y,z); vehicle.add(body);
    }
    const world = createElevatedWorld(surfaces, groundAllowed);
    function initial(which: "north" | "south" | "underpass"): ElevatedCar {
      const surface=surfaces.find((s)=>s.id===(which==="north"?"north-ground":which==="south"?"south-ground":"marinaside-underpass"))!;
      const points=which==="south"?[...surface.profile!].reverse():surface.profile!,a=points[1],b=points[2];
      const yaw=Math.atan2(b.x-a.x,b.z-a.z),value=world.sample([a.x,a.z],surface.id)!;
      return {x:a.x,z:a.z,y:value.y,yaw,speed:0,steer:0,pitch:0,surface:surface.id};
    }
    let car=initial("north"), latest=car;
    const driver=createManualDriver((state,throttle,steering,brake,dt)=> {
      latest=world.step(stepCar,{...latest,...state},throttle,steering,brake,dt); return latest;
    });
    let overview=false,pace:"relaxed"|"normal"="relaxed",distance=0,contacts=0,seconds=0,last=0,lastReport=0,raf=0,visible=true,disposed=false;
    const keys=new Set<string>();
    const stop=()=>{keys.clear();driver.clear();car={...car,speed:0,steer:0};latest=car;};
    const down=(event:KeyboardEvent)=>{const key=event.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"," "].includes(key)){event.preventDefault();keys.add(key);}};
    const up=(event:KeyboardEvent)=>keys.delete(event.key.toLowerCase());
    canvas.addEventListener("keydown",down);canvas.addEventListener("blur",stop);window.addEventListener("keyup",up);
    controls.current={start(which){stop();car=initial(which);latest=car;distance=0;contacts=0;seconds=0;overview=false;canvas.focus({preventScroll:true});},overview(){stop();overview=!overview;canvas.focus({preventScroll:true});},pace(){stop();pace=pace==="relaxed"?"normal":"relaxed";canvas.focus({preventScroll:true});}};
    const schedule=()=>{if(!raf&&visible&&!document.hidden&&!disposed)raf=requestAnimationFrame(frame);};
    const visibility=()=>{stop();cancelAnimationFrame(raf);raf=0;last=0;schedule();};
    document.addEventListener("visibilitychange",visibility);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visibility();});intersection.observe(mount);
    const resize=new ResizeObserver(()=>{const {width,height}=mount.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();});resize.observe(mount);
    function frame(now:number) {
      raf=0;if(disposed||!visible||document.hidden)return;
      const dt=Math.min(last?(now-last)/1000:1/60,.1);last=now;const prior=car;
      const pressed=(...names:string[])=>names.some((name)=>keys.has(name));
      if(!overview){const next=driver.step(car,{throttle:Number(pressed("w","arrowup"))-Number(pressed("s","arrowdown")),steering:Number(pressed("a","arrowleft"))-Number(pressed("d","arrowright")),brake:pressed(" ")},pace,dt,()=>true);car={...latest,...next};seconds+=dt;}
      distance+=Math.hypot(car.x-prior.x,car.z-prior.z);if(car.blocked&&!prior.blocked)contacts++;
      vehicle.position.set(car.x,car.y+.05,car.z);vehicle.rotation.set(-car.pitch,car.yaw,0,"YXZ");
      if(overview){camera.position.set(450,700,200);camera.lookAt(-350,8,150);}
      else{const target=elevatedCameraTarget(car,23,16);camera.position.set(target.x,target.y,target.z);camera.lookAt(car.x+Math.sin(car.yaw)*6,target.aimY,car.z+Math.cos(car.yaw)*6);}
      renderer.render(scene,camera);
      if(now-lastReport>150){lastReport=now;Object.assign(canvas.dataset,{candidate:data.version,surface:car.surface,height:car.y.toFixed(3),pitch:car.pitch.toFixed(4),distance:distance.toFixed(1),contacts:String(contacts),seconds:seconds.toFixed(1),x:car.x.toFixed(2),z:car.z.toFixed(2),speed:car.speed.toFixed(2),pace,geometries:String(renderer.info.memory.geometries)});setTelemetry(`${pace} · ${car.surface} · ${Math.round(Math.abs(car.speed)*3.6)} km/h · CGVD2013 height ${car.y.toFixed(2)} m · pitch ${(car.pitch*180/Math.PI).toFixed(1)}° · ${distance.toFixed(1)} m · ${contacts} contacts`);}
      schedule();
    }
    schedule();
    return()=>{disposed=true;controls.current=null;cancelAnimationFrame(raf);intersection.disconnect();resize.disconnect();document.removeEventListener("visibilitychange",visibility);canvas.removeEventListener("keydown",down);canvas.removeEventListener("blur",stop);window.removeEventListener("keyup",up);scene.traverse((object)=>{if(object instanceof THREE.Mesh)object.geometry.dispose();});materials.forEach((material)=>material.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();};
  },[]);
  return <section className={styles.elevationLab} aria-label="Isolated Cambie research candidate">
    <h3>Cambie Bridge candidate · development only</h3>
    <p>City alignment and 2025 provincial DSM/DEM heights, including both full approaches. Widths are test corridors; lane divisions, banking and intersections are unresolved. Marinaside is a separate ground surface. Water at datum zero is a visual reference. This is not connected to public driving.</p>
    <div><button type="button" onClick={()=>controls.current?.start("north")}>Cambie north → south</button><button type="button" onClick={()=>controls.current?.start("south")}>Cambie south → north</button><button type="button" onClick={()=>controls.current?.start("underpass")}>Marinaside underpass</button><button type="button" onClick={()=>controls.current?.pace()}>Switch Relaxed / Normal</button><button type="button" onClick={()=>controls.current?.overview()}>Overview / chase</button></div>
    <div className={styles.elevationViewport} ref={host}/><output>{telemetry}</output>
    <p>Contains information licensed under the Open Government Licence – British Columbia and the Open Government Licence – Vancouver. See the V0.6 elevation report for sources and uncertainties.</p>
  </section>;
}
