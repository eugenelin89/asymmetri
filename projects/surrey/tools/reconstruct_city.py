"""V0.3 offline reconstruction. Python 3 + Shapely 2.0.7; never edits V0.1.

Run with --cache pointing to retained source receipts. Missing inputs are fetched
from the exact bounded URLs below; published hashes reject changed source bytes.
"""
import argparse
import datetime
import hashlib
import json
import math
import pathlib
import statistics
import urllib.parse
import urllib.request
from shapely import make_valid, set_precision
from shapely.geometry import Point, LineString, MultiLineString, shape, box
from shapely.ops import transform, unary_union
from build_city import ROOT, BBOX, ORIGIN, BASE, project, parts, polygon, line

VERSION = 'v0.3-2026-10-30'
PREVIOUS = 'v0.1-2026-10-30'
HOSTED = 'https://services5.arcgis.com/YRpe0VKTJytZSSIB/arcgis/rest/services/'
LICENCE = 'https://opendata-surrey.hub.arcgis.com/pages/55089a19491a4fe59a41e059fd8af708'

def query(url, sr=4326, format='geojson'):
    return url + '/query?' + urllib.parse.urlencode(dict(f=format, where='1=1', geometry=','.join(map(str, BBOX)), geometryType='esriGeometryEnvelope', inSR=4326, spatialRel='esriSpatialRelIntersects', outFields='*', outSR=sr, returnGeometry='true', resultRecordCount=2000))

INPUTS = {
    'road-surfaces': (query(BASE+'113'), 128),
    'curbs': (query(BASE+'123'), 729),
    'medians': (query(BASE+'124'), 98),
    'paths': (query(HOSTED+'Trails%20and%20Paths/FeatureServer/0', format='json'), 262),
    'hosted-buildings': (query(HOSTED+'Building%20Footprnts/FeatureServer/0'), 799),
    'hosted-native': (query(HOSTED+'Building%20Footprnts/FeatureServer/0', 26910, 'json'), 799),
    'official-native': (query(BASE+'155', 26910, 'json'), 797),
    'height-metadata': (BASE+'155?f=json', None),
    'dem-metadata': (BASE+'324?f=json', None),
    'paths-metadata': (BASE+'314?f=json', None),
    'licence': ('https://www.arcgis.com/sharing/rest/content/items/55089a19491a4fe59a41e059fd8af708/data?f=json', None),
}

def digest(data): return hashlib.sha256(data).hexdigest()

def build(cache):
    cache.mkdir(parents=True, exist_ok=True)
    output = ROOT/'public'/'surrey'/VERSION
    previous = ROOT/'public'/'surrey'/PREVIOUS
    inherited_bytes = (previous/'city.json').read_bytes()
    inherited_manifest = json.loads((previous/'manifest.json').read_bytes())
    assert digest(inherited_bytes) == inherited_manifest['sha256'], 'V0.1 checksum changed'
    city = json.loads(inherited_bytes)
    pinned = json.loads((output/'manifest.json').read_bytes()) if (output/'manifest.json').exists() else None
    pinned_sources = {s['name']: s for s in pinned['sources']} if pinned else {}
    receipts = []; raw = {}
    for name, (url, expected) in INPUTS.items():
        path = cache/(name+'.json')
        if not path.exists():
            request = urllib.request.Request(url, headers={'User-Agent': 'Surrey-City-Reconstruction/0.3'})
            path.write_bytes(urllib.request.urlopen(request, timeout=90).read())
        data = path.read_bytes(); value = json.loads(data)
        if value.get('error') or value.get('exceededTransferLimit') or (expected is not None and len(value.get('features', [])) != expected):
            raise ValueError((name, 'Failed, changed or truncated bounded source; review a new version.'))
        if name in pinned_sources and digest(data) != pinned_sources[name]['sha256']:
            raise ValueError((name, 'Source checksum changed; use the retained raw receipt or a new version.'))
        raw[name] = value
        receipts.append(pinned_sources.get(name) or dict(name=name, request=url, retrieved=datetime.datetime.fromtimestamp(path.stat().st_mtime, datetime.timezone.utc).isoformat(), sha256=digest(data), bytes=len(data), features=expected, licence=LICENCE))
    aliases = {f['name']: f.get('alias', '') for f in raw['height-metadata']['fields']}
    assert '(m)' in aliases['BUILDING_HEIGHT'] and '(m)' in aliases['GROUND_ELEVATION'], 'Height units require renewed verification'
    extent = box(*city['bounds'])
    def geom(f): return make_valid(transform(project, shape(f['geometry']))).intersection(extent)
    def polygon_union(values): return unary_union([shape({'type': 'Polygon', 'coordinates': p}) for p in values])
    def polygons(g):
        # Topology-preserving snap rounding must happen before serialization.
        # Repair-then-round can reintroduce self-intersections at narrow slivers.
        result = [polygon(p) for p in parts(set_precision(make_valid(g), .01), 'Polygon') if p.area > .02]
        assert all(shape({'type':'Polygon', 'coordinates':p}).is_valid for p in result)
        return result
    structures = polygon_union([b['shape'] for b in city['buildings']])
    current = {str(f['properties']['OBJECTID']): f['properties'] for f in raw['hosted-buildings']['features']}
    hosted = {f['attributes']['FACILITYID']: f for f in raw['hosted-native']['features']}
    official = {f['attributes']['FACILITYID']: f for f in raw['official-native']['features']}
    height_counts = {'verified-measured': 0, 'derived-spatial-match': 0, 'illustrative-estimate': 0}
    for b in city['buildings']:
        p = current[b['id']]; facility = p['FACILITYID']; match = official.get(facility)
        positive = isinstance(p['BUILDING_HEIGHT'], (float, int)) and 0 < p['BUILDING_HEIGHT'] < 250
        residual = None
        if match and hosted[facility].get('geometry') and match.get('geometry'):
            residual = MultiLineString(hosted[facility]['geometry']['rings']).hausdorff_distance(MultiLineString(match['geometry']['rings']))
        matched = positive and match and residual is not None and residual < .2 and abs(p['BUILDING_HEIGHT'] - match['attributes']['BUILDING_HEIGHT']) < .005
        classification = 'derived-spatial-match' if matched else 'illustrative-estimate'
        b.update(height=round(p['BUILDING_HEIGHT'], 2) if positive else 9, baseElevation=0, heightMethod=classification, facilityId=facility,
                 heightProvenance=dict(source='hosted-buildings', officialSource='official-native' if match else None, officialId=match['attributes']['OBJECTID'] if match else None, sourceValue=p['BUILDING_HEIGHT'], unit='m', unitVerified=True, surveyDate=None, measurementMethod=None, nativeMatchResidualM=round(residual, 7) if residual is not None else None))
        height_counts[classification] += 1
    source_surfaces = unary_union([geom(f) for f in raw['road-surfaces']['features']]).difference(structures)
    medians = unary_union([geom(f) for f in raw['medians']['features'] if f['properties']['STATUS'] == 'In Service']).difference(structures)
    curb_lines = [p.simplify(.2) for f in raw['curbs']['features'] if f['properties']['STATUS'] == 'In Service' for p in parts(geom(f), 'LineString')]
    # Median curbs are not outer road edges. Probe both sides, away from junctions.
    curb_union = unary_union(curb_lines).difference(medians.buffer(1.5))
    corridors = []; derived_count = 0; centreline_count = 0
    source_interior = source_surfaces.buffer(-.1)
    for road in city['roads']:
        center = LineString(road['points']); widths = []
        for d in range(12, int(center.length)-12, 12):
            p = center.interpolate(d); a = center.interpolate(d-3); b = center.interpolate(d+3)
            length = a.distance(b)
            if length < .1: continue
            nx, nz = -(b.y-a.y)/length, (b.x-a.x)/length
            sides = []
            for sign in [-1, 1]:
                ray = LineString([(p.x+nx*sign*3, p.y+nz*sign*3), (p.x+nx*sign*25, p.y+nz*sign*25)])
                hits = [p.distance(q) for q in parts(ray.intersection(curb_union), 'Point') if 3 <= p.distance(q) <= 25]
                if hits: sides.append(min(hits))
            if len(sides) == 2 and max(sides)/min(sides) < 2.2: widths.append(sum(sides))
        if len(widths) >= 3:
            road['width'] = round(max(7, min(36, statistics.median(widths))), 2)
            road['widthMethod'] = 'derived-paired-curbs'; derived_count += 1
        else:
            road['widthMethod'] = 'inferred-lane-count'; centreline_count += 1
        # Retain surveyed polygons wherever they cover a centreline; bridge only uncovered reaches.
        uncovered = center.difference(source_interior)
        corridors.append(uncovered.buffer(road['width']/2, quad_segs=4))
    pavement = unary_union([source_surfaces, *corridors]).intersection(extent).difference(structures).difference(medians)
    paths = []; path_lines = []
    for f in raw['paths']['features']:
        prop = f['attributes']
        if prop['STATUS'] != 'In Service': continue
        width = prop['WIDTH'] or 2
        for coordinates in f['geometry']['paths']:
            g = transform(project, LineString(coordinates)).intersection(extent).simplify(.2)
            for p in parts(g, 'LineString'):
                path_lines.append(dict(id=prop['FACILITYID'], points=line(p), width=width, widthMethod='source-width' if prop['WIDTH'] else 'illustrative-2m', material=prop['MATERIAL']))
                paths.append(p.buffer(max(1, min(3, width/2)), quad_segs=3))
    sidewalks = unary_union([polygon_union(city['sidewalks']), *paths]).difference(structures).difference(pavement).difference(medians)
    # Crossing stripes are signal/road-derived, clipped to asphalt, never survey claims.
    crossings = []; markings = []; centerlines = [LineString(r['points']) for r in city['roads']]
    crossing_surface = pavement.buffer(-.12)
    for p in city['signals']:
        point = Point(p); idx = min(range(len(centerlines)), key=lambda i: centerlines[i].distance(point)); center = centerlines[idx]
        if center.distance(point) > 35: continue
        d = center.project(point); c = center.interpolate(d); a = center.interpolate(max(0, d-3)); b = center.interpolate(min(center.length, d+3)); length = a.distance(b)
        if length < .1: continue
        dx, dz = (b.x-a.x)/length, (b.y-a.y)/length; width = city['roads'][idx]['width']
        for offset in range(-int(width/2), int(width/2)+1, 2):
            x, z = c.x-dz*offset, c.y+dx*offset
            stripe = LineString([(x-dx*1.6,z-dz*1.6),(x+dx*1.6,z+dz*1.6)]).buffer(.45, cap_style=2)
            crossings.append(stripe.intersection(crossing_surface))
    crossing_union = unary_union(crossings)
    marking_surface = pavement.buffer(-1); crossing_exclusion = crossing_union.buffer(2)
    for center in centerlines:
        for d in range(6, int(center.length)-4, 12):
            a, b = center.interpolate(d), center.interpolate(d+4)
            markings.append(LineString([a,b]).buffer(.07, cap_style=2).intersection(marking_surface).difference(crossing_exclusion))
    # Explicit flat fallback: do not turn unverified absolute ground fields into terrain.
    city.update(version=VERSION, pavement=polygons(pavement), sidewalks=polygons(sidewalks), medians=polygons(medians),
                curbs=[line(p) for p in curb_lines], paths=path_lines, crossings=polygons(crossing_union), markings=polygons(unary_union(markings)),
                terrain=dict(kind='flat', elevation=0, verticalDatum=None, reason='2025 DEM vertical datum unverified; no invented surveyed elevations.'),
                plazas=polygons(polygon_union(city['plazas']).difference(pavement).difference(sidewalks).difference(medians)),
                roadSurfaceSources=[dict(id=f['properties']['OBJECTID'], accessibility=f['properties']['ACCESSIBILITY'], roadClass=f['properties']['ROAD_CLASS']) for f in raw['road-surfaces']['features']])
    # Walkable terrain and story anchors deliberately retain V0.1 geometry byte-for-byte.
    # Surface decoration changes no barriers or public-access claims.
    coverage = []
    for center in centerlines:
        expected = center.difference(structures).difference(medians)
        if expected.length: coverage.append(expected.intersection(pavement.buffer(.03)).length / expected.length)
    qa = dict(buildings=len(city['buildings']), heightClasses=height_counts, sourceRoadFeatures=128, activeCurbFeatures=660, activeMedianFeatures=92,
              curbDerivedRoads=derived_count, laneInferredRoads=centreline_count, pathFeatures=len(raw['paths']['features']),
              minimumCenterlineCoverage=round(min(coverage), 8), asphaltAreaM2=round(pavement.area, 2), actualSurfaceAreaM2=round(source_surfaces.area, 2),
              actualSurfaceRetainedFraction=round(source_surfaces.difference(medians).intersection(pavement).area/max(1, source_surfaces.difference(medians).area), 8),
              intersectionUnionValid=pavement.is_valid, sidewalkAsphaltOverlapM2=round(sidewalks.intersection(pavement).area, 6), medianAsphaltOverlapM2=round(medians.intersection(pavement).area, 6),
              legacyFootprintsUnchanged=all(a['shape']==b['shape'] for a,b in zip(city['buildings'],json.loads(inherited_bytes)['buildings'])))
    assert qa['minimumCenterlineCoverage'] > .9999 and qa['actualSurfaceRetainedFraction'] > .9999 and qa['intersectionUnionValid'], qa
    assert qa['sidewalkAsphaltOverlapM2'] < .001 and qa['medianAsphaltOverlapM2'] < .001
    output.mkdir(parents=True, exist_ok=True)
    data = json.dumps(city, separators=(',',':')).encode()+b'\n'
    target = output/'city.json'
    if target.exists() and target.read_bytes() != data: raise ValueError('Immutable snapshot differs: choose a new version before replacing published data.')
    target.write_bytes(data)
    manifest = dict(version=VERSION, retrieved='2026-10-30', bbox=BBOX, origin=ORIGIN, bytes=len(data), sha256=digest(data), licence=LICENCE,
                    attribution='Contains information licensed under the Open Government License – City of Surrey.',
                    inheritedSnapshot=dict(version=PREVIOUS, sha256=digest(inherited_bytes), manifestSha256=digest((previous/'manifest.json').read_bytes()), retained='Footprints, anchors, collision cells, centreline paths, parks, rail and signals.'),
                    sources=receipts, inheritedSources=inherited_manifest['sources'],
                    projection=dict(runtime='Local equirectangular metres: x east, z south; 111320 m/degree; longitude scaled by cos(49.1895°).', inputs='WGS84 EPSG:4326 server output for rendered layers; EPSG:26910 native coordinates for height geometry matching.', tolerance='Existing V0.1 frame retained for save/navigation compatibility. ArcGIS hosted/OpenData default WGS84 transformations differ by about 1.283 m. Native matching avoids that offset; rendered mixed-service features retain that documented alignment uncertainty. Not survey-grade.'),
                    heights=dict(classifications=height_counts, unit='m', unitVerification=BASE+'155?f=json', method='FACILITYID join, native EPSG:26910 boundary residual <0.2m and height difference <0.005m. No top-height clamp.', acquisitionDate=None, measurementMethod=None, hostedDataLastEditDate='2026-10-01T15:07:07.608Z', architecturalSubdivisions='Illustrative; combined podium/tower footprints are not uniform extrusions.'),
                    terrain=dict(status='flat-fallback', horizontalCRS='EPSG:26910', candidateResolutionM=.5, verticalDatum=None, verticalUnits='Metres verified in 2025 LAS header; no vertical units/datum GeoKey in DEM TIFF.', acquisition='April 2025 according to official contour item b810ad1573324d7f92bed23ec05dca9a; DEM labelled 2025.', coverage='Fixed bbox intersects NW download quadrant; valid-data footprint not proven from header alone.', url='https://cosmos.surrey.ca/geo_ref/ArcView/Data/Remote_Sensing/Lidar/2025/DerivedProducts/BareEarth/BareEarth_Quadrants/ELEVATION_GRID_2025_NW.ZIP', archiveBytes=2377130919, reason='Datum unverified; whole DEM not downloaded. No terrain imported from contours or colour images.'),
                    processing=['Inherited buildings simplified 0.4m, road lines 0.25m; new curb/path lines 0.2m; coordinates quantized to 0.01m.', 'Actual road polygons unioned with uncovered centreline corridors. Paired active curb probes constrain width where supported; lane-count fallback otherwise. Union intersections before triangulation, subtract active medians/buildings, preserve holes.', 'Only In Service curbs, medians and paths; proposed/history assets excluded. Sidewalk lines retain inherited minimum 3m gameplay width; paths use source WIDTH or explicit 2m fallback. Sidewalk/asphalt interiors are disjoint.', 'Signals and nearest road direction derive illustrative crosswalk stripes; all lane/crossing paint clipped to asphalt. No authoritative stripe layer found.', 'Unchanged arcade walkability outside buffered footprints. Decorative curbs/furniture are not invisible colliders. Closed-to-Traffic source pavement does not establish legal public access.'],
                    limitations=['No verified measured building heights: units verified, measurement method, accuracy, roof statistic and survey date unknown.', 'Road source classifications contain no arterial/collector labels; uncovered reaches retain derived or inferred corridors. Reconstructed widths and intersections remain derived.', 'No surveyed curb heights, facade dimensions, material, construction status or legal access guarantee. Original procedural architecture is artistic.', 'Flat ground; source GROUND_ELEVATION is not used as a verified terrain datum.'], qa=qa)
    (output/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
    print(json.dumps(dict(bytes=len(data), sha256=digest(data), qa=qa), indent=2))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--cache', type=pathlib.Path, required=True)
    build(parser.parse_args().cache)
