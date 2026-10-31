# V0.3 browser validation — 2026-10-31

Actual captures from running local production/development builds and the public
website, using the in-app browser. Captures 20–22 show the corrected public release
after the profile route fix. Capture 20 replaces a paused-background-tab capture
from the rejected activation; the current image visibly renders the live scene.
Models are original procedural reference reconstructions, not reference photographs.
Desktop: 1280×720. Phone: 390×844 and 844×390. Tablet: 768×1024.
Physical-device testing has not been performed.

## Verified interactions

- First/third-person movement, arrow turning, running, avatar appearance persistence.
- Map click and keyboard pin, safe Go here travel, Guide me route, remaining distance,
  arrival and off-route states. Mobile map travel and 239 m Nest guidance confirmed.
- Orchard exterior-to-interior traversal, anonymous encounter followed by identity
  disclosure/conversation, stairs and a demonstration room.
- Rose physical entry and training aisle, encounter/conversation with Mitch Hodge.
- Nest entry, first staircase to Level 2, outside gallery into Great Hall, clickable
  fictional biodiversity exhibit; main-floor Blue Chip panel with official links.
- Hennings physical entrance, public lobby and classroom centre aisle.
- War Memorial physical entrance, circulation around bleachers and basketball court.
- Baseball field access around grandstand, practice players and West 16th traffic.
- Public profile immediate publication and edit in a disposable local store; owner
  cookie persisted across reload. No recovery codes appear in captures.
- Phone turn/movement controls, appearance form, map actions and GPS; tablet profile
  management. No horizontal page overflow at the three tested responsive sizes.
- Reduced-motion control pauses ambient animation; automated trajectory tests also
  verify frozen positions. Names are absent from the directory and map.

Aerial depth precision was corrected after visible surface flicker was found. Gym
lighting and canopy overlap were corrected before capture 11. Current gym snapshot:
37 FPS, 2,544 draw calls, 2,491,208 triangles in this browser at Auto quality. This
single observation does not certify sustained performance or meet a 60 FPS claim.
Historical development syntax errors were fixed; a fresh local production-build
browser tab reported zero console errors or warnings after starting the scene and
switching to third person. Public release checks are recorded in the production receipt. Not every streamed character or activity was individually
encountered in browser; bounded movement/source coverage also has automated tests.

## Gallery

- [01 anonymous encounter](01-anonymous-encounter.png)
- [02 conversation](02-conversation.png)
- [03 customized third person](03-customized-third-person.png)
- [04 rose exterior](04-rose-exterior.png)
- [05 rose coach encounter](05-rose-coach-encounter.png)
- [06 rose training interior](06-rose-training-interior.png)
- [07 public profile form](07-public-profile-form.png)
- [08 nest great hall](08-nest-great-hall.png)
- [09 blue chip](09-blue-chip.png)
- [10 hennings classroom](10-hennings-classroom.png)
- [11 war memorial basketball](11-war-memorial-basketball.png)
- [12 phone third person](12-phone-third-person.png)
- [13 phone appearance](13-phone-appearance.png)
- [14 phone gps](14-phone-gps.png)
- [15 tablet public profile](15-tablet-public-profile.png)
- [16 baseball precinct traffic](16-baseball-precinct-traffic.png)
- [17 baseball practice](17-baseball-practice.png)
- [18 snowfall campus](18-snowfall-campus.png)
- [19 rainy winter night](19-rainy-winter-night.png)
- [20 corrected public V0.3 third person](20-live-v03-third-person.png)

- [21 live public profile form](21-live-profile-form.png)
- [22 live walking guide](22-live-walking-guide.png)

Snowfall and rainy-night controls worked without console errors. Bespoke roof and
field snow coverage remains incomplete; these captures do not imply universal
seasonal material coverage.

The final public pass also verified safe map travel and zero console errors/warnings.
Profile recovery and ownership were tested over actual HTTPS on both hostnames;
the gallery contains no recovery code or owner cookie. See the
[production receipt](../../UBC_CAMPUS_LIFE_RELEASE_2026-10-31.md).
