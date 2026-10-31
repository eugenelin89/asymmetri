#!/usr/bin/env python3
"""Import only CWRU names/programs/source links from owner-provided research.

Usage: python3 import_students.py INPUT.md --audit SOURCE_AUDIT.json
The original research file and its contact columns are never copied to the repo.
"""
import argparse
import hashlib
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import urlparse


def parse_rows(text):
    rows = []
    seen = set()
    for line in text.splitlines():
        if not line.startswith('| Case Western Reserve University (CWRU) | '):
            continue
        cols = [cell.strip() for cell in line.strip('|').split('|')]
        if len(cols) != 7:
            continue
        source = re.search(r'\]\((https://[^)]+)\)', cols[6])
        if not source:
            continue
        url = source.group(1)
        host = urlparse(url).hostname or ''
        if host != 'case.edu' and not host.endswith('.case.edu'):
            raise ValueError('Unexpected student source host')
        name = ' '.join((cols[1] + ' ' + cols[2]).split())
        key = unicodedata.normalize('NFKC', name).casefold()
        if key in seen:
            raise ValueError('Duplicate student name: ' + name)
        seen.add(key)
        slug = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()).strip('-')
        row = {'id': 'student-' + slug, 'name': name, 'program': cols[4], 'source': url}
        if cols[3]:
            if not re.fullmatch(r'20\d{2}', cols[3]):
                raise ValueError('Unexpected completion-year format')
            row['expectedClassYear'] = int(cols[3])
        rows.append(row)
    if len(rows) != 500:
        raise ValueError(f'Expected 500 CWRU rows, received {len(rows)}')
    if len({r['id'] for r in rows}) != len(rows):
        raise ValueError('Student IDs collide')
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('--audit', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path)
    args = parser.parse_args()
    rows = parse_rows(args.input.read_text())
    audit = json.loads(args.audit.read_text())
    pages = {p['url']: p for p in audit}
    for row in rows:
        page = pages.get(row['source'], {})
        match = next((m for m in page.get('matches', []) if m['name'] == row['name']), {})
        row['nameRechecked'] = bool(match.get('nameFound') or match.get('fallbackNameFound'))
        row['programRechecked'] = bool(match.get('programFound'))
        row['sourceKind'] = 'athletics' if urlparse(row['source']).hostname == 'athletics.case.edu' else 'university-student-list'
        row['sourceChecked'] = '2026-10-31'
        row['sourceStatus'] = page.get('status', 0)
        if page.get('corroboratingSource') and match.get('fallbackNameFound'):
            row['corroboratingSource'] = page['corroboratingSource']
    destination = args.output_dir or Path(__file__).resolve().parents[1] / 'data'
    destination.mkdir(parents=True, exist_ok=True)
    (destination / 'students.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    # Whitelist audit metadata; raw page text/contact details are not retained.
    provenance = {
        'checked': '2026-10-31', 'records': len(rows), 'sourcePages': len(pages),
        'inputSha256': hashlib.sha256(args.input.read_bytes()).hexdigest(),
        'limits': 'Owner-provided public-source research. Page presence is not independent enrollment verification. Program fields not found verbatim remain attributed to the provided research. No email or portrait fields imported.',
        'pages': [{k: p[k] for k in ['url', 'finalUrl', 'status', 'title', 'sha256', 'roster2026', 'studentPage', 'error', 'corroboratingSource'] if k in p} | {
            'namesMatched': sum(m['nameFound'] for m in p.get('matches', [])),
            'namesCorroborated': sum(bool(m.get('fallbackNameFound')) for m in p.get('matches', [])),
            'namesChecked': len(p.get('matches', []))
        } for p in audit]
    }
    (destination / 'student-source-audit.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
    print(f'Imported {len(rows)} student records; contact columns excluded.')


if __name__ == '__main__':
    main()
