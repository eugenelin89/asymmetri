# Campus play-session client

`PlaySession.tsx` exports a null-rendering session component. The parent campus
owns its Start control, playing state and game-region element:

```tsx
<PlaySession campus="ubc" playing={started} regionRef={gameRegionRef} />
```

The accepted campuses are `ubc`, `cwru` and `stanford`. `regionRef` must enclose
the game, rather than the whole page. No analytics request is sent before
`playing` is true. Record eligibility also requires a visible document, an
on-screen game region and game-region input within the last 90 seconds. Start
exploring supplies the initial activity timestamp. Returning from a hidden or
off-screen state requires fresh game interaction. Keyboard, pointer, touch and
wheel listeners retain timestamps only: no key, typed content, pointer position
or event history is read into telemetry.

The client sends only `{sessionId, event, seq}` to
`/labs/campus-analytics-api/{campus}`. The session ID is random and per play visit;
it is unrelated to reviews, profiles or accounts. A first start receives a
cookie-only initialization response and repeats the identical start once. Only
a confirmed cookie response allows session recording or later heartbeats. The
server owns its separate random HttpOnly visitor cookie and computes approximate
active duration from bounded intervals. The client does not send a browser ID,
claimed duration, name, location or user-agent override. IP/browser-information
collection and retention are described by the server operations documentation.

Heartbeats are scheduled at 15-second intervals while eligible. Hiding, leaving
the region, stopping play or 90 seconds without input pauses recording. Page
exit queues a single end intent, using a small same-origin JSON beacon only
after session acknowledgement. At most one ordinary request is in flight for
each session; sequence numbers make transient retries idempotent. Permission or
rate-limit responses stop requests. Failures remain silent to gameplay. Network
loss, throttled timers and missing final events mean duration is approximate,
not an exact measurement of attention or movement.

The owner requested removal of the Play privacy card wherever it appears. UBC
no longer renders it above the explorer or inside its help panel, and the shared
`/labs/campus-privacy` page is a plain article. A standard Privacy link in UBC's
notes opens that article in a new tab, retaining the game position. The article
describes collection, browser privacy signals, existing saved opt-outs, retention
and contact information for questions or removal requests. It does not advertise
a checkbox or deletion control that is no longer rendered.

`CampusPrivacyPreferences` remains exported for compatibility while the separate
CWRU and Stanford workstreams remove their own imports. It is not part of the
current UBC or privacy-page interface. No replacement banner or button is added.
Global Privacy Control and Do Not Track still take precedence; previously saved
localStorage opt-outs still apply across campuses and tabs at the same origin.
Apex and `www` remain separate website addresses. Removing the card changes no
collection, cookie, backend deletion or retention behavior.

All POST requests and explicit deletion use the same exclusive Web Lock across
tabs. Requests re-read the shared privacy choice and their activity state after
acquiring it. This serializes first-cookie establishment and prevents a pending
start from restoring a cookie after deletion. End beacons can only terminate an
already acknowledged session and cannot create a new record. Browsers without
Web Locks, writable shared storage or secure UUID generation skip this optional
collection. The browser-owned deletion API remains available, although UBC and
the shared article no longer render a deletion button. Storage probes use unique,
immediately removed keys and are never sent or used as identifiers. Lock
acquisition and network requests each have eight-second bounds.

Thirteen client tests cover activity/idle/visibility gates, GPC/DNT, start
acknowledgement, heartbeat cadence, pause/resume/end sequencing, bounded retries,
late in-flight failure transitions, opt-out draining, unmount before dispatch,
cookie bootstrap/blocked cookies, shared-lock serialization, fresh cross-tab
opt-out and activity checks, unsupported collection, and lock timeouts:

```sh
node --test projects/campus-analytics/client.test.mjs
```

The client tests and TypeScript/ESLint checks do not establish production
deployment or physical-device behavior. Browser validation and deployment are
separate release steps.
