"use client";

import { useEffect, useRef, useState } from "react";
import { unlock } from "./achievements";

// Each chapter carries its own color world — the whole site morphs as you travel.
const CHAPTERS = [
  { id: "hero", n: "00", label: "Zane", theme: { a1: "#8b5cf6", a2: "#22d3ee", a3: "#f472b6" } },
  { id: "journey", n: "01", label: "Journey", theme: { a1: "#f59e0b", a2: "#f43f5e", a3: "#38bdf8" } },
  { id: "projects", n: "02", label: "Builds", theme: { a1: "#d946ef", a2: "#6366f1", a3: "#22d3ee" } },
  { id: "skills", n: "03", label: "Stack", theme: { a1: "#22d3ee", a2: "#10b981", a3: "#a3e635" } },
  { id: "experience", n: "04", label: "Work", theme: { a1: "#f43f5e", a2: "#a855f7", a3: "#fb923c" } },
  { id: "life", n: "05", label: "Play", theme: { a1: "#fb923c", a2: "#f472b6", a3: "#facc15" } },
  { id: "match", n: "06", label: "Match", theme: { a1: "#f472b6", a2: "#e11d48", a3: "#a855f7" } },
  { id: "contact", n: "07", label: "Next", theme: { a1: "#facc15", a2: "#8b5cf6", a3: "#22d3ee" } },
];

export default function ChapterRail() {
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const visitedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActive(id);
            visitedRef.current.add(id);
            if (visitedRef.current.size >= CHAPTERS.length) unlock("explorer");
            const ch = CHAPTERS.find((c) => c.id === id);
            if (ch) {
              const root = document.documentElement;
              root.style.setProperty("--a1", ch.theme.a1);
              root.style.setProperty("--a2", ch.theme.a2);
              root.style.setProperty("--a3", ch.theme.a3);
            }
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );

    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeIdx = CHAPTERS.findIndex((c) => c.id === active);

  return (
    <>
      {/* Desktop: right-side vertical rail */}
      <nav className="hidden md:flex fixed right-7 top-1/2 -translate-y-1/2 z-50 flex-col items-end gap-1">
        {/* Progress spine */}
        <div className="absolute right-[7px] top-0 bottom-0 w-px bg-white/8">
          <div
            className="w-full transition-all duration-200"
            style={{
              height: `${progress * 100}%`,
              background: "linear-gradient(to bottom, var(--a1), var(--a2))",
            }}
          />
        </div>

        {CHAPTERS.map((c, i) => {
          const isActive = c.id === active;
          const isPast = i < activeIdx;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="group relative flex items-center gap-3 py-2.5 pr-6"
            >
              {/* Label — slides in on hover or active */}
              <span
                className="font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(8px)",
                  color: "var(--a1)",
                }}
              >
                {c.label}
              </span>
              <span
                className="font-mono text-[10px] transition-colors duration-300 group-hover:text-white"
                style={{ color: isActive ? "var(--foreground)" : isPast ? "var(--muted)" : "#64748b" }}
              >
                {c.n}
              </span>
              {/* Node */}
              <span
                className="absolute right-[4px] w-[7px] h-[7px] rounded-full transition-all duration-300"
                style={{
                  background: isActive
                    ? "var(--a1)"
                    : isPast
                    ? "#475569"
                    : "#1e293b",
                  boxShadow: isActive ? "0 0 10px var(--a1)" : "none",
                  transform: isActive ? "scale(1.4)" : "scale(1)",
                }}
              />
            </a>
          );
        })}
      </nav>

      {/* Mobile: bottom chapter dots */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
        {CHAPTERS.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-label={c.label}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: c.id === active ? "var(--a1)" : "#334155",
              transform: c.id === active ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </nav>
    </>
  );
}
