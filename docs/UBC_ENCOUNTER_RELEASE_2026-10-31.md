# UBC encounter refinements — production receipt

Verified live on October 31, 2026 at `https://asymmetri.co/labs/ubc` and
`https://www.asymmetri.co/labs/ubc`. Activation completed at 16:51:18 UTC
(09:51 PDT). The user's standing instruction explicitly authorized deployment
after implementation and validation.

The [implementation report](UBC_ENCOUNTER_REFINEMENTS_2026-10-31.md) describes
action-and-response conversations, dispersed pedestrians, source-ID directory
grouping and immediate movement focus after travel. Geographic coverage,
architectural fidelity, public datasets and profile storage are unchanged.

## Exact release identity

| Item | Verified value |
| --- | --- |
| Implementation | `797237c` |
| Linux source | `526213d283cba5e70b192cc295e8ccdd3271467c` |
| Next build | `ujW5iepUV_ni0g_OH7ONo` |
| Linux workflow | `41220693298` |
| Artifact | `13050355584` |
| Node | `v22.23.1` — existing binary unchanged |
| ZIP SHA-256 | `655157d9760df7f9dcef0519760c20527cb8a1839ed6cdf60104a3039d9be813` |
| Runtime tar SHA-256 | `ab48bd0d3863a63a56ab5b2dd5a5eb0b22404908eeaabe55cf04c22c70611a05` |

An independent application-owned source checkout received the exact Linux runtime
artifact, with its transferred checksum verified. The private candidate passed
before the complete-directory swap. Later receipt/gallery/journal commits are
documentation only; they do not change this runtime identity. No local macOS
dependencies were deployed.

## Acceptance

- Local: 53 UBC, 74 Vancouver, 54 Surrey and 27 Richmond tests passed (208 total).
  TypeScript/ESLint, Vinext and Next webpack builds passed. Production dependency
  audit found zero vulnerabilities. The existing unrelated tutorial navigation
  lint warning remains.
- Private Linux candidate: 17 routes, protected host behavior, 24 tutorial assets,
  124 legacy tutorial IDs, homepage division links/content, native image
  optimization, all 688 Richmond outputs and six UBC assets passed. Public-profile
  projection and anonymous ownership checks passed without modifying the store.
- Public: both hosts returned 200 for all 17 checked routes and all 24 tutorial
  images. Before/after content, links, IDs, canonicals and tutorial image hashes
  matched. An additional 64 redirect/copy/asset checks passed, including immutable
  Vancouver, Surrey, Richmond and UBC data. Homepage Sports/Labs access remains.
- Public community/profile GET checks returned 200 and `no-store` on both hosts.
  Christopher Lin's opt-in profile remains present; anonymous owner lookup is
  null. No new test profile was published, and no recovery credential was used.
- Local browser acceptance covered introduction, gestures, educational answers,
  healthcare follow-up, unsupported-question refusal, goodbye, history, safe
  source links and focus after Visit entrance/Go here. Phone, tablet and desktop
  viewport checks passed; local console warnings/errors were absent.
- Fresh production browser acceptance showed one Crescent West entry, arrival
  focus on the canvas, immediate backwards movement and turning, and an encounter
  opening with Hello / Who are you? / A question / Wave hello choices. The directory
  screenshot is from this live release. Browser automation disconnected during
  the subsequent introduction recheck, so a complete production conversation
  replay is not claimed. The full dialogue sequence passed locally before release.

Physical-device, sustained FPS/load and full screen-reader testing were not
performed. The crowd remains a bounded procedural simulation. These checks do
not establish photorealism or complete campus fidelity.

## Safeguards and final health

Continuous guards retained the existing 192 MiB available-memory and 6 GiB
free-disk floors. Candidate smoke reached a minimum 258,632 KiB available memory
and 7,004,471,296 bytes free disk. Activation preserved all five peer services and
56 configuration fingerprints. The final check at 16:53:30 UTC found:

- Source/build exactly as above, clean live source and unchanged Node binary.
- Website active, running, enabled, with zero automatic restarts.
- 401,452 KiB available memory and 7,004,205,056 bytes free disk.
- All 13 unrelated virtual hosts and all five peer service identities unchanged.
- Private profile directory/file modes remain 0700/0600 and the profile systemd
  drop-in is unchanged.
- No post-activation error entries. One prior-process shutdown entry records the
  expected exit 143 during the controlled swap.

Root-only evidence is retained under
`/var/lib/asymmetri-ubc-v032-encounters-release-20261031`; private Mac receipts and
archives are under `~/dev/asymmetri/deployment-retention/2026-10-31/ubc-v032-encounters`.
These are operational records, not public assets or secrets committed to Git.

## Recovery and older runtime retention

The complete immediate predecessor remains expanded at
`/var/www/asymmetri-rollback-before-ubc-v032-encounters-20261031`:

- Source `5eb3c8abf2b34b33ab9af298933bcb7174c81a82`.
- Build `fZHe4ybZDxYLvvS2CwwLm`, with its own executable dependencies.

For rollback, recheck the live and rollback identities and resource/peer guards,
stop only `asymmetri.service`, retain the failed current directory separately,
move the complete predecessor to `/var/www/asymmetri`, restart that service and
repeat protected-route and community checks. The private profile store remains
outside release directories and must not be replaced. No dependency install or
rebuild is required for this immediate rollback.

Before staging, capacity was insufficient for another full independent runtime
while preserving the 6 GiB floor. Two older, inactive rollback trees were therefore
losslessly archived using the documented retention procedure. Each clean tree,
source/build identity and absence of open files was checked; an ACL/xattr-preserving
archive was written and fsynced on the Mac, then streamed through GNU tar comparison
against the still-present original. Only after the comparison and durable receipt
passed was its expanded tree removed. The archive was then copied back to the
root-only evidence directory and its SHA-256 verified. Both copies remain:

| Retained archive basename | Source / build | SHA-256 |
| --- | --- | --- |
| `asymmetri-rollback-before-vancouver-v05-20261030.tar.gz` | `248c0a5c382abeba98c601081f2624064dd43a30` / `VnQohiF4lOLKTwiRVOpzn` | `49a1ed5694ed6182742f75974de493c1d7c9b6d2eaabcee94139a5af2b978667` |
| `asymmetri-rollback-before-surrey-v04-20261030.tar.gz` | `44654b31afc61a17667c3fff48f88bc5094a2a3d` / `em5HpR-sbeh857iO3MUWB` | `7afedf7d2299b897c6d5c243b19c67263932885b21b3b46dd2e7db136f8b5127` |

Their adjacent JSON receipts retain archive/source/build evidence. For historical
recovery, first verify the hash and capacity, inspect archive paths, then extract
with GNU tar `--acls --xattrs -xpf` into a separate empty directory while preserving
numeric ownership. Verify the source/build and full runtime before considering
activation. These two original paths are no longer expanded directories. Current
live, immediate rollback, profile data, other retained rollbacks and the homepage
copy-only build backup were not removed. Final health rehashed both archives.

## Screenshot record correction

The four encounter captures were initially saved with `.png` extensions although
the browser returned JPEG bytes. The files now use `.jpg`, and the asset manifest
records their actual dimensions: 1280×720 for three desktop captures and 390×844
for the phone capture. The directory image was refreshed from production and the
path image from the compiled local preview. Conversation captures retain their
original local-browser dark margins; no retouching was performed. This corrects
the initial journal's format description without rewriting its historical record.
