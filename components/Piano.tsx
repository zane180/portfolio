"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const WHITE_KEYS = [
  { note: "C4", freq: 261.63, key: "A", label: "C" },
  { note: "D4", freq: 293.66, key: "S", label: "D" },
  { note: "E4", freq: 329.63, key: "D", label: "E" },
  { note: "F4", freq: 349.23, key: "F", label: "F" },
  { note: "G4", freq: 392.0, key: "G", label: "G" },
  { note: "A4", freq: 440.0, key: "H", label: "A" },
  { note: "B4", freq: 493.88, key: "J", label: "B" },
  { note: "C5", freq: 523.25, key: "K", label: "C" },
];

const BLACK_KEYS = [
  { note: "C#4", freq: 277.18, key: "W", position: 0 },
  { note: "D#4", freq: 311.13, key: "E", position: 1 },
  { note: "F#4", freq: 369.99, key: "T", position: 3 },
  { note: "G#4", freq: 415.3, key: "Y", position: 4 },
  { note: "A#4", freq: 466.16, key: "U", position: 5 },
];

export default function Piano() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [lastNote, setLastNote] = useState<string | null>(null);
  const activeOscillators = useRef<Map<string, [OscillatorNode, GainNode]>>(new Map());

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const playNote = useCallback((note: string, freq: number) => {
    if (activeOscillators.current.has(note)) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    // Slight detune for richness
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq, now);
    osc2.detune.setValueAtTime(7, now);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.15, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.15);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);
    osc.start(now);
    osc2.start(now);

    activeOscillators.current.set(note, [osc, gain]);
    setPressed((p) => new Set(p).add(note));
    setLastNote(note.replace(/\d/, ""));
  }, []);

  const stopNote = useCallback((note: string) => {
    const pair = activeOscillators.current.get(note);
    if (!pair) return;
    const [osc, gain] = pair;
    const ctx = getCtx();
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.stop(now + 0.35);
    activeOscillators.current.delete(note);
    setPressed((p) => {
      const next = new Set(p);
      next.delete(note);
      return next;
    });
  }, []);

  useEffect(() => {
    const keyMap = new Map<string, { note: string; freq: number }>();
    [...WHITE_KEYS, ...BLACK_KEYS].forEach((k) => {
      keyMap.set(k.key.toLowerCase(), { note: k.note, freq: k.freq });
    });

    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = keyMap.get(e.key.toLowerCase());
      if (k) playNote(k.note, k.freq);
    };
    const onUp = (e: KeyboardEvent) => {
      const k = keyMap.get(e.key.toLowerCase());
      if (k) stopNote(k.note);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [playNote, stopNote]);

  const whiteW = 56;
  const whiteH = 180;
  const blackW = 34;
  const blackH = 110;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="chapter-label mb-2">Interactive</p>
        <h3 className="text-3xl font-black text-white">Piano</h3>
        <p className="text-slate-500 text-sm mt-1">
          Click keys or use keyboard{" "}
          <span className="font-mono text-purple-400">A S D F G H J K</span>
        </p>
      </div>

      {/* Note display */}
      <div className="h-8 flex items-center justify-center">
        {lastNote && (
          <span className="text-2xl font-black gradient-text tracking-widest">
            {lastNote}
          </span>
        )}
      </div>

      {/* Piano */}
      <div
        className="relative select-none"
        style={{ width: whiteW * 8, height: whiteH }}
      >
        {/* White keys */}
        {WHITE_KEYS.map((k, i) => (
          <div
            key={k.note}
            className={`piano-key-white absolute flex flex-col justify-end items-center pb-3 ${
              pressed.has(k.note) ? "active" : ""
            }`}
            style={{
              left: i * whiteW,
              width: whiteW - 2,
              height: whiteH,
              zIndex: 1,
            }}
            onMouseDown={() => playNote(k.note, k.freq)}
            onMouseUp={() => stopNote(k.note)}
            onMouseLeave={() => stopNote(k.note)}
            onTouchStart={(e) => {
              e.preventDefault();
              playNote(k.note, k.freq);
            }}
            onTouchEnd={() => stopNote(k.note)}
          >
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {k.key}
            </span>
          </div>
        ))}

        {/* Black keys */}
        {BLACK_KEYS.map((k) => (
          <div
            key={k.note}
            className={`piano-key-black absolute ${
              pressed.has(k.note) ? "active" : ""
            }`}
            style={{
              left: k.position * whiteW + whiteW - blackW / 2 - 1,
              width: blackW,
              height: blackH,
              zIndex: 2,
            }}
            onMouseDown={() => playNote(k.note, k.freq)}
            onMouseUp={() => stopNote(k.note)}
            onMouseLeave={() => stopNote(k.note)}
            onTouchStart={(e) => {
              e.preventDefault();
              playNote(k.note, k.freq);
            }}
            onTouchEnd={() => stopNote(k.note)}
          />
        ))}
      </div>

      <p className="text-slate-700 text-xs font-mono">
        W E · T Y U = black keys
      </p>
    </div>
  );
}
