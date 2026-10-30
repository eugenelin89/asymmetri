#!/usr/bin/env python3
"""Bounded V0.3 road surface and validated local graph, derived from immutable V0.2."""
import hashlib
import json
import math
import argparse
from collections import Counter
from pathlib import Path
from shapely import set_precision
from shapely.geometry import Polygon, LineString, Point, box, shape
from shapely.ops import unary_union, nearest_points, transform
from shapely.strtree import STRtree
from build_city import local

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'public/vancouver/v0.2-2026-10-30/city.json'
TARGET = ROOT / 'public/vancouver/v0.3-2026-10-30'

def parts(g, kind):
    if g.is_empty: return []
    if g.geom_type == kind: return [g]
    return [p for child in getattr(g, 'geoms', []) for p in parts(child, kind)]

def coords(line): return [[round(x, 3), round(z, 3)] for x, z in line.coords]
def polygon(p): return [coords(p.exterior), *[coords(r) for r in p.interiors]]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--height-source', type=Path, required=True, help='Pinned bounded building-footprints-2009 API response; see README')
    args = parser.parse_args()
    source = SOURCE.read_bytes()
    digest = hashlib.sha256(source).hexdigest()
    assert digest == '8a25bb435cdea9e0567d18e6ea692af1825c26d6c21b28c66cfae6555be455f5'
    city = json.loads(source)
    height_bytes = args.height_source.read_bytes()
    height_digest = hashlib.sha256(height_bytes).hexdigest()
    assert height_digest == 'b8a7b90b1660e8c147b986586bf58dee6329462bf23af88b51e643006b54334d'
    height_data = json.loads(height_bytes)
    assert height_data['nhits'] == len(height_data['records']) == 915
    records = sorted(height_data['records'], key=lambda r:r['recordid'])
    shapes = [transform(local, shape(r['fields']['geom'])) for r in records]
    tree = STRtree(shapes)
    matched = 0
    for building in city['buildings']:
        footprint = Polygon(building['shape'][0], building['shape'][1:])
        # Do not replace specially modelled landmarks or a stadium with a
        # flat extrusion of its highest 2009 roof point. Never alter footprints.
        if building.get('landmark') or footprint.area > 10000 or footprint.centroid.distance(Point(city['anchors']['science-world'])) < 60: continue
        candidates = []
        for index in tree.query(footprint):
            record = records[index]
            height = record['fields'].get('hgt_agl')
            overlap = footprint.intersection(shapes[index]).area / footprint.union(shapes[index]).area
            if height and 3 <= float(height) <= 150 and overlap >= .8:
                candidates.append((overlap, record['recordid'], float(height)))
        if candidates:
            overlap, record_id, height = max(candidates)
            building.update(height=round(height,2), heightMethod='2009 LiDAR-derived hgt_agl; spatially matched to 2015 footprint', heightSource={'dataset':'building-footprints-2009','recordId':record_id,'intersectionOverUnion':round(overlap,4)})
            matched += 1
    city['sources'].append({'dataset':'building-footprints-2009','url':'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=building-footprints-2009&rows=1000&sort=recordid&geofilter.bbox=49.267%2C-123.123%2C49.278%2C-123.099','sha256':height_digest,'records':915})
    city['heightRefinement'] = {'sourceYear':2009,'field':'hgt_agl','minimumIoU':.8,'matchedBuildings':matched,'illustrativeBuildings':len(city['buildings'])-matched,'notice':'Historic LiDAR-derived roof height above ground, spatially joined to 2015 footprints. Not current building measurements. Remaining heights and landmark models are illustrative.'}
    land = unary_union([Polygon(p[0], p[1:]) for p in city['land']])
    water = unary_union([Polygon(p[0], p[1:]) for p in city['water']])
    structures = unary_union([Polygon(b['shape'][0], b['shape'][1:]) for b in city['buildings']])
    roads = [r for r in city['roads'] if not r['bridge']]
    # Repair only sub-metre digitisation gaps at endpoints, on existing land.
    # No invented streets, water crossings or inferred large connections.
    fixes = []
    for i, road in enumerate(roads):
        others = unary_union([LineString(r['points']) for j, r in enumerate(roads) if i != j])
        for end in [0, -1]:
            p = Point(road['points'][end]); distance = p.distance(others)
            if .001 < distance < .75:
                q = nearest_points(p, others)[1]
                if land.covers(p) and land.covers(q) and not structures.intersects(LineString([p,q])):
                    target = [round(q.x, 3), round(q.y, 3)]
                    fixes.append({'street': road['name'], 'from': road['points'][end], 'to': target, 'metres': round(distance, 3)})
                    road['points'][end] = target
    linework = unary_union([LineString(r['points']) for r in roads])
    lines = parts(linework, 'LineString')
    degree = Counter(tuple(line.coords[i]) for line in lines for i in [0,-1])
    junctions = [Point(p) for p, n in degree.items() if n >= 3]
    # Same visible surface is used for physics. Turning aprons are illustrative,
    # clipped around retained buildings rather than removing building geometry.
    surfaces = [LineString(r['points']).buffer(r['width']/2, quad_segs=6) for r in roads]
    surfaces += [p.buffer(8.5, quad_segs=8) for p in junctions]
    pavement = unary_union(surfaces).intersection(land).difference(structures.buffer(.4))
    pavement = set_precision(pavement, .01)
    sidewalk = pavement.buffer(2.2, quad_segs=4).intersection(land).difference(structures.buffer(.1))
    city['pavement'] = [polygon(p) for p in parts(pavement, 'Polygon')]
    city['sidewalks'] = [polygon(p) for p in parts(sidewalk, 'Polygon')]
    # Small preclipped cells bound polygon work in each 120 Hz physics step.
    cells = {}
    x0,z0,x1,z1 = pavement.bounds
    for x in range(math.floor(x0/64),math.floor(x1/64)+1):
        for z in range(math.floor(z0/64),math.floor(z1/64)+1):
            clipped = pavement.intersection(box(x*64,z*64,(x+1)*64,(z+1)*64))
            ps = [polygon(p) for p in parts(clipped,'Polygon') if p.area > .0001]
            if ps: cells[f'{x},{z}'] = ps
    city['roadCells'] = cells
    # A 2.6 m conservative centre-line clearance encloses the complete car at
    # every heading. Node the lines before clipping so real junctions connect.
    safe = pavement.buffer(-2.6, quad_segs=6)
    valid = []
    for line in lines:
        for part in parts(line.intersection(safe), 'LineString'):
            if part.length > .1: valid.append(part)
    nodes, node_ids, edges = [], {}, []
    def node(p):
        key = tuple(round(v,3) for v in p)
        if key not in node_ids: node_ids[key] = len(nodes); nodes.append(list(key))
        return node_ids[key]
    for line in valid:
        points = coords(line)
        name = min(roads, key=lambda r: LineString(r['points']).distance(line.interpolate(.5,normalized=True)))['name']
        edges.append({'a':node(points[0]),'b':node(points[-1]),'points':points,'length':round(line.length,3),'name':name})
    city['graph'] = {'nodes':nodes,'edges':edges,'clearance':2.6}
    # A local circuit through Village/Hinge and the streets east of Science
    # World. Every leg is later solved and driven in both directions in tests.
    waypoints = [[317,104],[117,169],[115,247],[660,67],[674,-56],[798,-30],[749,371.5],[462.4,363.1],[467,109],[317,104]]
    city['scenicWaypoints'] = [min(range(len(nodes)),key=lambda i:Point(nodes[i]).distance(Point(p))) for p in waypoints]
    city['version'] = 'v0.3-2026-10-30'
    city['navigationRefinement'] = {'parent':'v0.2-2026-10-30','parentSha256':digest,'endpointRepairs':fixes,'junctionAprons':len(junctions),'junctionRadiusM':8.5,'graphNodes':len(nodes),'graphEdges':len(edges),'collisionCellSizeM':64,'bridgeDriving':False}
    city['notice'] = f'2015 building footprints; {matched} heights from spatially matched 2009 LiDAR, remaining heights illustrative. Road widths, turning aprons and waterfront models illustrative. Flat streets; bridges are view-only. Not a current survey or navigation map.'
    assert pavement.intersection(water).area < .1
    assert pavement.intersection(structures).area < .1
    assert len(city['buildings']) == 436
    assert all(safe.buffer(.01).covers(line) for line in valid)
    output = json.dumps(city,separators=(',',':'),ensure_ascii=False).encode()
    manifest = {'version':city['version'],'asset':'city.json','bytes':len(output),'sha256':hashlib.sha256(output).hexdigest(),'sources':city['sources'],'navigationRefinement':city['navigationRefinement'],'heightRefinement':city['heightRefinement'],'attribution':city['attribution'],'licence':city['licence']}
    if (TARGET/'city.json').exists():
        assert (TARGET/'city.json').read_bytes() == output, 'Choose a new immutable version for changed published output'
    TARGET.mkdir(parents=True,exist_ok=True)
    (TARGET/'city.json').write_bytes(output)
    (TARGET/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps({'bytes':len(output),**city['navigationRefinement']}))

if __name__ == '__main__': main()
