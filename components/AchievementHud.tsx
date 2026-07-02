"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS, getUnlocked, type Achievement } from "./achievements";

export default function AchievementHud() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [toast, setToast] = useState<Achievement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setUnlocked(getUnlocked());
    const onUnlock = (e: Event) => {
      const ach = (e as CustomEvent<Achievement>).detail;
      setUnlocked(getUnlocked());
      setToast(ach);
      setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener("zane-achievement", onUnlock);
    return () => window.removeEventListener("zane-achievement", onUnlock);
  }, []);

  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <>
      {/* Trophy button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-sm transition-transform hover:scale-105"
        aria-label="Achievements"
      >
        <span>🏆</span>
        <span className="font-mono text-xs text-slate-400">
          {unlocked.length}/{ACHIEVEMENTS.length}
        </span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 left-4 z-[60] w-72 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-xl p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-black text-sm">Explorer Score</p>
              <p className="font-mono text-xs gradient-text font-bold">{pct}%</p>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(to right, var(--a1), var(--a2))",
                }}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              {ACHIEVEMENTS.map((a) => {
                const got = unlocked.includes(a.id);
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <span
                      className="text-lg w-7 text-center"
                      style={{ filter: got ? "none" : "grayscale(1) opacity(0.3)" }}
                    >
                      {a.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${got ? "text-white" : "text-slate-600"}`}>
                        {a.title}
                      </p>
                      <p className="text-[10px] text-slate-600">{a.hint}</p>
                    </div>
                    {got && <span className="ml-auto text-green-400 text-xs">✓</span>}
                  </div>
                );
              })}
            </div>
            {pct === 100 && (
              <p className="mt-4 text-center text-xs font-bold gradient-text">
                You explored 100% of Zane. Now hire him. 🎓
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl border bg-black/85 backdrop-blur-xl"
            style={{ borderColor: "color-mix(in srgb, var(--a1) 40%, transparent)" }}
          >
            <span className="text-2xl">{toast.emoji}</span>
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: "var(--a1)" }}>
                Achievement Unlocked
              </p>
              <p className="text-white font-black text-sm">{toast.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
