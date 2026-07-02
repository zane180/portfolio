"use client";

import { Briefcase, Users } from "lucide-react";

type Item = {
  type: "work" | "activity";
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

const items: Item[] = [
  {
    type: "work",
    role: "Data Analytics Intern",
    org: "Samsonite",
    period: "August 2024",
    bullets: [
      "Analyzed sales performance data to evaluate growth opportunities for the American Tourister Airconic product line",
      "Assessed target markets, pricing ranges, and consumer segments to inform product development strategy",
      "Built visual dashboards in Google Looker Studio to communicate findings to stakeholders",
    ],
  },
  {
    type: "work",
    role: "Product Development Intern",
    org: "Cult.fit",
    period: "July 2023",
    bullets: [
      "Designed a fitness mobile app MVP aimed at making health and wellness more accessible",
      "Conducted market research to identify user pain points and define a clear problem statement",
      "Translated insights into a user-centric MVP design",
    ],
  },
  {
    type: "work",
    role: "Remote Java Coding Instructor",
    org: "Kyangala Girls High School, Kenya",
    period: "April – September 2024",
    bullets: [
      "Taught Java programming remotely to underprivileged students as part of a Duke of Edinburgh Award volunteering project",
      "Designed and delivered lessons covering programming fundamentals, logic, and problem-solving",
      "Several students expressed interest in pursuing STEM — bridged geographic and cultural gaps through sustained remote mentorship",
    ],
  },
  {
    type: "activity",
    role: "Head of Web Development",
    org: "Debuggers Club",
    period: "March 2022 – June 2023",
    bullets: [
      "Led development of a centralized database system to digitize the school House Points System",
      "Built and maintained full-stack web applications (HTML, CSS, React + PHP, MySQL, Apache)",
      "Designed a device tracking system for school-owned hardware",
    ],
  },
  {
    type: "activity",
    role: "Member — Machine Learning",
    org: "ML @ Penn State",
    period: "August 2025 – Present",
    bullets: [
      "Built a Python text sentiment classifier using Keras at the Cursor & MCP Showcase",
      "Participated in workshops on ML fundamentals, clean code structure, and rapid prototyping with AI-assisted tools",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Experience
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Where I&apos;ve{" "}
            <span className="gradient-text">worked.</span>
          </h2>
        </div>

        <div className="relative flex flex-col gap-0">
          {/* Timeline line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(to bottom, #8b5cf6, #22d3ee, #10b981, transparent)",
            }}
          />

          {items.map((item, idx) => (
            <div key={idx} className="relative pl-14 pb-10">
              {/* Dot */}
              <div
                className="absolute left-3.5 top-1 w-3 h-3 rounded-full border-2 border-[#06060a]"
                style={{
                  background:
                    item.type === "work"
                      ? "linear-gradient(135deg, #8b5cf6, #22d3ee)"
                      : "linear-gradient(135deg, #10b981, #22d3ee)",
                }}
              />

              <div className="gradient-border glass rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {item.type === "work" ? (
                      <Briefcase size={14} className="text-purple-400" />
                    ) : (
                      <Users size={14} className="text-orange-400" />
                    )}
                    <h3 className="text-white font-bold">{item.role}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{item.period}</span>
                </div>
                <p className="text-purple-300 text-sm font-medium mb-4">{item.org}</p>
                <ul className="flex flex-col gap-2">
                  {item.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
