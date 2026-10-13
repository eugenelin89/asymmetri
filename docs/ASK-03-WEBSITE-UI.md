# Ask visitor interface: production path, closed intake

The public `/botsquad/ask` page remains closed to questions. The production client
can read authoritative same-origin availability at `https://asymmetri.co`; it never
creates a session just by loading. The approved production disclosure list in
`content/site.ts` is empty, so no question form is exposed even if a receiver
advertises `available`. A genuine service must advertise a service/privacy-version
pair matching verified operator, provider, research, retention and deletion facts.
Consent binds that exact pair. Availability is presentation only: each receiver
action independently checks ownership, authority, limits and current suppression.

`www` retains the useful page and exact public context link, with an apex entry
link for private conversations. It does not cross origins to fetch credentials or
private content. Unknown/duplicate query fields are rejected. Private text and
conversation/session IDs never enter public URLs. Motion policy routes stay separate.

## Ownership and recovery

- `app/botsquad/ask/page.tsx` provides noindex/nofollow/no-referrer composition.
  Only development plus `ASYMMETRI_ASK_UI_MODE=synthetic_fixture` supplies the
  synthetic disclosure; a production build ignores that fixture flag.
- `components/ask/use-ask-chat.ts` owns consent, memory-only text, owned history,
  request recovery and privacy controls. `lib/ask-client.ts` validates unchanged
  canonical DTOs and permits only relative browser API paths. Neither has an HQ
  signing key, provider access or an activation switch.
- `content/site.ts` owns public copy and the reviewed disclosure registry.
  No production provider or retention facts are invented by the interface.

Tab storage v2 uses an explicit allowlist: session/CSRF metadata, a frozen
session-create service/privacy pair, conversation/request IDs, optional admission
ID/hash, and pending privacy controls. Drafts, frozen request bodies, answers and
record context stay in memory. Legacy migration first replaces the existing key
with content-free metadata, then writes v2 and removes the legacy key. A failed
later write preserves the earlier durable uncertainty marker. Validated metadata
is usable in memory for read/delete even when storage writes fail; fresh questions
remain blocked. A browser that forbids all storage changes cannot guarantee cleanup
of an existing legacy value; that failure blocks admission and is not reported as
successful removal.

A retry while the exact body remains in memory uses the same idempotency key and
body. After reload, a known admission resolves only through its exact owned
question ID/hash. Canonical v1 has no visitor lookup by submission key, so an
unknown admission cannot be guessed from identical text or the latest turn.
It remains held until an owned conversation-wide suppression receipt. Cancelling
another visible question preserves that marker and retires any remaining body;
no hidden text is replayed. Lost cookies/expiry cannot be bypassed by IDs. Explicit
local Forget invalidates in-flight reads and never claims server deletion.

Owned reads and cancel/delete work independently of admission availability,
roster and disclosure checks. A changed privacy version revokes consent and
preserves old ownership for read/delete. Each Send rechecks advertised identity;
it cannot change the body of an existing session-create key. Controls hide bodies
before transmission and retain their identity until an owned suppression receipt.

Ordinary polling waits at least 30 seconds, respects advertised/problem retry
delays (up to 24 hours), and backs off exponentially to eight minutes on repeated
failures. A closed page without a conversation waits five minutes. Roster reads
are at most once per five minutes. Manual Check respects the same deadline;
privacy controls are independent. Hidden tabs abort reads. Displayed conversation
bodies expire after 30 seconds, checked by a five-second timer, even when another
endpoint extends polling backoff. Pages cap time, bytes and turn count and reject
inconsistent identities. Replies use plain text, exact evidence links, attribution,
timestamps and polite announcements without automatic scrolling.

The [readiness and gap matrix](ASK-04-READINESS.md) distinguishes source acceptance,
synthetic evidence and the remaining operational gates. The [earlier website
release](ASK-03-RELEASE_2026-10-13.md) is historical deployment evidence; it does not
claim that this new source packet is already installed.

## Local verification

The commands remain current; browser observations below describe the original
October 13 synthetic packet. See ASK-04 for the subsequent recovery changes.


Use `.nvmrc` and run:

```sh
node --test tests/ask-ui.test.mjs
npm run check
npm run build:next
npm run build
```

For interface development only:

```sh
ASYMMETRI_ASK_UI_MODE=synthetic_fixture npm run dev:next -- --webpack --hostname 127.0.0.1 --port 4317
```

That command alone supplies no receiver and therefore shows an unverified local
service. Functional browser acceptance needs a disposable same-origin adapter to
the actual Ask receiver, ephemeral synthetic authority and a signed authored
responder. It must never point at operational state. The separately committed
[HTTPS interoperability fixture](ASK-01-INTEROPERABILITY.md) is for typed producer
acceptance and does not itself supply this browser adapter. Do not publish either
fixture or put its configuration on production.

October 13 browser acceptance used a temporary loopback adapter and real receiver
routes with a synthetic signed responder. The adapter mapped a local HTTP test
cookie to the receiver cookie; this is **not** proof of production Secure-cookie
behavior. Verified-TLS cookie/transport tests are separate. Its temporary state and
keys are removed on shutdown. No actual employee or model ran.

Verified paths: consent and Send; authored answer/worker/timestamps; lost response
followed by refresh and same-question replay during disabled intake (receiver
count stayed at two); expiry-aware cancellation; deletion followed by reload with
no restored history; lost initial session response and explicit fresh-session
recovery; contextual reference and outcome-unknown hold; visible keyboard focus,
polite status regions and no console errors in the completed fixture flow.
An HTML-like authored answer was rejected by the receiver with 415 before delivery.
The responsive browser API ignored viewport overrides, so disposable iframe
viewports inspected actual 390/768/1440 CSS-pixel layouts without overflow.
This is desktop-engine responsive verification, not an actual phone/device test.

The original nine-test suite covers unsafe/ambiguous links, response binding,
same-request replay, bounded/error responses, pagination, storage, identical old
questions, histories with declined turns, and stronger privacy receipts. These
checks do not establish provider retention, genuine execution, operational
capacity, or HQ physical purge/restore behavior.

Original packet checks passed: nine focused tests, TypeScript/ESLint (one existing
tutorial navigation warning), Next webpack production build, retained Vinext
build, production dependency audit with zero findings and `git diff --check`.
Turbopack encountered the documented local socket-permission failure; the
webpack fallback passed. The built production page remained form-free even with
the synthetic flag present, rejected unsupported query fields and retained
Motion footer links. Production-preview fixtures had zero sessions/questions/
answers at shutdown; every temporary browser fixture tree was removed. No public
asset, vendored contract, receiver source or dependency changed. New public copy
and source were checked for private identifiers, credentials and superseded
branding. No new animation is present; existing reduced-motion rules remain.
