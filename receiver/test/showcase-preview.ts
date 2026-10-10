/** Explicit local-only launcher: fresh temp directory; no production/config argument. */
import { harness } from './helpers.js';
import { Controls } from '../src/controls.js';
import { showcaseFixture } from './showcase-fixture.js';
import type { TestContext } from 'node:test';
import type { EventBatch } from '../vendor/investment/v1/types.js';
const cleanup: (()=>Promise<void>)[]=[];
const h=await harness({after:(fn:()=>Promise<void>)=>cleanup.push(fn)} as unknown as TestContext);
try {
  h.setClock(Math.floor(Date.parse('2026-01-21T00:00:00Z')/1000));
  h.scope.keyId='showcase-ephemeral-key';h.key.notBefore=h.now()-3600;h.key.notAfter=h.now()+86400;
  h.receiver.db.authorize(h.scope,h.key,'2026-01-21T00:00:00Z');
  const fixture=showcaseFixture();
  if(process.argv[2]!=='--empty'){
    for(const c of fixture.content){const result=await h.send(h.signed('PUT','/api/experiments/v1/experiments/fixture-experiment/runs/fixture-run/content/'+c.sha256,Buffer.from(c.text),'showcase-upload-'+c.sha256.slice(0,8),c.contentType));if(result.status!==201)throw Error('Synthetic upload rejected: '+result.raw);}
    for(let i=0;i<fixture.batch.events.length;i+=50){const result=await h.batch({...fixture.batch,batchId:`showcase-batch-${i}`,events:fixture.batch.events.slice(i,i+50) as EventBatch['events']});if(result.status!==201)throw Error('Synthetic batch rejected: '+result.raw);}
  }
  // HTTP authority is fixed by the test harness. A read-only local adapter preserves it.
  const {createServer,request}=await import('node:http');
  const receiverPort=(h.receiver.server.address() as {port:number}).port;
  let offline=false,failEvents=false;
  const proxy=createServer((req,res)=>{
    if(offline||failEvents&&req.url?.includes('/events')){res.writeHead(503);res.end();return;}
    if(req.method!=='GET'||!/^\/api\/experiments\/v1\/experiments\/fixture-experiment(?:[/?]|$)/.test(req.url??'')){res.writeHead(405);res.end();return;}
    const outgoing=request({host:'127.0.0.1',port:receiverPort,path:req.url,method:'GET',headers:{Host:'receiver.test'},agent:false},response=>{res.writeHead(response.statusCode??503,response.headers);response.pipe(res);});outgoing.on('error',()=>{res.writeHead(503);res.end();});outgoing.end();
  });
  await new Promise<void>(resolve=>proxy.listen(4318,'127.0.0.1',resolve));
  // Prevent any further signed publishing while this preview is open.
  if(process.argv.includes('--stale'))h.setClock(h.now()+86400*4);
  h.scope.enabled=false;h.receiver.db.authorize(h.scope,h.key,'2026-01-21T00:00:00Z');
  for(const key of h.receiver.db.all<{key_id:string}>('SELECT key_id FROM publisher_keys'))h.receiver.db.revokeKey(key.key_id,'2026-01-21T00:00:00Z');
  let exercise=1000;
  process.stdin.on('data',async input=>{
    const command=String(input).trim();
    if(command==='offline'){offline=true;console.log('Local fault enabled.');}
    if(command==='online'){offline=false;failEvents=false;console.log('Local fault cleared.');}
    if(command==='fail-events'){failEvents=true;console.log('Local event-read fault enabled.');}
    if(command==='withdraw'){new Controls(h.receiver.db).registry('fixture-experiment','fixture-run','fixture-artifact','withdrawn','2026-01-25T00:00:00Z');console.log('Local artifact withdrawn.');}
    if(command==='reset'){h.setClock(h.now()+901);console.log('Local cursors expired.');}
    if(command==='append'){
      const event=structuredClone(fixture.batch.events.find(e=>e.type==='worker.activity')!);
      if(event.type!=='worker.activity')return;
      event.eventId='exercise-'+exercise;event.sourceSequence=String(exercise++);event.payload.activityId=event.eventId;event.payload.summary='Synthetic appended update for following and unread testing.';
      h.scope.enabled=true;h.scope.keyId=event.eventId+'-key';h.key.notBefore=h.now()-1;h.key.notAfter=h.now()+120;
      h.receiver.db.authorize(h.scope,h.key,'2026-01-25T00:00:00Z');
      try{const result=await h.batch({...fixture.batch,batchId:event.eventId,events:[event]});console.log('Local append status '+result.status);}
      finally{h.scope.enabled=false;h.receiver.db.authorize(h.scope,h.key,'2026-01-25T00:00:00Z');h.receiver.db.revokeKey(h.scope.keyId,'2026-01-25T00:00:00Z');}
    }
  });
  console.log('Synthetic local read preview ready at http://127.0.0.1:4318; no operational state.');
  const stop=async()=>{proxy.close();for(const fn of cleanup)await fn();process.exit(0);};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(error){for(const fn of cleanup)await fn();throw error;}
