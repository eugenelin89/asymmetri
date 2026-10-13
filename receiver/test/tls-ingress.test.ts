import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,readFile,rm,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { connect as connectTcp,createServer } from 'node:net';
import { connect as connectTls } from 'node:tls';
import { createTlsIngress,tlsIngressConfig } from '../src/tls-ingress.js';
const proxy='PROXY TCP4 198.51.100.44 203.0.113.44 49152 443\r\n';
test('apex TLS bridge preserves trusted client preamble, ALPN policy and raw HTTP across reload',async t=>{
  const root=await mkdtemp(join(tmpdir(),'asymmetri-tls-bridge-')),cert=join(root,'cert.pem'),key=join(root,'key.pem');
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1','-subj','/CN=receiver.test','-addext','subjectAltName=DNS:receiver.test'],{stdio:'ignore'});
  const certificate=await readFile(cert),privateKey=await readFile(key),captured:Buffer[]=[];
  let trusted=certificate,clock=Date.now();
  const backend=createServer(socket=>{const parts:Buffer[]=[];socket.on('data',part=>{parts.push(part);const bytes=Buffer.concat(parts);if(bytes.includes(Buffer.from('END'))){captured.push(bytes);socket.end('HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nOK');}});});
  await new Promise<void>(resolve=>backend.listen(0,'127.0.0.1',resolve));
  const service=await createTlsIngress(tlsIngressConfig({enabled:true,port:0,upstreamPort:(backend.address() as {port:number}).port,servername:'receiver.test',certificatePath:cert,privateKeyPath:key}),()=>clock);
  t.after(async()=>{await service.close();await new Promise<void>(resolve=>backend.close(()=>resolve()));await rm(root,{recursive:true,force:true});});
  const request='POST /api/ask/v1/any HTTP/1.1\r\nHost: receiver.test\r\nConnection: close\r\nConnection: close\r\nContent-Length: 3\r\n\r\nEND';
  const send=(alpn=['http/1.1'],name='receiver.test',fragment=false)=>new Promise<string>((resolve,reject)=>{
    const raw=connectTcp((service.server.address() as {port:number}).port,'127.0.0.1');raw.setTimeout(3000,()=>raw.destroy(new Error('timeout')));raw.on('error',reject);
    raw.on('connect',()=>{
      const handshake=()=>{const socket=connectTls({socket:raw,servername:name,ca:trusted,ALPNProtocols:alpn});let response='';socket.on('secureConnect',()=>socket.write(request));socket.on('data',part=>{response+=part.toString();});socket.on('end',()=>response?resolve(response):reject(new Error('TLS closed without an HTTP response.')));socket.on('error',reject);};
      if(fragment){raw.write(proxy.slice(0,17));setTimeout(()=>{raw.write(proxy.slice(17));handshake();},5);}else{raw.write(proxy);handshake();}
    });
  });
  assert.match(await send(['h2','http/1.1'],'receiver.test',true),/200 OK/);
  assert.deepEqual(captured[0],Buffer.from(proxy+request));
  await assert.rejects(send(['h2']));await assert.rejects(send(['http/1.1'],'wrong.test'));
  assert.match(await send([]),/200 OK/);
  await writeFile(cert,'invalid');assert.throws(()=>service.reload());assert.match(await send(),/200 OK/);
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1','-subj','/CN=wrong.test','-addext','subjectAltName=DNS:wrong.test'],{stdio:'ignore'});
  assert.throws(()=>service.reload());assert.match(await send(),/200 OK/);
  await writeFile(cert,certificate);await writeFile(key,privateKey);service.reload();assert.match(await send(),/200 OK/);
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1','-subj','/CN=receiver.test','-addext','subjectAltName=DNS:receiver.test'],{stdio:'ignore'});
  trusted=await readFile(cert);assert.notDeepEqual(trusted,certificate);service.reload();assert.match(await send(),/200 OK/);
  let rejected=0;
  for(let i=0;i<65;i++){try{await send();}catch{rejected++;}}
  assert.ok(rejected>0,'completed TLS handshakes still consume the aggregate rate budget');
  clock+=2000;assert.match(await send(),/200 OK/);
});
