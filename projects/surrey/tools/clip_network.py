"""Restrict a provisional road mask to the accepted source corridors/intersections.
JSON in/out over stdin/stdout; no network or versioned-file mutation.
"""
import json, math, sys
from pathlib import Path
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
from shapely import set_precision
value=json.load(sys.stdin)
city=json.loads((Path(__file__).resolve().parents[3]/'public/surrey/v0.3-2026-10-30/city.json').read_bytes())
mask=unary_union([Polygon(p[0],p[1:]) for p in value['driveSurface']])
corridors=[LineString(city['roads'][e['sourceIndex']]['points']).buffer(city['roads'][e['sourceIndex']]['width']/2) for e in value['edges']]
# A source junction neighbourhood preserves supported corner apron. It never
# adds ground: intersect with the strict pavement/curb/median/building mask.
corridors += [Point(n['sourcePoint']).buffer(18) for n in value['nodes']]
result=set_precision(mask.intersection(unary_union(corridors)),.01)
polys=list(result.geoms) if result.geom_type=='MultiPolygon' else [result]
connected=[p for p in polys if p.covers(Point(20,-68.25))]
assert len(connected)==1, 'Clipped driving surface lost the original car component'
disconnected_area=result.area-connected[0].area
polys=connected
rings=lambda p:[[[round(x,2),round(z,2)] for x,z in r.coords] for r in [p.exterior,*p.interiors]]
print(json.dumps({'driveSurface':[rings(p) for p in polys], 'areaM2':round(polys[0].area,2), 'disconnectedSurfaceAreaM2':round(disconnected_area,2),
 'uniqueSourceRoadLengthM':round(unary_union([LineString(city['roads'][e['sourceIndex']]['points']) for e in value['edges']]).length),
 'uniqueEdgePathLengthM':round(unary_union([LineString(e['smoothedPoints']) for e in value['edges']]).length)},separators=(',',':')))
