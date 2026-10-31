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
