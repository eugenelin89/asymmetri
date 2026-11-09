# Case Western Reserve Virtual Campus

Independent browser campus at `/labs/cwru`, adapted from the MIT-licensed UBC explorer. Run `npm run dev:next -- --webpack --port 3031` and open the route; run `npm run test:cwru` for campus and Halloween movement checks. No new dependencies. The optional public-profile API uses its own private CWRU store; see `docs/CWRU_COMMUNITY_OPERATIONS.md`.

The breadcrumb, in-game return link and Project information badge use the central `gisApps` name/path: Virtual Worlds at the unchanged `/labs/gis` destination.

## Exploration

WASD walks, Shift runs, arrows/drag turn, V switches first/third person, E interacts and M opens the map. Touch controls provide walking, turning, running and interaction. Closing a panel with its close button or Escape restores keyboard movement; text fields remain editable while panels are open. The welcome screen includes a prominent running instruction card. In walking views, the bottom hint emphasizes “Hold Shift to run” with larger type and a keycap; touch controls use a contrasting “Hold to RUN” button. Help gives Run its own entry. See `docs/CWRU_RUN_CONTROLS_2026-10-31.md` for validation and release status. The directory offers entrance travel and source-graph guidance. Appearance, photo mode, weather, Cleveland seasonal daylight, aerial view, reduced motion and optional population use the existing explorer conventions.

The pinned OpenStreetMap snapshot contains 1,068 building footprints, 3,916 trees, 2,145 pedestrian route ways, 431 entrance nodes and 1,039 roads. Coordinates are local metres around 41.504° N, 81.608° W. Source hashes, request bounds, licensing and omissions are in `public/cwru/v0.1-2026-10-31/manifest.json`. The importer is `tools/compile_geography.py`.

## Buildings

Seventeen buildings have connected furnished public or demonstration interiors: Kelvin Smith Library, Tinkham Veale, Peter B. Lewis, Adelbert, Amasa Stone Chapel, Sears think[box], Strosacker Auditorium, Veale/Horsburgh, Clarke Tower, Village House 4, House 3A clocktower/cafe, Mather House, Gund Hall, Samson Pavilion/nursing, Celeste Biomedical Research/medicine, the Dental Clinic, and Mandel. DiSanto Field adds field markings, goals and supported bleachers.

`architecture.ts` creates original procedural models. `footprint-context.ts` retains the full mapped source outline around conservative furnished cores. All supported stairways have matching floor openings, ramps and collision. think[box] has seven connected levels; Clarke demonstrates a lobby plus an eight-person suite with three doubles, two singles and a shared washroom. Clarke includes six usable doors and a working two-stop platform lift, with matching floor openings and a suite guide. These mechanisms are demonstration reconstructions. The clocktower belongs to House 3A, not House 4.

These are source-informed reconstructions, not photogrammetry or surveyed digital twins. Main silhouettes and public room functions use the linked references, but roof shapes, heights, materials, furnishings, doorway alignments and much of the internal circulation remain interpretations. Surrounding source wings are exterior-only. Some academic interiors are generic teaching spaces. Terrain is flat. See `architecture-sources.json` for per-building evidence and limits. Disconnected source routes return unavailable guidance rather than drawing through buildings.

## Campus people

`data/people.json` records 13 faculty from public university department pages, eight athletes from public 2026 rosters and 12 students from publicly search-indexed LinkedIn excerpts. Direct LinkedIn profile fetching was blocked; the indexed education statements are not independent enrollment verification. Source URLs, access method and dates accompany records. No private directory, contact details, scraped portraits or actual locations are included.

The sanitized 500-row research import in `data/students.json` enriches five existing records and adds 495 distinct names, giving 528 named people: 13 faculty, eight retained athletes and 507 students. All 500 supplied names were corroborated on university pages, with source status/hashes and fallback attribution in `data/student-source-audit.json`. Study fields found on 434 source pages do not establish individual degrees or current enrollment; 66 retain supplied-research attribution. `tools/import_students.py` excludes contacts and portraits. At most ten university characters and two player characters render at once.

Original generic avatars, dialogue and walks are fictional simulations near relevant academic zones. They do not reproduce likeness, voice, real schedules or current whereabouts. One fictional guide and ambient students complete the scene. Conversations are source-bounded, encounter-only and decline private-location questions. There is no people locator. Players can publish their own profile and current avatar appearance, choose a virtual meeting area, edit or delete their character, recover ownership with a private code, and report another public profile. Public characters refresh every 60 seconds. CWRU uses separate endpoints, storage and cookies from UBC; publishing requires `CWRU_PROFILE_DIR` on the host.

## Reviews and play reporting

The deployed follow-up integrates the shared review form above the footer. At the owner's subsequent request, the Play privacy panel and recording checkbox are removed from both the landing page and Project information; a plain policy link remains. Reviews describe this virtual experience and support owner editing/removal and reporting. Play recording requires a started, ready, visible game and recent input, honors existing opt-outs and browser privacy signals, and stays separate from profiles and reviews. The private backend counts browser capabilities, not verified people. See `docs/CWRU_COMMUNITY_INTEGRATION_2026-10-31.md` for implementation acceptance, and `docs/CWRU_COMMUNITY_RELEASE_2026-10-31.md` for the verified production rollout. See `/labs/campus-privacy` for collection and retention details.

## Campus editions and atmosphere

Automatic follows the Cleveland calendar. Halloween runs October 24–November 7
each year. Christmas runs November 8–December 31, 2026. The 2026 Regular override
expires at local midnight January 1. Choose either holiday replay at the welcome
or in Atmosphere to explore it for the current visit.

Live uses current Cleveland daylight and a recent nearby National Weather
Service station report. Atmosphere displays the station, observation time and
age. Changing the weather, hour or season in Photo or Atmosphere stages a
Simulated scene. It stays in place when walking resumes. Select Live to return
to current conditions. The historical 19:30 overcast sky is a Halloween preset.

The Christmas route begins at Kelvin Smith Library and reaches the Tinkham Veale
commons. Decorations continue inside, with brighter exterior lights through
twilight. [Three-campus implementation and acceptance](../../docs/CAMPUS_CHRISTMAS_2026.md).

### Halloween

Sixteen original types roam clear mapped outdoor paths: werewolf, lizard creature, jiangshi, zombie, vampire, ghost, skeleton, witch, mummy, pumpkin knight, comic hero, masked vigilante, manga ninja, manga swordsman, robot and mecha. Their silhouettes, colors, speeds, gait and bob differ. Jiangshi extend their arms and hop; robots have box bodies and face panels; mecha wear angular armor. No external character art is used.

The source graph supports 128 generated actors, spread across campus. Visible population caps are 32/64/90/110/128 for low/medium/auto/high/ultra, with distance culling and near/far meshes. All costumes share 50 instanced meshes. Actors yield to visitors and each other, stay out of buildings and freeze with reduced motion. Population off hides them while decorations remain. Pumpkins, ghosts and cobwebs decorate supported interior floors.

An optional Friday-the-13th-inspired hockey-masked outdoor pursuer carrying a prop knife follows connected paths, waits outside buildings and stops short. It does not attack or cause damage. Failed route searches are throttled. Its toggle is independent of the seasonal atmosphere.

The original Halloween score, wolf howls, nearby ghost cries and howl preview use
Web Audio. Campus sound starts with an entry or sound gesture. Weather can be
heard in Regular. Light sleigh bells jingle occasionally along the Christmas walk. Mute and
volume apply across editions and survive a return visit, including migration of
the existing CWRU sound preference. Hidden tabs suspend playback. The optional
Audio Session playback role supports iPhone Silent Mode. [Earlier iPhone audio
validation](../../docs/CWRU_IPHONE_AUDIO_2026-10-31.md).

## Validation and release

See `docs/CWRU_CAMPUS_2026-10-31.md` for checks and limitations. V0.1 is live at [asymmetri.co/labs/cwru](https://asymmetri.co/labs/cwru). The [production receipt](../../docs/CWRU_RELEASE_2026-10-31.md) records exact-source CI, public/profile/browser checks and recovery evidence. The [community release receipt](../../docs/CWRU_COMMUNITY_RELEASE_2026-10-31.md) records the live larger running instructions, reviews/reporting and panel removal at exact b360. Preserve the UBC project and all shared protected product routes.
