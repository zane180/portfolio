"use client";

import { useEffect, useRef, useState } from "react";

// Live proof the "SHIP > TALK" marquee isn't decoration:
// real commit activity from the GitHub public events API, drawn as an EKG.

interface DayCount {
  date: string;
  count: number;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function GitHubHeartbeat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [days, setDays] = useState<DayCount[]>([]);
  const [lastCommit, setLastCommit] = useState<string | null>(null);
  const [totalCommits, setTotalCommits] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/users/zane180/events/public?per_page=100")
      .then((r) => {
        if (!r.ok) throw new Error("rate limited");
        return r.json();
      })
      .then((events: { type: string; created_at: string; payload?: { commits?: unknown[] } }[]) => {
        const pushes = events.filter((e) => e.type === "PushEvent");
        if (pushes.length > 0) setLastCommit(pushes[0].created_at);

        // Bucket commits per day, last 14 days
        const buckets = new Map<string, number>();
        for (let i = 13; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86400000);
          buckets.set(d.toISOString().slice(0, 10), 0);
        }
        let total = 0;
        pushes.forEach((e) => {
          const day = e.created_at.slice(0, 10);
          const n = e.payload?.commits?.length ?? 1;
          if (buckets.has(day)) {
            buckets.set(day, (buckets.get(day) ?? 0) + n);
            total += n;
          }
        });
        setTotalCommits(total);
        setDays([...buckets.entries()].map(([date, count]) => ({ date, count })));
      })
      .catch(() => setError(true));
  }, []);

  // ECG animation — works like a real bedside monitor: the last 14 days
  // map onto the strip, every commit lays down a PQRST complex (amplitude
  // scaled by that day's volume), and a sweep cursor redraws the trace,
  // erasing ahead of itself while the previous pass lingers dimmed.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || days.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const max = Math.max(...days.map((d) => d.count), 1);
    const baseline = h * 0.62;

    // One heartbeat per commit (capped per day so busy days don't smear),
    // spaced evenly inside that day's slice of the strip.
    const seg = w / days.length;
    const beats: { x: number; amp: number }[] = [];
    days.forEach((d, i) => {
      if (d.count === 0) return;
      const n = Math.min(d.count, 3);
      const amp = 0.45 + 0.55 * (d.count / max);
      for (let k = 0; k < n; k++) {
        beats.push({ x: i * seg + seg * ((k + 1) / (n + 1)), amp });
      }
    });

    const bump = (x: number, cx: number, sd: number) =>
      Math.exp(-((x - cx) ** 2) / (2 * sd * sd));
    // Canonical ECG morphology: P wave, QRS complex, T wave
    const waveAt = (x: number) => {
      let y = 0;
      for (const b of beats) {
        if (Math.abs(x - b.x) > 34) continue;
        y +=
          b.amp *
          (0.14 * bump(x, b.x - 16, 4) -
            0.12 * bump(x, b.x - 4, 1.6) +
            1.0 * bump(x, b.x, 2.2) -
            0.28 * bump(x, b.x + 4.5, 1.8) +
            0.22 * bump(x, b.x + 17, 5));
      }
      return baseline - y * h * 0.4;
    };
    const wave = new Float32Array(w + 1);
    for (let x = 0; x <= w; x++) wave[x] = waveAt(x);

    const SWEEP_MS = 8000;
    const ERASE_GAP = 26;
    let start: number | null = null;
    let raf: number;

    const strokeWave = (from: number, to: number, color: string, width: number, glow: number) => {
      const x0 = Math.max(0, Math.floor(from));
      const x1 = Math.min(w, Math.ceil(to));
      if (x1 <= x0) return;
      ctx.beginPath();
      ctx.moveTo(x0, wave[x0]);
      for (let x = x0 + 1; x <= x1; x++) ctx.lineTo(x, wave[x]);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.shadowColor = color;
      ctx.shadowBlur = glow;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = (time: number) => {
      if (start === null) start = time;
      const sweep = (((time - start) % SWEEP_MS) / SWEEP_MS) * w;
      ctx.clearRect(0, 0, w, h);

      // ECG paper grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = h % 12; y < h; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const style = getComputedStyle(document.documentElement);
      const a1 = style.getPropertyValue("--a1").trim() || "#8b5cf6";

      // Previous pass lingers ahead of the erase gap, dimmed
      ctx.globalAlpha = 0.25;
      strokeWave(sweep + ERASE_GAP, w, a1, 1.4, 0);
      ctx.globalAlpha = 1;
      // Current pass, bright up to the cursor
      strokeWave(0, sweep, a1, 1.8, 6);

      // Cursor rides the waveform and flares on an R spike
      const cy = wave[Math.min(w, Math.floor(sweep))];
      const spiking = baseline - cy > h * 0.12;
      ctx.beginPath();
      ctx.arc(sweep, cy, spiking ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.shadowColor = "white";
      ctx.shadowBlur = spiking ? 12 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [days]);

  if (error) return null;

  return (
    <div className="border-y border-white/5 py-4 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 uppercase">
            Live from GitHub
          </span>
        </div>

        <canvas ref={canvasRef} className="h-12 flex-1 min-w-[180px]" />

        <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
          <div>
            <p className="text-slate-600 text-[9px] uppercase tracking-wider">Last commit</p>
            <p className="text-white font-bold">{lastCommit ? timeAgo(lastCommit) : "—"}</p>
          </div>
          <div>
            <p className="text-slate-600 text-[9px] uppercase tracking-wider">14-day commits</p>
            <p className="font-bold gradient-text">{totalCommits}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
