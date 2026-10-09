// Explicit Linux acceptance only: node --test deploy/nginx-acceptance.test.mjs from built receiver/.
// Starts a disposable non-root nginx; never reads/modifies production nginx config.
import test from 'node:test';
import assert from 'node:assert/strict';
import { connect as connectTls } from 'node:tls';
import { execFileSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, connect } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { harness, golden, prefix, encode, clone } from '../dist/test/helpers.js';

async function unusedPort() {
  const server = createServer();
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve)); return port;
}
let tlsOptions;
async function raw(port, method, path, headers, body = Buffer.alloc(0), allowEmpty = false, version='1.1', fragmented=false) {
  return new Promise((resolve, reject) => {
    const socket = tlsOptions?connectTls({host:'127.0.0.1',port,...tlsOptions}):connect(port, '127.0.0.1'); let response = '';
    socket.setTimeout(18000, () => socket.destroy(new Error('acceptance timeout')));
    socket.on(tlsOptions?'secureConnect':'connect', () => {const request=Buffer.concat([
      Buffer.from(`${method} ${path} HTTP/${version}\r\n${headers.map(([k,v]) => `${k}: ${v}`).join('\r\n')}\r\n\r\n`), body
    ]);if(fragmented){socket.write(request.subarray(0,17));setTimeout(()=>socket.write(request.subarray(17)),20);}else socket.write(request);});
    socket.on('data', chunk => { response += chunk.toString(); });
    socket.on('error', reject);
    socket.on('end', () => {
      const status = Number(/^HTTP\/1.1 (\d+)/.exec(response)?.[1]);
      if (!status && !allowEmpty) return reject(new Error('no final HTTP status'));
      const payload = response.split('\r\n\r\n').slice(1).join('\r\n\r\n');
      resolve({status, response, payload,alpn:socket.alpnProtocol,protocol:socket.getProtocol?.()});
    });
  });
}

test('actual isolated nginx transport preserves signatures and rejects ambiguous requests', async t => {
  assert.equal(process.platform, 'linux', 'run this explicit acceptance command on Linux');
  assert.notEqual(process.getuid(), 0, 'nginx acceptance must run non-root');
  const h = await harness(t), directory = await mkdtemp(join(tmpdir(), 'infra02-nginx-'));
  const port = await unusedPort(), upstream = h.receiver.server.address().port;
  const config = join(directory, 'nginx.conf');
  const mode=process.env.INFRA02_NGINX_MODE ?? 'stream';
  assert.ok(['stream','tls','http'].includes(mode));
  // HTTP mode intentionally retains the failed 1.22 duplicate-Connection regression.
  const httpConfig=`daemon off;
master_process off;
worker_processes 1;
pid ${directory}/nginx.pid;
error_log ${directory}/error.log warn;
events { worker_connections 64; }
http {
  access_log off;
  client_body_temp_path ${directory}/body;
  proxy_temp_path ${directory}/proxy;
  fastcgi_temp_path ${directory}/fastcgi;
  uwsgi_temp_path ${directory}/uwsgi;
  scgi_temp_path ${directory}/scgi;
  client_max_body_size 4m;
  client_body_timeout 5s;
  client_header_timeout 5s;
  keepalive_timeout 2s;
  server {
    listen 127.0.0.1:${port};
    server_name receiver.test;
    add_header Cache-Control "private, no-store" always;
    if ($http_host != "receiver.test") { return 400; }
    if ($request ~ "^[A-Z]+ https?://") { return 400; }
    if ($http_transfer_encoding != "") { return 400; }
    if ($http_content_encoding != "") { return 400; }
    if ($http_expect != "") { return 400; }
    if ($http_trailer != "") { return 400; }
    if ($http_connection !~ "^(close|keep-alive)?$") { return 400; }
    location / {
      proxy_pass http://127.0.0.1:${upstream};
      proxy_http_version 1.1;
      proxy_set_header Host $http_host;
      proxy_set_header Connection close;
      proxy_connect_timeout 2s;
      proxy_read_timeout 15s;
      proxy_send_timeout 15s;
      proxy_request_buffering on;
      proxy_buffering off;
      proxy_next_upstream off;
    }
  }
}
`;
  const streamConfig=`load_module /usr/lib/nginx/modules/ngx_stream_module.so;
daemon off;
master_process off;
worker_processes 1;
pid ${directory}/nginx.pid;
error_log ${directory}/error.log warn;
events { worker_connections 64; }
stream {
  server {
    listen 127.0.0.1:${port};
    proxy_pass 127.0.0.1:${upstream};
    proxy_connect_timeout 2s;
    proxy_timeout 5s;
  }
}
`;
  let selected=mode==='http'?httpConfig:streamConfig;
  if(mode==='tls'){
    const tlsPort=await unusedPort(),sitePort=await unusedPort();
    const cert=join(directory,'test.crt'),key=join(directory,'test.key');
    execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1','-subj','/CN=receiver.test','-addext','subjectAltName=DNS:receiver.test,DNS:website.test'],{stdio:'ignore'});
    tlsOptions={servername:'receiver.test',ca:await readFile(cert),rejectUnauthorized:true,ALPNProtocols:['http/1.1']};
    selected=`load_module /usr/lib/nginx/modules/ngx_stream_module.so;
daemon off; master_process off; worker_processes 1;
pid ${directory}/nginx.pid; error_log ${directory}/error.log warn;
events { worker_connections 128; }
stream {
 map $ssl_preread_server_name $destination { receiver.test 127.0.0.1:${tlsPort}; default 127.0.0.1:${sitePort}; }
 server { listen 127.0.0.1:${port}; ssl_preread on; proxy_pass $destination; proxy_connect_timeout 2s; proxy_timeout 5s; }
 server {
  listen 127.0.0.1:${tlsPort} ssl;
  ssl_protocols TLSv1.2 TLSv1.3; ssl_alpn http/1.1;
  ssl_certificate ${cert}; ssl_certificate_key ${key}; ssl_handshake_timeout 5s;
  proxy_pass 127.0.0.1:${upstream}; proxy_connect_timeout 2s; proxy_timeout 5s;
 }
}
http {
 access_log off; client_body_temp_path ${directory}/body;
 proxy_temp_path ${directory}/proxy; fastcgi_temp_path ${directory}/fastcgi;
 uwsgi_temp_path ${directory}/uwsgi; scgi_temp_path ${directory}/scgi;
 server {listen 127.0.0.1:${sitePort} ssl; server_name website.test;
 ssl_certificate ${cert}; ssl_certificate_key ${key}; ssl_protocols TLSv1.2 TLSv1.3;
 location / {return 200 'SYNTHETIC ordinary website preserved';}}
}
`;
  }
  await writeFile(config,selected,{mode:0o600});
  console.log(JSON.stringify({proxyMode:mode,loopback:true}));
  const nginx = spawn(process.env.NGINX_BINARY ?? '/usr/sbin/nginx', ['-p', directory+'/', '-c', config], {stdio:['ignore','ignore','pipe']});
  let stderr=''; nginx.stderr.on('data', x => {stderr += x.toString();});
  const exited=once(nginx,'exit');
  t.after(async () => {if(nginx.exitCode===null)nginx.kill('SIGTERM');await exited;await rm(directory,{recursive:true,force:true});});
  let ready=false;
  for(let n=0;n<100;n++) {
    if(nginx.exitCode!==null)throw new Error('nginx start failed: '+stderr);
    try {await raw(port,'GET',prefix+'/status',[['Host','receiver.test'],['Connection','close']]);ready=true;break;}catch {await delay(50);}
  }
  assert.ok(ready,'isolated proxy started');
  if(mode==='tls'){
    const original=tlsOptions;
    for(const version of ['TLSv1.2','TLSv1.3'])await t.test('verified '+version,async()=>{
      tlsOptions={...original,minVersion:version,maxVersion:version};const result=await raw(port,'GET',prefix+'/status',[['Host','receiver.test']]);assert.equal(result.status,404);assert.equal(result.protocol,version);assert.equal(result.alpn,'http/1.1');
    });
    tlsOptions={...original,ALPNProtocols:['h2','http/1.1']};
    const mixed=await raw(port,'GET',prefix+'/status',[['Host','receiver.test']]);assert.equal(mixed.status,404);assert.equal(mixed.alpn,'http/1.1');
    await t.test('h2-only is rejected without downgrade',async()=>{tlsOptions={...original,ALPNProtocols:['h2']};await assert.rejects(raw(port,'GET',prefix+'/status',[['Host','receiver.test']]));});
    await t.test('untrusted certificate rejected',async()=>{tlsOptions={...original,ca:undefined};await assert.rejects(raw(port,'GET',prefix+'/status',[['Host','receiver.test']]));});
    await t.test('wrong TLS hostname rejected',async()=>{tlsOptions={...original,servername:'untrusted.test'};await assert.rejects(raw(port,'GET',prefix+'/status',[['Host','receiver.test']]));});
    await t.test('default SNI preserves separate ordinary site',async()=>{tlsOptions={...original,servername:'website.test'};const result=await raw(port,'GET','/',[['Host','website.test'],['Connection','close']]);assert.equal(result.status,200);assert.match(result.payload,/ordinary website preserved/);});
    await t.test('no ALPN still requires strict HTTP1.1',async()=>{tlsOptions={...original,ALPNProtocols:[]};assert.equal((await raw(port,'GET',prefix+'/status',[['Host','receiver.test']])).status,404);});
    await t.test('plaintext cannot enter TLS ingress',async()=>{tlsOptions=undefined;const result=await raw(port,'GET',prefix+'/status',[['Host','receiver.test']],Buffer.alloc(0),true);assert.ok(!result.status||result.status>=400);});
    tlsOptions=original;
    await t.test('fragmented TLS request remains unambiguous',async()=>{const result=await raw(port,'GET',prefix+'/status',[['Host','receiver.test']],Buffer.alloc(0),false,'1.1',true);assert.equal(result.status,404);});
  }
  const message = () => h.signed('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId);
  const headers = m => [['Host','receiver.test'],...m.headers,['Content-Length',String(m.body.length)],['Connection','close']];
  const send = (m, pairs=headers(m), path=m.path, method=m.method, body=m.body) => raw(port,method,path,pairs,Buffer.from(body));
  const deny = async (name, fn) => t.test(name, async () => {
    const count=h.receiver.db.get('SELECT count(*) n FROM events').n;
    const result=await fn();assert.ok(result.status>=400&&result.status<500, `${name}: HTTP ${result.status}`);
    assert.match(result.response,/no-store/i);
    assert.equal(h.receiver.db.get('SELECT count(*) n FROM events').n,count);
  });
  for(const content of golden.content) {
    const m=h.signed('PUT',prefix+'/content/'+content.sha256,Buffer.from(content.text),'proxy-upload-'+content.sha256.slice(0,12),content.contentType);
    assert.equal((await send(m)).status,201);
  }
  const first=await send(message()); assert.equal(first.status,201);
  const receipt=JSON.parse(first.payload);
  const retry=await send(message()); assert.equal(retry.status,200);assert.deepEqual(JSON.parse(retry.payload),receipt);
  const signedReceipt=await send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId));assert.equal(signedReceipt.status,200);assert.deepEqual(JSON.parse(signedReceipt.payload),receipt);
  await deny('HTTP1.0 rejected',()=>raw(port,'GET',prefix+'/status',[['Host','receiver.test']],Buffer.alloc(0),false,'1.0'));
  await deny('Connection signed-header nomination',()=>raw(port,'GET',prefix+'/status',[['Host','receiver.test'],['Connection','signature, close']]));
  await deny('unsigned receipt',()=>raw(port,'GET',prefix+'/receipts/'+golden.batch.batchId,[['Host','receiver.test'],['Connection','close']]));
  await deny('missing signature',()=>{const m=message();return send(m,headers(m).filter(([k])=>k!=='signature'));});
  await deny('invalid signature',()=>{const m=message();return send(m,headers(m).map(([k,v])=>[k,k==='signature'?'sig1=:'+Buffer.alloc(64).toString('base64')+':':v]));});
  await deny('body changed',()=>{const m=message(),b=Buffer.from(m.body);b[b.length-2]^=1;return send(m,headers(m),m.path,m.method,b);});
  await deny('digest changed',()=>{const m=message();return send(m,headers(m).map(([k,v])=>[k,k==='content-digest'?'sha-256=:'+Buffer.alloc(32).toString('base64')+':':v]));});
  await deny('authority changed',()=>{const m=message();return send(m,headers(m).map(([k,v])=>[k,k==='Host'?'other.test':v]));});
  await deny('path changed',()=>{const m=message();return send(m,headers(m),prefix+'/heartbeat');});
  await deny('method changed',()=>{const m=message();return send(m,headers(m),m.path,'PUT');});
  await deny('stale generation',()=>send(h.signed('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId,'application/json','2')));
  const replay=message();assert.equal((await send(replay)).status,200);await deny('nonce replay',()=>send(replay));
  const expired=message(),originalClock=h.now();h.setClock(originalClock+181);try {await deny('expired signature',()=>send(expired));} finally {h.setClock(originalClock);}
  await deny('wrong run',()=>send(h.signed('POST',prefix.replace('fixture-run','wrong-run')+'/events',encode(golden.batch),golden.batch.batchId)));
  for(const name of ['Host','Content-Length','content-type','content-digest','signature','signature-input','botsquad-generation','idempotency-key','Connection']) {
    await deny('duplicate '+name,()=>{const m=message(),pairs=headers(m),v=pairs.find(([k])=>k.toLowerCase()===name.toLowerCase())[1];return send(m,[...pairs,[name.toUpperCase(),v]]);});
  }
  for(const [name,value] of [['Transfer-Encoding','chunked'],['Content-Encoding','gzip'],['Expect','100-continue'],['Trailer','Content-Digest'],['Forwarded','host=receiver.test'],['X-Forwarded-Host','receiver.test'],['X-Forwarded-Arbitrary','spoofed']]) {
    await deny('forbidden '+name,()=>{const m=message();return send(m,[...headers(m),[name,value]]);});
  }
  await deny('chunked without length',()=>{const m=message();return send(m,[...headers(m).filter(([k])=>k!=='Content-Length'),['Transfer-Encoding','chunked']],m.path,m.method,Buffer.from('0\r\n\r\n'));});
  await t.test('incomplete body closes within configured timeout without a commit',async()=>{
    const m=message(),count=h.receiver.db.get('SELECT count(*) n FROM events').n,start=Date.now();
    const result=await raw(port,m.method,m.path,headers(m).map(([k,v])=>[k,k==='Content-Length'?String(m.body.length+1):v]),Buffer.from(m.body),true);
    assert.ok(!result.status || result.status===408);assert.ok(Date.now()-start>=4500 && Date.now()-start<8000);
    assert.equal(h.receiver.db.get('SELECT count(*) n FROM events').n,count);
  });
  await deny('TE before CL',()=>{const m=message();return send(m,[['Transfer-Encoding','chunked'],...headers(m)]);});
  for(const method of ['CONNECT','GET'])await t.test(method+' tunnel or Upgrade denied',async()=>{const result=await raw(port,method,prefix+'/status',[['Host','receiver.test'],['Connection','upgrade'],['Upgrade','websocket']],Buffer.alloc(0),true);assert.ok(!result.status||result.status>=400);});
  await deny('invalid length',()=>{const m=message();return send(m,headers(m).map(([k,v])=>[k,k==='Content-Length'?'nonsense':v]));});
  for(const path of [prefix+'/events?unexpected=1',prefix+'/ev%65nts',prefix+'/../events',prefix+'//events','http://receiver.test'+prefix+'/events']) {
    await deny('noncanonical target '+path,()=>{const m=message();return send(m,headers(m),path);});
  }
  await deny('maximum body ceiling',()=>{const m=message();return send(m,headers(m).map(([k,v])=>[k,k==='Content-Length'?'4194305':v]),m.path,m.method,Buffer.alloc(0));});
  await deny('receiver event ceiling',()=>{const m=message(),body=Buffer.alloc(1048577,32);return send(m,headers(m).map(([k,v])=>[k,k==='Content-Length'?String(body.length):v]),m.path,m.method,body);});
  await deny('conflicting retry',()=>{const batch=clone(golden.batch);batch.events.pop();return send(h.signed('POST',prefix+'/events',encode(batch),batch.batchId));});
  const concurrent=await Promise.all([send(message()),send(message())]);assert.deepEqual(concurrent.map(r=>r.status),[200,200]);for(const r of concurrent)assert.deepEqual(JSON.parse(r.payload),receipt);
  assert.equal(h.receiver.db.get('SELECT count(*) n FROM events').n,27);
  // Distinct signed sentinels detect hidden second requests, including nonce/quota effects.
  const tables=['events','batches','nonces','quotas','heartbeats','request_receipts','content_objects','staged_content'];
  for(const extra of [['Connection','keep-alive'],['Host','receiver.test'],['Content-Length','1'],['Transfer-Encoding','chunked'],['Expect','100-continue'],['Expect','unsupported']])await t.test('pipeline fence '+extra[0]+' '+extra[1],async()=>{
    const first=message(),sentinel=h.signed('GET',prefix+'/receipts/'+golden.batch.batchId);
    const before=JSON.stringify(tables.map(name=>h.receiver.db.all('SELECT * FROM '+name)));
    const second=Buffer.from(`GET ${sentinel.path} HTTP/1.1\r\nHost: receiver.test\r\n${sentinel.headers.map(([k,v])=>`${k}: ${v}`).join('\r\n')}\r\n\r\n`);
    try{await raw(port,first.method,first.path,[...headers(first).map(([k,v])=>[k,k==='Connection'?'keep-alive':v]),extra],Buffer.concat([first.body,second]),true);}catch(e){assert.match(String(e),/reset|closed|socket|hang up/i);}
    await delay(50);assert.equal(JSON.stringify(tables.map(name=>h.receiver.db.all('SELECT * FROM '+name))),before);
  });
  h.receiver.db.revokeKey(h.scope.keyId,new Date(h.now()*1000).toISOString());
  await deny('revoked key receipt',()=>send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId)));
  const log=await readFile(join(directory,'error.log'),'utf8');assert.doesNotMatch(log,/\[emerg\]/);
});
