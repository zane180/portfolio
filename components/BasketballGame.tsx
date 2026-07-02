"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  scored: boolean;
}

interface AimState {
  aiming: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const GRAVITY = 1400;
const SHOOTER_X_RATIO = 0.18;
const SHOOTER_Y_RATIO = 0.72;
const HOOP_X_RATIO = 0.78;
const HOOP_Y_RATIO = 0.42;
const HOOP_RADIUS = 22;
const BALL_RADIUS = 14;

export default function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball | null>(null);
  const aimRef = useRef<AimState>({
    aiming: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<"score" | "miss" | null>(null);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);

  const getDims = (canvas: HTMLCanvasElement) => ({
    W: canvas.width,
    H: canvas.height,
    shooterX: canvas.width * SHOOTER_X_RATIO,
    shooterY: canvas.height * SHOOTER_Y_RATIO,
    hoopX: canvas.width * HOOP_X_RATIO,
    hoopY: canvas.height * HOOP_Y_RATIO,
  });

  const drawCourt = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    // Floor
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, W, H);

    // Court floor
    const floorY = H * 0.82;
    ctx.fillStyle = "#1a1208";
    ctx.fillRect(0, floorY, W, H - floorY);

    // Floor line
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(W, floorY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 3-point arc (decorative)
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(W * SHOOTER_X_RATIO, floorY, H * 0.6, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  const drawHoop = useCallback((ctx: CanvasRenderingContext2D, hoopX: number, hoopY: number) => {
    // Backboard
    ctx.fillStyle = "#374151";
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(hoopX + HOOP_RADIUS + 5, hoopY - 45, 10, 70, 2);
    ctx.fill();
    ctx.stroke();

    // Rim
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hoopX - HOOP_RADIUS, hoopY);
    ctx.lineTo(hoopX + HOOP_RADIUS, hoopY);
    ctx.stroke();

    // Rim end caps
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(hoopX - HOOP_RADIUS, hoopY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hoopX + HOOP_RADIUS, hoopY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Net (zigzag lines)
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    const netLines = 6;
    const netHeight = 30;
    for (let i = 0; i <= netLines; i++) {
      const x = hoopX - HOOP_RADIUS + (i / netLines) * HOOP_RADIUS * 2;
      ctx.beginPath();
      ctx.moveTo(x, hoopY);
      ctx.lineTo(
        x + (i % 2 === 0 ? HOOP_RADIUS / netLines : -HOOP_RADIUS / netLines),
        hoopY + netHeight / 2
      );
      ctx.lineTo(x, hoopY + netHeight);
      ctx.stroke();
    }
  }, []);

  const drawShooter = useCallback(
    (ctx: CanvasRenderingContext2D, sx: number, sy: number) => {
      ctx.fillStyle = "#a855f7";
      // Body
      ctx.beginPath();
      ctx.roundRect(sx - 12, sy - 30, 24, 38, 4);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(sx, sy - 42, 14, 0, Math.PI * 2);
      ctx.fill();
      // Jersey "Z"
      ctx.fillStyle = "white";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Z", sx, sy - 38);
      // Legs
      ctx.fillStyle = "#7c3aed";
      ctx.beginPath();
      ctx.roundRect(sx - 11, sy + 6, 10, 22, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(sx + 1, sy + 6, 10, 22, 3);
      ctx.fill();
      ctx.textAlign = "left";
    },
    []
  );

  const drawBall = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      // Ball
      const grad = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, r);
      grad.addColorStop(0, "#ff9800");
      grad.addColorStop(0.7, "#e65100");
      grad.addColorStop(1, "#bf360c");
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Lines
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Seam lines
      ctx.beginPath();
      ctx.moveTo(x - r, y);
      ctx.lineTo(x + r, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, -Math.PI * 0.3, Math.PI * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, Math.PI * 0.7, Math.PI * 1.3);
      ctx.stroke();
    },
    []
  );

  const drawTrajectory = useCallback(
    (ctx: CanvasRenderingContext2D, sx: number, sy: number, vx: number, vy: number) => {
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(168,85,247,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let tx = sx;
      let ty = sy;
      let tvx = vx;
      let tvy = vy;
      const dt = 1 / 60;
      ctx.moveTo(tx, ty);
      for (let i = 0; i < 60; i++) {
        tvy += GRAVITY * dt;
        tx += tvx * dt;
        ty += tvy * dt;
        if (ty > 800) break;
        ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let scored = false;

    const checkScore = (ball: Ball, hoopX: number, hoopY: number) => {
      if (scored || ball.scored) return;
      const prevY = ball.y - ball.vy * (1 / 60);
      if (
        prevY < hoopY &&
        ball.y >= hoopY &&
        ball.vy > 0 &&
        Math.abs(ball.x - hoopX) < HOOP_RADIUS - BALL_RADIUS * 0.4
      ) {
        ball.scored = true;
        scored = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setFlash("score");
        setTimeout(() => setFlash(null), 700);
      }
    };

    const animate = (time: number) => {
      const dt = Math.min((time - (lastTimeRef.current || time)) / 1000, 0.05);
      lastTimeRef.current = time;

      const { W, H, shooterX, shooterY, hoopX, hoopY } = getDims(canvas);
      ctx.clearRect(0, 0, W, H);

      drawCourt(ctx, W, H);
      drawHoop(ctx, hoopX, hoopY);
      drawShooter(ctx, shooterX, shooterY);

      const aim = aimRef.current;
      if (aim.aiming) {
        const dx = aim.startX - aim.currentX;
        const dy = aim.startY - aim.currentY;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy), 280);
        const angle = Math.atan2(dy, dx);
        const speed = power * 4.2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        drawTrajectory(ctx, shooterX, shooterY - 10, vx, vy);

        // Power bar
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.roundRect(20, H - 36, 120, 12, 6);
        ctx.fill();
        const pct = power / 280;
        const barColor = pct < 0.5 ? "#22c55e" : pct < 0.8 ? "#f97316" : "#ef4444";
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(20, H - 36, 120 * pct, 12, 6);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.fillText("POWER", 20, H - 42);
      }

      // Ball
      const ball = ballRef.current;
      if (ball?.active) {
        ball.vy += GRAVITY * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        checkScore(ball, hoopX, hoopY);

        if (ball.y > H + 50 || ball.x > W + 50) {
          if (!ball.scored) {
            missesRef.current += 1;
            setMisses(missesRef.current);
            setFlash("miss");
            setTimeout(() => setFlash(null), 500);
          }
          ballRef.current = null;
        } else {
          drawBall(ctx, ball.x, ball.y, BALL_RADIUS);
        }
      } else if (!ball) {
        drawBall(ctx, shooterX, shooterY - 10, BALL_RADIUS);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [drawCourt, drawHoop, drawShooter, drawBall, drawTrajectory]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || ballRef.current?.active) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width * SHOOTER_X_RATIO;
    const sy = canvas.height * SHOOTER_Y_RATIO;
    aimRef.current = {
      aiming: true,
      startX: sx,
      startY: sy - 10,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!aimRef.current.aiming) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    aimRef.current.currentX = e.clientX - rect.left;
    aimRef.current.currentY = e.clientY - rect.top;
  };

  const handleMouseUp = () => {
    const aim = aimRef.current;
    if (!aim.aiming) return;
    aim.aiming = false;

    const dx = aim.startX - aim.currentX;
    const dy = aim.startY - aim.currentY;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy), 280);
    if (power < 10) return;

    const angle = Math.atan2(dy, dx);
    const speed = power * 4.2;

    ballRef.current = {
      x: aim.startX,
      y: aim.startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      active: true,
      scored: false,
    };
  };

  const total = score + misses;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="chapter-label mb-2">Mini Game</p>
        <h3 className="text-3xl font-black text-white">Basketball</h3>
        <p className="text-slate-500 text-sm mt-1">
          Click &amp; drag from Zane to aim — release to shoot
        </p>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center gap-6 text-center">
        <div>
          <p className="text-3xl font-black text-orange-400">{score}</p>
          <p className="text-xs text-slate-600 font-mono">MADE</p>
        </div>
        <div>
          <p
            className="text-2xl font-black"
            style={{ color: flash === "score" ? "#22c55e" : flash === "miss" ? "#ef4444" : "#6b7280" }}
          >
            {flash === "score" ? "SWISH!" : flash === "miss" ? "MISS" : `${pct}%`}
          </p>
          <p className="text-xs text-slate-600 font-mono">
            {flash ? "" : "FG%"}
          </p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-500">{misses}</p>
          <p className="text-xs text-slate-600 font-mono">MISS</p>
        </div>
      </div>

      <div
        className="w-full rounded-2xl overflow-hidden border border-white/5 cursor-crosshair"
        style={{ height: 320 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <button
        onClick={() => {
          scoreRef.current = 0;
          missesRef.current = 0;
          setScore(0);
          setMisses(0);
          ballRef.current = null;
        }}
        className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
      >
        [ reset ]
      </button>
    </div>
  );
}
