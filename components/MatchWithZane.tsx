"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ——— Zane's actual profile (the algorithm's "user B") ———
const ZANE_INTERESTS = ["AI/ML", "Startups", "Basketball", "Music", "Fitness", "Travel", "Space", "Gaming"];
const ZANE_TRAITS = ["Competitive", "Curious", "Fast-mover", "Team-first"];

const INTEREST_POOL = [
  "AI/ML", "Startups", "Basketball", "Music", "Fitness", "Travel",
  "Space", "Gaming", "Reading", "Cooking", "Photography", "Crypto",
  "Anime", "Cars", "Fashion", "Hiking",
];

const TRAIT_POOL = [
  "Competitive", "Curious", "Chill", "Detail-obsessed",
  "Fast-mover", "Deep-thinker", "Team-first", "Solo-grinder",
];

const TEAMMATE_OPTIONS = [
  { label: "Ships fast, iterates faster", score: 100 },
  { label: "Athlete mentality — competes at everything", score: 90 },
  { label: "Creative with real craft", score: 80 },
  { label: "Pure academic rigor", score: 55 },
];

const PROJECT_OPTIONS = [
  { label: "An AI product real people use", score: 100 },
  { label: "Scalable backend infrastructure", score: 85 },
  { label: "A game or interactive experience", score: 75 },
  { label: "A solid CRUD app that pays", score: 45 },
];

const COFFEE_OPTIONS = [
  { label: "Absolutely — I have opinions about AGI", score: 100 },
  { label: "Sure, if there's good coffee", score: 65 },
  { label: "I prefer email", score: 30 },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

export default function MatchWithZane() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true });

  const [step, setStep] = useState<Step>(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [traits, setTraits] = useState<string[]>([]);
  const [teammate, setTeammate] = useState<number | null>(null);
  const [project, setProject] = useState<number | null>(null);
  const [coffee, setCoffee] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  // ——— The actual Lovemaxxing scoring formula ———
  const jac = jaccard(interests, ZANE_INTERESTS);
  const personality =
    traits.length === 0
      ? 0
      : traits.filter((t) => ZANE_TRAITS.includes(t)).length / Math.max(traits.length, 3);
  const preference =
    teammate !== null && project !== null
      ? (TEAMMATE_OPTIONS[teammate].score + PROJECT_OPTIONS[project].score) / 200
      : 0;
  const mutual = coffee !== null ? COFFEE_OPTIONS[coffee].score / 100 : 0;
  const finalScore = Math.round((0.4 * jac + 0.2 * personality + 0.3 * preference + 0.1 * mutual) * 100);

  // Count-up animation on result screen
  useEffect(() => {
    if (step !== 5) return;
    setDisplayScore(0);
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * finalScore));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step, finalScore]);

  const toggle = (list: string[], set: (v: string[]) => void, item: string, max: number) => {
    if (list.includes(item)) set(list.filter((i) => i !== item));
    else if (list.length < max) set([...list, item]);
  };

  const verdict =
    finalScore >= 80
      ? "Elite match. We should already be building together."
      : finalScore >= 60
      ? "Strong signal. Coffee is warranted."
      : finalScore >= 40
      ? "Decent overlap — opposites debug each other."
      : "Low compatibility, high potential for interesting arguments.";

  const signals = [
    { label: "Interest overlap (Jaccard)", weight: "40%", value: jac, color: "var(--a1)" },
    { label: "Personality alignment", weight: "20%", value: personality, color: "var(--a2)" },
    { label: "Preference match", weight: "30%", value: preference, color: "var(--a3)" },
    { label: "Mutual signal bonus", weight: "10%", value: mutual, color: "#facc15" },
  ];

  const reset = () => {
    setStep(0);
    setInterests([]);
    setTraits([]);
    setTeammate(null);
    setProject(null);
    setCoffee(null);
  };

  return (
    <section id="match" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="chapter-label mb-5">Chapter 06 — The Algorithm, On You</p>
          <h2 className="font-black text-white leading-none" style={{ fontSize: "clamp(42px, 8vw, 96px)" }}>
            Match with
            <br />
            <span className="gradient-text">Zane.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-base max-w-xl">
            This is the actual four-signal compatibility engine from Lovemaxxing — Jaccard
            similarity, weighted signals, normalized scoring — running on <span className="text-white">you</span>,
            right now, in your browser.
          </p>
          <p className="font-mono text-xs text-slate-600 mt-3">
            score = 0.4·J(A,B) + 0.2·P + 0.3·F + 0.1·M
          </p>
        </motion.div>

        <div className="gradient-border glass rounded-2xl p-8 min-h-[420px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepShell key="s0" title="Ready to get scored?" sub="5 questions. Real algorithm. No feelings spared.">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-3.5 rounded-full font-bold text-white transition-transform hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))" }}
                >
                  Run the Algorithm
                </button>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell key="s1" title="Pick your interests" sub={`Choose 3–6 · signal weight 40% · ${interests.length} selected`}>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {INTEREST_POOL.map((item) => (
                    <Chip key={item} label={item} active={interests.includes(item)}
                      onClick={() => toggle(interests, setInterests, item, 6)} />
                  ))}
                </div>
                <NextBtn disabled={interests.length < 3} onClick={() => setStep(2)} />
              </StepShell>
            )}

            {step === 2 && (
              <StepShell key="s2" title="Describe yourself" sub={`Pick exactly 3 · signal weight 20% · ${traits.length}/3`}>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {TRAIT_POOL.map((item) => (
                    <Chip key={item} label={item} active={traits.includes(item)}
                      onClick={() => toggle(traits, setTraits, item, 3)} />
                  ))}
                </div>
                <NextBtn disabled={traits.length !== 3} onClick={() => setStep(3)} />
              </StepShell>
            )}

            {step === 3 && (
              <StepShell key="s3" title="Your ideal teammate is…" sub="Signal weight 30% (part 1 of 2)">
                <OptionList options={TEAMMATE_OPTIONS.map((o) => o.label)} selected={teammate}
                  onSelect={(i) => { setTeammate(i); setTimeout(() => setStep(4), 250); }} />
              </StepShell>
            )}

            {step === 4 && (
              <StepShell key="s4" title="What would you rather build?" sub="Signal weight 30% (part 2 of 2)">
                <OptionList options={PROJECT_OPTIONS.map((o) => o.label)} selected={project}
                  onSelect={(i) => { setProject(i); setTimeout(() => setStep(5), 250); }} />
                <div className="mt-6">
                  <p className="text-slate-600 text-xs text-center mb-3 font-mono">final signal · weight 10%</p>
                  <OptionList options={COFFEE_OPTIONS.map((o) => o.label)} selected={coffee}
                    onSelect={(i) => setCoffee(i)} small />
                </div>
              </StepShell>
            )}

            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="font-mono text-xs text-slate-600 mb-2 tracking-widest uppercase">Compatibility Report</p>
                <p className="font-black leading-none gradient-text" style={{ fontSize: "clamp(72px, 15vw, 140px)" }}>
                  {displayScore}
                </p>
                <p className="text-slate-400 font-semibold mb-1">/ 100</p>
                <p className="text-white font-bold text-lg mb-8 max-w-sm mx-auto">{verdict}</p>

                {/* Signal breakdown */}
                <div className="flex flex-col gap-3 max-w-md mx-auto mb-8 text-left">
                  {signals.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{s.label}</span>
                        <span className="font-mono text-slate-500">{s.weight} · {(s.value * 100).toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value * 100}%` }}
                          transition={{ duration: 1, delay: 0.4 }}
                          style={{ background: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                  {finalScore >= 60 && (
                    <a
                      href={`mailto:zaneluis83@gmail.com?subject=We matched at ${finalScore}%25`}
                      className="px-6 py-3 rounded-full font-bold text-white text-sm transition-transform hover:scale-105"
                      style={{ background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))" }}
                    >
                      Claim Your Match →
                    </a>
                  )}
                  <button onClick={reset} className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors">
                    [ rerun ]
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function StepShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="text-center flex flex-col items-center justify-center min-h-[356px]"
    >
      <h3 className="text-2xl font-black text-white mb-1">{title}</h3>
      <p className="text-slate-600 text-xs font-mono mb-8">{sub}</p>
      {children}
    </motion.div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={
        active
          ? { background: "linear-gradient(135deg, var(--a1), var(--a2))", color: "white", transform: "scale(1.05)" }
          : { color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }
      }
    >
      {label}
    </button>
  );
}

function NextBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-3 rounded-full font-bold text-white text-sm transition-all disabled:opacity-30 hover:scale-105 disabled:hover:scale-100"
      style={{ background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))" }}
    >
      Next →
    </button>
  );
}

function OptionList({ options, selected, onSelect, small }: {
  options: string[]; selected: number | null; onSelect: (i: number) => void; small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onSelect(i)}
          className={`${small ? "px-4 py-2.5 text-xs" : "px-5 py-3.5 text-sm"} rounded-xl font-medium text-left transition-all`}
          style={
            selected === i
              ? { background: "linear-gradient(135deg, var(--a1), var(--a2))", color: "white" }
              : { color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
