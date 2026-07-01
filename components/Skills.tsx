"use client";

const skillGroups = [
  {
    category: "Languages",
    color: "from-violet-500 to-purple-600",
    skills: ["Python", "Java", "TypeScript", "JavaScript"],
  },
  {
    category: "AI / ML",
    color: "from-pink-500 to-rose-600",
    skills: ["LLMs", "Claude Vision API", "Keras", "NumPy", "RAG (learning)", "PyTorch (learning)", "Model Fine-Tuning (learning)"],
  },
  {
    category: "Backend",
    color: "from-orange-500 to-amber-600",
    skills: ["FastAPI", "Flask", "PostgreSQL", "SQLAlchemy", "JWT Auth", "WebSockets", "REST APIs"],
  },
  {
    category: "Frontend",
    color: "from-cyan-500 to-blue-600",
    skills: ["Next.js 14", "React", "Tailwind CSS", "Framer Motion", "Streamlit"],
  },
  {
    category: "Developer Tools",
    color: "from-emerald-500 to-teal-600",
    skills: ["Git", "Claude Code", "Google Looker Studio", "Vercel", "Supabase"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Skills
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Tools of the{" "}
            <span className="gradient-text">trade.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <div key={group.category} className="gradient-border glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-2 h-6 rounded-full bg-gradient-to-b ${group.color}`}
                />
                <h3 className="text-white font-bold">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 border border-white/8 bg-white/4 hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
