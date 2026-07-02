"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Lock, ChevronDown } from "lucide-react";
import { unlock } from "./achievements";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const projects = [
  {
    number: "01",
    title: "Lovemaxxing",
    tagline: "AI-Powered Dating Platform",
    description:
      "A full-stack dating platform with a multimodal AI compatibility engine that scores matches on four signals using Claude Vision, Jaccard similarity, and personality alignment.",
    tech: ["Next.js 14", "TypeScript", "FastAPI", "PostgreSQL", "Claude Vision API", "WebSockets"],
    highlights: [
      "Multimodal AI pipeline: 40-label controlled vocabulary via structured prompting — zero label drift",
      "Four-signal compatibility score: Jaccard (40%) + personality (20%) + facial match (30%) + mutual bonus (10%) — O(n) per request",
      "Production backend: 6 domain routers, JWT auth, email verify, SQL block filtering, 200 req/min rate limiting",
      "Real-time WebSocket chat, Framer Motion swipe UI with rAF pause on visibility loss, PWA installable",
    ],
    liveUrl: "https://lovemaxxing.vercel.app/",
    githubUrl: "https://github.com/zane180/lovemaxxing",
    accent: "#8b5cf6",
    live: true,
  },
  {
    number: "02",
    title: "Sentify",
    tagline: "AI Emotion Detection & Recommendation",
    description:
      "A Streamlit web app that analyzes emotional themes in songs or movies via Google Gemini and recommends emotionally similar content with context-aware explanations.",
    tech: ["Python", "Streamlit", "Google Gemini API", "Prompt Engineering"],
    highlights: [
      "LLM-based emotion detection with structured prompt engineering to extract dominant themes",
      "Context-aware recommendation engine with natural language explanations",
      "Modular architecture designed for future Spotify, IMDb, and OpenAI integrations",
    ],
    liveUrl: undefined,
    githubUrl: undefined,
    accent: "#22d3ee",
    live: false,
  },
  {
    number: "03",
    title: "Snake & Ladder Engine",
    tagline: "PSU CMPSC 132 Final Project",
    description:
      "A fully engineered Snake & Ladder game built from scratch with OOP principles and explicit data structure choices — Penn State CMPSC 132 capstone.",
    tech: ["Python", "OOP", "Graph Theory", "Data Structures"],
    highlights: [
      "Board modeled as a directed graph; snakes/ladders as edges enabling O(1) position lookup",
      "Custom queue for turn management, stack-based move history for undo",
      "Clean separation of game logic from display layer — trivially portable to CLI, GUI, or web",
    ],
    liveUrl: undefined,
    githubUrl: undefined,
    accent: "#10b981",
    live: false,
  },
  {
    number: "04",
    title: "NBA Prediction Bot",
    tagline: "In Progress — Prediction Markets",
    description:
      "A real-time NBA outcome prediction model ingesting live game data via ESPN APIs and executing automated positions on Kalshi prediction markets.",
    tech: ["Python", "PyTorch", "ESPN API", "Kalshi API"],
    highlights: [
      "Live game data ingestion pipeline via ESPN public APIs",
      "PyTorch model for outcome probability estimation",
      "Automated position execution on Kalshi prediction markets",
    ],
    liveUrl: undefined,
    githubUrl: undefined,
    accent: "#22c55e",
    live: false,
    wip: true,
  },
];

export default function ProjectShowcase() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const [expanded, setExpanded] = useState<string | null>("Lovemaxxing");
  const seenRef = useRef<Set<string>>(new Set(["Lovemaxxing"]));

  const trackExpand = (title: string) => {
    seenRef.current.add(title);
    if (seenRef.current.size >= projects.length) unlock("deep-diver");
  };

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="chapter-label mb-5">Chapter 02 — What I Build</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          >
            Projects
          </h2>
          <p className="text-slate-500 mt-4 text-base max-w-lg">
            Production-grade systems, not demos. Every architectural decision was deliberate.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              index={i}
              isExpanded={expanded === p.title}
              onToggle={() => {
                if (expanded !== p.title) trackExpand(p.title);
                setExpanded(expanded === p.title ? null : p.title);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project: p,
  index,
  isExpanded,
  onToggle,
}: {
  project: (typeof projects)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${isExpanded ? p.accent + "40" : "rgba(255,255,255,0.06)"}`,
        background: isExpanded ? `${p.accent}08` : "rgba(255,255,255,0.02)",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-5 p-6 text-left"
      >
        <span
          className="font-mono text-xs font-bold w-8 shrink-0"
          style={{ color: p.accent }}
        >
          {p.number}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-black text-white">{p.title}</h3>
            {p.live && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{ color: "#22c55e", borderColor: "#22c55e40", background: "#22c55e10" }}>
                Live
              </span>
            )}
            {p.wip && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-400/10">
                In Progress
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">{p.tagline}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <GithubIcon size={16} />
            </a>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <ExternalLink size={15} />
            </a>
          )}
          {!p.githubUrl && !p.liveUrl && (
            <Lock size={14} className="text-slate-700" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-slate-600" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5">
              <p className="text-slate-400 text-sm leading-relaxed mt-5 mb-5">
                {p.description}
              </p>

              <div className="flex flex-col gap-2.5 mb-5">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                      style={{ background: p.accent }}
                    />
                    <p className="text-slate-400 text-sm leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 border border-white/8"
                    style={{ background: `${p.accent}12` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
