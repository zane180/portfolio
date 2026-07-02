"use client";

import { useState, useEffect } from "react";

// X-Ray mode: flips the site into "engineering decisions" view.
// Toggling adds .xray to <body>; XRayNote cards become visible via CSS.

export function XRayToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("xray", on);
  }, [on]);

  return (
    <button
      onClick={() => setOn(!on)}
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-md text-xs font-mono transition-all hover:scale-105"
      style={{
        borderColor: on ? "var(--a1)" : "var(--line)",
        background: on
          ? "color-mix(in srgb, var(--a1) 25%, var(--background))"
          : "color-mix(in srgb, var(--background) 70%, transparent)",
        color: on ? "var(--foreground)" : "var(--muted)",
      }}
      aria-pressed={on}
    >
      <span className="font-bold">{"</>"}</span>
      X-RAY {on ? "ON" : ""}
    </button>
  );
}

export function XRayNote({
  file,
  title,
  children,
  code,
}: {
  file: string;
  title: string;
  children: React.ReactNode;
  code?: string;
}) {
  return (
    <div className="xray-note rounded-xl p-5 my-6 text-left">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--a1)" }} />
        <span className="font-mono text-[10px] tracking-wider text-slate-500">{file}</span>
      </div>
      <p className="text-white font-bold text-sm mb-1.5">⚙ {title}</p>
      <p className="text-slate-400 text-xs leading-relaxed">{children}</p>
      {code && (
        <pre className="mt-3 p-3 rounded-lg bg-black/50 border border-white/5 overflow-x-auto">
          <code className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--a2)" }}>
            {code}
          </code>
        </pre>
      )}
    </div>
  );
}
