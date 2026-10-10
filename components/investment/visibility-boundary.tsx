'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { publicRead, pollDelay } from './desk';
import type { PublicStatus } from '@/receiver/vendor/investment/v1/types';
/** Visibility witness includes receiver and visibility epochs. Never retain withdrawn cards across a refresh. */
export function VisibilityBoundary({revision,run,enabled,children}:{revision?:string;run?:string;enabled:boolean;children:ReactNode}) {
  const router=useRouter(),[expected,setExpected]=useState<string|undefined>(revision),[unavailable,setUnavailable]=useState(false),current=useRef(revision);
  useEffect(()=>{current.current=revision;},[revision]);
  useEffect(()=>{
    if(!enabled)return;
    let stopped=false,timer:ReturnType<typeof setTimeout>,busy=false,failures=0;
    const verify=async()=>{
      if(busy||document.hidden||stopped)return;
      busy=true;
      try {
        const result=await publicRead<PublicStatus>('status',run);
        if(stopped)return;
        if(!result.data){setUnavailable(true);failures++;return;}
        failures=0;setUnavailable(false);
        if(result.fingerprint!==current.current){setExpected(result.fingerprint);router.refresh();}
        else setExpected(current.current);
      }catch{if(!stopped){setUnavailable(true);failures++;}}finally{busy=false;}
    };
    const schedule=()=>{timer=setTimeout(async()=>{await verify();if(!stopped)schedule();},Math.max(15000,pollDelay(failures,document.hidden)));};schedule();
    const resume=()=>{if(!document.hidden)void verify();};
    const restored=(event:PageTransitionEvent)=>{if(event.persisted){setUnavailable(true);void verify();}};
    document.addEventListener('visibilitychange',resume);window.addEventListener('pageshow',restored);
    return()=>{stopped=true;clearTimeout(timer);document.removeEventListener('visibilitychange',resume);window.removeEventListener('pageshow',restored);};
  },[enabled,run,router]);
  if(enabled&&(unavailable||expected!==revision))return <div className="archive-notice" role="status"><p>Verifying current archive visibility. Previously displayed records are hidden while the archive is unavailable or has changed.</p><button onClick={()=>router.refresh()}>Refresh page</button></div>;
  return <div key={revision}>{children}</div>;
}
