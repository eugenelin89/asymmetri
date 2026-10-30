#!/usr/bin/env python3
"""Bounded V0.6 Cambie research extraction. No runtime API or public city change.

Install requirements-elevation.txt in an external virtualenv. Supply the pinned
raw files in --cache; --output must be new (or already contain identical bytes).
Raster DSM heights are surface observations, not a classified bridge survey.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
import rasterio
from pyproj import Transformer
from shapely.geometry import LineString, shape
from shapely.ops import transform

FILES = {
    'cambie-streets.json': '20dbdbfa5e2a33e7c6fa76e621f03df6c175b495ddef2ad6d5bea1e99d4de5ff',
    'bc_092g025_3_4_2_xli1m_utm10_20250826_20250826_dsm.tif': '1e10610fa234b1de255c963ad889ecb318ce1c77452aa47be9d7d5beeb8e78da',
    'bc_092g025_3_2_4_xli1m_utm10_20250826_20250826_dsm.tif': '179eda72df32e84790ed15e7eb89f5972a95832ac747506369c45bda9da8fbfe',
    'bc_092g025_3_2_4_xli1m_utm10_20250826_20250826.tif': 'd4c67a4dfc62fc58f222d8d8a109d3a76c5124dad4903165b8c05109172a4c6c',
    'bc_092g025_3_4_2_xli1m_utm10_20250826_20250826.tif': '855f5202e7f961054f4ba09d4b5dc34624cc507e315baa7c549ad80f1bf39c87',
}
# Only this reviewed corridor is connected. XY intersections never add edges.
SECTIONS = [
    ('north-ground', 'c6f6f0914561a25c6c0fa744d83c8b76ee4efb48', True, 8, 'ground'),
    ('north-approach', '24b3f4bc76a56d3dbbb14a1934f0f4088f0a5638', False, 8, 'ramp'),
    ('main-deck', 'f86168a1019d468a1ced81a84944230e3e96d776', False, 12, 'deck'),
    ('south-approach', 'b4442aed8b63ce674aaa2a7243c89f16a0de3b0f', False, 10, 'ramp'),
    ('south-landing', '959e941e2db30b382f0eba9f901b26b42e3d100a', False, 10, 'ramp'),
    ('south-ground', 'bf25e5b63b0b02228e58afdf989341a800d4e1cc', False, 10, 'ground'),
    ('marinaside-underpass', 'c9eb2a6aeb57a1f9f979e780876aca89df67c06c', False, 8, 'ground'),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    for name, digest in FILES.items():
        assert hashlib.sha256((args.cache / name).read_bytes()).hexdigest() == digest, name
    project = Transformer.from_crs('EPSG:4326', 'EPSG:3157', always_xy=True)
    ox, oy = project.transform(-123.111, 49.2725)
    rows = json.loads((args.cache / 'cambie-streets.json').read_text())['records']
    records = {r['recordid']: r['fields'] for r in rows}
    rasters = {kind: [rasterio.open(args.cache / n) for n in sorted(FILES) if n.endswith(suffix)]
               for kind, suffix in [('dsm', '_dsm.tif'), ('dem', '20250826.tif')]}
    assert all(ds.crs.to_epsg() == 6653 for group in rasters.values() for ds in group)

    def height(x, y, kind):
        for ds in rasters[kind]:
            if ds.bounds.left <= x < ds.bounds.right and ds.bounds.bottom <= y < ds.bounds.top:
                value = float(next(ds.sample([(x, y)]))[0])
                if value != ds.nodata:
                    return value
        return None

    surfaces, diagnostics = [], []
    for index, (sid, rid, reverse, width, role) in enumerate(SECTIONS):
        line = transform(project.transform, shape(records[rid]['geom']))
        if reverse:
            line = LineString(list(line.coords)[::-1])
        # Stations include every original bend, so resampling cannot cut corners.
        stations = set(float(s) for s in np.linspace(0, line.length, math.ceil(line.length / 5) + 1))
        distance = 0
        for a, b in zip(list(line.coords), list(line.coords)[1:]):
            distance += math.dist(a, b)
            stations.add(min(distance, line.length))
        stations = sorted(stations)
        # Coalesce near-duplicate stations while preserving both endpoints.
        keep = [stations[0]]
        for s in stations[1:-1]:
            if s - keep[-1] > .5 and line.length - s > .5:
                keep.append(s)
        stations = keep + [line.length]
        raw, terrain, spreads, positions = [], [], [], []
        kind = 'dem' if sid == 'marinaside-underpass' else 'dsm'
        for s in stations:
            p = line.interpolate(s)
            a, b = line.interpolate(max(0, s - 1)), line.interpolate(min(line.length, s + 1))
            dx, dy = b.x - a.x, b.y - a.y
            length = math.hypot(dx, dy)
            values = [height(p.x + dx / length * along - dy / length * across,
                             p.y + dy / length * along + dx / length * across, kind)
                      for along in [-1, 0, 1] for across in [-2, -1, 0, 1, 2]]
            values = [v for v in values if v is not None]
            assert len(values) >= 12, (sid, s, 'insufficient samples')
            # Lower quartile reduces car/barrier contamination. It is an inferred
            # road-height estimator; retain its raw spread and ground comparison.
            raw.append(float(np.quantile(values, .25)))
            spreads.append(float(np.quantile(values, .75) - np.quantile(values, .25)))
            terrain.append(height(p.x, p.y, 'dem'))
            positions.append((p.x, p.y))
        smooth = [float(np.median(raw[max(0, i-2):min(len(raw), i+3)])) for i in range(len(raw))]
        # Shared endpoint samples are identical in XY; pin them to one common
        # five-pixel median independently of section direction/cross-section.
        for i in [0, len(raw)-1]:
            x, y = positions[i]
            smooth[i] = float(np.median([v for dx, dy in [(0,0),(-1,0),(1,0),(0,-1),(0,1)]
                                        if (v := height(x+dx, y+dy, kind)) is not None]))
        points = [{'x': round(x-ox, 3), 'z': round(oy-y, 3), 'y': round(h, 3)} for (x, y), h in zip(positions, smooth)]
        prefix = 'u' if sid == 'marinaside-underpass' else 'c'
        start, end = (prefix+'0', prefix+'1') if prefix == 'u' else ('c'+str(index), 'c'+str(index+1))
        surfaces.append({'id': sid, 'start': start, 'end': end, 'width': width, 'role': role,
                         'from': points[0], 'to': points[-1], 'profile': points})
        diagnostics.append({'id': sid, 'sourceRecord': rid, 'sourceName': records[rid]['hblock'],
                            'lengthM': round(line.length, 3), 'heightMethod': kind,
                            'stationsM': [round(s, 3) for s in stations],
                            'rawQuartileM': [round(h, 3) for h in raw],
                            'interquartileSpreadM': [round(v, 3) for v in spreads],
                            'terrainM': [round(v, 3) if v is not None else None for v in terrain]})
    city_bytes = (Path(__file__).resolve().parents[3] / 'public/vancouver/v0.4-2026-10-30/city.json').read_bytes()
    city_hash = hashlib.sha256(city_bytes).hexdigest()
    assert city_hash == '23e80e2e65de63f960d9bd8d00931c9d7f6761fc6fb25bfe47db0df31941d1fa'
    city = json.loads(city_bytes)
    old_origin = Transformer.from_crs(4326, 32610, always_xy=True).transform(*city['origin'])
    reproject = Transformer.from_crs(32610, 3157, always_xy=True)
    def local_water(p):
        east, north = reproject.transform(old_origin[0]+p[0], old_origin[1]-p[1])
        return [round(east-ox, 3), round(oy-north, 3)]
    result = {
        'version': 'cambie-research-v0.6-2026-10-30', 'publicDriving': False,
        'retrievedAt': '2026-10-30', 'lidarAcquiredAt': '2025-08-26',
        'horizontalCrs': 'EPSG:3157 NAD83(CSRS) / UTM zone 10N',
        'verticalCrs': 'EPSG:6647 CGVD2013(CGG2013) height, metres',
        'originLonLat': [-123.111, 49.2725], 'originUTM': [ox, oy],
        'localAxes': 'x=easting-originE; z=originN-northing; y=absolute CGVD2013 height',
        'horizontalTransformation': 'EPSG:4326 to EPSG:3157, PROJ inverse NAD83(CSRS) to WGS84 (2), stated 1 m accuracy; no survey epoch correction',
        'notice': 'Isolated research candidate. City plan alignment plus 2025 1 m DSM/DEM-derived height estimates. Widths are conservative test corridors, not surveyed road edges. No bank/crossfall or traffic-direction model. Underpass uses interpolated bare-earth DEM. No public city connection.',
        'attribution': ['Contains information licensed under the Open Government Licence – British Columbia.', 'Contains information licensed under the Open Government Licence – Vancouver.'],
        'sourceHashes': FILES, 'surfaces': surfaces, 'diagnostics': diagnostics,
        'water': [[list(map(local_water, ring)) for ring in polygon] for polygon in city['water']],
        'waterSource': {'snapshot': 'v0.4-2026-10-30', 'sha256': city_hash,
                        'notice': 'Retained simplified 2002 shoreline plus park polygons; reprojected horizontally. Display water at datum zero is a visual reference, not measured tide or water elevation.'},
    }
    output = (json.dumps(result, separators=(',', ':'), ensure_ascii=False)+'\n').encode()
    if args.output.exists():
        assert args.output.read_bytes() == output, 'Refusing to overwrite a different research snapshot'
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_bytes(output)
    for group in rasters.values():
        for ds in group:
            ds.close()
    print(json.dumps({'bytes': len(output), 'sha256': hashlib.sha256(output).hexdigest(),
                      'surfaces': len(surfaces), 'lengthsM': {d['id']: d['lengthM'] for d in diagnostics}}))


if __name__ == '__main__':
    main()
