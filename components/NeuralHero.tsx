"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { XRayNote } from "./XRay";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function NeuralHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <Hero3D />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 25%, var(--background) 100%)",
        }}
      />

      <div className="relative z-10 text-center px-6 select-none pointer-events-none">
        <p
          className="chapter-label mb-10"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.2s" }}
        >
          Dubai-raised · Michigan-made · AI Engineering
        </p>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
          }}
        >
          <h1
            className="font-black leading-[0.88] tracking-tighter text-white"
            style={{ fontSize: "clamp(72px, 17vw, 200px)" }}
          >
            ZANE
          </h1>
          <h1
            className="font-black leading-[0.88] tracking-tighter gradient-text"
            style={{ fontSize: "clamp(72px, 17vw, 200px)" }}
          >
            LUIS
          </h1>
        </div>

        <div
          className="mt-10 flex flex-col items-center gap-6 pointer-events-auto"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.9s" }}
        >
          <p className="serif-i text-slate-400 text-xl sm:text-2xl">
            Building AI systems that actually <span className="gradient-text">ship.</span>
          </p>

          <a
            href="#journey"
            className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--a1), var(--a2), var(--a3))" }}
          >
            Explore
          </a>
        </div>

        <div
          className="mt-16 flex items-center justify-center gap-3 text-slate-700"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 1.2s" }}
        >
          <div className="w-8 h-px bg-slate-700" />
          <span className="font-mono text-[10px] tracking-[0.35em]">SCROLL</span>
          <div className="w-8 h-px bg-slate-700" />
        </div>

        <div className="max-w-md mx-auto pointer-events-auto">
          <XRayNote
            file="components/Hero3D.tsx"
            title="1,800 particles, one draw call"
            code={`const phi = Math.acos(1 - 2*(i+0.5)/n);
const theta = Math.PI*(1+Math.sqrt(5))*i;`}
          >
            Fibonacci-sphere distribution instead of random placement — uniform density with
            zero clustering. Rendered as a single THREE.Points buffer (one draw call), hue
            cycled in the render loop instead of re-uploading vertex colors. Deferred via
            dynamic import so Three.js never blocks first paint.
          </XRayNote>
        </div>
      </div>
    </section>
  );
}
