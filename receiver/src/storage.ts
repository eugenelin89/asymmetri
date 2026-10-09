import { constants } from 'node:fs';
import { mkdir, open, unlink, rename, lstat, statfs, opendir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { ContentType } from '../vendor/investment/v1/types.js';
import { checkContent } from './content.js';
import { requireContract as need, validate } from './schema.js';
import { Archive } from './database.js';

export type Fault = (point: string) => void;
export class Storage {
  readonly temp: string;
  readonly objects: string;
  constructor(readonly archive: Archive, readonly fault: Fault = () => {}) {
    this.temp=join(archive.config.dataDir,'incoming'); this.objects=join(archive.config.dataDir,'objects');
  }
  async init(): Promise<void> {
    for(const dir of [this.temp,this.objects]) { await mkdir(dir,{mode:0o700,recursive:true}); const s=await lstat(dir); need(s.isDirectory()&&!s.isSymbolicLink()&&(s.mode&0o077)===0,'UNAVAILABLE'); }
  }
  path(hash: string): string { validate('Hash',hash); return join(this.objects,hash); }
  async space(bytes: number): Promise<void> {
    const fs=await statfs(this.archive.config.dataDir);
    need(fs.bavail*fs.bsize >= this.archive.config.minFreeBytes+bytes,'UNAVAILABLE');
  }
  async syncDir(dir: string): Promise<void> { const f=await open(dir,constants.O_RDONLY); try { await f.sync(); } finally { await f.close(); } }
  async read(hash: string, type: ContentType, size: number): Promise<Buffer> {
    const f=await open(this.path(hash),constants.O_RDONLY|constants.O_NOFOLLOW);
    try { const s=await f.stat(); need(s.isFile()&&s.nlink===1&&s.size===size&&s.size<=4194304,'UNAVAILABLE'); const bytes=await f.readFile(); checkContent(bytes,type,hash); return bytes; } finally { await f.close(); }
  }
  async temporary(req: IncomingMessage, limit: number, length: number): Promise<{path:string;bytes:Buffer}> {
    need(length>0&&length<=limit,'TOO_LARGE'); await this.space(length);
    const path=join(this.temp,randomUUID()+'.part');
    const f=await open(path,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);
    let size=0;
    try {
      for await(const chunk of req) { const b=Buffer.from(chunk); size+=b.length; need(size<=limit&&size<=length,'TOO_LARGE'); this.fault('disk-write'); await f.writeFile(b); }
      need(req.complete&&size===length,'INVALID_REQUEST');
      await f.sync(); await f.close();
      const input=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);
      try { return {path,bytes:await input.readFile()}; } finally { await input.close(); }
    } catch(e) { await f.close().catch(()=>{}); await unlink(path).catch(()=>{}); throw e; }
  }
  async install(temp: string, bytes: Buffer, type: ContentType, hash: string, now: number): Promise<void> {
    checkContent(bytes,type,hash);
    this.archive.atomic(()=>{
      this.archive.admitWrite(32768);
      const used=this.archive.get<{n:number}>('SELECT coalesce(sum(size_bytes),0) n FROM content_objects')!.n;
      const old=this.archive.get<{size_bytes:number}>('SELECT size_bytes FROM content_objects WHERE sha256=?',hash);
      need(!old||old.size_bytes===bytes.length,'CONFLICT');
      need(used+(old?0:bytes.length)<=this.archive.config.maxContentBytes,'BUDGET_EXHAUSTED');
      // Reservation survives a crash before install; it is never publication metadata.
      this.archive.run('INSERT OR IGNORE INTO content_objects VALUES(?,?,?)',hash,bytes.length,now);
    });
    this.fault('before-content-install');
    // Reject suspicious existing entries, then atomically replace identical hash bytes.
    try { const s=await lstat(this.path(hash)); need(s.isFile()&&!s.isSymbolicLink()&&s.nlink===1,'UNAVAILABLE'); }
    catch(e) { if((e as NodeJS.ErrnoException).code!=='ENOENT') throw e; }
    await rename(temp,this.path(hash));
    this.fault('after-content-rename');
    await this.syncDir(this.objects); await this.syncDir(this.temp);
    await this.read(hash,type,bytes.length);
    this.fault('after-content-install');
  }
  /** Offline only: caller must stop admission. At most limit entries per directory. */
  async cleanup(now: number, limit=100): Promise<{removed:number}> {
    need(Number.isInteger(limit)&&limit>=1&&limit<=1000);
    let removed=0,seen=0;
    const cutoff=now-86400;
    for await(const ent of await opendir(this.temp)) {
      if(++seen>limit) break;
      if(!/^[a-f0-9-]+\.part$/.test(ent.name)||!ent.isFile()) continue;
      const path=join(this.temp,ent.name),s=await lstat(path);
      if(s.mtimeMs/1000<cutoff) { await unlink(path); removed++; }
    }
    const rows=this.archive.all<{sha256:string}>('SELECT sha256 FROM content_objects c WHERE created_at<? AND NOT EXISTS(SELECT 1 FROM staged_content s WHERE s.sha256=c.sha256 AND s.touched_at>=?) AND NOT EXISTS(SELECT 1 FROM artifact_versions a WHERE a.sha256=c.sha256) LIMIT ?',cutoff,cutoff,limit);
    for(const row of rows) {
      await unlink(this.path(row.sha256)).catch(e=>{if(e.code!=='ENOENT')throw e;});
      this.archive.atomic(()=>{this.archive.run('DELETE FROM staged_content WHERE sha256=?',row.sha256);this.archive.run('DELETE FROM content_objects WHERE sha256=?',row.sha256);}); removed++;
    }
    await this.syncDir(this.objects);await this.syncDir(this.temp);return {removed};
  }
}
