import { open, unlink } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import { backup, restore } from './backup.js';
import { Controls } from './controls.js';
import { Archive } from './database.js';
import { Storage } from './storage.js';
import { createReceiver } from './http.js';
import { parseJson, requireContract as need, validate } from './schema.js';
import type { PublisherScope, ArtifactVersion }  from '../vendor/investment/v1/types.js';

process.umask(0o077);

async function main():Promise<void>{
  const [command,...args]=process.argv.slice(2),path=process.env.ASYMMETRI_RECEIVER_CONFIG;
  if(!path){console.error('Receiver disabled: set ASYMMETRI_RECEIVER_CONFIG to an explicit private local configuration.');process.exitCode=1;return;}
  const config=loadConfig(path);
  const commands=['serve','migrate','diagnostics','authorize','revoke-key','cleanup','restore-fence','withdraw','registry-state','approve-artifact','release-correction','export-controls','reconcile-controls','backup','restore'];need(command&&commands.includes(command));
  const offline=['serve','migrate','cleanup','restore-fence','backup','restore','reconcile-controls'].includes(command),lock=join(config.dataDir,'receiver.lock');
  const handle=offline?await open(lock,'wx',0o600):null;
  if(handle)await handle.writeFile(String(process.pid));
  const unlock=async()=>{if(handle){await handle.close();await unlink(lock);}};
  try{
    if(command==='serve'){
      need(config.enabled,'UNAVAILABLE');const receiver=await createReceiver(config,{log:entry=>console.error(JSON.stringify(entry))});
      console.log(JSON.stringify({state:'listening',host:config.host,port:(receiver.server.address() as {port:number}).port}));
      await new Promise<void>(resolve=>{let stopping=false;const stop=()=>{if(stopping)return;stopping=true;void receiver.close().then(resolve);};process.once('SIGTERM',stop);process.once('SIGINT',stop);});return;
    }
    const db=new Archive(config);
    try{
      const time=new Date().toISOString();
      const controls=new Controls(db);
      switch(command){
        case 'backup':need(args.length===1);console.log(JSON.stringify(await backup(db,args[0]!,time)));break;
        case 'restore':need(args.length===3);await restore(args[0]!,args[1]!,args[2]!,time);console.log('Isolated restore verified and fenced; reads and publishers remain held.');break;
        case 'withdraw':need(args.length===4);args.slice(0,3).forEach(x=>validate('Id',x));need(['withheld','withdrawn'].includes(args[3]!));db.hide(args[0]!,args[1]!,args[2]!,args[3] as 'withheld'|'withdrawn',time);console.log('Visibility control recorded.');break;
        case 'registry-state':need(args.length===4);controls.registry(args[0]!,args[1]!,args[2]!,args[3] as Parameters<Controls['registry']>[3],time);console.log('Registry control recorded.');break;
        case 'approve-artifact':need(args.length===3);controls.approve(args[0]!,args[1]!,parseJson(readFileSync(args[2]!),16384) as ArtifactVersion,time);console.log('Exact artifact rights approval recorded.');break;
        case 'release-correction':need(args.length===3);controls.releaseCorrection(args[0]!,args[1]!,args[2]!,time);console.log('Reviewed correction release recorded.');break;
        case 'export-controls':console.log(JSON.stringify(controls.snapshot()));break;
        case 'reconcile-controls':need(args.length===2);controls.reconcile(parseJson(readFileSync(args[0]!),16777216) as Parameters<Controls['reconcile']>[0],args[1]!,time);console.log('Current control snapshot reconciled; publisher authority remains fenced.');break;
        case 'migrate': console.log(JSON.stringify({migration:2,publishers:db.get<{n:number}>('SELECT count(*) n FROM publishers')!.n}));break;
        case 'authorize':{
          need(args.length===1);const input=parseJson(readFileSync(args[0]!),16384) as {scope:PublisherScope;publicKey:string;notBefore:number;notAfter:number};
          need(Object.keys(input).sort().join(',')==='notAfter,notBefore,publicKey,scope');validate('PublisherScope',input.scope);db.authorize(input.scope,input,time);console.log('Local publisher verification scope recorded.');break;
        }
        case 'revoke-key':need(args.length===1);validate('Id',args[0]);db.revokeKey(args[0]!,time);console.log('Key revoked.');break;
        case 'cleanup':{const storage=new Storage(db);await storage.init();console.log(JSON.stringify(await storage.cleanup(Math.floor(Date.now()/1000))));break;}
        case 'restore-fence':db.fenceRestore(time);console.log('Restored archive fenced: all keys revoked, publishers disabled, cursors reset. Reconcile before new authority.');break;
        case 'diagnostics':console.log(JSON.stringify({migration:2,integrity:db.db.pragma('quick_check'),foreignKeys:db.db.pragma('foreign_key_check'),counts:Object.fromEntries(['events','batches','nonces','content_objects','publishers'].map(t=>[t,db.get<{n:number}>(`SELECT count(*) n FROM ${t}`)!.n]))}));break;
      }
    }finally{db.close();}
  }finally{await unlock();}
}
main().catch(()=>{console.error('Receiver command failed. Check the documented configuration, lock, storage and diagnostics.');process.exitCode=1;});
