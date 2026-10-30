"""One-off bounded API fallback after Overpass timeout. Cached raw XML never enters Git.
Use an extract/Overpass for routine refreshes; this fetch is only the bounded Richmond area.
"""
import argparse,json,hashlib,subprocess,datetime,xml.etree.ElementTree as ET
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);a=p.parse_args();a.cache.mkdir(parents=True,exist_ok=True)
sources=[];nodes={};ways={};relations={}
def read(name,url):
 f=a.cache/name
 if not f.exists():
  print('Fetch',name,flush=True);r=subprocess.run(['curl','--fail','--silent','--show-error','--http1.1','--retry','1','--retry-all-errors','--retry-delay','2','--max-time','60',url],capture_output=True,check=True);root=ET.fromstring(r.stdout);assert root.tag=='osm';f.write_bytes(r.stdout)
 raw=f.read_bytes();root=ET.fromstring(raw);assert root.tag=='osm' and root.find('error') is None;sources.append({'file':name,'url':url,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'features':len(root),'retrievedAt':datetime.datetime.fromtimestamp(f.stat().st_mtime,datetime.timezone.utc).isoformat(),'osmBaseDate':root.find('meta').get('osm_base') if root.find('meta') is not None else None})
 for e in root:
  if e.tag not in ['node','way','relation']:continue
  (nodes if e.tag=='node' else ways if e.tag=='way' else relations)[int(e.attrib['id'])]=e
 print(name,len(raw),flush=True)
def tile(name,west,south,east,north,depth=0):
 try:read(name+'.osm',f'https://api.openstreetmap.org/api/0.6/map?bbox={west:.6f},{south:.6f},{east:.6f},{north:.6f}')
 except (subprocess.CalledProcessError,ET.ParseError,AssertionError) as e:
  if depth>=3:raise
  print('Subdivide node-limited / unavailable tile',name,flush=True)
  mx=(west+east)/2;my=(south+north)/2
  for i,b in enumerate([(west,south,mx,my),(mx,south,east,my),(west,my,mx,north),(mx,my,east,north)]):tile(name+'-'+str(i),*b,depth+1)
for x in range(8):
 for y in range(5):
  west=-123.235+x*.036875;east=west+.036875;south=49.10+y*.023;north=south+.023
  tile(f'api-{x}-{y}',west,south,east,north)
def tags(e):return {t.get('k'):t.get('v') for t in e.findall('tag')}
for rid,e in list(relations.items()):
 t=tags(e)
 if t.get('natural')=='water' or 'building' in t or t.get('leisure')=='park' or t.get('landuse') in ['farmland','forest','grass','meadow','orchard','recreation_ground']:
  missing=[m for m in e.findall('member') if m.get('type')=='way' and int(m.get('ref')) not in ways]
  if missing:read(f'relation-{rid}.osm',f'https://api.openstreetmap.org/api/0.6/relation/{rid}/full')
def wgeom(e):return [{'lon':float(nodes[int(n.get('ref'))].get('lon')),'lat':float(nodes[int(n.get('ref'))].get('lat'))} for n in e.findall('nd')]
output={'transport':[],'buildings':[],'land':[],'places':[]}
for wid,e in ways.items():
 t=tags(e);v={'type':'way','id':wid,'tags':t,'nodes':[int(n.get('ref')) for n in e.findall('nd')],'geometry':wgeom(e),'timestamp':e.get('timestamp')}
 if 'highway' in t or 'aeroway' in t:output['transport'].append(v)
 if 'building' in t:output['buildings'].append(v)
 if t.get('natural') in ['water','coastline','wood'] or 'landuse' in t or t.get('leisure')=='park' or t.get('amenity')=='parking':output['land'].append(v)
for rid,e in relations.items():
 t=tags(e)
 targets=['buildings'] if 'building' in t else ['land'] if t.get('natural')=='water' or 'landuse' in t or t.get('leisure')=='park' else []
 if not targets:continue
 members=[]
 for m in e.findall('member'):
  if m.get('type')=='way' and int(m.get('ref')) in ways:members.append({'ref':int(m.get('ref')),'type':'way','role':m.get('role'),'geometry':wgeom(ways[int(m.get('ref'))])})
 v={'type':'relation','id':rid,'tags':t,'members':members,'timestamp':e.get('timestamp')}
 for k in targets:output[k].append(v)
normal=[]
for key,els in output.items():
 raw=(json.dumps({'elements':els+[{'type':'count','tags':{'total':str(len(els))}}]},separators=(',',':'))+'\n').encode();name='normalized-'+key+'.json';(a.cache/name).write_bytes(raw);normal.append({'dataset':key,'file':name,'sha256':hashlib.sha256(raw).hexdigest(),'features':len(els),'url':'https://api.openstreetmap.org/api/0.6/map','derivedFrom':[s['file'] for s in sources]})
(a.cache/'sources.json').write_text(json.dumps(normal,indent=2)+'\n');(a.cache/'raw-sources.json').write_text(json.dumps(sources,indent=2)+'\n');print({k:len(v) for k,v in output.items()},flush=True)
