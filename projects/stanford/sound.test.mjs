import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const {createCampusSound}=await import('./sound.ts');
const {defaults}=await import('./environment.ts');
const playing={...defaults,halloween:true,sound:true,soundVolume:.45};
const pose={x:0,y:0,z:0,yaw:0,pitch:0};

function fixture(t,nav={audioSession:{type:'ambient'}}) {
  const originals=new Map(),contexts=[],messages=[];
  const document=new EventTarget();document.hidden=false;
  const parameter=()=>({value:0,setValueAtTime(){},setTargetAtTime(value){this.value=value;},exponentialRampToValueAtTime(){}});
  const node=()=>({connect(){},disconnect(){},start(){},stop(){},gain:parameter(),frequency:parameter(),detune:parameter(),Q:parameter(),pan:parameter(),threshold:parameter(),knee:parameter(),ratio:parameter(),attack:parameter(),release:parameter()});
  class Context {
    state='suspended';sampleRate=20;currentTime=0;destination=node();resumeCalls=0;suspendCalls=0;closeCalls=0;resumeHook=null;
    constructor(){contexts.push(this);}
    createGain(){return node();}createDynamicsCompressor(){return node();}createConvolver(){return node();}
    createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createStereoPanner(){return node();}
    createBuffer(channels,length){const data=Array.from({length:channels},()=>new Float32Array(Math.ceil(length)));return {getChannelData:c=>data[c]};}
    async resume(){this.resumeCalls++;if(this.resumeHook)await this.resumeHook();this.state='running';}
    async suspend(){this.suspendCalls++;this.state='suspended';}
    async close(){this.closeCalls++;this.state='closed';}
  }
  for(const [key,value] of Object.entries({AudioContext:Context,document,navigator:nav,window:{setTimeout}})) {
    originals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));
    Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
  }
  const sound=createCampusSound(message=>messages.push(message));
  t.after(()=>{
    sound.dispose();
    for(const [key,descriptor]of originals)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];
  });
  let session;try{session=nav.audioSession;}catch{}
  return {sound,context:contexts[0],document,session,messages,
    update:settings=>{sound.configure(settings);sound.update(0,settings,pose,[]);},
    visibility:hidden=>{document.hidden=hidden;document.dispatchEvent(new Event('visibilitychange'));}};
}

test('playback starts on the explicit enabled gesture before the first scene update',async t=>{
  const f=fixture(t);
  assert.equal(f.session.type,'ambient');
  f.update(playing);assert.equal(f.session.type,'ambient','a frame alone cannot grant playback');
  const promise=f.sound.resume(playing);
  assert.equal(f.session.type,'playback');
  await promise;assert.equal(f.context.state,'running');assert.equal(f.context.resumeCalls,1);
});

test('Base, mute and zero-volume entry never claim playback or resume the context',async t=>{
  const f=fixture(t);
  for(const settings of [{...playing,halloween:false},{...playing,sound:false},{...playing,soundVolume:0}]) {
    await f.sound.resume(settings);f.update(settings);
    assert.equal(f.session.type,'ambient');assert.equal(f.context.resumeCalls,0);
  }
});

test('a delayed initial scene frame cannot overwrite the enabled gesture choice',async t=>{
  const f=fixture(t);await f.sound.resume(playing);
  f.sound.update(0,defaults,pose,[]);
  assert.equal(f.session.type,'playback');
});

test('enable then mute before the first frame cannot leave a silent playback role',async t=>{
  const f=fixture(t);const pending=f.sound.resume(playing);
  await f.sound.resume({...playing,sound:false});
  f.sound.update(0,playing,pose,[]);
  await pending;assert.equal(f.session.type,'ambient');
});

test('mute, Base and zero volume release the prior session type and allow a new gesture',async t=>{
  const f=fixture(t,{audioSession:{type:'auto'}});
  for(const settings of [{...playing,sound:false},{...playing,halloween:false},{...playing,soundVolume:0}]) {
    await f.sound.resume(playing);assert.equal(f.session.type,'playback');
    f.update(settings);assert.equal(f.session.type,'auto');
  }
  await f.sound.resume(playing);assert.equal(f.session.type,'playback');
});

test('hidden pages release playback and resume only if sound is still enabled',async t=>{
  const f=fixture(t);await f.sound.resume(playing);
  f.visibility(true);assert.equal(f.session.type,'ambient');assert.equal(f.context.state,'suspended');
  f.visibility(false);await Promise.resolve();assert.equal(f.session.type,'playback');assert.equal(f.context.state,'running');
  f.visibility(true);f.update({...playing,sound:false});const resumes=f.context.resumeCalls;
  f.visibility(false);await Promise.resolve();assert.equal(f.session.type,'ambient');assert.equal(f.context.resumeCalls,resumes);
});

test('an enabled gesture made while hidden waits until visibility returns',async t=>{
  const f=fixture(t);f.visibility(true);await f.sound.resume(playing);
  assert.equal(f.session.type,'ambient');assert.equal(f.context.resumeCalls,0);
  f.visibility(false);await Promise.resolve();assert.equal(f.session.type,'playback');
});

test('disposal restores the prior type once and prevents later visibility changes or gestures',async t=>{
  const f=fixture(t);await f.sound.resume(playing);f.sound.dispose();f.sound.dispose();
  assert.equal(f.session.type,'ambient');assert.equal(f.context.closeCalls,1);
  f.visibility(true);f.visibility(false);await f.sound.resume(playing);
  assert.equal(f.session.type,'ambient');assert.equal(f.context.resumeCalls,1);
});

test('an existing playback session and a later external policy change remain intact',async t=>{
  const f=fixture(t,{audioSession:{type:'playback'}});await f.sound.resume(playing);
  f.update({...playing,sound:false});assert.equal(f.session.type,'playback');
  f.session.type='ambient';await f.sound.resume(playing);assert.equal(f.session.type,'playback');
  f.session.type='play-and-record';f.update(playing);
  assert.equal(f.session.type,'play-and-record','ordinary frames must not fight another feature');
  f.sound.dispose();assert.equal(f.session.type,'play-and-record');
});

test('unsupported AudioSession retains ordinary Web Audio playback',async t=>{
  const f=fixture(t,{});await f.sound.resume(playing);f.update(playing);
  assert.equal(f.context.state,'running');assert.deepEqual(f.messages,['']);
});

test('restricted session setters do not prevent ordinary playback or mute',async t=>{
  const session={get type(){return 'auto';},set type(_){throw new Error('restricted');}};
  const f=fixture(t,{audioSession:session});await f.sound.resume(playing);f.update({...playing,sound:false});
  assert.equal(f.context.state,'running');assert.equal(session.type,'auto');assert.deepEqual(f.messages,['']);
});

test('restricted AudioSession getters gracefully fall back to Web Audio',async t=>{
  const f=fixture(t,{get audioSession(){throw new Error('restricted');}});
  await f.sound.resume(playing);f.visibility(true);f.visibility(false);await Promise.resolve();
  assert.equal(f.context.state,'running');assert.equal(f.context.resumeCalls,2);
});

test('failed resume releases playback and needs a fresh gesture to retry',async t=>{
  const f=fixture(t);f.context.resumeHook=()=>Promise.reject(new Error('activation required'));
  await f.sound.resume(playing);assert.equal(f.session.type,'ambient');assert.match(f.messages.at(-1),/Sound button/);
  f.update(playing);assert.equal(f.session.type,'ambient');assert.equal(f.context.resumeCalls,1);
  f.context.resumeHook=null;await f.sound.resume(playing);assert.equal(f.session.type,'playback');assert.equal(f.context.state,'running');
});

test('late resume after hiding cannot reacquire playback or leave the hidden context running',async t=>{
  const f=fixture(t);let finish;f.context.resumeHook=()=>new Promise(resolve=>{finish=resolve;});
  const pending=f.sound.resume(playing);f.visibility(true);finish();await pending;
  assert.equal(f.session.type,'ambient');assert.equal(f.context.state,'suspended');assert.equal(f.messages.length,0);
});

test('a stale failed resume cannot release a newer active session',async t=>{
  const f=fixture(t);let fail;f.context.resumeHook=()=>new Promise((_,reject)=>{fail=reject;});
  const pending=f.sound.resume(playing);f.visibility(true);f.context.resumeHook=null;f.visibility(false);
  fail(new Error('old request'));await pending;await Promise.resolve();
  assert.equal(f.session.type,'playback');assert.equal(f.context.state,'running');assert.deepEqual(f.messages,['']);
});
