/** Framework-neutral, disabled-by-default read boundary for a later server page.
 * No SQLite, signing keys, receiver runtime imports, fetches or startup side effects.
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

import type { Problem, ArtifactDetail as ArtifactDTO } from "../receiver/vendor/investment/v1/types";
export const archiveId = (id: string) => /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id);
export type ArchiveResponse<T> = {data:T;error:null}|{data:null;error:string};
export function archiveLocation(path: string): string | null {
  const e=process.env.ASYMMETRI_INVESTMENT_EXPERIMENT, r=process.env.ASYMMETRI_INVESTMENT_RUN;
  if(!e||!r)return null;
  const locations=investmentArchiveReadLocation(e,r);if(!locations)return null;
  return locations.status.replace(/status$/,path);
}
export async function archiveRead<T>(path: string):Promise<ArchiveResponse<T>> {
  try{
    const url=archiveLocation(path);if(!url)return {data:null,error:"No published experiment"};
    const response=await fetch(url,{cache:"no-store",redirect:"error",signal:AbortSignal.timeout(5000)});
    if(!response.ok){const p=await response.json() as Problem;return {data:null,error:p.code==="CURSOR_RESET"?"This page cursor expired or was reset. Return to the first page.":p.code==="NOT_FOUND"?"Record not found.":p.code==="WITHDRAWN"?"This record has been withdrawn.":"The archive is unavailable. No current content can be verified."};}
    return {data:await response.json() as T,error:null};
  }catch{return {data:null,error:"The archive is unavailable. No current content can be verified."};}
}
export function sourceUrl(value:string):string|null {
  try {const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password&&!u.search&&!u.hash&&!/[\s\\]/.test(value)?u.href:null;}catch{return null;}
}
export async function artifactBytes(id:string,version:string):Promise<{bytes:Uint8Array;type:string}|null> {
  if(!archiveId(id)||!/^([1-9][0-9]{0,5}|1000000)$/.test(version))return null;
  const path=`artifacts/${id}/versions/${version}`,before=await archiveRead<ArtifactDTO>(path),p=before.data?.metadata;
  if(!p||!['published','superseded'].includes(before.data!.status))return null;
  try {
    const response=await fetch(archiveLocation(path+'/content')!,{cache:"no-store",redirect:"error",signal:AbortSignal.timeout(10000)});
    if(!response.ok||response.headers.get('content-type')!==p.contentType||!response.body)return null;
    const reader=response.body.getReader(),parts:Uint8Array[]=[];let size=0;
    for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>p.sizeBytes||size>4194304){await reader.cancel();return null;}parts.push(value);}
    if(size!==p.sizeBytes)return null;const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==p.sha256)return null;
    const after=await archiveRead<ArtifactDTO>(path);if(!after.data?.metadata||after.data.metadata.sha256!==p.sha256||!['published','superseded'].includes(after.data.status))return null;
    return {bytes,type:p.contentType};
  }catch{return null;}
}
