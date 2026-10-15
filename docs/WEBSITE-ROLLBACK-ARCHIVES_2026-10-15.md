# Retained older website runtime — October 15, 2026

The HQ guide release found 6,478,254,080 bytes free on the production host, only
about 34 MiB above the 6 GiB floor. One older inactive website rollback was
preserved as a complete compressed archive in durable owner storage outside Git.
This recovered 1,071,448,064 bytes; free space afterward was 7,546,949,632 bytes.
The serving f9aee2d release, immediate e13a4ff rollback, private databases,
configuration and unrelated websites were preserved.

| Item | Verified value |
| --- | --- |
| Original directory | `/var/www/asymmetri-rollback-20261013-8e67412` |
| Source | `8e67412542391d9fa5a820ef65f593f4b8653c9f` |
| Build | `JfXhLeJ9il1oKr7D-w7ar` |
| Archive | `asymmetri-rollback-20261013-8e67412.tar.gz` |
| Bytes | 341985280 |
| SHA-256 | `acd70eca8828b43c38db9dba072e799019c3b2be28b6a38fc7c290191677f8fb` |

The archive resides in `../deployment-retention/2026-10-15/` relative to the
owner's website checkout, outside all Git repositories, with directory mode 0700
and archive mode 0600. The server receipt remains under
`/var/lib/asymmetri-hq-guide-retention-20261015/` (0700). Its exact owner-storage
path is recorded privately there and in the adjacent local receipt.

The application owner streamed the complete directory with Git, dependencies,
public assets and `.next`, retaining modes, ownership, links, timestamps, ACLs and
extended attributes. Its clean source/build and inactive status were verified.
The archive was synced locally; its size and SHA matched the server's streaming
receipt, gzip integrity passed, and GNU tar comparison against the still-present
original passed. Only that verified redundant directory was then removed. The
current website, Ask, ingress, Nginx and inactive gunicorn identities stayed
unchanged; the independent receiver identity was checked before comparison and
retirement and remained unchanged. Export minimum available RAM was 325484 KiB
and free disk 6478196736 bytes, above the 192 MiB / 6 GiB production floors.

For restoration, transfer this exact archive over the existing SSH route to an
empty staging location with sufficient capacity, verify the recorded SHA, and
extract with ownership/ACL/xattr preservation. Verify source, build, application
ownership and runtime contents before following the normal rollback activation
procedure. Extraction alone does not activate the old release. Never overwrite a
later serving directory or roll private data/configuration back using this code
archive. This is older code/runtime retention, not a private-data backup.
