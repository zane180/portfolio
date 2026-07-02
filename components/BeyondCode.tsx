"use client";

import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Piano = dynamic(() => import("./Piano"), { ssr: false });
const BasketballGame = dynamic(() => import("./BasketballGame"), { ssr: false });

const tabs = ["Basketball", "Piano"] as const;
type Tab = (typeof tabs)[number];

export default function BeyondCode() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true });
  const [active, setActive] = useState<Tab>("Basketball");

  return (
    <section id="life" className="py-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          <p className="chapter-label mb-5">Chapter 04 — Beyond Code</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          >
            I&apos;m not just
            <br />
            <span className="gradient-text">a dev.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-base max-w-xl">
            Basketball captain. Piano player. Athlete. The same instincts that make a
            great engineer — pattern recognition, timing, adaptability — show up everywhere.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                active === tab
                  ? {
                      background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
                      color: "white",
                    }
                  : {
                      color: "#64748b",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="gradient-border glass rounded-2xl p-8"
        >
          {active === "Basketball" && <BasketballGame />}
          {active === "Piano" && <Piano />}
        </motion.div>

        {/* Fun facts */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Basketball", detail: "Varsity captain · PG/SG" },
            { label: "Piano", detail: "Self-taught · Classical + improv" },
            { label: "Swimming", detail: "Competitive swimmer" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl p-4 text-center border border-white/5 bg-white/2"
            >
              <p className="text-white font-bold text-sm">{f.label}</p>
              <p className="text-slate-600 text-xs mt-1">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
