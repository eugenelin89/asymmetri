/** Browser-safe validation and links for the unchanged canonical Ask contract. */
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../receiver/vendor/investment/v1/schema.json' with { type: 'json' };
import type { AskAvailability, AskRoster, AskSession, AskConversation, AskConversationPage, AskAdmission, AskControlReceipt, AskQuestionInput, AskQuestionState, ContextRef, Problem } from '../receiver/vendor/investment/v1/types';

export interface AskDtos {
  AskAvailability: AskAvailability; AskRoster: AskRoster; AskSession: AskSession;
  AskConversation: AskConversation; AskConversationPage: AskConversationPage;
  AskAdmission: AskAdmission; AskControlReceipt: AskControlReceipt;
  AskQuestionInput: AskQuestionInput; ContextRef: ContextRef; Problem: Problem;
}
const ajv = new Ajv2020({ strict: true, allErrors: false });
addFormats(ajv); ajv.addSchema(schema);
export function askDto<K extends keyof AskDtos>(name: K, value: unknown): value is AskDtos[K] {
  return !!ajv.getSchema(`${schema.$id}#/$defs/${name}`)?.(value);
}
export const askId = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value);
export const activeQuestion = (state: AskQuestionState) => !['answered','declined','expired','cancelled','failed'].includes(state);
export const askStateLabels: Record<AskQuestionState, string> = {
  admitted:'Accepted', queued:'Waiting for an employee', routed:'Assigned', answering:'Answer in progress',
  answered:'Answered', declined:'Unable to answer', expired:'Question expired', cancelled:'Cancelled',
  failed:'Answer unavailable', outcome_unknown:'Outcome unknown. Held for review.',
};
export function askEntryHref(context?: ContextRef): string {
  if (!context || !askDto('ContextRef', context)) return '/botsquad/ask';
  const query = new URLSearchParams({experiment:context.experimentId,run:context.runId,kind:context.record.kind,
    record:context.record.id,version:String(context.record.version)});
  return '/botsquad/ask?' + query;
}
export function askContext(params: Record<string,string|string[]|undefined>): ContextRef | null {
  if (!Object.keys(params).length) return null;
  const keys=['experiment','run','kind','record','version'];
  if (Object.keys(params).some(key=>!keys.includes(key)) || keys.some(key=>typeof params[key]!=='string')) return null;
  if (!/^[1-9][0-9]{0,6}$/.test(params.version as string)) return null;
  const context={experimentId:params.experiment,runId:params.run,record:{kind:params.kind,id:params.record,version:Number(params.version),relation:'supports'}};
  return askDto('ContextRef',context) ? context : null;
}
/** Only exact public record identities enter links, never private conversation IDs. */
export function askEvidenceHref(context: ContextRef, experimentId: string | null): string | null {
  if (!askDto('ContextRef',context) || context.experimentId !== experimentId) return null;
  const {record,runId}=context;
  const path=record.kind==='artifact' ? `/botsquad/investment/artifacts/${record.id}/versions/${record.version}` :
    `/botsquad/investment/records/${record.kind}/${record.id}/versions/${record.version}`;
  return path+'?run='+encodeURIComponent(runId);
}
export function askSourceHref(value: string | null): string | null {
  try {if(!value)return null;const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password ? url.href : null;} catch {return null;}
}
export function validConversation(page: AskConversationPage, conversationId: string): boolean {
  return page.conversation.conversationId===conversationId && new Set(page.turns.map(turn=>turn.questionId)).size===page.turns.length &&
    page.turns.every(turn=>turn.status.questionId===turn.questionId && (!turn.answer ||
      turn.answer.conversationId===conversationId && turn.answer.questionId===turn.questionId &&
      turn.answer.questionHash===turn.status.questionHash && turn.status.state==='answered' &&
      turn.answer.workerId===turn.status.route?.workerId && turn.answer.routingPolicyVersion===turn.status.route?.routingPolicyVersion));
}


export class AskRequestError extends Error {
  code: string; status: number; retryAfterSeconds: number | null;
  constructor(code: string, status=0, retryAfterSeconds: number | null=null) {
    super('The Ask request could not be verified.'); this.code=code; this.status=status; this.retryAfterSeconds=retryAfterSeconds;
  }
}
/** Relative same-origin requests only. No proxy, key, provider or public archive access. */
export async function askRequest<K extends keyof AskDtos>(name: K, path: string,
  options: {method?:'GET'|'POST'|'DELETE';value?:unknown;id?:string;session?:AskSession;signal?:AbortSignal} = {},
  transport: typeof fetch = fetch): Promise<AskDtos[K]> {
  if (!/^\/(?:availability|roster|sessions|conversations(?:\/[A-Za-z0-9_-]+(?:\/questions)?)?|questions\/[A-Za-z0-9_-]+\/cancel)(?:\?after=[A-Za-z0-9_-]+)?$/.test(path)) throw new AskRequestError('INVALID_REQUEST');
  const method=options.method??'GET', headers: Record<string,string>={Accept:'application/json'};
  if(method!=='GET') {if(!options.id||!askId(options.id))throw new AskRequestError('INVALID_REQUEST');headers['Idempotency-Key']=options.id;}
  if(options.session && method!=='GET')headers['X-CSRF-Token']=options.session.csrfToken;
  if(options.value!==undefined)headers['Content-Type']='application/json';
  const body=options.value===undefined?undefined:JSON.stringify(options.value);
  if(body&&new TextEncoder().encode(body).length>16384)throw new AskRequestError('TOO_LARGE');
  const timeout=AbortSignal.timeout(8000),signal=options.signal?AbortSignal.any([timeout,options.signal]):timeout;
  try {
    const response=await transport('/api/ask/v1'+path,{method,headers,body,credentials:'same-origin',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal});
    if(!response.body || !/^application\/(?:problem\+)?json(?:;|$)/i.test(response.headers.get('content-type')??''))throw new AskRequestError('UNVERIFIED');
    const reader=response.body.getReader(),chunks:Uint8Array[]=[];let size=0;
    for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>(response.ok?524288:8192)){await reader.cancel();throw new AskRequestError('UNVERIFIED');}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    if(!response.ok){if(!askDto('Problem',value)||value.status!==response.status)throw new AskRequestError('UNVERIFIED');throw new AskRequestError(value.code,value.status,value.retryAfterSeconds);}
    if(!askDto(name,value))throw new AskRequestError('UNVERIFIED');
    return value;
  }catch(error){if(error instanceof AskRequestError)throw error;throw new AskRequestError(options.signal?.aborted?'ABORTED':'NETWORK_UNKNOWN');}
}
export async function askConversation(id:string,session:AskSession,signal?:AbortSignal,transport:typeof fetch=fetch):Promise<AskConversationPage>{
  if(!askId(id))throw new AskRequestError('INVALID_REQUEST');
  const deadline=AbortSignal.timeout(12000);signal=signal?AbortSignal.any([signal,deadline]):deadline;
  let bytes=0;
  let after:string|null=null;const seen=new Set<string>(),turns:AskConversationPage['turns']=[];let result:AskConversationPage|undefined;
  for(let page=0;page<32;page++){
    const next:AskConversationPage=await askRequest('AskConversationPage','/conversations/'+id+(after?'?after='+after:''),{session,signal},transport);
    if(!validConversation(next,id)||next.turns.some(turn=>turn.answer&&turn.answer.serviceId!==session.serviceId)||turns.some(turn=>next.turns.some(item=>item.questionId===turn.questionId)))throw new AskRequestError('UNVERIFIED');
    bytes+=new TextEncoder().encode(JSON.stringify(next)).length;
    turns.push(...next.turns);if(turns.length>32||bytes>8388608)throw new AskRequestError('UNVERIFIED');result=next;after=next.nextCursor;
    if(!after)return {...result,turns};if(seen.has(after))throw new AskRequestError('UNVERIFIED');seen.add(after);
  }
  throw new AskRequestError('UNVERIFIED');
}


export interface PendingQuestion { id:string; input:AskQuestionInput; admission:{questionId:string;questionHash:string}|null }
/** Text equality cannot identify a request: old declined turns can have identical input. */
export function confirmsPending(pending:PendingQuestion,page:AskConversationPage):boolean {
  return !!pending.admission&&page.turns.some(turn=>turn.questionId===pending.admission!.questionId&&turn.status.questionHash===pending.admission!.questionHash&&
    turn.input.text===pending.input.text&&turn.input.priorQuestionId===pending.input.priorQuestionId&&turn.input.language===pending.input.language&&
    JSON.stringify(turn.input.context)===JSON.stringify(pending.input.context));
}
export function controlSatisfied(command:NonNullable<AskTab['control']>,conversationId:string,receipt:AskControlReceipt):boolean {
  if(receipt.conversationId!==conversationId)return false;
  if(command.kind==='delete')return receipt.action==='delete'&&receipt.questionId===null;
  return receipt.questionId===command.questionId&&(receipt.action==='cancel'||receipt.action==='expire') ||
    receipt.questionId===null&&(receipt.action==='delete'||receipt.action==='expire');
}
export function canReplayPending(tab:AskTab|null):boolean{return !!(tab?.pending&&tab.session&&tab.conversationId&&!tab.control);}
export interface AskTab {
  session:AskSession|null; sessionRequestId:string; conversationId:string|null;
  conversationRequestId:string; pending:PendingQuestion|null;
  control:{kind:'cancel'|'delete';id:string;questionId:string|null}|null;
}
export const askStorageKey='asymmetri-ask-synthetic-tab-v1';
export function freshAskTab():AskTab{return {session:null,sessionRequestId:crypto.randomUUID(),conversationId:null,
  conversationRequestId:crypto.randomUUID(),pending:null,control:null};}
export function decodeAskTab(raw:string|null,now=Date.now()):AskTab|null {
  try {
    if(!raw||raw.length>32768)return null;const v=JSON.parse(raw) as AskTab;
    if(!v||typeof v!=='object'||Object.keys(v).sort().join()!=='control,conversationId,conversationRequestId,pending,session,sessionRequestId')return null;
    if(!askId(v.sessionRequestId)||!askId(v.conversationRequestId)||v.conversationId!==null&&!askId(v.conversationId))return null;
    if(v.session!==null&&(!askDto('AskSession',v.session)||Date.parse(v.session.expiresAt)<=now||v.session.serviceId!=='fixture-ask'||v.session.privacyNoticeVersion!=='fixture-privacy-1'))return null;
    if(v.conversationId&&!v.session)return null;
    if(v.pending&&((v.pending.admission!==null&&(!askId(v.pending.admission?.questionId)||typeof v.pending.admission.questionHash!=='string'||!/^[a-f0-9]{64}$/.test(v.pending.admission.questionHash)))||!askId(v.pending.id)||!askDto('AskQuestionInput',v.pending.input)||!v.session||!v.conversationId))return null;
    if(v.control&&(!['cancel','delete'].includes(v.control.kind)||!askId(v.control.id)||!v.conversationId||
      v.control.kind==='cancel'&&(typeof v.control.questionId!=='string'||!askId(v.control.questionId))||
      v.control.kind==='delete'&&v.control.questionId!==null))return null;
    return v;
  }catch{return null;}
}
