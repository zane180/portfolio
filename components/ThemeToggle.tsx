"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(true);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("zane-theme", next ? "light" : "dark");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="w-9 h-9 rounded-full border flex items-center justify-center text-base transition-transform hover:scale-110"
      style={{ borderColor: "var(--line)" }}
    >
      {light ? "☾" : "☀"}
    </button>
  );
}
