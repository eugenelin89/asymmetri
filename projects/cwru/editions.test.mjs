import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const {activeEdition,scheduledEdition,readEditionChoice,serializeEditionChoice}=await import('./editions.ts');
const {setHalloween,defaults}=await import('./environment.ts');
test('automatic themes start and end on Cleveland dates, including an already open session',()=>{
 assert.equal(activeEdition('automatic',new Date('2026-10-24T03:59:59Z')),'regular');
 assert.equal(activeEdition('automatic',new Date('2026-10-24T04:00:00Z')),'halloween');
 assert.equal(activeEdition('automatic',new Date('2026-11-08T04:59:59Z')),'halloween');
 assert.equal(activeEdition('automatic',new Date('2026-11-08T05:00:00Z')),'regular');
 assert.equal(activeEdition('automatic',new Date('2027-10-24T04:00:00Z')),'halloween');
 assert.equal(activeEdition('automatic',new Date('2027-11-08T05:00:00Z')),'regular');
});
test('manual regular and Halloween choices survive reload and ignore the automatic calendar',()=>{
 for(const choice of ['automatic','regular','halloween'])assert.equal(readEditionChoice(serializeEditionChoice(choice)),choice);
 assert.equal(activeEdition('regular',new Date('2026-10-31T20:00:00Z')),'regular');
 assert.equal(activeEdition('halloween',new Date('2026-12-25T20:00:00Z')),'halloween');
 assert.equal(readEditionChoice('{bad'), 'automatic');
 assert.equal(readEditionChoice({version:1,choice:'__proto__'}),'automatic');
 assert.equal(readEditionChoice(null,{year:2026,enabled:false},new Date('2026-10-31T12:00:00Z')),'regular');
});
test('season end restores normal atmosphere without resetting gameplay settings',()=>{
 const before={...defaults,hour:10,season:'summer',weather:'rain',quality:'low',population:false,reducedMotion:true};
 const on=setHalloween(before,true);const off=setHalloween(on.settings,false,on.previous);
 assert.deepEqual(off.settings,before);
});

test('Christmas reserves all of December but does not select an unavailable visual theme',()=>{
 assert.equal(scheduledEdition(new Date('2026-12-01T04:59:59Z')),'regular');
 assert.equal(scheduledEdition(new Date('2026-12-01T05:00:00Z')),'christmas');
 assert.equal(scheduledEdition(new Date('2027-01-01T04:59:59Z')),'christmas');
 assert.equal(scheduledEdition(new Date('2027-01-01T05:00:00Z')),'regular');
 assert.equal(activeEdition('automatic',new Date('2026-12-25T12:00:00Z')),'regular');
});
