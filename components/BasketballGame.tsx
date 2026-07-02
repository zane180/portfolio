"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "./sfx";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  scored: boolean;
  bounces: number;
}

const GRAVITY = 1400;
const SHOOTER_X = 0.16;
const SHOOTER_Y = 0.74;
const HOOP_X = 0.8;
const HOOP_Y = 0.38;
const HOOP_R = 24;
const BALL_R = 13;
const TARGET_SCORE = 3;

export default function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball | null>(null);
  const aimRef = useRef({ aiming: false, sx: 0, sy: 0, cx: 0, cy: 0 });
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const shootPoseRef = useRef(0);
  const confettiRef = useRef<{ x: number; y: number; vx: number; vy: number; c: string; life: number }[]>([]);

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [flash, setFlash] = useState<"score" | "miss" | null>(null);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const attemptsRef = useRef(0);
  const wonRef = useRef(false);

  const spawnConfetti = useCallback((w: number, h: number) => {
    const colors = ["#8b5cf6", "#22d3ee", "#10b981", "#fbbf24", "#f472b6"];
    for (let i = 0; i < 60; i++) {
      confettiRef.current.push({
        x: Math.random() * w,
        y: -10 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 120,
        vy: 80 + Math.random() * 120,
        c: colors[i % colors.length],
        life: 1,
      });
    }
  }, []);

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

    const sx = w * SHOOTER_X;
    const sy = h * SHOOTER_Y;
    const hx = w * HOOP_X;
    const hy = h * HOOP_Y;
    const floorY = h * 0.86;

    const drawScene = (time: number) => {
      // Arena background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0b0b18");
      bg.addColorStop(1, "#12101f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Crowd silhouettes
      ctx.fillStyle = "rgba(139,92,246,0.08)";
      for (let i = 0; i < Math.floor(w / 26); i++) {
        const cy = 60 + Math.sin(time * 0.002 + i * 1.7) * 3;
        ctx.beginPath();
        ctx.arc(13 + i * 26, cy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(5 + i * 26, cy + 6, 16, 14);
      }

      // Banner
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(0, 96, w, 26);
      ctx.fillStyle = "rgba(251,191,36,0.7)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("★ VARSITY FINALS — CAPTAIN'S GAME ★", w / 2, 113);
      ctx.textAlign = "left";

      // Court floor (wood)
      const wood = ctx.createLinearGradient(0, floorY, 0, h);
      wood.addColorStop(0, "#3d2b12");
      wood.addColorStop(1, "#2a1d0c");
      ctx.fillStyle = wood;
      ctx.fillRect(0, floorY, w, h - floorY);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 34) {
        ctx.beginPath();
        ctx.moveTo(i, floorY);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      // Court line
      ctx.strokeStyle = "rgba(251,191,36,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();
    };

    const drawHoop = () => {
      // Pole
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(hx + HOOP_R + 18, hy - 40, 8, floorY - hy + 40);
      // Backboard
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(hx + HOOP_R + 8, hy - 52, 8, 78, 2);
      ctx.fill();
      ctx.stroke();
      // Square target on backboard
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.strokeRect(hx + HOOP_R + 4, hy - 18, 4, 18);

      // Rim — classic orange
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hx - HOOP_R, hy);
      ctx.lineTo(hx + HOOP_R, hy);
      ctx.stroke();
      ctx.fillStyle = "#f97316";
      [hx - HOOP_R, hx + HOOP_R].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, hy, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Net
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      const seg = 6;
      for (let i = 0; i <= seg; i++) {
        const x = hx - HOOP_R + (i / seg) * HOOP_R * 2;
        const pinch = (x - hx) * 0.35;
        ctx.beginPath();
        ctx.moveTo(x, hy);
        ctx.quadraticCurveTo(x - pinch, hy + 16, x - pinch, hy + 30);
        ctx.stroke();
      }
    };

    const drawZane = (time: number) => {
      const pose = shootPoseRef.current; // 0 = idle, 1 = arms up
      const bob = Math.sin(time * 0.004) * 2;
      const y = sy + bob;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(sx, floorY + 6, 26, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.strokeStyle = "#6d28d9";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(sx - 6, y + 8);
      ctx.lineTo(sx - 9, floorY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx + 6, y + 8);
      ctx.lineTo(sx + 9, floorY);
      ctx.stroke();

      // Jersey body
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.roundRect(sx - 14, y - 32, 28, 42, 6);
      ctx.fill();
      // Jersey number
      ctx.fillStyle = "white";
      ctx.font = "black 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("7", sx, y - 8);

      // Arms
      ctx.strokeStyle = "#f5c9a6";
      ctx.lineWidth = 7;
      if (pose > 0) {
        // Follow-through: both arms up toward hoop
        ctx.beginPath();
        ctx.moveTo(sx + 8, y - 26);
        ctx.lineTo(sx + 22, y - 52);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx - 8, y - 26);
        ctx.lineTo(sx + 6, y - 50);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(sx + 10, y - 24);
        ctx.lineTo(sx + 20, y - 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx - 10, y - 24);
        ctx.lineTo(sx - 20, y - 8);
        ctx.stroke();
      }

      // Head
      ctx.fillStyle = "#f5c9a6";
      ctx.beginPath();
      ctx.arc(sx, y - 46, 13, 0, Math.PI * 2);
      ctx.fill();
      // Hair
      ctx.fillStyle = "#2b2118";
      ctx.beginPath();
      ctx.arc(sx, y - 50, 13, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
      // Eyes looking at hoop
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(sx + 6, y - 46, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Headband
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(sx - 13, y - 52, 26, 4);

      ctx.textAlign = "left";
      if (pose > 0) shootPoseRef.current = Math.max(0, pose - 0.02);
    };

    // Opposing team — red jerseys, they jump to block your shot
    const DEFENDERS = [
      { xr: 0.42, num: "23", jumpSpeed: 1.1, phase: 0.4, skin: "#c68863", hair: "#111827" },
      { xr: 0.58, num: "11", jumpSpeed: 1.6, phase: 2.1, skin: "#8d5a3a", hair: "#000000" },
    ];

    const defenderPos = (d: (typeof DEFENDERS)[0], time: number) => {
      const jump = Math.max(0, Math.sin(time * 0.001 * d.jumpSpeed + d.phase)) * 44;
      return { dx: w * d.xr, dy: floorY - jump };
    };

    const drawDefender = (d: (typeof DEFENDERS)[0], time: number) => {
      const { dx, dy } = defenderPos(d, time);
      const armWave = Math.sin(time * 0.006 + d.phase) * 8;

      // Shadow (stays on floor even mid-jump)
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(dx, floorY + 6, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(dx - 5, dy - 24);
      ctx.lineTo(dx - 8, dy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dx + 5, dy - 24);
      ctx.lineTo(dx + 8, dy);
      ctx.stroke();

      // Jersey
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.roundRect(dx - 13, dy - 60, 26, 38, 6);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "black 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.num, dx, dy - 38);

      // Arms up, waving to block
      ctx.strokeStyle = d.skin;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(dx - 9, dy - 54);
      ctx.lineTo(dx - 16 + armWave * 0.3, dy - 84);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dx + 9, dy - 54);
      ctx.lineTo(dx + 16 + armWave * 0.3, dy - 86);
      ctx.stroke();

      // Head
      ctx.fillStyle = d.skin;
      ctx.beginPath();
      ctx.arc(dx, dy - 72, 11, 0, Math.PI * 2);
      ctx.fill();
      // Hair
      ctx.fillStyle = d.hair;
      ctx.beginPath();
      ctx.arc(dx, dy - 75, 11, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
      // Determined eyes (facing left, toward Zane)
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(dx - 5, dy - 72, 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = "left";
    };

    const collideDefenders = (ball: Ball, time: number): boolean => {
      for (const d of DEFENDERS) {
        const { dx, dy } = defenderPos(d, time);
        // Blocking zone: raised hands area
        const bx = dx;
        const by = dy - 78;
        const dist = Math.sqrt((ball.x - bx) ** 2 + (ball.y - by) ** 2);
        if (dist < 26 + BALL_R && ball.vx > 0) {
          ball.vx *= -0.45;
          ball.vy = -Math.abs(ball.vy) * 0.25 - 120;
          sfx.thud();
          return true;
        }
      }
      return false;
    };

    const drawBall = (x: number, y: number) => {
      const grad = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, BALL_R);
      grad.addColorStop(0, "#fb923c");
      grad.addColorStop(0.7, "#ea580c");
      grad.addColorStop(1, "#9a3412");
      ctx.beginPath();
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - BALL_R, y);
      ctx.lineTo(x + BALL_R, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - BALL_R);
      ctx.quadraticCurveTo(x + 6, y, x, y + BALL_R);
      ctx.stroke();
    };

    const collideRim = (ball: Ball) => {
      // Rim endpoints as solid circles
      [hx - HOOP_R, hx + HOOP_R].forEach((rimX) => {
        const dx = ball.x - rimX;
        const dy = ball.y - hy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const minD = BALL_R + 4;
        if (d < minD && d > 0) {
          const nx = dx / d;
          const ny = dy / d;
          const dot = ball.vx * nx + ball.vy * ny;
          if (dot < 0) {
            ball.vx -= 1.7 * dot * nx;
            ball.vy -= 1.7 * dot * ny;
            ball.vx *= 0.75;
            ball.vy *= 0.75;
            ball.x = rimX + nx * minD;
            ball.y = hy + ny * minD;
            sfx.clank();
          }
        }
      });
      // Backboard
      const bbX = hx + HOOP_R + 8;
      if (
        ball.x + BALL_R > bbX &&
        ball.x < bbX + 10 &&
        ball.y > hy - 52 &&
        ball.y < hy + 26 &&
        ball.vx > 0
      ) {
        ball.vx *= -0.6;
        ball.x = bbX - BALL_R;
      }
    };

    const registerMiss = () => {
      attemptsRef.current += 1;
      setAttempts(attemptsRef.current);
      setFlash("miss");
      setTimeout(() => setFlash(null), 500);
    };

    const animate = (time: number) => {
      const dt = Math.min((time - (lastTimeRef.current || time)) / 1000, 0.05);
      lastTimeRef.current = time;

      drawScene(time);
      drawHoop();
      drawZane(time);
      DEFENDERS.forEach((d) => drawDefender(d, time));

      const aim = aimRef.current;
      if (aim.aiming) {
        const dx = aim.sx - aim.cx;
        const dy = aim.sy - aim.cy;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy), 260);
        const ang = Math.atan2(dy, dx);
        let tvx = Math.cos(ang) * power * 4.4;
        let tvy = Math.sin(ang) * power * 4.4;
        let tx = sx + 14;
        let ty = sy - 56;
        ctx.setLineDash([3, 7]);
        ctx.strokeStyle = "rgba(34,211,238,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        for (let i = 0; i < 55; i++) {
          tvy += GRAVITY / 60;
          tx += tvx / 60;
          ty += tvy / 60;
          if (ty > floorY) break;
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Power meter
        const pct = power / 260;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.roundRect(16, h - 34, 110, 10, 5);
        ctx.fill();
        ctx.fillStyle = pct < 0.55 ? "#22c55e" : pct < 0.8 ? "#fbbf24" : "#ef4444";
        ctx.beginPath();
        ctx.roundRect(16, h - 34, 110 * pct, 10, 5);
        ctx.fill();
      }

      const ball = ballRef.current;
      if (ball?.active) {
        ball.vy += GRAVITY * dt;
        const prevY = ball.y;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        collideRim(ball);
        if (!ball.scored) collideDefenders(ball, time);

        // Score check: crossed rim plane downward, inside rim, below-net exit
        if (
          !ball.scored &&
          prevY < hy &&
          ball.y >= hy &&
          ball.vy > 0 &&
          Math.abs(ball.x - hx) < HOOP_R - BALL_R * 0.35
        ) {
          ball.scored = true;
          scoreRef.current += 1;
          attemptsRef.current += 1;
          setScore(scoreRef.current);
          setAttempts(attemptsRef.current);
          setFlash("score");
          sfx.swish();
          sfx.cheer();
          setTimeout(() => setFlash(null), 700);
          if (scoreRef.current >= TARGET_SCORE && !wonRef.current) {
            wonRef.current = true;
            setWon(true);
            spawnConfetti(w, h);
            setTimeout(() => sfx.cheer(), 300);
          }
        }

        // Floor bounce
        if (ball.y + BALL_R > floorY && ball.vy > 0) {
          ball.y = floorY - BALL_R;
          ball.vy *= -0.55;
          ball.vx *= 0.8;
          ball.bounces += 1;
          sfx.bounce();
        }

        // Ball dead
        if (ball.bounces > 3 || ball.x > w + 40 || ball.x < -40) {
          if (!ball.scored) registerMiss();
          ballRef.current = null;
        } else {
          drawBall(ball.x, ball.y);
        }
      } else if (!ball) {
        drawBall(sx + 14, sy - 56);
      }

      // Confetti
      confettiRef.current = confettiRef.current.filter((c) => c.life > 0);
      confettiRef.current.forEach((c) => {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.life -= dt * 0.4;
        ctx.globalAlpha = Math.max(c.life, 0);
        ctx.fillStyle = c.c;
        ctx.fillRect(c.x, c.y, 5, 8);
        ctx.globalAlpha = 1;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [spawnConfetti]);

  const getPos = (e: React.MouseEvent | React.Touch) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const aimStart = (x: number, y: number) => {
    if (ballRef.current?.active) return;
    const { w, h } = dimsRef.current;
    aimRef.current = { aiming: true, sx: w * SHOOTER_X + 14, sy: h * SHOOTER_Y - 56, cx: x, cy: y };
  };
  const aimMove = (x: number, y: number) => {
    if (!aimRef.current.aiming) return;
    aimRef.current.cx = x;
    aimRef.current.cy = y;
  };
  const aimRelease = () => {
    const aim = aimRef.current;
    if (!aim.aiming) return;
    aim.aiming = false;
    const dx = aim.sx - aim.cx;
    const dy = aim.sy - aim.cy;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy), 260);
    if (power < 12) return;
    const ang = Math.atan2(dy, dx);
    ballRef.current = {
      x: aim.sx,
      y: aim.sy,
      vx: Math.cos(ang) * power * 4.4,
      vy: Math.sin(ang) * power * 4.4,
      active: true,
      scored: false,
      bounces: 0,
    };
    shootPoseRef.current = 1;
  };

  const reset = () => {
    scoreRef.current = 0;
    attemptsRef.current = 0;
    wonRef.current = false;
    setScore(0);
    setAttempts(0);
    setWon(false);
    ballRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="chapter-label mb-2">The Captain&apos;s Game</p>
        <h3 className="text-3xl font-black text-white">Score {TARGET_SCORE} to Win the Final</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Varsity Finals. As captain, the last shots are yours — but the defense has hands.
          Drag anywhere to aim, release to shoot over the block.
        </p>
      </div>

      <div className="flex items-center gap-8 text-center">
        <div>
          <p className="text-3xl font-black text-emerald-400">{score}<span className="text-slate-600 text-lg">/{TARGET_SCORE}</span></p>
          <p className="text-xs text-slate-600 font-mono">BUCKETS</p>
        </div>
        <div className="w-20">
          <p className="text-xl font-black h-7"
            style={{ color: flash === "score" ? "#22c55e" : flash === "miss" ? "#ef4444" : "#475569" }}>
            {won ? "🏆" : flash === "score" ? "SWISH!" : flash === "miss" ? "MISS" : "—"}
          </p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-500">{attempts}</p>
          <p className="text-xs text-slate-600 font-mono">SHOTS</p>
        </div>
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-white/5 relative touch-none" style={{ height: 340 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={(e) => { const p = getPos(e); aimStart(p.x, p.y); }}
          onMouseMove={(e) => { const p = getPos(e); aimMove(p.x, p.y); }}
          onMouseUp={aimRelease}
          onMouseLeave={aimRelease}
          onTouchStart={(e) => { const p = getPos(e.touches[0]); aimStart(p.x, p.y); }}
          onTouchMove={(e) => { const p = getPos(e.touches[0]); aimMove(p.x, p.y); }}
          onTouchEnd={aimRelease}
        />
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
            <p className="text-5xl">🏆</p>
            <p className="text-3xl font-black gradient-text">CHAMPIONS!</p>
            <p className="text-slate-400 text-sm">
              {score}/{attempts} shooting — captain delivers.
            </p>
            <button
              onClick={reset}
              className="mt-2 px-6 py-2.5 rounded-full font-bold text-white text-sm transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--a1), var(--a2))" }}
            >
              Run It Back
            </button>
          </div>
        )}
      </div>

      <button onClick={reset} className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors">
        [ reset ]
      </button>
    </div>
  );
}
