"use client";

import { GraduationCap, MapPin, Trophy } from "lucide-react";

const stats = [
  { value: "98/100", label: "CS Score @ GMA" },
  { value: "Dean's", label: "List @ PSU" },
  { value: "2027", label: "Target Internship" },
  { value: "2+", label: "Prod. AI Systems" },
];

const awards = [
  { icon: Trophy, text: "Silver Award — Duke of Edinburgh (UK), 2025" },
  { icon: GraduationCap, text: "School Runner-Up Computer Science — 98/100, GMA 2025" },
  { icon: Trophy, text: "Math Olympiad (GIMO) — International Rank 739, 2024" },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
              About Me
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              I build AI systems,{" "}
              <span className="gradient-text">not just demos.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              I&apos;m Zane Luis, a sophomore studying Computer Science at the{" "}
              <span className="text-white font-medium">University of Michigan</span>. I transferred
              from Penn State where I made the Dean&apos;s List, and before that grew up in Dubai, UAE —
              graduating with a 90% ISC aggregate.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              My focus is on the intersection of AI and systems engineering: building pipelines that
              are production-ready, not just proof-of-concept. I care about latency, correctness,
              and the tradeoffs behind every architectural decision.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Currently diving deep into{" "}
              <span className="text-purple-400 font-medium">LLMs, RAG, and model fine-tuning</span>{" "}
              alongside my coursework. Outside of code, I captained a varsity basketball team and
              taught Java remotely to students in Kenya.
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin size={14} />
              <span>Ann Arbor, Michigan</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="gradient-border glass p-5">
                  <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
                  <p className="text-slate-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className="gradient-border glass p-5">
              <p className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Honors &amp; Awards
              </p>
              <div className="flex flex-col gap-3">
                {awards.map((a) => (
                  <div key={a.text} className="flex items-start gap-3">
                    <a.icon size={15} className="text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-slate-400 text-sm">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
