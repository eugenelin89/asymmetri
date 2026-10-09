#!/usr/bin/env python3
"""Verify and restore an operator-approved archive into a NEW private directory.

No network access, implicit overwrite, execution of restored files or cleanup.
The caller must protect the manifest/digest independently and use a noexec/nosuid
test filesystem. This file verifier does not establish application recovery.
"""
import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import posixpath
import stat
import subprocess
import tarfile


class RestoreError(ValueError):
    """An archive or destination failed a recovery invariant."""


def require(condition, message):
    if not condition:
        raise RestoreError(message)


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(block)
    return value.hexdigest()


def relative_name(raw):
    require(isinstance(raw, str) and raw and '\x00' not in raw, 'invalid member name')
    name = raw.rstrip('/')
    require(name and not name.startswith('/') and '\\' not in name, 'absolute/ambiguous member name')
    require(all(p not in ('', '.', '..') for p in name.split('/')), 'noncanonical/traversing member name')
    return name


def preflight(rows, allowed_absolute_links=(), allow_special_modes=False):
    entries = {}
    for row in rows:
        name = relative_name(row['path'])
        require(name not in entries, 'duplicate manifest member')
        require(row['type'] in ('0', '1', '2', '5'), 'unsupported member type')
        require(isinstance(row['mode'], int) and 0 <= row['mode'] <= 0o7777, 'invalid mode')
        require(allow_special_modes or not row['mode'] & 0o7000, 'special mode requires explicit approval')
        require(all(isinstance(row[k], int) and row[k] >= 0 for k in ('size', 'uid', 'gid')), 'invalid numeric metadata')
        if row['type'] == '0':
            require(len(row.get('sha256', '')) == 64, 'missing regular-file digest')
        entries[name] = row
    for name, row in entries.items():
        for parent in PurePosixPath(name).parents:
            if str(parent) != '.' and str(parent) in entries:
                require(entries[str(parent)]['type'] == '5', 'non-directory archive ancestor')
        if row['type'] == '1':
            link = relative_name(row['link'])
            require(link in entries and entries[link]['type'] == '0', 'hardlink target is not an archived regular file')
            anchor = entries[link]
            require(all(row[k] == anchor[k] for k in ('mode', 'uid', 'gid')), 'hardlink metadata conflicts')
        elif row['type'] == '2':
            link = row['link']
            require(isinstance(link, str) and link and '\x00' not in link, 'invalid symlink')
            if link.startswith('/'):
                require(link in allowed_absolute_links, 'unapproved absolute symlink')
            else:
                resolved = posixpath.normpath(posixpath.join(posixpath.dirname(name), link))
                require(resolved != '..' and not resolved.startswith('../'), 'symlink escapes archive root')
    return entries


def safe_parent(root, name):
    current = root
    for component in PurePosixPath(name).parts[:-1]:
        current = current / component
        if not current.exists() and not current.is_symlink():
            current.mkdir(mode=0o700)
        require(stat.S_ISDIR(current.lstat().st_mode), 'destination ancestor is not a real directory')
    return root / name


def restore(stream, rows, destination, *, allowed_absolute_links=(),
            allow_special_modes=False, preserve_owner=False, metadata_audit_only=False):
    entries = preflight(rows, allowed_absolute_links, allow_special_modes)
    require(not preserve_owner or os.geteuid() == 0, 'numeric ownership requires root')
    destination = Path(destination)
    require(destination.name not in ('', '.', '..'), 'invalid destination')
    root = destination.parent.resolve(strict=True) / destination.name
    require(not root.exists() and not root.is_symlink(), 'destination must not exist')
    root.mkdir(mode=0o700)
    # Refuse case-folding filesystems before copying any archive contents.
    probe = root / '.infra-case-probe'
    probe.write_bytes(b'case-sensitive')
    try:
        require(not (root / '.INFRA-CASE-PROBE').exists(), 'case-insensitive destination')
    finally:
        probe.unlink()
    seen = set()
    extended = []
    hardlinks = []
    with tarfile.open(fileobj=stream, mode='r|') as archive:
        for member in archive:
            name = relative_name(member.name)
            require(name in entries and name not in seen, 'unexpected or duplicate archive member')
            row = entries[name]
            kind = member.type.decode('ascii')
            require((member.size, member.mode, member.uid, member.gid, kind, member.linkname) ==
                    (row['size'], row['mode'], row['uid'], row['gid'], row['type'], row['link']),
                    'archive differs from trusted manifest')
            extra = {k: v for k, v in member.pax_headers.items()
                     if k.startswith(('SCHILY.', 'LIBARCHIVE.'))}
            if extra:
                require(metadata_audit_only, 'ACL/xattr metadata needs a separately capable restorer')
                extended.append({'path': name, 'keys': sorted(extra),
                                 'sha256': hashlib.sha256(json.dumps(extra, sort_keys=True).encode()).hexdigest()})
            target = safe_parent(root, name)
            if member.isdir():
                if target.exists():
                    require(stat.S_ISDIR(target.lstat().st_mode), 'directory conflict')
                else:
                    target.mkdir(mode=0o700)
            elif member.isfile():
                flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW
                with os.fdopen(os.open(target, flags, 0o600), 'wb') as out:
                    source = archive.extractfile(member)
                    require(source is not None, 'regular member unreadable')
                    with source:
                        for block in iter(lambda: source.read(1024 * 1024), b''):
                            out.write(block)
                require(target.stat().st_size == row['size'] and digest(target) == row['sha256'], 'file content mismatch')
            elif member.issym():
                os.symlink(row['link'], target)
            elif member.islnk():
                hardlinks.append((name, row['link']))
            else:
                raise RestoreError('unsupported archive object')
            seen.add(name)
    # Caller provides a gzip stream: consume trailer and detect truncation/CRC errors.
    for _ in iter(lambda: stream.read(1024 * 1024), b''):
        pass
    require(seen == set(entries), 'missing archive members')
    for name, link in hardlinks:
        anchor = safe_parent(root, relative_name(link))
        require(stat.S_ISREG(anchor.lstat().st_mode), 'hardlink anchor is not regular')
        os.link(anchor, safe_parent(root, name), follow_symlinks=False)
    # Ownership first because chown can clear setuid/setgid; directories last.
    for name in sorted(entries, key=lambda n: n.count('/'), reverse=True):
        row = entries[name]
        path = root / name
        if preserve_owner:
            os.chown(path, row['uid'], row['gid'], follow_symlinks=False)
        if row['type'] != '2':
            os.chmod(path, row['mode'], follow_symlinks=False)
    actual = set()
    for parent, dirs, files in os.walk(root, followlinks=False):
        for leaf in dirs + files:
            actual.add(str((Path(parent) / leaf).relative_to(root)))
    # Tar may omit leading directories. Only these implicit ancestors may be extra.
    implicit = {str(p) for n in entries for p in PurePosixPath(n).parents if str(p) != '.'}
    require(set(entries) <= actual and actual <= set(entries) | implicit, 'destination membership differs')
    counts = {k: 0 for k in ('0', '1', '2', '5')}
    for name, row in entries.items():
        path = root / name
        st = path.lstat()
        kind = row['type']
        counts[kind] += 1
        if preserve_owner:
            require((st.st_uid, st.st_gid) == (row['uid'], row['gid']), 'owner mismatch')
        if kind == '2':
            require(stat.S_ISLNK(st.st_mode) and os.readlink(path) == row['link'], 'symlink mismatch')
        else:
            require(stat.S_IMODE(st.st_mode) == row['mode'], 'mode mismatch')
            if kind == '5':
                require(stat.S_ISDIR(st.st_mode), 'directory type mismatch')
            else:
                require(stat.S_ISREG(st.st_mode), 'file type mismatch')
                source = entries[relative_name(row['link'])] if kind == '1' else row
                require(st.st_size == source['size'] and digest(path) == source['sha256'], 'final content mismatch')
                if kind == '1':
                    other = (root / row['link']).lstat()
                    require((st.st_dev, st.st_ino) == (other.st_dev, other.st_ino), 'hardlink inode mismatch')
    return {'members': len(entries), 'types': counts, 'content_links_verified': True,
            'non_symlink_modes_verified': True, 'symlink_modes_verified': False,
            'numeric_ownership_applied': preserve_owner, 'acl_xattrs_applied': False,
            'extended_metadata': extended, 'application_runtime_tested': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('archive', 'sha256', 'manifest', 'key-file', 'destination', 'receipt'):
        parser.add_argument('--' + name, required=True)
    parser.add_argument('--allow-absolute-symlink', action='append', default=[])
    parser.add_argument('--allow-special-modes', action='store_true')
    parser.add_argument('--preserve-owner', action='store_true')
    parser.add_argument('--metadata-audit-only', action='store_true')
    args = parser.parse_args()
    os.umask(0o077)
    require(digest(Path(args.archive)) == args.sha256, 'ciphertext hash mismatch')
    rows = json.loads(Path(args.manifest).read_text())
    command = ['openssl', 'enc', '-d', '-aes-256-cbc', '-pbkdf2', '-iter', '600000',
               '-md', 'sha256', '-pass', 'file:' + args.key_file, '-in', args.archive]
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        with gzip.GzipFile(fileobj=process.stdout) as stream:
            report = restore(stream, rows, args.destination,
                             allowed_absolute_links=args.allow_absolute_symlink,
                             allow_special_modes=args.allow_special_modes,
                             preserve_owner=args.preserve_owner,
                             metadata_audit_only=args.metadata_audit_only)
        process.stdout.close()
        require(process.wait() == 0, 'decryption failed')
        report['ciphertext_sha256'] = args.sha256
        with open(args.receipt, 'x') as out:
            json.dump(report, out, indent=2)
            out.write('\n')
        print(json.dumps({k: v for k, v in report.items() if k != 'extended_metadata'}))
    finally:
        if process.poll() is None:
            process.kill()
        process.wait()
        process.stderr.close()


if __name__ == '__main__':
    main()
