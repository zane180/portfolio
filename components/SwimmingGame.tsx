"use client";

import { useRef, useEffect, useState, useCallback } from "react";

type Phase = "ready" | "countdown" | "racing" | "finished";

interface Swimmer {
  name: string;
  x: number;
  speed: number;
  baseSpeed: number;
  color: string;
  cap: string;
  isPlayer: boolean;
  stroke: number;
  finished: boolean;
  finishTime: number;
}

const LANES = 4;
const RACE_TIME_LIMIT = 30;

export default function SwimmingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const swimmersRef = useRef<Swimmer[]>([]);
  const phaseRef = useRef<Phase>("ready");
  const countdownRef = useRef(3);
  const raceTimeRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const splashesRef = useRef<{ x: number; y: number; life: number }[]>([]);

  const [phase, setPhase] = useState<Phase>("ready");
  const [placement, setPlacement] = useState<number | null>(null);
  const [raceTime, setRaceTime] = useState(0);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const initSwimmers = useCallback((w: number) => {
    const startX = 60;
    swimmersRef.current = [
      { name: "Khalid", x: startX, speed: 0, baseSpeed: w * 0.062, color: "#ef4444", cap: "#dc2626", isPlayer: false, stroke: 0, finished: false, finishTime: 0 },
      { name: "ZANE", x: startX, speed: 0, baseSpeed: 0, color: "#8b5cf6", cap: "#7c3aed", isPlayer: true, stroke: 0, finished: false, finishTime: 0 },
      { name: "Omar", x: startX, speed: 0, baseSpeed: w * 0.058, color: "#f59e0b", cap: "#d97706", isPlayer: false, stroke: 0, finished: false, finishTime: 0 },
      { name: "Rahul", x: startX, speed: 0, baseSpeed: w * 0.066, color: "#22c55e", cap: "#16a34a", isPlayer: false, stroke: 0, finished: false, finishTime: 0 },
    ];
  }, []);

  const startRace = useCallback(() => {
    const { w } = dimsRef.current;
    initSwimmers(w);
    raceTimeRef.current = 0;
    setRaceTime(0);
    setPlacement(null);
    countdownRef.current = 3;
    setPhaseBoth("countdown");

    const tick = () => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        setPhaseBoth("racing");
      } else {
        setTimeout(tick, 800);
      }
    };
    setTimeout(tick, 800);
  }, [initSwimmers]);

  const strokeAction = useCallback(() => {
    if (phaseRef.current !== "racing") return;
    const player = swimmersRef.current.find((s) => s.isPlayer);
    if (!player || player.finished) return;
    const { w } = dimsRef.current;
    player.speed += w * 0.055;
    player.stroke += Math.PI;
    const { h } = dimsRef.current;
    const laneH = (h - 60) / LANES;
    splashesRef.current.push({
      x: player.x,
      y: 50 + laneH * 1 + laneH / 2,
      life: 1,
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (phaseRef.current === "ready" || phaseRef.current === "finished") {
          startRace();
        } else {
          strokeAction();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startRace, strokeAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    dimsRef.current = { w, h };
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initSwimmers(w);

    const finishX = w - 70;

    const drawPool = (time: number) => {
      // Water
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0c4a6e");
      grad.addColorStop(1, "#082f49");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Water shimmer
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 5; i++) {
        const y = ((time * 0.02 + i * 80) % (h + 40)) - 20;
        ctx.beginPath();
        ctx.ellipse(w / 2 + Math.sin(time * 0.001 + i) * 100, y, w * 0.4, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#7dd3fc";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Header strip
      ctx.fillStyle = "#083344";
      ctx.fillRect(0, 0, w, 40);
      ctx.fillStyle = "#22d3ee";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("U18 CHAMPIONSHIP FINAL — DUBAI", 14, 25);
      if (phaseRef.current === "racing") {
        ctx.textAlign = "right";
        ctx.fillText(raceTimeRef.current.toFixed(1) + "s", w - 14, 25);
      }
      ctx.textAlign = "left";

      const laneH = (h - 60) / LANES;

      // Lane ropes
      for (let i = 0; i <= LANES; i++) {
        const y = 50 + laneH * i;
        ctx.setLineDash([10, 8]);
        ctx.strokeStyle = i === 0 || i === LANES ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Finish line
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (let i = 0; i < Math.floor((h - 60) / 12); i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.4)";
        ctx.fillRect(finishX, 50 + i * 12, 6, 12);
      }
    };

    const drawSwimmer = (s: Swimmer, laneIdx: number, time: number) => {
      const laneH = (h - 60) / LANES;
      const y = 50 + laneH * laneIdx + laneH / 2;
      const bob = Math.sin(time * 0.008 + laneIdx) * 2;
      const armAngle = s.stroke + time * (s.finished ? 0.002 : phaseRef.current === "racing" ? 0.015 : 0.003);

      // Wake trail
      if (phaseRef.current === "racing" && !s.finished) {
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.ellipse(s.x - 26, y + bob, 20, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Body (torso in water)
      ctx.beginPath();
      ctx.ellipse(s.x - 10, y + bob + 2, 20, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();

      // Arms (windmill)
      const armX = s.x - 4;
      const a1 = Math.sin(armAngle) * 14;
      const a1y = Math.cos(armAngle) * 10;
      ctx.strokeStyle = "#f5c9a6";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(armX, y + bob);
      ctx.lineTo(armX + a1, y + bob - Math.abs(a1y));
      ctx.stroke();

      // Head with cap
      ctx.beginPath();
      ctx.arc(s.x + 10, y + bob, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#f5c9a6";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x + 10, y + bob, 8, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fillStyle = s.cap;
      ctx.fill();

      // Goggles
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(s.x + 15, y + bob - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Name tag
      ctx.font = `bold 10px monospace`;
      ctx.fillStyle = s.isPlayer ? "#c4b5fd" : "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText(s.name, 8, y - laneH / 2 + 14);

      if (s.finished) {
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(`${s.finishTime.toFixed(2)}s`, s.x + 26, y + 4);
      }
    };

    const animate = (time: number) => {
      const dt = Math.min((time - (lastTimeRef.current || time)) / 1000, 0.05);
      lastTimeRef.current = time;

      drawPool(time);

      const swimmers = swimmersRef.current;

      if (phaseRef.current === "racing") {
        raceTimeRef.current += dt;
        if (Math.floor(raceTimeRef.current * 10) % 2 === 0) {
          setRaceTime(Math.round(raceTimeRef.current * 10) / 10);
        }

        swimmers.forEach((s) => {
          if (s.finished) return;
          if (s.isPlayer) {
            // Player: impulse-based with drag
            s.speed *= Math.pow(0.25, dt);
            s.x += s.speed * dt;
          } else {
            // AI: base speed with wobble
            const wobble = Math.sin(time * 0.003 + s.baseSpeed) * 0.15 + 1;
            s.x += s.baseSpeed * wobble * dt;
          }
          if (s.x >= finishX - 10) {
            s.finished = true;
            s.finishTime = raceTimeRef.current;
          }
        });

        // Check player finish or all finished
        const player = swimmers.find((s) => s.isPlayer)!;
        if (player.finished || raceTimeRef.current > RACE_TIME_LIMIT) {
          const finishedOrder = [...swimmers]
            .sort((a, b) => {
              if (a.finished && b.finished) return a.finishTime - b.finishTime;
              if (a.finished) return -1;
              if (b.finished) return 1;
              return b.x - a.x;
            });
          const place = finishedOrder.findIndex((s) => s.isPlayer) + 1;
          setPlacement(place);
          setPhaseBoth("finished");
        }
      }

      swimmers.forEach((s, i) => drawSwimmer(s, i, time));

      // Splashes
      splashesRef.current = splashesRef.current.filter((sp) => sp.life > 0);
      splashesRef.current.forEach((sp) => {
        sp.life -= dt * 2.5;
        ctx.globalAlpha = Math.max(sp.life, 0) * 0.6;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(sp.x + i * 6 - 6, sp.y - (1 - sp.life) * 14, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#a5f3fc";
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      // Countdown overlay
      if (phaseRef.current === "countdown") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#22d3ee";
        ctx.font = "black 64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(countdownRef.current > 0 ? String(countdownRef.current) : "GO!", w / 2, h / 2 + 20);
        ctx.textAlign = "left";
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [initSwimmers]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="chapter-label mb-2">The Title Defense</p>
        <h3 className="text-3xl font-black text-white">U18 Championship — Swim as Zane</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Lane 2, purple cap. Mash <span className="font-mono text-cyan-400">SPACE</span> (or tap
          the button) to sprint 50m freestyle against the fastest U18 swimmers in Dubai.
        </p>
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-white/5 relative" style={{ height: 300 }}>
        <canvas ref={canvasRef} className="w-full h-full" />

        {(phase === "ready" || phase === "finished") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-4">
            {phase === "finished" && placement !== null && (
              <div className="text-center">
                <p className="text-5xl mb-2">
                  {placement === 1 ? "🏆" : placement === 2 ? "🥈" : placement === 3 ? "🥉" : "💨"}
                </p>
                <p className="text-2xl font-black text-white">
                  {placement === 1
                    ? "CHAMPION AGAIN!"
                    : placement === 2
                    ? "Silver — so close!"
                    : placement === 3
                    ? "Bronze — podium finish"
                    : "Outside the medals"}
                </p>
                <p className="text-slate-400 text-sm mt-1 font-mono">{raceTime.toFixed(1)}s</p>
              </div>
            )}
            <button
              onClick={startRace}
              className="px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            >
              {phase === "finished" ? "Race Again" : "Take Your Mark"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile stroke button */}
      {phase === "racing" && (
        <button
          onMouseDown={strokeAction}
          onTouchStart={(e) => {
            e.preventDefault();
            strokeAction();
          }}
          className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg select-none active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
        >
          STROKE! 🏊
        </button>
      )}
    </div>
  );
}
