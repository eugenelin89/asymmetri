"""Read-only offline transport derivation from pinned Surrey V0.3 receipts.
Run: python projects/surrey/tools/derive_transport.py --repo REPO --cache V03_CACHE --out OUT
No network calls, no mutations to the parent geographic snapshot.
"""
import argparse,hashlib,json,math
from pathlib import Path
from shapely.geometry import Polygon,LineString,Point,shape
from shapely.ops import unary_union,transform
from shapely import make_valid,set_precision
p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
city_bytes=(a.repo/'public/surrey/v0.3-2026-10-30/city.json').read_bytes();c=json.loads(city_bytes);manifest=json.loads((a.repo/'public/surrey/v0.3-2026-10-30/manifest.json').read_bytes())
assert hashlib.sha256(city_bytes).hexdigest()==manifest['sha256']
raw=(a.cache/'road-surfaces.json').read_bytes();source=next(x for x in manifest['sources'] if x['name']=='road-surfaces');assert hashlib.sha256(raw).hexdigest()==source['sha256']
poly=lambda g:Polygon(g[0],g[1:]);project=lambda x,y:((x-c['origin'][0])*111320*math.cos(math.radians(c['origin'][1])),(c['origin'][1]-y)*111320)
features=json.loads(raw)['features'];closed=[(f['properties']['OBJECTID'],make_valid(transform(project,shape(f['geometry'])))) for f in features if f['properties']['ACCESSIBILITY']!='Open']
indices=[178,36,63]
roads=[c['roads'][i] for i in indices]
assert [r['name'] for r in roads]==['Central Ave','City Parkway','City Parkway']
assert [r['width'] for r in roads]==[16.83,13.98,13.65]
pavement=unary_union([poly(p) for p in c['pavement']]);median=unary_union([poly(p) for p in c['medians']]);buildings=unary_union([poly(b['shape']) for b in c['buildings']]);curbs=unary_union([LineString(x) for x in c['curbs']]);corridor=unary_union([LineString(r['points']).buffer(r['width']/2,cap_style=1,join_style=1) for r in roads]);closed_union=unary_union([g for _,g in closed])
base=pavement.intersection(corridor).difference(median).difference(buildings).difference(closed_union).difference(curbs.buffer(.15))
# Keep the actually connected starting-car component. A conservative 3cm inset
# allows nearest 1cm quantization without opening a new driveable sliver.
surface=set_precision(base.buffer(-.03),.01)
parts=list(surface.geoms) if surface.geom_type=='MultiPolygon' else [surface]
start=[20,-68.25]
d=next(g for g in parts if g.covers(Point(*start)))
assert d.is_valid and pavement.buffer(.001).covers(d)
route=[start,[36,-68.25],[50,-66.5],[60,-66],[84,-66]]+[[84+14*math.sin(i*math.pi/2/40),-80+14*math.cos(i*math.pi/2/40)] for i in range(1,41)]+[[99,-112],[100.5,-132],[102,-151],[102,-170],[101,-199],[100,-212]]
loop=[[-30,-67.5],[2,-67.5]]+[[2+4.5*math.sin(i*math.pi/80),-72+4.5*math.cos(i*math.pi/80)] for i in range(1,81)]+[[-30,-76.5]]+[[-30-4.5*math.sin(i*math.pi/80),-72-4.5*math.cos(i*math.pi/80)] for i in range(1,81)]
route=[[round(x,4),round(z,4)] for x,z in route];loop=[[round(x,4),round(z,4)] for x,z in loop];loop[-1]=loop[0]
def footprint(pt,theta,length=4.4,width=1.9):
 x,z=pt;f=(math.sin(theta),math.cos(theta));r=(math.cos(theta),-math.sin(theta));return Polygon([(x+f[0]*u+r[0]*v,z+f[1]*u+r[1]*v) for u,v in [(-length/2,-width/2),(-length/2,width/2),(length/2,width/2),(length/2,-width/2)]])
def check(points):
 l=LineString(points);minimum=1000;curbminimum=1000;total=math.ceil(l.length/.1)
 for k in range(total+1):
  s=min(l.length,k*.1);point=l.interpolate(s);b=l.interpolate(min(l.length,s+.1));q=l.interpolate(max(0,s-.1));theta=math.atan2(b.x-q.x,b.y-q.y);f=footprint((point.x,point.y),theta)
  assert d.covers(f),(s,list(point.coords),f.difference(d).area)
  minimum=min(minimum,d.boundary.distance(f));curbminimum=min(curbminimum,curbs.distance(f))
 return {'lengthM':round(l.length,4),'samplesEveryM':.1,'samples':total+1,'footprintM':[4.4,1.9],'allFootprintsCovered':True,'minimumBodyToMaskBoundaryM':round(minimum,4),'minimumBodyToSourceCurbM':round(curbminimum,4)}
route_check=check(route);loop_check=check(loop)
spawn={'point':start,'yaw':math.pi/2};destination={'point':[100,-212],'yaw':math.pi}
recoveries=[spawn,{'point':[97,-100],'yaw':math.pi},{'point':[102,-170],'yaw':math.pi},destination]
for pose in recoveries:assert d.covers(footprint(pose['point'],pose['yaw']))
# Use one physical track, exact endpoint joins; avoid duplicated composite lines
# 24-30 and their small lateral zigzags. A 4cm duplicate at 6->15 is omitted.
rail=[]
for idx,reverse in [(6,True),(15,False),(1,False),(19,False),(7,False)]:
 line=list(reversed(c['rail'][idx])) if reverse else c['rail'][idx]
 if rail:assert math.dist(rail[-1],line[0])<=.001,(rail[-1],line[0])
 rail.extend(line[1:] if rail else line)
clean=[]
for q in rail:
 if not clean or math.dist(clean[-1],q)>.06:clean.append(q)
rail=clean;rail_line=LineString(rail);assert rail_line.is_simple
station=rail_line.project(Point(77,0));station_point=list(rail_line.interpolate(station).coords)[0]
foot={'request':[35,28],'carSide':[20,-60],'delivery':[108,-210],'destinationExit':[103,-212]}
def foot_fits(pt):
 return all(any(poly(g).covers(Point(*q)) for g in c['walkCells'].get(f'{math.floor(q[0]/64)},{math.floor(q[1]/64)}',[])) for q in [pt]+[[pt[0]+.4*math.cos(i*math.pi/4),pt[1]+.4*math.sin(i*math.pi/4)] for i in range(8)])
for name,pt in foot.items():assert foot_fits(pt),name
for start_point,end_point in [([20,-68.25],[20,-60]),([103,-212],[108,-210])]:
 line=LineString([start_point,end_point]);assert all(foot_fits(list(line.interpolate(i/20,normalized=True).coords)[0]) for i in range(21))
rings=lambda p:[[[round(x,2),round(z,2)] for x,z in r.coords] for r in [p.exterior,*p.interiors]]
result={'version':'v0.5-2026-10-30','parentSnapshot':c['version'],'parentSha256':hashlib.sha256(city_bytes).hexdigest(),'origin':c['origin'],'bounds':c['bounds'],'roads':[{'index':i,'name':c['roads'][i]['name'],'width':c['roads'][i]['width'],'points':c['roads'][i]['points']} for i in indices],'driveSurface':[rings(d)],'route':route,'spawn':spawn,'destination':destination,'recoveries':recoveries,'foot':foot,'trafficLoop':loop,'rail':{'sourceIndices':[6,15,1,19,7],'reversedIndices':[6],'points':rail,'lengthM':round(rail_line.length,4),'stationDistanceM':round(station,4),'stationPoint':[round(n,4) for n in station_point],'deckCentreY':8.2,'endMarginM':24,'heightMethod':'illustrative retained V0.3 deck centre; no measured vertical datum','boarding':False},'validation':{'route':route_check,'traffic':loop_check,'surfaceAreaM2':round(d.area,2),'surfaceComponents':1,'holes':len(d.interiors),'footPointsPassExistingWorldRadius':True,'exclusions':['all mapped buildings','all mapped medians','all retained non-Open road surfaces','0.15m on either side of active source curb lines','0.03m conservative boundary inset'],'intersectingClosedSourceIds':[i for i,g in closed if g.intersection(pavement.intersection(corridor)).area>.001],'closedRoadSourceSha256':source['sha256'],'sourceRoadSurfaceRequest':source['request'],'sourceRoadSurfaceRetrieved':source['retrieved'],'roadSelection':'Only Central Ave road178 and City Parkway roads36/63; actual pavement intersected with source-width named-road buffers, then exclusions and the connected spawn component. All other street surfaces remain visual-only for this candidate.'}}
encoded=json.dumps(result,separators=(',',':'))+'\n'
output=a.out/'transport.json'
if output.exists():assert output.read_text()==encoded,'Refusing to replace a different published transport asset'
output.write_text(encoded);(a.out/'report.json').write_text(json.dumps(result['validation'],indent=2)+'\n')
print(json.dumps({'bytes':(a.out/'transport.json').stat().st_size,'sha256':hashlib.sha256((a.out/'transport.json').read_bytes()).hexdigest(),'validation':result['validation'],'rail':{k:v for k,v in result['rail'].items() if k!='points'}},indent=2))
