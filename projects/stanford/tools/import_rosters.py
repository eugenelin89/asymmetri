#!/usr/bin/env python3
"""Import complete public GoStanford roster snapshots; raw HTML stays outside Git.
Usage: python3 projects/stanford/tools/import_rosters.py /tmp/stanford-rosters
No portraits, home towns, previous schools, birth dates or contact data retained.
"""
import concurrent.futures, hashlib, html, json, re, sys, urllib.request
from pathlib import Path
CHECKED='2026-10-31'
BASE='https://gostanford.com'
VENUES={
 'artistic-swimming':'avery','baseball':'sunken-diamond','beach-volleyball':'sand-volleyball',
 'cross-country':'cobb-track','fencing':'squash','field-hockey':'field-hockey','football':'stanford-stadium',
 'lightweight-rowing':'rowing','mens-basketball':'maples','mens-golf':'golf','mens-gymnastics':'burnham',
 'mens-rowing':'rowing','mens-soccer':'cagan','mens-swimming-diving':'avery','mens-tennis':'taube',
 'mens-volleyball':'maples','mens-water-polo':'avery','sailing':'sailing','softball':'softball','squash':'squash',
 'track-field':'cobb-track','womens-basketball':'maples','womens-golf':'golf','womens-gymnastics':'maples',
 'womens-lacrosse':'cagan','womens-rowing':'rowing','womens-soccer':'cagan','womens-swimming-diving':'avery',
 'womens-tennis':'taube','womens-volleyball':'maples','womens-water-polo':'avery','wrestling':'burnham'}
VENUE_SOURCES={
 'stanford-stadium':'https://gostanford.com/facilities/stanford-stadium',
 'sunken-diamond':'https://gostanford.com/facilities/klein-field-at-sunken-diamond',
 'maples':'https://gostanford.com/facilities/maples-pavilion',
 'cobb-track':'https://gostanford.com/facilities/cobb-track-and-angell-field',
 'cagan':'https://gostanford.com/facilities/maloney-field-at-laird-q-cagan-stadium',
 'field-hockey':'https://gostanford.com/facilities/varsity-field-hockey-turf',
 'avery':'https://gostanford.com/facilities/avery-aquatic-center',
 'taube':'https://gostanford.com/taube-family-tennis-center',
 'sand-volleyball':'https://gostanford.com/facilities/beach-volleyball-stadium',
 'golf':'https://gostanford.com/facilities/stanford-golf-course',
 'rowing':'https://gostanford.com/facilities/arrillaga-family-rowing-and-sailing-center',
 'sailing':'https://gostanford.com/facilities/arrillaga-family-rowing-and-sailing-center',
 'softball':'https://gostanford.com/stanford-softball-stadium-1',
 'burnham':'https://gostanford.com/facilities/burnham-pavilion-and-ford-center',
 'ford':'https://gostanford.com/facilities/burnham-pavilion-and-ford-center',
 'squash':'https://gostanford.com/facilities/arrillaga-center-for-sports-and-recreation',
}
NON_NCAA={'artistic-swimming':'USA Artistic Swimming collegiate competition','lightweight-rowing':'Intercollegiate Rowing Association lightweight competition','mens-rowing':'Intercollegiate Rowing Association competition','sailing':'Inter-Collegiate Sailing Association competition','squash':'College Squash Association competition'}

def decode(j,n,memo=None):
    if memo is None:memo={}
    if not isinstance(n,int) or isinstance(n,bool):return n
    if n<0:return None
    if n in memo:return memo[n]
    v=j[n]
    if isinstance(v,dict):
        o={};memo[n]=o;o.update({k:decode(j,z,memo) for k,z in v.items()});return o
    if isinstance(v,list):
        if v and isinstance(v[0], str) and v[0] in ('Reactive','ShallowReactive','Ref','ShallowRef'):
            return decode(j,v[1],memo)
        o=[];memo[n]=o;o.extend(decode(j,z,memo) for z in v);return o
    return v

def clean(s):return ' '.join(html.unescape(re.sub('<[^>]+>',' ',str(s or ''))).split())

def fetch(sport,cache):
    p=cache/(sport+'.html');url=BASE+'/sports/'+sport+'/roster'
    if not p.exists():
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (public university educational reference)'})
        with urllib.request.urlopen(req,timeout=45) as r:p.write_bytes(r.read())
    raw=p.read_text();match=re.search(r'id="__NUXT_DATA__">(.*?)</script>',raw,re.S)
    if not match:raise ValueError('No public Nuxt data')
    j=json.loads(match[1]);state=decode(j,0);data=state['data']
    keys=[k for k in data if re.match(r'roster-\d+-players-list$',k)]
    if len(keys)!=1:raise ValueError('Expected one roster list, got '+str(keys))
    players=data[keys[0]];roster=data['sport-'+sport+'-roster'];name=clean(roster['name']);season=roster['season']['name']
    rendered_names=re.findall(r'class="roster-card-item__title[^\"]*"[^>]*>(.*?)</a>',raw,re.S)
    table_names=re.findall(r'href="(/sports/'+sport+r'/roster/player/[^\"]+)"',raw)
    if not players:raise ValueError('Empty roster')
    if len(players)!=len(set(table_names)):raise ValueError('Rendered player-link count does not match structured roster count')
    records=[]
    for entry in players:
        player=entry['player'];full_name=clean(player['full_name']);position=entry.get('player_position') or {};cl=entry.get('class_level') or {}
        membership={'sport':sport,'team':name,'season':season,'venue':VENUES[sport],'rosterUrl':url,'profileUrl':entry.get('permalink') or BASE+entry['relative_url'],'publicPlayerId':player['id'],'rosterPlayerId':entry['id'],'position':clean(position.get('name')),'class':clean(cl.get('name')),'major':clean(player.get('major')),'jerseyNumber':str(entry.get('jersey_number_label') if entry.get('jersey_number_label') is not None else entry.get('jersey_number') if entry.get('jersey_number') is not None else '')}
        records.append({'name':full_name,'gender':player.get('gender'),'membership':membership})
    return records,{'sport':sport,'team':name,'season':season,'source':url,'checked':CHECKED,'sha256':hashlib.sha256(raw.encode()).hexdigest(),'count':len(records),'athleteIds':['athlete-'+str(r['membership']['publicPlayerId']) for r in records],'publicPlayerIds':[r['membership']['publicPlayerId'] for r in records],'renderedPersonCardCountIncludingStaff':len(rendered_names),'renderedUniquePlayerLinks':len(set(table_names)),'completePublishedRoster':True,'competition':NON_NCAA.get(sport,'NCAA varsity competition'),'venue':VENUES[sport],'venueSource':VENUE_SOURCES[VENUES[sport]],'programCount':2 if sport in ('cross-country','fencing','sailing','track-field') else 1}

def main():
    cache=Path(sys.argv[1]);cache.mkdir(parents=True,exist_ok=True);results=[];errors=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
        jobs={ex.submit(fetch,s,cache):s for s in VENUES}
        for f in concurrent.futures.as_completed(jobs):
            sport=jobs[f]
            try:
                records,coverage=f.result();results.append((records,coverage));print(sport,coverage['season'],coverage['count'],flush=True)
            except Exception as exc:errors.append({'sport':sport,'error':str(exc)});print(sport,'ERROR',exc,flush=True)
    # Never replace a complete published snapshot with a partial failed refresh.
    if errors:
        print(json.dumps({'refreshErrors':errors},indent=2));sys.exit(1)
    by_key={}
    for records,cov in sorted(results,key=lambda r:r[1]['sport']):
        for record in records:
            m=record['membership'];k=m['publicPlayerId']
            # The official stable player ID, not name alone, is the identity key.
            if k not in by_key:by_key[k]={'id':'athlete-'+str(k),'name':record['name'],'teams':[],'gender':record['gender']}
            by_key[k]['teams'].append(m)
    people=[]
    for person in by_key.values():
        teams=person['teams'];primary=next((t for t in teams if t['sport']=='track-field'),teams[0]);team_text='; '.join(t['team'] for t in teams)
        intro='I’m '+person['name']+'. You can find me on Stanford’s published '+team_text+' roster'+('s.' if len(teams)>1 else '.')
        if primary['major']:intro+=' My listed major is '+primary['major']+'.'
        people.append({**person,'title':'Stanford student-athlete · '+team_text,'department':'Stanford Athletics','kind':'athlete','zone':primary['venue'],'introduction':intro,'biography':'Published roster affiliation: '+team_text+'. '+('Listed position/event: '+primary['position']+'. ' if primary['position'] else '')+('Listed class: '+primary['class']+'. ' if primary['class'] else '')+'The roster season is retained exactly as published; this snapshot is not a live eligibility or attendance feed.','sources':[{'label':t['team']+' · Official roster','url':t['rosterUrl']} for t in teams]+[{'label':'Official player profile','url':primary['profileUrl']}],'verified':CHECKED,'sourceAccess':'public-official-roster-structured-and-rendered','uniform':'Stanford','jerseyNumber':primary['jerseyNumber'],'disclaimer':'Original educational avatar, authored introduction and fictional route. Not an actual appearance, quotation, schedule, or location.'})
    root=Path(__file__).resolve().parents[1]/'data';root.mkdir(exist_ok=True)
    # Preserve separately researched faculty, alumni and students during a roster refresh.
    path=root/'people.json';previous=json.loads(path.read_text()) if path.exists() else []
    previous_by_id={p['id']:p for p in previous}
    for person in people:
        old=previous_by_id.get(person['id'],{})
        if old.get('suppliedResearch'):
            for key in ('suppliedResearch','studentAffiliation','roles'):
                if key in old:person[key]=old[key]
            known={s['url'] for s in person['sources']}
            person['sources'].extend(s for s in old['sources'] if s['url'] not in known)
    other=[p for p in previous if p['kind']!='athlete']
    path.write_text(json.dumps(other+people,ensure_ascii=False,indent=2)+'\n')
    report={'checked':CHECKED,'indexSource':'https://gostanford.com/','scope':'Every roster endpoint in the official athletics sports navigation, plus the men’s basketball endpoint. Combined pages retain their complete published mixed-gender roster.','programsRepresented':sum(x[1]['programCount'] for x in results),'programCountSource':'https://facts.stanford.edu/campus-life/cardinal-athletics','programCountNote':'36 varsity programs: the source facts page identifies the 2025–26 total; the current athletics navigation retains all 36. Cross country, fencing, sailing, and track & field each publish one combined roster page.','rosterPages':len(results),'requestedRosterPages':len(VENUES),'rosterMemberships':sum(len(x[0]) for x in results),'uniqueAthletes':len(people),'identityPolicy':'Deduplicate by official stable player ID; never merge people solely because names match.','competitionNote':'Stanford is an NCAA Division I institution. Artistic swimming, sailing, squash, men’s rowing and lightweight rowing are included as Stanford varsity teams but compete under their own collegiate governing bodies, not an NCAA championship in those disciplines.','venueNote':'Venue association indicates a documented Stanford team facility or athletics district, not where an individual is physically present. Cross-country athletes use the track district for the virtual visit; this does not relocate cross-country courses. Indoor programs can compete at more than one venue. Rowing and sailing remain at the actual off-campus center.','availabilityNote':'All imported names are available in the virtual character registry. Rendering uses proximity and crowd limits; no claim of simultaneous attendance is made.','teams':[x[1] for x in sorted(results,key=lambda r:r[1]['sport'])],'errors':errors}
    (root/'roster-coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('TOTAL',len(people),'unique',report['rosterMemberships'],'memberships',len(results),'pages',len(errors),'errors')
    if errors:sys.exit(1)
if __name__=='__main__':main()
