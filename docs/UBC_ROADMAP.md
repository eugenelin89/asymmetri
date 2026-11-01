# UBC Virtual Campus — Flagship Development Roadmap

**Project:** Asymmetri Labs / Campus and City / UBC Virtual Campus  
**Planning horizon:** 2026–2027 and beyond  
**Roadmap created:** November 1, 2026 (America/Vancouver)  
**Repository:** [eugenelin89/asymmetri](https://github.com/eugenelin89/asymmetri)  
**Live experience:** [asymmetri.co/labs/ubc](https://asymmetri.co/labs/ubc)  
**Baseline reviewed:** main at 287c23ea08b19c3e1d6a4ca4692c6728ae748745  
**Status:** Proposed living roadmap, not a claim that future releases are built, scheduled, or deployed.

> **North star:** Build an exceptionally convincing, independent, browser-accessible virtual visit to UBC Vancouver. Recognizable real geography, beautiful architecture, walkable documented public spaces, and useful student information take priority over feature count.

UBC Virtual Campus is the **flagship experiment** of Asymmetri Labs. Vancouver, Richmond, Surrey, Stanford, and Case Western are complementary experiments and potential consumers of reusable platform improvements. UBC remains separately owned in its project thread; do not rewrite peer-campus code in pursuit of this roadmap.

## 1. Purpose and product principles

A prospective student, family member, alumnus, or visitor should be able to spend 30–60 minutes exploring UBC, understand its geography, recognize major buildings, compare campus living and learning environments, and enjoy walking through a compelling Vancouver landscape.

The experience is a **virtual campus visit**, not a conventional game: no missions, scores, combat, or mandatory tasks. Optional seasonal and creative experiences can coexist, but the ordinary campus must remain believable, calm, and easy to explore.

Principles:

- **Realism before expansion; quality before quantity.** A carefully reconstructed neighborhood beats hundreds of anonymous buildings.
- **Geography first.** Preserve verified building positions, orientation, paths, entrances, scale, and later the real terrain elevation.
- **Honest fidelity labels.** Separate verified geometry, reference-based reconstructions, and illustrations. Do not describe the current project as an as-built digital twin.
- **Real interiors where supported.** Prioritize fully navigable public spaces; demonstrate typical student rooms without revealing or claiming to reproduce occupied private rooms.
- **A visitor-first interface.** Walking, third-person, aerial and map views must remain intuitive on desktop and phones.
- **Performance is a feature.** Favor stable movement and asset streaming over unbounded scene complexity.
- **Evidence and rights matter.** Track official source links, source dates, accuracy, and licenses; distinguish simulated conversations from a real person's statements.
- **Release finished increments.** Each independently validated milestone goes live promptly under existing guarded production and rollback procedures.

## 2. Current verified repository baseline

This summary describes the repository and dated release evidence at the baseline above, not independently re-executed production acceptance.

| Area | Baseline evidence | Remaining gap |
| --- | --- | --- |
| GIS and navigation | Real UBC GIS snapshot, pedestrian routes, walking/third-person/aerial/map, wayfinding | Terrain is simplified/flat in important areas; source entrances need more field validation |
| Baseball stadium | Tourmaline West Stadium field, grandstand, dugouts and bullpens represented | Bespoke architecture, scale, landscaping, lighting and photographed-reference comparisons |
| Rose Indoor Training Centre | Navigable reference-based batting/pitching facility | Architectural fidelity, current floor-plan certainty and material detail |
| Libraries | Irving K. Barber has enterable reconstructed public levels | Koerner is exterior-only; IKB still needs closer facade/interior validation |
| Iconic landmarks | Giant UBC entrance letters represented | Ladner Clock Tower not implemented; Main Mall and entry setting need higher fidelity |
| Student life | Bookstore, AMS Nest and Sauder have enterable reconstructed public areas | Sauder lecture spaces/office exhibit and broader documented public floors are future work |
| Residences | Orchard Commons MVR: one demonstration floor, 8 bedrooms, 5 bathrooms, 16 working doors, shared areas, lift, 3 fictional students | Not a survey or full residence; further residence types, realistic furnishing, measured geometry |
| Campus characters | Sourced faculty/athletes, fictional and supplied-research student encounters, source-based dialogue | Stronger real-person permissions, source verification and corrections/removal process |
| Seasons / events | Seasons, weather, Halloween mode and iPhone audio correction | More realistic vegetation, snow and lighting; sustained device-performance validation |
| Shared services | Public reviews, private visit-duration reporting, operator CLI | Privacy/compliance and retention review, safety of moderation, responsible analytics |
| Release discipline | Documented exact-source CI, health checks, rollback and production receipts | Keep source/production distinction and update stale README claims |

The [landmark fidelity registry](../projects/ubc/landmark-fidelity.json) is the machine-readable source of implementation status. [UBC project README](../projects/ubc/README.md), [Orchard MVR report](UBC_ORCHARD_MVR_2026-10-31.md), [campus life report](UBC_CAMPUS_LIFE_V03.md), and [audio release evidence](UBC_AUDIO_IOS_2026-10-31.md) provide the supporting details.

**Important:** Existing interior models are classified as reference-based reconstructions (Level B), not surveyed as-built interiors. Artistic quality, real-world accuracy, and operational accessibility are distinct acceptance claims.

## 3. Milestones and sequence

Versions V0.5–V1.1 below are **proposed milestones**. Codex must reconcile them with the actual release history before tagging. Dates are indicative sequencing, not deadline promises; do not renumber or overwrite already-published versions.

| Milestone | Outcome | Priority | Dependency |
| --- | --- | --- | --- |
| **V0.5 — Performance and terrain foundation** | Reproducible engine metrics, selective elevation prototype, stable streaming/rendering base | Critical | Current code audit |
| **V0.6 — Baseball precinct showcase** | Recognizable, visually excellent stadium and Rose Centre | Critical | V0.5 performance budget |
| **V0.7 — Historic academic core** | Ladner Clock Tower, Koerner walkable interior, improved IKB and Main Mall | Critical | Shared building and terrain systems |
| **V0.8 — Academic interiors and residence life** | Deeper Sauder, Nest, Bookstore and next representative housing type | High | V0.7 visitor navigation |
| **V0.9 — Landscape, culture and campus expansion** | Rich UBC ecology and coherent routes between landmark zones | High | Terrain, source/licensing |
| **V1.0 — Flagship visitor experience** | Polished, tested, credible prospective-student tours | Critical | Previous major gates |
| **V1.1+ — Research-grade extensions** | Enhanced measured geometry, optional collaboration, VR/WebXR if justified | Long-term | V1.0 reliability |

Deliver each milestone as small independently testable releases where useful; a version number does not excuse incomplete or broken work. Track what is shipped, measured, reconstructed, and deferred.

## 4. V0.5 — Engine, terrain and performance foundation

**Goal:** Make better architecture and vegetation practical without destabilizing the existing virtual campus.

Work:

1. Profile frame times, FPS distributions, draw calls, triangle counts, GPU/CPU memory where measurable, asset loading and scene transitions in stadium, Orchard, Nest, IKB and Halloween scenes.
2. Establish reference desktop, laptop, and physical-phone devices; capture exact browser, resolution, quality level, date and scene path. Distinguish shared-machine development contention from sustained production performance.
3. Prototype properly sourced digital elevation / LiDAR in **one** local test zone. Preserve source-derived sidewalks, collision floors, entrances, door thresholds, accessibility cues and pedestrian paths. Do not apply a campus-wide height transform until this area passes.
4. Improve LOD, batched/instanced geometry, shadow quality scaling, textures, interior streaming, frustum/occlusion strategies and disposal instrumentation.
5. Reduce unnecessary coupling in oversized runtime/UI modules (including Campus.tsx) without changing visitor controls.
6. Add fixed-camera before/after render captures and a small performance acceptance matrix.

**Exit gate:** Comparative device measurements and no critical navigation, scene-loading, resource disposal or peer-app regressions. The terrain prototype must be independently reversible.

## 5. V0.6 — Baseball precinct visual showcase

**Goal:** Make the original baseball-area concept an unmistakably UBC landmark.

**Tourmaline West Stadium:** source-aligned field and infield/outfield surfaces, mound, plate, bases, netting, grandstand, press box, dugouts, bullpens, fences, scoreboard, lights, landscape and natural field-level scale.

**Rose Indoor Training Centre:** recognizable timber and cladding, roof and glazing, entrance, batting cages, pitching area, turf, screens, equipment and convincing indoor lighting. Resolve conflicting historical/current equipment descriptions from the newest appropriate sources.

**Visitor journey:** keep the general start at the giant UBC letters and offer an explicit **Baseball Tour / Start near West 16th Avenue** destination. The baseball precinct must connect to source pedestrian routes.

**Exit gate:** Actual running-application captures from home plate, mound, grandstand, stadium entry, Rose exterior/interior at noon, evening and nighttime; comparisons to documented architecture; stable travel and indoor collision.

## 6. V0.7 — Iconic academic core

**Goal:** Make the historical and academic center immediately recognizable.

- **Ladner Clock Tower:** bespoke concrete tower, verified proportions, visible clock faces with hands following the selected virtual time; honest historical information, no fictitious public tower access.
- **Walter C. Koerner Library:** replace exterior-only GIS context with recognizable facade and publicly documented, walkable lobby, reading, service and circulation spaces. Validate stairs/levels rather than repeating generic rooms.
- **Irving K. Barber Learning Centre:** refine heritage Main Library facade, Chapman Learning Commons, Ridington reading room, public levels, windows, material treatment and observed entrances.
- **Main Mall and UBC entrance:** improve giant freestanding letters, real surrounding paths, trees, signage, street furniture, shadowing and natural sightlines.
- **Library information:** make displays and official UBC links useful and unobtrusive.

**Exit gate:** Ground/aerial visual comparisons for all four headline landmarks; both libraries walkable at their documented supported public levels; actual functional and performance tests.

## 7. V0.8 — Academic interiors, student life and residences

**Goal:** A prospective student can explore how studying and living at UBC may feel.

- **Sauder / Henry Angus:** enlarge the representative public learning environment with research-based classrooms, lecture halls, seminar and gathering spaces. Place Dr. Greg Werker in a **clearly labeled educational virtual office exhibit** only where public evidence supports the location. Verify HA 479 before presenting it as a current office number; never imply authentic private possessions or current office hours.
- **AMS Nest:** refine the actual spatial experience of the atrium, stairways, public upper levels, study spaces and food/student-service points.
- **Bookstore:** improve architectural details, shelving, merchandise and official clickable store links; no invented live inventory.
- **Orchard Commons:** enhance the eight-room demonstration floor and realistic furniture/finishes using permitted reference material. Never equate fictional rooms with occupied real rooms.
- **Next residences:** use the tested door, lift, room and student-dialogue framework for one representative first-year floor at Totem Park or Place Vanier, then add an upper-year suite type such as Brock Commons or Ponderosa Commons.
- **Student conversations:** prioritize factual housing, application, service and academic information; label fictional student experiences as fictional.

**Exit gate:** Visitors can walk in/out, compare actual documented room types, ask useful questions, find official details, and recover keyboard controls without getting stuck.

## 8. V0.9 — Vancouver environment, heritage and campus connections

**Goal:** Make the entire walking experience feel naturally like UBC Vancouver.

Priority locations: Rose Garden, Chan Centre, Museum of Anthropology, Beaty Biodiversity Museum, Reconciliation Pole, Nitobe Memorial Garden, UBC Botanical Garden, Thunderbird Park and selected connections to Pacific Spirit Regional Park.

Improve tree placement and species, fall leaves, evergreen/deciduous differentiation, cherry blossoms where appropriate, real terrain, roof and sidewalk grade transitions, rainy surfaces, fog, plausible snow accumulation, warm/cool daylight and ambient campus sound.

Indigenous cultural locations must be represented accurately and respectfully; source or permission limits take precedence over detailed imitation.

**Exit gate:** Connected visitor routes between key districts; source-backed landmark placement and atmospheric before/after captures in representative seasons, with performant lower-quality settings.

## 9. V1.0 — Prospective-student flagship release

**Goal:** A first-time visitor can navigate and learn without developer assistance.

Three **optional**, walkable visitor routes:

1. **Discover UBC:** entrance letters → Main Mall → Ladner Clock Tower → Koerner/IKB → Nest → academic core.
2. **Study and Live:** Sauder and academic spaces → Bookstore → Nest → Orchard and supported student residences.
3. **UBC Athletics:** West 16th Avenue → Tourmaline West Stadium → Rose Indoor Training Centre → Thunderbird Park.

Polish the default non-Halloween experience, onboarding, directory/search, free walking, aerial/map navigation, accessible input, building information, links and optional photo mode. Consider Traditional Chinese support after the English visit is stable.

**Exit gate:** First-time testers complete the three routes without coaching; no critical crashes, collisions or dead ends; physical device tests, privacy checks, credible source-based information, performance results and a production rollback receipt.

## 10. Long-term V1.1+ possibilities

Only after V1.0's visitor and performance gates are met: verified LiDAR/photogrammetry/BIM import with suitable licenses, public architectural data partnerships, optional official outreach, research-grade terrain and indoor geometry, improved accessibility, or VR/WebXR. These possibilities do **not** represent existing UBC endorsement, available source data, or a current implementation promise.

## 11. Flagship quality scorecard

Record benchmark device/quality settings and evidence links, not just subjective completion percentages.

| Dimension | Target / evidence |
| --- | --- |
| Geography | Key landmark coordinates, orientations, public entrances and walk paths independently checked against sources |
| Architectural fidelity | Before/after reference-to-render comparisons, documented uncertainty and materials |
| Interiors | Enter/exit, public floor connectivity, stair/lift access and working fixture collision |
| Desktop rendering | Aim for 60 FPS on defined capable reference hardware; publish measured sustained results |
| Mobile rendering | Aim for 30 FPS on defined supported phones; measure load time and interaction latency |
| Navigation | Three guided routes and free exploration work end-to-end |
| Stability | No critical regressions, context loss, broken controls, geometry leaks or doorway traps |
| Information | Links work; major facts are sourced, dated and correction-ready |
| Accessibility | Keyboard, focus return, mobile touch, reduced motion, contrast and usable panels |
| Release safety | Exact tested source, production verification, resource floors and complete rollback |
| Responsible representation | Real names, profiles, art, maps and room reconstructions reviewed for consent, rights and truthful labeling |

Establish baseline metrics during V0.5 and compare them after each later milestone.

## 12. Two development tracks

### Track A — Realism and prospective-student utility (primary)

Architectural reconstruction, GIS, terrain, interiors, vegetation, rendering, source-based education and visitor navigation. This track receives the clear majority of effort until V1.0.

### Track B — Creative/seasonal editions (secondary)

Halloween, future Christmas, playful interactions and experimental characters. Keep them opt-in or calendar-appropriate, modular, performant and separate from the ordinary realistic experience. Do not let seasonal features delay the flagship fidelity milestones.

## 13. Source, privacy and intellectual-property governance

- **Building data:** Keep the [landmark fidelity registry](../projects/ubc/landmark-fidelity.json) current with GIS IDs, source dates, licenses, height/massing evidence, reconstruction level, interior coverage, visual comparisons and remaining gaps. Use immutable versioned GIS data snapshots and integrity receipts.
- **Named students and faculty:** The imported 500-person student roster contains substantial supplied-only research rather than full independent enrollment verification. Audit source confidence, names, currentness, representation permissions, simulated locations and correction/removal procedures. Do not imply they endorsed the campus or personally spoke generated dialogue.
- **Housing:** Only representative rooms unless permission and documentation support more. A virtual door is not authorization to access a real residence or private office.
- **Analytics and reviews:** Revisit the policy and legal obligations around IP/browser logging, default collection, deletion, user notice, retention and moderation. Keep ordinary UX uncluttered while ensuring meaningful privacy choices and appropriate safeguards; do not reintroduce a large panel without a separate design decision.
- **Art and fictional characters:** Review UBC marks, cultural artwork and third-party named Halloween superheroes/manga characters. Original geometry alone does not settle character/trademark licensing.
- **Release truth:** Do not conflate source merged to main, CI passed, local browser checked, production activated, live browser verified and physical-device confirmed.

## 14. Release and documentation policy

For each independently completed and validated version, follow:

**Research → implement → source/fidelity review → tests → fixed-camera comparison → performance check → commit → production build → deploy promptly → verify live → document.**

Honor the owner's standing request to deploy successfully completed versions immediately **only through the repository's established authorized, guarded release process**. Preserve peer applications and unrelated services, required server memory/disk floors, immutable source and deployment receipts, private data stores and an immediately usable full rollback. If quality/safety gates fail, leave the last healthy production release in place and report the blocker; do not call an unactivated build "live."

Maintain these documents as the project evolves:

- **This file:** product vision, phases, milestones, acceptance criteria and priorities.
- **[UBC README](../projects/ubc/README.md):** current implemented behaviour, setup and honest limitations.
- **[Landmark fidelity registry](../projects/ubc/landmark-fidelity.json):** per-location measurable implementation state.
- **[Testing documentation](TESTING.md):** real scripts and required checks.
- **[Deployment documentation](DEPLOYMENT.md):** exact active process, guarded release and rollback.
- **UBC implementation/release reports and [validation gallery](validation/ubc/README.md):** dated reproducible evidence.

Potential future files **docs/UBC_FIDELITY_SCORECARD.md** and **docs/UBC_RELEASE_ACCEPTANCE.md** may be added once baselines and the release gates have been measured; do not pretend these documents already exist.

## 15. The next development cycle — five concrete priorities

1. **Performance baseline:** reproducible FPS/frame-time, memory and draw-call measurements in at least stadium, Orchard, Nest and Halloween scenes, with defined devices.
2. **Terrain proof of concept:** integrate one source-backed elevation zone while keeping route, door and collision geometry correct.
3. **Ladner Clock Tower:** implement real-world silhouette and clock behavior with sourced geometry and before/after evidence.
4. **Koerner Library:** acquire/verify architectural references and implement a clearly scoped public interior, with correct entrance/level navigation.
5. **Baseball fidelity backlog:** direct source-photo comparisons for Tourmaline West Stadium and Rose Centre and a prioritized implementation pass.

Do **not** begin this cycle with another bulk character import, generic campus expansion, or unrelated game mechanic.

## 16. Definition of success

The project succeeds when real prospective students find the campus **recognizable, useful, inviting, and reliable** after a complete virtual visit. Key buildings look like UBC rather than generic stand-ins; supported interiors are genuinely navigable; the Vancouver environment feels right; information is sourced; and the experience performs well on tested devices.

**Build fewer things exceptionally well, prove accuracy, ship validated milestones, then extend that foundation to the rest of UBC and the wider Asymmetri Labs platform.**
