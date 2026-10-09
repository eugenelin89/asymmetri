// Disposable integration worker only. Fault injection is not part of the CLI.
import { createReceiver } from '../src/http.js';
import type { Config } from '../src/config.js';
const [json,clock,point]=process.argv.slice(2);
const receiver=await createReceiver(JSON.parse(json!) as Config,{now:()=>Number(clock),fault:p=>{if(p===point)process.kill(process.pid,'SIGKILL');}});
process.send?.({port:(receiver.server.address() as {port:number}).port});
process.once('SIGTERM',()=>{void receiver.close().then(()=>process.exit(0));});
