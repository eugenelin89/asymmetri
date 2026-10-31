#!/usr/bin/env python3
"""Compile the Stanford OSM snapshot. Python 3 standard library only.

Usage: python3 projects/stanford/tools/compile_geography.py southwest.xml southeast.xml northwest.xml northeast.xml golf.xml boathouse-correct.xml
Raw OSM API responses stay outside Git. This importer never requests person data.
"""
import argparse
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ORIGIN = [-122.17, 37.4275]
BBOX = [37.418, -122.195, 37.444, -122.15]  # south, west, north, east
VERSION = 'v0.1-2026-10-31'
PINNED_SHA256 = '78d3de8ff1df3611591ad9675e129837030ed5dc4cd651ac54e23fc8077eeecf'
SOURCE_URL = 'https://api.openstreetmap.org/api/0.6/map'
SOURCE_BOUNDS = [
    [-122.19,37.418,-122.17,37.431], [-122.17,37.418,-122.15,37.431],
    [-122.19,37.431,-122.17,37.444], [-122.17,37.431,-122.15,37.444],
    [-122.195,37.423,-122.19,37.431], [-122.221,37.502,-122.215,37.508],
]
MAIN_BBOX = BBOX
REMOTE_BBOX = [37.502, -122.221, 37.508, -122.215]
def in_source_extent(lon,lat):
    return any(w-.00025<=lon<=e+.00025 and s-.00025<=lat<=n+.00025 for w,s,e,n in SOURCE_BOUNDS)


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
        if (tags.get('building') and tags['building'] not in ('no', 'construction')) or tags.get('building:part') == 'church':
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
                in_extent = in_source_extent(g['lon'], g['lat'])
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
                kind='Water' if natural=='water' else 'Grass · '+(leisure or landuse or '') if leisure in ('park','pitch','garden','recreation_ground','track','golf_course') or landuse in ('grass','meadow','recreation_ground','village_green') else None
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
    manifest=dict(version=VERSION, campus='Stanford University · main campus and Redwood City boathouse',
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


ANCHOR_IDS = {'memorial-church': 'osm-way-836474103', 'main-quad': 'osm-relation-35820', 'hoover-tower': 'osm-way-232805688', 'green-library': 'osm-way-232805660', 'bing-wing': 'osm-way-232805680', 'cantor': 'osm-relation-12236339', 'anderson': 'osm-way-493811440', 'bing-concert': 'osm-way-205182889', 'memorial-auditorium': 'osm-way-232805722', 'gates': 'osm-way-232841885', 'huang': 'osm-way-81794792', 'packard': 'osm-way-232841933', 'hewlett': 'osm-way-232841892', 'clark': 'osm-way-158630340', 'peterson': 'osm-way-232841924', 'knight': 'osm-way-131641541', 'law': 'osm-way-232805735', 'tresidder': 'osm-way-26252222', 'old-union': 'osm-way-30775809', 'bookstore': 'osm-way-232805686', 'toyon': 'osm-way-160447376', 'branner': 'osm-way-232805657', 'roble': 'osm-way-232805733', 'encina': 'osm-way-232841915', 'maples': 'osm-way-232715640', 'mcmurtry': 'osm-relation-8530450', 'windhover': 'osm-way-518906031', 'dinkelspiel': 'osm-way-232805665', 'mausoleum': 'osm-way-232715721', 'stanford-stadium': 'osm-relation-18564360', 'sunken-diamond': 'osm-way-26250575', 'cobb-track': 'osm-relation-5293506', 'cagan': 'osm-way-442933287', 'avery': 'osm-way-232715573', 'taube': 'osm-way-31712230', 'sand-volleyball': 'osm-way-487928489', 'golf': 'osm-way-28592989', 'frost': 'osm-way-26250717', 'oval': 'osm-way-71183079', 'field-hockey': 'osm-way-26250569', 'softball': 'osm-way-442934843', 'burnham': 'osm-way-232805670', 'ford': 'osm-way-232805671', 'squash': 'osm-way-232805668', 'rowing': 'osm-way-239446599', 'sailing': 'osm-way-239446599', 'maloney': 'osm-way-442933287'}


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


def align_diamond(anchor, data):
    """Align the model diamond to mapped outfield/backstop geometry, not its OBB.

    Plate location is inferred from the chosen model center-field distance. It
    is explicitly not a surveyed plate coordinate. The source polygon remains
    unchanged, as does the renderer's local home z = depth * 0.34 convention.
    """
    parameters = {
        'sunken-diamond': ([988.88, -401.19], [991.9, -541.07], 121.92, 'osm-way-26250575', 'https://gostanford.com/facilities/klein-field-at-sunken-diamond'),
        'softball': ([1134.86, -356.93], [1132.11, -433.36], 67.056, 'osm-way-26250566', 'https://gostanford.com/stanford-softball-stadium-1'),
    }
    if anchor['id'] not in parameters: return anchor
    center_field, backstop, distance, field_id, url = parameters[anchor['id']]
    dx,dz=center_field[0]-backstop[0],center_field[1]-backstop[1]
    length=math.hypot(dx,dz);ux,uz=dx/length,dz/length
    home=[center_field[0]-ux*distance,center_field[1]-uz*distance]
    yaw=math.atan2(-ux,-uz)
    envelope=anchor.get('sourceEnvelope') or {key:anchor[key] for key in ('x','z','width','depth','yaw')}
    home_z=anchor['depth']*.34
    anchor['x']=round(home[0]-math.sin(yaw)*home_z,2)
    anchor['z']=round(home[1]-math.cos(yaw)*home_z,2)
    anchor['yaw']=round(yaw,7)
    target=[home[0]+math.sin(yaw)*36,home[1]+math.cos(yaw)*36]
    anchor['entry']=min((point for route in data['routes'] for point in route['points']),key=lambda point:math.dist(point,target))
    anchor['sourceEnvelope']=envelope
    anchor['homePlate']=[round(n,3) for n in home]
    anchor['centerField']=center_field
    anchor['fieldSourceId']=field_id
    anchor['modelCenterFieldDistance']=distance
    anchor['officialSource']=url
    anchor['provenance']='Model reference frame aligned from mapped backstop toward mapped center-field fence, with home plate inferred using the model center-field distance. The original OSM oriented bounds remain in sourceEnvelope. Neither the inferred plate nor reconstructed fixture coordinates are surveyed.'
    anchor['entryProvenance']='Existing OSM pedestrian vertex nearest the behind-home-plate approach; virtual access and exact admission gate position are interpreted.'
    anchor['fieldAlignmentNote']='Sunken Diamond uses the officially published 400 ft center-field distance. Softball uses the model 220 ft center-field convention against an older mapped pitch; reconstructed 2026 seating extends beyond the older stadium outline. Source polygon bytes are preserved.'
    return anchor


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
        # Model facing follows mapped pedestrian approach. Door nodes remain
        # metadata; exact door position may not match reconstructed entrance.
        options=[]
        for turn in range(4):
            a=yaw+turn*math.pi/2;w,d=(width,depth) if turn%2==0 else (depth,width)
            entry=[x+math.sin(a)*(d/2+2),z+math.cos(a)*(d/2+2)]
            nearest=min(math.hypot(q[0]-entry[0],q[1]-entry[1]) for route in data['routes'] for q in route['points'])
            if ident == 'memorial-church':
                # The church's public facade faces north into the Main Quad.
                nearest = abs(math.atan2(math.sin(a-2.88), math.cos(a-2.88)))
            if ident == 'burnham':
                # Official ADA map 08-200: the entrance wing is south of the main gym.
                nearest = abs(math.atan2(math.sin(a+.263), math.cos(a+.263)))
            options.append((nearest,a,w,d,entry))
        _,yaw,width,depth,entry=min(options)
        anchor=dict(id=ident,x=round(x,2),z=round(z,2),width=round(width,2),depth=round(depth,2),yaw=round(yaw,7),entry=[round(v,2) for v in entry],
            sourceName=source.get('tags',{}).get('name',''),sourceId=bid,verified='2026-10-31',
            provenance='Minimum-area oriented rectangle around OSM footprint. A modelling envelope, not a measured rectangular floor plan.',
            entryProvenance='Interpreted virtual entrance on source envelope face near a mapped pedestrian vertex. Memorial Church faces north into the Main Quad. Not a verified physical doorway.')
        if source.get('tags',{}).get('building') or source.get('tags',{}).get('building:part'):anchor['buildingId']=bid
        if source_entry:
            anchor['sourceEntranceId']=source_entry['id']
            anchor['mappedDoor']=[source_entry['x'],source_entry['z']]
        if ident == 'burnham':
            anchor['connectedBuildingIds']=['osm-way-232805658']
            anchor['officialSource']='https://maps.stanford.edu/ada/building-ada.cfm?FACIL_ID=08-200'
            anchor['sourceIdentityNote']='The main gym uses OSM way 232805670. The connected southern entrance wing is way 232805658; both mapped parts are retained in the source data. Stanford ADA map 08-200 identifies the connected complex and the main entrance from Jane Stanford Way.'
            anchor['entryProvenance']='Interpreted south-facing main-hall entrance aligned toward the connected entrance wing and Jane Stanford Way, supported by Stanford ADA map 08-200. Exact reconstructed doorway position is not surveyed.'
        if ident in ('rowing','sailing'):
            anchor['sourceIdentityNote']='OSM maps this footprint at the photographed Stanford boathouse location but carries an older 100 Cardinal Way address; the current official athletics facility page lists 300 Cardinal Way. Name/identity use the official source; outline uses OSM.'
            anchor['officialSource']='https://gostanford.com/facilities/arrillaga-family-rowing-and-sailing-center'
            anchor['district']='Redwood City waterfront'
            anchor['sharedVenue']='rowing'
        if ident=='maloney':anchor['sharedVenue']='cagan'
        result[ident]=align_diamond(anchor,data)
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path,nargs='+')
    parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[3]/'public'/'stanford'/VERSION)
    args=parser.parse_args()
    source_bytes=b'\n'.join(path.read_bytes() for path in args.source)
    digest=hashlib.sha256(source_bytes).hexdigest()
    if PINNED_SHA256 and digest!=PINNED_SHA256:raise SystemExit('Source digest changed; review a new version instead of replacing this snapshot.')
    raw=read_xml_tiles(args.source)
    data,manifest=compile_snapshot(raw,source_bytes)
    anchors=make_anchors(raw,data)
    manifest["anchors"]={"count":len(anchors),"method":"Minimum-area oriented source-footprint rectangles. Entrance-facing near mapped pedestrian vertex, with Memorial Church aligned to its documented Quad facade. Actual mapped doors retained separately.","limitations":"Footprint bounds are not literal architectural rectangles. Virtual entrances are explicitly interpreted. Shared venues have alias anchors and must be modelled once."}
    manifest["mainCampusBbox"]=MAIN_BBOX
    manifest["remoteVenueBbox"]=REMOTE_BBOX
    manifest["remoteVenue"]={"name":"Arrillaga Family Rowing and Sailing Center", "address":"300 Cardinal Way, Redwood City, CA 94063", "url":"https://gostanford.com/facilities/arrillaga-family-rowing-and-sailing-center", "note":"Off-campus geography remains at its actual coordinates. No route across the unmapped gap is synthesized."}
    manifest["referenceMaps"]=["https://campus-map.stanford.edu/", "https://visit.stanford.edu/pdf/explore-campus/general_campus_self-guided_tour_map.pdf", "https://visit.stanford.edu/pdf/explore-campus/self-guided_tour_-_stanford_athletics_district.pdf"]
    manifest["anchorCorrections"]=[{"id":"burnham","sourceId":"osm-way-232805670","connectedBuildingIds":["osm-way-232805658"],"reference":"https://maps.stanford.edu/ada/pdf/ADAMAP08-200.pdf","note":"Select the main gymnasium as the interior envelope; preserve the smaller south entrance wing as a connected source part. The original source dataset is unchanged."}]
    manifest['anchorCorrections'].extend([
        {'id':'sunken-diamond','fieldSourceId':'osm-way-26250575','method':'Align the model to mapped backstop and center-field fence; infer home plate from the official 400 ft center-field distance. Preserve source OBB in sourceEnvelope.'},
        {'id':'softball','fieldSourceId':'osm-way-26250566','method':'Align the model to mapped pitch backstop and center-field fence using the model 220 ft convention. Older source footprint is not a verified 2026 as-built seating plan.'},
    ])
    args.output.mkdir(parents=True,exist_ok=True)
    (args.output/'data.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
    (args.output/'anchors.json').write_text(json.dumps(anchors,indent=2)+'\n')
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps(manifest['counts']))

if __name__=='__main__':main()
