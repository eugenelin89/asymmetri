# UBC natural dialogue — production receipt

Verified live at `https://asymmetri.co/labs/ubc` and the corresponding `www` URL.
Activation completed October 31, 2026 at 18:31:51 UTC (11:31 PDT), under the
owner's standing instruction to deploy after implementation and validation.

The [implementation report](UBC_NATURAL_DIALOGUE_2026-10-31.md) describes concise
introductions and conversational replies across all 976 static character records,
plus participant-profile introductions. Source and reconstruction notes remain
optional. Participant-authored answers, geography, crowd routes, immutable data
and the profile-storage format are unchanged.

## Exact release

| Item | Verified value |
| --- | --- |
| Implementation | `d7066ac` |
| Linux source | `f3e5a9fd530ca3acd28f9f8200d6668e79c03273` |
| Next build | `UvDOiPq9Ko5YmOkq4aC66` |
| Linux workflow | `41228994357` |
| Artifact | `13052284896` |
| Node | `v22.23.1`, existing binary unchanged |
| ZIP SHA-256 | `745624d0b7f7a788134c9b4494ce1bc9674d74082d2dfe9a55c78a853f704bc7` |
| Runtime tar SHA-256 | `165cfb5a9924954097ef3600571ca7a14f583b15c521040bfeb6a1864d7dd43f` |

The application-owned independent checkout received the exact Linux runtime;
download, transferred checksum, source and build identity matched. Private smoke
passed before the whole-directory activation. Subsequent documentation/gallery
commits do not change this deployed source. No macOS dependencies were deployed.

## Acceptance

- Exact Linux workflow: TypeScript/ESLint, production dependency audit (zero
  vulnerabilities), Next webpack build and 226 tests passed: UBC 56, Vancouver
  74, Surrey 69 and Richmond 27. The existing unrelated tutorial-navigation lint
  warning remains. Local Vinext and Next builds also passed.
- Private candidate: 17 routes, eight protected host checks, 24 tutorial assets,
  124 legacy tutorial IDs, homepage division links, native image optimization,
  all 688 Richmond outputs and six UBC assets passed. Public profile projection
  and anonymous owner lookup passed without changing the store.
- Public: 17 routes and 24 tutorial assets returned 200 on both hosts. Before/after
  content, links, IDs, canonicals and tutorial hashes matched. Another 70 public
  copy, redirect and immutable asset checks passed.
- Four read-only community/profile checks passed on both hosts with `no-store`.
  Christopher Lin's opt-in profile remains present, anonymous owner lookup is
  null, and private ownership material is absent from the public projection.
  No test profile was published and no recovery credential was used.
- Fresh production browser: walked into Rose, encountered Mitch, selected
  “Who are you?” and received “I’m Mitch Hodge. I’m a coach with UBC Baseball.”
  Typed “Hi, who are you?” returned the same introduction. Facility follow-ups,
  optional information, thanks, goodbye and return-to-scene focus passed.
  The live warning/error log was empty. Desktop and 390×844 phone captures are
  [retained](validation/ubc-natural-dialogue/README.md); no horizontal overflow
  was observed. Local checks also covered tablet layout and unsupported questions.

Viewport automation is not physical-device testing. No sustained performance/load
measurement or complete screen-reader audit is claimed. Responses remain curated;
they do not provide unrestricted AI dialogue. A minor existing topic-list behavior
can offer Einstein's identity question again after his introduction.

## Final health and recovery

Continuous guards retained 192 MiB available-memory and 6 GiB free-disk floors.
Private smoke minima were 290,552 KiB available and 6,507,143,168 bytes free;
activation monitoring reported no guard errors. Final health at 18:34:02 UTC found:

- Exact source/build above, clean source and unchanged Node binary.
- Website active, running and enabled, with zero automatic restarts.
- 412,324 KiB available memory and 6,506,876,928 bytes free disk.
- All five peer services, 56 configuration fingerprints and 13 unrelated virtual
  hosts unchanged; private profile modes remain 0700/0600.
- No post-activation error entries. The prior process recorded its expected
  exit 143 during the controlled restart.

The complete immediate predecessor remains expanded at
`/var/www/asymmetri-rollback-before-ubc-v033-dialogue-20261031`, with source
`bbf194c3584637868bf92936da946485caca2929`, build `Ds3XoQLPUe8czRrb_7rcW` and
its own executable dependencies. For rollback, recheck identities and guards,
stop only `asymmetri.service`, retain the failed release separately, restore that
complete predecessor and repeat protected-route/profile checks. Keep the external
`/var/lib/asymmetri-ubc-community` store intact.

## Older runtime retention

To preserve candidate headroom, one older inactive runtime was losslessly archived:
`asymmetri-rollback-before-ubc-v031-profile-routing-20261031.tar.gz`, source
`32f72951135c45b6cfb44281cda9dc1e029d15a2`, build `uSdetjZWMH8Rh69FKnc5J`.
The archive is 397,086,322 bytes with SHA-256
`3b12cbeca46d7f87eb2c1060c93b62d9dec40ee5a12359911237d4d3783e1b57`.

Its clean source/build and absence of open files were checked. An ACL/xattr-
preserving archive was written and fsynced on the Mac, compared with the intact
original using GNU tar, then copied back and checksum-verified before removing
only the expanded inactive tree. Both archive copies and adjacent receipts remain.
Final health rehashed this archive and the two earlier archives retained in the
V0.3.2 evidence directory. Current live, immediate rollback, other retained
rollbacks and profile data were preserved. The historical V0.3.1 rollback path
is now an archive, not an expanded runtime directory.

For historical recovery, verify hash, available capacity and archive paths, then
extract into a separate empty directory with GNU tar preserving ownership, ACLs
and xattrs. Verify complete source/build/runtime before considering activation.

Root-only operational evidence is under
`/var/lib/asymmetri-ubc-v033-dialogue-release-20261031`; private Mac receipts and
archives are under `~/dev/asymmetri/deployment-retention/2026-10-31/ubc-v033-dialogue`.
No profile data, credentials or signed download URLs are committed to Git.
