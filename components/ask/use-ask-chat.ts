'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {AskAvailability,AskConversationPage,AskRoster,ContextRef} from '@/receiver/vendor/investment/v1/types';
import {askRequest,askConversation,AskRequestError,activeQuestion,confirmsPending,controlSatisfied,canReplayPending,
  pendingAfterControl,askStateLabels,askStorageKey,encodeAskTab,restoreAskTab,freshAskTab,approvedAskNotice,
  sameAskIdentity,askReadDelay,type AskTab,type AskIdentity,type AskPrivacyNotice} from '@/lib/ask-client';
import {askExperience as copy} from '@/content/site';

export function useAskChat(context:ContextRef|null,notices:readonly AskPrivacyNotice[],synthetic:boolean) {
  const [availability,setAvailability]=useState<AskAvailability|null>(null),[roster,setRoster]=useState<AskRoster|null>(null);
  const [page,setPage]=useState<AskConversationPage|null>(null),[tab,setTab]=useState<AskTab|null>(null);
  const [selectedContext,setSelectedContext]=useState(context),[announcement,setAnnouncement]=useState(''),[lostAccess,setLostAccess]=useState(false);
  const [draft,setDraft]=useState(''),[consentIdentity,setConsentIdentity]=useState<AskIdentity|null>(null),[busy,setBusy]=useState(false);
  const [storageReady,setStorageReady]=useState(true),[correctOrigin,setCorrectOrigin]=useState(true);
  const [message,setMessage]=useState<string>(copy.checking),[blockedUntil,setBlockedUntil]=useState(0),[clock,setClock]=useState(0);
  const [nextCheck,setNextCheck]=useState(0),[checkedAt,setCheckedAt]=useState(0);
  const lastStatus=useRef(''),announcedAnswers=useRef(new Set<string>());
  const current=useRef<AskTab|null>(null),writing=useRef(false),epoch=useRef(0),read=useRef<AbortController|null>(null);
  const mounted=useRef(false),storageOkay=useRef(true),mutation=useRef<AbortController|null>(null);
  const visibleUntil=useRef(0);
  const nextReadAt=useRef(0),failures=useRef(0),rosterReadAt=useRef(0);
  const notice=approvedAskNotice(availability,notices),consent=sameAskIdentity(consentIdentity,notice);
  const save=useCallback((next:AskTab,privacyControl=false)=>{
    try{sessionStorage.setItem(askStorageKey,encodeAskTab(next));}
    catch{storageOkay.current=false;setStorageReady(false);
      // Retain the earlier durable uncertainty fence if a later receipt cannot be saved.
      if(!privacyControl)throw new AskRequestError('STORAGE_UNAVAILABLE');}
    current.current=next;setTab(next);
  },[]);
  const adoptPage=useCallback((next:AskConversationPage)=>{
    visibleUntil.current=Date.now()+30000;setPage(document.hidden?null:next);
    const latest=next.turns.at(-1),key=latest?[latest.questionId,latest.status.state,latest.answer?.answerId].join(':'):'';
    if(latest&&key!==lastStatus.current&&!document.hidden){lastStatus.current=key;
      if(latest.answer){const id=latest.answer.answerId;if(!announcedAnswers.current.has(id)){announcedAnswers.current.add(id);setAnnouncement('Verified answer '+announcedAnswers.current.size+' is available.');}}
      else setAnnouncement(askStateLabels[latest.status.state]);}
  },[]);
  const refresh=useCallback(async()=>{
    if(!mounted.current||writing.current||document.hidden||Date.now()<nextReadAt.current||(!synthetic&&location.origin!==copy.serviceOrigin))return;
    nextReadAt.current=Date.now()+30000;setNextCheck(nextReadAt.current);
    const token=++epoch.current;read.current?.abort();const controller=new AbortController();read.current=controller;
    const existing=current.current;
    // Availability and roster failures must not prevent owned reads or privacy controls.
    const [statusResult,ownedResult,peopleResult]=await Promise.allSettled([
      askRequest('AskAvailability','/availability',{signal:controller.signal}),
      existing?.session&&existing.conversationId&&!existing.control?askConversation(existing.conversationId,existing.session,controller.signal):Promise.resolve(null),
      existing?.conversationId&&Date.now()>=rosterReadAt.current?askRequest('AskRoster','/roster',{signal:controller.signal}):Promise.resolve(null),
    ]);
    if(!mounted.current||token!==epoch.current)return;
    let delay=30000,failed=false;
    for(const result of [statusResult,ownedResult,peopleResult])if(result.status==='rejected'){
      failed=true;if(result.reason instanceof AskRequestError)delay=Math.max(delay,askReadDelay(result.reason.retryAfterSeconds));
    }
    failures.current=failed?failures.current+1:0;
    if(statusResult.status==='fulfilled'){
      const status=statusResult.value;setAvailability(status);setCheckedAt(Date.now());
      setConsentIdentity(previous=>sameAskIdentity(previous,status)?previous:null);
      delay=Math.max(delay,askReadDelay(status.retryAfterSeconds),!existing?.conversationId&&status.state==='disabled'?300000:0);
      if(!existing?.pending&&!existing?.control)setMessage(status.state==='available'?copy.checked:
        status.state==='busy'?copy.busy:status.state==='disabled'?copy.disabled:copy.paused);
    }else{setAvailability(null);setMessage(copy.statusUnavailable);}
    if(peopleResult.status==='fulfilled'&&peopleResult.value){
      const people=peopleResult.value;
      setRoster(existing?.session&&people.serviceId===existing.session.serviceId?people:null);rosterReadAt.current=Date.now()+300000;
    }else if(peopleResult.status==='rejected')setRoster(null);
    if(ownedResult.status==='fulfilled'){
      const conversation=ownedResult.value;
      if(conversation){setLostAccess(false);adoptPage(conversation);
        if(existing?.pending&&confirmsPending(existing.pending,conversation)){save({...existing,pending:null},true);setDraft('');setMessage(copy.reconciled);}
      }else setPage(null);
    }else{
      setPage(null);setMessage(copy.error);
      if(ownedResult.reason instanceof AskRequestError&&['NOT_FOUND','FORBIDDEN'].includes(ownedResult.reason.code)){
        setLostAccess(true);setConsentIdentity(null);setMessage(copy.unavailableChat);
      }
    }
    nextReadAt.current=Date.now()+Math.max(delay,askReadDelay(null,failures.current));setNextCheck(nextReadAt.current);
  },[save,adoptPage,synthetic]);
  useEffect(()=>{
    mounted.current=true;
    const restore=setTimeout(()=>{
      setClock(Date.now());
      if(!synthetic&&location.origin!==copy.serviceOrigin){setCorrectOrigin(false);setMessage(copy.apexOnly);return;}
      try{const initial=restoreAskTab(sessionStorage);save(initial,true);
        if(initial.pending)setMessage(copy.reloadUnknown);
        if(initial.control)setMessage(copy.controlPending);
      }catch{storageOkay.current=false;setStorageReady(false);setMessage(copy.storageUnavailable);}
      void refresh();
    },0);
    const timer=setInterval(()=>{const now=Date.now();setClock(now);if(visibleUntil.current&&now>=visibleUntil.current){visibleUntil.current=0;setPage(null);}void refresh();},5000);
    const visibility=()=>{if(document.hidden){epoch.current++;read.current?.abort();setPage(null);}else void refresh();};
    document.addEventListener('visibilitychange',visibility);
    const stop=()=>{mounted.current=false;epoch.current++;read.current?.abort();mutation.current?.abort();};
    return()=>{stop();clearTimeout(restore);clearInterval(timer);document.removeEventListener('visibilitychange',visibility);};
  },[refresh,save,synthetic]);
  const run=useCallback(async(action:(signal:AbortSignal)=>Promise<void>)=>{
    if(writing.current||!correctOrigin)return;
    writing.current=true;epoch.current++;read.current?.abort();setBusy(true);
    const controller=new AbortController();mutation.current=controller;
    try{await action(controller.signal);}
    catch(error){
      if(!mounted.current)return;
      setPage(null);
      if(error instanceof AskRequestError){
        if((error.code==='FORBIDDEN'||error.code==='NOT_FOUND'&&current.current?.control)&&current.current?.session){setLostAccess(true);setConsentIdentity(null);}
        if(error.retryAfterSeconds)setBlockedUntil(Date.now()+Math.min(86400,error.retryAfterSeconds)*1000);
        setMessage(error.code==='STORAGE_UNAVAILABLE'?copy.storageUnavailable:
          error.code==='RATE_LIMITED'||error.code==='BUDGET_EXHAUSTED'?copy.limitReached:
          error.code==='UNAVAILABLE'?copy.paused:
          error.code==='NOT_FOUND'?current.current?.control?copy.unavailableChat:copy.recordUnavailable:
          error.code==='FORBIDDEN'?copy.unavailableChat:
          current.current?.control?copy.controlPending:copy.unknown);
      }else setMessage(copy.error);
    }finally{writing.current=false;if(mounted.current)setBusy(false);}
  },[correctOrigin]);
  const send=async()=>run(async(signal)=>{
    let state=current.current;if(!state||state.control||!notice||!consent||lostAccess||blockedUntil>Date.now())return;
    if(state.pending&&!canReplayPending(state))return;
    if(!canReplayPending(state)&&!storageOkay.current)return;
    // Recheck the advertised identity for each mutation sequence; cached availability grants no authority.
    const status=await askRequest('AskAvailability','/availability',{signal});
    setAvailability(status);setCheckedAt(Date.now());
    if(!sameAskIdentity(status,notice)||!sameAskIdentity(consentIdentity,status)||state.sessionIdentity&&!sameAskIdentity(state.sessionIdentity,status)){
      setConsentIdentity(null);throw new AskRequestError('UNVERIFIED');
    }
    if(!canReplayPending(state)&&status.state!=='available')throw new AskRequestError('UNAVAILABLE');
    if(!state.pending&&(!draft.trim()||[...draft].length>2000||page?.turns.some(turn=>activeQuestion(turn.status.state))))return;
    if(!state.session){
      if(!state.sessionIdentity){state={...state,sessionIdentity:{serviceId:status.serviceId,privacyNoticeVersion:status.privacyNoticeVersion}};save(state);}
      const session=await askRequest('AskSession','/sessions',{method:'POST',id:state.sessionRequestId,
        value:{schemaVersion:'1.0',privacyNoticeVersion:state.sessionIdentity!.privacyNoticeVersion},signal});
      if(!sameAskIdentity(session,state.sessionIdentity))throw new AskRequestError('UNVERIFIED');
      state={...state,session};save(state);
    }
    if(!state.conversationId){
      const conversation=await askRequest('AskConversation','/conversations',{method:'POST',id:state.conversationRequestId,
        session:state.session!,value:{schemaVersion:'1.0'},signal});
      state={...state,conversationId:conversation.conversationId};save(state);
    }
    if(!state.pending){
      const prior=page?.turns.filter(turn=>turn.status.state==='answered'&&turn.answer).at(-1)?.questionId??null;
      state={...state,pending:{id:crypto.randomUUID(),admission:null,input:{schemaVersion:'1.0',text:draft.trim(),context:selectedContext,priorQuestionId:prior,language:'en'}}};save(state);
    }
    const accepted=await askRequest('AskAdmission',`/conversations/${state.conversationId}/questions`,{method:'POST',
      id:state.pending!.id,session:state.session!,value:state.pending!.input,signal});
    if(accepted.conversationId!==state.conversationId)throw new AskRequestError('UNVERIFIED');
    state={...state,pending:{...state.pending!,admission:{questionId:accepted.questionId,questionHash:accepted.questionHash}}};save(state,true);
    setMessage(copy.accepted);
    const fresh=await askConversation(state.conversationId!,state.session!,signal);
    if(!confirmsPending(state.pending!,fresh))throw new AskRequestError('UNVERIFIED');
    save({...state,pending:null},true);setDraft('');adoptPage(fresh);
  });
  const control=async(kind:'cancel'|'delete',questionId:string|null=null)=>run(async(signal)=>{
    let state=current.current;if(!state?.session||!state.conversationId)return;
    const command=state.control??{kind,questionId,id:crypto.randomUUID()};
    state={...state,control:command};save(state,true);setPage(null);setDraft('');setAnnouncement('');
    const result=await askRequest('AskControlReceipt',command.kind==='delete'?`/conversations/${state.conversationId}`:`/questions/${command.questionId}/cancel`,{
      method:command.kind==='delete'?'DELETE':'POST',id:command.id,session:state.session!,signal,
      ...(command.kind==='cancel'?{value:{schemaVersion:'1.0',reason:'visitor_cancelled'}}:{})});
    if(!controlSatisfied(command,state.conversationId!,result))throw new AskRequestError('UNVERIFIED');
    const next={...state,control:null,pending:pendingAfterControl(state.pending,result)};
    if(result.questionId===null){
      save({...next,conversationId:null,conversationRequestId:crypto.randomUUID()},true);
      setMessage(result.action==='delete'?copy.deleted:copy.expired);
    }else{
      save(next,true);setMessage(next.pending?copy.reloadUnknown:result.action==='expire'?copy.questionExpired:copy.cancelled);
      const fresh=await askConversation(state.conversationId!,state.session!,signal);adoptPage(fresh);
    }
  });
  const hasActive=!!page?.turns.some(turn=>activeQuestion(turn.status.state));
  const hasHistory=!!tab?.conversationId;
  const identityCompatible=!tab?.sessionIdentity||sameAskIdentity(tab.sessionIdentity,notice);
  return {availability,notice,roster,page,tab,draft,announcement,storageReady,lostAccess,correctOrigin,
    context:tab?.pending?.input?tab.pending.input.context:selectedContext,removeContext:()=>setSelectedContext(null),setDraft,
    consent,setConsent:(value:boolean)=>setConsentIdentity(value&&notice?{serviceId:notice.serviceId,privacyNoticeVersion:notice.privacyNoticeVersion}:null),busy,message,send,control,refresh,
    hasActive,hasHistory,canCheck:clock>=nextCheck&&!busy,canCompose:!!notice&&identityCompatible&&!lostAccess&&correctOrigin,
    canSend:!!tab&&(storageReady||canReplayPending(tab))&&consent&&identityCompatible&&!lostAccess&&!busy&&!tab.control&&blockedUntil<=clock&&
      clock-checkedAt<60000&&(availability?.state==='available'||canReplayPending(tab))&&(!hasActive||canReplayPending(tab))&&(!hasHistory||!!page||!!tab.pending)&&
      (tab.pending?canReplayPending(tab):draft.trim().length>0&&[...draft].length<=2000&&(page?.turns.filter(turn=>turn.answer).length??0)<8),
    newSession:()=>{if(lostAccess||!tab?.pending&&!tab?.control&&!hasActive){epoch.current++;read.current?.abort();save(freshAskTab(),true);setLostAccess(false);setPage(null);setDraft('');setConsentIdentity(null);setMessage(copy.forgotten);}},
  };
}
