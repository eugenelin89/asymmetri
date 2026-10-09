# INFRA-01 read-only acceptance helper

`http-baseline.py` uses Python 3's standard library and curl. It never configures
servers, follows redirects, disables TLS validation, sends credentials, writes
cookies, or retains response bodies. Run only against reviewed public read routes.
Keep manifests and results in a mode-0700 administrator directory outside Git;
they can disclose unrelated hostnames and internal operational details.

Example manifest (each URL once; no query strings, credentials or fragments):

```json
[
  {"url": "http://asymmetri.co/privacy", "compare_content": true},
  {"url": "https://asymmetri.co/privacy", "compare_content": true},
  {"url": "https://www.asymmetri.co/tutorial", "compare_content": true}
]
```

```sh
python3 ops/infra/http-baseline.py "$PRIVATE_MANIFEST" "$NEW_BASELINE"
python3 ops/infra/http-baseline.py "$PRIVATE_MANIFEST" "$NEW_CANDIDATE_RESULT" \
  --resolve "$VERIFIED_CANDIDATE_IP" --against "$NEW_BASELINE"
python3 -m unittest discover -s ops/infra -p 'test_*.py'
```

Variables above must be set to reviewed paths and a separately verified candidate
IP. Output is exclusively created with mode 0600, refusing an existing receipt.
Requests are sequential, bounded to 30 seconds and 16 MiB each. A curl/config/parser
failure produces a nonzero result. Default curl configuration and proxies are
ignored to preserve the intended destination. Hostname/SNI and CA validation stay
enabled under `--resolve`; use it for both IPv4 and IPv6 tests when applicable.

First capture records behavior, including 404/410/502: exit zero proves transport
success, **not healthy application acceptance**. Review/classify expected statuses
before treating it as a baseline. Comparison requires exactly the same URL set,
working transports, statuses, redirects/content types, canonical/meta-refresh
behavior and comparison policies. HTML comparison hashes visible text, links,
resource/metadata/form attributes and stable IDs; non-HTML compares bytes. Full body hashes are evidence even
when HTML builds add harmless serialization differences. Dynamic sites can opt out
of content comparison explicitly; they still need manual functional acceptance.

For fresh builds, generated script/chunk URLs can change. Preserve protected public
asset URLs and review the generated-asset delta against the pinned source/build;
do not hide a failure by automatically replacing baseline hashes. The helper does
not check browser interactions, database integrity, certificates' renewal ability,
source identity, firewall rules, authenticated journeys or service readiness.
Those remain separate requirements in [the migration runbook](../../docs/INFRA-01-UBUNTU-MIGRATION.md).
