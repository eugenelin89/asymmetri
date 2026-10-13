# INV-03 — Strict ingress acceptance and activation boundaries

The installed nginx 1.22.0 HTTP proxy parses and reconstructs requests before Node
receives them. In particular, `proxy_set_header Connection close` hides the original
duplicate fields. The rejected HTTP profile also normalizes HTTP/1.0 to accepted
HTTP/1.1 and allows a keep-alive pipeline sentinel to mutate durable state. All three
negative regressions remain recorded as failures. Header forwarding directives cannot
reconstruct lost input. The installed stock modules provide no demonstrated pre-normalization HTTP
rule adequate for the full threat model. The October 13 shared-apex design below
adds a bounded raw TLS bridge because the separate-SNI proof cannot route website
and API paths on the same fixed authority.

## Tested loopback design

The isolated Linux acceptance process uses the installed stream, ssl and ssl_preread
modules and OpenSSL. An outer loopback TCP listener routes TLS by SNI. Receiver SNI
reaches a separate stream TLS terminator which forwards decrypted HTTP bytes unchanged
to the loopback receiver; other SNI reaches an isolated ordinary HTTPS fixture server.
The test CA/certificate are disposable, verified by clients, and never installed in
production. No listener binds an external address or production 443.

The receiver permits one strict HTTP/1.1 request per connection. A socket admission
fence rejects already-parsed second requests; `Connection: close` alone is insufficient.
Expect/upgrade/CONNECT/parser-error handlers close without routing. Duplicate headers,
framing conflicts, forwarded authority, encoded paths and signed components remain
preserved by the stream transport, then subject to Node strict parsing and canonical
Ed25519 signature verification. Node trims outer header whitespace; this is not a
claim of byte-for-byte header comparison.

The expanded actual-host suite tests valid uploads/events/receipts, duplicate Connection/
Host/protected headers, conflicting Content-Length and Transfer-Encoding, differently cased duplicates,
spoofed Forwarded/X-Forwarded fields, path/percent/authority changes, chunking, incomplete/
oversized bodies, replay/expiry/revocation, forged signatures and keep-alive pipelines
with a distinct authenticated sentinel. Durable table snapshots prove the second request
made no hidden mutation. TLS 1.2/1.3 are explicitly verified. Mixed h2/http1 ALPN chooses
http/1.1; h2-only is rejected rather than translated; no ALPN still requires HTTP/1.1.
Wrong hostname/untrusted certificate/plaintext TLS input fail. Fragmented input is covered.

This accepts the isolated TLS transport. It does not approve a public shared 443 rollout
or measure sustained TLS-handshake capacity. [Validation](INV-03-VALIDATION.md) contains
actual counts, failed profiles and the direct-loopback capacity envelope.

## Shared 443 production integration — authorized, verification outstanding

The owner authorized deployment and all necessary work on October 13. This is not
a renewed permission gate. The current host has multiple IPv4/IPv6 HTTPS virtual
hosts and Certbot-managed certificates. A stream listener cannot coexist with
those HTTP listeners on 443. Production integration must:

1. Select an approved receiver DNS authority and certificate. Keep the signed authority
   equal to the public receiver authority all the way to Node; never synthesize a
   different Host from an untrusted forwarding header. The website read helper supports
   `ASYMMETRI_INVESTMENT_READ_AUTHORITY=asymmetri.co` for its strictly loopback
   origin. It uses native Node HTTP because tested Node fetch discarded Host
   overrides. The configured value is server-owned; user/forwarded headers are
   never authority inputs. Enable it only with matching receiver configuration.
2. Move every existing IPv4/IPv6 HTTP TLS listener to a protected internal socket/port
   and put an SNI dispatcher on the original 443 addresses. Preserve the ordinary default
   and unknown-SNI behavior; no HTTP path routing is possible in encrypted passthrough.
3. Preserve ordinary-site client IP using a reviewed PROXY-protocol path with matching
   trusted Nginx listeners. The earlier separate-SNI fixture lost client IP;
   the shared-apex fixture below verifies it for both website paths and other SNI. Node's strict receiver must not receive
   an unexpected PROXY preamble. Do not accept client-supplied forwarding claims.
4. Provide the Node TLS bridge's real certificate and key through root-owned
   configuration, TLS 1.2/1.3 and HTTP1.1 ALPN. Do not introduce an HTTP2 downgrade layer.
5. Exercise Certbot HTTP01/webroot and existing nginx-plugin behavior, renewal/deploy
   hooks, stream certificate reload and ordinary-site certificates using staged issuance
   where appropriate. Existing HTTP port 80 challenge handling must keep working.
6. Run syntax checks and all 15-host/protected-route tests before/after an owner-approved
   graceful Nginx reload. Keep complete original listener configurations and a tested
   immediate config rollback. Add connection/handshake budgets and real ingress capacity
   measurements before exposing the constrained 1 GB host.

No DNS, firewall, port 443, certificates, renewal settings or production Nginx files were
changed here. Public `/api/experiments/v1` remains absent. Unsupported Ubuntu 22.10 remains
an accepted owner exception, not a claim of vendor security support. Decision 030 defers
OS migration to a separate project; Decision 029 and all publication/launch gates remain.


## October 13 shared-apex source

`receiver/src/tls-ingress.ts` consumes a bounded, validated PROXY-v1 preamble from
an outer loopback Nginx stream dispatcher, then terminates TLS for `asymmetri.co`.
It uses Node's documented `TLSSocket` over a generic `Duplex`; no undocumented
socket internals or HTTP reconstruction are involved. The installed Nginx stream
module lacks optional `stream_realip`: an earlier isolated prototype using
`set_real_ip_from` in stream failed syntax validation. No production module or
package was changed. Nginx's HTTP real-IP module is available for ordinary sites.

After TLS, `receiver/src/ingress.ts` inspects only the first request line. Exact
`/api/experiments/v1` and `/api/ask/v1` prefixes reach their separate loopback
receivers with the original HTTP bytes, without a PROXY preamble. Unknown `/api/`
paths fail. All other targets reach the ordinary Nginx plaintext listener with the
validated PROXY preamble. Each connection has one chosen upstream, no retry and
backpressure in both directions. Receivers retain strict authority/signature and
one-request fencing. There is no interpretation or rewriting of signed headers.

The ordinary listener must enforce the expected Host, deny normalized `/api/`
paths, allow one request per connection, and overwrite forwarding metadata. Set
Host and X-Forwarded-Host from validated `$host`, X-Real-IP/X-Forwarded-For from
trusted PROXY-derived `$remote_addr`, X-Forwarded-Proto to `https` and
X-Forwarded-Port to `443`; clear Forwarded. `$scheme` is `http` on this internal
plaintext hop and must not be forwarded as the public scheme. Existing Next.js
can preserve a supplied forwarded host, so leaving client values intact is unsafe.
Other SNI remains on ordinary Nginx HTTPS with matching trusted PROXY listeners.

Both listeners bind `127.0.0.1`. Limits: 256 connections, at most 32 pending TLS
handshakes with five-second deadlines, aggregate handshake bucket of 64 with
32/second refill, at most 32 API connections, 4 KiB first request line, two-second
upstream connect, 15-second idle, and 30-second API/60-second website duration.
The handshake budget stores only counters/time, no client identifiers. The outer
proxy needs its own connection/preread/time limits. These bounds do not guarantee
availability under a sustained hostile load or constitute full production capacity.

`receiver/ingress-tls.config.example.json` defaults both flags false. Build the
receiver, prepare a root-owned private config/certificate copy, and explicitly run:

```sh
ASYMMETRI_INGRESS_CONFIG=/etc/asymmetri-ingress/config.json \
node receiver/dist/src/ingress-tls-cli.js
```

The CLI starts routing before TLS and shuts both down on TERM/INT. HUP loads a new
certificate context only after parsing, matching SAN hostname, current validity
and key compatibility checks succeed. Failure retains the working context. The
renewal hook must stage a matching pair atomically and verify the new certificate
externally; merely signaling HUP is not a renewal receipt. No service unit or
renewal hook is installed by this source command.

## Acceptance scope

The dedicated TLS test covers fragmented PROXY input, duplicate-header byte
preservation, h1/mixed/no ALPN, h2 rejection, wrong SNI, invalid and valid-but-wrong-
host certificate reload rejection, different valid same-host rotation, aggregate
handshake exhaustion and recovery. Raw router tests cover routing and rejection.
The actual Linux shared profile adds both signed APIs, Secure/HttpOnly/SameSite
browser cookies, ordinary website backend metadata, forged forwarding headers,
normalized-path denial, website-first pipeline sentinels and preserved other-SNI
client IP. It creates only disposable synthetic keys, databases and certificates.

Run from the built receiver on Linux, as a non-root identity:

```sh
INFRA02_NGINX_MODE=shared node --test deploy/nginx-acceptance.test.mjs
# Optional bounded 60-second, 480-request TLS workload:
INFRA02_NGINX_MODE=shared INFRA02_INGRESS_LOAD=1 \
node --test deploy/nginx-acceptance.test.mjs
```

The workload reports latency, Node CPU and peak Node RSS for the combined isolated
TLS/router/receiver/HTTP fixture. It excludes production Next.js and full archive
writes; the earlier archive-capacity evidence remains separately scoped. Production
443 routing, all-vhost read-back, actual renewal behavior, operational rollback,
private Ask installation and genuine HQ execution remain separate evidence.

Primary API references: [Node TLS](https://nodejs.org/docs/latest-v22.x/api/tls.html),
[Nginx stream PROXY transport](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html#proxy_protocol),
and [optional stream real-IP module](https://nginx.org/en/docs/stream/ngx_stream_realip_module.html).

On October 13, actual Ubuntu 22.10 / Node 22.23.1 passed 68/68 shared-ingress
checks including the optional 480-request workload: 59.99 seconds, eight concurrent
requests per round, p50 76 ms, p95 118 ms, maximum 160 ms, combined fixture Node
peak RSS 111,677,440 bytes and CPU 5,416 ms. Local Node 24.10.0 and actual Linux Node 22.23.1 each passed 230/230
receiver tests. Six website helper tests and both Next/Sites production builds
passed; root/receiver production audits reported zero vulnerabilities. The isolated process/certificates
were removed by test cleanup; production service/listener state was unchanged.


## Shared-host rehearsal and service packaging

At 2026-10-13 16:48:26 UTC, a disposable root-owned Nginx instance completed
64 checks in each of baseline, shared routing and rollback phases. It used only
high loopback ports, the installed virtual-host definitions and protected temporary
certificate copies. All 15 host baselines, separate IPv4/IPv6 name/default
selection, default/unknown-SNI certificates, 28 Asymmetri route checks, HTTP
redirects, tutorial canonical and 54 tutorial hash links matched across phases.
The existing draft 502 and relay 410 responses remained unchanged. Both graceful
HTTP-to-stream and stream-to-HTTP listener transitions passed. Temporary TLS key
copies were deleted and the disposable processes stopped. A first rehearsal
syntax check found a relative `proxy_params` include; staging resolved it against
the existing Nginx directory before the successful run. Production was untouched.

`receiver/deploy/asymmetri-ingress.service.example` defines a dedicated loopback-
only, confined TLS/router identity with a read-only release, 192 MiB memory ceiling,
32 MiB swap ceiling and 50% CPU quota. Its optional boot enablement is necessary
only when it becomes the active apex entrypoint. Keep ordinary Nginx independent:
a failed apex worker must not make all unrelated sites depend on its startup.

`receiver/deploy/renew-ingress-certificate.py` is the root-only Certbot deploy hook
for exactly `/etc/letsencrypt/live/asymmetri.co`. It validates the SAN, validity,
matching key and TLS context; creates root-owned/group-readable versioned copies;
fsyncs files/directories; atomically updates `tls/current`; signals the service;
and verifies the live loopback certificate fingerprint using normal CA/hostname
validation. Failed replacement restores the previous symlink and context. Exact
0750 directories and 0640 PEM modes are enforced even under a restrictive caller
umask. No private key bytes enter source, output or the website runtime.

The example TLS configuration now reads `tls/current/fullchain.pem` and
`tls/current/privkey.pem`. Initial operator setup uses `--initialize` before first
service startup; it refuses an existing managed certificate. `--check` validates
without changing it. Normal renewal requires an active service. Install the hook
as a root-owned executable and invoke it from a root-owned Certbot deploy wrapper;
other certificate lineages are ignored. Certbot's installed `--run-deploy-hooks`
help confirms a successful dry run invokes hooks with the active certificate,
not the disposable staging certificate. Actual dry-run/installed-service receipts
remain required before public activation.
