import test from 'node:test';
import {createServer} from 'node:http';
import {investmentReadHeaders,investmentArchiveFetch} from '../lib/investment-read-transport.ts';
import assert from 'node:assert/strict';
import {money,percent,ratio,csv,compareSequence,inRun,displayTime,artifactHref,recordHref} from '../lib/investment-links.ts';
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

test('archive authority override is explicit, server-owned and restricted to loopback',async t=>{
 const server=createServer((req,res)=>{res.end(req.headers.host);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 const url=`http://127.0.0.1:${server.address().port}/api/experiments/v1/status`;
 const response=await investmentArchiveFetch(url,5000,1024,'asymmetri.co');
 assert.equal(await response.text(),'asymmetri.co');
 for(const authority of ['','asymmetri.co\r\nForwarded: attacker','https://asymmetri.co','asymmetri.co@evil.test','asymmetri.co:65536']) assert.throws(()=>investmentReadHeaders(url,authority));
 assert.throws(()=>investmentReadHeaders('https://evil.test/archive','asymmetri.co'));
 assert.throws(()=>investmentReadHeaders('http://user@127.0.0.1/archive','asymmetri.co'));
});

test('Trade links preserve exact artifact versions, record identities and retained runs',()=>{
 assert.equal(artifactHref('artifact-1',3,'retained-run'),'/botsquad/trade/artifacts/artifact-1/versions/3?run=retained-run');
 assert.equal(recordHref({kind:'discussion',id:'discussion-1',version:1,relation:'supports'},'retained-run'),'/botsquad/trade/discussions/discussion-1?run=retained-run');
 assert.equal(recordHref({kind:'valuation',id:'valuation-1',version:2,relation:'supports'},'retained-run'),'/botsquad/trade/records/valuation/valuation-1/versions/2?run=retained-run');
});
