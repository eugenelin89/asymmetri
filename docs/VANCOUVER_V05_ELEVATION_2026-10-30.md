# Vancouver V0.5 — elevation proof and Cambie research

Public Cambie Bridge remains view-only. V0.5 provides a separate, development-only
synthetic proof; it does not assign an unverified elevation profile to Vancouver.

## Implemented proof

`projects/vancouver/elevation.ts` models finite-width surfaces connected only by
explicit shared XYZ endpoints. Coincident XY crossings do not create junctions.
Smoothstep ramps meet level ground/deck at zero grade. Movement checks the full
car footprint, connected support, maximum height change and grade. Vehicle height,
pitch and camera height follow the supporting surface. A deck can support a car
over the synthetic water area; the ground cannot.

The original corridor is 480 m long and 12 m wide: 60 m ground, a 120 m ramp to
8 m, a 120 m deck, a 120 m descending ramp and 60 m ground. A separate 10 m wide
underpass crosses at ground level. These numbers are test fixtures, not bridge
measurements. `ElevationLab.tsx` lazily mounts its own renderer only after opening
Local elevation proof in development. Production does not expose that interface.

Nine pure tests cover forward/reverse traversal at 15/60/120 Hz, disconnected
underpass routing, wrong-height rejection, whole-car edge/water exclusion, endpoint
continuity and ramp tangents. Ordinary UI keyboard driving additionally recorded:

| Synthetic run | Actual distance | Final state | Contacts |
| --- | ---: | --- | ---: |
| South toward north | 451.7 m | Opposite ground exit, y=0 | 0 |
| North toward south | 454.8 m | Opposite ground exit, y=0 | 0 |
| Underpass | 80.9 m | Ground crossing, y=0 | 0 |

A separate mid-deck capture shows y=8 after 218.1 m. Starts/stops are inside the
valid corridor; these distances do not claim a full boundary-to-boundary 480 m.
The implementation deliberately handles straight ribbons, not banked curved
highway approaches. It adds no production navigation connection.

## Authoritative sources reviewed

Sources were retrieved October 30, 2026. Only bounded catalogue metadata was
retained; no LAS/LAZ point cloud or large geographic download was performed.

- [City LiDAR 2022 catalogue](https://opendata.vancouver.ca/explore/dataset/lidar-2022/):
  measurements acquired September 7 and 9, 2022; approximately 49 points/m²,
  0.081 m vertical accuracy at 95%, UTM zone 10 NAD83(CSRS) horizontal reference
  and CGVD28 GVRD vertical reference. The 181 ZIP tiles range from about 16.45 MB
  to 2.74 GB. A future bounded deck/terrain extraction must preserve the datum,
  acquisition dates and licence. Publication/retrieval dates are not acquisition.
- [City Cambie Street Bridge upgrades](https://vancouver.ca/streets-transportation/cambie-street-bridge-upgrades.aspx):
  phase two is described as early 2026 through spring 2028, including work beneath
  the bridge. This project information is not a surveyed road-deck profile.
- [SEABC/IABSE notable structures, 2017](https://seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf),
  Cambie Street Bridge entry: the structural description provides useful scale
  (1,100 m total length, 33–84 m spans and six traffic lanes). Its 14 m marine
  clearance must not be treated as an absolute road-deck height in a city datum.
- [City bridgehead guidelines](https://guidelines.vancouver.ca/guidelines-bridgehead.pdf),
  adopted 1997 and amended 2022: useful approach/urban-context relationships,
  including the south bridgehead and First Avenue, but no continuous XYZ survey.

Linked documents retain their own rights. No source drawings, photos or models
are redistributed. The synthetic proof is original project code under MIT.

## Required before public bridge driving

The retained V0.4 plan-view bridge lines contain no vertical coordinates. South
approach ends are cropped around z=611 at the model boundary. The decorative
height function is explicitly illustrative and is not a driving surface.

1. Obtain a bounded, licence-reviewed terrain/deck extraction with a common
   horizontal and vertical datum, source dates, uncertainty and immutable hashes.
2. Extend the bounded extraction far enough to verify both full approaches and
   ground connections. Resolve each ramp/intersection and grade-separated crossing
   explicitly; never connect roads solely because their plan lines intersect.
3. Model continuous curved surface width, edge barriers, banking/grade where
   supported, full-body collision and water exclusion without endpoint teleports.
4. Integrate surface-aware routing, vehicle height/pitch and camera occlusion.
   Validate both directions, all entry/exit transitions and underpasses manually
   and at multiple frame rates on desktop and mobile.
5. Publish changed geography as a new immutable snapshot. Preserve every existing
   dataset URL and retain clear coverage and illustrative-geometry disclosures.

V0.5 establishes the isolated surface/connection foundation. It does not complete
Cambie reconstruction, terrain ingestion or production bridge acceptance.
