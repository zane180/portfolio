"use client";

import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Piano = dynamic(() => import("./Piano"), { ssr: false });
const BasketballGame = dynamic(() => import("./BasketballGame"), { ssr: false });
const SwimmingGame = dynamic(() => import("./SwimmingGame"), { ssr: false });

const tabs = [
  { id: "Basketball", emoji: "🏀", sub: "The Captain's Game" },
  { id: "Swimming", emoji: "🏊", sub: "The Title Defense" },
  { id: "Piano", emoji: "🎹", sub: "The Recital" },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function BeyondCode() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true });
  const [active, setActive] = useState<TabId>("Basketball");

  return (
    <section id="life" className="py-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="chapter-label mb-5">Chapter 05 — Beyond Code</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          >
            Play as
            <br />
            <span className="gradient-text">Zane.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-base max-w-xl">
            Three playable moments from my life before code: captaining the varsity basketball
            final, defending a U18 swimming title, and learning Für Elise on the piano.
            Same instincts that make an engineer — timing, pattern recognition, iteration.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
              style={
                active === tab.id
                  ? {
                      background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))",
                      color: "white",
                    }
                  : {
                      color: "#64748b",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              <span>{tab.emoji}</span>
              {tab.id}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="gradient-border glass rounded-2xl p-6 sm:p-8"
        >
          {active === "Basketball" && <BasketballGame />}
          {active === "Swimming" && <SwimmingGame />}
          {active === "Piano" && <Piano />}
        </motion.div>
      </div>
    </section>
  );
}
