/** Authenticated private backup files. Final names appear only after success. */
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { appendFile, open, unlink, link, lstat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { requireContract as need } from './schema.js';
const magic=Buffer.from('ASYMBKP1');
export const maxEncryptedBytes=1073741824;
async function sync(path:string):Promise<void>{const f=await open(path,'r');try{await f.sync();}finally{await f.close();}}
async function publish(partial:string,destination:string,beforePublish:()=>void):Promise<void>{
 await sync(partial);beforePublish();await link(partial,destination);await unlink(partial);await sync(dirname(destination));
}
/** beforePublish is an isolated crash-test hook, never a public request option. */
export async function sealFile(source:string,destination:string,key:Buffer,beforePublish:()=>void=()=>{}):Promise<void>{
 need(key.length===32);const info=await lstat(source);need(info.isFile()&&!info.isSymbolicLink()&&info.size<=maxEncryptedBytes-36,'TOO_LARGE');
 const partial=destination+'.partial-'+randomUUID(),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);let size=0;
 const bound=new Transform({transform(chunk:Buffer,_encoding,done){size+=chunk.length;if(size>maxEncryptedBytes-36)done(new Error('Backup exceeds documented size limit.'));else done(null,chunk);}});
 const out=await open(partial,'wx',0o600);await out.write(Buffer.concat([magic,iv]));await out.close();
 try {await pipeline(createReadStream(source),bound,cipher,createWriteStream(partial,{flags:'a'}));need(size===info.size,'CONFLICT');await appendFile(partial,cipher.getAuthTag());await publish(partial,destination,beforePublish);}
 catch(error){await unlink(partial).catch(()=>{});throw error;}
}
export async function openFile(source:string,destination:string,key:Buffer,beforePublish:()=>void=()=>{}):Promise<void>{
 need(key.length===32);const input=await open(source,'r');let size:number;const header=Buffer.alloc(20),tag=Buffer.alloc(16);
 try{const info=await input.stat();size=info.size;need(info.isFile()&&size>=36&&size<=maxEncryptedBytes);await input.read(header,0,20,0);await input.read(tag,0,16,size-16);need(header.subarray(0,8).equals(magic));}finally{await input.close();}
 const partial=destination+'.partial-'+randomUUID(),out=await open(partial,'wx',0o600);await out.close();
 try {const cipher=createDecipheriv('aes-256-gcm',key,header.subarray(8));cipher.setAuthTag(tag);
 if(size===36){cipher.final();}else await pipeline(createReadStream(source,{start:20,end:size-17}),cipher,createWriteStream(partial,{flags:'r+'}));
 await publish(partial,destination,beforePublish);
 }catch(error){await unlink(partial).catch(()=>{});throw error;}
}
