#!/usr/bin/env python3
"""Derive V0.2 from the immutable V0.1 snapshot; no additional downloads."""
import hashlib
import json
from pathlib import Path
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
from shapely import set_precision

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'public/vancouver/v0.1-2026-10-30/city.json'
TARGET = ROOT / 'public/vancouver/v0.2-2026-10-30'

def parts(g):
    if g.is_empty: return []
    if g.geom_type == 'Polygon': return [g]
    return [p for child in getattr(g, 'geoms', []) for p in parts(child)]

def coordinates(p):
    return [[[round(x, 1), round(z, 1)] for x, z in ring.coords] for ring in [p.exterior, *p.interiors]]

def main():
    original = SOURCE.read_bytes()
    assert hashlib.sha256(original).hexdigest() == 'ebc0faf88bbd59d58f64436d1c1194059ce6fda378f9cc53bd4249f1b0566c4b', 'Published V0.1 input changed'
    city = json.loads(original)
    land = unary_union([Polygon(p[0], p[1:]) for p in city['land']])
    water = unary_union([Polygon(p[0], p[1:]) for p in city['water']])
    streets, footways = [], []
    for road in city['roads']:
        road['bridge'] = road['bridge'] or 'VIADUCT' in road['name']
        if road['bridge']: continue
        line = LineString(road['points'])
        # Widths remain illustrative. A coherent two-lane local street and clear
        # footways replace V0.1's very narrow ribbons; geographic centres persist.
        road['width'] = 14 if road['width'] == 12 else 10
        streets.append(line.buffer(road['width'] / 2, quad_segs=3))
        footways.append(line.buffer(road['width'] / 2 + 2.2, quad_segs=3))
    pavement = set_precision(unary_union(streets).intersection(land), 0.1)
    sidewalk = set_precision(unary_union(footways).intersection(land), 0.1)
    # Buffer in full precision before snapping the result. Carrying GEOS's fixed
    # grid into the buffer/difference operation can collapse narrow components.
    clearance = set_precision(sidewalk, 0).buffer(0.2)
    changed, removed_area, buildings = 0, 0, []
    for building in city['buildings']:
        shape = Polygon(building['shape'][0], building['shape'][1:])
        clean = set_precision(shape.difference(clearance), 0.1)
        loss = max(0, shape.area - clean.area)
        if loss > 1: changed += 1
        removed_area += loss
        for i, part in enumerate(parts(clean)):
            if part.area < 18: continue
            landmark = 'creekside' if part.covers(Point(city['anchors']['creekside'])) else None
            buildings.append({**building, 'height': 9 if landmark else building['height'], 'landmark': landmark, 'id': building['id'] + (f'-{i}' if i else ''), 'shape': coordinates(part), 'footprintMethod': '2015 footprint with illustrative street-clearance trim'})
    city['version'] = 'v0.2-2026-10-30'
    city['buildings'] = buildings
    city['pavement'] = [coordinates(p) for p in parts(pavement)]
    city['sidewalks'] = [coordinates(p) for p in parts(sidewalk)]
    # A derived visual promenade follows the same dated coast; it is explicitly
    # not a surveyed path network and never expands the drivable surface.
    coast = land.boundary.intersection(water.boundary)
    promenade = coast.buffer(4, quad_segs=2).intersection(land).difference(pavement)
    city['promenade'] = [coordinates(p) for p in parts(promenade)]
    city['refinement'] = {'parent': 'v0.1-2026-10-30', 'parentSha256': hashlib.sha256(original).hexdigest(), 'trimmedBuildings': changed, 'trimmedAreaM2': round(removed_area, 1), 'streetWidthMethod': 'illustrative 10m local / 14m arterial; 2.2m footways', 'bridgeDriving': False}
    city['notice'] = '2015 footprints trimmed for illustrative road clearance; illustrative heights and street widths. Flat terrain; simplified 2002 shoreline and artistic promenade. Not a current survey or navigation map.'
    output = json.dumps(city, separators=(',', ':'), ensure_ascii=False).encode()
    manifest = {'version': city['version'], 'asset': 'city.json', 'bytes': len(output), 'sha256': hashlib.sha256(output).hexdigest(), 'sources': city['sources'], 'refinement': city['refinement'], 'attribution': city['attribution'], 'licence': city['licence']}
    # Offline acceptance: the complete rendered carriageway stays clear of all
    # retained building geometry, with water still excluded from ground streets.
    structures = unary_union([Polygon(b['shape'][0], b['shape'][1:]) for b in buildings])
    assert structures.intersection(pavement).area < 0.5
    assert len(buildings) >= len(json.loads(original)['buildings']) * 0.98
    assert removed_area < 4000, 'Unexpectedly large footprint loss; inspect precision/topology'
    assert pavement.intersection(water).area < 0.5
    if (TARGET / 'city.json').exists():
        assert (TARGET / 'city.json').read_bytes() == output, 'Choose a new version before changing published geometry'
    TARGET.mkdir(parents=True, exist_ok=True)
    (TARGET / 'city.json').write_bytes(output)
    (TARGET / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'bytes': len(output), 'buildings': len(buildings), **city['refinement']}))

if __name__ == '__main__': main()
