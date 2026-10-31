#!/usr/bin/env python3
"""Official published roster adapter; private HTML cache, no portraits/contact data."""
import argparse,re,json,urllib.request,hashlib,time
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
parser=argparse.ArgumentParser();parser.add_argument('--cache',type=Path,required=True);parser.add_argument('--seed',type=Path,required=True);args=parser.parse_args()
base='https://gothunderbirds.ca'
seed=BeautifulSoup(args.seed.read_text(),'html.parser')
nav=next(json.JSONDecoder().raw_decode(s.text[s.text.index('var obj = ')+10:].lstrip())[0] for s in seed.select('script') if 'var obj = ' in s.text and '"type":"main-navigation"' in s.text)
root=next(x for x in nav['data'] if x['title']=='Teams')
sports=[];group=''
for x in root['items']:
 if x.get('separator'): group=x['title']
 if x.get('sport_id_association') and x['url'].startswith('/sports/'):
  sports.append({'name':(group+' '+x['title']).strip(),'slug':x['sport']['shortname'],'url':urljoin(base,x['url'])+'/roster'})
print('sports',[(s['name'],s['slug']) for s in sports],flush=True)
sports=list({x['url']:x for x in sports}.values())
records=[];sources=[]
cache=args.cache;cache.mkdir(exist_ok=True)
for sport in sports:
 try:
  cached=cache/(sport['slug']+'.html')
  raw=cached.read_bytes() if cached.exists() else urllib.request.urlopen(sport['url'],timeout=12).read()
  cached.write_bytes(raw);doc=BeautifulSoup(raw,'html.parser')
  tables=[t for t in doc.select('table') if t.select_one('td.sidearm-table-player-name')]
  if not tables: raise ValueError('No athlete table available')
  count=0;seasons=[]
  for table in tables:
   season=table.find('caption').get_text(' ',strip=True);seasons.append(season)
   for tr in table.select('tbody tr'):
    name=tr.select_one('td.sidearm-table-player-name a')
    if not name: continue
    def field(cls):
     x=tr.select_one('td.'+cls);return x.get_text(' ',strip=True) if x else ''
    records.append({'id':'athlete-'+sport['slug']+'-'+hashlib.sha256(name['href'].encode()).hexdigest()[:12], 'name':name.get_text(' ',strip=True),'sport':re.sub(r"\b20\d{2}(?:-\d{2})?\s*|\s*Roster$",'',season).strip(),'sportKey':sport['slug'],'position':field('rp_position_short'),'number':field('roster_jerseynum'),'url':urljoin(base,name['href']),'rosterUrl':sport['url'],'season':season,'verified':'2026-10-31'})
    count+=1
  season=' / '.join(seasons)
  sources.append({**sport,'season':season,'count':count,'sha256':hashlib.sha256(raw).hexdigest(),'status':'parsed published roster'})
  print(sport['name'],season,count,flush=True)
 except Exception as e:
  sources.append({**sport,'status':'unavailable','error':str(e)});print('FAILED',sport['name'],str(e),flush=True)
 time.sleep(.35)
records=list({x['id']:x for x in records}.values())
Path('projects/ubc/data/athletes.json').write_text(json.dumps({'checked':'2026-10-31','source':base,'scope':'Published varsity roster entries only. Season labels are preserved; not live membership. No portraits, hometowns, ages, physical measurements, contact details or personal biographies collected.','sources':sources,'people':records},ensure_ascii=False,indent=2)+'\n')
print('TOTAL',len(records),flush=True)
