"""Geography integrity tests against shipped bytes and projection invariants."""
import hashlib
import importlib.util
import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT/'public/ubc/v0.1-2026-10-30'
spec = importlib.util.spec_from_file_location('compile_data', Path(__file__).with_name('compile_data.py'))
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class GeographyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads((DATA/'data.json').read_text())
        cls.anchors=json.loads((DATA/'anchors.json').read_text())
        cls.manifest=json.loads((DATA/'manifest.json').read_text())

    def test_shipped_hashes_and_counts(self):
        for name,receipt in self.manifest['outputs'].items():
            content=(DATA/name).read_bytes()
            self.assertEqual(len(content),receipt['bytes'])
            self.assertEqual(hashlib.sha256(content).hexdigest(),receipt['sha256'])
        for name,count in self.manifest['counts'].items():
            self.assertEqual(len(self.data[name]),count)

    def test_projection_axis_and_inverse(self):
        self.assertEqual(compiler.project(compiler.ORIGIN),[0.0,0.0])
        self.assertAlmostEqual(compiler.utm(-123,0)[0],500000,places=5)
        self.assertAlmostEqual(compiler.utm(-123,0)[1],0,places=5)
        self.assertGreater(compiler.project([-123.244,49.26])[0],70)
        self.assertLess(compiler.project([-123.245,49.261])[1],-110)
        for lon,lat in [[-123.240391429,49.25611187],[-123.255,49.27],[-123.23,49.25]]:
            x,z=compiler.project([lon,lat]);a,b=compiler.unproject(x,z)
            self.assertLess(abs(a-lon),1e-7)
            self.assertLess(abs(b-lat),1e-7)

    def test_rings_holes_ids_and_finiteness(self):
        holes=0
        for key in ['buildings','surfaces']:
            ids=[f['id'] for f in self.data[key]]
            self.assertEqual(len(ids),len(set(ids)))
            for feature in self.data[key]:
                holes+=len(feature['rings'])-1
                for ring in feature['rings']:
                    self.assertGreaterEqual(len(ring),4)
                    self.assertEqual(ring[0],ring[-1])
                    self.assertGreater(compiler.area(ring),0)
                    self.assertTrue(all(math.isfinite(v) for p in ring for v in p))
        self.assertGreater(holes,100)

    def test_anchors_match_source_and_stadium_faces_southwest(self):
        ids={b['id'] for b in self.data['buildings']}
        for name in ['rose','bookstore','nest','sauder']:
            self.assertIn(self.anchors[name]['buildingId'],ids)
        a=self.anchors['stadium']
        self.assertLess(-math.sin(a['yaw']),0)
        self.assertGreater(-math.cos(a['yaw']),0)
        self.assertEqual(a['homePlateSource'],'LSHARD_TYPE-970-0 home-plate circle arc')
        spawn=self.anchors['spawn'];route=next(r for r in self.data['routes'] if r['id']==spawn['sourceRouteId'])
        self.assertEqual(route['kind'],'Sidewalk')
        self.assertIn([spawn['x'],spawn['z']],route['points'])

    def test_no_private_metadata_or_indoor_route_shortcuts(self):
        text=(DATA/'data.json').read_text()
        for prohibited in ['CREATED_USER','LAST_EDITED_USER','@gmail.com','@ubc.ca','CARD_READER']:
            self.assertNotIn(prohibited,text)
        self.assertFalse(any(r['kind']=='Bldg_Inside' or r['pedestrianAccess']=='N' for r in self.data['routes']))
        self.assertTrue(all(s['license'].endswith('/pddl/1-0/') for s in self.manifest['sources']))


if __name__=='__main__': unittest.main()
