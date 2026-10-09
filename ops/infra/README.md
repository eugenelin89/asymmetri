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
The [migration runbook](../../docs/INFRA-01-UBUNTU-MIGRATION.md) preserves those
historical acceptance checks. Migration is cancelled; the [closure decision](../../docs/INFRA-01-CANCELLATION.md)
owns current scope and readiness requirements for separately authorized future work.

## Private archive restoration

`restore_archive.py` restores a verified encrypted tar/gzip export into a **new**
private directory on a case-sensitive filesystem. It never contacts a network,
executes restored files, overwrites an existing destination or deletes anything.
Use a noexec/nosuid test volume and an independently trusted manifest/digest.

```sh
python3 ops/infra/restore_archive.py \
  --archive "$ARCHIVE" --sha256 "$TRUSTED_CIPHERTEXT_SHA256" \
  --manifest "$TRUSTED_MEMBER_MANIFEST" --key-file "$KEY_FILE" \
  --destination "$NEW_PRIVATE_DIRECTORY" --receipt "$NEW_PRIVATE_RECEIPT"
```

The manifest is a JSON array of `path`, `type` (`0` file, `1` hardlink, `2` symlink,
`5` directory), `size`, integer `mode`, numeric `uid`/`gid`, `link` and regular-file
`sha256` fields. Ciphertext is AES-256-CBC/PBKDF2-SHA256 with 600,000 iterations;
trusted SHA-256 verification precedes decryption because CBC is not authenticated.
Protect manifests and the key outside Git. Pass the key filename, never its contents.

The helper rejects absolute/traversing member paths, duplicate/unsupported objects,
symlink parents, missing or conflicting hardlink anchors, unexpected members and
content/metadata differences. It verifies the gzip trailer, full membership,
content hashes, link values/inodes and non-symlink modes. Linux numeric ownership
requires root and explicit `--preserve-owner`; test this only in an authorized
isolated environment. Symlink modes are not applied or claimed as verified.

Archived absolute symlinks and special mode bits fail unless individually reviewed
and explicitly allowed (`--allow-absolute-symlink` exact target,
`--allow-special-modes` on nosuid storage). ACL/xattr metadata causes failure by
default; `--metadata-audit-only` records its presence without applying it. A separate
capable restorer is needed when such metadata matters. No ACL/xattrs were present
in the retained archive tested for INFRA-01.

Failures can leave a partial private directory. Preserve its receipt/error and
clean up only that task-owned destination after inspection; never retry over it.
This file-level check does not prove application startup, service isolation,
permissions under a different OS, or whole-server recovery. The production tar
exports are distinct from the raw SQLite export; use SQLite integrity/canonical
checks for that file. See [retirement recovery](../../docs/INFRA-01-DJANGO-RETIREMENT.md).

Run `python3 -m unittest discover -s ops/infra -p 'test_*.py'`. Case-sensitive positive
extraction tests skip on a case-insensitive volume; the inverse rejection test skips
on a case-sensitive volume. Test both environments and report skips honestly.
