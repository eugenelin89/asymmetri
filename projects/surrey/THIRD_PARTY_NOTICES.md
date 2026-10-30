# Surrey, City of Adventure third-party notices

Original Surrey code, narrative, CSS illustration and procedural model definitions
are MIT licensed; see LICENSE. Vancouver's unchanged geometry predicates retain
their MIT licence. This does not relicense the entire website or its trademarks.

## City of Surrey geographic information

**Contains information licensed under the Open Government License – City of Surrey.**

- [Official Open Data program](https://www.surrey.ca/services-payments/online-services/open-data)
- [Current City licence text](https://opendata-surrey.hub.arcgis.com/pages/55089a19491a4fe59a41e059fd8af708)
- [Open Data GIS service](https://gisservices.surrey.ca/arcgis/rest/services/OpenData/MapServer)
- [Building Footprints catalogue record](https://www.arcgis.com/home/item.html?id=f21746da586043cea49a3f8c61663835)
- [Full query/source/processing manifest](/surrey/v0.3-2026-10-30/manifest.json)

The City's licence permits copying, modifying, adapting and distributing the
information, including commercial use, subject to attribution and its conditions.
It excludes official marks and third-party rights and provides no warranty or
endorsement. No City logos or third-party imagery were copied. All geographic
outputs remain City-derived information under those terms, separate from MIT code.

The snapshot was retrieved October 30, 2026. Geographic features have mixed or
unspecified observation dates. Height units are verified as metres; measurement method and survey dates remain unknown. Decorative architecture is artistic.
See README and the manifest for the exact distinction between sourced geometry
and game-authored scenery. No OSM/ODbL dataset, real crime record or private personal
information was imported. Transit station maps were consulted for orientation;
no TransLink artwork, branding, map image or dataset was copied.

## Runtime software

Three.js is MIT licensed; React is MIT licensed; Next.js is MIT licensed.
They remain the website's existing pinned dependencies. Procedural textures and
3D characters are original; there are no external model, font or image downloads.
The offline-only Shapely dependency retains its BSD licence and is not bundled.

## V0.2 architecture references (reviewed October 30, 2026)

These primary public references informed original, stylized procedural geometry.
No photographs, logos, artworks or source meshes are redistributed. Locations use
the unchanged City snapshot; added massing/dimensions are illustrative, not surveyed.

- [Surrey Central Station — Office of McFarlane Biggar](https://officemb.ca/projects/surrey-central-skytrain-station/): glazed stationhouse and entrances.
- [SFU at Central City](https://www.sfu.ca/surrey/about/our-locations/sfu-at-central-city.html): mall/university/tower composition.
- [Central City atrium — StructureCraft](https://structurecraft.com/projects/central-city-atrium-facade): sweeping glazing and timber columns.
- [City Hall — Kasian](https://kasian.com/project/surrey-city-hall-and-civic-centre/): projecting roof and glazed atrium.
- [City Centre Library — Revery](https://reveryarchitecture.com/projects/surrey-city-centre-library/): angled walls, floor bands and skylights.
- [Civic Plaza — City of Surrey](https://www.surrey.ca/news-events/events/surrey-civic-plaza): civic outdoor space.
- [Holland Park — City of Surrey](https://www.surrey.ca/parks-recreation/parks/holland-park): gardens, fountain and amphitheatre.

## V0.3 source and architecture review

Road Surface113, active Curbs123/Medians124, the hosted Trails and Paths service,
and hosted/native building records add source geometry and height provenance.
The new manifest pins all receipts; V0.1 remains unchanged. All 786 retained height
records are derived/spatial matches, not verified measured heights. No LiDAR/DEM
terrain was imported because the 2025 vertical datum is unresolved.

StructureCraft's public project description supports the atrium's 86ft height,
256ft facade length and 24ft lower column spacing (converted to metres in code).
Its four-degree tilt is a reference cue; this simplified model does not reproduce
all engineering details. Library ribbons, rooflights, civic canopy, station glazing,
park furniture, windows/materials, setbacks and roof equipment remain original
procedural interpretations, not copied assets. The facade canvases are 128×128;
road-name sign canvases are 256×64. No additional runtime dependency is introduced.

## V0.4 original additions

Window-emission masks, small entrance/planter/bicycle-rack geometry, the fictional
Paper & Pine workshop sign and the four-note synthesised marimba motif are original
MIT work. No third-party audio, recorded voices or copied photographic textures were
added. The fresh terrain metadata review links the existing City open-data licence;
it does not establish a vertical datum or grant official endorsement.

## V0.5 transport

The new transport JSON derives only from the pinned V0.3 City of Surrey receipts
under the same Open Government License – City of Surrey. Its manifest records
lineage, output hash and bounded scope; original snapshots remain untouched.
Compact cars, wheel/light animation, train bodies/windows/doors, route ribbon,
side platforms and platform lights are original MIT procedural work. No transit
logo, proprietary vehicle model or recorded train sound is copied. Guideway height
and station detail remain illustrative; the train is scenery, not a boarding service.
