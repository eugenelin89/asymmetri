#!/usr/bin/env python3
"""Extract directed campus portions of current TransLink 25/33/49 GTFS shapes.
Input is a privately downloaded official ZIP; no real-time vehicle positions.
Run: python3 projects/ubc/tools/compile_transit.py /path/google_transit.zip
"""
import csv, hashlib, io, json, math, sys, zipfile
from collections import defaultdict, Counter
from pathlib import Path
from compile_data import project, simplify
z=zipfile.ZipFile(sys.argv[1])
def rows(name): return csv.DictReader(io.TextIOWrapper(z.open(name),encoding='utf-8-sig'))
routes={r['route_id']:r for r in rows('routes.txt') if r['route_short_name'].lstrip('0') in ['25','33','49']}
trips=[t for t in rows('trips.txt') if t['route_id'] in routes]
shapeids={t['shape_id'] for t in trips}; shapes=defaultdict(list)
for r in rows('shapes.txt'):
 if r['shape_id'] in shapeids: shapes[r['shape_id']].append((int(r['shape_pt_sequence']),float(r['shape_pt_lon']),float(r['shape_pt_lat'])))
selected=[]
for rid,r in routes.items():
 for direction in ['0','1']:
  candidates=[t for t in trips if t['route_id']==rid and t['direction_id']==direction]; counts=Counter(t['shape_id'] for t in candidates)
  for sid,_ in counts.most_common():
   chunks=[];chunk=[]
   for _,lon,lat in sorted(shapes[sid]):
    p=project([lon,lat])
    if -1100 < p[0] < 1750 and -1250 < p[1] < 1700: chunk.append(p)
    else:
     if len(chunk)>1:chunks.append(chunk)
     chunk=[]
   if len(chunk)>1:chunks.append(chunk)
   if not chunks:continue
   points=max(chunks,key=lambda c:sum(math.dist(a,b) for a,b in zip(c,c[1:])))
   if sum(math.dist(a,b) for a,b in zip(points,points[1:]))<500:continue
   t=next(t for t in candidates if t['shape_id']==sid)
   selected.append({'id':rid+'-'+direction,'number':r['route_short_name'].lstrip('0'),'name':r['route_long_name'],'destination':t['trip_headsign'],'shapeId':sid,'direction':direction,'points':simplify(points,.35)})
   break
out={'source':'https://gtfs-static.translink.ca/gtfs/google_transit.zip','terms':'https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-data','verified':'2026-10-31','sha256':hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest(),'feed':list(rows('feed_info.txt'))[0],'legend':'Route and arrival data used in this product or service is provided by permission of TransLink. TransLink assumes no responsibility for the accuracy or currency of the Data used in this product or service.','interpretation':'Directed source shapes; original approximate vehicle meshes, synthetic passenger models, simulated service, no live positions or timetable. No operator trademarks reproduced.','routes':selected}
Path('projects/ubc/data/transit.json').write_text(json.dumps(out,indent=2)+'\n')
print([(r['number'],r['destination'],len(r['points'])) for r in selected])
