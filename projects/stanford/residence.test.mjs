import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const {buildArchitecture}=await import('./architecture.ts');
const {createResidenceControls}=await import('./residence-controls.ts');
const {residenceRooms,residenceFloor:level,residenceLift:shaft}=await import('./residence-layout.ts');
const {createCollision,floorAt}=await import('./spatial.ts');
const {defaults}=await import('./environment.ts');
function setup(){
 const asset=buildArchitecture('branner',24,25,14),controls=createResidenceControls(asset);
 const anchor={id:'branner',x:0,z:0,yaw:0,width:24,depth:25};
 const interior={anchor,...asset,dynamicBlocked:controls.dynamicBlocked};
 const collision=createCollision({buildings:[],routes:[],surfaces:[],trees:[],entrances:[]},[interior],new Set());
 return {asset,controls,interior,collision};
}
test('Branner bedrooms have working doors with collision-matched open and shut states',()=>{
 const {controls,collision}=setup();
 for(const r of residenceRooms){
  assert(collision.blocked([r.x,r.doorZ],level));
  assert(controls.interact(`branner-door-${r.id}`));
  for(let i=0;i<15;i++)controls.update(.1,[0,-3],level,defaults);
  assert(!collision.blocked([r.x,r.doorZ],level),r.id+' open doorway');
  let pose={x:r.x,z:r.doorZ-.6,y:level,yaw:0,pitch:0};
  for(let i=0;i<40;i++)pose=collision.move(pose,0,.05);
  assert(pose.z>r.doorZ+1,r.id+' bedroom can be entered');
 }
});
test('Branner lift carries a fully boarded player through a real slab opening and returns',()=>{
 const {controls,interior,collision}=setup(),p=[(shaft.minX+shaft.maxX)/2,(shaft.minZ+shaft.maxZ)/2];
 assert(!interior.floors.some(f=>f.y===level&&p[0]>f.minX&&p[0]<f.maxX&&p[1]>f.minZ&&p[1]<f.maxZ));
 let y=0;controls.update(0,p,y,defaults);assert(controls.interactions().some(a=>a.id==='branner-lift-ride'));
 controls.interact('branner-lift-ride');
 for(let i=0;i<60;i++){y+=controls.update(.1,p,y,defaults);assert.equal(floorAt(p,y,[interior]),y);assert(!collision.blocked(p,y));}
 assert(Math.abs(y-level)<1e-6);assert(!controls.dynamicBlocked([p[0],shaft.maxZ],y));
 controls.interact('branner-lift-ride');for(let i=0;i<60;i++)y+=controls.update(.1,p,y,defaults);assert.equal(y,0);
});
test('empty lift closes the absent landing and waits for a boarding threshold to clear',()=>{
 const {controls}=setup(),threshold=[(shaft.minX+shaft.maxX)/2,shaft.maxZ+.1];
 controls.interact('branner-lift-upper');controls.update(.1,threshold,0,defaults);assert.equal(controls.liftFloor.y,0);
 controls.update(.1,[0,0],0,defaults);assert(controls.liftFloor.y>0);assert(controls.dynamicBlocked(threshold,0));
 for(let i=0;i<60;i++)controls.update(.1,[0,0],0,defaults);
 assert(controls.dynamicBlocked(threshold,0));assert(!controls.dynamicBlocked(threshold,level));
});
test('door sweep pauses for an occupant, including reduced-motion opening',()=>{
 const {controls}=setup(),r=residenceRooms[2],door=controls.doors.doors.find(d=>d.id==='branner-door-C');
 controls.interact(door.id);controls.update(.1,[r.x,r.doorZ+.1],level,{...defaults,reducedMotion:true});
 assert.equal(door.angleNow,0);assert(door.waiting);
 controls.update(.1,[0,-3],level,{...defaults,reducedMotion:true});assert(Math.abs(door.angleNow-Math.PI/2)<1e-8);
});

test('Branner stairs remain clear and the lift approaches connect to both floors',()=>{
 const {asset,controls,interior,collision}=setup();
 for(const ramp of asset.ramps){let y=ramp.fromY;for(let i=0;i<=100;i++){const t=.001+i*.00998,p=[ramp.minX+(ramp.maxX-ramp.minX)*t,(ramp.minZ+ramp.maxZ)/2];y=floorAt(p,y,[interior]);assert(!collision.blocked(p,y));}assert(Math.abs(y-ramp.toY)<.02);}
 const cx=(shaft.minX+shaft.maxX)/2;
 for(const level of [0,4.2]){
  controls.interact(level?'branner-lift-upper':'branner-lift-lobby');for(let n=0;n<60;n++)controls.update(.1,[0,0],0,defaults);
  let pose={x:cx,z:shaft.maxZ+1.2,y:level,yaw:0,pitch:0};
  for(let n=0;n<40;n++)pose=collision.move(pose,0,-.05);
  assert(pose.z<shaft.maxZ-.6,'Cab boarding clear at '+level);assert(Math.abs(pose.y-level)<.01);
 }
});
test('Shared bathroom door opens and permits entry without crossing fixtures',()=>{
 const {controls,collision}=setup();const door=controls.doors.doors.find(d=>d.id==='branner-door-bath');
 assert(controls.interact(door.id));controls.update(1,[0,0],level,{...defaults,reducedMotion:true});
 const x=door.hinge[0]+door.width/2,z=door.hinge[1];let pose={x,z:z+.6,y:level,yaw:0,pitch:0};
 for(let n=0;n<30;n++)pose=collision.move(pose,0,-.05);assert(pose.z<z-.7);assert(!collision.blocked([pose.x,pose.z],pose.y));
});
