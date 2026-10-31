// Offline V0.6 acceptance. Node 24; uses the exact runtime geometry/routing code.
import { registerHooks } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
registerHooks({ resolve(specifier, context, next) { try { return next(specifier, context); } catch (error) { if (specifier.startsWith('.') && !specifier.endsWith('.ts')) return next(specifier + '.ts', context); throw error; } } });
const { createVehicleSurface } = await import('../vehicle.ts');
const { createNavigator, roundRoad, projectPath } = await import('../navigation.ts');
const { distance, createWorld } = await import('../world.ts');
const flags = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all)=>i%2?a:[...a,[v,all[i+1]]],[]));
assert.ok(flags['--input'] && flags['--out'], 'Use --input network-draft.json --out output-directory');
const draft = JSON.parse(readFileSync(resolve(flags['--input']))), city = JSON.parse(readFileSync(new URL('../../../public/surrey/v0.3-2026-10-30/city.json',import.meta.url)));
let surface = createVehicleSurface(draft.driveSurface);
const world = createWorld(city), nav = createNavigator(draft,surface.fits);
const sample = (points, spacing=.15) => {
  let length=0,minimum=Infinity;
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],d=distance(a,b),count=Math.max(1,Math.ceil(d/spacing)),yaw=Math.atan2(b[0]-a[0],b[1]-a[1]);
    for(let n=0;n<=count;n++){const t=n/count;assert.ok(surface.fits({x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,yaw}),`Body off-road at ${a}, ${b}, ${t}`);}
    length+=d;minimum=Math.min(minimum,d);
  }
  return {lengthM:length,spacingM:spacing};
};
for(const edge of draft.edges) sample(edge.smoothedPoints);
const transitions=[], rejected=[];
for(const a of nav.legs.values()) for(const b of nav.legs.values()) if(a.to===b.from && a.edge.id!==b.edge.id){
  const key=`${a.key}>${b.key}`;
  if(nav.canTurn(a,b))transitions.push(key);else rejected.push(key);
}
draft.turns=transitions;
const seen=new Set(),todo=['r178:0','r178:1'];
while(todo.length){const key=todo.pop();if(seen.has(key))continue;seen.add(key);for(const transition of transitions)if(transition.startsWith(key+'>'))todo.push(transition.split('>')[1]);}
const unreachable=draft.edges.filter(e=>!seen.has(e.id+':0')&&!seen.has(e.id+':1'));
const excludedIds=new Set(unreachable.map(e=>e.id));
draft.edges=draft.edges.filter(e=>!excludedIds.has(e.id));
draft.rejected.push(...unreachable.map(e=>({road:e.sourceIndex,reason:'No turn with supported full-body clearance from the car component'})));
draft.turns=transitions.filter(t=>t.split('>').every(k=>!excludedIds.has(k.split(':')[0])));
const retainedNodes=new Set(draft.edges.flatMap(e=>[e.from,e.to]));draft.nodes=draft.nodes.filter(n=>retainedNodes.has(n.id));
assert.ok(flags['--python'],'Pass --python with the Shapely 2.0.7 interpreter');
const clipped=JSON.parse(execFileSync(flags['--python'],[fileURLToPath(new URL('./clip_network.py',import.meta.url))],{input:JSON.stringify(draft),maxBuffer:10_000_000,encoding:'utf8'}));
draft.driveSurface=clipped.driveSurface;draft.validation.surfaceAreaM2=clipped.areaM2;draft.validation.disconnectedSurfaceAreaM2=clipped.disconnectedSurfaceAreaM2;
surface=createVehicleSurface(draft.driveSurface);
for(const e of draft.edges)sample(e.smoothedPoints);
const clippedNavigator=createNavigator({...draft,turns:undefined},surface.fits);
for(const t of draft.turns){const [a,b]=t.split('>');assert.ok(clippedNavigator.canTurn(clippedNavigator.legs.get(a),clippedNavigator.legs.get(b)),'Clipping invalidated turn '+t);}
const routing=createNavigator(draft,surface.fits),spawn={x:20,z:-68.25,yaw:Math.PI/2};
const destinations=[];
for(const stop of draft.destinations){
  assert.ok(surface.fits({x:stop.point[0],z:stop.point[1],yaw:stop.yaw}));
  assert.ok(world.fits(stop.foot)&&world.clear(stop.point,stop.foot));
  const route=routing.calculate(spawn,stop.id);assert.ok(route,'Unreachable advertised stop '+stop.id);sample(route.points);
  const returnRoute=stop.id==='station'?null:routing.calculate({x:stop.point[0],z:stop.point[1],yaw:stop.yaw},'station');
  if(stop.id!=='station'){assert.ok(returnRoute,'Cannot return from '+stop.id);sample(returnRoute.points);}
  destinations.push({id:stop.id,lengthM:+route.length.toFixed(3),edges:route.edges,returnToStationM:returnRoute?+returnRoute.length.toFixed(3):0});
}
// Two closed city circuits. The first edge is split mid-segment so the wrap is a
// straight, not an unvalidated instantaneous turn at an intersection.
const trafficRoutes=[],trafficRejected=[];
for(const ids of [['r178','r36','r27','r168','r109'],['r177','r10','r39','r36']]){
  let path=null;
  for(const reverse of [false,true]){
    const first=nav.legs.get(`${ids[0]}:${reverse?1:0}`);let current=first,legs=[first],valid=true;
    for(const id of ids.slice(1)){
      const next=[nav.legs.get(id+':0'),nav.legs.get(id+':1')].find(l=>l.from===current.to);
      if(!next||!routing.canTurn(current,next)){valid=false;break;}legs.push(next);current=next;
    }
    if(!valid||current.to!==first.from||!routing.canTurn(current,first))continue;
    const points=legs.flatMap(l=>l.points),firstSegment=Math.floor(first.points.length/2),a=first.points[firstSegment-1],b=first.points[firstSegment],middle=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    path=roundRoad([middle,...points.slice(firstSegment),...first.points.slice(1,firstSegment),middle],surface.fits);if(path)break;
  }
  if(!path){trafficRejected.push({edgeIds:ids,reason:'Inter-edge turn or loop seam failed footprint acceptance'});continue;}
  // Prefer a right-hand lane; never force an offset outside the source mask.
  let chosen=null;
  for(const offset of [1.8,1.5,1,0]){
    const lane=path.map((p,i)=>{const a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],yaw=Math.atan2(b[0]-a[0],b[1]-a[1]);return [p[0]+Math.cos(yaw)*offset,p[1]-Math.sin(yaw)*offset];});lane[lane.length-1]=lane[0];
    try {sample(lane);chosen={points:lane.map(p=>p.map(n=>+n.toFixed(4))),edgeIds:ids,offsetM:offset};break;}catch{/* Try a smaller supported lateral offset. */}
  }
  assert.ok(chosen);sample(chosen.points);trafficRoutes.push({...chosen,lengthM:+sample(chosen.points).lengthM.toFixed(3)});
}
assert.ok(trafficRoutes.length>0,'At least one expanded traffic circuit must pass');
// A fictional mid-block work zone on University Drive. Case 04 is untouched.
const closedEdge=draft.edges.find(e=>e.id==='r55');
const before=routing.calculate(spawn,'central'),after=routing.calculate(spawn,'central',new Set([closedEdge.id]));
assert.ok(before&&after&&before.edges.includes(closedEdge.id)&&!after.edges.includes(closedEdge.id),'Community delivery must have a real alternative');sample(after.points);
const closurePoint=closedEdge.points[Math.floor(closedEdge.points.length/2)],cp=projectPath(closedEdge.points,closurePoint),next=closedEdge.points[cp.index+1],previous=closedEdge.points[cp.index];
const yaw=Math.atan2(next[0]-previous[0],next[1]-previous[1]);
const closure={edgeId:closedEdge.id,point:closurePoint,yaw,widthM:closedEdge.sourceWidthM+8,lengthM:5,fictional:true};
const giver=[38,20];assert.ok(world.fits(giver));
const recipient=draft.destinations.find(s=>s.id==='central').foot;assert.ok(world.fits(recipient));
const degree=new Map();for(const e of draft.edges)for(const id of [e.from,e.to])degree.set(id,(degree.get(id)||0)+1);
const choices=new Map();for(const t of draft.turns){const [a,b]=t.split('>');if(!seen.has(a))continue;if(!choices.has(a))choices.set(a,new Set());choices.get(a).add(b);}
const drivableIntersections=new Set([...choices].filter(([,next])=>next.size>=2).map(([key])=>routing.legs.get(key).to)).size;
// Geometric unions remove any shared portions at junctions as well as repeated
// traversals. Report whole metres only after turn-based exclusions.
const {uniqueSourceRoadLengthM,uniqueEdgePathLengthM}=clipped;
const output={...draft,trafficRoutes,closure,mission:{giver,recipient,destination:'central',minimumDrivenM:350,minimumRoads:4},validation:{...draft.validation,uniqueSourceRoadLengthM,uniqueEdgePathLengthM,sourceJunctions:[...degree.values()].filter(d=>d>=3).length,drivableIntersections,finalSampleSpacingM:.15,rejectedSegments:draft.rejected,componentNodes:draft.nodes.length,componentEdges:draft.edges.length,junctionValidation:'All advertised directed transitions use runtime full-body curve checks; rejected turns excluded from A*.',acceptedTurns:draft.turns.length,rejectedTurns:rejected,reachableDirectedLegs:seen.size,reachableDestinations:destinations,traffic:trafficRoutes.map(r=>({lengthM:r.lengthM,edgeIds:r.edgeIds,offsetM:r.offsetM})),trafficRejected,detour:{directM:+before.length.toFixed(3),alternateM:+after.length.toFixed(3),directEdges:before.edges,alternateEdges:after.edges}}};
mkdirSync(resolve(flags['--out']),{recursive:true});
const encoded=JSON.stringify(output)+'\n',file=join(resolve(flags['--out']),'network.json');
if(existsSync(file))assert.equal(readFileSync(file,'utf8'),encoded,'Refusing to replace different versioned transport');
writeFileSync(file,encoded);writeFileSync(join(resolve(flags['--out']),'connectivity-report.json'),JSON.stringify(output.validation,null,2)+'\n');
console.log(JSON.stringify({bytes:Buffer.byteLength(encoded),sha256:createHash('sha256').update(encoded).digest('hex'),...output.validation},null,2));
