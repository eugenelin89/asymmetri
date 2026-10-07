# Company architecture decision and source review, October 7, 2026

Status: owner-directed current architecture. This supersedes the September
Labs → Work/Sport hierarchy, singular Sport brand and homepage content trials.
Historical prompt archives and the dated portfolio decision remain unchanged.

## Known-good production rollback baseline

Established **before any implementation edits**, October 7 at 17:46 UTC
(10:46 PDT). The annotated tag was pushed and its peeled remote target verified:

- Tag: `website-pre-architecture-redesign-2026-10-07`
- Production SHA: `679f3378701af6b04557c0bebff15120f21e3754`
- Production branch: clean `main`, no tracked changes or untracked source files;
  equal to fetched `origin/main` (ahead 0, behind 0).
- Running build ID: `wDUsxJLdjZbrqjgrftfuX`; built October 6 before the 20:51 UTC
  service activation, consistent with the prior distribution publication ledger.
- `asymmetri.service` active; loopback homepage HTTP 200; homepage, Motion,
  tutorial, privacy and support HTTP 200 on both apex and www.
- Baseline logs contain malformed Server Action request errors, including October
  7 at 02:17 UTC. Ordinary page probes passed; these are pre-existing errors, not
  redesign regressions. No startup failure was observed.

The tag is immutable. Never move, delete or reuse it. The same rule applies to
the post-verification release tag. See `DEPLOYMENT.md` for safe staged activation
and rollback; final paths, release SHA/build ID and verification live in the task's
external release receipt to avoid a self-referential source commit.

## Sources reviewed

All upstream refs were fetched; the request's review anchors remained current:

| Repository | Reviewed upstream revision |
| --- | --- |
| Website | `679f3378701af6b04557c0bebff15120f21e3754` |
| Motion | `83058e58c2f9e63133aff23b791760d8e2788331` |
| BotSquad | `968a0e2b8c96eb1f1bde397227f4fab8e4e30c76` |

Motion was read from fetched `origin/main`, not its older local checkout. Its
unrelated untracked scratch file was preserved. BotSquad was inspected through
an isolated temporary reference clone. Neither product repository was edited,
built, deployed or activated. Their implementation/acceptance evidence is reused
as source authority; this task validates the website, not those products.

### Motion

Authority: documentation map and October 6 freshness audit, current Project
Context/Product Understanding, Decision 88, Baseball Product Family and October
Roadmap, V1.x roadmap, Longitudinal/Team roadmap, Monetization/Entitlements,
Mechanics Lab, V1.2 readiness, active V1.2-05 plan and distribution ledger.

The accepted binary source is `8a2f5e57836ee9ca981ef70fcc0845d3b38e13fd`, Motion
1.2 (2). The distribution ledger records no upload, submission or public release;
Apple authentication/provider/distribution signing remain pending. Therefore
**Preparing for release** remains the public status. No App Store CTA or price.

Decision 88 establishes separate individual Pitching/Hitting apps and **one**
professional Team app. Team Pitching/Hitting/Baseball are entitlement combinations
inside it, preserving the account, organization, roster, Athlete identities and
Cloud data on upgrade. Team requires Cloud and finite, observable storage; exact
quotas/prices remain undecided. Shared technology does not collapse pitching and
hitting events or scientific meaning into renamed metrics.

At the reviewed head, only V1.2-05 has an active implementation/distribution plan.
Hitting and Team are approved roadmap work, not active implementation. Both are
labelled **Planned**. The internal October target is not a public date. The sequence
is V1.2 distribution, Hitting, Team, Team productionization/Enterprise, then deeper
Mechanics Lab. Final visible names remain a marketing choice centralized in
`motionFamily`. Reference Study/Compare, Notes/context and review sharing are
implemented in the V1.2 candidate; they do not infer Reference measurements or
scientific validation. Existing capture, evidence, history and local-data limits remain.

### BotSquad

Authority: README, Project Memory, Project Vision, Roadmap, AI Organization Model,
Intelligent Company Model, current-state/validation records and Decision 026.
Prompts 01–11 and WE-01 are recorded complete, with the live-operation result
explicitly bounded and supervised. Personal Operator stabilization 01–03 is recorded
as deployed; daily reliability/clarity is the current priority. No broad unattended
business success follows from those records.

The site now describes an **experimental, open-source, MIT-licensed, self-hosted
Asymmetri Labs project**. Operator-controlled Ubuntu HQ and private SSH-tunnel
browser access remain current. Native iOS/no-tunnel mobile is deferred, replacing
the stale website claim that standard web/mobile access is in development.
Tasks, conversations, working groups, artifacts, review, persistent logical workers
and bounded authority are represented without unlimited memory/continuous-inference
or hosted SaaS claims. The approved English introduction remains `E5r_lOecC-M`.

Investment README, Product/UX, Roadmap, Ask BotSquad and Ask Roadmap explicitly
remain design/planning authority. No public investment dashboard, visitor Q&A,
endpoint, account, storage, activation or financial outcome is advertised or added.
Future genuine projects can enter `labs.projects` when supported and authorized.

## Delivered architecture

```text
Asymmetri.co
├── Asymmetri Sports /sports
│   └── Asymmetri Motion /motion
│       ├── Individual: Pitching, Hitting
│       └── Professional: Team (Pitching/Hitting/Baseball entitlements)
└── Asymmetri Labs /labs
    └── BotSquad /botsquad
```

The umbrella uses Asymmetri; this asserts no legal corporation name. Sports and
Labs share useful capability, inspectable results and human judgment as principles,
not an asserted shared platform. Motion's own product family shares technology.

Preserved: authentic pitching photograph and founder story, Motion icon and evidence
capture, tutorial originals and stable hashes, synthetic Explorer concepts, BotSquad
flow/example, Motion video `kaSatKC8HBg`, current BotSquad video and deliberate loading.
Only current umbrella references in the audited Motion policy change to Asymmetri;
app/Apple/website/Gmail/retention commitments and the policy date remain intact.
Future Team Cloud is clearly outside the current local pitching product/policy.

Compatibility: `/sport` → `/sports`, `/work` → `/labs`, historical story/platform
redirects and root fragments target retained Sports anchors. Protected Motion routes
remain real pages on both domains with exact www tutorial canonical. No backend,
tracking, new dependency, external font, stock image or infrastructure redesign.
