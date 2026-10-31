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

test('audio lifecycle starts on a gesture and stops scheduled voices on mute, regular mode, hiding and disposal',async()=>{
 const original=globalThis.AudioContext,contexts=[];
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
