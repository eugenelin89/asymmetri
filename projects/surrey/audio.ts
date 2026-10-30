// SPDX-License-Identifier: MIT — original synthesised chimes; opt-in, no downloaded audio.
export function createCityAudio() {
  let context: AudioContext | null = null, volume = 0, lastBeat = -1, disposed = false;
  const voices = new Set<OscillatorNode>();
  function mute() { for (const voice of voices) { try { voice.stop(); } catch { /* Already ended. */ } voice.disconnect(); } voices.clear(); }
  return {
    async volume(value: number) {
      if (disposed) return;
      volume = Math.max(0, Math.min(1, value));
      if (!volume) { mute(); return; }
      try { context ??= new AudioContext(); await context.resume(); } catch { /* Audio is optional when browser policy disallows it. */ }
    },
    tick(seconds: number, distance: number, active: boolean) {
      if (!active || !volume) { mute(); return; }
      const beat = Math.floor(seconds / 2);
      if (!context || context.state !== "running" || beat === lastBeat || distance > 45) return;
      lastBeat = beat;
      const tone = context.createOscillator(), gain = context.createGain(), now = context.currentTime;
      tone.type = "sine"; tone.frequency.value = [261.63, 329.63, 392, 329.63][beat % 4];
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(volume * .06 * (1 - distance / 45), now + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + .7);
      tone.connect(gain); gain.connect(context.destination); voices.add(tone);
      tone.onended = () => { voices.delete(tone); tone.disconnect(); gain.disconnect(); };
      tone.start(); tone.stop(now + .75);
    },
    mute,
    dispose() { disposed = true; mute(); void context?.close(); context = null; },
  };
}
