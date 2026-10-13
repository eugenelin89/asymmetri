# Retained older website runtimes — October 13, 2026

Preparing the isolated Ask configuration test found 7.5 GiB free disk, below the
existing 8 GiB test floor. Two inactive older Asymmetri website rollback trees were
preserved as complete compressed archives to recover space. The live website and
its latest rollback trees, every receiver, private database, configuration and
unrelated site were untouched. No source or dependency was removed from the
retained archives.

Before conversion, each tree was an ordinary directory with a clean Git checkout
at the expected source; no process cwd/executable used it. Root created a gzip
archive with ownership, modes, links, timestamps, ACLs and extended attributes,
then GNU tar comparison against the still-present original passed. The archive
was synced and its receipt recorded before replacing that original tree with the
archive. Both archives and receipts are root-only (0600 inside 0700 directory).

Location: `/var/lib/asymmetri-retained-runtime-20261013`.

| Original tree under `/var/www/` | Source | Archive | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `asymmetri-rollback-20261009-fd65c46` | `fd65c46c16588903bb74198f1988cafff8d8b20c` | `asymmetri-rollback-20261009-fd65c46.tar.gz` | 340838479 | `6aa8ff91e681fbbbe03f583013a9044b203b918334137893be2f36052df55279` |
| `asymmetri-rollback-20261013-745a92c` | `745a92c676bcbe85c3aa675a1099d26321f1c1e2` | `asymmetri-rollback-20261013-745a92c.tar.gz` | 342151629 | `dc0da248e67b4367fd38506cb07e672fbbab94128c01ac2ce84336af89bd8416` |

Free disk increased from 7,959,379,968 to 9,309,261,824 bytes before the new candidate
and isolated fixture. Their separate runtime limits still require at least 8 GiB
free. This is local code/runtime retention, not off-host private-data backup.

To inspect or restore an older runtime, verify the listed digest and the adjacent
JSON receipt, ensure the original target path does not exist, then extract as root
with `tar --acls --xattrs -xzpf ARCHIVE -C /var/www`. Confirm its source, build and
ownership before using the relevant dated release's rollback procedure. Extraction
alone does not activate it. Never replace a later running release or roll private
data/configuration backward using these historical code archives.
