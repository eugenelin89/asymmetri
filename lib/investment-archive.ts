/** Framework-neutral, disabled-by-default public server read boundary.
 * No SQLite, signing keys, receiver runtime imports or startup side effects.
 */
export type {
  PublicExperiment, PublicStatus, SnapshotResponse, EventPage, PerformancePage,
  TransactionPage, DiscussionPage, DiscussionDetail, DecisionDetail, ArtifactPage,
  ArtifactDetail, RecordDetail,
} from "../receiver/vendor/investment/v1/types";

export function investmentArchiveReadLocation(
  experimentId: string,
  runId: string,
  origin = process.env.ASYMMETRI_INVESTMENT_READ_ORIGIN,
): { status: string; snapshot: string; events: string } | null {
  if (!origin) return null;
  if (![experimentId, runId].every((id) => /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id))) {
    throw new Error("Invalid public archive identity.");
  }
  const base = new URL(origin);
  if (base.protocol !== "http:" || base.hostname !== "127.0.0.1" ||
      base.username || base.password || base.search || base.hash || base.pathname !== "/") {
    throw new Error("Public archive reads require an explicit loopback origin.");
  }
  const path = `/api/experiments/v1/experiments/${experimentId}/runs/${runId}`;
  return Object.fromEntries(["status", "snapshot", "events"].map((name) =>
    [name, new URL(`${path}/${name}`, base).href])) as { status: string; snapshot: string; events: string };
}

import { validArchiveDto } from "./investment-schema";
import type { Problem, ArtifactDetail as ArtifactDTO } from "../receiver/vendor/investment/v1/types";
export const archiveId = (id: string) => /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id);
export type ArchiveResponse<T> = {data:T;error:null;code?:never;fingerprint?:string;tailCursor?:string}|{data:null;error:string;code?:string;fingerprint?:never;tailCursor?:never};
export function archiveLocation(path: string, run?: string): string | null {
  const e = process.env.ASYMMETRI_INVESTMENT_EXPERIMENT, r = run ?? process.env.ASYMMETRI_INVESTMENT_RUN;
  if (!e || !r) return null;
  const locations = investmentArchiveReadLocation(e, r);
  if (!locations || !archiveDto(path)) return null;
  return locations.status.replace(/status$/, path);
}
/** Only contract GET resources; callers cannot supply an origin or arbitrary path. */
export function archiveDto(path: string): string | null {
  const [pathname, query = ''] = path.split('?');
  const id = '[A-Za-z0-9][A-Za-z0-9_-]{0,63}', version = '(?:[1-9][0-9]{0,5}|1000000)';
  const routes: [RegExp, string][] = [
    [/^status$/, 'PublicStatus'], [/^snapshot$/, 'SnapshotResponse'], [/^events$/, 'EventPage'],
    [/^performance$/, 'PerformancePage'], [/^transactions$/, 'TransactionPage'],
    [/^discussions$/, 'DiscussionPage'], [/^artifacts$/, 'ArtifactPage'],
    [new RegExp(`^discussions/${id}$`), 'DiscussionDetail'], [new RegExp(`^decisions/${id}$`), 'DecisionDetail'],
    [new RegExp(`^artifacts/${id}/versions/${version}(?:/content)?$`), 'ArtifactDetail'],
    [new RegExp(`^records/(?:event|discussion|contribution|decision|review|order|transaction|artifact|valuation|corporate_action|instrument)/${id}/versions/${version}$`), 'RecordDetail'],
  ];
  const name = routes.find(([pattern]) => pattern.test(pathname))?.[1];
  if (!name || path.split('?').length > 2) return null;
  const params = new URLSearchParams(query);
  const permitted = name === 'PerformancePage' ? ['limit','after','from','to','resolution'] : name === 'TransactionPage' ? ['limit','after','kind','instrumentId','status'] : ['limit','after'];
  for (const [key, value] of params) {
    if (!permitted.includes(key) || params.getAll(key).length !== 1 || value.length > 64) return null;
    if (key === 'after' && !archiveId(value) || key === 'limit' && !/^(?:[1-9][0-9]?|100)$/.test(value)) return null;
  }
  return name;
}
async function readUrl<T>(url: string | null, name: string, run?: string): Promise<ArchiveResponse<T>> {
  if (!url) return {data:null,error:'No published experiment',code:'NOT_CONFIGURED'};
  try {
    const response = await fetch(url, {cache:'no-store', redirect:'error', signal:AbortSignal.timeout(8000)});
    if (!response.body) throw new Error('Empty response');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = []; let length = 0;
    for (;;) { const {done,value} = await reader.read(); if (done) break; length += value.length; if (length > 2097152) { await reader.cancel(); throw new Error('Oversize'); } chunks.push(value); }
    const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
    const body: unknown = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    if (!response.ok) {
      if (!validArchiveDto('Problem',body)) throw new Error('Malformed problem');
      const p = body as Problem;
      return {data:null,code:p.code,error:p.code === 'CURSOR_RESET' ? 'This page cursor expired or was reset. Return to the first page.' : p.code === 'NOT_FOUND' ? 'Record not found.' : p.code === 'WITHDRAWN' ? 'This record has been withdrawn.' : 'The archive is unavailable. No current content can be verified.'};
    }
    if (!validArchiveDto(name,body)) throw new Error('Malformed archive response');
    const scope = body as {experimentId?:string;runId?:string};
    if (scope.experimentId !== process.env.ASYMMETRI_INVESTMENT_EXPERIMENT || run && scope.runId !== run) throw new Error('Mismatched scope');
    const fingerprint=response.headers.get('x-archive-visibility');
    if(!fingerprint || !/^[a-f0-9]{64}$/.test(fingerprint)) throw new Error('Unverified archive visibility');
    const tail=response.headers.get('x-archive-latest-cursor');
    if(tail&&!archiveId(tail))throw new Error('Invalid tail cursor');
    return {data:body as T,error:null,fingerprint,tailCursor:tail??undefined};
  } catch { return {data:null,code:'UNAVAILABLE',error:'The archive is unavailable. No current content can be verified.'}; }
}
export async function archiveRead<T>(path: string, run = process.env.ASYMMETRI_INVESTMENT_RUN): Promise<ArchiveResponse<T>> {
  try { const name = archiveDto(path); if (!name) return {data:null,error:'Invalid archive request.',code:'INVALID_REQUEST'}; return await readUrl<T>(archiveLocation(path,run),name,run); }
  catch { return {data:null,error:'The archive is unavailable. No current content can be verified.',code:'UNAVAILABLE'}; }
}
export async function experimentRead(after?: string): Promise<ArchiveResponse<import('../receiver/vendor/investment/v1/types').PublicExperiment>> {
  try {
    const base = archiveLocation('status');
    if (after && !archiveId(after)) return {data:null,error:'Invalid run cursor.',code:'INVALID_REQUEST'};
    return await readUrl(base ? base.replace(/\/runs\/[^/]+\/status$/, '') + '?limit=20' + (after ? '&after='+encodeURIComponent(after) : '') : null, 'PublicExperiment');
  } catch { return {data:null,error:'The archive is unavailable. No current content can be verified.',code:'UNAVAILABLE'}; }
}
export function sourceUrl(value:string):string|null {
  try {const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password&&!u.search&&!u.hash&&!/[\s\\]/.test(value)?u.href:null;}catch{return null;}
}
export async function artifactBytes(id:string,version:string,run?:string):Promise<{bytes:Uint8Array;type:string;fingerprint?:string;synthetic:boolean}|null> {
  if(!archiveId(id)||!/^([1-9][0-9]{0,5}|1000000)$/.test(version))return null;
  const path=`artifacts/${id}/versions/${version}`,before=await archiveRead<ArtifactDTO>(path,run),p=before.data?.metadata;
  if(!p||!['published','superseded'].includes(before.data!.status))return null;
  try {
    const response=await fetch(archiveLocation(path+'/content',run)!,{cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
    if(!response.ok||response.headers.get('content-type')!==p.contentType||!response.body)return null;
    const reader=response.body.getReader(),parts:Uint8Array[]=[];let size=0;
    for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>p.sizeBytes||size>4194304){await reader.cancel();return null;}parts.push(value);}
    if(size!==p.sizeBytes)return null;const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==p.sha256)return null;
    const after=await archiveRead<ArtifactDTO>(path,run);if(!after.data?.metadata||after.data.metadata.sha256!==p.sha256||!['published','superseded'].includes(after.data.status))return null;
    const record=await archiveRead<import('../receiver/vendor/investment/v1/types').RecordDetail>(`records/artifact/${id}/versions/${version}`,run);
    if(!record.data?.event || record.fingerprint!==after.fingerprint || before.fingerprint!==after.fingerprint)return null;
    return {bytes,type:p.contentType,fingerprint:after.fingerprint,synthetic:record.data.event.event.evidenceMode==='synthetic_fixture'};
  }catch{return null;}
}
