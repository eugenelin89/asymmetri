import { readFileSync } from 'node:fs';
import { createIngress,ingressConfig } from './ingress.js';
import { createTlsIngress,tlsIngressConfig } from './tls-ingress.js';
import { parseJson,requireContract as need } from './schema.js';
process.umask(0o077);
async function main():Promise<void>{
  const path=process.env.ASYMMETRI_INGRESS_CONFIG;need(path,'UNAVAILABLE');
  const input=parseJson(readFileSync(path),16384) as {router:unknown;tls:unknown};
  need(Object.keys(input).sort().join(',')==='router,tls');
  const routing=ingressConfig(input.router),tlsConfig=tlsIngressConfig(input.tls);
  need(routing.enabled&&tlsConfig.enabled&&routing.port>0&&tlsConfig.upstreamPort===routing.port,'UNAVAILABLE');
  const router=await createIngress(routing);
  try{
    const tls=await createTlsIngress(tlsConfig);
    const reload=()=>{try{tls.reload();console.log('TLS certificate context reloaded.');}catch{console.error('TLS certificate reload failed; previous context retained.');}};
    process.on('SIGHUP',reload);console.log('Apex TLS and raw routing listeners ready on loopback.');
    await new Promise<void>(resolve=>{let stopping=false;const stop=()=>{if(!stopping){stopping=true;process.off('SIGHUP',reload);void tls.close().then(resolve);}};process.once('SIGTERM',stop);process.once('SIGINT',stop);});
  }finally{await router.close();}
}
main().catch(()=>{console.error('Apex ingress startup failed. Check private configuration, certificates and ports.');process.exitCode=1;});
