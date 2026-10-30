# Vancouver V0.6 — real-data Cambie research

**Development only. Cambie is not publicly drivable.** This extends the
[V0.5 synthetic proof](VANCOUVER_V05_ELEVATION_2026-10-30.md) with a bounded real
alignment and observed surface/terrain heights. The separate synthetic corridor
remains labelled synthetic; neither candidate connects to the production city.

## Sources and rights

Retrieved October 30, 2026. The [City public-streets dataset](https://opendata.vancouver.ca/explore/dataset/public-streets/)
provides plan alignment, not road-deck Z or surveyed lane boundaries. The bounded
[206-record request](https://opendata.vancouver.ca/api/records/1.0/search/?dataset=public-streets&rows=1000&sort=recordid&geofilter.bbox=49.264%2C-123.121%2C49.279%2C-123.110)
covers Cambie and both approaches. Acquisition dates are not supplied; retrieval
does not make the alignment a current survey. City 2022 LiDAR requests returned 403;
no point cloud was downloaded or access restriction bypassed.

The [provincial LiDAR portal](https://lidar.gov.bc.ca/) and its
[public layer index](https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/LiDAR_BC_S3_Public/FeatureServer)
identified two intersecting 1 m DSM tiles and two matching DEM tiles. Filenames and
metadata record acquisition **August 26, 2025**, not 2026. Four rasters total 22,363,216
bytes; no provincewide download or raw LAS/LAZ is needed. DSM observes the top
surface including possible cars/barriers; DEM is bare-earth modelling and may
interpolate beneath the bridge. Both require interpretation.

The [underlying provincial data catalogue record](https://catalogue.data.gov.bc.ca/api/3/action/package_show?id=d08b2795-d192-4377-8056-eccef50296e6)
identifies Open Government Licence–BC. The portal application has a separate
AccessOnly catalogue entry; it is not the licence of these data files.
Contains information licensed under the
[Open Government Licence–British Columbia](https://www2.gov.bc.ca/gov/content/data/policy-standards/data-policies/open-data/open-government-licence-bc)
and [Open Government Licence–Vancouver](https://opendata.vancouver.ca/pages/licence/).
No government mark or endorsement is implied. Derived data retains source terms;
original code remains MIT.

The [OP24BMRS001 accuracy summary](https://nrs.objectstore.gov.bc.ca/gdwuts/metadata/accuracy_rpts/2024/op24bmrs001_summary.pdf)
was read and rendered for inspection (221447 bytes, SHA256
`d55bc0a78460ac01c38fe773b4eaef797c83f8646080b16b337c498a1f54820a`).
It describes Riegl VQ1560II, target 8 points/m², NAD83(CSRS)2010/CGVD2013(CGG2013),
non-vegetated vertical 95% limit 19.6 cm and inter-swath RMSD 8 cm. These are acquisition
specifications, **not demonstrated accuracy of our reconstructed road surface**.

## Coordinates and transformations

All four TIFFs identify compound EPSG 6653: horizontal EPSG 3157,
NAD83(CSRS)/UTM 10N; vertical EPSG 6647, CGVD2013(CGG2013), metres.
City WGS84 longitude/latitude is transformed using pyproj/PROJ's inverse
NAD83(CSRS)→WGS84(2), stated 1 m accuracy. No epoch correction or unverified CGVD28
conversion is applied. Local x=easting−originE, z=originN−northing; y retains absolute
CGVD2013 height. Origin (-123.111, 49.2725) projects to (491926.681757, 5457754.326463).

The existing V0.4 simplified 2002 water outline/park additions are horizontally
reprojected from EPSG 32610 to 3157. Display water y=0 is a labelled visual reference,
not a tide measurement. Public city terrain remains flat at its illustrative zero;
that unresolved difference prevents a valid public ground-to-ramp connection.

## Reproducible immutable extraction

`development/cambie-research-v06-2026-10-30.json`: 28668 bytes, SHA256
`7ea36275bfd34834efa7e404efe5a5ce6379503919b4064efc4636990b0928d8`.
The builder pins every input and the V0.4 city parent
`23e80e2e65de63f960d9bd8d00931c9d7f6761fc6fb25bfe47db0df31941d1fa`.
It refuses to overwrite different bytes under an existing research name. New
geographic evidence requires a new immutable candidate name/hash, not replacing
published V0.1–V0.4 files. No public V0.6 snapshot is created.

Use an external Python environment (validated Python 3.9.6, Shapely 2.0.7,
pyproj 3.6.1, NumPy 2.0.2, rasterio 1.4.3). It is not a production dependency:

```sh
/path/to/venv/bin/pip install -r projects/vancouver/tools/requirements-elevation.txt
/path/to/venv/bin/python projects/vancouver/tools/build_cambie.py \
  --cache /path/to/retained/raw-files \
  --output projects/vancouver/development/cambie-research-v06-2026-10-30.json
```

The City response is retained as `cambie-streets.json`; all raster names below
are unchanged. A changed upstream response requires a new reviewed identity.

| Input | SHA256 |
|---|---|
| cambie-streets.json | `20dbdbfa5e2a33e7c6fa76e621f03df6c175b495ddef2ad6d5bea1e99d4de5ff` |
| [bc_092g025_3_4_2_xli1m_utm10_20250826_20250826_dsm.tif](https://nrs.objectstore.gov.bc.ca/gdwuts/092/092g/2025/dsm/bc_092g025_3_4_2_xli1m_utm10_20250826_20250826_dsm.tif) | `1e10610fa234b1de255c963ad889ecb318ce1c77452aa47be9d7d5beeb8e78da` |
| [bc_092g025_3_2_4_xli1m_utm10_20250826_20250826_dsm.tif](https://nrs.objectstore.gov.bc.ca/gdwuts/092/092g/2025/dsm/bc_092g025_3_2_4_xli1m_utm10_20250826_20250826_dsm.tif) | `179eda72df32e84790ed15e7eb89f5972a95832ac747506369c45bda9da8fbfe` |
| [bc_092g025_3_2_4_xli1m_utm10_20250826_20250826.tif](https://nrs.objectstore.gov.bc.ca/gdwuts/092/092g/2025/dem/bc_092g025_3_2_4_xli1m_utm10_20250826_20250826.tif) | `d4c67a4dfc62fc58f222d8d8a109d3a76c5124dad4903165b8c05109172a4c6c` |
| [bc_092g025_3_4_2_xli1m_utm10_20250826_20250826.tif](https://nrs.objectstore.gov.bc.ca/gdwuts/092/092g/2025/dem/bc_092g025_3_4_2_xli1m_utm10_20250826_20250826.tif) | `855f5202e7f961054f4ba09d4b5dc34624cc507e315baa7c549ad80f1bf39c87` |

## Corridor and height estimator

| Surface | City record | Length m | Height source | Test width m |
|---|---|---:|---|---:|
| north-ground | `c6f6f0914561a25c6c0fa744d83c8b76ee4efb48` | 99.415 | DSM | 8 |
| north-approach | `24b3f4bc76a56d3dbbb14a1934f0f4088f0a5638` | 320.120 | DSM | 8 |
| main-deck | `f86168a1019d468a1ced81a84944230e3e96d776` | 400.925 | DSM | 12 |
| south-approach | `b4442aed8b63ce674aaa2a7243c89f16a0de3b0f` | 371.031 | DSM | 10 |
| south-landing | `959e941e2db30b382f0eba9f901b26b42e3d100a` | 100.878 | DSM | 10 |
| south-ground | `bf25e5b63b0b02228e58afdf989341a800d4e1cc` | 38.256 | DSM | 10 |
| marinaside-underpass | `c9eb2a6aeb57a1f9f979e780876aca89df67c06c` | 125.163 | DEM | 8 |

The six bridge/approach sections total 1330.625 m; the 125.163 m underpass is separate.
Stations preserve City bends and approximately 5 m intervals. Fifteen raster samples
(three longitudinal × five across ±2 m) supply a lower-quartile estimate to reduce
vehicle/barrier contamination, followed by a five-station median. Common endpoint
medians make seams agree. Raw quartiles, interquartile spread, DEM comparisons,
source record IDs and station distances remain in the JSON. Missing bare-earth
samples over water remain null; they are not fabricated terrain measurements.

Derived deck heights are about 16.36 m at the north connection, 18.10 m near the crest,
16.51 m south. North ground is about 6.47–7.41 m, south ground 11.22–12.75 m, underpass
4.03–4.66 m CGVD2013. These are estimated road profiles from raster observations,
not surveyed carriageway levels. Test widths 8–12 m, joins, centrelines, markings,
vehicle dimensions and ribbon cross-sections are illustrative; the corridor may
cross a real median and omits crossfall, barriers and traffic-direction rules.

## Architecture and validation

`elevation.ts` adds curved, indexed profile sampling with monotone C1 cubic height
interpolation and zero endpoint derivatives. Connections use matching explicit
node identities and elevation, never XY intersection alone. Nine body probes,
finite-width support, bounded height spread and short movement substeps keep the
whole car on its active connected surface. A ground underpass cannot become the
deck simply by crossing it in plan. Camera target height follows vehicle height.
The lab renders the same supported ribbons/joins used by collision queries.

Early traversal tests caught a closest-segment endpoint bug that could select the
penultimate height and create a roughly 0.29 m seam. Endpoint clipping now follows
nearest-segment selection. Both directions pass full corridor traversal at
15/60/120 Hz, visiting all six surfaces with continuous height/pitch and no blocked
step. Tests also cover monotonicity, endpoint equality, bounded grades, water/deck
support and disconnected underpass routing. Automated path tracking is explicitly
not manual gameplay acceptance.

The manual northbound candidate run crossed all six surfaces over 1314.9 m in 463.8 s,
five contact counts, no Recover/reset. Underpass 52.5 m/one contact failed camera
visibility; the fixed elevated chase camera rises above the deck and hides the car.
Southbound manual traversal and public integration are not accepted. Failure logs
and before/after diagrams/screenshots are retained externally with the research.

## Public bridge gates still open

- Verify actual drivable carriageway widths/median, barriers, lane directions,
  approach junctions and raster-profile uncertainty independently.
- Give the bounded public ground network consistent terrain/datum transitions;
  the full south approach currently extends beyond published coverage.
- Resolve underpass and approach camera occlusion/near-plane collisions.
- Complete both manual directions, entrance/exit, reset/recovery, navigation and
  bridge/ground collision regression at multiple speeds and render rates.
- Verify mobile controls and rendering for the integrated result, then repeat
  the independent Linux build, protected-site, capacity and complete-rollback gates.

Until then this is a reproducible research candidate, not a Vancouver road survey
or public bridge feature.
