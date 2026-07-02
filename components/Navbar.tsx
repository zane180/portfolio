"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#04040a]/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="px-6 sm:px-8 py-4 flex items-center justify-between">
        <a href="#hero" className="font-black text-xl gradient-text tracking-tight">
          ZL
        </a>
        <a
          href="/CV - Zane Luis.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full text-xs font-bold text-white tracking-wide"
          style={{ background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))" }}
        >
          RESUME
        </a>
      </div>
    </header>
  );
}
