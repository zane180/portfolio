"use client";

import { Mail, FileText, ArrowUpRight } from "lucide-react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const links = [
  {
    icon: Mail,
    label: "Email",
    value: "zaneluis83@gmail.com",
    href: "mailto:zaneluis83@gmail.com",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/zane180",
    href: "https://github.com/zane180",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/zane-luis-39220a225",
    href: "https://www.linkedin.com/in/zane-luis-39220a225",
  },
  {
    icon: FileText,
    label: "Resume",
    value: "Download PDF",
    href: "/CV - Zane Luis.pdf",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* CTA block */}
        <div
          className="rounded-3xl p-12 text-center mb-16 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(34,211,238,0.12) 50%, rgba(16,185,129,0.1) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)",
            }}
          />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 relative z-10">
            Let&apos;s build something{" "}
            <span className="gradient-text">together.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 relative z-10">
            I&apos;m actively looking for AI Engineering internship opportunities for Summer 2027.
            If you&apos;re working on something interesting, I&apos;d love to talk.
          </p>
          <a
            href="mailto:zaneluis83@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white text-base transition-transform hover:scale-105 relative z-10"
            style={{
              background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))",
            }}
          >
            Say Hello
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Links grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="gradient-border glass rounded-2xl p-5 flex items-center gap-4 group hover:bg-white/5 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.2))",
                }}
              >
                <link.icon size={18} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{link.label}</p>
                <p className="text-slate-500 text-sm truncate">{link.value}</p>
              </div>
              <ArrowUpRight
                size={16}
                className="text-slate-600 group-hover:text-slate-400 transition-colors"
              />
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-700 text-sm mt-12">
          Built with Next.js &amp; Tailwind · {new Date().getFullYear()} Zane Luis
        </p>
      </div>
    </section>
  );
}
