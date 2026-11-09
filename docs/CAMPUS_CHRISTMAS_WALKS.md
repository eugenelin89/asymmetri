# Christmas walks in the virtual campuses

The Christmas edition adds three original seasonal installations to the existing campus reconstructions. Follow the pairs of ribboned lanterns from arrival. On Low quality, the lanterns alternate sides. The central passage through each destination remains open for walking.

| Campus | Walk from arrival | Destination display |
| --- | --- | --- |
| UBC · 344 m | Spruces flank the Gateway letters. Turn around the north end of the letters and follow the lanterns west along University Boulevard, then turn toward the glazed AMS Nest entrance. | A 6.8 m ornamented spruce stands beside the open atrium. Two red-bowed garlands trace the upper gallery facing the walk. |
| Stanford · 639 m | Two trees frame the Oval approach. Walk into Main Quad between the arcades, turn east in the courtyard, then follow the lanterns around the north side of Green Library to the east entry. Two runs of garland follow the mapped sandstone arcades. | A 3.3 m tree sits beside the reading aisle. Wreaths and strings of lights frame the reading room below the first floor slab. |
| CWRU · 96 m | Turn away from the evergreen arch at Kelvin Smith Library. Follow the lanterns north past the approach trees, then turn east into Tinkham Veale. | Warm and cool stars hang over the commons seating. A 3.35 m decorated tree stands beside the central aisle. |

Distances follow the virtual walking line to a point six metres inside each furnished core. They do not describe real-campus wayfinding or installations. The metre coordinates in [christmas-walks.ts](../projects/campus-atmosphere/christmas-walks.ts) include every turn, the outer doorway and the interior viewpoint. The same soft instrumental continues through the walk and across doorways with Campus sound on.

## Rendering and sources

The seasonal geometry consists of original, procedurally assembled fir whorls, brass ribbon, crimson ornaments, faceted stars, bowed wreaths, garlands and path lanterns. The palette uses both pine shades and painted red and brass for a daylight appearance. Warm and ice-blue bulbs brighten continuously as solar altitude falls from +8° to −6°. The bulbs vary gently on a 13-second cycle at dusk. Reduced motion fixes their brightness. Warm and cool light pools pick out the ground around trees and lanterns. A warm wash keeps the UBC letters readable at night.

The layer allocates seven instanced decoration meshes and an instanced ground-light mesh upon Christmas entry. Low quality reduces light and ornament density and drops alternating lanterns. Automatic uses the lower density in small viewports and when Stanford’s existing automatic quality control requests it. Leaving Christmas or disposing the explorer releases the instanced meshes, materials and geometries. The overlay adds no pathfinding obstacles or interaction targets.

| Route | Full-detail triangle count | Low-detail triangle count |
| --- | ---: | ---: |
| UBC | 65,726 | 47,204 |
| Stanford | 109,172 | 76,332 |
| CWRU | 42,018 | 34,542 |

These measured counts cover the decoration meshes before the ground-light pass (16 triangles per light pool); frame times also depend on the underlying campus, view and device. No additional models, textures, photographs, font files or recordings are downloaded for the scenery. Original mesh construction uses the campus projects’ MIT terms. Placement uses the pinned UBC Campus + Community Planning geography under PDDL and Stanford/Cleveland geography © OpenStreetMap contributors under ODbL 1.0. The campus-specific rights and reconstruction limits are recorded in [UBC notices](../projects/ubc/THIRD_PARTY_NOTICES.md), [Stanford notices](../projects/stanford/THIRD_PARTY_NOTICES.md) and [CWRU notices](../projects/cwru/THIRD_PARTY_NOTICES.md).

## Repeatable traversal check

Run `node --test projects/campus-atmosphere/christmas-walk.test.mjs` from the website checkout on the project Node version. The test uses the pinned building footprints, the route landmarks’ furnished geometry, outer doorway and the explorer’s regular forward input and swept collision. At each turn, it points the walker down the next segment and walks to the checkpoint. Three chest-height rays test the visible seasonal geometry for clearance across the visitor’s shoulders. The checks require an unobstructed route into the named room, visible scenery from the arrival and indoor viewpoints, and the ordinary view after returning to Regular.

The controlled lighting cases use solar altitudes of 0.55, 0.01 and −0.3 radians. Browser captures, real weather observations, physical-device touch, listening and frame timings belong to the acceptance record for the tested revision.
