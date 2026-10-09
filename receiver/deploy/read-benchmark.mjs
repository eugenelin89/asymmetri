// Read-only benchmark of the disposable sustained-test archive. No grants or mutations.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {wireHttp,prefix} from '../dist/test/helpers.js';
const samples=[];
for(let round=0;round<12;round++){
 await Promise.all(['events?limit=20','discussions/capacity-topic?limit=20','artifacts?limit=20','artifacts/capacity-artifact-5/versions/10/content'].map(async path=>{const began=performance.now(),r=await wireHttp(13101,'GET',prefix+'/'+path,[['Host','receiver.test']]);assert.equal(r.status,200);samples.push({path,ms:performance.now()-began});}));await delay(250);
}
const v=samples.map(x=>x.ms).sort((a,b)=>a-b),summary={requests:samples.length,p50:v[Math.floor(v.length*.5)],p95:v[Math.floor(v.length*.95)],max:v.at(-1)};await writeFile('/var/lib/inv03-acceptance/read-benchmark.json',JSON.stringify({summary,samples}));console.log(JSON.stringify(summary));
