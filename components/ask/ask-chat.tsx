'use client';
import {useState} from 'react';
import type {AskRoster,AskTurn,ContextRef} from '@/receiver/vendor/investment/v1/types';
import {askEntryHref,askEvidenceHref,askSourceHref,askStateLabels,activeQuestion,type AskPrivacyNotice} from '@/lib/ask-client';
import {displayTime} from '@/lib/investment-links';
import {askExperience as copy} from '@/content/site';
import {useAskChat} from './use-ask-chat';

export function ContextChip({context,experimentId}:{context:ContextRef;experimentId:string|null}){
  const href=askEvidenceHref(context,experimentId);
  return <div className="ask-context"><span>{copy.context}</span><strong>{context.record.kind} · {context.record.id} · version {context.record.version}</strong>
    <small>Experiment {context.experimentId} / Run {context.runId}</small>{href&&<a href={href}>Inspect the exact public record →</a>}</div>;
}
function Turn({turn,roster,experimentId,cancel,disabled}:{turn:AskTurn;roster:AskRoster|null;experimentId:string|null;cancel:()=>void;disabled:boolean}){
  const answer=turn.answer,route=turn.status.route;
  const worker=roster?.workers.find(row=>row.worker.workerId===(answer?.workerId??route?.workerId))?.worker;
  const interpretations={general_answer:'General answer',historical_record_explanation:'Explanation of a historical record',new_interpretation:'New interpretation',clarification:'Clarifying response',refusal:'Unable to help with this request'};
  return <li className="ask-turn"><div className="ask-question"><span className="inv-kicker">You</span><p>{turn.input.text}</p>{turn.input.context&&<ContextChip context={turn.input.context} experimentId={experimentId}/>}</div>
    <div className="ask-answer"><div className="ask-turn-heading"><h3>{worker?worker.name:route?'Worker '+route.workerId:'Service status'}</h3><span className="inv-badge">{askStateLabels[turn.status.state]}</span></div>
      {worker&&<p className="inv-meta">{worker.role}</p>}{route&&<p className="inv-meta">Selected because: {route.explanation}{route.previousWorkerId&&<> Previous worker: {route.previousWorkerId}.</>}</p>}
      {turn.status.safeReason&&<p>{turn.status.safeReason}</p>}
      {answer?<><p className="ask-answer-text">{answer.text}</p><p className="inv-meta">{interpretations[answer.interpretation]} · Written {displayTime(answer.generatedAt)}<br/>Knowledge as of: {displayTime(answer.knowledgeAsOf)}</p>
        {answer.interpretation!=='general_answer'&&<p className="ask-historical">{copy.historical}</p>}
        {answer.limitations.length>0&&<ul className="ask-limitations">{answer.limitations.map((text,i)=><li key={i}>{text}</li>)}</ul>}
        {answer.evidence.length>0&&<div><h4>Exact public evidence</h4><ul>{answer.evidence.map((ref,i)=>{const href=askEvidenceHref(ref,experimentId);return <li key={i}>{href?<a href={href}>{ref.record.kind} {ref.record.id} · version {ref.record.version}</a>:<span>{ref.record.kind} {ref.record.id} · version {ref.record.version}. This experiment is not configured for links here.</span>}</li>;})}</ul></div>}
        {answer.publicSources.length>0&&<div><h4>Published sources</h4><ul>{answer.publicSources.map(source=>{const href=askSourceHref(source.url);return <li key={source.sourceId}>{href?<a href={href} rel="noreferrer noopener">{source.title} ↗</a>:source.title}<p>{source.summary}</p><small>{source.publisher}<br/>Published {displayTime(source.publishedAt)} · Event {displayTime(source.eventAt)}<br/>Retrieved {displayTime(source.retrievedAt)}</small>{source.limitations.length>0&&<ul className="ask-limitations">{source.limitations.map((text,i)=><li key={i}>{text}</li>)}</ul>}</li>;})}</ul></div>}
      </>:<p>{copy.noAnswer}</p>}
      <p className="inv-meta">Status updated {displayTime(turn.status.updatedAt)}</p>
      {activeQuestion(turn.status.state)&&<button type="button" onClick={cancel} disabled={disabled}>Cancel this question</button>}
    </div></li>;
}
/** The production path reads availability; an approved advertised disclosure is required for a composer. */
export function AskChat({context,experimentId,notices,synthetic=false}:{context:ContextRef|null;experimentId:string|null;notices:readonly AskPrivacyNotice[];synthetic?:boolean}){
  const chat=useAskChat(context,notices,synthetic),[confirmDelete,setConfirmDelete]=useState(false);
  return <section className="ask-chat" aria-label={synthetic?"Private synthetic conversation":"Private question service"}>
    {synthetic&&<div className="ask-test" role="note"><strong>{copy.synthetic}</strong></div>}
    {!chat.canCompose&&<div className="ask-layout"><section className="ask-unavailable" aria-labelledby="ask-unavailable-title"><span className="inv-kicker">Not accepting questions</span><h2 id="ask-unavailable-title">{copy.unavailableTitle}</h2><p>{chat.hasHistory?copy.paused:copy.unavailable}</p><p>{copy.next}</p><a href="/botsquad/investment">Explore published trade evidence →</a></section><aside className="ask-privacy"><h2>{copy.privacyTitle}</h2>{copy.privacy.map(text=><p key={text}>{text}</p>)}<a href={copy.privacyLink.href} rel="noreferrer noopener">{copy.privacyLink.label} ↗</a></aside></div>}
    {!chat.correctOrigin&&<a href={copy.serviceOrigin+askEntryHref(context??undefined)}>Open Ask at the main address →</a>}
    <div className="ask-service"><span className="inv-kicker">{synthetic?'Local service':'Service'} · {chat.availability?.state??'unverified'}</span>
      <p role="status" aria-live="polite">{chat.message}</p><button type="button" onClick={()=>void chat.refresh()} disabled={!chat.correctOrigin||!chat.canCheck}>Check status</button></div>
    <p className="sr-only" role="status" aria-live="polite">{chat.announcement}</p>
    {!chat.storageReady&&<p className="ask-warning">Tab storage is unavailable. New questions are disabled; keep this tab open for existing-request and privacy controls.</p>}
    {chat.context&&<><ContextChip context={chat.context} experimentId={experimentId}/>{!chat.tab?.pending&&!chat.hasActive&&<button type="button" disabled={chat.busy} onClick={chat.removeContext}>Remove record from the next question</button>}</>}
    {chat.page&&<section aria-label="Verified conversation"><h2>Your conversation</h2><p className="inv-meta">Session access expires {displayTime(chat.tab?.session?.expiresAt??null)}. New replies do not move your reading position.</p>
      <ol className="ask-turns">{chat.page.turns.map(turn=><Turn key={turn.questionId} turn={turn} roster={chat.roster} experimentId={experimentId} disabled={chat.busy||!!chat.tab?.control} cancel={()=>void chat.control('cancel',turn.questionId)}/>)}</ol>
      {!chat.page.turns.length&&<p>No visible turns in this conversation.</p>}</section>}
    {chat.tab?.control?<div className="ask-control"><p>A {chat.tab.control.kind==='delete'?'deletion':'cancellation'} request needs confirmation from the receiver.</p><button type="button" disabled={chat.busy} onClick={()=>void chat.control(chat.tab!.control!.kind,chat.tab!.control!.questionId)}>Retry the same privacy request</button></div>:
      chat.canCompose&&<form onSubmit={event=>{event.preventDefault();void chat.send();}} className="ask-compose">
        <label htmlFor="ask-question">{chat.tab?.pending?'Unconfirmed question':chat.page?.turns.some(turn=>turn.answer)?'Your follow-up':copy.questionLabel}</label>
        <textarea id="ask-question" rows={5} maxLength={4000} value={chat.draft} onChange={event=>chat.setDraft(event.target.value)} placeholder={copy.placeholder}
          disabled={chat.busy||chat.hasActive||!!chat.tab?.pending} aria-describedby="ask-length ask-privacy" autoComplete="off" spellCheck={false}/>
        <p id="ask-length" className="inv-meta">{[...chat.draft].length.toLocaleString()} / 2,000 characters. {copy.limit}</p>
        <details id="ask-privacy" open={!chat.tab?.session}><summary>How your text is handled</summary>{chat.notice?.paragraphs.map(text=><p key={text}>{text}</p>)}<p className="inv-meta">Notice version: {chat.notice?.privacyNoticeVersion}</p></details>
        <label className="ask-consent"><input type="checkbox" checked={chat.consent} onChange={event=>chat.setConsent(event.target.checked)} disabled={chat.busy}/><span>{chat.notice?.consent}</span></label>
        {chat.tab?.pending&&<p className="ask-warning">{chat.tab.pending.input?copy.unknown:copy.reloadUnknown}</p>}
        <button type="submit" className="button--primary" disabled={!chat.canSend}>{chat.busy?'Waiting for the receiver':chat.tab?.pending?copy.retry:copy.send}</button>
      </form>}
    {chat.tab?.pending&&!chat.canCompose&&<p className="ask-warning">{copy.reloadUnknown}</p>}
    {chat.hasHistory&&<div className="ask-delete">{confirmDelete?<><p>{copy.deleteNotice}</p><div className="ask-actions"><button type="button" disabled={chat.busy} onClick={()=>{setConfirmDelete(false);void chat.control('delete');}}>Confirm delete</button><button type="button" onClick={()=>setConfirmDelete(false)}>Keep conversation</button></div></>:<button type="button" disabled={chat.busy||!!chat.tab?.control} onClick={()=>setConfirmDelete(true)}>Delete this conversation</button>}</div>}
    {(!chat.hasHistory&&!!chat.tab?.sessionIdentity||chat.lostAccess)&&chat.tab&&<button type="button" onClick={chat.newSession} disabled={chat.busy}>{chat.lostAccess?'Forget unavailable tab state':'Start a new session'}</button>}
  </section>;
}
