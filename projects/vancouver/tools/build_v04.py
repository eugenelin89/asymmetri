#!/usr/bin/env python3
"""V0.4: audit the entire ground network and join reviewed NRCan heights.

All prior geometry is retained. Pavement and collision cells are one surface.
Raw sources remain external; the manifest records acquisition and retrieval dates.
"""
import argparse
import hashlib
import json
import math
from collections import Counter, defaultdict
from pathlib import Path
from pyproj import Transformer
from shapely import set_precision
from shapely.geometry import Polygon, Point, LineString, box, shape
from shapely.ops import unary_union, transform
from shapely.strtree import STRtree
from build_city import OX, OY
from build_v03 import parts, coords, polygon

ROOT = Path(__file__).resolve().parents[3]
PARENT = ROOT / 'public/vancouver/v0.3-2026-10-30/city.json'
TARGET = ROOT / 'public/vancouver/v0.4-2026-10-30'
DRIVES = [
    {'id':'village-blocks','title':'Village backstreets', 'description':'Walter Hardwick, Manitoba, 3rd, Columbia and 4th. Take the turns at your own pace.', 'points':[[117.5,168.7],[315.2,174.5],[318.6,464.7],[114,458.6],[113.5,559.2],[456.5,569.2]]},
    {'id':'west-corners','title':'West-side corners', 'description':'2nd Avenue, Crowe, 1st Avenue and Wylie. Four angled junctions.', 'points':[[321.6,359.1],[114.5,356.4],[-37.8,470.5],[-101.1,386],[-213.8,470.3],[-150.5,554.8]]},
    {'id':'north-crescent','title':'North shore crescent', 'description':'Marinaside Crescent to Nelson Street. Waterfront bends and a new view of the city.', 'points':[[-756.9,58.9],[-640.9,-58.2],[-474.2,-109.1],[-354.6,-79.7],[-280.7,-152.5],[-290.8,-180.9],[-361.6,-263.1],[-518.1,-401.5]]},
]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--nrcan-source', required=True, type=Path)
    parser.add_argument('--output', type=Path, default=TARGET)
    args = parser.parse_args()
    parent = PARENT.read_bytes(); parent_sha = hashlib.sha256(parent).hexdigest()
    assert parent_sha == 'e81feb26bbffa44f1371db0a4f90e35a7888ca59a77fea2499e0bc3e7d950324'
    city = json.loads(parent)
    raw = args.nrcan_source.read_bytes(); raw_sha = hashlib.sha256(raw).hexdigest()
    assert raw_sha == '109bb8e6542a802fb0f97734fecc03985e25b37fba9672d3f90f55cdad9a3784'
    source = json.loads(raw); records = source['features']; assert len(records) == 372
    project = Transformer.from_crs('EPSG:4617','EPSG:32610',always_xy=True)
    def local(x,y,z=None):
        east,north = project.transform(x,y); return east-OX,OY-north
    geometries = [transform(local,shape(r['geometry'])) for r in records]; tree = STRtree(geometries)
    joins = []
    for building in city['buildings']:
        footprint = Polygon(building['shape'][0],building['shape'][1:])
        if building.get('landmark') or footprint.area > 10000 or footprint.centroid.distance(Point(city['anchors']['science-world'])) < 60: continue
        matches=[]
        for index in tree.query(footprint):
            r=records[index]['properties']; g=geometries[index]
            iou=footprint.intersection(g).area/footprint.union(g).area
            # Reject poor-quality 2016 extraction, flags, unclear dates and uncertain joins.
            if r['acqtech']==1360 and r['qltylvl'] in [23,24] and not r['comment'] and r['datemin']=='20130207' and r['datemax']=='20130219' and .8 <= iou and 3 <= r['heightmax'] <= 150:
                matches.append((iou,r['feature_id'],r))
        if matches:
            iou,feature_id,r=max(matches,key=lambda m:(m[0],m[1]))
            building['height']=round(r['heightmax'],2)
            building['heightMethod']='2013 NRCan LiDAR-derived maximum roof height; matched to retained 2015 footprint'
            building['heightSource']={'dataset':'nrcan-auto-building-opti-2','recordId':feature_id,'intersectionOverUnion':round(iou,4),'acquisitionStart':r['datemin'],'acquisitionEnd':r['datemax'],'heightMinM':r['heightmin'],'heightMaxM':r['heightmax'],'qualityCode':r['qltylvl'],'sourceId':r['md_id_src'],'horizontalAccuracyM':r['haccmax'],'verticalAccuracyM':r['vaccmax']}
            joins.append({'buildingId':building['id'],**building['heightSource']})
    land=unary_union([Polygon(p[0],p[1:]) for p in city['land']]);water=unary_union([Polygon(p[0],p[1:]) for p in city['water']])
    structures=unary_union([Polygon(b['shape'][0],b['shape'][1:]) for b in city['buildings']])
    roads=[r for r in city['roads'] if not r['bridge']]
    lines=parts(unary_union([LineString(r['points']) for r in roads]),'LineString')
    degree=Counter(tuple(line.coords[i]) for line in lines for i in [0,-1])
    junctions=[Point(p) for p,n in degree.items() if n>=3]
    # A bounded additional 2m turning margin at intersections, clipped around
    # every retained building and water edge. Street widths are not new measurements.
    pavement=unary_union([LineString(r['points']).buffer(r['width']/2,quad_segs=6) for r in roads]+[p.buffer(10.5,quad_segs=10) for p in junctions]).intersection(land).difference(water).difference(structures.buffer(.4))
    pavement=set_precision(pavement,.01)
    city['pavement']=[polygon(p) for p in parts(pavement,'Polygon')]
    sidewalk=pavement.buffer(2.2,quad_segs=4).intersection(land).difference(water).difference(structures.buffer(.1))
    city['sidewalks']=[polygon(p) for p in parts(sidewalk,'Polygon')]
    cells={};x0,z0,x1,z1=pavement.bounds
    for x in range(math.floor(x0/64),math.floor(x1/64)+1):
        for z in range(math.floor(z0/64),math.floor(z1/64)+1):
            ps=[polygon(p) for p in parts(pavement.intersection(box(x*64,z*64,(x+1)*64,(z+1)*64)),'Polygon') if p.area>.0001]
            if ps:cells[f'{x},{z}']=ps
    city['roadCells']=cells
    safe=pavement.buffer(-2.6,quad_segs=6)
    valid=[p for line in lines for p in parts(line.intersection(safe),'LineString') if p.length>.1]
    nodes=[];node_ids={};edges=[]
    def node(p):
        key=tuple(round(v,3) for v in p)
        if key not in node_ids:node_ids[key]=len(nodes);nodes.append(list(key))
        return node_ids[key]
    for line in valid:
        points=coords(line);name=min(roads,key=lambda r:LineString(r['points']).distance(line.interpolate(.5,normalized=True)))['name']
        edges.append({'a':node(points[0]),'b':node(points[-1]),'points':points,'length':round(line.length,3),'name':name})
    def nearest(p):return min(range(len(nodes)),key=lambda i:Point(nodes[i]).distance(Point(p)))
    old_graph=city['graph'];city['scenicWaypoints']=[nearest(old_graph['nodes'][i]) for i in city['scenicWaypoints']]
    city['graph']={'nodes':nodes,'edges':edges,'clearance':2.6}
    city['drives']=[{k:v for k,v in d.items() if k!='points'}|{'waypoints':[nearest(p) for p in d['points']]} for d in DRIVES]
    adjacent=defaultdict(set)
    for edge in edges:adjacent[edge['a']].add(edge['b']);adjacent[edge['b']].add(edge['a'])
    components=[];seen=set()
    for n in range(len(nodes)):
        if n in seen:continue
        stack=[n];component=set()
        while stack:
            v=stack.pop()
            if v in component:continue
            component.add(v);stack.extend(adjacent[v]-component)
        seen|=component
        components.append({'nodes':len(component),'lengthM':round(sum(e['length'] for e in edges if e['a'] in component),1)})
    before=unary_union([Polygon(p[0],p[1:]) for p in json.loads(parent)['pavement']])
    city['networkAudit']={'parentSha256':parent_sha,'junctions':len(junctions),'junctionRadiusM':10.5,'addedPavementM2':round(pavement.difference(before).area,2),'components':sorted(components,key=lambda c:c['lengthM'],reverse=True),'sourceRoadLines':len(roads),'sourceCentrelineM':round(sum(LineString(r['points']).length for r in roads),1),'safeGraphM':round(sum(e['length'] for e in edges),1),'notice':'Entire ground network audited for geometric clearance; three additional routes receive manual browser acceptance. Disconnected shoreline pockets and cropped map edges remain. Widths and turning aprons are illustrative, not measured or legal driving directions.'}
    city['sources'].append({'dataset':'nrcan-auto-building-opti-2','url':source['source']['url'],'catalogue':'https://open.canada.ca/data/dataset/7a5cda52-c7df-427f-9ced-26f19a8a64d6','sha256':raw_sha,'records':len(records),'retrieved':'2026-10-30','downloadedBytes':source['source']['downloadedBytes'],'etag':source['source']['etag'],'licence':'Open Government Licence – Canada','acquisitionDates':['20130207/20130219','20160620/20160912']})
    counts=Counter(b.get('heightSource',{}).get('dataset','illustrative') for b in city['buildings'])
    city['heightRefinement']={'nrcanMatches':len(joins),'counts':dict(counts),'matches':joins,'notice':'NRCan matches use February 2013 LiDAR maximum roof heights, not current measurements or roof geometry. 2016 poor-quality records are rejected. Existing 2009 matches remain elsewhere; all other heights are illustrative. Footprints are retained unchanged.'}
    city['version']='v0.4-2026-10-30'
    city['notice']='2015 footprints; matched 2013/2009 LiDAR heights and clearly identified illustrative heights. Flat terrain, approximate shoreline and road widths. Bridges are view-only. Not a current survey or real-world navigation map.'
    assert pavement.intersection(water).area<.1 and pavement.intersection(structures).area<.1
    assert all(safe.buffer(.01).covers(line) for line in valid)
    assert city['buildings'] and len(joins)>=15
    output=json.dumps(city,separators=(',',':'),ensure_ascii=False).encode()
    manifest={'version':city['version'],'asset':'city.json','bytes':len(output),'sha256':hashlib.sha256(output).hexdigest(),'parentSha256':parent_sha,'sources':city['sources'],'networkAudit':city['networkAudit'],'heightRefinement':city['heightRefinement'],'attribution':[city['attribution'],'Contains information licensed under the Open Government Licence – Canada.'],'licences':[city['licence'],'https://open.canada.ca/en/open-government-licence-canada']}
    if (args.output/'city.json').exists():assert (args.output/'city.json').read_bytes()==output,'Choose a new immutable version for changed published output'
    args.output.mkdir(parents=True,exist_ok=True);(args.output/'city.json').write_bytes(output);(args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps({'bytes':len(output),'heights':dict(counts),'network':city['networkAudit']}))

if __name__=='__main__':main()
