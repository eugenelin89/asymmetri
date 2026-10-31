#!/usr/bin/env python3
"""Import only Stanford names, education and source provenance from supplied research.
Usage: python3 projects/stanford/tools/import_students.py /absolute/path/research.md
Email/contact/photo columns are deliberately excluded before any record is built.
Source review evidence is separate from current-enrollment verification.
"""
import collections,hashlib,json,re,sys,unicodedata
from pathlib import Path
from urllib.parse import urlparse
CHECKED='2026-10-31'
BATCH='supplied-stanford-students-2026-10-31'
ROOT=Path(__file__).resolve().parents[1]/'data'

def normalize_url(url):
    return url.strip().rstrip('/').lower()

def slug(text):
    return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',text).encode('ascii','ignore').decode().lower()).strip('-')

def zone_for(program):
    # Fictional subject-area routing, never a real student's whereabouts.
    p=program.lower()
    if 'business administration' in p:return 'knight'
    if any(x in p for x in ('computer science','computational','symbolic systems','statistics','mathematical')):return 'gates'
    if any(x in p for x in ('electrical','physics')):return 'packard'
    if any(x in p for x in ('medicine','biology','biomedical','biochem','bioengineer','genetic','neuro','epidemiology','immunology','health','physician','laboratory animal','stem cell')):return 'clark'
    if any(x in p for x in ('art history','design')):return 'cantor'
    if any(x in p for x in ('theater','music')):return 'memorial-auditorium'
    if any(x in p for x in ('engineering','oceans','earth','environment','energy','geophysics','materials','chemistry')):return 'huang'
    if any(x in p for x in ('literature','english','linguistics','classics','languages','liberal arts','history')):return 'green-library'
    return 'main-quad'

def main():
    source=Path(sys.argv[1]);raw=source.read_text();rows=[]
    for line in raw.splitlines():
        cells=[c.strip() for c in line.strip('|').split('|')]
        if not cells or cells[0]!='Stanford University' or len(cells)!=7:continue
        # Deliberately never read, retain, log, or serialize cells[5] (contact column).
        links=re.findall(r'\]\((https://[^)]+)\)',cells[6])
        if len(links)!=1:raise ValueError('Expected one public source link in Stanford row')
        rows.append({'name':cells[1]+' '+cells[2],'reportedClassYear':cells[3],'program':cells[4],'url':links[0],'sourceRow':len(rows)+1})
    if len(rows)!=500 or len({normalize_url(r['url']) for r in rows})!=500:raise ValueError('Expected exactly 500 distinct Stanford source rows')
    evidence=json.loads((ROOT/'student-import-verification.json').read_text())['sources']
    evidence_by_url={normalize_url(e['url']):e for e in evidence}
    people=json.loads((ROOT/'people.json').read_text())
    people=[p for p in people if not (p['kind']=='student' and p.get('suppliedResearch',{}).get('batchId')==BATCH)]
    ids={p['id'] for p in people}
    by_url={normalize_url(s['url']):p for p in people for s in p['sources']}
    original_linkedin_ids={p['id'] for p in people if p['kind']=='student' and p.get('sourceAccess')=='public-search-excerpt'}
    audit=[];merged=[];added=[]
    for row in rows:
        ev=evidence_by_url.get(normalize_url(row['url']));host=urlparse(row['url']).hostname
        row=dict(row)
        if ev and ev.get('canonicalName') and ev['canonicalName']!=row['name']:
            row['suppliedName']=row['name'];row['name']=ev['canonicalName']
            row['nameCorrection']=ev['nameCorrection']
        access='user-supplied-public-source-reference'
        if ev:
            access='public-official-student-profile' if ev['sourceAccess']=='public-official-profile-heading' else ev['sourceAccess']
        confirmed_year=bool(ev and ev.get('expectedYearConfirmed') and row['reportedClassYear'])
        class_year_evidence=('independently-inspected-source' if confirmed_year else 'not-corroborated-in-inspected-source' if ev and row['reportedClassYear'] else 'supplied-research-unverified' if row['reportedClassYear'] else 'not-supplied')
        status='supplied-research-unverified'
        if ev:status='source-described-student-not-registrar-verified' if host=='profiles.stanford.edu' else 'unverified-self-report'
        evidence_note=('The official academic profile heading was inspected.' if host=='profiles.stanford.edu' else 'The personal academic page was inspected.' if host=='sherylchenn.github.io' else 'A public LinkedIn search excerpt was inspected; the direct profile request returned HTTP 999.') if ev else 'The source URL and academic details were supplied in the research file; this individual profile was not independently rechecked.'
        year_note=''
        if row['reportedClassYear']:
            year_note=(' The inspected source states expected completion '+row['reportedClassYear']+'.' if confirmed_year else ' The supplied research lists expected completion '+row['reportedClassYear']+'; that year was not corroborated in the inspected source.' if ev else ' The supplied research lists expected completion '+row['reportedClassYear']+'; that year has not been independently rechecked.')
        biography='The supplied research lists '+row['name']+' with Stanford study in '+row['program']+'. '+evidence_note+year_note+' Current enrollment is not registrar-verified; public profiles can be stale.'
        source_label=('Official Stanford student profile' if host=='profiles.stanford.edu' else 'Personal academic portfolio' if host=='sherylchenn.github.io' else 'Public LinkedIn academic profile excerpt')
        metadata={**row,'batchId':BATCH,'researchFile':source.name,'imported':CHECKED,'sourceAccess':access,'sourceReviewStatus':'independently-inspected-academic-evidence' if ev else 'supplied-not-independently-rechecked','classYearEvidence':class_year_evidence,'enrollmentStatus':status}
        existing=by_url.get(normalize_url(row['url']))
        # Explicit cross-source match: same full name AND the rare CS/Data Science
        # dual academic affiliation on the official gymnastics roster and profile.
        if row['name']=='Toma Murakawa':
            existing=next(p for p in people if p['id']=='athlete-5013')
            assert any(t.get('major')=='Computer Science and Data Science' for t in existing['teams'])
            assert ev and ev.get('studentAffiliationObserved')
            metadata['identityEvidence']={'method':'cross-source-name-and-dual-academic-affiliation','rosterPersonId':5013,'rosterAcademicField':'Computer Science and Data Science','officialProfileAffiliations':['Computer Science graduate','Data Science undergraduate'],'profileUrl':row['url'],'note':'Distinctive full name and matching CS/Data Science fields; not merged by name alone.'}
        if existing:
            person=existing
            if not any(normalize_url(s['url'])==normalize_url(row['url']) for s in person['sources']):person['sources'].append({'label':source_label,'url':row['url']})
            person['roles']=sorted(set(person.get('roles',[person['kind']])+['student']))
            person['studentAffiliation']={'program':row['program'],'reportedClassYear':row['reportedClassYear'],'sourceAccess':access,'enrollmentStatus':status,'sourceNote':evidence_note,'biography':biography}
            person['suppliedResearch']=metadata
            merged.append({'row':row['sourceRow'],'name':row['name'],'personId':person['id'],'evidence':metadata.get('identityEvidence','same canonical public source URL')})
        else:
            person_id='student-research-'+slug(row.get('suppliedName',row['name']))
            if person_id in ids:person_id+='-'+hashlib.sha256(row['url'].encode()).hexdigest()[:8]
            ids.add(person_id)
            person={'id':person_id,'name':row['name'],'title':'Student research profile · '+row['program'],'department':row['program'],'kind':'student','zone':zone_for(row['program']),'introduction':'This educational character represents the public student research entry for '+row['name']+'. The listed field of study is '+row['program']+'.','biography':biography,'sources':[{'label':source_label,'url':row['url']}],'verified':CHECKED,'sourceChecked':CHECKED if ev else None,'sourceAccess':access,'enrollmentStatus':status,'affiliationStatus':'student research entry; current enrollment unverified','reportedClassYear':row['reportedClassYear'],'classYearEvidence':metadata['classYearEvidence'],'suppliedResearch':metadata,'sourceNote':evidence_note+' The verified field records research review/import date, not enrollment verification.','disclaimer':'Original fictional avatar using public academic facts only. Appearance, dialogue and route are authored; no real attendance, personal schedule, endorsement or whereabouts is implied.'}
            people.append(person);by_url[normalize_url(row['url'])]=person;added.append(person['id'])
        audit.append({'row':row['sourceRow'],'personId':person['id'],'name':row['name'],'program':row['program'],'reportedClassYear':row['reportedClassYear'],'url':row['url'],'sourceAccess':access,'classYearEvidence':metadata['classYearEvidence'],'sourceReviewStatus':metadata['sourceReviewStatus'],**({'suppliedName':row['suppliedName'],'nameCorrection':row['nameCorrection']} if row.get('suppliedName') else {})})
    assert len({p['id'] for p in people})==len(people)
    assert all(any(p['id']==i for p in people) for i in original_linkedin_ids)
    # No email-like content or contact/photo keys may enter the imported records.
    newdata=json.dumps([p for p in people if p.get('suppliedResearch',{}).get('batchId')==BATCH],ensure_ascii=False)
    assert not re.search(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',newdata)
    sources=json.loads((ROOT/'people-sources.json').read_text())
    students=[p for p in people if p['kind']=='student']
    report={'batchId':BATCH,'sourceFile':source.name,'sourceFileSha256':hashlib.sha256(raw.encode()).hexdigest(),'checked':CHECKED,'suppliedRows':len(rows),'addedIdentities':len(added),'mergedIdentities':merged,'allSuppliedRowsRepresented':True,'officialProfileReferences':sum(urlparse(r['url']).hostname=='profiles.stanford.edu' for r in rows),'directOfficialProfilesInspected':sum(e['sourceAccess']=='public-official-profile-heading' for e in evidence),'personalAcademicPagesInspected':sum(e['sourceAccess']=='public-personal-academic-profile' for e in evidence),'publicSearchExcerptsInspected':sum(e['sourceAccess']=='public-search-excerpt' for e in evidence),'suppliedSourcesNotIndependentlyRechecked':sum(not normalize_url(r['url']) in evidence_by_url for r in rows),'reportedClassYears':sum(bool(r['reportedClassYear']) for r in rows),'classYearsIndependentlyObserved':sum(x['classYearEvidence']=='independently-inspected-source' for x in audit),'registrarVerifiedEnrollments':0,'contactColumnsImported':False,'portraitFieldsImported':False,'sourceAccessDistribution':dict(collections.Counter(x['sourceAccess'] for x in audit)),'rows':audit}
    sources['studentSources']=[s for s in sources.get('studentSources',[]) if s.get('batchId')!=BATCH]+[{'id':r['personId'],'name':r['name'],'source':r['url'],'checked':CHECKED,'sourceAccess':r['sourceAccess'],'program':r['program'],'reportedClassYear':r['reportedClassYear'],'classYearEvidence':r['classYearEvidence'],'batchId':BATCH,'enrollmentStatus':'not-registrar-verified'} for r in audit if any(p['id']==r['personId'] and p['kind']=='student' for p in students)]
    inspected_count=len(rows)-report['suppliedSourcesNotIndependentlyRechecked']
    report['sampleMethod']=('All supplied source references were inspected.' if inspected_count==len(rows) else str(inspected_count)+' of '+str(len(rows))+' supplied source references were independently inspected.')+' Official profile headings, personal academic pages and public LinkedIn excerpts support published academic facts only; current enrollment remains unverified.'
    report['classYearsNotCorroboratedInInspectedSource']=sum(r['classYearEvidence']=='not-corroborated-in-inspected-source' for r in audit)
    report['nameCorrections']=[{'personId':r['personId'],'suppliedName':r['suppliedName'],'canonicalName':r['name'],'source':r['url'],'note':r['nameCorrection']} for r in audit if r.get('suppliedName')]
    report['sourceReviewNotes']=[{'source':e['url'],'note':e['classYearReviewNote']} for e in evidence if e.get('classYearReviewNote')]
    sources['studentCount']=len(students)
    sources['studentAffiliationCountIncludingAthletes']=len(students)+sum(p['kind']!='student' and 'student' in p.get('roles',[]) for p in people)
    sources['studentCoverage']='Original 16 LinkedIn-based characters plus all 500 Stanford rows supplied in the research file. One row merges with a sourced athlete, leaving 515 student-kind characters and one athlete with an additional student affiliation. This is not an enrollment directory.'
    sources['studentAccessPolicy']='Retain only public names, academic fields, source URLs and supplied or observed expected completion years. No email/contact columns, portraits, social reactions, inferred age or actual locations are imported. Direct LinkedIn access remains blocked; only publicly indexed academic excerpts were used.'
    sources['studentEnrollmentPolicy']='All current-enrollment status remains unverified. Source-review status distinguishes the original '+str(len(original_linkedin_ids))+' indexed LinkedIn excerpts, '+str(inspected_count)+' independently inspected supplied references, and '+str(report['suppliedSourcesNotIndependentlyRechecked'])+' supplied references not individually rechecked. The verified field is a source-review or import date, not an enrollment guarantee.'
    sources['studentSourceAccessDistribution']=dict(collections.Counter(p['sourceAccess'] for p in students))
    sources['suppliedStudentImport']=report
    (ROOT/'people.json').write_text(json.dumps(people,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'people-sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'total':len(people),'kindCounts':dict(collections.Counter(p['kind'] for p in people)),'studentAccess':sources['studentSourceAccessDistribution'],'suppliedRows':len(rows),'added':len(added),'merged':len(merged),'classYears':report['reportedClassYears'],'classYearsObserved':report['classYearsIndependentlyObserved']},indent=2))
if __name__=='__main__':main()
