"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
}

export default function NeuralHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const frameRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodesRef.current = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        pulse: Math.random() * Math.PI * 2,
      }));
    };
    init();

    const onResize = () => init();
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const { x: mx, y: my } = mouseRef.current;

      nodes.forEach((n) => {
        const dx = mx - n.x;
        const dy = my - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180 && d > 0) {
          n.vx += (dx / d) * 0.025;
          n.vy += (dy / d) * 0.025;
        }
        n.vx *= 0.97;
        n.vy *= 0.97;
        n.x = Math.max(0, Math.min(canvas.width, n.x + n.vx));
        n.y = Math.max(0, Math.min(canvas.height, n.y + n.vy));
        if (n.x <= 0 || n.x >= canvas.width) n.vx *= -1;
        if (n.y <= 0 || n.y >= canvas.height) n.vy *= -1;
        n.pulse += 0.018;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            const a = (1 - d / 130) * 0.35;
            const px = (nodes[i].x + nodes[j].x) / 2 / canvas.width;
            const r = Math.round(168 + (249 - 168) * px);
            const g = Math.round(85 + (115 - 85) * px);
            const b = Math.round(247 * (1 - px) + 22 * px);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const p = (Math.sin(n.pulse) + 1) / 2;
        const px = n.x / canvas.width;
        const r = Math.round(168 + (249 - 168) * px);
        const g = Math.round(85 + (115 - 85) * px);
        const b = Math.round(247 * (1 - px) + 22 * px);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (1 + p * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + p * 0.5})`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #04040a 100%)",
        }}
      />

      <div className="relative z-10 text-center px-6 select-none">
        <p
          className="chapter-label mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.2s",
          }}
        >
          AI Engineer · CS @ University of Michigan
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
          className="mt-10 flex flex-col items-center gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.9s",
          }}
        >
          <p className="text-slate-500 text-base sm:text-lg font-light tracking-widest uppercase">
            Building AI systems that ship to production
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#journey"
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }}
            >
              Explore
            </a>
            <a
              href="#contact"
              className="px-7 py-3 rounded-full text-sm font-semibold text-slate-400 border border-white/10 hover:border-white/25 transition-colors"
            >
              Hire Me
            </a>
          </div>
        </div>

        <div
          className="mt-16 flex items-center justify-center gap-3 text-slate-700"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          <div className="w-8 h-px bg-slate-700" />
          <span className="font-mono text-[10px] tracking-[0.35em]">SCROLL</span>
          <div className="w-8 h-px bg-slate-700" />
        </div>
      </div>
    </section>
  );
}
