# Christmas walk acceptance

The galleries follow the public campus explorers from the welcome through an outdoor landmark and into the named interior. The frames in the three campus galleries come from the explorer’s **Capture PNG** control at the walker’s current first-person position. Each row holds the camera still while the hour and weather change. Columns use controlled **Simulated** conditions. The rain and snow are staging choices.

| Campus | Route | Interior confirmed by the explorer |
| --- | --- | --- |
| [UBC gallery](ubc-walk.jpg) | Gateway letters, University Boulevard, west approach to the Nest | AMS Student Nest · Blue Chip & Great Hall · Level 1 · Reconstructed |
| [Stanford gallery](stanford-walk.jpg) | Oval, Main Quad and arcades, Green Library east entry | Cecil H. Green Library · East Wing · Level 1 · Reconstructed |
| [CWRU gallery](cwru-walk.jpg) | Kelvin Smith Library, north approach, Tinkham Veale entrance | Tinkham Veale University Center · Level 1 · Reconstructed |

## Tested builds

The first full desktop review used local Next production build `72ZvCrCpLBPIY30ZFXo6s`. It exposed weak contrast on the UBC Gateway sign at night. The revised lighting captures came from build `Ul0T8V06BynNeUdSeXiYE` on November 9, 2026 UTC (November 8 in Vancouver). The revised renderer makes the sign face warm gold and casts small pools of light from the lanterns. The three campus galleries show the revised appearance. The same camera comparisons pick out the light on Stanford’s Oval path and beside the CWRU approach trees. In rainy twilight, buildings outside the pools of light remain dark. Tinkham Veale’s bright interior has only a modest change in appearance across the three hours. The [matched outdoor frames](lighting-review.jpg) preserve the earlier result beside it.

## Environment and controls

The desktop viewport was 1,100 × 700 CSS pixels at device pixel ratio 1. The host was an Apple M4 Mac running macOS 26.6.2. Brave Browser 157.1.99.55 (Chromium 157.0.8103.39) used WebGL through ANGLE/Metal. Automatic graphics quality and the operating system’s reduced-motion preference were active. Browser time was fixed at December 10, 2026 at 20:00 UTC, with the visitor in the Europe/London time zone. A fresh visit displayed the campus’s Automatic Christmas edition.

The tester pressed Enter on the welcome, opened Atmosphere with the keyboard, selected Simulated winter and returned to the scene. Tab reached the dialog’s Close control, which had a visible 3 px solid gold focus outline on all three campuses. Shift+Tab kept focus inside the dialog. Escape restored focus to the canvas. A real Arrow Right press changed the first-person heading. The route follower then sent forward, run and turn key events to the canvas and used the explorer’s read-only position to stay on the published walk. It followed the collision system through the ordinary doors, without a position write or map jump. The three captures at each stop use the same heading. Walking resumed after closing Photo.

| Campus | Midday, clear | Civil twilight, rain | Night, snow | Winter preset sunset–last light |
| --- | --- | --- | --- | --- |
| UBC | 12:00 | 17:00 | 22:00 | 16:40–17:16 |
| Stanford | 12:00 | 17:30 | 22:00 | 17:12–17:41 |
| CWRU | 12:00 | 17:30 | 22:00 | 17:19–17:50 |

Times in the table are campus civil times. The Simulated winter preset uses January 15, 2026 for sunlight; the December 10 visit date still controls the edition. At the destination on each desktop route the tester selected Regular, started a Christmas replay, and ended the replay. The status returned to “Regular edition”. The return link opened Virtual Worlds and the explorer canvas left the document. On the subsequent audio build `K6JarmLrax_B93bay0HGt`, a separate check entered each explorer and activated its actual **Return to Asymmetri Virtual Worlds** link. All three navigated to `/labs/gis` with HTTP 200, displayed the Virtual Worlds heading, left zero canvases, and produced no JavaScript exception.

## Touch traversal

The 390 × 844 phone and 820 × 1,180 tablet runs used Brave’s coarse-pointer, touch-enabled emulation at device pixel ratio 1. The tester tapped the Christmas welcome, selected **Midday** and **Clear** in Atmosphere, then sent browser touch contacts to the visible forward and run controls. Turning used the turn pads or a drag on the canvas. Both form factors requested reduced motion, and each campus’s **Reduce animated movement** checkbox was checked. The campus HUD identified the interior, and the tester left through the Virtual Worlds link. These sessions measure input and collision on the desktop browser. The [physical Safari receipt](iphone.md) records the matched frame times, real touch inputs and listening results.

| Campus | Published turns and destination after arrival | Phone | Tablet |
| --- | ---: | --- | --- |
| UBC | 13 | Interior reached | Interior reached |
| Stanford | 22 | Interior reached | Interior reached |
| CWRU | 8 | Interior reached | Interior reached |

The [six interior screenshots](touch-destinations.jpg) show the destination status and touch controls. The 820 px UBC capture exposed a toolbar overlap at the end of “Reconstructed” in the Nest’s long location label. A UBC-only CSS follow-up reserves separate columns for the label and toolbar from 701 through 1,000 px. A browser check using the measured Nest label at 701, 820 and 1,000 px left an 8 px gap with zero horizontal overflow. Repeating the 820 × 1,180 touch walk on the local development server reached the Nest and verified an 8 px gap between the location and toolbar boxes at the actual destination. The replacement frame shows the complete, wrapped “Reconstructed” label. The other five touch frames and all 27 first-person gallery captures came from the optimized visual build identified above.

The first Stanford tablet run on the pre-review build grazed a Main Quad obstacle near virtual coordinates (62, 22). Repeating from the welcome, steering along the published route with touch-look and a 0.20 m checkpoint tolerance walked through the arcade and into Green Library. The rerun used the same geometry and ordinary collision. The pre-review CWRU tablet run reached the commons as the local server was stopping; its return navigation received a connection refusal. The revised-build CWRU tablet run reached the same room and returned successfully.

## Renderer cleanup

A second pass counted native WebGL 2 buffer, program, texture and vertex-array allocations and deletions at the stationary arrival view. Each campus started in Regular and started and ended Christmas replay three times at clear midday. A fresh run repeated those three cycles at clear night, when the lanterns cast light on the ground. All four live counts returned to their respective Regular values after **all 18 cycles**. The table gives the daylight baselines.

| Regular arrival | Buffers | Programs | Textures | Vertex arrays |
| --- | ---: | ---: | ---: | ---: |
| UBC | 3,204 | 17 | 115 | 1,455 |
| Stanford | 2,025 | 18 | 18 | 1,277 |
| CWRU | 2,725 | 14 | 23 | 1,593 |

## Community access and console

On all three routes the directory’s **Create or manage my character** action opened “Join the campus.” The local walk server had its profile and review stores disabled. The review section displayed “Reviews are not enabled on this host yet.” The browser console recorded HTTP 503s for store reads. The walks completed without a JavaScript exception or WebGL error.

A second loopback server ran each production build with isolated, empty review and profile directories. Each campus returned HTTP 200 on its review list, public character list and current profile read. **Write a review** exposed the form’s two text fields, and the in-game **Public name** field was editable. All three checks ended with zero console errors. No profile or review was submitted. The temporary server was stopped and its stores removed.

## Geography and image rights

Asymmetri authored the procedural campus scenes and seasonal geometry. UBC placement uses UBC Campus + Community Planning data under PDDL. Stanford and Cleveland placement uses © OpenStreetMap contributors under ODbL 1.0. These are independent virtual reconstructions. Each 1,536 × 1,172 JPEG combines nine whole first-person renders with labels and proportional resampling. The frames retain their original colours and geometry. [Walk definitions and notices](../../CAMPUS_CHRISTMAS_WALKS.md) · [Weather station, provider and outage evidence](../../CAMPUS_WEATHER.md) · [Asset manifest](../../ASSET_MANIFEST.md)
