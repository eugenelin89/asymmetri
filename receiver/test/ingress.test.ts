import test from 'node:test';
import assert from 'node:assert/strict';
import { connect,createServer } from 'node:net';
import type { TestContext } from 'node:test';
import { createIngress,ingressConfig } from '../src/ingress.js';

async function capture(t:TestContext){
  const values:Buffer[]=[];
  const server=createServer(socket=>{const parts:Buffer[]=[];socket.on('data',part=>{parts.push(part);const bytes=Buffer.concat(parts);if(bytes.includes(Buffer.from('END'))){values.push(bytes);socket.end('HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nOK');}});});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise<void>(resolve=>server.close(()=>resolve())));
  return {port:(server.address() as {port:number}).port,values};
}
async function raw(port:number,bytes:Buffer,fragment=false):Promise<string>{
  return new Promise((resolve,reject)=>{const socket=connect(port,'127.0.0.1');let response='';socket.setTimeout(2000,()=>socket.destroy(new Error('timeout')));
    socket.on('connect',()=>{if(fragment){socket.write(bytes.subarray(0,17));setTimeout(()=>socket.write(bytes.subarray(17)),5);}else socket.write(bytes);});
    socket.on('data',part=>{response+=part.toString();});socket.on('end',()=>resolve(response));socket.on('error',reject);});
}
const proxy='PROXY TCP4 198.51.100.44 203.0.113.44 49152 443\r\n';
test('post-TLS router preserves all signed request bytes and only forwards PROXY to the website',async t=>{
  const site=await capture(t),investment=await capture(t),ask=await capture(t);
  const router=await createIngress(ingressConfig({enabled:true,port:0,websitePort:site.port,investmentPort:investment.port,askPort:ask.port}));t.after(()=>router.close());
  const port=(router.server.address() as {port:number}).port;
  for(const [path,destination] of [['/tutorial',site],['/api/experiments/v1/any',investment],['/api/ask/v1/any',ask]] as const){
    const input=Buffer.from(`POST ${path} HTTP/1.1\r\nHost: receiver.test\r\nConnection: keep-alive\r\nConnection: close\r\nX-Case: UPPER\r\nContent-Length: 3\r\n\r\nEND`);
    assert.match(await raw(port,Buffer.concat([Buffer.from(proxy),input]),true),/200 OK/);
    assert.deepEqual(destination.values[0],path==='/tutorial'?Buffer.concat([Buffer.from(proxy),input]):input);
  }
});
test('post-TLS router requires its trusted preamble and never normalizes invalid targets',async t=>{
  const site=await capture(t),investment=await capture(t),ask=await capture(t);
  const router=await createIngress({enabled:true,port:0,websitePort:site.port,investmentPort:investment.port,askPort:ask.port});t.after(()=>router.close());
  const port=(router.server.address() as {port:number}).port;
  for(const input of ['GET /api/ask/v1/availability HTTP/1.1\r\n\r\nEND',proxy+'GET https://receiver.test/api/ask/v1/availability HTTP/1.1\r\n\r\nEND',proxy+'GET /api/unknown HTTP/1.1\r\n\r\nEND','PROXY TCP4 999.1.1.1 203.0.113.44 12 443\r\nGET / HTTP/1.1\r\n\r\nEND']){
    assert.match(await raw(port,Buffer.from(input)),/400 Bad Request/);
  }
  assert.equal(site.values.length+investment.values.length+ask.values.length,0);
});
