#!/usr/bin/env python3
"""Compile pinned OSM geometry into metric local coordinates, topology and streamed tiles.
No network at build/runtime. x=east,z=south; EPSG:32610 origin [-123.137,49.166].
Road intersections use source node IDs, never projected line intersections.
"""
import argparse,json,hashlib,math,heapq,re
from pathlib import Path
from collections import defaultdict,Counter
from pyproj import Transformer
from shapely.geometry import Polygon,LineString,Point,box
from shapely.ops import unary_union,polygonize,nearest_points
from shapely.validation import make_valid
from shapely.strtree import STRtree
from shapely.prepared import prep
ROOT=Path(__file__).resolve().parents[3]
VERSION='v0.1-2026-10-30'; ORIGIN=[-123.137,49.166]; BBOX=[-123.235,49.10,-122.94,49.215]
TRANS=Transformer.from_crs('EPSG:4326','EPSG:32610',always_xy=True);OX,OY=TRANS.transform(*ORIGIN)
def loc(lon,lat):
 x,y=TRANS.transform(lon,lat);return [round(x-OX,2),round(OY-y,2)]
def parts(g,kind):
 if g.is_empty:return []
 if g.geom_type==kind:return [g]
 return [p for a in getattr(g,'geoms',[]) for p in parts(a,kind)]
def ring(c):return [[round(x,2),round(y,2)] for x,y in c]
def poly(g):return [ring(g.exterior.coords),*[ring(r.coords) for r in g.interiors]]
def geometry(e):
 if e['type']=='way':
  p=[loc(v['lon'],v['lat']) for v in e.get('geometry',[]) if v]
  return make_valid(Polygon(p)) if len(p)>3 and p[0]==p[-1] else None
 outer=[];inner=[]
 for m in e.get('members',[]):
  p=[loc(v['lon'],v['lat']) for v in m.get('geometry',[]) if v]
  if len(p)>1:(inner if m.get('role')=='inner' else outer).append(LineString(p))
 if not outer:return None
 g=unary_union(list(polygonize(unary_union(outer))))
 if inner:g=g.difference(unary_union(list(polygonize(unary_union(inner)))))
 return make_valid(g)
def num(v,default):
 try:
  n=float(re.search(r'[0-9.]+',str(v))[0]);return n*.3048 if 'ft' in str(v) or "'" in str(v) else n
 except (ValueError,TypeError):return default

def main():
 p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--output',type=Path);a=p.parse_args()
 out=a.output or ROOT/'public/richmond'/VERSION;out.mkdir(parents=True,exist_ok=True)
 sources=json.loads((a.cache/'sources.json').read_text())
 data={}
 for source in sources:
  raw=(a.cache/source['file']).read_bytes()
  assert hashlib.sha256(raw).hexdigest()==source['sha256'],'Raw source hash changed'
  d=json.loads(raw);assert not d.get('remark') and d['elements'][-1]['type']=='count'
  assert int(d['elements'][-1]['tags']['total'])==len(d['elements'])-1
  data.setdefault(source['dataset'],{}).update({(e['type'],e['id']):e for e in d['elements'][:-1]})
 data={key:sorted(values.values(),key=lambda e:(e['type'],e['id'])) for key,values in data.items()}
 lo=loc(BBOX[0],BBOX[3]);hi=loc(BBOX[2],BBOX[1]);bounds=[lo[0],lo[1],hi[0],hi[1]];clip=box(*bounds)
 roads=[]; nodes=[]; nids={};edges=[]; lots=[];coasts=[];waters=[];parks=[]
 def node(n,p):
  if n not in nids:nids[n]=len(nodes);nodes.append([*p,0])
  return nids[n]
 drive={'motorway','motorway_link','trunk','trunk_link','primary','primary_link','secondary','secondary_link','tertiary','tertiary_link','residential','living_street','unclassified','service'}
 node_usage=Counter(n for e in data['transport'] for n in e.get('nodes',[]))
 for e in data['transport']:
  t=e.get('tags',{});h=t.get('highway');air=t.get('aeroway');points=[loc(v['lon'],v['lat']) for v in e.get('geometry',[]) if v]
  if air=='apron':
   g=geometry(e)
   if g:lots.extend({'id':'osm:'+str(e['id']),'shape':poly(q),'airfield':True} for q in parts(g.intersection(clip),'Polygon'))
  if len(points)<2 or (h not in drive and h not in {'footway','path','pedestrian','cycleway'} and air not in {'runway','taxiway'}):continue
  if t.get('area')=='yes':continue
  # Restricted airport roads are excluded from the public graph. Airport surface graph is explicit.
  if h in drive and t.get('access') in {'private','no'}:continue
  if not all(clip.covers(Point(p)) for p in points):continue
  kind='airfield' if air in {'runway','taxiway'} else 'road' if h in drive else 'path'
  width=num(t.get('width'),0)
  if not width:width=45 if air=='runway' else 20 if air=='taxiway' else max(7,num(t.get('lanes'),2)*3.3+2) if kind=='road' else 3.5
  width=min(70,max(3,width))
  simplified=set(tuple(p) for p in LineString(points).simplify(.2).coords)
  keep=[i for i,p in enumerate(points) if i in (0,len(points)-1) or node_usage[e['nodes'][i]]>1 or tuple(p) in simplified]
  source_nodes=[e['nodes'][i] for i in keep];points=[points[i] for i in keep]
  ids=[node(n,p) for n,p in zip(source_nodes,points)]
  oneway=-1 if t.get('oneway')=='-1' else 1 if t.get('oneway')=='yes' or t.get('junction')=='roundabout' else 0
  road={'id':'osm:'+str(e['id']),'name':t.get('name') or t.get('ref') or ('Airfield taxiway' if kind=='airfield' else 'Local path' if kind=='path' else 'Local street'),'points':points,'nodes':ids,'heights':[0]*len(ids),'width':round(width,2),'kind':kind,'bridge':t.get('bridge','no')!='no','oneway':oneway,'class':air or h}
  ri=len(roads);roads.append(road)
  for i in range(len(ids)-1):
   length=math.dist(points[i],points[i+1])
   if length>.02:edges.append({'a':ids[i],'b':ids[i+1],'road':ri,'length':round(length,2),'direction':oneway})
 # Schematic bridge decks and approach gradients, explicitly not surveyed elevations.
 adj=defaultdict(list)
 for e in edges:
  if roads[e['road']]['kind']=='road':adj[e['a']].append((e['b'],e['length']));adj[e['b']].append((e['a'],e['length']))
 heap=[]
 for r in roads:
  if r['bridge'] and r['kind']=='road':
   for n in r['nodes']:nodes[n][2]=8;heapq.heappush(heap,(-8,n))
 while heap:
  neg,n=heapq.heappop(heap);height=-neg
  if height<nodes[n][2]:continue
  for b,d in adj[n]:
   y=round(max(0,height-d*.06),3)
   if y>nodes[b][2]:nodes[b][2]=y;heapq.heappush(heap,(-y,b))
 for r in roads:r['heights']=[nodes[n][2] for n in r['nodes']]
 for e in data['land']:
  t=e.get('tags',{})
  if t.get('natural')=='coastline':
   pp=[loc(v['lon'],v['lat']) for v in e.get('geometry',[]) if v]
   if len(pp)>1:coasts.append(LineString(pp))
   continue
  g=geometry(e)
  if g is None:continue
  g=g.intersection(clip).simplify(.6,preserve_topology=True)
  if t.get('natural')=='water':waters.extend(parts(g,'Polygon'))
  elif t.get('amenity')=='parking':lots.extend({'id':'osm:'+str(e['id']),'shape':poly(q),'airfield':False} for q in parts(g,'Polygon') if q.area<200000)
  elif t.get('leisure')=='park' or t.get('landuse') in {'farmland','forest','grass','meadow','orchard','recreation_ground'} or t.get('natural')=='wood':parks.extend({'name':t.get('name','Green space'),'shape':poly(q),'kind':t.get('landuse',t.get('natural','park'))} for q in parts(g,'Polygon'))
 # Coastline polygonization: keep faces containing road/building land probes; inland water comes from water polygons.
 faces=list(polygonize(unary_union([clip.boundary,*[c.intersection(clip) for c in coasts]])))
 probes=[Point(loc(-123.15,49.16)),Point(loc(-123.18,49.19)),Point(loc(-123.02,49.16))]
 land=unary_union([q for q in faces if any(q.covers(v) for v in probes)]) if len(faces)>1 else clip
 if land.is_empty:land=clip
 water=unary_union(waters).intersection(clip)
 land=land.difference(water)
 # Every source footprint, simplified and streamed; height methods remain explicit.
 buildings=[];seen=set()
 rel_members={m['ref'] for e in data['buildings'] if e['type']=='relation' for m in e.get('members',[])}
 for e in data['buildings']:
  if e['type']=='way' and e['id'] in rel_members:continue
  t=e.get('tags',{});g=geometry(e)
  if g is None:continue
  height=num(t.get('height'),0);method='source-reported' if height else 'floors-estimate' if t.get('building:levels') else 'illustrative'
  height=height or num(t.get('building:levels'),0)*3.2 or (13 if t.get('aeroway')=='terminal' else 8 if t.get('building') in {'commercial','retail','industrial'} else 6)
  for i,q in enumerate(parts(g.intersection(clip).simplify(.35,preserve_topology=True),'Polygon')):
   bid=f"osm:{e['type']}:{e['id']}:{i}"
   if q.area<8 or bid in seen:continue
   seen.add(bid);buildings.append({'id':bid,'shape':poly(q),'height':round(max(3,min(height,160)),2),'heightMethod':method,'name':t.get('name',''),'kind':t.get('building','yes')})
 building_shapes=[Polygon(b['shape'][0],b['shape'][1:]) for b in buildings]
 building_tree=STRtree(building_shapes)
 # Routing rejects centreline corridors without a full-car turning envelope. Source
 # nodes still define junctions; we do not invent intersections at geometric crossings.
 safe_edges=[];rejected_edges=[];prepared_water=prep(water)
 for edge in edges:
  road=roads[edge['road']]
  if road['kind']!='road':safe_edges.append(edge);continue
  line=LineString([nodes[edge['a']][:2],nodes[edge['b']][:2]])
  envelope=line.buffer(2.4)
  blocked=any(building_shapes[j].intersects(envelope) and buildings[j]['height']>min(nodes[edge['a']][2],nodes[edge['b']][2]) for j in building_tree.query(envelope))
  wet=not road['bridge'] and prepared_water.intersects(line.buffer(1.2))
  if blocked or wet:rejected_edges.append({'road':road['id'],'a':edge['a'],'b':edge['b'],'reason':'building clearance' if blocked else 'water without bridge'})
  else:safe_edges.append(edge)
 edges=safe_edges
 adj=defaultdict(list)
 for edge in edges:
  if roads[edge['road']]['kind']=='road':adj[edge['a']].append((edge['b'],edge['length']));adj[edge['b']].append((edge['a'],edge['length']))
 # Only the largest strongly connected public-road component supplies mission
 # parking: a valid arrival must also permit departure under source one-way rules.
 outgoing=defaultdict(list);incoming=defaultdict(list)
 for e in edges:
  if roads[e['road']]['kind']!='road':continue
  if e['direction']>=0:outgoing[e['a']].append(e['b']);incoming[e['b']].append(e['a'])
  if e['direction']<=0:outgoing[e['b']].append(e['a']);incoming[e['a']].append(e['b'])
 visited=set();order=[]
 for n in sorted(adj):
  if n in visited:continue
  stack=[(n,False)]
  while stack:
   nn,done=stack.pop()
   if done:order.append(nn);continue
   if nn in visited:continue
   visited.add(nn);stack.append((nn,True))
   stack.extend((q,False) for q in outgoing[nn] if q not in visited)
 visited=set();components=[]
 for n in reversed(order):
  if n in visited:continue
  comp=set();stack=[n];visited.add(n)
  while stack:
   nn=stack.pop();comp.add(nn)
   for q in incoming[nn]:
    if q not in visited:visited.add(q);stack.append(q)
  components.append(comp)
 major=max(components,key=len)
 usable=[]
 for e in edges:
  r=roads[e['road']]
  if r['kind']!='road' or e['a'] in major and e['b'] in major:usable.append(e)
  else:rejected_edges.append({'road':r['id'],'a':e['a'],'b':e['b'],'reason':'outside bidirectionally reachable public network'})
 edges=usable;segments=[]
 for e in edges:
  r=roads[e['road']]
  if r['kind']=='road' and not r['bridge'] and max(nodes[e['a']][2],nodes[e['b']][2])<.2:
   segments.append((e,LineString([nodes[e['a']][:2],nodes[e['b']][:2]])))
 specs=[
 ('richmond-centre','CF Richmond Centre','City Centre',-123.1386,49.1665,'mall','pickup','Harvest Kitchen · 豐盛小館'),
 ('brighouse','Brighouse Kitchen','City Centre',-123.1348,49.1661,'restaurant','pickup','Brighouse Bento · 便當小館'),
 ('minoru','Minoru Park','City Centre',-123.1456,49.1654,None,'customer','Park picnic meeting point'),
 ('city-hall','Richmond City Hall','City Centre',-123.1369,49.1631,None,'customer','Civic plaza meeting point'),
 ('station','Richmond–Brighouse Station','City Centre',-123.1364,49.1685,None,'landmark','Canada Line'),
 ('lansdowne','Lansdowne Centre','City Centre',-123.1326,49.1755,'restaurant','pickup','Lantern Pizza · 燈籠披薩'),
 ('aberdeen','Aberdeen Centre','Golden Village',-123.1333,49.1830,'restaurant','pickup','Golden Bento · 金色便當'),
 ('parker','Parker Place','Golden Village',-123.1364,49.1812,None,'landmark','Shopping district'),
 ('yaohan','Yaohan Centre','Golden Village',-123.1351,49.1855,None,'landmark','Shopping district'),
 ('alexandra','Alexandra Road','Golden Village',-123.1301,49.1785,'restaurant','pickup','Red Lantern Noodles · 紅燈籠麵館'),
 ('steveston','Steveston Village / Moncton Street','Steveston',-123.1844,49.1252,'restaurant','pickup','Harbour Fish & Chips'),
 ('garry-point','Garry Point Park','Steveston',-123.1946,49.1241,None,'customer','Waterfront picnic meeting point'),
 ('britannia','Britannia Shipyards','Steveston',-123.1714,49.1218,None,'customer','Heritage waterfront meeting point'),
 ('terra-nova','Terra Nova Rural Park','Terra Nova',-123.1956,49.1748,None,'customer','Park meeting point'),
 ('terra-village','Terra Nova Village','Terra Nova',-123.1807,49.1708,'restaurant','pickup','Westwind Tea · 西風茶坊'),
 ('thompson','Thompson','Northwest',-123.1748,49.1657,None,'landmark','Residential streets'),
 ('seafair','Seafair','Southwest',-123.182,49.1485,None,'customer','Village meeting point'),
 ('westwind','Westwind','Southwest',-123.167,49.132,None,'customer','Neighbourhood meeting point'),
 ('broadmoor','Broadmoor','Southwest',-123.136,49.139,None,'customer','Neighbourhood meeting point'),
 ('garden-city','Garden City','Garden City',-123.124,49.164,'lobby','customer','Garden Court Lobby'),
 ('blundell','Blundell','Central Richmond',-123.155,49.155,None,'customer','Community meeting point'),
 ('ironwood','Ironwood','East Richmond',-123.091,49.135,None,'customer','Shopping plaza meeting point'),
 ('south-arm','South Arm','South Richmond',-123.124,49.14,None,'customer','Park meeting point'),
 ('mclennan','McLennan','East Richmond',-123.105,49.157,None,'customer','Roadside farm stand'),
 ('ikea','IKEA Richmond / Jacombs Road','Bridgeport',-123.0819,49.1918,'office','customer','Fictional warehouse dispatch'),
 ('bridgeport','Bridgeport Road','Bridgeport',-123.115,49.1926,None,'landmark','Commercial district'),
 ('cambie','Cambie Road','East Richmond',-123.101,49.1844,None,'landmark','East–west corridor'),
 ('no5','No. 5 Road','East Richmond',-123.091,49.161,None,'landmark','Farm corridor'),
 ('no6','No. 6 Road','East Richmond',-123.068,49.176,None,'landmark','Industrial and agricultural corridor'),
 ('knight','Knight Street Bridge','Bridgeport',-123.075,49.202,None,'landmark','Bridge approach / model boundary north'),
 ('hamilton','Hamilton','Hamilton',-122.97,49.177,None,'customer','Community meeting point'),
 ('yvr','YVR Main Terminal','Sea Island',-123.178,49.195,'terminal','pickup','Cloud Nine Café · 雲上咖啡'),
 ('airport-office','Airport Operations Office','Sea Island',-123.1687,49.1774,'office','customer','Fictional airport staff office'),
 ]
 places=[];connectors=[]
 for pid,name,district,lon,lat,interior,role,label in specs:
  p=Point(loc(lon,lat));bi=None
  if interior:
   candidates=sorted(range(len(buildings)),key=lambda i:building_shapes[i].distance(p))
   bi=candidates[0];g=building_shapes[bi]
   # Known mall/terminal names are preferred when mapped within the landmark neighbourhood.
   named=[i for i in candidates[:80] if (pid=='richmond-centre' and 'richmond centre' in buildings[i]['name'].lower()) or (pid=='yvr' and ('terminal' in buildings[i]['name'].lower() or building_shapes[i].area>30000) and building_shapes[i].distance(p)<500)]
   if named:bi=named[0];g=building_shapes[bi]
   # Choose a short unobstructed frontage from actual connected road geometry.
   choices=[]
   for edge,line in sorted(segments,key=lambda el:el[1].distance(g))[:80]:
    q,b=nearest_points(line,g);d=q.distance(b)
    if d<5:continue
    entrance=Point(b.x+(q.x-b.x)/d*2.5,b.y+(q.y-b.y)/d*2.5)
    connector=LineString([q,entrance]);envelope=connector.buffer(.65);obstructed=prepared_water.intersects(envelope) or any(building_shapes[j].intersects(envelope) for j in building_tree.query(envelope))
    if not obstructed:choices.append((d,edge,q,entrance))
   if not choices:raise ValueError('No clear entrance '+pid)
   _,edge,parking,entrance=min(choices,key=lambda x:x[0]);point=list(g.representative_point().coords)[0]
  else:
   edge,line=min(segments,key=lambda el:el[1].distance(p));parking=line.interpolate(line.project(p));dx=p.x-parking.x;dz=p.y-parking.y;length=math.hypot(dx,dz) or 1
   entrance=Point(parking.x+dx/length*min(12,length),parking.y+dz/length*min(12,length));point=[p.x,p.y]
   if water.contains(entrance) or any(g.contains(entrance) for g in building_shapes):entrance=parking
  ep=ring([entrance.coords[0]])[0];pp=ring([parking.coords[0]])[0]
  # Authored pedestrian approaches are public fiction, derived from geometry. No building edits.
  connectors.append({'id':'approach:'+pid,'shape':poly(LineString([pp,ep]).buffer(3)),'airfield':False})
  entrances=[{'id':pid+':main','point':ep,'parking':pp}]
  if pid=='richmond-centre':
   alternatives=[c for c in choices if c[3].distance(entrance)>30 and c[0]<120]
   if alternatives:
    _,ee,p2,e2=min(alternatives,key=lambda x:x[0]);p2p=ring([p2.coords[0]])[0];e2p=ring([e2.coords[0]])[0]
    entrances.append({'id':pid+':east','point':e2p,'parking':p2p});connectors.append({'id':'approach:'+pid+':east','shape':poly(LineString([p2,e2]).buffer(3)),'airfield':False})
  places.append({'entrances':entrances,'id':pid,'name':name,'district':district,'point':ring([point])[0],'entrance':ep,'parking':pp,'roadNode':edge['b'] if edge['direction']<0 else edge['a'],'building':buildings[bi]['id'] if bi is not None else None,'interior':interior,'role':role,'label':label,'source':'OSM footprint / authored frontage' if bi is not None else 'Authored landmark coordinate / OSM road approach'})
 # The airfield access is explicitly fictional. It is visibly rendered, never used by ordinary traffic.
 office=next(p for p in places if p['id']=='airport-office');op=Point(office['parking'])
 air=[LineString(r['points']).buffer(r['width']/2) for r in roads if r['kind']=='airfield']+[Polygon(l['shape'][0],l['shape'][1:]) for l in lots if l['airfield']]
 airunion=unary_union(air);apr=nearest_points(op,airunion)[1];gate={'road':office['parking'],'apron':ring([apr.coords[0]])[0],'shape':poly(LineString([op,apr]).buffer(8))}
 tiles=defaultdict(list)
 for b,g in zip(buildings,building_shapes):
  c=g.centroid;tiles[f'{math.floor(c.x/512)}_{math.floor(c.y/512)}'].append(b)
 tile_index=[];outputs=[]
 def write(name,value):
  raw=(json.dumps(value,separators=(',',':'),ensure_ascii=False)+'\n').encode();path=out/name;path.parent.mkdir(parents=True,exist_ok=True)
  if path.exists() and path.read_bytes()!=raw:raise ValueError('Immutable snapshot differs: '+name+'; use a new version/output')
  path.write_bytes(raw);outputs.append({'path':name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()})
 for tid,bs in sorted(tiles.items()):
  x,z=map(int,tid.split('_'));name='tiles/'+tid+'.json';write(name,{'buildings':bs});tile_index.append({'id':tid,'url':'/richmond/'+VERSION+'/'+name,'bounds':[x*512,z*512,(x+1)*512,(z+1)*512],'count':len(bs)})
 def split_surface(g):
  result=[];g=g.simplify(.5,preserve_topology=True);prepared=prep(g)
  for x in range(math.floor(bounds[0]/256),math.ceil(bounds[2]/256)):
   for z in range(math.floor(bounds[1]/256),math.ceil(bounds[3]/256)):
    cell=box(x*256,z*256,(x+1)*256,(z+1)*256)
    if prepared.intersects(cell):result.extend(poly(q) for q in parts(g.intersection(cell),'Polygon'))
  return result
 city={'version':VERSION,'bounds':bounds,'origin':ORIGIN,'roads':roads,'nodes':nodes,'edges':edges,'water':split_surface(water),'land':split_surface(land),'parks':parks,'lots':lots+connectors,'places':places,'buildingIndex':[{'id':b['id'],'shape':b['shape'],'bounds':list(g.bounds),'height':b['height']} for b,g in zip(buildings,building_shapes)],'tiles':tile_index,'airportGate':gate}
 write('city.json',city)
 write('excluded-road-edges.json',rejected_edges)
 manifest={'version':VERSION,'licence':'https://opendatacommons.org/licenses/odbl/1-0/','attribution':'© OpenStreetMap contributors','copyright':'https://www.openstreetmap.org/copyright','boundsWgs84':BBOX,'projection':'EPSG:32610, local x east, z south; origin '+str(ORIGIN),'sources':sources,'rawSources':json.loads((a.cache/'raw-sources.json').read_text()) if (a.cache/'raw-sources.json').exists() else [],'counts':{'roads':len(roads),'buildings':len(buildings),'tiles':len(tiles),'nodes':len(nodes),'edges':len(edges),'places':len(places),'publicRoadStrongComponents':len(components),'largestPublicComponentNodes':len(major),'rejectedVehicleEdges':len(rejected_edges),'heightMethods':dict(Counter(b['heightMethod'] for b in buildings))},'processing':{'widths':'source width or inferred from lanes/class; minimum road width 7m','buildingSimplificationM':.35,'landSimplificationM':.6,'bridgeHeights':'illustrative 8m decks with 6% ramps; source topology, not surveyed elevations','entrances':'Authored unobstructed footprint frontages and 6m approach paths to largest strongly connected public road component','interiors':'Entirely original fiction; not operational floor plans','airfieldGate':'Original fictional connection; gated from public routing','dates':'OSM feature edit timestamps are not survey/observation dates; observation dates unknown'},'limitations':['OSM completeness varies; only imported footprints rendered','Schematic flat terrain except bridge approaches','Parking/sidewalk widths and access are gameplay approximations','Restricted city roads and beyond-bounds ways excluded; boundaries must be marked','No real resident identities or operational airport plans'], 'outputs':outputs}
 write('manifest.json',manifest)
 print(json.dumps(manifest['counts'],indent=2));print('city bytes',next(o['bytes'] for o in outputs if o['path']=='city.json'));print('airport gate length',op.distance(apr))
if __name__=='__main__':main()
