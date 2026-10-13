# Ask visitor interface: dormant production, synthetic local acceptance

The public `/botsquad/ask` page remains closed to questions. It renders an honest
unavailable state and the disclosures required before opening. It creates no
session, makes no Ask API requests, and has no question form. General entry and
exact public record links are supported. Unknown or duplicate query fields are
rejected; private question text and conversation IDs never belong in URLs.

This packet implements an interactive **local synthetic** client. It does not
enable genuine employees, providers, research, operational service authority or
public intake. No production enable switch exists. Opening to real visitors
requires a separate reviewed change with verified provider/retention disclosures,
eligible roster, authority, budgets, interoperability and actual execution evidence.
The infrastructure receipt remains [the October 13 release](INGRESS_RELEASE_2026-10-13.md).
The unavailable public page is now deployed by the [website-only release](ASK-03-RELEASE_2026-10-13.md); the functional client remains development-only.

## Ownership and boundaries

- `content/site.ts` owns `askExperience` copy. The protected Motion privacy page
  is not reused as an Ask policy.
- `app/botsquad/ask/page.tsx` renders the server page, noindex/nofollow and
  no-referrer metadata. Only development plus
  `ASYMMETRI_ASK_UI_MODE=synthetic_fixture` mounts `components/ask/ask-chat.tsx`.
- `components/ask/use-ask-chat.ts` owns consent, owned history, retryable requests,
  polling and privacy controls. `lib/ask-client.ts` validates the unchanged
  canonical DTOs using the existing AJV dependencies and permits only relative
  same-origin browser API paths. It has no HQ signing key or provider access.
- `app/botsquad/ask/ask.css` uses existing graphite/teal tokens and semantic
  responsive layout. No images, new dependencies or animation are added.

The local client accepts only `fixture-ask` / `fixture-privacy-1`. Consent precedes
the first explicit Send. A session cookie remains receiver-owned and HttpOnly;
tab storage contains bounded session/CSRF metadata and frozen unconfirmed request
identity/input, never an answer transcript. Responses are fetched again after
refresh. Session expiry or lost ownership cannot be bypassed with an ID.

Question retries preserve the exact idempotency key and body, including context
and prior turn. Only a matching admission ID/hash and owned input clear a pending
request. Paused intake does not block reconciliation. New questions require
verified availability, consent, storage, no active turn and the eight-answer limit.
Wire pages contain at most eight turns; bounded assembly permits up to 32 admitted
turns, including declined turns. Reads cap bytes/pages/time and reject identity,
hash, worker, routing-policy or service mismatches.

Polling runs every 30 seconds while visible. Hiding the page or losing a verified
read removes answer bodies; resuming fetches again. Cancellation/deletion clear
visible bodies before the request and retain their retry identity until an owned
receipt confirms suppression. A stronger expiry/deletion receipt is recognized
without claiming a new physical deletion. Lost ownership has an explicit local
forget action which does not claim server deletion. Unknown outcomes stay held.
Replies use plain React text, exact evidence links, attribution, timestamps and
interpretation limits. No automatic scrolling occurs. Polite numbered answer
announcements distinguish consecutive replies without exposing private IDs.

## Local verification

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

The focused nine-test suite covers unsafe/ambiguous links, response binding,
same-request replay, bounded/error responses, pagination, storage, identical old
questions, histories with declined turns, and stronger privacy receipts. These
checks do not establish provider retention, genuine execution, operational
capacity, or HQ physical purge/restore behavior.

Final local checks passed: nine focused tests, TypeScript/ESLint (one existing
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
