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

  /** Cash register "cha-ching" — two bell dings, drawer slide, thunk */
  cashRegister() {
    const c = ac(), t = c.currentTime;
    [1870, 2350].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      const at = t + i * 0.09;
      o.type = "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.1, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + 0.18);
      o.connect(g).connect(c.destination);
      o.start(at);
      o.stop(at + 0.2);
    });
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.14);
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.001, t + 0.16);
    ng.gain.linearRampToValueAtTime(0.22, t + 0.2);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    src.connect(f).connect(ng).connect(c.destination);
    src.start(t + 0.16);
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, t + 0.26);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.34);
    g.gain.setValueAtTime(0.3, t + 0.26);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.36);
    o.connect(g).connect(c.destination);
    o.start(t + 0.26);
    o.stop(t + 0.38);
  },

  /** Water droplet — quick "plink" then a rising bloop */
  droplet() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(1000, t);
    o.frequency.exponentialRampToValueAtTime(380, t + 0.035);
    o.frequency.exponentialRampToValueAtTime(760, t + 0.16);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.15, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.24);
  },

  /** Crowd of people cheering — layered voice-band roar with surges and whistles */
  cheer(dur = 2.4) {
    const c = ac(), t = c.currentTime;
    [
      { f: 500, q: 0.7, g: 0.32 },
      { f: 1400, q: 1.2, g: 0.16 },
    ].forEach((layer) => {
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(c, dur);
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = layer.f;
      f.Q.value = layer.q;
      const g = c.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(layer.g, t + 0.35);
      g.gain.setValueAtTime(layer.g, t + dur * 0.55);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      // Slow AM so the roar surges like voices, not static
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = 2.3;
      lg.gain.value = layer.g * 0.35;
      lfo.connect(lg).connect(g.gain);
      lfo.start(t);
      lfo.stop(t + dur);
      src.connect(f).connect(g).connect(c.destination);
      src.start(t);
    });
    // Stray celebration whistles
    for (let i = 0; i < 3; i++) {
      const o = c.createOscillator(), g = c.createGain();
      const st = t + 0.3 + Math.random() * Math.max(dur - 1.2, 0.3);
      o.type = "sine";
      o.frequency.setValueAtTime(1900 + Math.random() * 500, st);
      o.frequency.linearRampToValueAtTime(2300 + Math.random() * 400, st + 0.18);
      g.gain.setValueAtTime(0.001, st);
      g.gain.linearRampToValueAtTime(0.035, st + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
      o.connect(g).connect(c.destination);
      o.start(st);
      o.stop(st + 0.4);
    }
  },

  /** Standing ovation — dense random claps over a crowd roar */
  applause(dur = 3) {
    const c = ac(), t = c.currentTime;
    sfx.cheer(dur);
    const clapBuf = noiseBuffer(c, 0.03);
    const count = Math.floor(dur * 22);
    for (let i = 0; i < count; i++) {
      const st = t + Math.random() * dur * 0.9;
      const src = c.createBufferSource();
      src.buffer = clapBuf;
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1000 + Math.random() * 1500;
      f.Q.value = 1.5;
      const g = c.createGain();
      g.gain.setValueAtTime(0.03 + Math.random() * 0.06, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.028);
      src.connect(f).connect(g).connect(c.destination);
      src.start(st);
    }
  },

  /** Electronic swim-start signal — the sharp single beep every meet uses */
  startBeep() {
    const c = ac(), t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "square";
    o.frequency.value = 870;
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 3200;
    g.gain.setValueAtTime(0.22, t);
    g.gain.setValueAtTime(0.22, t + 0.16);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(f).connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.24);
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
