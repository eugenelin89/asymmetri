import test from 'node:test';
import assert from 'node:assert/strict';
import {money,percent,ratio,csv,compareSequence,inRun,displayTime} from '../lib/investment-links.ts';
import {benchmarkDrawdowns,performancePath,performanceSequenceGaps} from '../lib/investment-performance.ts';
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
test('performance lines preserve null and withdrawn sequence gaps without Number rounding',()=>{
 const x=i=>i, y=p=>p;
 assert.equal(performancePath(['1','2','4','5'],['0','0.01','0.02','0.03'],x,y),'M0,0 L1,1 M2,2 L3,3');
 assert.equal(performancePath(['1','2','3'],['0',null,'0.02'],x,y),'M0,0  M2,2');
 assert.equal(performancePath(['999999999999999998','999999999999999999'],['0','0.01'],x,y),'M0,0 L1,1');
 assert.equal(performanceSequenceGaps(['1','2','4','5']),1);
 assert.equal(performanceSequenceGaps(['999999999999999998','999999999999999999']),0);
});
test('evidence clocks retain seconds and milliseconds in explicit UTC',()=>{
 assert.equal(displayTime('2026-10-13T13:30:00.123Z'),'2026-10-13 13:30:00.123 UTC');
 assert.equal(displayTime('2026-10-13T09:30:59.456-04:00'),'2026-10-13 13:30:59.456 UTC');
 assert.equal(displayTime(null),'Unknown');
});
