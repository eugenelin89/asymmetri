"""Offline bounded Surrey importer. Source data is cached outside Git; no runtime API."""
import argparse, hashlib, json, math, pathlib, urllib.request, urllib.parse, datetime
from shapely.geometry import shape, box, Point, LineString
from shapely.ops import transform, unary_union, nearest_points
from shapely import make_valid

ROOT = pathlib.Path(__file__).resolve().parents[3]
VERSION = 'v0.1-2026-10-30'
BBOX = [-122.858, 49.182, -122.840, 49.195]
ORIGIN = [-122.849, 49.1895]
BASE = 'https://gisservices.surrey.ca/arcgis/rest/services/OpenData/MapServer/'
LAYERS = {'roads': BASE+'126', 'sidewalks': BASE+'128', 'civic': BASE+'155', 'parks': BASE+'256', 'rail': BASE+'100', 'signals': BASE+'130', 'buildings': 'https://services5.arcgis.com/YRpe0VKTJytZSSIB/arcgis/rest/services/Building%20Footprnts/FeatureServer/0'}

def project(x,y,z=None): return (x-ORIGIN[0])*111320*math.cos(math.radians(ORIGIN[1])), (ORIGIN[1]-y)*111320

def parts(g, kind):
    if g.is_empty: return []
    if g.geom_type == kind: return [g]
    return [p for child in getattr(g,'geoms',[]) for p in parts(child,kind)]

def polygon(p): return [[[round(x,2),round(y,2)] for x,y in ring.coords] for ring in [p.exterior,*p.interiors]]
def line(p): return [[round(x,2),round(y,2)] for x,y in p.coords]

def build(cache):
    cache.mkdir(parents=True,exist_ok=True)
    sources=[]; raw={}
    manifest_path=ROOT/'public'/'surrey'/VERSION/'manifest.json'
    pinned={s['name']:s['sha256'] for s in json.loads(manifest_path.read_text())['sources']} if manifest_path.exists() else {}
    for name,url in LAYERS.items():
        params={'f':'geojson','where':'1=1','geometry':','.join(map(str,BBOX)),'geometryType':'esriGeometryEnvelope','inSR':'4326','spatialRel':'esriSpatialRelIntersects','outSR':'4326','outFields':'*','returnGeometry':'true','resultRecordCount':2000}
        request=url+'/query?'+urllib.parse.urlencode(params)
        path=cache/(name+'.json')
        if not path.exists():
            path.write_bytes(urllib.request.urlopen(request,timeout=90).read())
        if name in pinned and hashlib.sha256(path.read_bytes()).hexdigest()!=pinned[name]: raise ValueError('Source digest changed: review and choose a new snapshot')
        data=json.loads(path.read_bytes())
        if data.get('error') or data.get('exceededTransferLimit') or len(data.get('features',[]))>=2000: raise ValueError((name,'Failed or truncated request',data.get('error')))
        meta_path=cache/(name+'-metadata.json')
        if not meta_path.exists(): meta_path.write_bytes(urllib.request.urlopen(url+'?f=json',timeout=60).read())
        meta=json.loads(meta_path.read_bytes())
        raw[name]=data['features']
        sources.append({'name':name,'url':url,'request':request,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'features':len(raw[name]),'editingInfo':meta.get('editingInfo'),'currency':'Snapshot retrieved 2026-10-30; feature survey dates are not guaranteed current.'})
        print(name,len(raw[name]),flush=True)
    minx,maxz=project(BBOX[0],BBOX[1]); maxx,minz=project(BBOX[2],BBOX[3]); extent=box(minx,minz,maxx,maxz)
    def geom(f): return make_valid(transform(project,shape(f['geometry']))).intersection(extent)
    buildings=[]
    for f in raw['buildings']:
        props=f['properties']
        for p in parts(geom(f),'Polygon'):
            if p.area < 12: continue
            buildings.append({'id':str(props.get('OBJECTID',props.get('FID',len(buildings)))),'shape':polygon(p.simplify(.4,preserve_topology=True)),'height':round(min(160,max(4,float(props.get('BUILDING_HEIGHT') or 9))),2),'heightMethod':'stylized source BUILDING_HEIGHT; units and observation date unverified','name':props.get('NAME')})
    structures=unary_union([shape({'type':'Polygon','coordinates':b['shape']}) for b in buildings])
    roads=[]
    for f in raw['roads']:
        prop=f['properties']; name=prop.get('ROAD_NAME') or 'Local street'; lanes=prop.get('NO_LANE') or 2
        for p in parts(geom(f),'LineString'):
            roads.append({'name':name,'points':line(p.simplify(.25)),'width':min(23,max(7,lanes*3.3))})
    pavement=unary_union([LineString(r['points']).buffer(r['width']/2,quad_segs=3) for r in roads]).intersection(extent).difference(structures)
    foot=[]
    for kind in ['sidewalks']:
        for f in raw[kind]:
            width=f['properties'].get('WIDTH') or 2.8
            for p in parts(geom(f),'LineString'): foot.append(p.buffer(max(1.5,min(width/2,3)),quad_segs=3))
    # The source is line geometry. Visible paths and collision share these buffered surfaces.
    sidewalks=unary_union(foot).intersection(extent).difference(structures)
    parks=[{'name':f['properties'].get('PARK_NAME') or 'Park','shape':polygon(p)} for f in raw['parks'] for p in parts(geom(f),'Polygon') if p.area>20]
    # Ground outside buildings is a bounded arcade surface, including plazas and street crossings.
    # Illustrative paved station apron; never substituted for verified source street geometry.
    station=Point(project(-122.8490,49.1895)); plaza=station.buffer(65).difference(structures).difference(pavement)
    walkable=extent.difference(structures.buffer(.55))
    def snap(lon,lat):
        q=Point(project(lon,lat)); p=nearest_points(q,sidewalks.difference(structures.buffer(1)))[1]
        return [round(p.x,2),round(p.y,2)]
    anchors={'spawn':snap(-122.84863,49.18955),'owner':snap(-122.84855,49.18975),'clue':snap(-122.84842,49.19010),'thief':snap(-122.84835,49.19062),'escape':snap(-122.84840,49.19130),'community':snap(-122.8488,49.1908),'mystery':snap(-122.8505,49.1911),'danger':snap(-122.84765,49.1903)}
    cells={}
    for x in range(math.floor(minx/64),math.ceil(maxx/64)):
        for z in range(math.floor(minz/64),math.ceil(maxz/64)):
            ps=parts(walkable.intersection(box(x*64,z*64,(x+1)*64,(z+1)*64)),'Polygon')
            if ps: cells[f'{x},{z}']=[polygon(p) for p in ps]
    civic=[{'name':f['properties'].get('NAME'),'centre':list(geom(f).centroid.coords)[0]} for f in raw['civic'] if f['properties'].get('NAME') and not geom(f).is_empty]
    city={'version':VERSION,'origin':ORIGIN,'bbox':BBOX,'bounds':[round(minx,2),round(minz,2),round(maxx,2),round(maxz,2)],'anchors':anchors,'buildings':buildings,'roads':roads,'pavement':[polygon(p) for p in parts(pavement,'Polygon')],'sidewalks':[polygon(p) for p in parts(sidewalks,'Polygon')],'plazas':[polygon(p) for p in parts(plaza,'Polygon')],'parks':parks,'rail':[line(p) for f in raw['rail'] for p in parts(geom(f),'LineString')],'signals':[[round(geom(f).x,2),round(geom(f).y,2)] for f in raw['signals'] if geom(f).geom_type=='Point'],'walkCells':cells,'civic':civic}
    out=ROOT/'public'/'surrey'/VERSION; out.mkdir(parents=True,exist_ok=True)
    data=json.dumps(city,separators=(',',':')).encode()+b'\n'
    target=out/'city.json'
    if target.exists() and target.read_bytes()!=data: raise ValueError('Immutable snapshot differs: choose a new version before replacing published data.')
    target.write_bytes(data)
    manifest={'version':VERSION,'retrieved':'2026-10-30','bbox':BBOX,'origin':ORIGIN,'projection':'Local equirectangular metres: x east, z south; 111320 metres/degree, longitude scaled by cos(origin latitude).','bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'attribution':'Contains information licensed under the Open Government Licence – City of Surrey.','licence':'https://www.surrey.ca/sites/default/files/media/documents/BulkGISDataRequestFormSecured.pdf','sources':sources,'processing':['Bounded WGS84 queries; reject truncated responses. Clip to extent; simplify buildings 0.4 m and roads 0.25 m.','Sidewalk/path lines buffered to at least 3 m width for gameplay. Road widths inferred from lane counts.','Source BUILDING_HEIGHT is interpreted as metres and clamped to 4–160 m for stylized massing; units and observation dates are unverified. Facades, trees, street furniture, crosswalks and station apron are illustrative.','Flat ground is walkable outside 0.55 m buffered building footprints. No terrain, interiors or legal access model.','Fictional story positions snapped to source sidewalks; no crime data imported.'],'currency':'Retrieval date is not an observation date. Layers have mixed/unspecified survey dates; metadata editingInfo recorded where supplied.'}
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Output',len(data),'bytes',len(buildings),'buildings; anchors',anchors); print('Civic',civic)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--cache',type=pathlib.Path,required=True);args=parser.parse_args();build(args.cache)
