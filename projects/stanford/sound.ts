import type { Point, Pose, Settings } from "./types";
export type SoundEmitter={id:string;kind:string;point:Point;y?:number};
type SoundPreferences = Pick<Settings, "halloween" | "sound" | "soundVolume">;
type PlaybackSession = { type: string };
export function proximityMix(pose:Pick<Pose,"x"|"y"|"z"|"yaw">,point:Point,y=0) {
  const dx=point[0]-pose.x,dz=point[1]-pose.z,distance=Math.hypot(dx,dz,y-pose.y);
  return {distance,gain:Math.max(0,1-distance/65)**2,pan:Math.max(-1,Math.min(1,(dx*Math.cos(pose.yaw)-dz*Math.sin(pose.yaw))/Math.max(1,distance)))};
}
/** Original procedural horror score and creature voices. No recordings, network,
 * microphone, voice cloning or external audio assets. Start on a visitor gesture. */
export function createCampusSound(onStatus?:(message:string)=>void) {
  const context=new AudioContext(),master=context.createGain(),compressor=context.createDynamicsCompressor();
  master.gain.value=0;compressor.threshold.value=-20;compressor.knee.value=16;compressor.ratio.value=7;compressor.attack.value=.02;compressor.release.value=.3;
  master.connect(compressor);compressor.connect(context.destination);
  const reverb=context.createConvolver(),wet=context.createGain();wet.gain.value=.22;
  const impulse=context.createBuffer(2,context.sampleRate*2.8,context.sampleRate);
  for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2.6)*.5;}
  reverb.buffer=impulse;reverb.connect(wet);wet.connect(master);
  const bed=context.createGain();bed.gain.value=.095;bed.connect(master);bed.connect(reverb);
  const continuous:AudioScheduledSourceNode[]=[],voices=new Set<AudioScheduledSourceNode>();
  const connectVoice=(node:AudioNode,gain:GainNode,pan:number)=>{const p=context.createStereoPanner();p.pan.value=pan;node.connect(gain);gain.connect(p);p.connect(master);p.connect(reverb);return p;};
  const startOsc=(frequency:number,type:OscillatorType,gain:number,detune=0)=>{
    const osc=context.createOscillator(),amp=context.createGain(),filter=context.createBiquadFilter();
    osc.type=type;osc.frequency.value=frequency;osc.detune.value=detune;amp.gain.value=gain;filter.type="lowpass";filter.frequency.value=900;
    osc.connect(filter);filter.connect(amp);amp.connect(bed);osc.start();continuous.push(osc);
    const lfo=context.createOscillator(),depth=context.createGain();lfo.frequency.value=.06+frequency/1400;depth.gain.value=gain*.42;lfo.connect(depth);depth.connect(amp.gain);lfo.start();continuous.push(lfo);
  };
  // Detuned minor cluster, fifth and occasional tritone: slowly breathing strings.
  [55,65.406,82.407,110,155.563].forEach((f,i)=>{startOsc(f,"triangle",i<2?.3:.13,i%2?5:-5);});
  const noiseBuffer=context.createBuffer(1,context.sampleRate*5,context.sampleRate),noiseData=noiseBuffer.getChannelData(0);
  let brown=0;for(let i=0;i<noiseData.length;i++){brown=(brown+(Math.random()*2-1)*.025)/1.025;noiseData[i]=brown*3;}
  const wind=context.createBufferSource(),windFilter=context.createBiquadFilter(),windGain=context.createGain();
  wind.buffer=noiseBuffer;wind.loop=true;windFilter.type="bandpass";windFilter.frequency.value=380;windFilter.Q.value=.6;windGain.gain.value=.12;wind.connect(windFilter);windFilter.connect(windGain);windGain.connect(bed);wind.start();continuous.push(wind);
  let disposed=false,clock=0,nextWolf=8,nextBell=5,lastGhost=0,eventCount=0;
  let authorized=false,enabled=false,volume=0,resumeVersion=0,playbackRequested=false;
  let restoreSession:{session:PlaybackSession;previous:string}|null=null;
  const audible=()=>authorized&&enabled&&!document.hidden&&!disposed;
  function releasePlayback() {
    const previous=restoreSession;restoreSession=null;
    if(!previous)return;
    try {
      // Another feature may have changed this document's audio policy meanwhile.
      if(previous.session.type==="playback")previous.session.type=previous.previous;
    } catch { /* Session support is optional; never interfere with mute/disposal. */ }
  }
  function claimPlayback() {
    if(restoreSession)return;
    try {
      const session=(navigator as Navigator & {audioSession?:PlaybackSession}).audioSession;
      if(!session||typeof session.type!=="string"||session.type==="playback")return;
      const previous=session.type;
      session.type="playback";
      if(session.type==="playback")restoreSession={session,previous};
    } catch { /* Unsupported/restricted browsers retain their normal Web Audio behavior. */ }
  }
  function preferences(settings:SoundPreferences) {
    const next=settings.halloween&&settings.sound&&settings.soundVolume>0;
    if(enabled&&!next)resumeVersion++;
    enabled=next;volume=Math.max(0,Math.min(1,settings.soundVolume));
  }
  function refreshOutput(retry=false) {
    const active=audible();
    master.gain.setTargetAtTime(active?volume*.8:0,context.currentTime,.3);
    if(!active){playbackRequested=false;releasePlayback();}
    else if(!playbackRequested||retry){playbackRequested=true;claimPlayback();}
  }
  async function resumeContext() {
    const version=++resumeVersion;
    refreshOutput(true);
    try {
      await context.resume();
      if(disposed)return;
      if(!audible()) {
        refreshOutput();
        if(document.hidden)void context.suspend().catch(()=>{});
      }
      if(version===resumeVersion&&audible())onStatus?.("");
    } catch {
      if(disposed||version!==resumeVersion)return;
      authorized=false;refreshOutput();
      if(enabled&&!document.hidden)onStatus?.("Sound is paused by your browser. Use the Sound button to enable it.");
    }
  }
  const lastVoices=new Map<string,number>();
  function voice(kind:"howl"|"cry"|"scream"|"bell",strength:number,pan:number) {
    if(disposed||voices.size>9||context.state!=="running")return;
    const now=context.currentTime,duration=kind==="howl"?5.7:kind==="cry"?4.2:kind==="scream"?1.6:3;
    const amp=context.createGain();amp.gain.setValueAtTime(.0001,now);
    const peak=(kind==="scream"?.12:kind==="bell"?.09:.15)*Math.min(1,strength);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),now+(kind==="scream"?.25:1.15));amp.gain.exponentialRampToValueAtTime(.0001,now+duration);
    const mix=context.createGain(),panner=connectVoice(mix,amp,pan);
    for(let h=0;h<(kind==="bell"?3:2);h++) {
      const osc=context.createOscillator(),hg=context.createGain();osc.type=kind==="scream"?"triangle":"sine";hg.gain.value=h===0?1:.25;
      const base=kind==="howl"?260:kind==="cry"?430:kind==="scream"?820:220;
      const ratio=kind==="bell"?[1,2.76,5.4][h]:h?2.01:1;
      osc.frequency.setValueAtTime(base*ratio,now);osc.frequency.exponentialRampToValueAtTime(base*ratio*(kind==="bell"?1:kind==="scream"?1.9:1.6),now+duration*.3);osc.frequency.exponentialRampToValueAtTime(base*ratio*.7,now+duration);
      osc.connect(hg);hg.connect(mix);
      const vibrato=context.createOscillator(),depth=context.createGain();vibrato.frequency.value=kind==="cry"?5.8:4.2;depth.gain.value=kind==="bell"?0:base*.035;vibrato.connect(depth);depth.connect(osc.frequency);
      osc.start(now);vibrato.start(now);osc.stop(now+duration+.1);vibrato.stop(now+duration+.1);voices.add(osc);voices.add(vibrato);
      osc.onended=()=>{voices.delete(osc);voices.delete(vibrato);osc.disconnect();vibrato.disconnect();depth.disconnect();hg.disconnect();};
    }
    window.setTimeout(()=>{amp.disconnect();mix.disconnect();panner.disconnect();},(duration+.3)*1000);eventCount++;
  }
  async function resume(settings?:SoundPreferences) {
    if(disposed)return;
    // The caller supplies the effective choice during the Enter/Sound gesture,
    // before the scene has delivered its first frame (including Base or mute).
    authorized=true;if(settings)preferences(settings);refreshOutput();
    if(audible())await resumeContext();
  }
  function configure(settings:SoundPreferences) {
    if(disposed)return;
    preferences(settings);refreshOutput();
  }
  function update(dt:number,settings:Settings,pose:Pose,emitters:SoundEmitter[]) {
    if(disposed)return;
    // Preferences come directly from the controls. The asynchronously loaded
    // scene may still have default/stale settings during its first frames.
    refreshOutput();
    if(!audible()||context.state!=="running")return;
    clock+=Math.max(0,Math.min(dt,.25));
    if(clock>=nextWolf){const wolf=emitters.filter(e=>e.kind==="werewolf").sort((a,b)=>proximityMix(pose,a.point).distance-proximityMix(pose,b.point).distance)[0];const mix=wolf?proximityMix(pose,wolf.point):{gain:.2,pan:Math.sin(clock)};voice("howl",Math.max(.22,mix.gain),mix.pan);nextWolf=clock+21+Math.random()*11;}
    if(clock>=nextBell){voice("bell",.45,Math.sin(clock*.3)*.65);nextBell=clock+13+Math.random()*12;}
    if(settings.population && clock-lastGhost>7){
      const nearby=emitters.filter(e=>/ghost|yurei|jiangshi/.test(e.kind)).map(e=>({e,m:proximityMix(pose,e.point,e.y)})).filter(v=>v.m.distance<55&&clock-(lastVoices.get(v.e.id)??-99)>15).sort((a,b)=>a.m.distance-b.m.distance)[0];
      if(nearby){voice(nearby.m.distance<13&&eventCount%3===0?"scream":"cry",nearby.m.gain,nearby.m.pan);lastVoices.set(nearby.e.id,clock);lastGhost=clock;}
    }
  }
  const visibility=()=>{
    if(disposed)return;
    if(document.hidden){resumeVersion++;refreshOutput();void context.suspend().catch(()=>{});}
    else if(authorized&&enabled)void resumeContext();
  };document.addEventListener("visibilitychange",visibility);
  return {resume,configure,update,state:()=>({state:context.state,events:eventCount,activeVoices:voices.size}),dispose(){if(disposed)return;disposed=true;resumeVersion++;releasePlayback();document.removeEventListener("visibilitychange",visibility);for(const s of [...continuous,...voices]){try{s.stop();}catch{}}void context.close().catch(()=>{});}};
}
export type CampusSound=ReturnType<typeof createCampusSound>;
