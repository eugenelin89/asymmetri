# GIS Apps production release and link verification

GIS Apps is live at [asymmetri.co/labs/gis](https://asymmetri.co/labs/gis).
The [Labs overview](https://asymmetri.co/labs) now presents GIS Apps in place of
the separate Vancouver and Surrey cards, alongside BotSquad. The Labs menu also
uses GIS Apps. The category's cards retain the original city destinations:

- [Vancouver in Progress](https://asymmetri.co/labs/vancouver)
- [Surrey Adventure](https://asymmetri.co/labs/surrey)

No city URL migration or compatibility redirect was required. Direct footer city
shortcuts remain available. The hub includes the street/building reconstruction
discussion and each city's data and modelling limitations.

## Authorization and coordinated release

The owner explicitly requested deployment and verification of the existing city
links, then reiterated that the Labs overview should link to GIS Apps rather than
present separate city cards. That overview change was already in the tested GIS
implementation; no additional runtime edit was needed.

The Greater Vancouver GTA project's Vancouver chat was already preparing an
independently authorized V0.4 release containing GIS commits `de88c45` and
`bfed817`. The chats coordinated one Linux candidate and one guarded activation,
with the Vancouver chat owning server mutations and this GIS chat independently
checking the public result. No competing build, storage operation or restart was
started. Richmond's parallel work was told to preserve the existing city routes
and wait for the deployment window before shared-file pushes.

## Exact deployed identity

- Source: `313dba357ecc00f1de28b8db5d2c326ec9d1125e`.
- Next build: `Zaa4FN3iARR31Yquw4Cij`.
- Runtime: Node `v22.23.1`, under the existing standing approval.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41110651124): artifact `13003008184`.
- Artifact ZIP digest: `sha256:da5f0e1bc2e9066177bd8b242f970173d29464cd17f74c62cb6f8e92f557343f`.
- Activation completed October 30, 2026 at 18:59:32 UTC / 11:59:32 PDT.
- Independent post-release inspection confirmed clean production `main`, the
  source/build above, service active/running and zero restarts. Systemd records
  its successful service start at 18:59:26 UTC.

The complete preceding Surrey V0.2 runtime, source `52f4451` and build
`kpnCoQ9y6YEz8nDG63G0n`, remains at
`/var/www/asymmetri-rollback-before-v04-20261030`. Follow the established
whole-directory rollback procedure; do not replace only `.next` for this route
addition. Candidate checks, capacity guards, native-image checks, infrastructure
fingerprints and retention evidence belong to the coordinated
[Vancouver V0.4 release receipt](VANCOUVER_V04_RELEASE_2026-10-30.md).

## Independent public verification

Both `https://asymmetri.co` and `https://www.asymmetri.co` passed:

- HTTP 200 for `/labs`, `/labs/gis`, `/labs/vancouver`, `/labs/surrey`, `/motion`,
  `/privacy`, `/support` and `/tutorial`: 16 page checks.
- Labs main content links to GIS Apps without separate direct city cards. GIS
  main content links to both unchanged city routes and contains the reconstruction
  discussion. The global Labs menu retains BotSquad's existing hierarchy.
- Exact canonicals, including `https://www.asymmetri.co/tutorial`; both city
  canonicals remain their original apex URLs. Sitemap retains both city entries
  and adds GIS Apps.
- All 24 tutorial image/original assets and ten current/retained geographic JSON
  files per host: 68 successful HTTP/hash checks. Vancouver V0.1–V0.3 and Surrey's
  immutable V0.1 data remain byte-identical; the new Vancouver V0.4 files match
  committed source.
- Surrey and the four protected Motion pages retain their pre-release main text
  and IDs. Shared header/footer navigation changes are excluded from that content
  comparison. Vancouver's separately authorized V0.4 content change is explicit.
- `/work` → `/labs` and `/sport` → `/sports` remain HTTP 308 on both hosts.
- The current script URLs emitted by GIS and both city pages return HTTP 200.

Live browser navigation followed Labs → GIS Apps → Vancouver and GIS Apps →
Surrey, arriving at the original addresses and expected page headings. The GIS
menu and reconstruction section were inspected; no browser console errors were
observed. This verifies page/link continuity, not a new end-to-end gameplay or
physical-device acceptance campaign.

Independent baseline, after-release and Linux-run receipts are retained outside
Git in `deployment-retention/2026-10-30/gis-apps/`. The final documentation and
journal commits do not trigger another runtime activation.
