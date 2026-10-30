#!/usr/bin/env python3
"""Bounded HTTP-range extraction of NRCan's published GeoParquet.
Requires pyarrow==20.0.0 in the external tooling venv. No national download.
Usage: python extract_nrcan.py /external/cache/nrcan-buildings.json
The pinned ETag fails closed if the upstream dataset changes.
"""
import io,urllib.request,ssl,certifi,json,hashlib,sys
from pathlib import Path
import pyarrow.parquet as pq
URL='https://ftp-maps-canada-ca.s3.ca-central-1.amazonaws.com/pub/nrcan_rncan/extraction/auto_building/auto_building_opti_2/auto_building_opti_2.parquet'
CTX=ssl.create_default_context(cafile=certifi.where())
class RangeFile(io.RawIOBase):
 def __init__(self):
  r=urllib.request.urlopen(urllib.request.Request(URL,method='HEAD'),context=CTX,timeout=30)
  self.size=int(r.headers['Content-Length']);self.etag=r.headers.get('ETag');self.pos=0;self.total=0;self.requests=[]
  assert self.etag == '"03fa9c6fb8267d43234811779ee1152a-288"', 'Upstream changed: review a new source version'
 def readable(self): return True
 def seekable(self):return True
 def tell(self):return self.pos
 def seek(self,offset,whence=0):
  self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.size+offset
  return self.pos
 def read(self,n=-1):
  n=self.size-self.pos if n<0 else min(n,self.size-self.pos)
  if n<=0:return b''
  if self.total+n>64*1024*1024:raise ValueError('Bounded 64MiB HTTP budget exceeded')
  start=self.pos; headers={'Range':f'bytes={start}-{start+n-1}','If-Match':self.etag}
  r=urllib.request.urlopen(urllib.request.Request(URL,headers=headers),context=CTX,timeout=60)
  assert r.status==206 and r.headers['Content-Range']==f'bytes {start}-{start+n-1}/{self.size}'
  data=r.read(n+1);assert len(data)==n
  self.pos+=n;self.total+=n;self.requests.append({'start':start,'bytes':n,'sha256':hashlib.sha256(data).hexdigest()})
  return data
from shapely import from_wkb
from shapely.geometry import box,mapping
from collections import Counter
f=RangeFile();p=pq.ParquetFile(f)
names=[p.metadata.row_group(0).column(k).path_in_schema for k in range(p.metadata.row_group(0).num_columns)]
bbox=(-123.123,49.267,-123.099,49.278)
groups=[]
for i in range(p.num_row_groups):
 g=p.metadata.row_group(i)
 stats={n:g.column(names.index('geometry_bbox.'+n)).statistics for n in ['xmin','ymin','xmax','ymax']}
 if stats['xmin'].min<=bbox[2] and stats['xmax'].max>=bbox[0] and stats['ymin'].min<=bbox[3] and stats['ymax'].max>=bbox[1]:groups.append(i)
print('candidate groups',groups,flush=True)
selected=[]
for i in groups:
 rows=p.read_row_group(i,columns=['geometry_bbox'],use_threads=False).to_pylist()
 if any(r['geometry_bbox']['xmin']<=bbox[2] and r['geometry_bbox']['xmax']>=bbox[0] and r['geometry_bbox']['ymin']<=bbox[3] and r['geometry_bbox']['ymax']>=bbox[1] for r in rows):selected.append(i)
groups=selected
print('filtered groups',groups,flush=True)
assert len(groups)<=6,'Refuse broad geometry download'
columns=['feature_id','md_id_src','acqtech','datemin','datemax','heightmin','heightmax','elevmin','elevmax','haccmin','haccmax','vaccmin','vaccmax','qltylvl','comment','geometry']
features=[]
for i in groups:
 for row in p.read_row_group(i,columns=columns,use_threads=False).to_pylist():
  geom=from_wkb(row.pop('geometry'))
  if geom.intersects(box(*bbox)):features.append({'type':'Feature','properties':row,'geometry':mapping(geom)})
features.sort(key=lambda r:r['properties']['feature_id'])
out={'type':'FeatureCollection','source':{'url':URL,'size':f.size,'etag':f.etag,'crs':'EPSG:4617','bbox':bbox,'rowGroups':groups,'downloadedBytes':f.total,'ranges':f.requests},'features':features}
path=Path(sys.argv[1])
assert not path.exists(), 'Keep the original cached source immutable'
payload=json.dumps(out,separators=(',',':'),sort_keys=True).encode();path.write_bytes(payload)
print('features',len(features),'downloaded',f.total,'output',len(payload),'sha256',hashlib.sha256(payload).hexdigest())
print('dates',Counter((r['properties']['datemin'],r['properties']['datemax']) for r in features))
print('heights',Counter(r['properties']['acqtech'] for r in features),Counter(r['properties']['qltylvl'] for r in features))
print('sample',features[0]['properties'] if features else None)
