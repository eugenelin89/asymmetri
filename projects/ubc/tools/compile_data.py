#!/usr/bin/env python3
"""Compile the pinned UBC PDDL layers. Python stdlib only, no runtime downloads.

Coordinate formula: Snyder transverse Mercator series on GRS80, UTM zone 10N.
WGS84 source positions are treated as NAD83; no epoch/datum shift is available.
The resulting centimetres are storage precision, not a survey accuracy claim.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from collections import Counter

REVISION = '885732d332a20a59143f655c83fb15e1367ebe4d'
SOURCE_SHA256 = {'ubcv_campus_trees.geojson': 'c12c5b3dfdf57bc8c4013310cd78974baf1a6a514d6d2b8ad9d1411c9e4a25c0', 'ubcv_roads_simple.geojson': '1fcc92e7b5d721375d0d347eec5207671e3bad9d0f1d62b94f3cdd78c4a46308', 'ubcv_landscape_hard.geojson': '4f9312601e20cfbf5cbf802010aebb01ab0b357ac4157e58bd705dac026fa22e', 'ubcv_landscape_soft.geojson': '7f3636554460a23801b7b5b09b2b5d50f66b68566f59a782b747bd894640c764', 'ubcv_routes.geojson': 'b782fabf6f10ad3b13a781c0ee15c4beb3b362f6b2f0af08ba3b9d5780e58fb9', 'ubcv_building_entraces.geojson': '02f7ae55c2a72665954e3de60f63b472f7cab3aa0f04d811ee2733327853bf07', 'ubcv_buildings.geojson': '57433e92b67bf4b6bac7841963d388c6ad2559373155eae07f6287316c011d2e'}
ORIGIN = [-123.245, 49.26]
BOUNDS = [-123.263, 49.244, -123.224, 49.277]
VERSION = 'v0.1-2026-10-30'
LAYERS = {
    'ubcv_buildings.geojson': 'locations',
    'ubcv_building_entraces.geojson': 'locations',
    'ubcv_landscape_hard.geojson': 'landscape',
    'ubcv_landscape_soft.geojson': 'landscape',
    'ubcv_campus_trees.geojson': 'landscape',
    'ubcv_routes.geojson': 'transportation',
    'ubcv_roads_simple.geojson': 'transportation',
}


def utm(lon, lat):
    a, invf, k0 = 6378137.0, 298.257222101, .9996
    f = 1 / invf
    e2 = f * (2 - f)
    ep2 = e2 / (1 - e2)
    phi, lam = math.radians(lat), math.radians(lon + 123)
    n = a / math.sqrt(1 - e2 * math.sin(phi) ** 2)
    t, c, aa = math.tan(phi) ** 2, ep2 * math.cos(phi) ** 2, math.cos(phi) * lam
    m = a * ((1-e2/4-3*e2**2/64-5*e2**3/256)*phi
             -(3*e2/8+3*e2**2/32+45*e2**3/1024)*math.sin(2*phi)
             +(15*e2**2/256+45*e2**3/1024)*math.sin(4*phi)
             -(35*e2**3/3072)*math.sin(6*phi))
    east = 500000 + k0*n*(aa+(1-t+c)*aa**3/6+(5-18*t+t*t+72*c-58*ep2)*aa**5/120)
    north = k0*(m+n*math.tan(phi)*(aa*aa/2+(5-t+9*c+4*c*c)*aa**4/24+(61-58*t+t*t+600*c-330*ep2)*aa**6/720))
    return east, north


OX, ON = utm(*ORIGIN)


def project(p):
    x, n = utm(*p[:2])
    return [round(x-OX, 2), round(ON-n, 2)]


def unproject(x,z):
    """Numerically invert the same projection for inspectable anchor coordinates."""
    lon,lat=ORIGIN
    for _ in range(8):
        e,n=utm(lon,lat);de,dn=OX+x-e,ON-z-n
        ex,nx=utm(lon+1e-5,lat);ey,ny=utm(lon,lat+1e-5)
        a,b,c,d=(ex-e)/1e-5,(ey-e)/1e-5,(nx-n)/1e-5,(ny-n)/1e-5
        determinant=a*d-b*c
        lon+=(d*de-b*dn)/determinant;lat+=(-c*de+a*dn)/determinant
    return [round(lon,9),round(lat,9)]


def in_bounds(p):
    return BOUNDS[0] <= p[0] <= BOUNDS[2] and BOUNDS[1] <= p[1] <= BOUNDS[3]


def area(r):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(r,r[1:]+r[:1]))) / 2


def distance(p, a, b):
    dx, dz = b[0]-a[0], b[1]-a[1]
    t = max(0, min(1, ((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz or 1)))
    return math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dz)


def simplify(points, tolerance):
    if len(points) <= 2:
        return points
    d, at = max((distance(p, points[0], points[-1]), i) for i,p in enumerate(points[1:-1],1))
    if d <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:at+1], tolerance)[:-1]+simplify(points[at:], tolerance)


def ring(points, tolerance):
    p = [project(q) for q in points]
    if p[0] == p[-1]:
        p.pop()
    if len(p) < 3:
        return []
    at = max(range(1,len(p)),key=lambda i: math.dist(p[0],p[i]))
    r = simplify(p[:at+1],tolerance)[:-1]+simplify(p[at:]+p[:1],tolerance)
    return r if len(r) >= 4 and area(r) > .05 else p+p[:1]


def polygons(feature, tolerance):
    g = feature['geometry']
    if not g: return []
    poly = [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
    out = []
    for rings in poly:
        if not any(in_bounds(p) for p in rings[0]):
            continue
        rr = [ring(p,tolerance) for p in rings]
        rr = [r for r in rr if len(r)>=4]
        if rr:
            out.append(rr)
    return out


def centroid(r):
    cross = [a[0]*b[1]-b[0]*a[1] for a,b in zip(r,r[1:])]
    total = sum(cross)*3
    if abs(total)<.001:
        return [sum(p[k] for p in r)/len(r) for k in [0,1]]
    return [sum((a[k]+b[k])*v for a,b,v in zip(r,r[1:],cross))/total for k in [0,1]]


def hull(points):
    pts=sorted(set(map(tuple,points)))
    def cross(o,a,b): return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
    lo=[]
    for p in pts:
        while len(lo)>=2 and cross(lo[-2],lo[-1],p)<=0: lo.pop()
        lo.append(p)
    hi=[]
    for p in reversed(pts):
        while len(hi)>=2 and cross(hi[-2],hi[-1],p)<=0: hi.pop()
        hi.append(p)
    return lo[:-1]+hi[:-1]


def rectangle(r):
    h=hull(r);best=None
    for a,b in zip(h,h[1:]+h[:1]):
        angle=-math.atan2(b[1]-a[1],b[0]-a[0]);c,s=math.cos(angle),math.sin(angle)
        q=[[p[0]*c-p[1]*s,p[0]*s+p[1]*c] for p in h]
        xs,zs=zip(*q);x0,x1,z0,z1=min(xs),max(xs),min(zs),max(zs)
        candidate=((x1-x0)*(z1-z0),angle,x0,x1,z0,z1)
        if best is None or candidate[0]<best[0]: best=candidate
    _,a,x0,x1,z0,z1=best;c,s=math.cos(a),math.sin(a)
    x,z=(x0+x1)/2,(z0+z1)/2
    return x*c+z*s,-x*s+z*c,x1-x0,z1-z0,a


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--cache',type=Path,required=True)
    parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[3]/'public'/'ubc'/VERSION)
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    for name in LAYERS:
        actual=hashlib.sha256((args.cache/name).read_bytes()).hexdigest()
        if actual != SOURCE_SHA256[name]: raise ValueError(f'Changed source: {name}; review and create a new version rather than silently replacing bytes')
    raw={name:json.loads((args.cache/name).read_text())['features'] for name in LAYERS}
    data={'origin':ORIGIN,'originUtm':[OX,ON],'projection':'EPSG:26910; WGS84 positions treated as NAD83 without an epoch shift','buildings':[],'surfaces':[],'trees':[],'routes':[],'entrances':[]}
    for feature in raw['ubcv_buildings.geojson']:
        p=feature['properties']
        if p.get('CONSTR_STATUS') not in ['Complete',None]: continue
        for part,r in enumerate(polygons(feature,.16)):
            h=p.get('BLDG_HEIGHT'); sourced=isinstance(h,(int,float)) and 1<h<200
            data['buildings'].append({'id':str(p['BLDG_UID'])+(f'-part{part}' if part else ''),'name':p.get('NAME') or 'Campus building','rings':r,'height':round(h if sourced else max(4,(p.get('MAX_FLOORS') or 3)*3.5),2),'heightSource':'UBC BLDG_HEIGHT field; measurement method/date unspecified' if sourced else 'Illustrative floor-count estimate','address':p.get('PRIMARY_ADDRESS') or ''})
    for filename,field in [('ubcv_landscape_hard.geojson','LSHARD_TYPE'),('ubcv_landscape_soft.geojson','LSSOFT_TYPE')]:
        for feature in raw[filename]:
            p=feature['properties']
            for part,r in enumerate(polygons(feature,.2)):
                data['surfaces'].append({'id':f'{field}-{p["OBJECTID"]}-{part}','kind':p[field] or 'Landscape','rings':r,'name':p.get('NAME') or ''})
    for feature in raw['ubcv_campus_trees.geojson']:
        p=feature['properties'];q=feature['geometry']['coordinates']
        if not in_bounds(q): continue
        x,z=project(q);species=p.get('TAXA') or p.get('COMMON_NAME') or 'Species unrecorded'
        kind=p.get('TREE_TYPE') or '';evergreen=kind in ['Coniferous','Evergreen','C'] or any(g in species.lower() for g in ['picea','pinus','thuja','pseudotsuga','abies','tsuga','cedar','douglas'])
        height=p.get('THEIGHT');measured=isinstance(height,(int,float)) and 1<height<70
        data['trees'].append({'id':str(p.get('TREEID') or p['OBJECTID']),'x':x,'z':z,'species':species,'height':round(height if measured else (12 if evergreen else 9),2),'evergreen':evergreen,'heightSource':'THEIGHT' if measured else 'Illustrative species-class estimate'})
    for i,feature in enumerate(raw['ubcv_routes.geojson']):
        p=feature['properties'];g=feature['geometry'];q=g['coordinates']
        if p.get('PEDESTRIAN_ACCESS')=='N' or p.get('ROAD_TYPE')=='Bldg_Inside': continue
        if g['type']!='LineString' or not any(in_bounds(v) for v in q): continue
        data['routes'].append({'id':f'route-{i}','points':simplify([project(v) for v in q],.08),'kind':p.get('ROAD_TYPE') or 'Path','stairs':p.get('STAIRS')=='Y','pedestrianAccess':p.get('PEDESTRIAN_ACCESS') or 'Unknown'})
    data['roads']=[]
    for i,feature in enumerate(raw['ubcv_roads_simple.geojson']):
        p=feature['properties'];q=feature['geometry']['coordinates']
        if feature['geometry']['type']!='LineString' or not any(in_bounds(v) for v in q): continue
        data['roads'].append({'id':f'road-{i}','name':p.get('ROADNAME') or p.get('NAME') or 'Road','points':simplify([project(v) for v in q],.1)})
    for i,feature in enumerate(raw['ubcv_building_entraces.geojson']):
        p=feature['properties'];q=feature['geometry']['coordinates']
        if not in_bounds(q) or p.get('STATUS') not in ['Current',None]: continue
        x,z=project(q)
        data['entrances'].append({'id':p.get('GLOBALID') or f'entrance-{i}','buildingId':p.get('BLDG_UID'),'x':x,'z':z,'type':p.get('ENTRANCE_TYPE') or 'Unspecified','accessible':p.get('ACCESSIBLE')==1})
    anchors={}
    for aid,search in [('rose','Baseball Rose'),('bookstore','Bookstore'),('nest','AMS Student Nest'),('sauder','Henry Angus'),('beaty','Beaty Biodiversity'),('koerner','Walter C. Koerner'),('irving','Irving K. Barber'),('rose-garden','Rose Garden Parkade')]:
        candidates=[b for b in data['buildings'] if search.lower() in b['name'].lower()]
        if not candidates: continue
        b=max(candidates,key=lambda b:area(b['rings'][0]));x,z,w,d,yaw=rectangle(b['rings'][0])
        entries=[e for e in data['entrances'] if e['buildingId']==b['id']]
        entries.sort(key=lambda e:(e['type']!='Primary',not e['accessible'],math.hypot(e['x']-x,e['z']-z)))
        if entries:
            e=entries[0];dx,dz=e['x']-x,e['z']-z;c,s=math.cos(yaw),math.sin(yaw);lx,lz=dx*c-dz*s,dx*s+dz*c
            if abs(lx)/(w or 1)>abs(lz)/(d or 1): yaw+=math.copysign(math.pi/2,lx);w,d=d,w
            elif lz<0: yaw+=math.pi
        anchor={'id':aid,'x':round(x,2),'z':round(z,2),'width':round(w,2),'depth':round(d,2),'yaw':round(yaw,7),'buildingId':b['id'],'source':'Official building footprint minimum-area rectangle; facade interpretation'}
        if entries: anchor['entry']=[e['x'],e['z']];anchor['sourceEntranceId']=e['id']
        anchors[aid]=anchor
    # Source hardscape delineates the clay home-plate circle and mound circle.
    # Fit the first arc of OBJECTID 970; OBJECTID 974 is the mound. These are
    # source-surface inferences, not separately surveyed baseball control points.
    field=next(s for s in data['surfaces'] if s['id']=='LSSOFT_TYPE-3658-0')
    hf=next(f for f in raw['ubcv_landscape_hard.geojson'] if f['properties']['OBJECTID']==970)
    arc=[project(p) for p in hf['geometry']['coordinates'][0][:49]]
    a,b,c=arc[0],arc[18],arc[36]
    denominator=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]))
    norms=[p[0]*p[0]+p[1]*p[1] for p in [a,b,c]]
    home=[(norms[0]*(b[1]-c[1])+norms[1]*(c[1]-a[1])+norms[2]*(a[1]-b[1]))/denominator,
          (norms[0]*(c[0]-b[0])+norms[1]*(a[0]-c[0])+norms[2]*(b[0]-a[0]))/denominator]
    mound=centroid(next(s for s in data['surfaces'] if s['id']=='LSHARD_TYPE-974-0')['rings'][0])
    vx,vz=mound[0]-home[0],mound[1]-home[1]
    yaw=math.atan2(-vx,-vz)
    anchors['stadium']={'id':'stadium','x':round(home[0],2),'z':round(home[1],2),'width':170,'depth':150,'yaw':round(yaw,7),'sourceSurfaceId':field['id'],'homePlateSource':'LSHARD_TYPE-970-0 home-plate circle arc','moundSource':'LSHARD_TYPE-974-0 circle centroid','mound':mound,'homeToMoundMetres':round(math.hypot(vx,vz),3),'outfieldBearing':'south-southwest','source':'Home plate inferred from clay-circle centre; orientation toward official mound-circle centroid. Model field dimensions reconstructed, not a measured stadium survey.'}
    # Source pedestrian route vertex closest to the W16/baseball approach.
    target=project([-123.2412,49.25455]);candidates=[]
    for route in data['routes']:
        if route['kind'].lower() in ['sidewalk','pathway','path','pedestrian']:
            for p in route['points']:
                candidates.append((math.dist(p,target),p,route['id']))
    if not candidates:
        candidates=[(math.dist(p,target),p,r['id']) for r in data['routes'] for p in r['points']]
    _,p,rid=min(candidates)
    anchors['spawn']={'id':'spawn','x':p[0],'z':p[1],'width':1,'depth':1,'yaw':math.atan2(p[0]-home[0],p[1]-home[1]),'sourceRouteId':rid,'source':'Official sidewalk vertex about 20 m north of West 16th Avenue/East Mall roundabout; source geometry verified, current physical access not field-surveyed'}
    if 'rose-garden' in anchors:
        anchors['rose-garden']['source']='Rose Garden / parkade context anchor from VBL10054; garden is above parkade. Terrain and roof-garden elevation not modeled; this is an exterior information point.'
    for anchor in anchors.values(): anchor['wgs84']=unproject(anchor['x'],anchor['z'])
    for name,obj in [('data.json',data),('anchors.json',anchors)]:
        (args.output/name).write_text(json.dumps(obj,separators=(',',':'),ensure_ascii=False)+'\n')
    sources=[]
    for name,folder in LAYERS.items():
        content=(args.cache/name).read_bytes();sources.append({'file':name,'url':f'https://raw.githubusercontent.com/UBCGeodata/ubc-geospatial-opendata/{REVISION}/ubcv/{folder}/geojson/{name}','sha256':hashlib.sha256(content).hexdigest(),'bytes':len(content),'features':len(raw[name]),'license':'https://opendatacommons.org/licenses/pddl/1-0/','licenseEvidence':f'https://github.com/UBCGeodata/ubc-geospatial-opendata/blob/{REVISION}/ubcv/{folder}/README.md'})
    manifest={'version':VERSION,'retrieved':'2026-10-30','upstreamCommit':REVISION,'attribution':'Contains UBC Campus + Community Planning open geospatial data, PDDL 1.0. No UBC endorsement.','sources':sources,'projection':{'source':'EPSG:4326','target':'EPSG:26910 local metres; x east, z south','origin':ORIGIN,'originUtm':[OX,ON],'method':'Snyder transverse Mercator series, GRS80, UTM zone 10N; WGS84 treated as NAD83, no epoch/datum shift','roundingMetres':.01},'boundsWgs84':BOUNDS,'counts':{k:len(data[k]) for k in ['buildings','surfaces','trees','routes','entrances','roads']},'surfaceKinds':dict(Counter(s['kind'] for s in data['surfaces'])),'processing':{'polygons':'RDP 0.16 m buildings / 0.20 m landscape per ring, every hole retained. Features selected by source vertex inside bounds; full boundary features retained, not clipped.','routes':'Source pedestrian-allowed or unknown-access lines, RDP 0.08 m; Bldg_Inside lines excluded to avoid routing through unsupported interiors. No invented connections.','buildings':'Completed source buildings only; original multipart geometry split with stable suffixes; BLDG_HEIGHT field where available, floor-count estimate otherwise.','trees':'GPS positions and recorded species; THEIGHT when present and plausible, illustrative size otherwise. Evergreen classes and known conifer taxa remain evergreen.','privacy':'Only allowlisted visitor geometry/attributes retained. No staff/editor identities or email metadata.','terrain':'Flat datum. No DTM, terrain heights, entrance floor elevations, or tree terrain offsets available in this snapshot.','anchors':'Minimum-area footprint rectangles oriented toward a recorded primary entrance where available. Not exact architectural facade or interior outlines.'},'limitations':['Data observation dates and precision vary; retrieval date does not imply a current survey.','Footprint heights are maxima, not verified roof structures. ArcGIS time-slider layer not incorporated.','Stadium home plate/orientation inferred from official clay-circle and mound polygons, not independently survey-verified.','Spawn source sidewalk near W16 verified in GIS; current physical access has not been field-surveyed.','No live construction or occupancy data; future/proposed building status excluded.','WGS84/NAD83 epoch shift not modeled; horizontal datum difference can be around metres.'],'outputs':{n:{'bytes':(args.output/n).stat().st_size,'sha256':hashlib.sha256((args.output/n).read_bytes()).hexdigest()} for n in ['data.json','anchors.json']}}
    manifest['fieldMetadata']={'url':f'https://github.com/UBCGeodata/ubc-geospatial-opendata/blob/{REVISION}/ubcv/locations/metadata/ubcv_buildings_fields.csv','BLDG_HEIGHT':'Metres from grade to highest roof point, per UBC data dictionary','MAX_FLOORS':'Total floors above and below grade; fallback height is illustrative and may overestimate'}
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps({'counts':manifest['counts'],'anchors':anchors,'outputs':manifest['outputs']},indent=2))


if __name__=='__main__': main()
