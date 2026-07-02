"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const groups = [
  {
    label: "AI / ML",
    accent: "#a855f7",
    skills: ["Claude Vision API", "LLMs", "Keras", "Prompt Engineering", "RAG (learning)", "PyTorch (learning)", "Model Fine-Tuning (learning)", "NumPy"],
  },
  {
    label: "Backend",
    accent: "#ec4899",
    skills: ["FastAPI", "Flask", "PostgreSQL", "SQLAlchemy", "WebSockets", "JWT Auth", "REST APIs"],
  },
  {
    label: "Frontend",
    accent: "#f97316",
    skills: ["Next.js 14", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Streamlit"],
  },
  {
    label: "Languages",
    accent: "#22c55e",
    skills: ["Python", "Java", "TypeScript", "JavaScript", "C++ (learning)"],
  },
  {
    label: "Tools",
    accent: "#06b6d4",
    skills: ["Git", "Claude Code", "Vercel", "Supabase", "Google Looker Studio"],
  },
];

export default function StorySkills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="chapter-label mb-5">Chapter 03 — The Craft</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          >
            Stack
          </h2>
          <p className="text-slate-500 mt-4 text-base">
            Tools I use to ship. No fluff.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {groups.map((g, gi) => (
            <SkillRow key={g.label} group={g} groupIndex={gi} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillRow({
  group,
  groupIndex,
}: {
  group: (typeof groups)[0];
  groupIndex: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
      className="flex items-start gap-6"
    >
      <div className="flex items-center gap-3 w-28 shrink-0 pt-1">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: group.accent, boxShadow: `0 0 8px ${group.accent}` }}
        />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          {group.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: groupIndex * 0.08 + i * 0.04 }}
            className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors hover:border-opacity-60"
            style={{
              color: "#94a3b8",
              borderColor: `${group.accent}25`,
              background: `${group.accent}08`,
            }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
