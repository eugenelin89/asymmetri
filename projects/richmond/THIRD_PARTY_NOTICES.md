# Richmond data, code and artwork

Original code and procedural models: MIT, see LICENSE. Existing Vancouver pure
geometry predicates and vehicle integrator are reused under their MIT licence;
Vancouver's data, simulation state and save namespace are not imported.

## Geographic database

© OpenStreetMap contributors. OpenStreetMap is available under the
[Open Database Licence 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
[Copyright and source contributors](https://www.openstreetmap.org/copyright).

The complete derived geographic database is distributed as the versioned JSON
snapshot under `public/richmond/`, including every streamed building tile,
collision footprint, road, authored approach and fictional airfield connector.
The snapshot's manifest enumerates outputs and checksums. It and the transformation
source are freely downloadable; the database remains ODbL. The MIT code licence
does not relicense geographic data. Attribution is shown on the start screen,
game footer and project page. See OSMF's
[computer-game attribution guidance](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines#Computer_games_and_simulations).

Snapshots are cached offline and served from the website's own origin. No OSM
map tiles, proprietary imagery, commercial 3D models, business logos or private
airport drawings are bundled. The initial bounded import uses OSM API XML after
Overpass instances failed; request bounds, response hashes, counts and retrieval
times are retained. Source edit timestamps do not establish observation dates.
Raw caches remain outside Git and contain public contributor metadata that is
not copied into the playable database.

## Sources considered

- [City of Richmond maps](https://www.richmond.ca/services/digital/maps.htm):
  RIM has separate terms. Public endpoint availability did not establish a
  redistribution licence for this task; no RIM imagery or GIS layer is copied.
- [BC Digital Road Atlas](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/topographic-data/roads):
  reviewed as a potential source. Not merged into this OSM snapshot.
- [NRCan optimized footprints](https://nrcan.github.io/CanElevation/optimized_building_footprint/):
  existing Vancouver importer reviewed. Not imported for Richmond; no current
  survey claims are made about Richmond heights.
- [YVR terminal maps](https://www.yvr.ca/en/passengers/navigate-yvr/terminal-maps)
  and [Airport South](https://www.yvr.ca/en/passengers/transportation/airport-south):
  identify the main/south terminal context only. No plan or image is reproduced.

## Artistic and gameplay interpretation

Road widths are inferred when absent; bridge heights and ramps are schematic,
not surveyed. OSM-reported building heights, floor estimates and illustrative
heights are recorded separately. Entrances and parking approaches are authored
against real footprints/roads; they do not establish legal real-world access.
All interior floor plans, signs, counters, characters, customers and incidents
are original fiction. Named geographic landmarks imply no endorsement, partnership
or architectural accuracy. The airport sandbox is expressly fictional and includes
an authored connection; it is not an access guide or security simulation.

English, Mandarin and Cantonese courtesy lines are authored, with Traditional
Chinese text. Appearance, language and ethnicity never influence encounter selection
or driving behaviour. No real residents, private addresses, brand assets or crime
claims about real businesses are used.
