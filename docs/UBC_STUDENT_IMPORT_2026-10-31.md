# UBC supplied student research import — October 31, 2026

The owner supplied a public-source research table covering UBC, CWRU and
Stanford and requested encounter-only student characters. This import reads
**only the 500 UBC rows**. It introduces 498 new student identities and adds
study information to two existing rowing characters, Sarah Cushnie and Claudia
Makhanko-Tang. The same person is not instantiated twice.

The data, registry, movement and conversation integration are complete and
locally validated. All 144 UBC tests, whole-application TypeScript/ESLint checks
and both build systems passed. A real browser encounter verified natural
introduction, study follow-up and source context. The import is deployed in source `704a9b3`; the [production receipt](UBC_COMMUNITY_RELEASE_2026-10-31.md) records exact-source build and live acceptance.

## Source coverage and limits

The supplied research is dated October 31, 2026. It contains 76 study-field
labels. Mathematics accounts for 129 rows, Economics for 87, and Psychology for
55. The original program strings are retained, including degree or
sub-specialization wording. Only Lauren Huang, Christie Wu and David Zhao have
explicitly supplied expected completion years, all 2027. No year is inferred
from an entrance cohort, year of study or previous degree.

| Source host | Supplied rows |
| --- | ---: |
| www.grad.ubc.ca | 221 |
| www.math.ubc.ca | 129 |
| economics.ubc.ca | 84 |
| psych.ubc.ca | 50 |
| www.stat.ubc.ca | 12 |
| econ.cms.arts.ubc.ca | 1 |
| ca.linkedin.com | 2 |
| dykzhao.com | 1 |

These are public-profile study claims, **not registrar-confirmed current
enrollment**. The supplied table is not a representative sample of UBC's
student population. Undated profiles can become stale.

The initial documented spot audit covered 10 records, leaving 490 supplied-only.
A final naming sanity check found and corrected one additional source defect,
so the final documented audit covers **11 records: 9 directly read profiles or
directories and 2 indexed LinkedIn self-reports; 489 remain supplied-only**.
This is not a claim that every individual was independently verified.

The direct samples include Syed-Kaushin Aaron (Mathematics), Bruno Esposito
Acosta (Economics), Ashling Ayekun (Psychology), Gian Carlo Diluvi (Statistics),
Hayfaa Abou Ibrahim (Planning), David Zhao (Computer Science), and the two
overlapping rowers. David Zhao's live personal site states UBC Computer Science
and expected completion in 2027. Direct LinkedIn requests for Lauren Huang and
Christie Wu were blocked; indexed profile text supports the supplied Civil and
Chemical Engineering studies and the 2027 education end dates. These remain
self-reported claims, labelled as indexed evidence.

The supplied Mathematics profile for `Clement PDF` has that malformed display
title and the account heading `c.soubrier`. The
[UBC Institute of Applied Mathematics graduate directory](https://www.iam.ubc.ca/people/graduate-students/)
lists **Clement Soubrier**, a Mathematics PhD student. The character uses that
corrected name, retains the original source URL, and links the correcting
directory. The source snapshot retains the supplied title so the correction is
auditable. No person was removed to conceal this source error.

Per-record audit findings and dates are centralized in
`projects/ubc/student-source-audit.ts`. The interface differentiates **Research
supplied**, **Source reviewed**, and **Indexed source reviewed**. Simulation,
provenance and model details belong in About this simulation, separate from
natural spoken introductions and study answers.

## Import and privacy boundary

From the repository root, with the supplied Markdown kept outside the repository:

```sh
node --import ./projects/ubc/test-loader.mjs projects/ubc/import-students.mjs /path/to/supplied-student-research.md
```

The command selects the UBC section, requires 500 unique UBC records, and writes
`projects/ubc/data/students.json`. It does not fetch profiles, load images,
publish content or change a server. The import reads only names, study fields,
explicit expected completion years and source URLs. Emails, other contact
details, portraits and unrelated biographical attributes are discarded at the
import boundary. Diagnostics do not contain source rows or contact columns.
The source attachment itself is not checked into the repository.

`student-import.ts` normalizes names for deduplication, checks HTTPS sources,
and exposes an exact three-URL allowlist for the two supplied LinkedIn profiles
and David Zhao's personal homepage. It does not authorize arbitrary LinkedIn
or personal-site links. `student-characters.ts` deduplicates against the existing
character registry and supplies study enrichment records for existing people.

Only factual study summaries and references are used. No profile text, portraits,
models, copied logos, voices or other third-party media are redistributed.
Public availability is not presented as a license to reproduce profile media or
as the student's participation or endorsement. Avatars use the project's
original stylized person geometry with arbitrary seeded cosmetic variation;
they do not infer gender, skin tone, hair or clothing from the person's name.

## Geographic placement and rendering

`student-departments.ts` derives **37 department-area search anchors** from
building footprints in the existing UBC open-GIS snapshot. It reuses the
snapshot's local metre coordinate system and PDDL 1.0 attribution in
`public/ubc/v0.1-2026-10-30/manifest.json`; there is no new coordinate transform
or arbitrary campus positioning.

Economics encounters are near Iona, supported by the
[official VSE location announcement](https://economics.ubc.ca/news/vse-moves-to-iona-building/).
Mathematics is distributed around the Mathematics Building, Mathematics Annex
and Leonard S. Klinck; the
[Mathematics student resources](https://secure.math.ubc.ca/Ugrad/ugradResource.shtml)
describe these spaces, although that legacy page warns that some information
may be outdated. Psychology is near Douglas T. Kenny and Statistics near Earth
Sciences; the [Arts program-advisor directory](https://www.arts.ubc.ca/student-support/academic-support/arts-program-advisors/)
corroborates those departmental locations.

Other fields use their source-mapped department buildings or appropriate public
faculty areas. Interdisciplinary and medical programs use representative public
campus areas; some actual research occurs off campus. These are fictional
walking routes, not personal offices, actual class locations, schedules or live
whereabouts. No unverified private room or interior is created for a student.

The planner walks contiguous, collision-tested source path segments. It samples
clearance at intervals of at most one metre, rejects obstructed candidates,
and creates forward-and-back loops whose closing edges remain on the original
paths. Farthest-first ordering spreads encounters across each department area;
all eligible paths remain available. Initial phase varies by character.

The source-building collision fixture produced routes for all **498 new
students**, with **435 distinct underlying traversals**. This number describes
the fixture, not a guarantee after every future architectural collision change.
Planning took approximately 258 ms in one local Node run; this is not a browser
FPS or mobile performance measurement.

The integration retains the existing limit of 12 simultaneously instantiated
streamed named characters. A pure selection helper prefers unseen students and
then the least recently encountered. Rotation must preserve active conversations
and visible people; the root integration uses off-screen checks before replacing
long-lived actors. The 500 records are not 500 simultaneous detailed meshes.
People remain encounter-only, with no directory, map marker or personal location
search entry.

## Validation

Ten focused tests passed, covering the UBC-only import boundary,
500 unique source records, normalized and existing-cast deduplication, contact
exclusion, exact external URL rules, source-review distinctions, natural study
dialogue, appearance variety, actual department anchors, source-path continuity,
collision clearance and fair vacant-slot selection. Integration tests verify all
500 identities are present exactly once in the registry, both existing rowers
receive study questions, all retained source links pass the application allowlist,
and actual Three.js population updates across five department areas keep the
streamed pool at or below 12, preserve active conversations during rotation and
keep student bodies out of source-building collision. Scoped strict TypeScript
and ESLint checks also passed. These DOM-free tests do not replace browser or
whole-application release validation.

```sh
node --test projects/ubc/students.test.mjs
npx eslint projects/ubc/student-import.ts projects/ubc/student-source-audit.ts projects/ubc/student-departments.ts projects/ubc/student-characters.ts projects/ubc/import-students.mjs projects/ubc/students.test.mjs
```

Production deployment is recorded separately above. No physical-device test,
browser FPS result, independent verification of all 500 people, or real-world
occupancy is claimed here.
