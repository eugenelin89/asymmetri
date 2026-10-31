"""Recheck the Orchard derivative against the pinned public source; no data writes.

Run: python3 projects/ubc/tools/verify_orchard.py /path/to/ubcv_subbuildings.geojson
Download the exact URL in the Orchard manifest before running. No credentials needed.
"""
import hashlib
import json
import math
from pathlib import Path
import sys
import compile_data as compiler

root = Path(__file__).resolve().parents[3]
directory = root / 'public/ubc/orchard-v0.2-2026-10-31'
receipt = json.loads((directory / 'geography.json').read_text())
data = json.loads((root / 'public/ubc/v0.1-2026-10-30/data.json').read_text())
raw = Path(sys.argv[1]).read_bytes()
assert hashlib.sha256(raw).hexdigest() == receipt['source']['sha256']
features = {f['properties']['SBLDG_UID']: f for f in json.loads(raw)['features']
            if f['properties'].get('PARENT_ID') == 'VBL10013'}
a = receipt['recommendedAnchor']
def local(point):
    x, z = point[0] - a['x'], point[1] - a['z']
    return [round(x * math.cos(a['yaw']) - z * math.sin(a['yaw']), 6),
            round(x * math.sin(a['yaw']) + z * math.cos(a['yaw']), 6)]
for section in receipt['subbuildings']:
    rings = compiler.polygons(features[section['id']], .16)[0]
    assert rings == section['ringsWorld']
    assert [[local(p) for p in ring] for ring in rings] == section['ringsLocal']
for part in receipt['footprintParts']:
    assert part['rings'] == next(b['rings'] for b in data['buildings'] if b['id'] == part['id'])
assert receipt['entrance'] == next(e for e in data['entrances'] if e['id'] == receipt['entrance']['id'])
for output in json.loads((directory / 'manifest.json').read_text())['outputs']:
    contents = (directory / output['path']).read_bytes()
    assert len(contents) == output['bytes']
    assert hashlib.sha256(contents).hexdigest() == output['sha256']
print('Verified five pinned subbuilding sections, both unchanged footprints, source entrance and output digest.')
