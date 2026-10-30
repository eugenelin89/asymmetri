"""Independent offline geometry acceptance; run with the importer's Shapely environment."""
import json
import unittest
from shapely.geometry import shape, LineString
from shapely.ops import unary_union
from build_city import ROOT, project

city = json.loads((ROOT/'public/surrey/v0.3-2026-10-30/city.json').read_bytes())
def surface(polygons): return unary_union([shape({'type':'Polygon', 'coordinates':p}) for p in polygons])

class ReconstructionTests(unittest.TestCase):
    def test_coordinate_control_and_retained_frame(self):
        self.assertEqual(project(-122.849, 49.1895), (0, 0))
        x, z = project(-122.848466875937, 49.1872861683992)
        self.assertAlmostEqual(x, 38.79, delta=.01)
        self.assertAlmostEqual(z, 246.44, delta=.01)
        self.assertIn([round(x,2),round(z,2)], next(b for b in city['buildings'] if b['id']=='1665')['shape'][0])

    def test_mesh_interiors_and_intersection_continuity(self):
        asphalt = surface(city['pavement']); sidewalks = surface(city['sidewalks']); medians = surface(city['medians'])
        buildings = surface([b['shape'] for b in city['buildings']])
        self.assertTrue(asphalt.is_valid)
        # Quantization can move shared boundaries at most about 1cm. Compare eroded interiors.
        self.assertLess(asphalt.buffer(-.02).intersection(sidewalks.buffer(-.02)).area, .01)
        self.assertLess(asphalt.buffer(-.02).intersection(medians.buffer(-.02)).area, .01)
        for road in city['roads']:
            route = LineString(road['points']).difference(buildings.buffer(.02)).difference(medians.buffer(.02))
            self.assertLess(route.difference(asphalt.buffer(.04)).length, .1, road['name'])

    def test_markings_and_paths(self):
        asphalt = surface(city['pavement'])
        for layer in ['crossings', 'markings']:
            self.assertLess(surface(city[layer]).difference(asphalt.buffer(.04)).area, .01, layer)
        self.assertTrue(all(0 < p['width'] < 20 for p in city['paths']))
        self.assertEqual(city['terrain']['kind'], 'flat')
        self.assertTrue(all(b['baseElevation']==0 for b in city['buildings']))

if __name__ == '__main__': unittest.main()
