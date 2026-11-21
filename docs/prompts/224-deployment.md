# Prompt 224: Verified Ubuntu LTS migration and NGINX patch

- Date: 2026-11-20 (Vancouver; completion November 21 UTC)
- Scope: deployment
- Goal: Upgrade the existing server to supported Ubuntu LTS, patch NGINX and preserve websites with verified recovery.

## Original user request

> Go ahead and upgrade the server to a supported Ubuntu LTS and patch Nginx. Back everything up first, verify the backups, and make sure all my websites keep working.

The owner signed into the provider, approved up to US$5 in temporary resources
conditional on later removal, switched networks during backup transfer, deferred
the Next.js patch, and approved the production cutover at action time. After
successful recovery and service acceptance, the owner explicitly replied:

> Delete all temporary resources now

The supplied repository instructions required preservation of unrelated work,
private information, production rollback and recovery material; documented storage
audits; direct-main Git workflow; and separate implementation/journal commits.
The large instruction attachment and private environment details are summarized
here instead of copied. The preceding capability-only response made no changes.

## Scope

Supported OS rebuild on the original Droplet, patched distribution NGINX,
all-site inventory/backup/restoration, provider rehearsal/recovery verification,
fresh-data cutover, original access/IP/plan preservation, certificate and site
acceptance, and authorized cleanup. No application feature or dependency release,
new publisher authority, Ask activation, Django retirement, broad archive
retirement, branch, worktree or PR.

## Decisions

- Use Ubuntu 24.04 LTS and its security-backported NGINX package; inspect the
  package revision and running executable rather than upstream version alone.
- Rehearse on an isolated temporary server and verify recovery ISO access before
  rebuilding the original server with the tested image.
- Keep authenticated encrypted off-server backups, including a final frozen
  checkpoint actually restored before cutover and a new LTS recovery supplement.
- Preserve exact serving Node/Next build and complete immediate rollback.
- Defer Next.js 16.4.6 per the owner's explicit scope choice.
- Remove the temporary Droplet and both migration snapshots only after verified
  recovery/acceptance and explicit deletion confirmation; retain Mac recovery keys.

## Implementation

Production now runs Ubuntu 24.04.5 LTS, kernel 6.8.0-149 and Ubuntu NGINX
1.24.0-2ubuntu7.21. Existing sites, private stores, identities, ingress, original
SSH host keys, IPs and plan remain. Service-account remapping avoided LTS UID
collisions; a pinned Python 3.12 environment preserves Django behavior.
Original firewall and maintenance timers were restored after acceptance.
The full sanitized evidence is in the migration receipt; exact private commands,
logs, archive manifests, digests, recovery notes and screenshots stay outside Git.

## Engineering impact

The unsupported OS risk and reported NGINX CVEs are addressed by the supported
distribution. Runtime application behavior stays pinned. Recovery is evidenced
by actual restoration, not merely a successful archive command. Temporary
resource charges end with deletion; no recurring backup service was introduced.
The remaining moderate Next.js advisory is explicitly outstanding.

## Files changed

README technology status; architecture infrastructure status; CLI recovery/access
guidance; deployment status and security notes; operator-helper format guidance;
new sanitized migration acceptance receipt.

## Documentation updated

Active documentation now points to completed LTS acceptance instead of treating
October's cancelled migration and Ubuntu 22.10 exception as current. Historical
records remain historical. The new age backups are clearly distinguished from
the legacy CBC restoration helper.

## Git diff summary

Implementation: six files, 204 insertions and 40 deletions. Changes document
current operational state, evidence, recovery limitations and cleanup without
publishing private inventories or changing application source.

## Verification

- Actual Linux restore before disk rebuild; final file hashes, ownership, links,
  permissions and application SQLite integrity/foreign-key checks passed.
- Original cold PostgreSQL cluster restored privately and seven databases dumped;
  encrypted logical export authenticated and checked.
- 132 public cases across 15 configured hosts passed twice after reopening,
  including after cleanup. Existing legacy 410/502 behavior remains unchanged.
- 1,564 assets match; NGINX version footers explain normalized error-page changes.
- All six application/proxy services and monitoring healthy; seven certificate
  dry-run renewals/deploy hooks succeeded; original access and confinement pass.
- Immediate complete rollback started independently and six routes passed.
- Forced IPv6 acceptance is limited to the 102 cases on originally IPv6-capable
  hosts; original IPv4-only/no-AAAA hosts are not falsely counted as IPv6 passes.
- Local check and prebuild tests passed. Webpack compiled/prerendered but the
  existing Next security guard returned nonzero; no complete build pass claimed.
  Production audit: one moderate advisory, zero high/critical; patch deferred.
- Documentation whitespace, local links and private-information scans passed.

Production scratch cleanup measured 3,244,363,776 bytes of available-space gain,
plus a later 2,744,320-byte metadata cleanup; final available space was
6,938,390,528 bytes. Final Mac cleanup measured 1,372,004,352 bytes recovered,
from 44,018,110,464 to 45,390,114,816 bytes available. Earlier download-chunk
cleanup is recorded separately in the receipt. All accepted backups/keys,
serving runtime, complete immediate rollback, retained archives and private
data remain. No unresolved disposable cleanup candidates require an Issue;
protected retained material is outside retirement scope. Provider UI confirms
the rehearsal is gone and no migration snapshots remain.

## Repository state after implementation commit

Main was clean and synchronized before edits. Implementation commit succeeded
with a clean working tree, one commit ahead of origin/main. The journal and
redacted interaction log follow separately. No unrelated changes were included.

## Implementation commits

- `8409ddd53c4087d8e8732556adc657115f2d1422` — docs: record verified Ubuntu LTS and NGINX migration

## Archive commit

`docs: archive LTS migration approvals and completion`

## Lessons learned

Network capacity materially affected off-server backup throughput. Use verified
chunk resumption and remove duplicate transfer data only after integrity checks.
Large restore manifests need bounded-memory parsing on small servers. Distribution
package revisions, legacy network bindings and deliberate error baselines must
be evaluated explicitly. A verified configuration supplement is not a full disk
image, and point-in-time backup custody is not recurring backup coverage.

## Follow-up ideas

Apply the explicitly deferred Next.js security update with its own build and
release acceptance. Preserve the owner-held recovery set until any separately
approved retention change has replacement recovery evidence.
