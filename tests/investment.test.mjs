import test from 'node:test';
import assert from 'node:assert/strict';
import {money,percent,ratio,csv,compareSequence,inRun} from '../lib/investment-links.ts';
import {benchmarkDrawdowns} from '../lib/investment-performance.ts';
test('exact decimal labels preserve cent boundaries beyond Number precision and distinguish null',()=>{
 assert.equal(money('999999999999.994999'),'$999,999,999,999.99');
 assert.equal(money('1.005000'),'$1.00');assert.equal(money('1.015000'),'$1.02');
 assert.equal(money(null),'Unavailable');assert.equal(money('0'),'$0.00');
 assert.equal(percent('-0.008000'),'-0.80%');assert.equal(ratio('200','1000'),'0.200000');assert.equal(ratio(null,'1000'),null);
 assert.equal(compareSequence('999999999999999998','999999999999999999'),-1);
});
test('export neutralizes spreadsheet formulas, quotes multiline data and preserves exact run context',()=>{
 assert.equal(csv([[' =1+1','-1','a"b',null]]),'"\' =1+1","\'-1","a""b","Unavailable"');
 assert.equal(inRun('/x?after=cursor','other-run'),'/x?after=cursor&run=other-run');
});
test('benchmark drawdown refuses missing peaks and incomplete marks',()=>{
 const p=[1,2,3].map((n)=>({valuationSequence:String(n),benchmark:{equity:['1000','1200','900'][n-1]}}));
 assert.deepEqual(benchmarkDrawdowns(p,'1000'),['0.000000','0.000000','-0.250000']);
 assert.deepEqual(benchmarkDrawdowns([p[0],p[2]],'1000'),[null,null]);
 assert.deepEqual(benchmarkDrawdowns(p),[null,null,null]);
 assert.deepEqual(benchmarkDrawdowns([p[0],{...p[1],benchmark:{equity:null}}],'1000'),[null,null]);
});
