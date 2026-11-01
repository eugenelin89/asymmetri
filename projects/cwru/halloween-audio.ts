import type { Pose, Settings } from "./types";
export type SoundSource = { id:string; x:number; y:number; z:number; kind:"ghost"|"wolf" };
export type ScareSound = "howl"|"cry"|"scream";
type PlaybackSession = { type: string };
type AudioOptions = { audioSession?: () => PlaybackSession | null };
export const audioPreferenceKey = "cwru-halloween-audio-v1";
export function soundPlacement(listener:Pick<Pose,"x"|"y"|"z"|"yaw">,source:Pick<SoundSource,"x"|"y"|"z">,range=30){
 const dx=source.x-listener.x,dz=source.z-listener.z,distance=Math.hypot(dx,dz,(source.y-listener.y)*2);
 return {distance,gain:Math.max(0,1-distance/range)**2,pan:Math.max(-1,Math.min(1,(dx*Math.cos(listener.yaw)-dz*Math.sin(listener.yaw))/Math.max(1,distance)))};
}
/** Bounded encounter cues: no pile-up when a crowd surrounds the visitor. */
export function createSoundDirector(){
 let elapsed=0,nextHowl=6,nextGhost=3,ghostCount=0;
 const recent=new Map<string,number>();
 return { reset(){elapsed=0;nextHowl=6;nextGhost=3;ghostCount=0;recent.clear();},
  update(dt:number,enabled:boolean,paused:boolean,pose:Pose,sources:SoundSource[]){
   const cues:{kind:ScareSound;gain:number;pan:number;source?:SoundSource}[]=[];
   if(!enabled||paused)return cues;
   elapsed+=Math.max(0,Math.min(.1,dt));
   if(elapsed>=nextHowl){
    const wolf=sources.filter(s=>s.kind==='wolf').map(s=>({s,...soundPlacement(pose,s,100)})).sort((a,b)=>a.distance-b.distance)[0];
    cues.push({kind:'howl',gain:wolf?.gain?Math.max(.22,wolf.gain)*.65:.32,pan:wolf?.pan??Math.sin(elapsed*.13)*.75,source:wolf?.s});
    nextHowl=elapsed+24+(Math.sin(elapsed)*.5+.5)*17;
   }
   if(elapsed>=nextGhost){
    const ghost=sources.filter(s=>s.kind==='ghost').map(s=>({s,...soundPlacement(pose,s,26)})).filter(s=>s.gain>.02&&elapsed-(recent.get(s.s.id)??-100)>14).sort((a,b)=>a.distance-b.distance)[0];
    if(ghost){
     const kind:ScareSound=ghost.distance<10&&++ghostCount%3===0?'scream':'cry';
     cues.push({kind,gain:Math.min(.7,ghost.gain*.9),pan:ghost.pan,source:ghost.s});recent.set(ghost.s.id,elapsed);nextGhost=elapsed+7;
    }
   }
   return cues;
  }
 };
}

/** Original synthesized film-style score and creatures. No recordings, network
 * requests, microphone permissions or third-party music. Created by user gesture.
 */
export function createHalloweenAudio(options:AudioOptions={}){
 let context:AudioContext|null=null,master:GainNode|null=null,reverb:ConvolverNode|null=null,ready=false,enabled=false,volume=.35,nextPhrase=0,phrase=0,hidden=typeof document!=='undefined'&&document.hidden;
 let disposed=false,gestureGranted=false,resumeAttempt=0;
 let sessionLease:{session:PlaybackSession;previous:string;active:boolean}|null=null;
 function claimPlaybackSession(){
  if(!gestureGranted||!context||disposed||!enabled||hidden||volume<=0)return;
  try{
   const session=options.audioSession?options.audioSession():typeof navigator==='undefined'?null:(navigator as Navigator & {audioSession?:PlaybackSession}).audioSession;
   if(!session)return;
   if(sessionLease){
    if(sessionLease.session!==session||sessionLease.active||session.type!==sessionLease.previous)return;
    session.type='playback';sessionLease.active=session.type==='playback';return;
   }
   const previous=session.type;
   if(typeof previous!=='string'||previous==='playback')return;
   // WebKit documents playback through iPhone Silent Mode on supported browsers.
   // https://bugs.webkit.org/show_bug.cgi?id=237322#c6
   session.type='playback';
   if(session.type==='playback')sessionLease={session,previous,active:true};
  }catch{/* Optional API; ordinary Web Audio remains available. */}
 }
 function releasePlaybackSession(){
  if(!sessionLease?.active)return;
  sessionLease.active=false;
  try{if(sessionLease.session.type==='playback')sessionLease.session.type=sessionLease.previous;}catch{/* Never break mute or disposal. */}
 }
 const active=new Set<AudioScheduledSourceNode>(),director=createSoundDirector();
 const clamp=(v:number)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):.35;
 function track(node:AudioScheduledSourceNode,nodes:AudioNode[],end:number){
  active.add(node);node.onended=()=>{active.delete(node);node.disconnect();nodes.forEach(n=>n.disconnect());};node.stop(end);
 }
 function envelope(start:number,duration:number,level:number,pan=0,attack=.6){
  const c=context!,gain=c.createGain(),panner=c.createStereoPanner();
  gain.gain.setValueAtTime(.00001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.00002,level),start+Math.min(attack,duration*.3));
  gain.gain.setTargetAtTime(.00001,start+duration*.6,Math.max(.03,duration*.12));
  panner.pan.value=pan;gain.connect(panner);panner.connect(master!);panner.connect(reverb!);
  return {gain,panner};
 }
 function note(frequency:number,start:number,duration:number,level:number,pan=0,type:OscillatorType='sine',detune=0){
  const c=context!,osc=c.createOscillator(),filter=c.createBiquadFilter(),e=envelope(start,duration,level,pan);
  osc.type=type;osc.frequency.value=frequency;osc.detune.value=detune;
  filter.type='lowpass';filter.frequency.value=type==='sawtooth'?480:1600;filter.Q.value=.6;
  osc.connect(filter);filter.connect(e.gain);osc.start(start);track(osc,[filter,e.gain,e.panner],start+duration+.1);
 }
 function score(){
  const c=context!,now=c.currentTime,roots=[55,51.913,58.27,49],root=roots[phrase%roots.length];
  for(const [ratio,pan] of [[1,-.45],[1.006,.45],[1.5,-.2],[2.12,.2]])note(root*ratio,now,17,.035,pan,'sawtooth');
  const motif=[0,7,1,6,0,8,7,1];
  for(let i=0;i<8;i++){
   const f=root*4*2**(motif[(i+phrase)%8]/12),start=now+1.7+i*1.6;
   note(f,start,3.4,.032,Math.sin(i*1.8)*.6);note(f*2.76,start+.015,1.9,.006,-Math.sin(i*1.8)*.4);
  }
  nextPhrase=now+14.4;phrase++;
 }
 function creature(kind:ScareSound,gain:number,pan:number,source?:SoundSource){
  if(!context||!enabled||!ready)return;
  const c=context,now=c.currentTime,duration=kind==='howl'?5.2:kind==='cry'?4.4:2.5;
  const base=kind==='howl'?155:kind==='cry'?340:670;
  const pitches=kind==='howl'?[.75,1.1,1.8,1.9,1.7,1.2,.8]:kind==='cry'?[.7,1.2,.75,1.35,.8,1.1,.6]:[.7,1.5,1.35,1.6,.9,.65];
  const e=envelope(now,duration,.115,pan,kind==='scream'?.12:.7),spatial=c.createGain();
  spatial.gain.value=gain;e.gain.disconnect();e.gain.connect(spatial);spatial.connect(e.panner);
  for(const [harmonic,amount] of [[1,1],[2,.25],[3,.08]]){
   const osc=c.createOscillator(),level=c.createGain();osc.type='sine';level.gain.value=amount;
   pitches.forEach((p,i)=>{const at=now+i*duration/(pitches.length-1);if(!i)osc.frequency.setValueAtTime(base*p*harmonic,at);else osc.frequency.exponentialRampToValueAtTime(base*p*harmonic,at);});
   const vibrato=c.createOscillator(),depth=c.createGain();vibrato.frequency.value=kind==='howl'?3.7:6.1;depth.gain.value=kind==='howl'?5:kind==='cry'?13:30;
   vibrato.connect(depth);depth.connect(osc.frequency);osc.connect(level);level.connect(e.gain);osc.start(now);vibrato.start(now);
   track(osc,[level],now+duration+.1);track(vibrato,[depth],now+duration+.1);
  }
  // Breath/noise adds a restrained rough edge to cries and screams.
  const noise=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),samples=noise.getChannelData(0);
  let seed=phrase*737+Math.floor(now*10)+19;
  for(let i=0;i<samples.length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;samples[i]=((seed>>>0)/4294967296*2-1)*.12;}
  const breath=c.createBufferSource(),filter=c.createBiquadFilter();breath.buffer=noise;filter.type='bandpass';filter.frequency.value=kind==='howl'?600:kind==='cry'?1100:1900;filter.Q.value=.6;
  breath.connect(filter);filter.connect(e.gain);breath.start(now);track(breath,[filter,e.gain,spatial,e.panner],now+duration+.2);
  if(source)voices.push({panner:e.panner,gain:spatial,source,expires:now+duration});
 }
 const voices:{panner:StereoPannerNode;gain:GainNode;source:SoundSource;expires:number}[]=[];
 function stop(){for(const node of active){try{node.stop();}catch{}}active.clear();voices.length=0;nextPhrase=0;director.reset();}
 async function unlock(){
  if(disposed||!enabled||hidden||volume<=0)return false;
  const attempt=++resumeAttempt;
  gestureGranted=true;
  if(sessionLease&&!sessionLease.active)sessionLease=null;
  try{
   if(!context){
    context=new AudioContext();master=context.createGain();master.gain.value=0;
    const compressor=context.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=14;compressor.ratio.value=5;compressor.attack.value=.01;compressor.release.value=.25;
    master.connect(compressor);compressor.connect(context.destination);
    reverb=context.createConvolver();const impulse=context.createBuffer(2,Math.floor(context.sampleRate*2.2),context.sampleRate);
    for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);let seed=1729+ch;for(let i=0;i<a.length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;a[i]=((seed>>>0)/4294967296*2-1)*Math.pow(1-i/a.length,3)*.18;}}
    reverb.buffer=impulse;reverb.connect(master);
   }
   claimPlaybackSession(); // Before awaiting the explicit user-gesture resume.
   const current=context;
   if(current.state!=='running')await current.resume();
   if(disposed||context!==current)return false;
   if(attempt===resumeAttempt){
    ready=current.state==='running';
    if(!ready){gestureGranted=false;releasePlaybackSession();}
   }
   return current.state==='running';
  }catch{if(attempt===resumeAttempt){ready=false;gestureGranted=false;releasePlaybackSession();}return false;}
 }
 function configure(settings:Pick<Settings,'halloween'|'halloweenSound'|'halloweenVolume'>){
  if(disposed)return;
  volume=clamp(settings.halloweenVolume);
  const next=settings.halloween&&settings.halloweenSound&&volume>0;
  if(enabled&&!next)stop();enabled=next;
  if(enabled)claimPlaybackSession();else releasePlaybackSession();
  if(master&&context)master.gain.setTargetAtTime(enabled&&!hidden?volume:0,context.currentTime,.08);
 }
 function update(dt:number,pose:Pose,sources:SoundSource[],paused=false){
  if(!context||!ready||!enabled||hidden||context.state!=='running')return;
  if(context.currentTime>=nextPhrase)score();
  for(const cue of director.update(dt,true,paused,pose,sources))creature(cue.kind,cue.gain,cue.pan,cue.source);
  for(let i=voices.length-1;i>=0;i--){
   const v=voices[i];if(v.expires<context.currentTime){voices.splice(i,1);continue;}
   const current=sources.find(s=>s.id===v.source.id)||v.source,placement=soundPlacement(pose,current,current.kind==='wolf'?100:26);
   v.panner.pan.setTargetAtTime(placement.pan,context.currentTime,.15);
   v.gain.gain.setTargetAtTime(Math.min(.7,placement.gain*(current.kind==='wolf'?.65:.9)),context.currentTime,.18);
  }
 }
 function visibility(value:boolean){
  if(disposed)return;hidden=value;
  if(hidden){releasePlaybackSession();stop();}else claimPlaybackSession();
  if(master&&context)master.gain.setTargetAtTime(enabled&&!hidden?volume:0,context.currentTime,.05);
 }
 // Own visibility from the gesture onward, including while campus assets load.
 const onDocumentVisibility=()=>visibility(document.hidden);
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',onDocumentVisibility);
 return {unlock,configure,update,visibility,stop,preview(){creature('howl',.55,0);},
  status:()=>context?.state||'not-started',
  dispose(){if(disposed)return;disposed=true;if(typeof document!=='undefined')document.removeEventListener('visibilitychange',onDocumentVisibility);gestureGranted=false;releasePlaybackSession();stop();void context?.close().catch(()=>{});context=null;master=null;reverb=null;ready=false;enabled=false;}
 };
}
