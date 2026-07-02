"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { unlock } from "./achievements";
import { XRayNote } from "./XRay";

const NOTES: Record<string, number> = {
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63,
  F4: 349.23, "F#4": 369.99, G4: 392.0, "G#4": 415.3, A4: 440.0,
  "A#4": 466.16, B4: 493.88, C5: 523.25, "C#5": 554.37, D5: 587.33,
  "D#5": 622.25, E5: 659.25,
};

const WHITE_KEYS = [
  { note: "C4", key: "A" }, { note: "D4", key: "S" }, { note: "E4", key: "D" },
  { note: "F4", key: "F" }, { note: "G4", key: "G" }, { note: "A4", key: "H" },
  { note: "B4", key: "J" }, { note: "C5", key: "K" }, { note: "D5", key: "L" },
  { note: "E5", key: ";" },
];

const BLACK_KEYS = [
  { note: "C#4", key: "W", position: 0 }, { note: "D#4", key: "E", position: 1 },
  { note: "F#4", key: "T", position: 3 }, { note: "G#4", key: "Y", position: 4 },
  { note: "A#4", key: "U", position: 5 }, { note: "C#5", key: "O", position: 7 },
  { note: "D#5", key: "P", position: 8 },
];

// Für Elise — opening phrase
const FUR_ELISE = [
  "E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4",
  "C4", "E4", "A4", "B4",
  "E4", "G#4", "B4", "C5",
  "E4", "E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4",
  "C4", "E4", "A4", "B4",
  "E4", "C5", "B4", "A4",
];

function CartoonZane({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 300 160" className="w-full max-w-xs mx-auto" aria-hidden>
      {/* Piano body */}
      <rect x="130" y="60" width="150" height="70" rx="6" fill="#1e1b31" stroke="#8b5cf6" strokeOpacity="0.3" />
      <rect x="130" y="52" width="150" height="14" rx="3" fill="#2d2a45" />
      {/* Mini keys on the piano */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={138 + i * 11} y={54} width={9} height={10} rx={1} fill={playing && i % 3 === 0 ? "#22d3ee" : "#e2e8f0"} />
      ))}
      {/* Piano leg */}
      <rect x="150" y="130" width="8" height="22" fill="#2d2a45" />
      <rect x="250" y="130" width="8" height="22" fill="#2d2a45" />
      {/* Stool */}
      <rect x="70" y="112" width="44" height="8" rx="3" fill="#3f3b5c" />
      <rect x="86" y="120" width="8" height="30" fill="#2d2a45" />
      {/* Zane — body */}
      <path d="M74 112 Q76 84 92 82 Q108 84 110 112 Z" fill="#8b5cf6" />
      {/* Arms reaching to keys */}
      <path d="M104 90 Q124 82 136 62" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" fill="none">
        {playing && (
          <animate attributeName="d" dur="0.4s" repeatCount="indefinite"
            values="M104 90 Q124 82 136 62; M104 90 Q126 86 140 66; M104 90 Q124 82 136 62" />
        )}
      </path>
      {/* Hand */}
      <circle cx="138" cy="61" r="5" fill="#f5c9a6">
        {playing && (
          <animate attributeName="cy" dur="0.4s" repeatCount="indefinite" values="61;65;61" />
        )}
      </circle>
      {/* Head */}
      <circle cx="90" cy="66" r="16" fill="#f5c9a6" />
      {/* Hair */}
      <path d="M74 62 Q76 46 90 48 Q106 46 106 62 Q104 52 90 54 Q78 52 74 62 Z" fill="#2b2118" />
      {/* Eye (side profile, facing right) */}
      <circle cx="97" cy="64" r="1.8" fill="#1e293b" />
      {/* Smile */}
      <path d="M98 71 Q101 72 102 69" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Music notes floating */}
      {playing && (
        <>
          <text x="180" y="40" fontSize="16" fill="#22d3ee" opacity="0.9">
            ♪
            <animate attributeName="y" dur="1.2s" repeatCount="indefinite" values="45;20" />
            <animate attributeName="opacity" dur="1.2s" repeatCount="indefinite" values="0.9;0" />
          </text>
          <text x="215" y="35" fontSize="13" fill="#8b5cf6" opacity="0.9">
            ♫
            <animate attributeName="y" dur="1.5s" repeatCount="indefinite" values="40;12" />
            <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0.9;0" />
          </text>
        </>
      )}
    </svg>
  );
}

export default function Piano() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"story" | "free">("story");
  const [progress, setProgress] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeOsc = useRef<
    Map<string, { oscs: OscillatorNode[]; gains: GainNode[]; autoStop: ReturnType<typeof setTimeout> }>
  >(new Map());
  const stopNoteRef = useRef<(note: string) => void>(() => {});
  const progressRef = useRef(0);
  const modeRef = useRef<"story" | "free">("story");
  modeRef.current = mode;
  progressRef.current = progress;

  const getCtx = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  };

  const playNote = useCallback((note: string) => {
    if (activeOsc.current.has(note)) return;
    const freq = NOTES[note];
    if (!freq) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

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
    // Safety: auto-release after 2s even if keyup/mouseup is missed,
    // so notes can never stack into a wall of sound.
    const autoStop = setTimeout(() => stopNoteRef.current(note), 2000);
    activeOsc.current.set(note, { oscs: [osc, osc2], gains: [gain, gain2], autoStop });
    setPressed((p) => new Set(p).add(note));

    setIsPlaying(true);
    if (playingTimer.current) clearTimeout(playingTimer.current);
    playingTimer.current = setTimeout(() => setIsPlaying(false), 900);

    // Story mode progression
    if (modeRef.current === "story") {
      const expected = FUR_ELISE[progressRef.current];
      if (note === expected) {
        const next = progressRef.current + 1;
        setProgress(next);
        if (next >= FUR_ELISE.length) {
          setComplete(true);
          unlock("fur-elise");
        }
      } else {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 300);
      }
    }
  }, []);

  const stopNote = useCallback((note: string) => {
    const entry = activeOsc.current.get(note);
    if (!entry) return;
    clearTimeout(entry.autoStop);
    const ctx = getCtx();
    const now = ctx.currentTime;
    // Release ALL oscillators for this note (the detuned layer too)
    entry.gains.forEach((g) => {
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0, now + 0.25);
    });
    entry.oscs.forEach((o) => o.stop(now + 0.3));
    activeOsc.current.delete(note);
    setPressed((p) => {
      const next = new Set(p);
      next.delete(note);
      return next;
    });
  }, []);
  stopNoteRef.current = stopNote;

  useEffect(() => {
    const keyMap = new Map<string, string>();
    [...WHITE_KEYS, ...BLACK_KEYS].forEach((k) => keyMap.set(k.key.toLowerCase(), k.note));

    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = keyMap.get(e.key.toLowerCase());
      if (note) playNote(note);
    };
    const onUp = (e: KeyboardEvent) => {
      const note = keyMap.get(e.key.toLowerCase());
      if (note) stopNote(note);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      // Kill any ringing notes when leaving the piano
      [...activeOsc.current.keys()].forEach((n) => stopNoteRef.current(n));
    };
  }, [playNote, stopNote]);

  const reset = () => {
    setProgress(0);
    setComplete(false);
  };

  const hintNote = mode === "story" && !complete ? FUR_ELISE[progress] : null;
  const whiteW = 48;
  const whiteH = 160;
  const blackW = 30;
  const blackH = 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="chapter-label mb-2">The Recital</p>
        <h3 className="text-3xl font-black text-white">Play Für Elise as Zane</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Follow the glowing keys to play Beethoven&apos;s Für Elise — the first piece I ever learned.
        </p>
      </div>

      <CartoonZane playing={isPlaying} />

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["story", "free"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              mode === m
                ? { background: "linear-gradient(135deg, var(--a1), var(--a2))", color: "white" }
                : { color: "var(--muted)", border: "1px solid var(--line)" }
            }
          >
            {m === "story" ? "🎼 Für Elise" : "🎹 Free Play"}
          </button>
        ))}
      </div>

      {/* Progress */}
      {mode === "story" && (
        <div className="w-full max-w-md">
          {complete ? (
            <div className="text-center py-2">
              <p className="text-2xl font-black gradient-text">🎉 Bravo! Encore!</p>
              <button
                onClick={reset}
                className="mt-2 text-xs font-mono text-slate-500 hover:text-white transition-colors"
              >
                [ play again ]
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-xs font-mono text-slate-600 mb-1.5">
                <span className={wrongFlash ? "text-red-400" : ""}>
                  {wrongFlash ? "not that one!" : `note ${progress + 1} / ${FUR_ELISE.length}`}
                </span>
                <span>{Math.round((progress / FUR_ELISE.length) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress / FUR_ELISE.length) * 100}%`,
                    background: "linear-gradient(to right, var(--a1), var(--a2))",
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Piano */}
      <div className="relative select-none overflow-x-auto max-w-full pb-2">
        <div className="relative" style={{ width: whiteW * WHITE_KEYS.length, height: whiteH }}>
          {WHITE_KEYS.map((k, i) => (
            <div
              key={k.note}
              className={`piano-key-white absolute flex flex-col justify-end items-center pb-3 ${
                pressed.has(k.note) ? "active" : hintNote === k.note ? "hint" : ""
              }`}
              style={{ left: i * whiteW, width: whiteW - 2, height: whiteH, zIndex: 1 }}
              onMouseDown={() => playNote(k.note)}
              onMouseUp={() => stopNote(k.note)}
              onMouseLeave={() => stopNote(k.note)}
              onTouchStart={(e) => { e.preventDefault(); playNote(k.note); }}
              onTouchEnd={() => stopNote(k.note)}
            >
              <span className="text-[9px] font-mono text-slate-500 font-bold">{k.key}</span>
            </div>
          ))}
          {BLACK_KEYS.map((k) => (
            <div
              key={k.note}
              className={`piano-key-black absolute ${
                pressed.has(k.note) ? "active" : hintNote === k.note ? "hint" : ""
              }`}
              style={{
                left: k.position * whiteW + whiteW - blackW / 2 - 1,
                width: blackW,
                height: blackH,
                zIndex: 2,
              }}
              onMouseDown={() => playNote(k.note)}
              onMouseUp={() => stopNote(k.note)}
              onMouseLeave={() => stopNote(k.note)}
              onTouchStart={(e) => { e.preventDefault(); playNote(k.note); }}
              onTouchEnd={() => stopNote(k.note)}
            />
          ))}
        </div>
      </div>

      <p className="text-slate-700 text-xs font-mono text-center">
        keyboard: A S D F G H J K L ; — black keys: W E T Y U O P
      </p>

      <div className="w-full max-w-lg">
        <XRayNote
          file="components/Piano.tsx"
          title="The oscillator leak that became a wall of sound"
          code={`// bug: 2 oscillators per note, only 1 stopped
// the detuned layer rang forever and stacked
entry.oscs.forEach((o) => o.stop(now + 0.3));`}
        >
          Each key layers a triangle wave with a 7-cent-detuned sine for warmth. V1 only
          stopped the first oscillator on key release — every press left a sine ringing
          forever, stacking into noise. Fix: release all oscillators per note, a 2s
          auto-release for missed keyups, and full teardown on unmount.
        </XRayNote>
      </div>
    </div>
  );
}
