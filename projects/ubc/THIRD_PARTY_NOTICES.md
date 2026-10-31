# UBC Virtual Campus — sources and rights

Original UBC implementation and procedural models: MIT, copyright 2026 Asymmetri.
Three.js 0.186.1: MIT. The existing Asymmetri project dependencies retain their licences.

UBC Campus + Community Planning's geospatial repository is the source for campus
buildings, entrances, hard/soft landscape, roads, pedestrian routes and trees.
Its locations, landscape and transportation README files declare the **Public
Domain Dedication and License 1.0 (PDDL)**. Preserve source identifiers, snapshot
hashes, transformation notes and measurement limitations in the public manifest.

- Source: <https://github.com/UBCGeodata/ubc-geospatial-opendata>
- PDDL: <https://opendatacommons.org/licenses/pddl/1-0/>
- Official September 2026 maps: <https://planning.ubc.ca/about-us/campus-maps>

The separate ArcGIS height layer was researched; its public accessibility alone is
not a redistribution licence. Do not import it without an explicit rights record.
Source GIS height fields and estimates are distinguished by the compiler manifest.

Public webpages, historic drawings and professional biographies are linked as
research references. Their photographs, floor-plan images, logos, portrait textures,
artworks and third-party 3D meshes are **not** shipped. Original primitive geometry,
procedural grain/noise textures and plain nominative location text are used instead.
No UBC trademark licence, institutional endorsement or individual participation is
asserted. Named educational figures are visibly stylized and use no cloned voices.

Principal architectural references:

- <https://sportfacilities.ubc.ca/baseball-tc/>
- <https://sportfacilities.ubc.ca/construction-news/completed-projects/baseball-stadium/>
- <https://www.mbtw.com/design-portfolio/tourmaline-west-stadium>
- <https://planning.ubc.ca/ubc-bookstore>
- <https://officemb.ca/projects/ubc-bookstore/>
- <https://www.fastepp.com/portfolio/university-of-british-columbia-bookstore-renovation-and-expansion/>
- <https://www.ams.ubc.ca/your-building/>
- <https://www.ams.ubc.ca/wp-content/uploads/2023/01/v2_Nest-Amenities-Map-1.pdf>
- <https://learningspaces.ubc.ca/classrooms/angu-bruce-r-birmingham-undergraduate-centre/>

Professional sources and links are centralized in `registry.ts` with review dates,
source disagreements, content permissions and disclaimers. They support educational
summaries; no generated text is presented as the real person's quotation.

Orchard V0.2 adds the pinned repository's `ubcv_subbuildings.geojson` under the
locations PDDL declaration. Its manifest records raw/output hashes. Architectural
references include UBC Housing, residence tours, public 2014 DP13034 plans and
elevations, Perkins&Will and StructureCraft. These are reference-only copyrighted
sources; no drawings/photos are included. Room layouts are fictional Level B
reconstructions. All three students are original stylized fictional characters
with sourced general Housing information in `residence-content.ts`.

## V0.3 campus life

Source-reviewed professional and varsity facts (names, roles, sports, season labels
and public research areas) are summarized in `data/faculty.json` and `athletes.json`.
Their pages retain their own copyrights; no portraits, contact lists, entire
biographies or source HTML are shipped. The original bird emblem is not a UBC mark.
Faculty coverage is partial and all roster season labels are retained.

Additional research-only architectural references:

- https://ubcproperties.com/project/ubc-baseball-rose-indoor-training-centre/
- https://mg-architecture.ca/project/ubc-baseball/
- https://sportfacilities.ubc.ca/wmg/
- https://planning.ubc.ca/sites/default/files/2019-12/HERITAGE_UBC_WarMemorialSOS.pdf
- https://learningspaces.ubc.ca/classrooms/henn-200/
- https://facilities.ubc.ca/hennings-200-active-learning-theatre/
- https://www.ams.ubc.ca/business/blue-chip-cafe/
- https://www.ams.ubc.ca/wp-content/uploads/2022/05/Nest_Building_Directory_2022.pdf
- https://gvrsf.ca/students/faq/
- https://gvrsf.ca/2027-schedule/

Transit geometry: https://gtfs-static.translink.ca/gtfs/google_transit.zip
Terms: https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-data

**Route and arrival data used in this product or service is provided by permission
of TransLink. TransLink assumes no responsibility for the accuracy or currency of
the Data used in this product or service.**

Only synthetic movements use these shapes. No real-time data, operator marks,
photographs or licensed vehicle mesh is included.

West 10th street geometry contains information licensed under the Open Government
Licence – Vancouver: https://opendata.vancouver.ca/pages/licence/ .
The transformation and source digest are in `data/west-tenth.json`.

## Gateway, Beaty and Irving public-space additions — 2026-10-31

The arrival island and building locations continue to use the pinned UBC PDDL
snapshot at revision `885732d332a20a59143f655c83fb15e1367ebe4d`. Additive runtime
anchors preserve those published files. Gateway uses pedestrian landscape record
`LSHARD_TYPE-642-0`; Beaty uses VBL10086's Main Mall glass pavilion rather than
the research-wing anchor; Irving uses VBL10080 and its East Mall entrance record.
Dimensions stored to centimetres are numerical precision, not survey accuracy.

Gateway research references:

- [Sign designer: Lost & Found](https://www.lostandfoundstudio.ca/ubc-gateway-sign)
- [Project architect: PUBLIC](https://www.publicarchitecture.ca/projects/ubc-gateway)
- [UBC Gateway development drawings, 2020](https://planning.ubc.ca/sites/default/files/2021-01/201223_GatewayDPBooklet_DP20037.pdf)
- [UBC's 2026 Gateway photograph](https://apsc.ubc.ca/news/2026/new-home-for-future-of-health-care)

`gateway-model.ts` uses original outlines, extrusion and a generated 64 × 64
roughness texture to interpret the silver letters and supports. No font, university
logo file, sign fabrication drawing or photograph is incorporated. This nominative
landmark reconstruction does not assert trademark permission or endorsement.

Beaty research references:

- [Patkau: Beaty Biodiversity Centre, photographs, ground plan and sections](https://www.patkau.ca/projects/ubc-beaty-biodiversity-centre)
- [UBC Properties: Beaty centre and museum](https://ubcproperties.com/project/beaty-biodiversity-research-centre-beaty-natural-history-museum/)
- [Museum: Meet Big Blue](https://beatymuseum.ubc.ca/exhibitions/permanent-exhibitions/blue-whale-display/blue-whale-project/)
- [Museum visitor map and audio guide](https://explore.beatymuseum.ubc.ca/map/)
- [Public visitor plan](https://beatymuseum.ubc.ca/files/2019/06/beatyvisitorguide2018.pdf)
- [Public rental-space plan, 2018](https://beatymuseum.ubc.ca/files/2018/08/BBMrental2018_v01.pdf)
- [Museum-maintained indoor-map documentation](https://beatybiodiversitymuseum.github.io/data-documentation/reference/indoor-map/)

The indoor-map source was consulted for public entrance/ramp relationships, not
imported as an asset. It includes OSM-derived records under ODbL and separate
museum-maintained geometry; no blanket redistribution permission for those museum
layers is assumed. The shipped museum uses original procedural architecture and
whale geometry, UBC PDDL exterior placement and a reference-based gallery. The
skeleton is an anatomical interpretation, not a scan or measured replica.

Irving research references:

- [UBC public four-level visitor map, 2019](https://wiki.ubc.ca/images/3/34/Irving_K._Barber_Learning_Centre_Map_2019.pdf)
- [UBC building history and highlights](https://ikblc.ubc.ca/spaces/building-history-and-highlights/)
- [UBC public access guide](https://ikblc.ubc.ca/accessibility-guide-2/)
- [DA Architects: exterior, atrium and reading-room photographs](https://www.da-architects.ca/projects/ubc-irving-k-barber-learning-centre/)
- [Pfeiffer / Perkins Eastman: materials and public-space photographs](https://www.perkinseastman.com/projects/university-of-british-columbia-irving-k-barber-learning-centre/)

`irving.ts` interprets the granite heritage core, glazed wings, public atrium,
Chapman hall and Ridington room. Floor heights, stairs, roof profiles and furniture
remain Level B reconstruction. Historic room names are not treated as current
assignments. No reference photograph, floor-plan image, portrait, stained-glass
artwork or downloaded architectural model is redistributed by these additions.

## Outdoor athletics additions — 2026-10-31

`athletics-layout.ts` and `athletics.ts` use original geometry on the existing
PDDL field/track polygons and source-aligned stadium placement. Official sources:

- [Thunderbird Park facility descriptions and published field dimensions](https://sportfacilities.ubc.ca/thunderbird-park/)
- [Official Thunderbird Park map](https://sportfacilities.ubc.ca/wp-content/uploads/2020/08/3-THUNDERBIRD-PARK-Map-page-001.jpg)
- [Existing Thunderbird Stadium](https://sportfacilities.ubc.ca/thunderbird-stadium/)
- [Football Canada 2025 tackle rulebook](https://footballcanada.com/wp-content/uploads/2025/03/2025-Tackle-Rulebook-English.pdf)

Ken Woods and Harry Warren use published playing dimensions; South Turf markings
are estimated within the source turf footprint. The documented eight-lane, 400 m
track is interpreted with a 36.5 m inner radius and 1.22 m lane widths, not a survey
of the real lane geometry. Thunderbird Stadium's surface uses published dimensions;
grandstand seating, embankment, lights and fixtures remain reference geometry.
The source map, rulebook diagrams, venue photographs and carved stadium artwork are
not copied into scene assets. Plain venue/team text uses the browser system font;
uniforms retain the original geometric bird emblem, not UBC's Thunderbird mark.
Practice players and joggers are fictional and do not represent current occupants.

## Optional Halloween atmosphere — 2026-10-31

The full moon, crater texture, cloud-noise shader and seasonal lighting in
`halloween-sky.ts` are original MIT procedural work. The generated texture is
128 × 128 RGBA; no lunar photograph, external HDRI, commercial skybox or copied
illustration is included. The scene is artistic seasonal decoration, not actual
astronomical, weather or campus-event data. Reduced-motion behaviour and normal
atmosphere restoration are application features, not external assets.

The annual schedule and device-local year-scoped on/off preference are original
configuration. Vancouver calendar dates determine the default; explicit visitor
choice remains available year-round. No personal information, server profile
field, location permission or third-party calendar service is introduced by this
setting. The shared campus/GIS and character-source notices continue to apply.

`halloween.ts` adds original MIT pumpkin, ghost, cobweb and moss-creature meshes
using generated geometry and vertex colours. Their faces and silhouettes are
original, not licensed or copied entertainment characters. The overlay includes
29 dispersed decoration sets across nine interiors and their supported levels,
plus two gateway pumpkins, with fictional creatures
on the existing source pedestrian paths. No reference picture, external texture,
voice, sound recording or downloaded model is included. These are optional artistic
decorations, not a depiction of an actual university event or its attendees.
