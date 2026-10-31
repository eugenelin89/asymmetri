# Asymmetri asset manifest

Last updated: 2026-10-08

This internal provenance record covers public assets. Local images are not hotlinked. Optional third-party videos are described below. The
owner has explicitly approved public visibility of the cap logo and uniform
lettering in the selected hero photograph.

## Owner-supplied baseball photo review

The complete owner-supplied baseball folder was recursively inventoried before
selection. Ninety-six eligible still images were reviewed across eight temporary
contact sheets outside the repository. Source extensions were JPG and PNG; image
decoding encountered JPEG, MPO-encoded JPEG, and PNG content. All 96 files opened
successfully, with no unsupported or unreadable images and no exact binary
duplicates.

Perceptual-hash review identified four near-duplicate groups: one two-image
Baseball IQ screenshot pair, two two-image photography pairs, and one 13-image
practice-calendar screenshot sequence. Near duplicates were not treated as
independent visual candidates.

Five photographs reached the final shortlist:

| Source filename | Why it was considered |
| --- | --- |
| `55403450761_e8025f7edf_o.jpg` | Ball release is visible, the mound reads immediately, and the left side provides unusually strong negative space. |
| `55403627994_46ea9658a7_o.jpg` | Selected: one pitcher, visible ball and follow-through, strong mechanics, clean field background, no bystanders, and flexible desktop/mobile composition. |
| `55421863401_7666a0c7ed_o.jpg` | Powerful full-body stride and clear pitching mechanics, but a bystander, readable uniform identity, and number reduced its privacy suitability. |
| `55422258655_ec6b33d8b1_o.jpg` | Strong full-delivery frame with useful negative space, but a bystander, venue signage, and team marks weakened the public-site fit. |
| `55422258760_926c28586c_o.jpg` | Dynamic follow-through and complete body position, but the background signage, bystander, and less controlled framing added distraction. |

One photograph was selected. A second image was rejected because none added a
distinct slow-motion review, sensor, or coaching moment without introducing
private screens, group context, visible organizations, or redundant pitching
action.

## Selected hero photograph

| Field | Record |
| --- | --- |
| Destination | `public/images/baseball/pitching-delivery.webp` |
| Original source filename | `55403627994_46ea9658a7_o.jpg` |
| Source dimensions | 4608×3072 |
| Output dimensions | 2400×1600 |
| Output format and size | WebP, quality 86, 1,176,976 bytes |
| Processing | Existing restrained desaturation, slight contrast increase, and slight exposure reduction preserved; high-quality Lanczos source resize used to restore the real cap logo and uniform lettering through two localized feathered regions; no privacy blur remains; EXIF and ICC metadata omitted |
| Public role | Preserved authentic photograph; `/sport` hero |
| Alt text | A pitcher follows through on the mound as the baseball travels toward the plate. |
| Privacy assessment | One pitcher, no bystanders, no signage, and no private screen or document; cap and uniform marks are visible with explicit owner approval |
| Reason selected | The image communicates pitching mechanics, effort, and development immediately while providing a focused, premium composition that works in a wide desktop panel and a full-width mobile crop |

The source file remained untouched. Temporary thumbnails, contact sheets,
coordinate-review images, and inventories were created outside the repository
and were not committed.

## Brand and social assets

The existing raster favicons, app icon, and unused `public/og.png` remain
unchanged. The rendered brand mark remains the established Asymmetri Labs mark.
The updated plain UTF-8 `public/og.svg` is a 1200×630 vector-only social preview
using the baseball positioning, sans-serif typography, near-black palette, and
single orange accent. It contains no `<image>` element, photograph, base64 data,
remote URL, or external font.

## Retained but no longer rendered

- `public/images/sports/baseball-running-action.webp`
- `public/images/research/wearable-sensor-prototype.webp`
- `public/images/research/systems-workbench.webp`
- `public/og.png`

These existing assets remain unchanged in the repository. Their code references
were removed because the public site now uses one pitching photograph. No
product screenshot, research plot, workbench image, sensor image, team photo, or
second baseball action image is rendered.

## Original Motion product identity, September 16, 2026 (superseded)

The initial website introduction used the owner-approved **A Release** artwork.
Both files remain as unreferenced historical identity variants after the
pitcher-family refresh below. They are byte-for-byte copies from the read-only
product reference; no app repository file was modified and no exporter was run there.

| Public file | Exact source in the Motion reference | Dimensions and processing | Role / alt text / rights |
| --- | --- | --- | --- |
| `public/brand/motion-release.svg` | `docs/design/release-brand/source/A-release-default.svg` | 1024×1024 viewBox; original vector copied unchanged; CSS corner mask in page only | Homepage introduction and `/motion` hero; “Asymmetri Motion icon: an overhand pitcher and released ball on deep teal.” Original task-authored geometry, no stock/private media/font; owner approval in Decision 51 and release-brand README. Approval does not claim trademark clearance. |
| `public/brand/motion-release.png` | `ios/AsymmetriMotion/AsymmetriMotion/Assets.xcassets/AppIcon.appiconset/AppIcon-default.png` | 1024×1024 opaque packaged export, copied unchanged | `/motion` Open Graph/Twitter image; same description and rights as SVG. Raster format for social consumers. |

Source snapshot inspected locally: `c74cfaa30c17a6c4be96502205e6e8a653faf782`.
The source and packaged hashes are respectively:

- SVG SHA256: `0a4d7d23202fa05087c80a0b50170581a698d3dc769e6b1ac3216ecd16bd664e`.
- PNG SHA256: `54d306f9456c954be7609cde4a902b05e1ea4c8ea06e22568a0ff7b0b0faf16a`.

The existing `public/og.svg` remains a 1200×630 local vector social preview.
Only its description/support line changes to introduce Motion and evidence that
supports coaching. Its original geometry and company palette remain intact.
No source photo, remote resource, font dependency or new rights requirement is
introduced. The main hero photograph is byte-identical to the preceding commit.

### Interface/media publication assessment

The V1 visual README and continuation render index identify engineering captures
of generated fixtures; the Store screenshot plan does not grant automatic
marketing approval. Earlier tutorial UI can differ from current V1, including
measurement visibility. The September 10 marketing videos use private real footage
and retained-device captures and remain local. No screenshot or video was copied.
No fixture number is presented as real or validated biomechanics. No private athlete
name, history, team context, notification or identifying app data is published.

`components/evidence-chain.tsx` is semantic HTML/CSS, not an image asset or a
reconstruction of an app screen. Its six steps explain the public workflow with
text and list order; there are no athlete illustrations or invented values.
B/C icon alternatives, dark/tinted variants, Store templates and white-paper files
are not added to the public site. No existing asset is removed.

## Current Motion pitcher-family identity, September 16, 2026

The owner requested that the website match the app's changed artwork. Accepted
Motion Decision 52 and the current release-brand README supersede the A Release
choice with the pitcher family. Only the default app icon is needed for the
website's existing image placements; Back/Side capture-card illustrations and
dark/tinted variants are not copied.

| Field | Record |
| --- | --- |
| Public file | `public/brand/motion-pitcher.png` |
| Exact copied source | `ios/AsymmetriMotion/AsymmetriMotion/Assets.xcassets/AppIcon.appiconset/AppIcon-default.png` in the read-only Motion reference |
| Original master | `docs/design/release-brand/source/pitcher-family/icon-default.png` |
| Source snapshot | `cd414dbb0d4eef913fa4058e629e7afaa23be68a` |
| Generation provenance | Built-in image_gen, September 16, 2026, Motion Prompt 62; owner's seven concept images informed the new illustration. Exact prompts are preserved in Motion `docs/design/release-brand/GENERATION_PROMPTS.md`; export settings/hashes are recorded in its `render.cjs` and `asset-manifest.json`. No generation or export was rerun for the website. |
| Dimensions / format / size | 1024×1024 opaque sRGB PNG, 1,022,578 bytes |
| Processing | Packaged export copied byte-for-byte. Existing Next.js Image optimization supplies page sizes; existing CSS supplies corner masking. Social metadata uses the original PNG. |
| SHA256 | `d0a00a3991990aefd499a50c6cf0d69d51e1ef9d52a2fc3820c0cb321b98aa56` |
| Public role | Homepage Motion introduction, `/motion` hero, and Motion Open Graph/Twitter image. New URL avoids reusing the former identity's cache key. |
| Alt text | Asymmetri Motion icon: an illustrated pitcher in a high-knee windup, framed by a teal motion arc. |
| Rights / privacy assessment | Owner-requested, accepted generated illustration; raster artwork with a vector illustration appearance. No real athlete photo, private app screen/data, jersey identity, imported logo, font or stock image. The pose is illustrative identity, not prescribed technique or scientific evidence. No trademark clearance is claimed. |

`motion-release.svg` and `motion-release.png` are retained historical variants
with no current page or metadata references. The company logo, favicons,
`public/og.svg`, and authentic hero photograph remain unchanged.


## Motion tutorial publication, September 16, 2026

The owner expressly authorizes current retained pitching media inside genuine
Motion screenshots for this tutorial. This narrowly supersedes the earlier
no-interface-publication assessment for the following assets only. All other
private-source exclusions remain. `TUTORIAL_REVIEW.md` records source authority,
coverage, capture actions and omissions. `TUTORIAL_MEDIA.md` records complete
generation prompts, methods, media identifiers and privacy/rights review.

Use authentic app screenshots for safely reachable software states. Use clearly
instructional generated illustrations for real-world physical actions that should
not be recreated solely for tutorial capture. No app screen or result is generated.

All paths below are in `public/images/motion/tutorial/`. Screenshots are lossless
PNG crops of fresh 410×898 Mirroring captures of app 1.0 (1), without UI/value
retouching. Crop coordinates are x, y, width, height in original pixels. Each is
rendered responsively with its original aspect ratio and an original-image link.
Each screenshot shares the owner authorization and privacy review above.

| Asset | Dimensions | Source / processing | Public role and alt text |
| --- | --- | --- | --- |
| `acquisition.png` | 370×246 | Current app; crop 20, 422, 370, 246 | The acquisition actions in My Pitches. Choose the path that matches your video. Alt: “My Pitches actions: Explore your pitches, Import Video and Record New Pitch.” |
| `back-setup.webp` | 1536×1024 | Original ImageGen 1536×1024; WebP quality 88 | Back View: place the phone behind the pitcher. Portrait is recommended. Positioning illustration, not calibrated geometry or prescribed technique. Alt: “An upright phone on a tripod behind a full-body pitcher facing the throwing target.” |
| `side-setup.webp` | 1536×1024 | Original ImageGen 1536×1024; WebP quality 88 | Side View: record from beside the pitcher. Landscape is recommended. Leave room for the whole delivery. Alt: “A horizontal phone on a tripod beside a pitcher, with room for the entire stride.” |
| `framing-guides.svg` | 960×650 | Original SVG; no raster processing | The framing guide uses a rectangle and dashed centre line. This diagram follows the current guide proportions; it is not an app screen or calibration tool. Alt: “Portrait Back and landscape Side framing rectangles, each with a dashed vertical centre line and a full-body figure inside.” |
| `recording-sequence.svg` | 960×320 | Original SVG; no raster processing | Set up, record the delivery, stop and wait, then review. Illustration of the physical sequence; phone screens are abstract. Alt: “Four physical recording stages: a steady phone, a pitcher throwing, waiting for saving, and reviewing the saved pitch.” |
| `camera-view.png` | 370×498 | Current app, August 27 recapture; crop 20, 344, 370, 498 | An existing Back View pitch. Confirm the camera position used for your own video. Alt: “Camera View step with Back View selected and the Next button.” |
| `throwing-arm.png` | 370×431 | Current app, August 27 recapture; crop 20, 398, 370, 431 | Choose the pitcher's throwing arm, regardless of where the arm appears in the image. Alt: “Throwing Arm step with Right selected, guidance for Unknown, and Back and Next buttons.” |
| `mark-ffc.png` | 370×698 | Current app, August 27 recapture; crop 20, 158, 370, 698 | An existing FFC mark. The exact selected frame and the saved frame are shown separately. This screenshot does not prescribe an event frame for another video. Alt: “Saved Front Foot Contact at exact frame 1,212 of 1,643, with playback, fine adjustment and Move Front Foot Contact controls.” |
| `analyze.png` | 370×418 | Current app, August 27 recapture; crop 20, 458, 370, 418 | An existing pitch with current results. Viewing this screen does not run a new analysis. Alt: “Pitch Mechanics summary showing three of three results up to date and the Analyze Pitch button.” |
| `results-back.png` | 346×387 | Current app, August 27 recapture; crop 30, 469, 346, 387 | One real saved Back View result at FFC. The displayed value describes this image; it is not a target or grade. Alt: “A saved 2D Trunk-Segment Orientation result of 7 degrees toward image left, with a Details and Annotated Image link.” |
| `evidence.png` | 315×723 | Current app, August 27 recapture; crop 45, 158, 315, 723 | The annotated evidence behind that result. The original image proportions, landmarks and saved value are unchanged. Alt: “The saved pitching frame annotated with trunk landmarks and a vertical reference, followed by Save to Photos and Share.” |
| `explorer-home.png` | 370×650 | Current app; crop 20, 166, 370, 650 | Start with the marked video frames or explore available measurements. Alt: “Your pitching history with Review marked frames and Measurement history entry points.” |
| `marked-history.png` | 370×690 | Current app, August 27 recapture; crop 20, 169, 370, 690 | Review the exact marks you saved. The number of marked pitches depends on the selected event and filters. Alt: “August 27 Front Foot Contact marks, List and Frames options, two saved pitch thumbnails and Choose A and Choose B buttons.” |
| `choose-b.png` | 370×580 | Current app, August 27 recapture; crop 20, 110, 370, 580 | Select a different pitch for B. Both sides compare the same marked event. Alt: “Choose pitch B sheet with one August 27 pitch already selected as A and another eligible August 27 FFC mark.” |
| `comparison.png` | 370×661 | Current app, August 27 recapture; crop 20, 180, 370, 661 | A real pair with different camera views. The layout preserves image proportions; placing frames together does not make their perspectives equivalent. Alt: “Two August 27 Front Foot Contact frames side by side, with Open A, Open B and Auto layout controls.” |
| `measurement-chooser.png` | 370×654 | Current app; crop 20, 185, 370, 654 | Choose one measurement. This crop shows the upper part of the list; lead-knee bend at FFC and Ball Release are also available for Side View. Alt: “The upper part of the measurement chooser, showing Back-view measures and the Side-view ankle-span ratio.” |
| `chart.png` | 370×571 | Current app; crop 20, 169, 370, 571 | Trunk-orientation history in Chart. These are actual saved observations, not benchmark or ideal values. Alt: “History Chart with individual recorded values in degrees and Chart, Table and Evidence tabs.” |
| `table.png` | 370×535 | Current app; crop 20, 216, 370, 535 | Table makes individual contributors readable. A pitch date and the date the video was added can differ. Alt: “History Table showing two dated retained pitches and their saved degree values.” |
| `questions.png` | 314×235 | Current app; crop 28, 209, 314, 235 | Four ways to ask a descriptive question of supported saved history. Alt: “Explorer question menu: History, Two pitches, Grouped summary and Two periods.” |
| `filters.png` | 370×520 | Current app; crop 20, 133, 370, 520 | Options narrow the included history. Apply confirms your changes; Cancel leaves the current question unchanged. Alt: “Explorer options for pitch dates, camera view and throwing side, with Cancel and Apply.” |
| `date-range.png` | 319×367 | Current app; crop 50, 245, 319, 367 | Choose a relative window, a custom range, all dates or pitches with no known pitch date. Alt: “Date choices: Last 7 days, Last 30 days, Last 90 days, All, Custom and pitches without a pitch date.” |
| `save-view.png` | 382×310 | Current app; crop 14, 322, 382, 310 | A Saved View remembers a question and its settings. Its results refresh from current history when reopened. Alt: “Save as New View dialog with an empty view name, Cancel and Save buttons.” |
| `settings.png` | 370×470 | Current app; crop 20, 110, 370, 470 | Settings provides version information and links to privacy and support. Alt: “Settings with About, Privacy Policy and Support.” |
| `about.png` | 370×275 | Current app; crop 20, 112, 370, 275 | App version and build help support investigate a problem. Your installed version may differ. Alt: “About showing Asymmetri Motion version 1.0 (1).” |

The two generated setup illustrations use generic adult figures and abstract
phones. They inherit no private photo and imply neither calibrated geometry nor
ideal mechanics. The original framing/sequence SVGs are instructional diagrams,
not UI. Generation is owner-authorized; no third-party trademark clearance is
claimed. The follow-up below replaces nine screenshot files at their stable URLs;
no additional unused tutorial asset is published.

### August 27 footage refresh

At the owner's request, nine screenshots were recaptured in the same September 16
session (September 17 UTC), replacing the darker September 14 examples. The new
Back example is August 27 IMG_7594: saved FFC 1,212 of 1,643 and its existing 7°
toward-image-left trunk result. The Side comparison is August 27 IMG_7595, saved
FFC 456. No marks or result values were edited or recalculated. Camera View,
Throwing Arm and Analyze captures were also refreshed from that same Back pitch
for consistency. List, chooser and comparison captures use an ephemeral August
27-only date filter; leaving and reopening Explorer restored All saved history,
Frames and empty A/B selections. No Saved View was created.

Only lossless crops are applied; no brightness adjustment, retouching, compositing
or fabricated UI. The two input-control crops have revised dimensions to retain
complete controls. All other screenshot dimensions and all illustration files are
unchanged. Crops exclude system/location/profile information. The eleven remaining
screenshots show general controls or previously authorized history and contain no
September 14 pitching image. Raw captures remain outside the repository.

### Final asset SHA-256

- `acquisition.png`: `1e9dccbdb2c4ccf11d88f2de90b7431bfc353ca52339ffae05773b7c488c7dff`.
- `back-setup.webp`: `54cd8686b64b37a502004d083b966756207267f0b15ba77bdc5f8ff4cce45677`.
- `side-setup.webp`: `ab566226df0f8ddf24757c5d3a234f995d5a68daf3f0b976edc9b7795fc9f3a9`.
- `framing-guides.svg`: `25aabfd878d48b41e7b3b15380a550a9d99de9503dcb4c52c96acda39860a01e`.
- `recording-sequence.svg`: `c8d8f72ee76cd86fa540a2415dd892324222cf2ed29b83745e0260c2efe53250`.
- `camera-view.png`: `f5d495b54dfeb2a95c5f4edcc1708e634d30dd23037cea091686d83b972f8575`.
- `throwing-arm.png`: `e940c128ef9765740384f164fa4eb5cd04094d21d9538c42f7ab3e7e3f4d1f82`.
- `mark-ffc.png`: `d8d2510a3a930891805d50747a66a74c52e29fb58d2e9055dd694e53cb3c61a9`.
- `analyze.png`: `aa86e1fb5fe24190f14724b521895675949c62180dbc1b763c20759b40cd9436`.
- `results-back.png`: `bd64eea905910deb188541306d93059aa94ada9c73578dbbd180f802462eda2e`.
- `evidence.png`: `1ff18c24d3ec8211f4545454022edc3270da7c34b9f1d7f5c80c3c0d0de64401`.
- `explorer-home.png`: `4612b037716ad5f9d4b5e46b35267aae58a0ba5de5d1fc7f9a657613874b48f8`.
- `marked-history.png`: `bbb8af622823d40da182c1b2e0f26d30c810057bbb3cd29a09b60adcfe32a070`.
- `choose-b.png`: `ddd867eb2be52ca318464658fe38df803f6ba37c9dabdec028be7100f7a9c2b9`.
- `comparison.png`: `f88b9b929881a6f32500ee960ce442a059037562bd727dbad140a7a8c4207e49`.
- `measurement-chooser.png`: `0648ef9abd26075d8cf71bc55bd5a8a5bea9ddd26884f1644237d9c029929972`.
- `chart.png`: `6e064befcdfe16de92e061e50b026d516dba6b6899f6d32a976924f5ef80061e`.
- `table.png`: `83e51abb1814f2e8d0111666f9bf6272f92390c79c271dcf5f46f80f029748a8`.
- `questions.png`: `5677425f3c8a85c372e6b450c82c5157726c809d41448b321a48d1a624b0321b`.
- `filters.png`: `22634d25432c3205f718bf5532b4a48e3e83caeea620a5618a62a77375620c62`.
- `date-range.png`: `3b32d41a0994a63b688091ae8650cc90174eefce093562788d9077f98b0e9f59`.
- `save-view.png`: `317acb8f50dc709e626ecdb8dac5e64688998bcb2f210c3b710aa46654652588`.
- `settings.png`: `56b6e592af80774c951b1f17666b89852c342f4c0046c5fba3d54bb8e97ec267`.
- `about.png`: `14f777ae70f306dad5ad48e67b0acdbee334f05b340efc7530c22a9b00a73528`.


## Labs portfolio extension, September 28, 2026

The dated records above retain their historical scope. No prior public asset was
removed or overwritten. The former homepage photograph now appears on `/sport`;
its bytes, crop behavior and approved mark visibility are preserved. The Motion
icon and every tutorial file retain their established URLs and bytes.

| Asset | Source and processing | Dimensions | Role, alt text and rights |
| --- | --- | --- | --- |
| `public/images/labs-social.svg` | Original HTML/SVG-style geometric artwork authored for this redesign; local system type, no external media | 1200×630 | Editable source for the Labs social image; company headline and branching coordination diagram. Original geometry, no stock or third-party brand asset. |
| `public/images/labs-social.png` | Rasterized from the preceding SVG with existing Sharp; no new dependency | 1200×630 | Labs/Work/About/BotSquad Open Graph and Twitter preview; description: Asymmetri Labs, Build an asymmetric advantage. |
| `public/images/sport-social.png` | Rasterized from preserved `public/og.svg`; original SVG unchanged | 1200×630 | Sport social preview, retaining the baseball/evidence identity. Existing owner-approved source and rights. |
| `public/images/motion/explorer-home-concept.webp` | Owner-supplied Explorer design `home.png`, quality-90 WebP, no crop or UI retouching | 523×1106 | Small Motion design-process figure. Alt: Early Explorer design concept with options to explore observations, compare pitches and compare periods; synthetic content. Owner supplied and requested selected local concepts for this task; not a current app capture or validated result. |
| `public/images/motion/explorer-saved-views-concept.webp` | Owner-supplied Explorer design `saved.png`, quality-90 WebP, no crop or UI retouching | 523×1106 | Small design-process figure. Alt: Early Saved Views design concept showing two illustrative saved questions; not a current app capture. Same synthetic-concept authorization and limits. |
| `public/images/motion/tutorial/evidence.png` (reuse) | Existing approved authentic tutorial capture; unchanged | 315×723 | Homepage Motion introduction. The established bounded publication authorization applies; no new athlete media or values were introduced. |

The local design README identifies September 2026 Explorer proposals, not verified
implementation or scientific findings. `visual.png` and `chart.png` were reviewed
but excluded: detailed synthetic numerical plots would add confusion and excess
marketing weight. Original sources remain untouched and outside this repository.
Public captions and embedded source labels retain the concept/synthetic distinction.

`CapabilityDiagram` and `WorkerDiagram` are semantic HTML/CSS visuals, not app
screenshots or customer results. The retired introduction posters were original local HTML/CSS
geometry and typography, with no image download, hotlinked thumbnail or personal
information. The same palette and source text supply an accessible equivalent.

### Official-channel external videos — updated October 22, 2026

- Required publisher: [Asymmetri](https://www.youtube.com/@Asymmetri), explicitly
  selected by the owner. The channel page and YouTube oEmbed metadata were checked.
- Motion: `https://youtu.be/nEv9nJO83NM`, explicitly selected by the owner in the
  follow-up, public title "Asymmetri Motion | Every Pitch, Together", approximately
  0:43. oEmbed reports author "Asymmetri" and author URL
  `https://www.youtube.com/@Asymmetri`. This replaces the earlier official-channel
  choice `KM4TESEzXxA` ("See Your Pitch More Clearly", approximately 0:55), which
  had replaced `kaSatKC8HBg`. On October 22, the owner requested the video be
  displayed directly. The local HTML/CSS poster and its text were retired; the
  native YouTube preview appears inside the player. No image is downloaded or
  added to the site's public assets.
- Removed BotSquad embed: `E5r_lOecC-M`. Both earlier embeds reported the personal
  channel `@christopherlinbaseball`, so they no longer satisfy the owner's channel
  requirement. No BotSquad introduction was visible among the official channel's
  three videos. Its preserved section now links directly to the official channel.
- The channel also showed a Motion Short (`ep6rIkmz1YA`). No Motion video is
  substituted for BotSquad.

Promotional content does not establish release availability or scientific validity;
current product limits remain stated alongside the Motion introduction.

Videos are not downloaded, re-edited or republished. Owner selection authorizes
embedding/linking for this site; it does not claim independent clearance of every
third-party element. Motion renders on page load in a responsive 16:9
privacy-enhanced iframe with an accessible title and no autoplay. Google may
process requests before Play. Always retain the external fallback and disclosure.
The retired poster had fluid HTML/CSS dimensions and text, not image bytes or alt
text; no local image dimensions, alt text or video rights changed. The retired
BotSquad poster used only HTML/CSS; its off-channel player and fallback link were
removed. The official-channel link loads no remote media by itself.


### Work domain reuse, September 28, 2026

`/work` reuses the unchanged 1200×630 Labs raster social image. Its accessible
direction/coordination/review figure is semantic HTML/CSS with no image download
or external asset. No public asset was added, replaced or removed for this update.


## Human editorial pass, September 29, 2026

- `public/images/baseball/pitching-delivery.webp` (2400×1600): unchanged approved
  photo, now also used beside the homepage founder account. The Sport hero and
  homepage render the original full 3:2 composition without the former dark CSS
  overlay. Alt text remains “A pitcher follows through on the mound as the
  baseball travels toward the plate.” The same bounded owner approval applies;
  no additional athlete media or processing was introduced.
- `public/images/labs-social.svg` and `.png` (1200×630): original typographic
  artwork replaces the dark branching diagram with the paper palette, current
  company headline and two product descriptions. PNG rasterized with the existing
  Sharp dependency. Social description: “Asymmetri Labs, A small team can do a lot.”
  No external artwork, font download or third-party rights claim.
- The approved 315×723 Motion evidence screenshot retains its homepage role,
  bytes, URL and alt text. All tutorial media, concepts, logos, icon variants,
  favicon fallbacks and other social files remain byte-identical.
- Removed rendered visuals: the semantic capability diagram, Work direction
  diagram and decorative video-poster geometry. BotSquad’s CSS diagram becomes
  a labelled written example (`WorkerExample`), not a screen reconstruction.
  No public image URL was deleted or renamed.

## Hierarchy restoration, September 29, 2026

The authentic 2400×1600 pitching photograph returns to its Sport-hero role; its
homepage reuse is removed as the company-level section sequence is restored.
Source, bytes, processing, alt text and existing rights assessment are unchanged.
No public image asset is added, replaced or deleted. Labs social artwork keeps
the approved paper palette and current wording. The existing 315×723 evidence
capture remains in the Motion product panel with the same caption and alt text.

New rendered structure uses semantic HTML/CSS: a nested company/domain/product
navigation, Work approach outline, and `WorkerFlow` ordered list based on existing
copy. `WorkerExample` returns to a standalone product-page section. These are
textual explanations, not app captures, scientific evidence or third-party media.

## Sport-level homepage, September 29, 2026

- `public/images/labs-social.svg` and `.png` remain 1200×630 original typographic
  artwork. The Motion support line now reads “Part of Asymmetri Sport.” The SVG
  was edited in source and rasterized with the existing Sharp dependency. Palette,
  composition, local fonts and rights assessment are unchanged. Social alt text
  remains the company name, current headline and company descriptor.
- The 315×723 evidence capture and 1024×1024 Motion icon are no longer rendered on
  the homepage. Their original bytes, public URLs, accurate alt descriptions and
  deeper-page roles are preserved. No asset is deleted or misleadingly relabelled.
- A semantic text overview replaces the homepage Sport image treatment. It adds
  no generated image, stock media, athlete depiction or third-party rights claim.

## Root content restoration from 0c05c7b, September 29, 2026

- `public/images/home-social.svg` and `.png` are new 1200×630 original typographic
  assets for `/` only. Source: the current light Labs social SVG composition,
  with the requested historical headline/support and product lines. Processing:
  SVG source editing and PNG export through the existing Sharp dependency.
  Description: “Asymmetri Labs, Build an asymmetric advantage.” The page's social
  alt uses its restored title. No external font, stock art or new rights claim.
  Existing `labs-social` files and their use on other pages are unchanged.
- The unchanged 315×723 tutorial evidence capture and 1024×1024 Motion icon return
  to the homepage at the owner's explicit request to restore historical content.
  Their original URLs, accurate alt descriptions and approved provenance remain.
  The evidence caption again reads “Actual app capture. Projected 2D evidence,
  interpreted in context.” No screenshot value or image pixel is modified.
- `HomeCapability` and `HomeWorkerFlow` render the historical explanation as semantic
  HTML/CSS lists in the current light design. They retain conceptual/synthetic
  disclosures and do not represent a live application or customer outcome.


## Sports/Labs architecture evolution, October 7, 2026

This section supersedes current roles in earlier dated entries; provenance and
historical approvals above remain unchanged. No authentic image pixels change.

| Asset | Dimensions / processing | Current role, description and rights |
| --- | --- | --- |
| `public/images/home-social.svg` and `.png` | 1200×630; edit existing SVG typography, export with installed Sharp | Umbrella/Home/About/default preview: Asymmetri, Build an asymmetric advantage; Sports → Motion and Labs → BotSquad. Original local typography, no external font or new third-party rights. |
| `public/images/labs-social.svg` and `.png` | 1200×630; edit existing SVG, Sharp PNG export | Labs/BotSquad preview: experimental technology and open-source work. Removed Motion-as-Labs relationship. Same original source and rights. |
| `public/og.svg` and `public/images/sport-social.png` | 1200×630; identity and headline changed in retained SVG, Sharp PNG export | Sports preview retains the dark editorial composition; plural Asymmetri Sports, “A closer look at the game,” and technology for athletes, coaches and teams. Stable old file URLs, unchanged source rights. |
| `public/images/baseball/pitching-delivery.webp` | 2400×1600; unchanged bytes and crop rules | Hero now at `/sports`; same approved athlete photo, visible marks, alt text and bounded privacy assessment. |
| `public/brand/motion-pitcher.png` and tutorial `evidence.png` | 1024×1024 / 315×723; unchanged | Homepage/Motion product identity and genuine evidence capture; same alt/caption and approval. |

The rendered company lockup changes text from Asymmetri Labs to Asymmetri; its
inline mark geometry, source logo variants and favicon fallbacks remain intact.
`HomeCapability` now presents actual division links; `MotionFamily` uses semantic
HTML/CSS, explicit states and nested Team entitlement rows. These are explanatory
structures, not product screenshots or fabricated evidence. Existing BotSquad
flow/example, Explorer concepts and all tutorial originals retain their labels,
bytes and URLs. No new bitmap, stock photo, generated media or video is added.
Approved videos keep their IDs, local posters and explicit privacy-aware loading.


## Visual identity differentiation, October 7, 2026

Supersedes palette roles above without rewriting their dated provenance. No new
media, external art, font or athlete depiction. SVG edits and PNG rasterization
use original repository artwork and the existing Sharp dependency.

| Asset | Dimensions / processing | Public role, description and rights |
| --- | --- | --- |
| `public/images/home-social.svg` and `.png` | 1200×630; mineral/teal/slate source edit and Sharp PNG export | Home/About/default preview; Asymmetri, Build an asymmetric advantage, Sports → Motion and Labs → BotSquad. Equal division fields; unchanged copy and original-art rights. |
| `public/images/labs-social.svg` and `.png` | 1200×630; slate source edit and Sharp PNG export | Labs/BotSquad preview, experimental technology and open-source projects. Existing typography and claims retained; original-art rights. |
| `public/og.svg` and `public/images/sport-social.png` | 1200×630; deep green/teal source edit and Sharp PNG export | Sports preview, A closer look at the game; athletes, coaches and teams. Retains vector mark/composition, no photo or new rights claim. |
| `public/favicon.svg` | 96×96 viewBox; color values only | Current browser icon: established asymmetric mark in mineral/teal on deep ink. Original geometry and rights retained. |
| Inline `Logo` in `components/logo.tsx` | 96×96 viewBox, rendered 32px mark | Header/footer company identity. Existing paths now use CSS ink/teal tokens; accessible company label unchanged. |

All authentic baseball photos, genuine Motion screenshots, Explorer concepts,
Motion icons and tutorial originals remain byte-identical at stable URLs with
unchanged alt text and bounded approval. All historical logo sources and raster
favicon/app-icon fallbacks remain intact; their older orange is intentional
preservation, not the active website palette. Video IDs, local text posters,
explicit activation and disclosures remain; posters inherit division colors.
Semantic hierarchy/flow visuals are CSS and real text, not fabricated screens.


## Selected Graphite + Teal promotion — October 7, 2026

This release adds, replaces, generates and removes no public asset. All tracked
`public/` files retain their previous bytes, dimensions, sources, rights and alt
text. Motion screenshots/icons, tutorial originals and authentic photography are
unchanged. The existing rendered logo receives its accent through CSS, without
geometry changes. Existing social exports and favicons remain approved retained
assets from the preceding palette; `VISUAL_IDENTITY.md` is current CSS authority.
No exploration screenshots, comparison pages or review assets ship with production.


## BotSquad project-page diagrams, October 7, 2026

No public image, logo, social export, font or video file was added, removed or changed.
The existing `WorkerFlow` product-page visual is replaced by a semantic reference-team
hierarchy; `WorkerExample` replaces the generic comparison with an illustrative Hitting
workflow. Homepage `HomeWorkerFlow` is unchanged. New retained-context labels and evidence
rows are HTML/CSS, not raster assets or app screenshots.

- Source: original website markup/CSS; names/reporting structure from the public BotSquad
  white paper at `968a0e2b8c96eb1f1bde397227f4fab8e4e30c76`; scenario directed by owner.
- Dimensions/processing: fluid text diagrams; three team branches become a nested single
  column below 700px. No image processing or remote resources.
- Public role: explain persistence, responsibility, evidence and a possible reference use.
- Text alternative: the visible nested/ordered lists supply the complete reading order;
  figure labels/captions identify the reference team and illustrative, unperformed scenario.
- Rights/privacy: original presentation of public MIT-source facts and owner-requested copy;
  no private HQ records, athlete data, third-party photos or fabricated product screens.
- Video: approved `E5r_lOecC-M`, local typographic poster and deliberate activation remain.

## BotSquad worker portraits, October 7, 2026

Seven owner-requested fictional AI-worker portraits now appear inside the existing
Meet BotSquad cards. This adds illustrations to the semantic diagram; it does not
replace authentic project media or depict human employees. The owner node, hierarchy,
names, roles and responsibilities are unchanged.

Source: built-in image generation using the owner's two September 5 illustrated
headshots as style references only. References remain untouched and unpublished.
The [generation record](BOTSQUAD_PORTRAITS.md) retains exact prompts and source IDs.
All generated originals are 1254×1254 PNG; public exports are 384×384 WebP, quality 86,
Sharp effort 6, metadata omitted. Only proportional downscaling and encoding were
performed: no crop, retouching or color change. The seven public files total 131,666 bytes.

| Public asset | Bytes | Public role / alt text |
| --- | ---: | --- |
| `public/images/botsquad/atlas.webp` | 15,844 | CEO card; “Illustrated portrait of Atlas, a BotSquad AI worker.” |
| `public/images/botsquad/maya.webp` | 20,636 | Product Manager card; “Illustrated portrait of Maya, a BotSquad AI worker.” |
| `public/images/botsquad/turing.webp` | 19,742 | CTO card; “Illustrated portrait of Turing, a BotSquad AI worker.” |
| `public/images/botsquad/linus.webp` | 19,000 | Engineer card; “Illustrated portrait of Linus, a BotSquad AI worker.” |
| `public/images/botsquad/ada.webp` | 18,174 | Engineer card; “Illustrated portrait of Ada, a BotSquad AI worker.” |
| `public/images/botsquad/grace.webp` | 19,860 | Reviewer card; “Illustrated portrait of Grace, a BotSquad AI worker.” |
| `public/images/botsquad/scout.webp` | 18,410 | Researcher card; “Illustrated portrait of Scout, a BotSquad AI worker.” |

Responsive use: an 80px square beside each name/role, intrinsic dimensions reserved,
served locally through Next.js Image with lazy loading. Warm neutral portrait backdrops
remain inside Graphite + Teal cards. Full-resolution PNGs are retained outside public
source in the owner's local artifact folder.

Rights/privacy assessment: explicitly requested generated fictional characters using
owner-supplied visual references; no stock photography, external hotlink, private workspace
capture, athlete identity or partnership assertion. The references guide illustration
style rather than reproducing named real people. This is not an independent rights-clearance
claim. No previously approved asset is replaced or removed.

## Nix worker portrait, October 8, 2026

- Public asset: `public/images/botsquad/nix.webp`, 384×384, 14,912 bytes.
- Source: built-in image generation followed by owner-directed edits; final source
  `exec-fc8f3ad6-5359-4aec-8f46-e29b0ebeecc0.png`, 1254×1254. The same two
  owner-supplied September 5 illustrations guide the style. Full source lineage
  and final prompt are in [the generation record](BOTSQUAD_PORTRAITS.md).
- Processing: proportional Sharp downscale, WebP quality 86 / effort 6, metadata
  omitted; no post-generation crop or retouching. Full-resolution final PNG is
  retained outside public source in the owner's local artifact folder.
- Public role: Nix's DevOps card, directly under Atlas in Meet BotSquad. An 80px
  square served locally by Next.js Image, with intrinsic dimensions reserved.
- Alt text: “Illustrated portrait of Nix, a BotSquad AI worker.”
- Character design: owner-specified Asian man in his early 20s, black buzz cut,
  silver hoop earring, small abstract neck tattoo and white T-shirt. Fictional
  worker illustration; it is not a human employee photograph or biography.
- Rights/privacy: generated at the owner's request from their style references;
  no stock photo, athlete identity, private screenshot or partnership claim.
  The tattoo is an abstract decorative mark. This is not independent rights
  clearance. Existing seven portraits and all other approved assets are unchanged.
- Layout: four peer branches under Atlas on desktop; nested single column at
  1100px and below. This changes the semantic diagram, not the source product.

## Homepage gateway simplification, October 8, 2026

The homepage no longer renders the Motion icon/evidence showcase or the semantic
`HomeWorkerFlow` preview. Their historical usage records above remain evidence.
All public files, dimensions, alt text, rights assessments and stable URLs remain
unchanged; the Motion icon and evidence capture remain on their dedicated product
and tutorial pages. The homepage retains its existing social image. No raster,
logo, portrait, tutorial original or generated public asset is added or removed.

## INV-03 archive rendering — October 9, 2026

No public file asset was added, replaced or removed. Synthetic runtime PNG fixtures
are normalized test bytes in disposable private CAS, served only through exact
metadata authorization; they are not approved production imagery or static assets.
Their dimensions/hash/type are validated, alt text uses the permitted artifact
title, and fixture labels identify their synthetic role. Local QA screenshots are
private acceptance evidence, not published media. Existing tutorial/brand images
retain original URLs and bytes.

## INV-04 showcase — October 9, 2026

No `public/brand/` or `public/images/` asset was added, replaced or removed. Worker
marks are CSS initials on explicitly synthetic roster cards; SVG charts are drawn
from typed financial observations. They are not employee portraits or market data.
Fixture prose and values are author-created test content derived from the pinned
contract's synthetic golden fixture, served only from a disposable private archive.

`docs/validation/inv04/` retains local browser evidence: desktop introduction and
portfolio JPEGs (1440 × 1000), mobile introduction JPEG (390 × 900), viewport
measurements and a labelled synthetic performance CSV downloaded through the UI.
The committed CSV normalizes CRLF to LF; all downloaded field values are preserved.
Screenshots are unedited captures, not public product media; no private app, athlete,
HQ conversation, real employee, publisher key or operational data appears. Their
role is acceptance evidence; Markdown descriptions identify the synthetic UI.
Existing tutorial original-image URLs and all brand fallbacks are unchanged.


## BotSquad Research hub, October 13, 2026

The Research hub reuses `public/images/labs-social.png` (1200×630) for social
metadata. Its existing original typography, source SVG, processing and rights
assessment remain unchanged. No asset bytes or public URLs changed, and no new
visible image or alt text was introduced. Navigation and project cards use HTML/CSS.

## Investment team portrait reuse, October 13, 2026

The owner requested employee images on the Investment team's Atlas and Maya cards.
The existing approved `/images/botsquad/atlas.webp` and `maya.webp` illustrations
are reused without changing their bytes: 384×384 WebP, 15,844 and 20,636 bytes,
respectively. Their October 7 generation provenance and rights/privacy assessment
above remain applicable. No new generation, crop, processing or source upload.

Investment cards display a 96×96 CSS-pixel square through Next.js Image, reserving
intrinsic dimensions and retaining the existing illustrated-worker alt text. The
central `investmentWorkerPortraits` registry maps exact already-published worker
IDs to these local assets; names, roles and activity still come from the verified
roster. Unmapped identities retain initials. No remote image URL is accepted and
no fictional fixture identity receives an actual worker portrait by name matching.
The same portraits remain in the BotSquad overview's team diagram.


## BotSquad Trade technical guide, October 15, 2026

Six original Computer Use captures of the owner’s public website illustrate the
reviewed technical guide. Files are copied byte-for-byte into
`public/images/botsquad/trade-guide/`; no generation, resizing, pixel rewriting
or redaction was applied during integration. Captures are dated historical
evidence, not live widgets. Links expose the full original JPEG and source page.
The approved Atlas illustration remains visible within the public roster capture.
No private HQ UI, private conversation, credential or athlete appears. Owner
authorization covers publication of this documentation and its public-site
captures; existing asset rights assessments continue to apply.

### 01-trade-overview.jpg

- Public URL: `/images/botsquad/trade-guide/01-trade-overview.jpg`.
- Source: [Trade introduction](https://asymmetri.co/botsquad/investment), captured `2026-10-15T17:37:34.895266+00:00` using Computer Use.
- Dimensions and format: 492 × 598 JPEG; 31,835 bytes.
- Processing: No crop; original viewport. Integration preserves original bytes.
- Public role: Trade introduction in the Trade technical guide.
- Alt text: “The public Trade introduction, with BotSquad Research and Trade navigation.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `fbb6d1ab34ee73da75a25c41585b517296dcb1305139aeb75f63a907d3c00017`.

### 02-run-status.jpg

- Public URL: `/images/botsquad/trade-guide/02-run-status.jpg`.
- Source: [Run status and freshness](https://asymmetri.co/botsquad/investment), captured `2026-10-15T17:38:35.061955+00:00` using Computer Use.
- Dimensions and format: 355 × 515 JPEG; 25,162 bytes.
- Processing: Direct Computer Use full-page clip of the status panel; no pixel rewriting or redaction. Integration preserves original bytes.
- Public role: Run status and freshness in the Trade technical guide.
- Alt text: “The public run status shows paused, unknown archive freshness and distinct publication and publisher-contact times.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `1098aac8af4418cd644e20311431fa094d4f12c85f969070d64924968c923cd6`.

### 03-worker-roster.jpg

- Public URL: `/images/botsquad/trade-guide/03-worker-roster.jpg`.
- Source: [Atlas roster excerpt](https://asymmetri.co/botsquad/investment#team), captured `2026-10-15T17:39:13.195249+00:00` using Computer Use.
- Dimensions and format: 492 × 598 JPEG; 22,385 bytes.
- Processing: No crop; original viewport after navigating to the roster. Maya is outside this capture. Integration preserves original bytes.
- Public role: Atlas roster excerpt in the Trade technical guide.
- Alt text: “The public worker roster showing Atlas as the portfolio researcher.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `22517301aa37d4d775bc55408ed5517bbbcdac151d1b9ab97bb4d85c53e97253`.

### 04-portfolio-snapshot.jpg

- Public URL: `/images/botsquad/trade-guide/04-portfolio-snapshot.jpg`.
- Source: [Last complete portfolio valuation](https://asymmetri.co/botsquad/investment#portfolio), captured `2026-10-15T17:38:49.617540+00:00` using Computer Use.
- Dimensions and format: 355 × 869 JPEG; 44,016 bytes.
- Processing: Direct Computer Use full-page clip around the portfolio section; no pixel rewriting or redaction. Integration preserves original bytes.
- Public role: Last complete portfolio valuation in the Trade technical guide.
- Alt text: “The public portfolio section reports the last complete valuation and its cash, equity and return values.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `868a01ce600de8b8ff2fe8ecd49d44e6b30917f69e234319dce96b47ec52c6b0`.

### 05-transaction-journal.jpg

- Public URL: `/images/botsquad/trade-guide/05-transaction-journal.jpg`.
- Source: [Portfolio initialization journal](https://asymmetri.co/botsquad/investment#journal), captured `2026-10-15T17:38:49.747393+00:00` using Computer Use.
- Dimensions and format: 461 × 1171 JPEG; 60,888 bytes.
- Processing: Direct Computer Use full-page clip around the journal; no pixel rewriting or redaction. Integration preserves original bytes.
- Public role: Portfolio initialization journal in the Trade technical guide.
- Alt text: “The public transaction journal shows the initial simulated capital posting and its exact-record link.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `9ef97439c25a767a78e367faf62d1a923e3e832a5431841d350acc5b73b9858b`.

### 06-benchmark-evidence.jpg

- Public URL: `/images/botsquad/trade-guide/06-benchmark-evidence.jpg`.
- Source: [Benchmark allocation evidence](https://asymmetri.co/botsquad/investment/records/valuation/98d348b9601bcb90eaf2195084a988c711a764e9f9a389e3/versions/1?run=0f6ea49caee91243f2f028a8ddde55abaa68faaaa2de453c), captured `2026-10-15T17:42:13.628102+00:00` using Computer Use.
- Dimensions and format: 492 × 598 JPEG; 46,849 bytes.
- Processing: No crop; original viewport after expanding benchmark evidence and scrolling. Integration preserves original bytes.
- Public role: Benchmark allocation evidence in the Trade technical guide.
- Alt text: “The public exact valuation shows the benchmark closing allocation, retrieval time and later accounting time.”
- Rights and privacy: Owner-requested documentation of the owner’s public site. No private HQ screens, private transcripts, credentials, account information or access details. Any record IDs shown were already public.
- SHA-256: `d1a2fd381161682aa8fc0d9a0b610d753101f0bdb3684420edd24940bc3cbeba`.


## HQ investigation guide, October 15, 2026

The owner requested actual Computer Use screenshots for a public companion to the
Trade guide. These seven reviewed JPEG crops show the private HQ interface with
private identifiers, transcripts, account details, credentials and endpoints
excluded. They contain no rewritten pixels, synthetic data or EXIF metadata.
The published files are byte-identical to the approved crops. The original
private screens and operational receipts are not copied into the repository.
Source labels are plain text, never private URLs. Existing BotSquad UI and asset
rights apply; publication is limited to these owner-authorized reviewed crops.

### 01-hq-navigation.jpg

- Public URL: `/images/botsquad/hq-guide/01-hq-navigation.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:40:52.751109+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 260 × 720 JPEG; 15,843 bytes.
- Processing: Actual viewport crop, x=0 y=0 width=260 height=720; no pixel rewriting. Private workspace content is excluded. Integration preserves original bytes.
- Public role and caption: The upper HQ sidebar. Scroll the sidebar to reach Investment run, Investment team, Investment publication and Audit history. Counts are company-wide; they are not all Trade activity.
- Alt text: “The HQ sidebar shows Attention, Working Groups, Tasks and Executions.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `4ffa02ba35b77363033203b7022541808ba258c63f45509a6e11b2128323b09d`.

### 02-portfolio-metrics.jpg

- Public URL: `/images/botsquad/hq-guide/02-portfolio-metrics.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:34:31.939774+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1080 × 566 JPEG; 33,520 bytes.
- Processing: Direct Computer Use page crop, x=100 y=534 width=1080 height=566. Portfolio name and private run identifier above the metrics are excluded. Integration preserves original bytes.
- Public role and caption: The latest valuation is October 14 at 20:00 UTC. The displayed cash and equity are USD 100,000. A freshly opened page does not make that valuation current to October 15.
- Alt text: “The portfolio metrics show USD 100,000 cash and equity, zero returns, and the October 14 valuation timestamp.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `493094ee1e75f9744e0b6f7bd4059d3764de4a326d4e97e6337fd86c1ab2d54c`.

### 03-loop-and-authority.jpg

- Public URL: `/images/botsquad/hq-guide/03-loop-and-authority.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:34:32.040243+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1044 × 250 JPEG; 21,386 bytes.
- Processing: Direct Computer Use page crop, x=118 y=1777 width=1044 height=250. Private worker identifier list below the panel is excluded. Integration preserves original bytes.
- Public role and caption: The loop is blocked even though an independent authority is present. Each counter covers a different scope. The remaining-one value reflects the stricter recovery allowance.
- Alt text: “A blocked loop shows six reserved turns, ten permanent calls, one remaining call, and an incomplete-telemetry reason.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `e5414d827c127d8c7fe55ab86856b56171635eb1d071e6728f7e33758f1fcea0`.

### 04-usage-and-invocations.jpg

- Public URL: `/images/botsquad/hq-guide/04-usage-and-invocations.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:35:47.708213+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1044 × 610 JPEG; 59,702 bytes.
- Processing: Direct Computer Use page crop, x=118 y=2130 width=1044 height=610. All private execution/pricing/breakdown disclosures remain closed. Integration preserves original bytes.
- Public role and caption: An excerpt of the aggregate and its first four rows. A completed runtime row can still have incomplete usage. Actual charges and subscription quota are unknown.
- Alt text: “The AI usage summary shows ten invocations, two incomplete usage records, and ten unpriced records above the execution table.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `d26051a0119d1698238ef844c06ba89a632387780fe61cc7aac3cf6bbaedb183`.

### 05-evidence-and-controls.jpg

- Public URL: `/images/botsquad/hq-guide/05-evidence-and-controls.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:34:54.794806+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1044 × 335 JPEG; 29,722 bytes.
- Processing: Direct Computer Use page crop, x=118 y=3306 width=1044 height=335. Private frozen evidence and schedule disclosures remain closed; no control was activated. Integration preserves original bytes.
- Public role and caption: The counts locate the break: a proposal exists, but no independent review or submission is committed. The buttons below are controls, not diagnostic acknowledgments.
- Alt text: “The loop evidence summary shows one proposal, zero reviews, zero submissions and no pending orders above the control buttons.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `6f33dd80da77e8bf049fdc34d0ad73f2736c5bd53e7b0443f7a80f4c356bc26d`.

### 06-publication-health.jpg

- Public URL: `/images/botsquad/hq-guide/06-publication-health.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:39:53.521685+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1044 × 290 JPEG; 28,488 bytes.
- Processing: Direct Computer Use page crop, x=118 y=338 width=1044 height=290. The private channel header and preparation form are excluded; delivery receipts remain closed. Integration preserves original bytes.
- Public role and caption: Publication is active with an empty backlog while the investment loop is blocked. No delivery control was activated for this capture.
- Alt text: “Publication health is active with zero pending, uncaptured or uncertain jobs, followed by explicit delivery controls and a collapsed receipts disclosure.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `c296ae43fe35eefa23e01606961eb034f685cc3fb74019ee6c19a574ae7102b0`.

### 07-review-row.jpg

- Public URL: `/images/botsquad/hq-guide/07-review-row.jpg`.
- Source: Private BotSquad HQ — owner interface; captured `2026-10-15T18:36:10.219942+00:00` through Computer Use. No public source endpoint.
- Dimensions and format: 1044 × 250 JPEG; 27,000 bytes.
- Processing: Direct Computer Use page crop, x=118 y=2964 width=1044 height=250. Execution details remain closed; this is an excerpt of the final three invocation rows. Integration preserves original bytes.
- Public role and caption: This is a retained historical execution label. It does not establish that an approval is waiting for the owner in the Approvals view.
- Alt text: “The final three invocation rows include a Maya review labeled awaiting approval with incomplete usage.”
- Rights/privacy: Owner-requested public documentation of BotSquad HQ. Crop inspected for private transcripts, internal/provider identifiers, credentials, account identifiers and private access endpoints. None are visible. Values describe the paper experiment, not a real-money account.
- SHA-256: `23fe58f7d15e4fa73ffd04335f17d2626223f98ebc1ef9099272a880056794e0`.


## HQ UX-01 current tutorial captures, October 16, 2026

These five PNGs are actual HQ browser captures supplied by the coordinated
BotSquad UX-01 implementation. They use a disposable HTTP/SQLite backend, isolated
authored sample records and fake-runtime responses. No external provider, market
operation or live investment outcome is represented. The owner explicitly
authorized synchronized website tutorials and safe current screenshots.

All five were visually reviewed for private endpoints, credentials, account
identifiers, genuine transcripts and genuine investment records. None is visible.
Existing BotSquad UI/portrait rights apply; public use is limited to these reviewed
sample captures. Original bytes and their source-manifest hashes are preserved:
no crop, pixel editing, metadata rewrite, generation or hotlinking.

The seven `/images/botsquad/hq-guide/*.jpg` assets remain byte-identical at their
stable URLs. Their public captions/source labels now explicitly identify them as
historical October 15 evidence before UX-01. All seven alt descriptions are
prefixed “Historical HQ capture:” while retaining their original descriptions.
They are not current navigation.

### home-1440.png

- Public URL: `/images/botsquad/hq-ux01/home-1440.png`.
- Source: BotSquad `docs/ux/hq-redesign/screenshots/home-1440.png` and its verified capture manifest; captured October 16, 2026, browser locale en-US and timezone America/Vancouver. No private access URL is published.
- Dimensions/format: 1440 × 1500 PNG; 216,374 bytes.
- Processing: byte-identical integration of the supplied capture.
- Public role: current HQ navigation/first-task tutorial; explicit isolated sample/fake-runtime disclosure in the article and each figure.
- Alt text: “HQ Home shows the six navigation destinations, recorded work, attention items and the team.”
- Rights/privacy: owner-authorized BotSquad documentation, reviewed sample records only; the shared assessment above applies.
- SHA-256: `4ca2734ddd5b4b766b4a46f3fcb9eac7c4ca5f65ff86f6cbb72fb7866de82b5a`.

### new-task-1440.png

- Public URL: `/images/botsquad/hq-ux01/new-task-1440.png`.
- Source: BotSquad `docs/ux/hq-redesign/screenshots/new-task-1440.png` and its verified capture manifest; captured October 16, 2026, browser locale en-US and timezone America/Vancouver. No private access URL is published.
- Dimensions/format: 1440 × 1214 PNG; 227,600 bytes.
- Processing: byte-identical integration of the supplied capture.
- Public role: current HQ navigation/first-task tutorial; explicit isolated sample/fake-runtime disclosure in the article and each figure.
- Alt text: “The New task dialog contains a supplied-text request and the Start task button.”
- Rights/privacy: owner-authorized BotSquad documentation, reviewed sample records only; the shared assessment above applies.
- SHA-256: `4312a2a0949112271b7c80f52bfe9c6bfd4611c07fc94dcedde0eb4a76a95582`.

### task-result-1440.png

- Public URL: `/images/botsquad/hq-ux01/task-result-1440.png`.
- Source: BotSquad `docs/ux/hq-redesign/screenshots/task-result-1440.png` and its verified capture manifest; captured October 16, 2026, browser locale en-US and timezone America/Vancouver. No private access URL is published.
- Dimensions/format: 1440 × 1000 PNG; 195,348 bytes.
- Processing: byte-identical integration of the supplied capture.
- Public role: current HQ navigation/first-task tutorial; explicit isolated sample/fake-runtime disclosure in the article and each figure.
- Alt text: “A completed sample task shows its request, responsible employee, recorded outcome and saved summary.”
- Rights/privacy: owner-authorized BotSquad documentation, reviewed sample records only; the shared assessment above applies.
- SHA-256: `e467021e9c146099410b6d3a7471eb38785d81e9a7f0fa3aecd0348dcd92ef13`.

### saved-result-1440.png

- Public URL: `/images/botsquad/hq-ux01/saved-result-1440.png`.
- Source: BotSquad `docs/ux/hq-redesign/screenshots/saved-result-1440.png` and its verified capture manifest; captured October 16, 2026, browser locale en-US and timezone America/Vancouver. No private access URL is published.
- Dimensions/format: 1440 × 1000 PNG; 174,595 bytes.
- Processing: byte-identical integration of the supplied capture.
- Public role: current HQ navigation/first-task tutorial; explicit isolated sample/fake-runtime disclosure in the article and each figure.
- Alt text: “A saved sample result contains three bullet points grounded in the tutorial text.”
- Rights/privacy: owner-authorized BotSquad documentation, reviewed sample records only; the shared assessment above applies.
- SHA-256: `8e8a298e7dc81376008d64cf18ffbce87a20aea5fe1729e61caff096db4cf0c3`.

### employee-390.png

- Public URL: `/images/botsquad/hq-ux01/employee-390.png`.
- Source: BotSquad `docs/ux/hq-redesign/screenshots/employee-390.png` and its verified capture manifest; captured October 16, 2026, browser locale en-US and timezone America/Vancouver. No private access URL is published.
- Dimensions/format: 390 × 1061 PNG; 87,123 bytes.
- Processing: byte-identical integration of the supplied capture.
- Public role: current HQ navigation/first-task tutorial; explicit isolated sample/fake-runtime disclosure in the article and each figure.
- Alt text: “Atlas’s profile on a phone shows responsibilities, work status, conversations and permissions controls.”
- Rights/privacy: owner-authorized BotSquad documentation, reviewed sample records only; the shared assessment above applies.
- SHA-256: `1ff7cb41e00f2a5a6513be098622001659d1a5eed9909b597ee384fe4ac33903`.

## Vancouver V0.1 geographic assets — October 30, 2026

- `public/vancouver/v0.1-2026-10-30/city.json`: bounded geometry (436 simplified
  building polygons, 296 road lines, 18 park polygon parts) for eastern False Creek.
  Extent [-123.123,49.267,-123.099,49.278]; geographic data, not a raster image.
  Source: City building-footprints-2015, public-streets, parks-polygon-representation,
  shoreline-2002. Offline projection, clipping, validity repair, 10 cm topology
  precision and simplification; illustrative heights. The exact byte count and
  checksum live in the adjacent manifest. OGL–Vancouver attribution is displayed.
- `manifest.json`: original provenance metadata and raw-response hashes; source
  data retains its licence. No private content, credentials or runtime API URL
  with credentials. No OpenStreetMap input in this release.
- Dome, stadium roof, trees and vehicle: original procedural models in the MIT
  project engine. Approximate shapes and dimensions, no external artwork/textures.
- Canvas accessible label documents controls; readable place list, source panels,
  pause/resume and no-JavaScript descriptions provide alternative access.
- Social metadata reuses the existing approved `labs-social.png`; no new social
  asset or claim of an official City affiliation.

## Vancouver V0.2 geographic and procedural assets — October 30, 2026

- `/vancouver/v0.2-2026-10-30/city.json` and adjacent manifest: 276,986-byte
  bounded City-derived JSON, same extent and 436 building/296 road/18 park parts.
  Source is immutable V0.1, with parent/output digests and original source hashes
  in the manifest. Offline Shapely processing trims 24 footprints (1,922.8 m²),
  derives illustrative pavement/sidewalk widths and a decorative coastal strip,
  and keeps ground pavement on land. Heights and landmark dimensions remain
  illustrative. OGL–Vancouver applies; V0.1 remains byte-identical and available.
- Original runtime assets in `scenery.ts`: a 128×128 canvas window texture,
  numbered/name sprites, facade/roof variation, road/crossing/lamp details, mixed
  vegetation, water highlights, landmark geometry and a detailed teal car.
  Original code-defined shapes/materials under MIT; no imported photos, models,
  fonts or third-party textures. Dimensions are illustrative. City primary
  references informed Creekside's green roof and Hinge's wetland, without copying
  their imagery. See project third-party notices for links.
- The SVG navigation aid has an accessible car/street label. The canvas has
  keyboard instructions; six source-backed text summaries remain available
  without 3D. Procedural scene content is described through these alternatives.
  Social metadata continues to reuse the approved Labs image.

## Vancouver V0.3 geographic and procedural assets — October 30, 2026

- `/vancouver/v0.3-2026-10-30/city.json` and adjacent manifest: 471,161-byte
  local-metre scene (same bounded extent, no pixel dimensions). Preserves 436
  V0.2 building shapes; four endpoint repairs <0.75 m, 110 illustrative junction
  aprons and 64 m collision tiles align physics with visible pavement. Includes
  the 241-node/282-edge local graph and fixed scenic waypoints. Original V0.1/V0.2
  bytes remain available. Source request URLs and SHA-256 are in the manifest.
- 115 historic heights from the bounded City `building-footprints-2009` response
  (915 records, 905,334 bytes) use `hgt_agl`, >=0.8 spatial IoU and 3–150 m bounds.
  Landmark/stadium exclusions; 321 illustrative heights remain. OGL–Vancouver,
  displayed attribution and explicit historic/mixed-date limitations. No current
  survey claim, third-party models, imagery, marks or NRCan data.
- Gold road arrows and SVG route/map styling are original MIT code-native assets;
  original bridge visuals now sample level water decks and smooth land approaches.
  They are illustrative/view-only. Accessible canvas/map labels, visible bridge
  notice, source panels and six no-JS place descriptions provide alternatives.

## Surrey Adventure V0.1 — October 30, 2026

- `public/surrey/v0.1-2026-10-30/city.json`: 2,224,370 bytes of bounded City of Surrey
  derived geography, 786 building parts plus road/sidewalk/park/rail/signal layers.
  Source queries, raw/output digests, extent, metadata dates and transformations
  are recorded in the adjacent `manifest.json`. OGL–City of Surrey attribution is
  visible on the game page; no City mark, OSM or crime dataset was imported.
- `projects/surrey/scenery.ts`: original runtime-generated character meshes,
  low-poly trees, building facades, lamps, rail structures and signs. Window
  texture is 128×128; sign textures are 512×96. Artistic details/heights are
  explicitly illustrative. MIT scope is documented in the project licence.
- `projects/surrey/surrey.module.css`: original code-native skyline start screen;
  no downloaded photo or generated bitmap. It introduces the game, with visible
  text equivalents and decorative shapes hidden from assistive technology.
- North-up SVG map shares the loaded geographic asset; accessible labels report
  player location, objective and marker meanings. No exported map image.
- The existing Labs social image is reused without changing its bytes or rights.

## Surrey Adventure V0.2 — October 30, 2026

No geographic snapshot or external binary/image asset is added or replaced.
`scenery.ts` extends original MIT procedural code with shared rounded people,
curved Central City tower/podium/atrium, civic/station/library detailing, park
fountain/amphitheatre and decorative buses, cars, shelters, benches, bins and
barriers. Geometry is in scene metres, textures generated at runtime; no raster
export dimensions apply. `landmarks.ts` records seven primary architectural
references; see project third-party notices. These are visual cues, not copied
photographs, surveyed dimensions, official logos or public artwork. Fictional
signs do not identify real businesses as crime locations. Canvas description,
visible HUD, labels, journal and nearby text provide context; no decorative image
requires a separate HTML alt attribute. Original code remains MIT licensed.

## Vancouver V0.4 geographic assets — October 30, 2026

- `/vancouver/v0.4-2026-10-30/city.json` and adjacent manifest: 545,239-byte
  derived geographic asset in the original eastern False Creek extent. Retains
  all V0.3 building footprints, source road lines, water and land. Published
  V0.1–V0.3 assets are unchanged; checksums are recorded beside each version.
- Offline processing widens 110 illustrative junction aprons to 10.5 m radius,
  clips them around water/buildings and creates matching pavement/collision cells.
  Three manual-route waypoint lists and a network-component audit are included.
- 18 NRCan February 2013 LiDAR maximum roof heights are matched at IoU >=0.8;
  102 City 2009 heights and 316 estimates remain. No NRCan footprint/roof shapes
  replace the existing geometry. Poor-quality 2016 records are rejected.
- NRCan optimized GeoParquet was accessed with pinned-ETag verified ranges:
  12,211,931 bytes transferred, 372 bounded records. Per-record dates, identity,
  quality and raw/output SHA-256 support reproducibility. OGL–Canada and
  OGL–Vancouver apply to their respective derived data; code MIT is separate.
- Public role: free-roam 3D model, street map and text provenance. JSON has no image
  dimensions/alt text; accessible map labels and the six-place text fallback remain.
  Original procedural road markings are clipped to pavement. No external raster,
  logo, photo, sound, font, architectural asset or government endorsement is added.

## Surrey V0.3 reconstructed geography — October 30, 2026

- `public/surrey/v0.3-2026-10-30/city.json` and manifest: 3,003,834-byte City-derived
  snapshot in the retained 1.31 × 1.45km extent. V0.1 stays byte-identical. Added
  128 road-surface records, 660 active curb features, 92 active medians and 262
  active paths. Explicit paired-curb/lane-width fallback fills uncovered corridors.
  The manifest contains exact URLs, UTC retrieval times, raw/output hashes, CRS,
  tolerances, classifications and limitations. Current OGL–City of Surrey applies.
- All 786 retained building parts have metre-verified, source-matched heights; no
  measurement-date/method claim. No DEM/LiDAR terrain is redistributed. Flat ground
  remains because the 2025 vertical datum was not verified. Source footprints,
  story anchors and collision cells remain unchanged.
- `architecture.ts`, `buildings.ts`, `scenery.ts`: original deterministic facade
  variants (128×128 canvas textures), setbacks, balconies, entrances, roof equipment,
  footprint-following library ribbons, civic canopy and station canopy/platform.
  Road-name signs are 256×64 canvases. All procedural code is MIT; original primary
  architectural references are cited in project notices. No photos, proprietary
  meshes, artwork, fonts, logos or new external binary assets were imported.
- `ViewControls.tsx`: original inline walking/city SVG icons and accessible text;
  icons are decorative/aria-hidden. Mobile panels open on request. Canvas/map labels
  and visible mission/help text remain the non-image context. The existing Labs
  social image is unchanged. JSON has no raster dimensions or image alt text.

## Vancouver V0.5 procedural updates — October 30, 2026

- No geographic, raster, audio, logo, font or external model asset is added or
  replaced. All V0.1–V0.4 dataset URLs and bytes remain unchanged, including the
  V0.4 545,239-byte city. Existing City/NRCan attribution continues to apply.
- Original procedural bridge materials temporarily fade when they obscure the
  ground-level car. Bridge geometry stays illustrative and view-only; no elevation
  survey is implied. Interactive canvas dimensions remain responsive; the existing
  accessible canvas label and six-place text alternative remain available.
- The separate development-only elevation lab is original MIT code/geometry: a
  synthetic 480 m corridor with an 8 m deck and a disconnected ground underpass.
  It is not a public geographic asset or a reconstruction of Cambie Bridge.
- User-supplied phone screenshots are private diagnostic evidence, not public
  website assets. They are not copied into the repository or redistributed.


## Surrey V0.4 — Living Surrey

Surrey V0.4 adds two local JSON provenance assets in `/surrey/v0.4-2026-10-30/` (release manifest and fresh bounded terrain review; City open licence attribution retained). Existing city bytes are unchanged. Original MIT canvas window-emission masks (128×128 per shared facade material), fictional workshop sign, rack/planter/entrance geometry and synthesised four-note marimba motif add no external art/audio. Geometry is illustrative; no real storefront or measured prop-position claim. No AI-generated bitmap asset is used.

## Richmond V0.1 geography and procedural scenery — October 30, 2026

- `public/richmond/v0.1-2026-10-30/city.json`: 39,126,373 bytes; metric geometry,
  source-node road topology, water/land/parks, parking/aprons, 33 authored playable
  destinations and building overview. 34,540 road/path/airfield ways, 59,361 building
  footprints, 137,093 nodes and 146,604 edges; WGS84 bounds
  `[-123.235,49.10,-122.94,49.215]`, EPSG:32610, local x east/z south.
- `tiles/*.json`: 686 original geometry-detail tiles, each covering 512 m, loaded
  near the player. No photographic dimensions or bitmap assets apply.
- `manifest.json`, `excluded-road-edges.json`: complete input/output digests,
  retrieval/source-edit dates, source URLs/counts, processing assumptions and
  excluded public-road edges. Observation dates are unknown. Large raw OSM XML
  and normalized caches remain outside Git.
- Rights: © OpenStreetMap contributors, ODbL for the entire derived database,
  including authored entrance connectors and fictional airport gate. Original
  TypeScript/procedural models are separately MIT. See the adjacent manifest and
  `projects/richmond/THIRD_PARTY_NOTICES.md` for source and licence URLs. No copied
  municipal imagery, proprietary architectural/airport plans, logos or photos.
- Heights: 1,038 source-reported, 3,784 inferred from floors, 54,539 illustrative;
  none newly surveyed. Vehicle-bridge elevation and ramp grades are illustrative.
- Runtime artwork: original instanced characters, cars, parked aircraft, trees,
  furniture, signs, façades and original mall/terminal/office/restaurant/lobby
  interiors. Approximations do not claim exact current architectural accuracy.
- Public role/alternative: playable Richmond map and fictional delivery adventure;
  canvas has a keyboard-control accessible description, and the route supplies
  server-rendered controls, coverage, attribution and text explanation. Responsive
  phone controls stay outside the canvas. No external font/image dependency added.

## Surrey V0.5 transport — October 30, 2026

- `public/surrey/v0.5-2026-10-30/transport.json`: 17,135-byte original derivation of
  retained City road/pavement/curb/median/building/rail data. SHA256
  `262287b51014c66c617b684f05db0e772a90fe00b2aff029259ea98c05f44627`.
  Units are local metres, no pixel dimensions/alt text. Adjacent manifest records
  lineage, source/parent hashes and the City open licence. Role: a conservative
  driving mask, 218.30m delivery route, 92.27m traffic loop and 811.83m connected rail
  chain. It is not a navigation/survey product. Earlier snapshots are untouched.
- `transportScene.ts`: original MIT runtime geometry for four-wheel compact cars,
  front/rear lights, steering animation, three train cars with doors/windows,
  route/parking marks and platform lights. No external models, logos, recordings,
  images or generated bitmap art. Rendered in the existing accessible game canvas;
  controls, status and map provide textual equivalents. Railway supports are
  illustrative, spaced and kept off paved roads; boarding is not claimed.

## Vancouver V0.6 research data — October 30, 2026

No public image or production geographic asset changes. The source-repository-only
`projects/vancouver/development/cambie-research-v06-2026-10-30.json` is a 28,668-byte
City-alignment/provincial-DSM/DEM derivative, excluded from production bundles.
SHA256 `7ea36275bfd34834efa7e404efe5a5ce6379503919b4064efc4636990b0928d8`.
Source acquisition/retrieval, transformations, exact inputs and Open Government
Licence–BC/Vancouver attribution are in [the elevation report](VANCOUVER_V06_ELEVATION_2026-10-30.md).
Widths/cross-sections are illustrative; no survey or public bridge-driving claim.
Dimensions/alt text are not applicable to structured data. Test screenshots and
source PDFs remain in private evidence retention; no third-party imagery or owner
phone photos were added to public assets. Existing V0.1–V0.4 URLs remain immutable.

## Surrey V0.6 candidate transport — October 30, 2026

- `public/surrey/v0.6-2026-10-30/network.json`: 380,826 bytes, SHA-256
  `53842626ecff589ef802e5d79a51862a6ee0697ddb296b2aa83aaff53ab1bc52`.
  City-derived vector geometry: 133 connected road segments, accepted turn
  transitions, eight roadside stops, one traffic circuit and fictional closure.
  Exact source requests, raw/output checksums and processing are in its manifest;
  the connectivity report records exclusions and reachable outward/return routes.
  OGL–City of Surrey attribution retained. No raster dimensions apply.
- Original MIT procedural workzone barriers, Nora/Mina characters, animated train
  door panels, GPS route line and batched signal bulbs extend existing shared
  geometry/materials. Illustrative gameplay assets, not measured street furniture.
- The map has a north-up accessible description and an explicitly labelled
  destination select; the game canvas retains control instructions. No third-party
  photo, model, font, AI bitmap or private identity is added. V0.3 and V0.5 bytes
  remain unchanged. This candidate awaits rendered-browser acceptance.

## UBC Virtual Campus — 2026-10-30

- `public/ubc/v0.1-2026-10-30/`: compact transformed UBC Campus + Community Planning
  GIS snapshot. Pinned source files, hashes, bounds, processing, units and licences
  are in its `manifest.json`; original layers use PDDL 1.0. No staff/editor metadata
  is needed in the visitor payload.
- `projects/ubc/architecture.ts`: original procedural timber, concrete, glass, nets,
  shelves, apparel, furniture, stairs and public-space models. Level B research
  reconstructions; no as-built accuracy or private-space access is asserted.
- `projects/ubc/stadium.ts`: original field, dugout, bullpen, grandstand, fence,
  signage and lighting geometry. Markings and architectural measurements remain
  approximate pending visual acceptance.
- `projects/ubc/scenery.ts` and `people.ts`: source-position trees, original facades,
  procedural textures and stylized simulated people. No copied portraits or voices.
- No photographic textures, UBC logos, third-party model downloads, externally
  hosted images or generated bitmap assets were added. Photographs/plans were
  used only for research and remain linked to their copyright owners.
- `docs/validation/ubc/`: 25 real local browser/scene captures. PNGs are unmodified
  WebGL photo-mode exports; JPEGs document UI interactions and may retain the in-app
  viewport padding/development indicator. Per-file dimensions, hashes and capture
  provenance are in `manifest.json`. These are original application reconstructions,
  not photographs of UBC, official architectural assets or real-person likenesses.
  They are documentation evidence, not new production page imagery.

- `public/ubc/preview-map.svg`: 288 KiB original vector welcome illustration,
  derived from the same sourced building polygons and road lines. Decorative alt
  text is empty because the adjacent text supplies its purpose. GIS PDDL applies;
  this is explicitly a vector map, not a browser screenshot.

## Orchard Commons MVR — 2026-10-31

- `public/ubc/orchard-v0.2-2026-10-31/`: five transformed UBC subbuilding sections,
  both unchanged parent footprint rings, entrance/route provenance, historical
  height evidence and interpretation notes. Raw/output hashes and byte sizes are
  in its manifest. PDDL 1.0; source author metadata excluded.
- `projects/ubc/residence*.ts`, `doors.ts`: original MIT facade, furniture, door,
  bathroom, kitchenette, lift and deterministic 128 × 128 grain/fabric textures.
  No photographic textures, copied models or UBC logo assets.
- `ResidenceGuide.tsx`: original SVG schematic of the fictional floor, named
  “Representative residence floor plan, courtyard at the bottom”.
- `docs/validation/ubc-orchard/`: 18 actual local scene/browser captures and four
  production captures (19–22), including the live bathroom finish, sourced dialogue,
  phone follow-up and aerial model. PNG exports and browser JPEGs are unmodified.
  Dimensions, hashes and descriptive labels are in `captures.json`. They show
  the independent reconstruction, not real students or campus photographs.
  UI captures retain tool-side scaling/padding. No editing or AI generation.
  Public drawings and reference photos remain outside Git.

## UBC V0.3 navigation — 2026-10-31

The third-person visitor reuses the original MIT procedural figure in `people.ts`,
with deterministic clothing/backpack and distance-driven limb animation. No external
model, portrait, texture, voice or new licence is introduced. `CampusMap.tsx` retains
the original PDDL-backed GIS rendering; selection pins and the GPS arrow are original
SVG/CSS UI. They do not represent live people or device location.

## UBC V0.3 original procedural assets and research facts

`projects/ubc/{props,traffic,activities,appearance,architecture,people}.ts` adds
original meshes for sport kits, a small geometric bird mark, seated bus passengers,
vehicles, wildlife/bicycles/sports equipment, customizable visitors, Rose cladding,
Hennings classroom, War Memorial Gym and Nest café/fair fixtures. MIT; dimensions
are stated or reconstructed, not licensed third-party mesh copies. No portrait,
real person's voice, university/operator logo, source photograph or pupil project
is shipped. Source references/terms: `projects/ubc/THIRD_PARTY_NOTICES.md`.

`projects/ubc/data/{athletes,faculty,transit,expansion-anchors,west-tenth}.json`
contains factual professional/season extracts, source UBC PDDL anchors, TransLink
route geometry and Vancouver Open Government Licence street geometry. Source URLs,
verification dates and raw digests are retained. They are data, not public-photo
assets. Full campus/faculty completeness is not asserted.

`docs/validation/ubc-navigation/*.png` are actual application/browser captures,
with capture details and limitations in that directory's README. No generated
marketing image stands in for a working scene; recovery credentials are excluded.

V0.3 validation gallery: `docs/validation/ubc-navigation/` contains 22 actual
browser captures: 19 local and three corrected public-release captures. Desktop
1280×720, phone 390×844, tablet 768×1024; capture 20 was replaced with a visibly
rendered final release scene. Captures 21/22 show the live profile form and walking
guide. Original application output, no processing beyond PNG capture, no external
portraits/logos/reference photographs embedded. Link captions in the gallery README
provide descriptive labels. These are engineering evidence, not public marketing
imagery; no recovery credentials are visible.

## UBC encounter refinement evidence — 2026-10-31

Four unretouched JPEG browser captures in `docs/validation/ubc-conversations/`,
for engineering evidence only (not new site assets). Source: actual UBC app,
directory from production and remaining captures local;
original procedural figures/architecture and retained licensed GIS geography.
No real portrait, new logo, private profile or external model is included.
The gallery labels provide descriptive link text/alt context.

- `directory-crescent-west.jpg`: 1280×720; directory crescent west.
- `rose-path-spacing.jpg`: 1280×720; baseball precinct path spacing.
- `werker-wave-desktop.jpg`: 1280×720; werker wave desktop.
- `werker-wave-phone.jpg`: 390×844; werker wave phone.

## UBC natural dialogue evidence — 2026-10-31

Two unretouched JPEG captures in `docs/validation/ubc-natural-dialogue/` are
engineering evidence from the compiled local application, not new public site
assets. Original procedural character/campus output; no external portrait, logo,
private profile data or user-supplied screenshot is included. No processing beyond
browser capture. Existing GIS provenance remains unchanged.

- `mitch-introduction-desktop.jpg`, 1280×720. Alt: “Mitch introduces himself as a
  UBC Baseball coach, with conversational follow-up choices.”
- `mitch-introduction-phone.jpg`, 390×844. Alt: “The phone conversation shows Mitch's
  brief introduction, with source and simulation notes in optional sections.”
