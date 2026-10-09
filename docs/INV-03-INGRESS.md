# INV-03 — Strict ingress acceptance and activation boundaries

The installed nginx 1.22.0 HTTP proxy parses and reconstructs requests before Node
receives them. In particular, `proxy_set_header Connection close` hides the original
duplicate fields. The rejected HTTP profile also normalizes HTTP/1.0 to accepted
HTTP/1.1 and allows a keep-alive pipeline sentinel to mutate durable state. All three
negative regressions remain recorded as failures. Header forwarding directives cannot
reconstruct lost input. The installed stock modules provide no demonstrated pre-normalization HTTP
rule adequate for the full threat model; an additional bespoke proxy is unnecessary.

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

## Future shared 443 integration — explicit separate approval required

The current host has multiple IPv4/IPv6 HTTPS virtual hosts and Certbot-managed
certificates. A stream listener cannot simply coexist with those HTTP listeners on
443. A future plan must:

1. Select an approved receiver DNS authority and certificate. Keep the signed authority
   equal to the public receiver authority all the way to Node; never synthesize a
   different Host from an untrusted forwarding header. The current website read helper
   sends a loopback Host and therefore cannot share the future public-authority receiver
   configuration unchanged. Before combined activation, implement and test an explicit
   trusted server-only authority mapping on loopback reads, preserving strict Host
   equality and preventing user-controlled authority injection.
2. Move every existing IPv4/IPv6 HTTP TLS listener to a protected internal socket/port
   and put an SNI dispatcher on the original 443 addresses. Preserve the ordinary default
   and unknown-SNI behavior; no HTTP path routing is possible in encrypted passthrough.
3. Preserve ordinary-site client IP using a reviewed PROXY-protocol path with matching
   trusted Nginx listeners. The current isolated fixture loses original client IP and
   is not a drop-in production configuration. Node's strict receiver must not receive
   an unexpected PROXY preamble. Do not accept client-supplied forwarding claims.
4. Provide the receiver stream terminator's real certificate and key through root-owned
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
