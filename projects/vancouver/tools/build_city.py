#!/usr/bin/env python3
"""Build a bounded City of Vancouver snapshot. No production/runtime API calls.

Usage: python build_city.py --cache /path/outside/repository
Cached raw responses make repeat builds deterministic; delete a cache explicitly
to refresh. Source dates are distinct from retrieval dates and illustrative heights.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from urllib.parse import urlencode

from pyproj import Transformer
from shapely.geometry import Point, box, shape
from shapely.ops import polygonize, transform
from shapely import set_precision, unary_union
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parents[3]
BOUNDS = [-123.123, 49.267, -123.099, 49.278]
ORIGIN = [-123.111, 49.2725]
ANCHORS = {
    "science-world": [-123.1038, 49.2734],
    "olympic-village": [-123.1069, 49.2717],
    "creekside": [-123.1055, 49.2716],
    "hinge-park": [-123.1103, 49.2708],
    "habitat-island": [-123.1105, 49.2719],
    "cambie-bridge": [-123.1147, 49.2721],
}
PROJECT = Transformer.from_crs("EPSG:4326", "EPSG:32610", always_xy=True)
OX, OY = PROJECT.transform(*ORIGIN)


def local(x, y, z=None):
    east, north = PROJECT.transform(x, y)
    return east - OX, OY - north


def parts(geometry, kind):
    if geometry.is_empty:
        return []
    if geometry.geom_type == kind:
        return [geometry]
    return [p for g in getattr(geometry, "geoms", []) for p in parts(g, kind)]


def ring(coords):
    return [[round(x, 1), round(y, 1)] for x, y in coords]


def polygon(poly):
    return [ring(poly.exterior.coords), *[ring(p.coords) for p in poly.interiors]]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, required=True)
    args = parser.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    # A common precision grid is essential: near-coincident boundary endpoints
    # otherwise fail to node and can turn the entire extent into a water polygon.
    clip = set_precision(transform(local, box(*BOUNDS)), 0.1)
    sources = []

    def records(dataset, bounded=True):
        params = {"dataset": dataset, "rows": "1000", "sort": "recordid"}
        if bounded:
            params["geofilter.bbox"] = "49.267,-123.123,49.278,-123.099"
        url = "https://opendata.vancouver.ca/api/records/1.0/search/?" + urlencode(params)
        path = args.cache / (dataset + ".json")
        if not path.exists():
            result = subprocess.run(["curl", "--fail", "--silent", "--show-error", "--max-time", "90", url], check=True, capture_output=True)
            payload = json.loads(result.stdout)
            if payload["nhits"] > len(payload["records"]):
                raise ValueError("Refusing truncated dataset: " + dataset)
            path.write_bytes(result.stdout)
        data = json.loads(path.read_text())
        sources.append({"dataset": dataset, "url": url, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "records": data["nhits"]})
        return sorted(data["records"], key=lambda r: r["recordid"])

    def geom(record):
        return set_precision(make_valid(transform(local, shape(record["fields"]["geom"]))), 0.1).intersection(clip)

    parks = []
    park_shapes = []
    for r in records("parks-polygon-representation"):
        for p in parts(geom(r).simplify(0.8, preserve_topology=True), "Polygon"):
            parks.append({"name": r["fields"].get("park_name", "Park"), "shape": polygon(p)})
            park_shapes.append(p)

    shore = unary_union([geom(r) for r in records("shoreline-2002", False)])
    faces = list(polygonize(unary_union([clip.boundary, shore], grid_size=0.1)))
    water_probe = Point(local(-123.112, 49.2725))
    water_faces = [p for p in faces if p.covers(water_probe)]
    if len(water_faces) != 1:
        raise ValueError("Shoreline did not produce one identifiable False Creek polygon")
    water = water_faces[0].difference(unary_union(park_shapes)).simplify(1, preserve_topology=True)
    land = clip.difference(water)
    if not 0.1 < water.area / clip.area < 0.4:
        raise ValueError("False Creek land/water topology failed the bounded-area check")

    buildings = []
    for r in records("building-footprints-2015"):
        for p in parts(geom(r).simplify(0.65, preserve_topology=True), "Polygon"):
            if p.area < 18:
                continue
            c = p.centroid
            seed = int(hashlib.sha256(r["recordid"].encode()).hexdigest()[:8], 16)
            # Deliberately illustrative skyline, never presented as measured heights.
            height = (22 + seed % 65) if c.y < -150 and p.area > 180 else (8 + seed % 25)
            if p.area < 100:
                height = 5 + seed % 7
            if p.area > 15000:
                height = 24
            if c.distance(Point(local(*ANCHORS["science-world"]))) < 60:
                height = 5
            buildings.append({"id": str(r["fields"]["object_id"]), "shape": polygon(p), "height": height, "heightMethod": "illustrative"})

    roads = []
    for r in records("public-streets"):
        fields = r["fields"]
        name = fields.get("hblock", "Unnamed street")
        bridge = "CAMBIE BR" in name.upper()
        for line in parts(geom(r).simplify(0.5), "LineString"):
            if line.length > 2:
                roads.append({"name": name, "points": ring(line.coords), "width": 12 if fields.get("streetuse") == "Arterial" else 8, "bridge": bridge})

    data = {"version": "v0.1-2026-10-30", "retrievedAt": "2026-10-30", "crs": "WGS84 / UTM zone 10N; local east/south metres", "origin": ORIGIN,
            "bounds": ring(clip.exterior.coords), "anchors": {k: [round(n, 1) for n in local(*v)] for k, v in ANCHORS.items()},
            "land": [polygon(p) for p in parts(land, "Polygon")], "water": [polygon(p) for p in parts(water, "Polygon")],
            "buildings": buildings, "roads": roads, "parks": parks,
            "notice": "2015 building footprints; illustrative heights; simplified 2002 shoreline, supplemented by park polygons. Flat terrain. Not a current survey or navigation map.",
            "licence": "https://opendata.vancouver.ca/pages/licence/", "attribution": "Contains information licensed under the Open Government Licence – Vancouver.", "sources": sources}
    target = ROOT / "public/vancouver/v0.1-2026-10-30"
    target.mkdir(parents=True, exist_ok=True)
    output = json.dumps(data, separators=(",", ":"), ensure_ascii=False).encode()
    (target / "city.json").write_bytes(output)
    (target / "manifest.json").write_text(json.dumps({"version": data["version"], "asset": "city.json", "bytes": len(output), "sha256": hashlib.sha256(output).hexdigest(), "sources": sources, "attribution": data["attribution"], "licence": data["licence"]}, indent=2) + "\n")
    print(json.dumps({"bytes": len(output), "buildings": len(buildings), "roads": len(roads), "parks": len(parks), "land": len(data["land"])}))


if __name__ == "__main__":
    main()
