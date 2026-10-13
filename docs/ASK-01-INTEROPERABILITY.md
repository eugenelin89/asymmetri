# ASK-01 synthetic HTTPS interoperability

This explicit local launcher lets BotSquad's typed HTTPS client exercise the
committed receiver without a genuine employee, model call, operational key or
public visitor. It never reads an operational configuration or public archive.
Pin the complete website commit in the interoperability receipt, together with
the producer commit and unchanged canonical manifest digest.

## Start and stop

Use `.nvmrc`, the existing receiver lockfile and local loopback permission. No
Next.js build or development server is needed. OpenSSL must support `req -addext`.

```sh
npm run receiver:build
node receiver/dist/test/ask-interop-fixture.js --start-synthetic-interop
```

The launcher prints only a private temporary manifest path and expiry. The 0600
manifest contains the loopback TLS port, certificate/private signing-key paths,
scope, limits, synthetic roster and privacy-notice version. Do not print or copy
key material into chat, logs, repository files or receipts. The enclosing tree is
0700. Its dedicated Ed25519 scope and process expire after one hour. TERM/INT
closes sockets/databases and removes the entire tree; verify removal after use.
An ungraceful kill or host failure can leave a private tree needing explicit cleanup.

The certificate names `asymmetri.co`. The receiver expects that exact Host and
`https://asymmetri.co` Origin. A test-only HTTPS wire injection may dial
`127.0.0.1:manifest.tlsPort` and trust `manifest.certificatePath`, while retaining
fixed Host/SNI `asymmetri.co` and `rejectUnauthorized:true`. Do not alter the
production transport's fixed authority or disable certificate verification.
The TLS bridge forwards raw HTTP to the receiver without normalization.

The synthetic scope is `fixture-ask` / `fixture-ask-key`, consumer generation `1`,
with claim/control-sync/status/answer/receipt permissions. The roster has
`fixture-author`; all records and limitations must remain labelled synthetic.
Question context is `null`; answer evidence and public sources are empty.
No public evidence is available in this fixture. The service starts with no
privacy freshness barrier, so availability is paused until HQ synchronizes.

## Minimum sequence

1. Use the real typed producer client to sign `POST /api/ask/v1/hq/control-sync`.
   Include schemaVersion `1.0`, serviceId `fixture-ask`, consumerGeneration `1`,
   a new syncId, acknowledgedControlIds `[]` and after `null`. **Idempotency-Key
   must equal syncId.** Require controls `[]` and nextCursor `null`; only this
   fully acknowledged empty page establishes a current barrier.
2. Create a browser session at `POST /api/ask/v1/sessions`, with exact Origin,
   JSON schemaVersion `1.0`, privacyNoticeVersion from the manifest and a new
   Idempotency-Key. Retain the returned Secure/HttpOnly/SameSite=Strict cookie and
   csrfToken privately. All subsequent browser mutations include that cookie,
   Origin, X-CSRF-Token and a new idempotency key.
3. Create a conversation with `{ "schemaVersion": "1.0" }`, then one question
   with schemaVersion `1.0`, explicitly synthetic text, context `null`,
   priorQuestionId `null` and language `en`. Retain the admitted immutable hash.
4. Sign `POST /api/ask/v1/hq/claims` with service/generation, capacity `1` and a
   new claimRequestId. **Idempotency-Key must equal claimRequestId.** Verify the
   returned question/hash and lease. Renew at `/hq/claims/{claimId}/renew` with
   service/generation/questionId/questionHash. Leases last at most 90 seconds.
5. Refresh privacy synchronization before status/delivery. A fresh empty final
   page gives lastControlSyncId; barriers last at most 60 seconds and new controls
   invalidate them. Post canonical `answering` status at
   `/hq/questions/{questionId}/status`, wrapped with claimId, consumerGeneration
   and lastControlSyncId. Use the synthetic roster/routing identities.
6. Post an explicitly authored synthetic answer at
   `/hq/questions/{questionId}/answer`, in the same wrapper shape. Preserve exact
   question/hash/conversation identities, actual UTC generatedAt, null
   knowledgeAsOf and empty evidence/publicSources. Do not claim a model ran.
   Check accepted disposition; retry the same immutable answer with a fresh signed
   wrapper/idempotency key and verify the same receipt. Reconcile through signed
   `GET /hq/answers/{answerId}/receipt` and the owned browser conversation read.
7. Delete the conversation using the owned cookie/CSRF. Drain HQ control pages,
   persist the producer's suppression record, acknowledge only delivered control
   IDs and follow nextCursor until a fully acknowledged empty final page.
   Verify the deleted browser read returns 404. Report suppression separately from
   physical purge/restore proof; HQ's current journal does not establish those.
8. Stop the launcher and verify that its temporary tree, keys and listeners are
   gone. Record only safe source identities, counts and result codes.

All HQ requests use fresh signature nonces and actual integer-second signature
epochs; semantic timestamps retain millisecond precision. Stable answer identity
is separate from transport/wrapper identity. Use the vendored schema examples for
complete DTO shapes, never an invented extension. No fixture record goes to the
operational receiver or public website.

## Website-side smoke receipt

On October 13, the launcher passed a 17-request verified-TLS sequence covering the
steps above, including renewal, fresh-wrapper retry, signed receipt, owned read,
deletion, acknowledged control and final empty barrier. TERM/INT cleanup removed
the private tree, including separately tested cancellation during startup after
private-key creation. Review prompted early signal registration and cleanup on
setup cancellation; failure output does not claim cleanup succeeded. The initial smoke harness incorrectly used a different sync
idempotency key and received the expected 409; correcting the harness produced
the passing sequence. This is receiver/fixture acceptance, not yet a producer
typed-client result, real execution or operational activation.
