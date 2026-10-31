#!/usr/bin/env python3
"""Compile the CWRU OSM snapshot. Python 3 standard library only.

Usage: python3 projects/cwru/tools/compile_geography.py /tmp/cwru-geography/osm-core.xml /tmp/cwru-geography/osm-north.xml /tmp/cwru-geography/osm-south.xml /tmp/cwru-geography/osm-hec.xml
Raw OSM API responses stay outside Git. This importer never requests person data.
"""
import argparse
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ORIGIN = [-81.608, 41.504]
BBOX = [41.495, -81.627, 41.516, -81.595]  # south, west, north, east
VERSION = 'v0.1-2026-10-31'
PINNED_SHA256 = 'a5d73dec71cb6721770229cafab008b5fddbd9a163130e75e2e143b280793f94'
SOURCE_URL = 'https://api.openstreetmap.org/api/0.6/map'
SOURCE_BOUNDS = [
    [-81.614, 41.499, -81.602, 41.512],
    [-81.615, 41.511, -81.598, 41.516],
    [-81.618, 41.495, -81.595, 41.499],
    [-81.627, 41.500, -81.613, 41.507],
]

EARTH_RADIUS = 6371008.8


def project(lon, lat):
    """Local equirectangular projection; metre-scale rendering, not a survey CRS."""
    return [round(math.radians(lon - ORIGIN[0]) * EARTH_RADIUS * math.cos(math.radians(ORIGIN[1])), 2),
            round(-math.radians(lat - ORIGIN[1]) * EARTH_RADIUS, 2)]


def point(p):
    return project(p['lon'], p['lat'])


def number(value):
    try:
        return float(re.match(r'^\s*([\d.]+)', str(value)).group(1))
    except (AttributeError, ValueError, TypeError):
        return None


def metres(value):
    n = number(value)
    if n is not None and isinstance(value, str) and ('ft' in value or "'" in value):
        return n * 0.3048
    return n


def height(tags):
    h = metres(tags.get('height'))
    if h and 2 <= h <= 150:
        return round(h, 2), 'OSM height tag; measurement method/date unverified'
    levels = number(tags.get('building:levels'))
    if levels and 1 <= levels <= 40:
        return round(levels * 3.5, 2), 'Estimated from OSM building:levels × 3.5 m; floor heights not surveyed'
    kind = tags.get('building', '')
    return (7 if kind in ('house', 'detached', 'garage', 'garages') else 14), 'Illustrative fallback; height absent from source'


def rings_for(element):
    if element['type'] == 'way':
        g = element.get('geometry', [])
        if len(g) >= 4 and g[0] == g[-1]:
            return [[point(p) for p in g]]
        return []
    outer, inner = [], []
    for role, target in [('outer', outer), ('inner', inner)]:
        pieces = [[point(p) for p in m.get('geometry', [])] for m in element.get('members', [])
                  if m.get('type') == 'way' and m.get('role', 'outer') == role and m.get('geometry')]
        while pieces:
            ring = pieces.pop(0)
            changed = True
            while ring[0] != ring[-1] and changed:
                changed = False
                for i, part in enumerate(pieces):
                    if ring[-1] == part[0]: ring.extend(part[1:])
                    elif ring[-1] == part[-1]: ring.extend(reversed(part[:-1]))
                    elif ring[0] == part[-1]: ring = part[:-1] + ring
                    elif ring[0] == part[0]: ring = list(reversed(part[1:])) + ring
                    else: continue
                    pieces.pop(i); changed = True; break
            if len(ring) >= 4 and ring[0] == ring[-1]: target.append(ring)
    return outer + inner


def inside(point, ring):
    x,z=point;hit=False
    for a,b in zip(ring,ring[1:]):
        if (a[1]>z)!=(b[1]>z) and x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]:hit=not hit
    return hit


def polygon_parts_for(element):
    if element['type']=='way':
        rings=rings_for(element)
        return [rings] if rings else []
    outers=rings_for({**element,'members':[m for m in element.get('members',[]) if m.get('role','outer')=='outer']})
    inners=rings_for({**element,'members':[m for m in element.get('members',[]) if m.get('role')=='inner']})
    return [[outer]+[inner for inner in inners if inside(inner[0],outer)] for outer in outers]


def road_width(tags):
    width = metres(tags.get('width'))
    if width and 1 <= width <= 40: return width
    hw = tags.get('highway')
    if hw in ('footway', 'path', 'steps', 'cycleway'): return 2.2
    if hw == 'pedestrian': return 5
    if hw in ('service', 'living_street'): return 5.5
    lanes = number(tags.get('lanes'))
    return (lanes * 3.25 + 1 if lanes else 9)


def strip(a, b, width):
    dx, dz = b[0]-a[0], b[1]-a[1]
    length = math.hypot(dx, dz)
    if length < .02: return None
    ox, oz = dz / length * width / 2, -dx / length * width / 2
    ring = [[round(a[0]+ox,2),round(a[1]+oz,2)], [round(b[0]+ox,2),round(b[1]+oz,2)],
            [round(b[0]-ox,2),round(b[1]-oz,2)], [round(a[0]-ox,2),round(a[1]-oz,2)]]
    return ring + [ring[0]]


def compile_snapshot(raw, source_bytes):
    data = dict(origin=ORIGIN, buildings=[], surfaces=[], trees=[], routes=[], entrances=[], roads=[])
    elements = raw['elements']
    relation_members = {m['ref'] for e in elements if e['type']=='relation' and e.get('tags',{}).get('building')
                        for m in e.get('members',[]) if m.get('type')=='way'}
    for element in elements:
        tags = element.get('tags', {})
        typ, ident = element['type'], f"osm-{element['type']}-{element['id']}"
        if tags.get('building') and tags['building'] not in ('no', 'construction'):
            if typ == 'way' and element['id'] in relation_members: continue
            parts = polygon_parts_for(element)
            h, hs = height(tags)
            address = ' '.join(filter(None,[tags.get('addr:housenumber'),tags.get('addr:street')]))
            for part_index,rings in enumerate(parts):
                data['buildings'].append(dict(id=ident if len(parts)==1 else f'{ident}-part{part_index}', name=tags.get('name') or tags.get('official_name') or f"Campus context building {element['id']}",
                    rings=rings, height=h, heightSource=hs, address=address))
        if typ == 'node':
            x,z = point(element)
            if tags.get('natural') == 'tree':
                species = tags.get('species') or tags.get('genus') or 'Unspecified source tree'
                evergreen = tags.get('leaf_cycle') == 'evergreen' or bool(re.search('pinus|picea|abies|thuja|tsuga',species,re.I))
                data['trees'].append(dict(id=ident,x=x,z=z,species=species,height=metres(tags.get('height')) or 9,evergreen=evergreen))
            if tags.get('entrance') not in (None,'no'):
                data['entrances'].append(dict(id=ident,x=x,z=z))
            continue
        if typ != 'way': continue
        hw = tags.get('highway')
        if hw and element.get('geometry') and hw not in ('proposed','construction','motorway','motorway_link'):
            points = [point(p) for p in element['geometry']]
            if len(points)<2: continue
            # Preserve source vertices. Out-of-bounds geometry is trimmed at source vertices,
            # never connected across omitted portions and never stitched across gaps.
            runs, run = [], []
            for p,g in zip(points,element['geometry']):
                in_extent = BBOX[0]-.00025 <= g['lat'] <= BBOX[2]+.00025 and BBOX[1]-.00025 <= g['lon'] <= BBOX[3]+.00025
                if in_extent: run.append(p)
                elif run:
                    if len(run)>1:runs.append(run)
                    run=[]
            if len(run)>1:runs.append(run)
            walkable = hw in ('footway','pedestrian','path','steps','living_street') or (hw in ('cycleway','service') and tags.get('foot') in ('yes','designated','permissive'))
            if tags.get('foot') == 'no' or tags.get('access') in ('no','private') or tags.get('indoor') == 'yes':walkable=False
            is_road = hw not in ('footway','pedestrian','path','steps','cycleway','bridleway')
            for n,points in enumerate(runs):
                sid = ident if len(runs)==1 else f'{ident}-part{n}'
                if is_road:data['roads'].append(dict(id=sid,name=tags.get('name',''),points=points))
                if walkable:data['routes'].append(dict(id=sid,points=points,kind=f"OSM {hw}; access {tags.get('access','unspecified')}"))
                w = road_width(tags)
                for i,(a,b) in enumerate(zip(points,points[1:])):
                    ring=strip(a,b,w)
                    if ring:data['surfaces'].append(dict(id=f'{sid}-paving-{i}',kind=('Road' if is_road else 'Pedestrian')+' · source centreline / interpreted width',rings=[ring]))
        if not hw and not tags.get('building'):
            rings = rings_for(element)
            if rings and max(max(abs(v) for p in ring for v in p) for ring in rings)<10000:
                natural,leisure,landuse=tags.get('natural'),tags.get('leisure'),tags.get('landuse')
                kind='Water' if natural=='water' else 'Grass · '+(leisure or landuse or '') if leisure in ('park','pitch','garden','recreation_ground','track') or landuse in ('grass','meadow','recreation_ground','village_green') else None
                if kind:data['surfaces'].append(dict(id=ident,kind=kind,rings=rings))
    for entrance in data['entrances']:
        p=[entrance['x'],entrance['z']]
        best=None;distance=1.5
        for b in data['buildings']:
            ring=b['rings'][0]
            if not min(q[0] for q in ring)-1.5<=p[0]<=max(q[0] for q in ring)+1.5:continue
            if not min(q[1] for q in ring)-1.5<=p[1]<=max(q[1] for q in ring)+1.5:continue
            for a,c in zip(ring,ring[1:]):
                dx,dz=c[0]-a[0],c[1]-a[1]
                t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz or 1)))
                d=math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dz*t)
                if d<distance:best=b['id'];distance=d
        if best:entrance['buildingId']=best
    data['buildings'].sort(key=lambda b:b['id'])
    digest=hashlib.sha256(source_bytes).hexdigest()
    manifest=dict(version=VERSION, campus='Case Western Reserve University · University Circle context',
        retrieved='2026-10-31',origin=ORIGIN,bbox=BBOX, source=dict(name='OpenStreetMap contributors',url=SOURCE_URL,
        requests=raw.get("requests", []),sha256=digest,bytes=len(source_bytes),
        attribution='© OpenStreetMap contributors',license='Open Database License (ODbL) 1.0',licenseUrl='https://www.openstreetmap.org/copyright'),
        projection='Local equirectangular, spherical radius 6371008.8 m; x east, z south. Approximate local geography, not survey-grade coordinates.',
        counts={key:len(value) for key,value in data.items() if key!='origin'},
        limitations=['Flat terrain; no terrain survey.', 'Footprints and path centre lines are OSM volunteer mapping, not university-certified as-built records.',
            'Height tags are unverified; missing heights use tagged floor count × 3.5 m or an explicitly labeled illustrative fallback.',
            'Road/path paving is buffered from actual source centre lines; widths default to representative values when absent.',
            'Only source trees are included; missing tree heights default to 9 m.',
            'Route topology preserves source vertices and excludes explicit no/private/indoor paths. Unknown access is not verified physical permission.',
            'Paths outside the extent are trimmed at source vertices. No disjoint route components are joined.',
            'Names identify buildings, not current occupancy. No people, emails, or residential room assignments are collected.'])
    return data,manifest


def read_xml_tiles(paths):
    """Deduplicate OSM IDs, retain full way nodes, and assemble relation geometry."""
    entities = {}
    receipts = []
    for path in paths:
        content = path.read_bytes()
        root = ET.fromstring(content)
        bound = root.find('bounds')
        box = [float(bound.get(key)) for key in ('minlon','minlat','maxlon','maxlat')]
        receipts.append(dict(url=SOURCE_URL+'?bbox='+','.join(map(str,box)),
            sha256=hashlib.sha256(content).hexdigest(),bytes=len(content),bbox=box))
        for e in root:
            if e.tag in ('node','way','relation'):
                entities[(e.tag,int(e.get('id')))] = e
    nodes={ident:{'lat':float(e.get('lat')),'lon':float(e.get('lon'))}
        for (kind,ident),e in entities.items() if kind=='node'}
    ways={ident:[nodes[int(nd.get('ref'))] for nd in e.findall('nd') if int(nd.get('ref')) in nodes]
        for (kind,ident),e in entities.items() if kind=='way'}
    elements=[]
    for (kind,ident),e in entities.items():
        tags={t.get('k'):t.get('v') for t in e.findall('tag')}
        record=dict(type=kind,id=ident,tags=tags)
        if kind=='node':record.update(nodes[ident])
        if kind=='way':record['geometry']=ways[ident]
        if kind=='relation':
            record['members']=[dict(type=m.get('type'),ref=int(m.get('ref')),role=m.get('role'),
                geometry=ways.get(int(m.get('ref')),[])) for m in e.findall('member')]
        elements.append(record)
    return dict(elements=elements,requests=receipts)


ANCHOR_IDS = {
    'kelvin-smith':'osm-way-108400840', 'tinkham-veale':'osm-relation-13244243',
    'peter-lewis':'osm-way-108349160', 'adelbert':'osm-relation-16162840',
    'amasa-stone':'osm-way-108445644', 'thinkbox':'osm-relation-13212834',
    'strosacker':'osm-way-108526427', 'veale':'osm-way-108481330',
    'clarke':'osm-way-108349147', 'mather-house':'osm-way-108358034',
    'law':'osm-way-108349143', 'nursing':'osm-relation-13244265',
    'medicine':'osm-way-108821912', 'dental':'osm-way-905478624',
    'mandel':'osm-way-108349153', 'disanto':'osm-way-107937221',
    'village':'osm-way-108286405',
    'village-clocktower':'osm-way-108283703',
}


def oriented_bounds(points):
    best=None
    for a,b in zip(points,points[1:]):
        yaw=-math.atan2(b[1]-a[1],b[0]-a[0])
        cs,sn=math.cos(yaw),math.sin(yaw)
        xs=[p[0]*cs-p[1]*sn for p in points];zs=[p[0]*sn+p[1]*cs for p in points]
        w,d=max(xs)-min(xs),max(zs)-min(zs)
        if min(w,d)<.001:continue
        if best is None or w*d<best[0]:
            mx,mz=(max(xs)+min(xs))/2,(max(zs)+min(zs))/2
            best=(w*d,mx*cs+mz*sn,-mx*sn+mz*cs,w,d,yaw)
    return best


def make_anchors(raw,data):
    result={}
    elements={f"osm-{e['type']}-{e['id']}":e for e in raw['elements']}
    for ident,bid in ANCHOR_IDS.items():
        source=elements[bid]
        rings=rings_for(source)
        _,x,z,width,depth,yaw=oriented_bounds(rings[0])
        candidates=[e for e in data['entrances'] if e.get('buildingId')==bid]
        candidates.sort(key=lambda e: (elements.get(e['id'],{}).get('tags',{}).get('entrance')!='main',e['id']))
        source_entry=candidates[0] if candidates else None
        if source_entry:
            p=[source_entry['x']-x,source_entry['z']-z]
            # Rotate the same fitted envelope so its positive-z face matches a mapped door.
            options=[]
            for turn in range(4):
                a=yaw+turn*math.pi/2;w,d=(width,depth) if turn%2==0 else (depth,width)
                lx=p[0]*math.cos(a)-p[1]*math.sin(a);lz=p[0]*math.sin(a)+p[1]*math.cos(a)
                options.append((abs(lz-d/2),a,w,d,lx,lz))
            _,yaw,width,depth,lx,lz=min(options)
            entry=[source_entry['x'],source_entry['z']]
        else:
            # Pick the short-axis front nearest a source pedestrian vertex, without
            # inventing an unverified real entrance coordinate.
            options=[]
            for turn in range(4):
                a=yaw+turn*math.pi/2;w,d=(width,depth) if turn%2==0 else (depth,width)
                entry=[x+math.sin(a)*(d/2+2),z+math.cos(a)*(d/2+2)]
                nearest=min(math.hypot(q[0]-entry[0],q[1]-entry[1]) for route in data['routes'] for q in route['points'])
                options.append((nearest,a,w,d,entry))
            _,yaw,width,depth,entry=min(options)
        anchor=dict(id=ident,x=round(x,2),z=round(z,2),width=round(width,2),depth=round(depth,2),yaw=round(yaw,7),entry=[round(v,2) for v in entry],
            sourceName=source.get('tags',{}).get('name',''),sourceId=bid,verified='2026-10-31',
            provenance='Minimum-area oriented rectangle around OSM footprint. A modelling envelope, not a measured rectangular floor plan.',
            entryProvenance='Mapped OSM entrance node; current accessibility unverified.' if source_entry else 'Interpreted virtual entrance on envelope face nearest a mapped pedestrian vertex. Not a verified physical doorway.')
        if source.get('tags',{}).get('building'):anchor['buildingId']=bid
        if source_entry:anchor['sourceEntranceId']=source_entry['id']
        if ident=='village-clocktower':
            cafe=elements['osm-node-1237543710']
            anchor['landmarkReference']={
                'url':'https://case.edu/housing/facilities/upperclass-buildings/village-house-3a',
                'description':'Official Housing page identifies House 3A as the clock tower building and lists Starbucks on its first floor.',
                'cafeSourceId':'osm-node-1237543710',
                'cafePoint':point(cafe),
                'cafeWgs84':[cafe['lon'],cafe['lat']],
                'placementLimitation':'The clock tower is in the western cafe wing. The OSM cafe point is a location hint, not a surveyed tower center. Tower dimensions, height and offset within this House 3A footprint remain photographic interpretations.',
            }
        result[ident]=anchor
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path,nargs='+')
    parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[3]/'public'/'cwru'/VERSION)
    args=parser.parse_args()
    source_bytes=b'\n'.join(path.read_bytes() for path in args.source)
    digest=hashlib.sha256(source_bytes).hexdigest()
    if PINNED_SHA256 and digest!=PINNED_SHA256:raise SystemExit('Source digest changed; review a new version instead of replacing this snapshot.')
    raw=read_xml_tiles(args.source)
    data,manifest=compile_snapshot(raw,source_bytes)
    anchors=make_anchors(raw,data)
    manifest["anchors"]={"count":len(anchors),"method":"Minimum-area oriented source-footprint rectangles; face orientation follows mapped entrance when available, otherwise nearest source pedestrian vertex.","limitations":"Footprint bounds are not literal architectural rectangles. Interpreted virtual entrances are explicitly labeled per anchor."}
    args.output.mkdir(parents=True,exist_ok=True)
    (args.output/'data.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
    (args.output/'anchors.json').write_text(json.dumps(anchors,indent=2)+'\n')
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps(manifest['counts']))

if __name__=='__main__':main()
