#!/usr/bin/env python3
"""Reviewed directory adapters: public professional names/roles only, never contacts.
Uses beautifulsoup4 in a separate research environment. Input HTML is cached outside Git.
"""
import argparse,hashlib,json,re,sys,urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup
parser=argparse.ArgumentParser();parser.add_argument("--cache",type=Path,required=True);args=parser.parse_args()
out=[];sources=[]
def add(name,title,department,zone,url,source,research=''):
 name=' '.join(name.split());title=' '.join(title.split())
 if not name or len(name)>90 or not title or any(x in (name+' '+title).lower() for x in ['deceased','passed away','in memoriam']):return
 identity=(name+'|'+department).lower();rid='faculty-'+hashlib.sha256(identity.encode()).hexdigest()[:14]
 if any(r['id']==rid for r in out):return
 out.append(dict(id=rid,name=name,title=title,department=department,zone=zone,url=url,source=source,research=research,verified='2026-10-31'))
for key,url,department,zone in [
 ('phas','https://phas.ubc.ca/researchers','Physics & Astronomy','hennings'),
 ('phas-staff','https://phas.ubc.ca/departmental-contacts','Physics & Astronomy','hennings'),
 ('cs','https://www.cs.ubc.ca/people/faculty','Computer Science','computer-science'),
 ('cs-staff','https://www.cs.ubc.ca/people/staff','Computer Science','computer-science')]:
 raw=(args.cache / ('ubc-'+key+'.html')).read_bytes();b=BeautifulSoup(raw,'html.parser');tables=b.select('table');start=len(out)
 if key=='phas':
  for tr in tables[0].select('tr')[1:]:
   cells=tr.select('td')
   if len(cells)<3:continue
   a=cells[0].find('a');add(cells[0].get_text(' ',strip=True)+' '+cells[1].get_text(' ',strip=True),cells[2].get_text(' ',strip=True),department,zone,urllib.parse.urljoin(url,a['href']) if a else url,url)
 elif key=='phas-staff':
  for tr in tables[0].select('tr')[1:]:
   cells=tr.select('td')
   if len(cells)>=2:add(cells[1].get_text(' ',strip=True),cells[0].get_text(' ',strip=True),department,zone,url,url)
 else:
  for ti,table in enumerate(tables):
   if key=='cs' and ti not in [0,2,3]:continue # core faculty and lecturers; exclude emeriti/associate duplicate affiliations
   for tr in table.select('tr'):
    name=tr.select_one('.contact-content-name');title=tr.select_one('.contact-content-job-title')
    if not name or not title:continue
    area=tr.select_one('.views-field-field-research-areas')
    add(name.get_text(' ',strip=True),title.get_text(' ',strip=True),department,zone,urllib.parse.urljoin(url,name.get('href',url)),url,area.get_text(' ',strip=True) if area else '')
 sources.append(dict(url=url,records=len(out)-start,sha256=hashlib.sha256(raw).hexdigest(),status='parsed professional directory; omitted email, phone, room, portraits and student records'))
raw=(args.cache/'ubc-deans.html').read_bytes();doc=BeautifulSoup(raw,'html.parser');url='https://academic.ubc.ca/about/meet-deans'
rows=[('Bruce MacDougall', 'Dean pro tem', 'Peter A. Allard School of Law', 'law'), ('James Olson', 'Dean', 'Faculty of Applied Science', 'engineering'), ('Clare Haru Crowston', 'Dean', 'Faculty of Arts', 'arts'), ('Hannu Larjava', 'Dean pro tem', 'Faculty of Dentistry', 'dentistry'), ('Jan Hare', 'Dean', 'Faculty of Education', 'education'), ('Robert Kozak', 'Dean', 'Faculty of Forestry and Environmental Stewardship', 'forestry'), ('Leonard Foster', 'Dean and Vice-Provost pro tem', 'Graduate and Postdoctoral Studies', 'graduate'), ('Amy Charkowski', 'Dean', 'Faculty of Land and Food Systems', 'landfood'), ('Sharmila Anandasabapathy', 'Dean and Vice-President, Health', 'Faculty of Medicine', 'medicine'), ('Lalitha Raman-Wilms', 'Dean', 'Faculty of Pharmaceutical Sciences', 'pharmacy'), ('Darren Dahl', 'Dean', 'Sauder School of Business', 'sauder'), ('Mark MacLachlan', 'Dean', 'Faculty of Science', 'hennings')]
for name,title,department,zone in rows:
 a=next(a for a in doc.find_all('a') if a.get_text(' ',strip=True)==name)
 add(name,title,department,zone,a['href'].replace('http://','https://'),url)
sources.append(dict(url=url,sha256=hashlib.sha256(raw).hexdigest(),records=12,status='Manually checked all twelve dean names and roles; no portraits or contacts retained.'))
Path('projects/ubc/data/faculty.json').write_text(json.dumps(dict(verified='2026-10-31',scope='Core professional directories for Physics & Astronomy and Computer Science, plus 12 Vancouver deans. Not a complete university faculty/staff census.',sources=sources,people=out),ensure_ascii=False,indent=2)+'\n')
print([(s['url'],s['records']) for s in sources]);print('TOTAL',len(out))
