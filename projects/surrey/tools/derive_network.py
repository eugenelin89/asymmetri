"""Offline V0.6 road extraction from immutable, checksum-pinned V0.3 receipts.
Requires Shapely 2.0.7. No network. Never replaces a different output.
Run this, then validate_transport.mjs to validate graph turns and publish a snapshot.
"""
import argparse, collections, hashlib, heapq, json, math
from pathlib import Path
from shapely.geometry import Polygon, LineString, Point, shape, box
from shapely.ops import unary_union, transform
from shapely import make_valid, set_precision, prepare
parser=argparse.ArgumentParser()
parser.add_argument('--repo',type=Path,required=True)
parser.add_argument('--cache',type=Path,required=True)
parser.add_argument('--roads',type=Path,required=True)
parser.add_argument('--out',type=Path,required=True)
args=parser.parse_args()
args.out.mkdir(parents=True,exist_ok=True)
city_bytes=(args.repo/'public/surrey/v0.3-2026-10-30/city.json').read_bytes()
c=json.loads(city_bytes)
manifest=json.loads((args.repo/'public/surrey/v0.3-2026-10-30/manifest.json').read_bytes())
assert hashlib.sha256(city_bytes).hexdigest()==manifest['sha256']
sources=manifest['sources']+manifest['inheritedSources']
def pinned(path,name):
 data=path.read_bytes();receipt=next(s for s in sources if s['name']==name)
 assert hashlib.sha256(data).hexdigest()==receipt['sha256'], name+' receipt changed'
 value=json.loads(data)
 assert not value.get('error') and not value.get('exceededTransferLimit')
 assert len(value['features'])==receipt['features']
 return value,receipt
raw,surface_receipt=pinned(args.cache/'road-surfaces.json','road-surfaces')
road_raw,road_receipt=pinned(args.roads,'roads')
assert len(road_raw['features'])==len(c['roads'])==199
project=lambda x,y:((x-c['origin'][0])*111320*math.cos(math.radians(c['origin'][1])),(c['origin'][1]-y)*111320)
west,south=project(c['bbox'][0],c['bbox'][1]);east,north=project(c['bbox'][2],c['bbox'][3])
extent=box(west,north,east,south)
# Verify array correspondence before attaching source identifiers.
for source,road in zip(road_raw['features'],c['roads']):
 assert (source['properties']['ROAD_NAME'] or 'Local street')==road['name']
 assert source['properties']['STATUS']=='Open'
 original=make_valid(transform(project,shape(source['geometry']))).intersection(extent).simplify(.25)
 assert original.geom_type=='LineString'
 assert [[round(x,2),round(z,2)] for x,z in original.coords]==road['points'], 'Source road order/geometry mismatch'
poly=lambda g:Polygon(g[0],g[1:])
closed=[(f['properties']['OBJECTID'],make_valid(transform(project,shape(f['geometry'])))) for f in raw['features'] if f['properties']['ACCESSIBILITY']!='Open']
pavement=unary_union([poly(p) for p in c['pavement']]);median=unary_union([poly(p) for p in c['medians']]);buildings=unary_union([poly(b['shape']) for b in c['buildings']]);curbs=unary_union([LineString(x) for x in c['curbs']]);closed_union=unary_union([g for _,g in closed])
roads=[r for r in c['roads'] if r['name']!='Local street']
corridor=unary_union([LineString(r['points']).buffer(r['width']/2,cap_style=1,join_style=1) for r in roads])
base=pavement.intersection(corridor).difference(median).difference(buildings).difference(closed_union).difference(curbs.buffer(.15))
surface=set_precision(base.buffer(-.03),.01)
parts=list(surface.geoms) if surface.geom_type=='MultiPolygon' else [surface]
d=next(g for g in parts if g.covers(Point(20,-68.25)))

prepare(d)
inset=d.buffer(-2.35)
s=next(g for g in (list(inset.geoms) if hasattr(inset,'geoms') else [inset]) if g.covers(Point(20,-68.25)))
prepare(s)
valid={};conn={}
def ok(p):
 if p not in valid:valid[p]=bool(s.covers(Point(p)))
 return valid[p]
def connection(a,b):
 k=tuple(sorted((a,b)))
 if k not in conn:conn[k]=bool(s.covers(LineString([a,b])))
 return conn[k]
def nearest(p):
 candidates=[(math.dist(p,(round(p[0])+x,round(p[1])+y)),(round(p[0])+x,round(p[1])+y))for x in range(-15,16)for y in range(-15,16)]
 return next((q for _,q in sorted(candidates)if ok(q)),None)
def path(a,b,line,width,step=.5):
 if a==b:return [a,b]
 corridor=line.buffer(width/2+1).union(Point(line.coords[0]).buffer(22)).union(Point(line.coords[-1]).buffer(22));prepare(corridor)
 allowed=lambda p:ok(p)and corridor.covers(Point(p))
 costs={a:0};prev={};queue=[(math.dist(a,b),0,a)];visited=set()
 while queue:
  _,g,q=heapq.heappop(queue)
  if q in visited:continue
  visited.add(q)
  if q==b:
   pts=[q]
   while q!=a:q=prev[q];pts.append(q)
   pts.reverse();break
  for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]:
   p=(q[0]+dx*step,q[1]+dy*step)
   if p in visited or not allowed(p)or not connection(q,p):continue
   # Soft centreline preference chooses one road-associated carriageway, never jumps medians.
   ng=g+step*math.hypot(dx,dy)*(1+.006*line.distance(Point(p)))
   if ng<costs.get(p,1e99):costs[p]=ng;prev[p]=q;heapq.heappush(queue,(ng+math.dist(p,b),ng,p))
 else:return None
 # Line-of-sight shortcut limited to source road corridor and inset.
 out=[pts[0]];i=0
 while i<len(pts)-1:
  j=min(len(pts)-1,i+120)
  while j>i+1 and not (connection(pts[i],pts[j])and corridor.covers(LineString([pts[i],pts[j]]))):j-=1
  out.append(pts[j]);i=j
 return out
nodes=[]; node_ids={}; roads=[];fail=[]
for idx,r in enumerate(c['roads']):
 if r['name']=='Local street':continue
 ids=[]
 for p in [r['points'][0],r['points'][-1]]:
  key=tuple(p)
  if key not in node_ids:
   target=(p[0]-6,p[1]) if any(rr['name']=='King George Blvd' and p in [rr['points'][0],rr['points'][-1]] for rr in c['roads']) else p
   q=nearest(target)
   node_ids[key]=len(nodes);nodes.append({'id':f'n{len(nodes)}','sourcePoint':p,'point':q})
  ids.append(node_ids[key])
 a,b=[nodes[i]['point']for i in ids]
 if not a or not b:fail.append({'road':idx,'reason':'No inset endpoint'});continue
 line=LineString(r['points']);points=path(a,b,line,r['width'])
 if points is None and idx==178:points=path(a,b,line,r['width'],.25)
 if points is None:fail.append({'road':idx,'reason':'No source-corridor inset connection'});continue
 l=LineString(points)
 roads.append({'id':f'r{idx}','sourceIndex':idx,'sourceObjectId':road_raw['features'][idx]['properties']['OBJECTID'],'sourceFacilityId':road_raw['features'][idx]['properties']['FACILITYID'],'roadName':r['name'],'from':nodes[ids[0]]['id'],'to':nodes[ids[1]]['id'],'kind':'road','points':points,'lengthM':round(l.length,3),'sourceLengthM':round(line.length,3),'allOrientationsSafe':True})
 print(f'Derived road {idx}: {r["name"]}', flush=True)
def body(p,yaw):
 return Polygon([(p[0]+math.sin(yaw)*u+math.cos(yaw)*v,p[1]+math.cos(yaw)*u-math.sin(yaw)*v)for u,v in[(-2.08,-1.02),(-2.08,1.02),(2.08,1.02),(2.08,-1.02)]])
def fits(points):
 l=LineString(points)
 for i in range(math.ceil(l.length/.2)+1):
  s=min(l.length,i*.2);p=l.interpolate(s);a=l.interpolate(max(0,s-.05));b=l.interpolate(min(l.length,s+.05))
  if not d.covers(body((p.x,p.y),math.atan2(b.x-a.x,b.y-a.y))):return False
 return True
# Circular fillets preserve a measurable minimum turning radius.
def smooth(points,minr=4.2):
 points=list(points)
 # Remove tiny lattice kinks only if the resulting full oriented body fits.
 changed=True
 while changed and len(points)>2:
  changed=False
  for i in range(1,len(points)-1):
   if min(math.dist(points[i-1],points[i]),math.dist(points[i],points[i+1]))<3 and fits([points[i-1],points[i+1]]):
    points.pop(i);changed=True;break
 out=[points[0]];minradius=1e9
 for a,b,c in zip(points,points[1:],points[2:]):
  la=math.dist(a,b);lb=math.dist(b,c)
  if min(la,lb)<1e-8:continue
  u=((b[0]-a[0])/la,(b[1]-a[1])/la);v=((c[0]-b[0])/lb,(c[1]-b[1])/lb);delta=math.atan2(u[0]*v[1]-u[1]*v[0],u[0]*v[0]+u[1]*v[1])
  if abs(delta)<.01:out.append(b);continue
  success=None
  for radius in [8,6,4.8,minr]:
   trim=radius*math.tan(abs(delta)/2)
   if trim>min(la,lb)*.45:continue
   start=(b[0]-u[0]*trim,b[1]-u[1]*trim);end=(b[0]+v[0]*trim,b[1]+v[1]*trim);sgn=1 if delta>0 else -1
   center=(start[0]-u[1]*radius*sgn,start[1]+u[0]*radius*sgn);angle=math.atan2(start[1]-center[1],start[0]-center[0]);count=max(2,math.ceil(abs(delta)*radius/.2))
   arc=[(center[0]+radius*math.cos(angle+delta*k/count),center[1]+radius*math.sin(angle+delta*k/count))for k in range(count+1)]
   if fits(arc):success=arc;minradius=min(minradius,radius);break
  if not success:return None,{'point':b,'angle':round(delta*180/math.pi,1),'adjacentLengths':[round(la,2),round(lb,2)]}
  out.extend(success)
 out.append(points[-1]);return(out,{'minimumRadiusM':minradius if minradius<1e9 else None})if fits(out)else(None,{'reason':'full-path footprint failed'})

smoothed=[];curve_rejected=[]
for edge in roads:
 points,reason=smooth(edge['points'])
 if points:
  smoothed.append({**edge,'rawPoints':edge['points'],'points':[[round(x,4),round(z,4)] for x,z in points], 'lengthM':round(LineString(points).length,4),'curveValidation':reason})
 else: curve_rejected.append({'road':edge['sourceIndex'],'reason':reason})
poly=lambda p:Polygon(p[0],p[1:]);wc={k:[poly(p)for p in ps]for k,ps in c['walkCells'].items()}
def footfits(p):
 return all(any(g.covers(Point(q))for g in wc.get(f'{math.floor(q[0]/64)},{math.floor(q[1]/64)}',[]))for q in [p]+[(p[0]+.4*math.cos(i*math.pi/4),p[1]+.4*math.sin(i*math.pi/4))for i in range(8)])
def body(p,yaw):return Polygon([(p[0]+math.sin(yaw)*u+math.cos(yaw)*v,p[1]+math.cos(yaw)*u-math.sin(yaw)*v)for u,v in[(-2.08,-1.02),(-2.08,1.02),(2.08,1.02),(2.08,-1.02)]])
# Keep only the car-connected component; no isolated spur is advertised.
adj=collections.defaultdict(list)
for e in smoothed:adj[e['from']].append(e);adj[e['to']].append(e)
startedge=next(e for e in smoothed if e['id']=='r178');todo=[startedge['from']];seen=set()
while todo:
 n=todo.pop()
 if n in seen:continue
 seen.add(n)
 for e in adj[n]:todo.append(e['to']if e['from']==n else e['from'])
edges=[e for e in smoothed if e['from']in seen]
landmarks=[('station','Surrey Central Station',(80,0)),('civic','Civic Plaza',(20,-166)),('king-george','King George Station',(316,750))]
for id,title,name in [('hall','Surrey City Hall','SURREY CITY HALL'),('library','City Centre Library','CITY CENTRE LIBRARY'),('central','Central City','CENTRAL CITY'),('sfu','SFU Surrey','SFU')]:landmarks.append((id,title,next(q['centre']for q in c['civic']if q['name']==name)))
park=next(p for p in c['parks']if p['name']=='Holland Park')['shape'][0];landmarks.append(('holland','Holland Park',(sum(p[0]for p in park)/len(park),sum(p[1]for p in park)/len(park))))
stops=[]
for id,name,landmark in landmarks:
 candidates=[]
 for e in edges:
  line=LineString(e['points']);stop_progress=max(10,min(line.length-10,line.project(Point(landmark))))
  if line.length<25:continue
  q=line.interpolate(stop_progress);a=line.interpolate(stop_progress-.1);b=line.interpolate(stop_progress+.1);yaw=math.atan2(b.x-a.x,b.y-a.y)
  # Move to supported road edge toward landmark, retaining body clearance.
  for lateral in [0,1.5,-1.5,3,-3]:
   p=(q.x+math.cos(yaw)*lateral,q.y-math.sin(yaw)*lateral)
   if not d.covers(body(p,yaw)):continue
   # A roadside stop must be able to join the road again, not merely fit when
   # parked. Keep its complete centreline join inside the all-orientation inset.
   if not s.covers(LineString([p,(q.x,q.y)])):continue
   for side in [-1,1]:
    foot=(p[0]+math.cos(yaw)*side*2,p[1]-math.sin(yaw)*side*2)
    if footfits(foot)and all(footfits((p[0]+(foot[0]-p[0])*t/10,p[1]+(foot[1]-p[1])*t/10))for t in range(11)):
     score=math.dist(foot,landmark)+abs(lateral)*.1
     candidates.append((score,{'id':id,'name':name,'point':[round(x,3)for x in p],'yaw':round(yaw,6),'foot':[round(x,3)for x in foot],'kind':'stopping','edgeId':e['id'],'roadName':e['roadName'],'distanceToLandmarkM':round(math.dist(foot,landmark),2),'edgeProgressM':round(stop_progress,3)}))
 stops.append(min(candidates,key=lambda x:x[0])[1])

rings=lambda g:[[[round(x,2),round(z,2)] for x,z in ring.coords] for ring in [g.exterior,*g.interiors]]
# The runtime rounds complete routes, including intersections, from raw source-
# associated paths. Keep both raw paths and individually validated edge lengths.
final_edges=[]
for edge in edges:
 item={**edge,'points':edge['rawPoints'],'smoothedPoints':edge['points']}
 del item['rawPoints']
 prop=road_raw['features'][edge['sourceIndex']]['properties']
 item['sourceClass']=prop['RD_CLASS'];item['sourceStatus']=prop['STATUS']
 item['sourceWidthM']=c['roads'][edge['sourceIndex']]['width']
 final_edges.append(item)
rejected=fail+curve_rejected+[{'road':e['sourceIndex'],'reason':'Disconnected from original car'} for e in smoothed if e['from'] not in seen]+[{'road':i,'reason':'Unnamed access lane excluded'} for i,r in enumerate(c['roads']) if r['name']=='Local street']
result={'version':'v0.6-2026-10-30','parentSnapshot':c['version'],'parentSha256':manifest['sha256'],'origin':c['origin'],'bounds':c['bounds'],'driveSurface':[rings(d)],'nodes':[n for n in nodes if n['id'] in seen],'edges':final_edges,'destinations':stops,'rejected':rejected,'sourceReceipts':[road_receipt,surface_receipt],'validation':{'footprintM':[4.16,2.04],'allOrientationInsetM':2.35,'edgeSampleSpacingM':.2,'minimumFilletRadiusM':4.2,'uniqueSourceRoadLengthM':round(unary_union([LineString(c['roads'][e['sourceIndex']]['points']) for e in edges]).length,3),'uniqueEdgePathLengthM':round(unary_union([LineString(e['points']) for e in edges]).length,3),'sourceJunctions':sum(len(adj[n])>=3 for n in seen),'componentNodes':len(seen),'componentEdges':len(edges),'surfaceAreaM2':round(d.area,2),'exclusions':['buildings','medians','non-Open source road surfaces','0.15m curb buffers','0.03m boundary inset','unnamed access lanes','disconnected source segments'],'junctionValidation':'pending validate_transport.mjs'}}
encoded=json.dumps(result,separators=(',',':'))+'\n'
out=args.out/'network-draft.json'
if out.exists(): assert out.read_text()==encoded, 'Refusing different existing derivation output'
out.write_text(encoded)
print(json.dumps(result['validation'],indent=2))
