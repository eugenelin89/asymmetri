import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const {characters,answerQuestion}=await import('./registry.ts');
const {mergeStudentRoster,nameKey,studentZone}=await import('./student-roster.ts');
const students=JSON.parse(readFileSync(new URL('./data/students.json',import.meta.url)));

test('all 500 supplied students are represented once with five existing people enriched',()=>{
 const roster=mergeStudentRoster();
 assert.equal(students.length,500);assert.equal(roster.length,528);assert.equal(characters.length,529);
 assert.equal(new Set(roster.map(p=>nameKey(p.name))).size,roster.length);
 for(const s of students){
  const matches=roster.filter(p=>nameKey(p.name)===nameKey(s.name));assert.equal(matches.length,1);
  assert.equal(matches[0].program,s.program);assert(matches[0].sources.some(x=>x.url===s.source));
  assert(s.nameRechecked,`${s.name}: a public university source must corroborate the name`);
  if(s.corroboratingSource) assert(matches[0].sources.some(x=>x.url===s.corroboratingSource));
 }
 assert.equal(roster.filter(p=>p.name==='Dhruv Amin').length,1);
 assert.equal(roster.find(p=>p.name==='Dhruv Amin').id,'dhruv-amin');
 assert.equal(roster.find(p=>p.name==='Avery Basinger').kind,'athlete');
});

test('source-linked students have natural study replies, fictional looks and no contact fields',()=>{
 assert(!JSON.stringify(students).includes('@'));
 assert(students.every(s=>!('email' in s)&&!('portrait' in s)&&new URL(s.source).hostname.endsWith('case.edu')));
 const all=characters.filter(c=>students.some(s=>nameKey(s.name)===nameKey(c.name)));
 for(const c of all){
  const reply=answerQuestion(c,'What is your major?');assert(reply?.answer.toLowerCase().includes(c.department.toLowerCase()) || (c.department==='Undecided' && /exploring|undecided/i.test(reply?.answer||'')), c.name);
  assert.equal(answerQuestion(c,'What is your private schedule?'),null);
  assert(c.appearance);assert.match(c.status,/unverified|unconfirmed/);
 }
 assert(new Set(all.map(c=>JSON.stringify(c.appearance))).size>30);
 assert.equal(studentZone('Nursing'),'nursing');assert.equal(studentZone('Finance'),'peter-lewis');
 assert.equal(studentZone('Applied Mathematics'),'strosacker');assert.equal(studentZone('Clinical Psychology'),'mather-house');
});

test('research importer drops the email column and rejects duplicate names',()=>{
 const dir=mkdtempSync(join(tmpdir(),'cwru-student-import-'));
 try{
  const lines=Array.from({length:500},(_,i)=>`| Case Western Reserve University (CWRU) | Student | ${i} | | Chemistry | private${i}@example.invalid | [Source](https://chemistry.case.edu/people/graduate-students/) |`);
  const input=join(dir,'research.md'),audit=join(dir,'audit.json'),output=join(dir,'out');
  writeFileSync(input,lines.join('\n'));writeFileSync(audit,JSON.stringify([{url:'https://chemistry.case.edu/people/graduate-students/',status:0,corroboratingSource:'https://case.edu/roster',matches:[{name:'Student 0',nameFound:false,programFound:false,fallbackNameFound:true}]}]));
  const args=[new URL('./tools/import_students.py',import.meta.url).pathname,input,'--audit',audit,'--output-dir',output];
  let result=spawnSync('python3',args,{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const text=readFileSync(join(output,'students.json'),'utf8');assert(!text.includes('@'));assert.equal(JSON.parse(text).length,500);
  const first=JSON.parse(text)[0];assert(first.nameRechecked);assert.equal(first.programRechecked,false);assert.equal(first.corroboratingSource,'https://case.edu/roster');
  writeFileSync(input,[...lines.slice(0,-1),lines[0]].join('\n'));
  result=spawnSync('python3',args,{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Duplicate student name/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
