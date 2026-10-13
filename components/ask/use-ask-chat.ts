'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {AskAvailability,AskConversationPage,AskRoster,ContextRef} from '@/receiver/vendor/investment/v1/types';
import {askRequest,askConversation,AskRequestError,activeQuestion,confirmsPending,controlSatisfied,canReplayPending,askStateLabels} from '@/lib/ask-client';
import {askStorageKey,decodeAskTab,freshAskTab,type AskTab} from '@/lib/ask-client';
import {askExperience as copy} from '@/content/site';

export function useAskChat(context:ContextRef|null) {
  const [availability,setAvailability]=useState<AskAvailability|null>(null),[roster,setRoster]=useState<AskRoster|null>(null);
  const [page,setPage]=useState<AskConversationPage|null>(null),[tab,setTab]=useState<AskTab|null>(null);
  const [selectedContext,setSelectedContext]=useState(context),[announcement,setAnnouncement]=useState(''),[lostAccess,setLostAccess]=useState(false);
  const [draft,setDraft]=useState(''),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false);
  const [storageReady,setStorageReady]=useState(true);
  const [message,setMessage]=useState('Checking the local test service.'),[blockedUntil,setBlockedUntil]=useState(0),[clock,setClock]=useState(0);
  const lastStatus=useRef(''),announcedAnswers=useRef(new Set<string>());
  const current=useRef<AskTab|null>(null),writing=useRef(false),epoch=useRef(0),read=useRef<AbortController|null>(null);
  const mounted=useRef(false),storageOkay=useRef(true),mutation=useRef<AbortController|null>(null);
  const save=useCallback((next:AskTab,privacyControl=false)=>{
    try{sessionStorage.setItem(askStorageKey,JSON.stringify(next));}
    catch{storageOkay.current=false;setStorageReady(false);if(!privacyControl)throw new AskRequestError('STORAGE_UNAVAILABLE');
      try{sessionStorage.removeItem(askStorageKey);}catch{/* Current control remains retryable in memory. */}}
    current.current=next;setTab(next);
  },[]);
  const adoptPage=useCallback((next:AskConversationPage)=>{
    setPage(document.hidden?null:next);
    const latest=next.turns.at(-1),key=latest?[latest.questionId,latest.status.state,latest.answer?.answerId].join(':'):'';
    if(latest&&key!==lastStatus.current&&!document.hidden){lastStatus.current=key;
      if(latest.answer){const id=latest.answer.answerId;if(!announcedAnswers.current.has(id)){announcedAnswers.current.add(id);setAnnouncement('Verified answer '+announcedAnswers.current.size+' is available.');}}
      else setAnnouncement(askStateLabels[latest.status.state]);}
  },[]);
  const refresh=useCallback(async()=>{
    if(!mounted.current||writing.current||document.hidden)return;
    const token=++epoch.current;read.current?.abort();const controller=new AbortController();read.current=controller;
    try{
      const status=await askRequest('AskAvailability','/availability',{signal:controller.signal});
      if(status.serviceId!=='fixture-ask'||status.privacyNoticeVersion!=='fixture-privacy-1')throw new AskRequestError('UNVERIFIED');
      const people=await askRequest('AskRoster','/roster',{signal:controller.signal});
      if(people.serviceId!==status.serviceId)throw new AskRequestError('UNVERIFIED');
      const existing=current.current;
      const conversation=existing?.session&&existing.conversationId&&!existing.control?
        await askConversation(existing.conversationId,existing.session,controller.signal):null;
      if(!mounted.current||token!==epoch.current)return;
      if(conversation?.turns.some(turn=>turn.answer&&turn.answer.serviceId!==status.serviceId))throw new AskRequestError('UNVERIFIED');
      setAvailability(status);setRoster(people);if(conversation)adoptPage(conversation);else setPage(null);
      if(existing?.pending&&conversation&&confirmsPending(existing.pending,conversation)){
        save({...existing,pending:null},true);setDraft('');
      }
      if(!existing?.pending&&!existing?.control)setMessage(status.state==='available'?'Local test service checked.':
        status.state==='busy'?'The queue is full. Try again later.':'New questions are paused. Existing cancellation and deletion controls remain available.');
    }catch(error){
      if(!mounted.current||token!==epoch.current)return;
      setPage(null);setAvailability(null);setRoster(null);
      if(error instanceof AskRequestError&&error.code==='NOT_FOUND'&&current.current?.conversationId){
        save(freshAskTab(),true);setDraft('');setConsent(false);setMessage(copy.unavailableChat);
      }else if(!(error instanceof AskRequestError&&error.code==='ABORTED'))setMessage(copy.error);
    }
  },[save,adoptPage]);
  useEffect(()=>{
    mounted.current=true;
    const restore=setTimeout(()=>{
    setClock(Date.now());
    try{const saved=decodeAskTab(sessionStorage.getItem(askStorageKey));const initial=saved??freshAskTab();save(initial);
      if(initial.pending){setDraft(initial.pending.input.text);setConsent(true);setMessage(copy.unknown);}
      if(initial.control)setMessage('A privacy request is not yet confirmed. Retry that request before continuing.');
    }catch{storageOkay.current=false;setStorageReady(false);setMessage('This browser cannot retain the tab session needed for safe retries. Questions are disabled.');}
    void refresh();
    },0);
    const timer=setInterval(()=>{setClock(Date.now());void refresh();},30000);
    const visibility=()=>{if(document.hidden){epoch.current++;read.current?.abort();setPage(null);}
      else{void refresh();}};
    document.addEventListener('visibilitychange',visibility);
    const stop=()=>{mounted.current=false;epoch.current++;read.current?.abort();mutation.current?.abort();};
    return()=>{stop();clearTimeout(restore);clearInterval(timer);document.removeEventListener('visibilitychange',visibility);};
  },[refresh,save]);
  const run=async(action:(signal:AbortSignal)=>Promise<void>)=>{
    if(writing.current)return;
    writing.current=true;epoch.current++;read.current?.abort();setBusy(true);
    const controller=new AbortController();mutation.current=controller;
    try{await action(controller.signal);}
    catch(error){
      if(!mounted.current)return;
      setPage(null);
      if(error instanceof AskRequestError){
        if(current.current?.control&&(error.code==='NOT_FOUND'||error.code==='FORBIDDEN'))setLostAccess(true);
        if(error.retryAfterSeconds)setBlockedUntil(Date.now()+Math.min(3600,error.retryAfterSeconds)*1000);
        setMessage(error.code==='STORAGE_UNAVAILABLE'?'Tab storage is unavailable. Keep this tab open to check the current request and use privacy controls.':
          error.code==='RATE_LIMITED'||error.code==='BUDGET_EXHAUSTED'?'The service limit has been reached. Wait before retrying the same request.':
          error.code==='UNAVAILABLE'?'The service is paused. No new answer is promised.':
          error.code==='NOT_FOUND'?'The selected record or owned conversation is unavailable. Check the reference or session before trying again.':
          current.current?.control?'The privacy request is not confirmed. Retry the same request.':copy.unknown);
      }else setMessage(copy.error);
    }finally{writing.current=false;if(mounted.current)setBusy(false);}
  };
  const send=async()=>run(async(signal)=>{
    let state=current.current;if(!state||state.control||!consent||blockedUntil>Date.now())return;
    if(!canReplayPending(state)&&(!storageOkay.current||availability?.state!=='available'))return;
    const pending=state.pending;
    if(!pending&&(!draft.trim()||[...draft].length>2000||page?.turns.some(turn=>activeQuestion(turn.status.state))))return;
    if(!state.session){
      const session=await askRequest('AskSession','/sessions',{method:'POST',id:state.sessionRequestId,
        value:{schemaVersion:'1.0',privacyNoticeVersion:'fixture-privacy-1'},signal});
      if(session.serviceId!=='fixture-ask'||session.privacyNoticeVersion!=='fixture-privacy-1')throw new AskRequestError('UNVERIFIED');
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
    setMessage('Question accepted. Waiting for a verified status.');
    // Keep the request until an owned read confirms its input. Lost reads cannot create a fresh question.
    const fresh=await askConversation(state.conversationId!,state.session!,signal);
    if(!confirmsPending(state.pending!,fresh))throw new AskRequestError('UNVERIFIED');
    save({...state,pending:null},true);setDraft('');adoptPage(fresh);
  });
  const control=async(kind:'cancel'|'delete',questionId:string|null=null)=>run(async(signal)=>{
    let state=current.current;if(!state?.session||!state.conversationId)return;
    const command=state.control??{kind,questionId,id:crypto.randomUUID()};
    state={...state,control:command};save(state,true);setPage(null);
    const result=await askRequest('AskControlReceipt',command.kind==='delete'?`/conversations/${state.conversationId}`:`/questions/${command.questionId}/cancel`,{
      method:command.kind==='delete'?'DELETE':'POST',id:command.id,session:state.session!,signal,
      ...(command.kind==='cancel'?{value:{schemaVersion:'1.0',reason:'visitor_cancelled'}}:{})});
    if(!controlSatisfied(command,state.conversationId!,result))throw new AskRequestError('UNVERIFIED');
    const next={...state,control:null,pending:null};
    if(command.kind==='delete'||result.questionId===null){
      save({...next,conversationId:null,conversationRequestId:crypto.randomUUID()},true);setDraft('');
      setMessage(result.action==='delete'?'The receiver confirmed deletion. Late replies are suppressed. This does not verify deletion by another system.':'The receiver confirmed expiry. This conversation is no longer available.');
    }else{
      save(next,true);setDraft('');setMessage(result.action==='expire'?'The question expired before cancellation. The receiver confirms that late replies are suppressed.':'The receiver confirmed cancellation. No late answer will be shown for this turn.');
      const fresh=await askConversation(state.conversationId!,state.session!,signal);adoptPage(fresh);
    }
  });
  const hasActive=!!page?.turns.some(turn=>activeQuestion(turn.status.state));
  const hasHistory=!!tab?.conversationId;
  return {availability,roster,page,tab,draft,announcement,storageReady,lostAccess,context:tab?.pending?tab.pending.input.context:selectedContext,removeContext:()=>setSelectedContext(null),setDraft,consent,setConsent,busy,message,send,control,refresh,
    hasActive,hasHistory,canSend:!!tab&&(storageReady||canReplayPending(tab))&&consent&&!busy&&!tab.control&&blockedUntil<=clock&&
      (availability?.state==='available'||canReplayPending(tab))&&(!hasActive||canReplayPending(tab))&&(!hasHistory||!!page||!!tab.pending)&&
      (!!tab.pending||draft.trim().length>0&&[...draft].length<=2000&&(page?.turns.filter(turn=>turn.answer).length??0)<8),
    newSession:()=>{if(lostAccess||!tab?.pending&&!tab?.control&&!hasActive){save(freshAskTab(),true);setLostAccess(false);setPage(null);setDraft('');setConsent(false);setMessage(lostAccess?'Tab state forgotten. The earlier request or deletion could not be confirmed. A new session starts only when you send.':'A new session will be created only when you send.');}},
  };
}
