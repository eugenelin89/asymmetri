# Asymmetri Labs asset manifest

Last updated: 2026-09-16

This internal provenance record covers public assets. Nothing is hotlinked. The
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
| Public role | The only rendered photograph; homepage hero |
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
