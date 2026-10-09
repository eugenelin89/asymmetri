"""Adversarial file-restoration tests; synthetic data only."""
import gzip
import hashlib
import io
import json
from pathlib import Path
import tempfile
import tarfile
import unittest

from restore_archive import RestoreError, preflight, restore


def row(name, kind='0', content=b'fixture', link='', mode=0o640):
    return {'path': name, 'type': kind, 'size': len(content) if kind == '0' else 0,
            'mode': mode, 'uid': 1234, 'gid': 2345, 'link': link,
            'sha256': hashlib.sha256(content).hexdigest() if kind == '0' else None}


def archive(rows, content=b'fixture'):
    out = io.BytesIO()
    with tarfile.open(fileobj=out, mode='w:gz') as tar:
        for r in rows:
            m = tarfile.TarInfo(r['path'])
            m.type = r['type'].encode()
            m.size, m.mode, m.uid, m.gid, m.linkname = r['size'], r['mode'], r['uid'], r['gid'], r['link']
            tar.addfile(m, io.BytesIO(content) if m.isfile() else None)
    return gzip.GzipFile(fileobj=io.BytesIO(out.getvalue()))


class PreflightTests(unittest.TestCase):
    def test_traversal_and_absolute_paths(self):
        for name in ('../escape', '/absolute', 'a/../../b', 'a//b', './a'):
            with self.subTest(name=name), self.assertRaises(RestoreError):
                preflight([row(name)])

    def test_symlink_parent_rejected(self):
        with self.assertRaises(RestoreError):
            preflight([row('x', '2', link='inside'), row('x/escape')])

    def test_external_symlink_requires_exact_approval(self):
        r = row('python', '2', link='/usr/bin/python3')
        with self.assertRaises(RestoreError):
            preflight([r])
        self.assertEqual(len(preflight([r], ['/usr/bin/python3'])), 1)
        with self.assertRaises(RestoreError):
            preflight([row('x', '2', link='../outside')])

    def test_hardlink_cannot_reference_symlink_or_missing_file(self):
        for rows in ([row('x', '1', link='missing')],
                     [row('s', '2', link='r'), row('x', '1', link='s')]):
            with self.assertRaises(RestoreError):
                preflight(rows)

    def test_duplicate_special_type_and_mode_rejected(self):
        for rows in ([row('a'), row('a')], [row('fifo', '6')], [row('suid', mode=0o4755)]):
            with self.assertRaises(RestoreError):
                preflight(rows)


class ExtractionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='infra-synthetic-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        probe = self.root / 'case'
        probe.write_text('x')
        self.case_sensitive = not (self.root / 'CASE').exists()
        probe.unlink()

    def target(self):
        return self.root / 'restored'

    def test_refuses_existing_destination(self):
        self.target().mkdir()
        sentinel = self.target() / 'owner-file'
        sentinel.write_text('keep')
        with self.assertRaises(RestoreError):
            restore(archive([row('a')]), [row('a')], self.target())
        self.assertEqual(sentinel.read_text(), 'keep')

    def test_case_sensitivity_gate(self):
        if self.case_sensitive:
            self.skipTest('case-sensitive filesystem')
        with self.assertRaisesRegex(RestoreError, 'case-insensitive'):
            restore(archive([row('a')]), [row('a')], self.target())
        self.assertFalse((self.target() / 'a').exists())

    def test_roundtrip_case_files_and_links(self):
        if not self.case_sensitive:
            self.skipTest('use case-sensitive test filesystem for roundtrip')
        rows = [row('dir', '5', mode=0o750), row('dir/Case'), row('dir/case'),
                row('hard', '1', link='dir/Case'), row('soft', '2', link='dir/Case')]
        report = restore(archive(rows), rows, self.target())
        self.assertEqual(report['members'], 5)
        self.assertEqual((self.target() / 'hard').stat().st_ino,
                         (self.target() / 'dir/Case').stat().st_ino)
        self.assertEqual((self.target() / 'dir').stat().st_mode & 0o777, 0o750)
        self.assertFalse(report['numeric_ownership_applied'])

    def test_hash_mismatch_and_missing_members(self):
        if not self.case_sensitive:
            self.skipTest('requires case-sensitive filesystem')
        with self.assertRaisesRegex(RestoreError, 'content mismatch'):
            restore(archive([row('a')], b'changed'), [row('a')], self.target())
        with self.assertRaisesRegex(RestoreError, 'missing archive'):
            restore(archive([row('a')]), [row('a'), row('b')], self.root / 'missing')


if __name__ == '__main__':
    unittest.main()
