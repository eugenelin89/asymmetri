import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const {soundPlacement,createSoundDirector,createHalloweenAudio}=await import('./halloween-audio.ts');
const pose={x:0,y:0,z:0,yaw:0,pitch:0};
test('ghost sound has distance attenuation, left/right direction and floor separation',()=>{
 assert(soundPlacement(pose,{x:2,y:0,z:0}).gain>soundPlacement(pose,{x:20,y:0,z:0}).gain);
 assert(soundPlacement(pose,{x:2,y:0,z:0}).pan>0);assert(soundPlacement(pose,{x:-2,y:0,z:0}).pan<0);
 assert.equal(soundPlacement(pose,{x:50,y:0,z:0}).gain,0);
 assert(soundPlacement(pose,{x:0,y:4.2,z:0}).gain<soundPlacement(pose,{x:0,y:0,z:0}).gain);
});
test('sound director supplies howls, cries and occasional nearby screams without a cue pile-up',()=>{
 const d=createSoundDirector(),ghost={id:'near',kind:'ghost',x:3,y:0,z:0};const cues=[];
 for(let i=0;i<1000;i++){const next=d.update(.1,true,false,pose,[ghost]);assert(next.length<=2);cues.push(...next);}
 assert(cues.some(c=>c.kind==='howl'));assert(cues.some(c=>c.kind==='cry'));assert(cues.some(c=>c.kind==='scream'));
 assert(cues.length<15);assert(cues.every(c=>c.gain<=.7));
});
test('muting, scene pause and absent ghosts prevent proximity cues and reset clears the schedule',()=>{
 const d=createSoundDirector(),ghost={id:'near',kind:'ghost',x:3,y:0,z:0};
 for(let i=0;i<200;i++){assert.deepEqual(d.update(.1,false,false,pose,[ghost]),[]);assert.deepEqual(d.update(.1,true,true,pose,[ghost]),[]);}
 const cues=[];for(let i=0;i<200;i++)cues.push(...d.update(.1,true,false,pose,[]));assert(cues.every(c=>c.kind==='howl'));
 d.reset();assert.deepEqual(d.update(.1,true,false,pose,[ghost]),[]);
 const audio=createHalloweenAudio();assert.equal(audio.status(),'not-started');audio.dispose();
});


function fakeContexts(contexts){
 const param=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;}});
 class FakeContext {
  currentTime=0;sampleRate=80;state='suspended';sources=[];destination={};
  constructor(){contexts.push(this);}
  node(){return {connect(n){return n;},disconnect(){}};}
  createGain(){return {...this.node(),gain:param()};}
  createStereoPanner(){return {...this.node(),pan:param()};}
  createBiquadFilter(){return {...this.node(),frequency:param(),Q:param()};}
  createConvolver(){return this.node();}
  createDynamicsCompressor(){return {...this.node(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param()};}
  createBuffer(channels,length){const data=Array.from({length:channels},()=>new Float32Array(length));return {getChannelData(i){return data[i];}};}
  source(){const n={...this.node(),frequency:param(),detune:param(),started:false,stopped:false,start(){this.started=true;},stop(at){if(at===undefined){this.stopped=true;this.onended?.();}}};this.sources.push(n);return n;}
  createOscillator(){return this.source();} createBufferSource(){return this.source();}
  async resume(){this.state='running';} async close(){this.state='closed';}
 }
 return {FakeContext};
}
async function withAudioSession(session,run){
 const original=globalThis.AudioContext,contexts=[];
 const {FakeContext}=fakeContexts(contexts);globalThis.AudioContext=FakeContext;
 const audio=createHalloweenAudio({audioSession:typeof session==='function'?session:()=>session});
 try{return await run(audio,contexts,FakeContext);}finally{audio.dispose();globalThis.AudioContext=original;}
}
const soundOn={halloween:true,halloweenSound:true,halloweenVolume:.35};
test('audio lifecycle starts on a gesture and stops scheduled voices on mute, regular mode, hiding and disposal',async()=>{
 const original=globalThis.AudioContext,contexts=[];
 const {FakeContext}=fakeContexts(contexts);
 globalThis.AudioContext=FakeContext;
 try {
  const audio=createHalloweenAudio(),on={halloween:true,halloweenSound:true,halloweenVolume:.35};
  audio.configure(on);audio.update(.1,pose,[]);assert.equal(contexts.length,0);
  assert.equal(await audio.unlock(),true);assert.equal(contexts[0].sources.length,0);
  const c=contexts[0],playing=()=>c.sources.filter(n=>n.started&&!n.stopped).length;
  audio.configure(on);audio.update(.1,pose,[]);assert(playing()>0);
  audio.configure({...on,halloweenSound:false});assert.equal(playing(),0);
  audio.configure(on);audio.update(.1,pose,[]);assert(playing()>0);
  audio.visibility(true);assert.equal(playing(),0);audio.update(.1,pose,[]);assert.equal(playing(),0);
  audio.visibility(false);audio.update(.1,pose,[]);assert(playing()>0);
  audio.configure({...on,halloween:false});assert.equal(playing(),0);
  audio.dispose();assert.equal(c.state,'closed');
 } finally {globalThis.AudioContext=original;}
});


test('Silent Mode playback is claimed synchronously only after enabled audio receives a gesture',async()=>{
 const session={type:'ambient'};
 await withAudioSession(session,async(audio,contexts)=>{
  assert.equal(await audio.unlock(),false);assert.equal(contexts.length,0);
  audio.configure(soundOn);assert.equal(session.type,'ambient');assert.equal(contexts.length,0);
  const pending=audio.unlock();assert.equal(session.type,'playback');assert.equal(await pending,true);
  // Asset loading may delay engine configuration; no second gesture is needed.
  audio.configure({...soundOn,halloween:false});assert.equal(session.type,'ambient');
  audio.configure(soundOn);assert.equal(session.type,'playback');
  audio.dispose();assert.equal(session.type,'ambient');
 });
});
test('mute, Regular, zero volume, hiding and disposal release the owned playback category',async()=>{
 for(const patch of [{halloweenSound:false},{halloween:false},{halloweenVolume:0}]){
  const session={type:'auto'};
  await withAudioSession(session,async(audio)=>{
   audio.configure(soundOn);await audio.unlock();assert.equal(session.type,'playback');
   audio.configure({...soundOn,...patch});assert.equal(session.type,'auto');
   audio.configure(soundOn);assert.equal(session.type,'playback');
   audio.visibility(true);assert.equal(session.type,'auto');
   audio.configure(soundOn);assert.equal(session.type,'auto');
   audio.visibility(false);assert.equal(session.type,'playback');
   audio.dispose();assert.equal(session.type,'auto');assert.equal(await audio.unlock(),false);
  });
 }
});
test('Regular, mute, zero volume and hidden entry never construct or claim audio',async()=>{
 for(const patch of [{halloweenSound:false},{halloween:false},{halloweenVolume:0}]){
  const session={type:'ambient'};
  await withAudioSession(session,async(audio,contexts)=>{audio.configure({...soundOn,...patch});assert.equal(await audio.unlock(),false);assert.equal(contexts.length,0);assert.equal(session.type,'ambient');});
 }
 await withAudioSession({type:'ambient'},async(audio,contexts)=>{audio.configure(soundOn);audio.visibility(true);assert.equal(await audio.unlock(),false);assert.equal(contexts.length,0);});
});
test('existing playback and intervening media categories are preserved',async()=>{
 const existing={type:'playback'};await withAudioSession(existing,async(audio)=>{audio.configure(soundOn);await audio.unlock();audio.configure({...soundOn,halloweenSound:false});audio.dispose();assert.equal(existing.type,'playback');});
 const changed={type:'ambient'};await withAudioSession(changed,async(audio)=>{
  audio.configure(soundOn);await audio.unlock();changed.type='play-and-record';
  audio.visibility(true);audio.visibility(false);audio.configure(soundOn);assert.equal(changed.type,'play-and-record');
  audio.dispose();assert.equal(changed.type,'play-and-record');
 });
});
test('missing, throwing, readonly or ignored audioSession support keeps ordinary Web Audio available',async()=>{
 const readonly={get type(){return 'ambient';},set type(_){throw new Error('readonly');}};
 const ignored={get type(){return 'ambient';},set type(_){}};
 for(const session of [null,()=>{throw new Error('unsupported');},readonly,ignored]){
  await withAudioSession(session,async(audio)=>{audio.configure(soundOn);assert.equal(await audio.unlock(),true);assert.equal(audio.status(),'running');audio.configure({...soundOn,halloweenSound:false});});
 }
});
test('resume rejection releases playback without leaking an exception',async()=>{
 const session={type:'ambient'};
 await withAudioSession(session,async(audio,contexts,FakeContext)=>{
  FakeContext.prototype.resume=async function(){throw new Error('blocked');};
  audio.configure(soundOn);assert.equal(await audio.unlock(),false);assert.equal(session.type,'ambient');
 });
});
test('mute or dispose during pending resume cannot reclaim playback',async()=>{
 for(const action of ['mute','dispose']){
  const session={type:'ambient'};let finish;
  await withAudioSession(session,async(audio,contexts,FakeContext)=>{
   FakeContext.prototype.resume=function(){return new Promise(resolve=>{finish=()=>{this.state='running';resolve();};});};
   audio.configure(soundOn);const pending=audio.unlock();assert.equal(session.type,'playback');
   if(action==='mute')audio.configure({...soundOn,halloweenSound:false});else audio.dispose();
   assert.equal(session.type,'ambient');finish();await pending;assert.equal(session.type,'ambient');
  });
 }
});
test('an older failed resume cannot release a newer successful gesture',async()=>{
 const session={type:'ambient'};let fail;
 await withAudioSession(session,async(audio,contexts,FakeContext)=>{
  let count=0;FakeContext.prototype.resume=function(){if(++count===1)return new Promise((_,reject)=>{fail=reject;});this.state='running';return Promise.resolve();};
  audio.configure(soundOn);const first=audio.unlock();assert.equal(await audio.unlock(),true);
  fail(new Error('older attempt'));assert.equal(await first,false);assert.equal(session.type,'playback');assert.equal(audio.status(),'running');
 });
});

test('visibility is owned before campus assets load and its listener is removed on disposal',async()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'document'),listeners=new Set();
 const document={hidden:false,addEventListener(name,callback){assert.equal(name,'visibilitychange');listeners.add(callback);},removeEventListener(name,callback){assert.equal(name,'visibilitychange');listeners.delete(callback);}};
 Object.defineProperty(globalThis,'document',{configurable:true,value:document});
 try{
  const session={type:'ambient'};
  await withAudioSession(session,async(audio)=>{
   audio.configure(soundOn);await audio.unlock();assert.equal(listeners.size,1);assert.equal(session.type,'playback');
   document.hidden=true;for(const callback of listeners)callback();assert.equal(session.type,'ambient');
   audio.configure(soundOn);assert.equal(session.type,'ambient');
   document.hidden=false;for(const callback of listeners)callback();assert.equal(session.type,'playback');
   audio.dispose();assert.equal(listeners.size,0);assert.equal(session.type,'ambient');
  });
 }finally{if(previous)Object.defineProperty(globalThis,'document',previous);else delete globalThis.document;}
});
