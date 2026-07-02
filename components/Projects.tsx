"use client";

import { ExternalLink, Lock } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

type Project = {
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  badge?: string;
  badgeColor?: string;
  status: "live" | "wip" | "private";
};

const projects: Project[] = [
  {
    title: "Lovemaxxing",
    tagline: "AI-Powered Dating Platform",
    description:
      "A full-stack dating app with a multimodal AI compatibility engine — combining facial feature analysis, personality alignment, and interest matching into a single normalized score.",
    highlights: [
      "Multimodal AI pipeline using Claude Vision API with a 40-label controlled vocabulary — zero label drift via structured prompting + server-side validation",
      "Four-signal compatibility engine: Jaccard similarity (40%), personality (20%), facial preference matching (30%), mutual attraction bonus (10%) — O(n) ranking per request",
      "Production FastAPI backend: 6 domain-separated routers, SQLAlchemy ORM, JWT/bcrypt auth, email verification, bidirectional block filtering, 200 req/min rate limiting",
      "Real-time WebSocket chat scoped to matched pairs, Framer Motion swipe UI with rAF pause on visibility loss, PWA installability for iOS & Android",
    ],
    tech: ["Next.js 14", "TypeScript", "Python", "FastAPI", "PostgreSQL", "WebSockets", "Claude Vision API"],
    liveUrl: "https://lovemaxxing.vercel.app/",
    githubUrl: "https://github.com/zane180/lovemaxxing",
    badge: "Live",
    badgeColor: "text-green-400 bg-green-400/10 border-green-400/20",
    status: "live",
  },
  {
    title: "Snake & Ladder Engine",
    tagline: "PSU CMPSC 132 Final Project",
    description:
      "A fully playable Snake & Ladder game built from scratch using object-oriented design principles and core data structures — implemented as a Penn State CMPSC 132 capstone.",
    highlights: [
      "Designed with OOP principles: Player, Board, Snake, Ladder, and GameEngine classes with clear encapsulation and single-responsibility boundaries",
      "Board represented as a graph-adjacency structure; snake/ladder jumps modeled as directed edges enabling O(1) position lookup",
      "Implemented custom queue for turn management and stack-based move history for undo functionality",
      "Clean separation of game logic from display layer, making it trivially portable to CLI, GUI, or web rendering",
    ],
    tech: ["Python", "OOP", "Data Structures", "Algorithms"],
    badge: "Academic",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    status: "private",
  },
];

const comingSoon = [
  { title: "NBA Prediction Bot", tech: "PyTorch · ESPN API · Kalshi API", note: "In progress" },
  { title: "More AI Projects", tech: "Building Summer 2026", note: "Stay tuned" },
];

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Projects
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Things I&apos;ve{" "}
            <span className="gradient-text">shipped.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {projects.map((p) => (
            <div key={p.title} className="gradient-border glass rounded-2xl p-8">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-white">{p.title}</h3>
                    {p.badge && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${p.badgeColor}`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{p.tagline}</p>
                </div>

                <div className="flex items-center gap-3">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      <GithubIcon size={16} />
                      Code
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #22d3ee, #10b981)",
                      }}
                    >
                      <ExternalLink size={14} />
                      Live Site
                    </a>
                  )}
                  {p.status === "private" && (
                    <span className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Lock size={14} />
                      Private
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed">{p.description}</p>

              {/* Highlights */}
              <div className="flex flex-col gap-3 mb-6">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                      }}
                    />
                    <p className="text-slate-400 text-sm leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-white/10 bg-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Coming soon row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {comingSoon.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-dashed border-white/10 p-6 flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="text-white font-bold mb-1">{p.title}</p>
                  <p className="text-slate-600 text-sm">{p.tech}</p>
                </div>
                <span className="w-fit text-xs font-medium text-slate-600 border border-slate-700 px-2.5 py-1 rounded-full">
                  {p.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
