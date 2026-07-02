"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06060a]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-bold text-xl gradient-text">
          ZL
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/CV - Zane Luis.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #22d3ee, #10b981)",
            }}
          >
            Resume
          </a>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#06060a]/95 backdrop-blur-md border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/CV - Zane Luis.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #22d3ee, #10b981)",
            }}
          >
            Resume
          </a>
        </div>
      )}
    </nav>
  );
}
