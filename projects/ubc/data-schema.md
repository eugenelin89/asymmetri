# Campus geography snapshot

`public/ubc/v0.1-2026-10-30/` is compiled from UBCGeodata commit
`885732d332a20a59143f655c83fb15e1367ebe4d`. All seven incorporated layers have
PDDL 1.0 licence statements in their category README. Raw receipts are outside
Git, under `/tmp/ubc-source` for this local build; the manifest records full
pinned URLs, SHA-256 digests, byte sizes, licence evidence and counts.

Reproduce with Python 3.9 or newer, with no third-party Python packages:

```sh
python3 projects/ubc/tools/compile_data.py --cache /path/to/retained-raw-source
python3 -m unittest discover -s projects/ubc/tools -p 'test_*.py'
```

The importer rejects source digest changes. A changed upstream dataset requires
review, a new version directory, revised digest pins and regression verification.
Do not replace a published snapshot in place. Build and browser runtime need no
GIS network requests.

## Coordinates

All coordinates are metres, x east and z south, relative to WGS84
`[-123.245,49.26]`. The projection uses Snyder transverse Mercator series on the
GRS80 ellipsoid, zone 10N, giving the UTM origin recorded in the manifest.
WGS84 source coordinates are treated as NAD83 without an epoch correction.
This is an explicitly approximate EPSG:26910 datum conversion, with potential
metre-scale datum differences. It is consistent across every imported layer;
centimetre storage precision is not centimetre survey accuracy. Terrain is flat.

## Data contract

`data.json` supplies these arrays, consumed by `types.ts`:

| Array | Geometry and attributes |
| --- | --- |
| `buildings` | Stable UBC `BLDG_UID`, suffix per multipart polygon, name, rings, height, heightSource, address |
| `surfaces` | Layer/object/part identifier, source kind, exterior ring plus every interior ring, optional public landscape name |
| `trees` | TREEID, x/z, recorded taxon or common name, height, heightSource, evergreen classification |
| `routes` | Stable index in pinned source, source path vertices, kind, stairs and pedestrian-access indication |
| `entrances` | Source GUID, associated BLDG_UID, x/z, entrance type and recorded accessible flag |
| `roads` | Stable index, source road name and centreline vertices; available for labels, not invented pavement |

Polygon rings are closed arrays of `[x,z]`. Ring 0 is the exterior; later rings
are holes. Multipart buildings become independent polygon records. The largest
part is used for a landmark anchor. RDP simplification tolerances are 0.16 m
for buildings, 0.20 m for landscape, 0.08 m for routes and 0.10 m for roads.
The algorithm preserves ring membership but is not a full topology-repair
engine. Original source geometry and polygon holes remain reproducible.

Features intersecting the requested WGS84 extent by at least one source vertex
are retained whole. Some long road geometry consequently extends beyond that
extent. This is selection, not clipping, and the runtime world boundary still
applies. Building source statuses other than Complete or unspecified are omitted.
No proposed Powerhouse building is presented as built.

Only explicit pedestrian-prohibited and building-interior lines are excluded
from routes. An unknown access field is retained as unknown, not verified public
access. Source stairs are retained as metadata; these lines do not create stairs
or elevation in the flat background campus. Directions are simulation guidance.
The importer does not join disjoint route components or manufacture corridors.

Source `BLDG_HEIGHT` is defined by the UBC field dictionary as metres from grade
to the highest roof point. It is used where plausible, with measurement date and
method unconfirmed. Otherwise maximum floor count × 3.5 m is an illustrative
estimate. `MAX_FLOORS` includes basement floors and can overestimate this fallback.
Tree THEIGHT is used when plausible; missing heights use illustrative class sizes.
Recorded conifer/evergreen classes and known conifer genera remain evergreen.
Unknown taxa remain explicitly unknown, rather than fabricated tree species.

Only allowlisted visitor attributes are published. Editor names, staff email
addresses, internal author fields and other unused metadata are omitted.

## Landmark anchors

`anchors.json` is keyed by destination id. Every anchor has x/z, width/depth,
yaw, WGS84 coordinate and a source explanation. Building anchors add buildingId
and a recorded primary entrance when available. A minimum-area bounding rectangle
is a modelling envelope, not a claim of exact architectural floor shape. The
custom models can therefore require additional approach checks after placement.

Tourmaline West uses the centre of the home-plate clay circle from official
hardscape OBJECTID 970, oriented toward the mound-circle centroid from OBJECTID
974. The outfield points south-southwest. Inferred home plate is
`[-123.240391429,49.256111870]`, local `[333.95,433.32]`, yaw `2.8467355` radians
for a model whose outfield is local negative z. Source circle separation is
17.94 m, so the rendered conventional 18.44 m pitching distance is a
reconstruction, not exact reproduction of that surface measurement. The outfield
polygon is softscape OBJECTID 3658; bullpen surfaces are 3669 and 3672.

The starting point is an official sidewalk vertex on source route 2306,
`[-123.241133961,49.254536518]`, local `[279.36,608.28]`, about 20 m north of
the West 16th Avenue / East Mall roundabout. It is source-geography verified;
present-day physical accessibility has not been field-surveyed.

Rose Garden uses the garden/parkade complex as an exterior information point.
The source identifies the parkade footprint; its rooftop garden and terrain
elevations are not reconstructed. Do not claim a detailed Rose Garden model or
Level A verified interior from this dataset.

## Counts

The compiled snapshot contains 605 building polygon parts, 6,070 landscape
polygons, 9,324 tree positions, 6,103 outdoor pedestrian-route lines, 1,450
current entrance points and 213 named road lines. These are source coverage
counts, not a claim that every building has a bespoke model or enterable interior.
