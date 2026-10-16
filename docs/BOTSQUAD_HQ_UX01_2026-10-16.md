# HQ UX-01 website documentation synchronization

## Ownership and release boundary

The owner’s UX-01 brief requires the existing Asymmetri website writer to
synchronize website-hosted HQ instructions with the redesigned HQ. The public
website release is authorized; activation is held until the BotSquad coordinator
confirms the deployed HQ identity. Ask remains paused. This task changes no
receiver, investment authority, API, financial calculation or HQ runtime.

## Inventory and disposition

| Location | Previous reference | Update |
| --- | --- | --- |
| `app/botsquad/trade/hq-guide/article.tsx` | Former sidebar, Executive channel, Attention, Working Groups, Executions and three Investment destinations | Six current destinations; exact paths; first-task exercise; retained dated incident and anchors |
| `content/site.ts` — `hqGuide` | Investigation-only title and discovery copy | Using BotSquad HQ, current task/navigation introduction and updated review date |
| `content/site.ts` — `hqGuideFigures` | Seven October 15 operational screenshots | Explicit historical captions/source labels; original bytes and URLs preserved |
| `content/site.ts` — `hqUxGuideFigures` | No current sample captures | Five actual redesigned-interface captures with isolated authored data and fake-runtime limits |
| `public/images/botsquad/hq-ux01/` | No current screenshots | Home, new task, employee profile, task result and saved result, verified against source manifest |
| `components/investment/guide-layout.tsx` and guide CSS | Horizontally scrolling command blocks | Optional wrapping for the natural-language exercise; diagnostic commands keep original behavior |
| Guide layout, Trade/Research/overview/archive discovery | Centralized HQ guide link | Automatically use updated shared labels; route and noindex behavior preserved |
| Companion Trade guide | Links to the maintained HQ guide; financial/process explanations | Link destination remains stable; historical evidence stays dated |
| README, content/testing/asset documentation | Investigation-only description and seven images | Current tutorial plus historical case; walkthrough acceptance and provenance |
| Prompt journals/release records | Historical requests and observations | Retained as history; not rewritten into current instructions |

## Workflow traceability

| Workflow | Current screen/control | Website section | Validation |
| --- | --- | --- | --- |
| First visit | Home; six destinations; Needs you | `#hq-navigation` | Passed isolated browser walkthrough |
| Create a task | New task → What would you like done? → Start task | `#first-task` | Passed: one fake-runtime task completed and its saved three-point answer opened |
| Follow progress | Tasks → All tasks → Open task → Recorded progress | `#first-task` | Passed isolated browser walkthrough |
| Follow an employee | Team → Employees → Open profile | `#first-task` | Passed isolated browser walkthrough |
| Read results | Results and files → Recorded outcome / saved file | `#first-task` | Passed isolated browser walkthrough |
| Understand owner action/failure | Needs you / Needs your attention; reason and prior attempts | `#first-task` | Source labels checked; isolated failure/retry cases covered by upstream 83-check browser suite |
| Advanced evidence | Activity → Work sessions / Advanced audit; task Advanced details | `#executions`, `#record-chain` | Passed employee profile and Activity → Work sessions navigation; remaining labels source-checked |
| Investment | Projects → Investment → Portfolio & work / Team permissions / Publication | `#hq-navigation`, investigation sections | Passed Projects link and five-item Investment navigation |
| Reconnect | Retry loading | `#first-task` | Label verified in source |
| Historical investigation | October 15 incident at 139a1c5 | `#historical-checkpoint` onward | Seven original bytes/anchors preserved |

## Source and evidence

The safe capture manifest records the tested UI asset hashes, browser settings,
83 passing browser checks and explicit sample-data provenance. The website has
independently checked all supplied UI asset hashes and selected screenshot hashes
before copying five images. A second comparison found no UI asset drift
after the walkthrough. All public content exports outside `hqGuide`,
`hqGuideFigures` and the new sample figures compare exactly with the pre-change
source. Historical screenshot source URLs/dimensions/dates are unchanged. The final deployed HQ identity and any subsequent
asset drift must be reconciled before activation.

This is structured engineering/browser validation, not testing with nontechnical
participants or accessibility certification. A sample fake-runtime completion
does not prove genuine model execution. The maintained upstream beginner tutorial
is `docs/tutorials/first-assignment.md`; the website links it and uses the same
supplied-text exercise rather than leaving the former instructions active.

## Validation and release handoff

Local TypeScript/ESLint passed (one existing tutorial-reader warning), and the
production dependency audit found zero vulnerabilities. Browser validation at
320, 390, 768, 1024, 1440 and 1920 pixels found no horizontal overflow or broken
contents anchors across 20 sections and 12 figures. No console errors were seen.
The supplied-text exercise completed through one explicitly fake runtime attempt,
with recorded progress, employee profile and saved result verified. A wrapped
code block keeps the natural-language request readable on phones.

The initial HQ UX-01 source was `4c0ec5d` (implementation `5fb197d`). The
final Home-preview refinement is deployed as
`8078a3434f455c73017c04178e8f9f6ba51defe3` (implementation `4ea4a71`).
Its stylesheet SHA-256 is
`cc7dfe7f9e5ac4c5a924d06f2d407b4677b13f1d162e8b52f90893f374545389`,
matching the refreshed screenshot manifest. That manifest records base `4c0ec5d`
plus the final tested patch asset hashes and 83 passing browser checks. Five
selected PNGs were refreshed byte-identically and visually reviewed again.
The backend process remains on its existing `dccf209` runtime; the static update
did not restart it. The coordinator reports exact preservation of 188 database
table counts/hashes.

Initial HQ production browser acceptance passed at 1440 and 390 pixels: all 17
shell destinations, retained completed task and saved file, profile/advanced
details, the beginner request field (without submission), Help and all three
Investment routes. The coordinator reports zero browser errors, writes or
runtime catalog probes. Final production acceptance of `8078a34` also passed at both widths, including
bounded Home previews and full task text/results. The coordinator confirmed all
eight served asset hashes and the same zero-error/write/runtime-probe boundary.

The reserved Linux slot is released to this website task for the guarded build.
The coordinator has accepted HQ production behavior and authorized website
activation after its build/review/guards pass. Any later HQ visual-only patch
will be reconciled in the final receipt without asserting that older captures
include it. HQ deployment identity,
website commits/build/activation, resource guards and final public-route checks
will be recorded before completion. Private command outputs and preservation
receipts stay outside the public repository.

Independent website source review found no release blocker. Two minor findings
were corrected: the testing guide now counts twenty contents targets, and the
former sidebar roles/discussion counter are explicitly historical.

## Verified website candidate

- Node 22.23.1 production compatibility: check, 22 Ask/Trade regressions, Sites
  build and Next webpack build passed. The existing tutorial-reader lint warning
  remains; no new warning was introduced.
- Build `rrTJaSzqUzeWpt2fGqrCH`; artifact SHA-256
  `0acd7e4d9edfed2d0d4910320fdf3e6726946395931e17352531e474839e68b0`; 274 source hashes verified.
- Build guard minimum available memory 922248 KiB; free disk 11819225088 bytes.
  HQ process identity was unchanged.
- Local six-width walkthrough, preserved anchors/images, focus, console, audit,
  independent review and upstream tutorial-link checks passed as described above.
- Production website candidate/activation receipts will be appended after the
  guarded release. No HQ, receiver or Ask operation is part of that activation.
