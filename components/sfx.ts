// Synthesized sound effects — Web Audio API, no audio files needed.
let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, dur: number): AudioBuffer {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

export const sfx = {
  /** Ball hitting the floor — low thump */
  bounce() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.15);
  },

  /** Ball clanking off the rim — metallic ping */
  clank() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(340, t);
    o.frequency.exponentialRampToValueAtTime(190, t + 0.09);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.16);
  },

  /** Clean make — soft whoosh through the net */
  swish() {
    const c = ac(), t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.3);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(2600, t);
    f.frequency.exponentialRampToValueAtTime(900, t + 0.25);
    f.Q.value = 1.4;
    const g = c.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
  },

  /** Crowd cheering — noise swell */
  cheer() {
    const c = ac(), t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 1.4);
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1100;
    const g = c.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.25);
    g.gain.linearRampToValueAtTime(0.18, t + 0.8);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
  },

  /** Blocked shot / body hit — dull thud */
  thud() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(95, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.08);
    g.gain.setValueAtTime(0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.12);
  },

  /** Referee whistle — race start */
  whistle() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(2350, t);
    o.frequency.setValueAtTime(2500, t + 0.08);
    o.frequency.setValueAtTime(2350, t + 0.16);
    g.gain.setValueAtTime(0.2, t);
    g.gain.setValueAtTime(0.2, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.42);
  },

  /** Swim stroke splash — bright noise burst */
  splash() {
    const c = ac(), t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.16);
    const f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 1600;
    const g = c.createGain();
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
  },

  /** End-of-race buzzer */
  buzzer() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sawtooth";
    o.frequency.value = 170;
    g.gain.setValueAtTime(0.15, t);
    g.gain.setValueAtTime(0.15, t + 0.45);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.58);
  },
};
