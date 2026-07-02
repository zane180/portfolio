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

  // EKG animation
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
    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // EKG line: flatline between days, spike per commit count
      const seg = w / days.length;
      const baseline = h * 0.7;
      ctx.beginPath();
      ctx.moveTo(0, baseline);
      days.forEach((d, i) => {
        const cx = i * seg + seg / 2;
        if (d.count === 0) {
          ctx.lineTo(cx + seg / 2, baseline);
        } else {
          const spike = (d.count / max) * h * 0.55;
          ctx.lineTo(cx - seg * 0.25, baseline);
          ctx.lineTo(cx - seg * 0.1, baseline - spike);
          ctx.lineTo(cx + seg * 0.05, baseline + spike * 0.25);
          ctx.lineTo(cx + seg * 0.18, baseline);
        }
      });
      ctx.lineTo(w, baseline);

      const style = getComputedStyle(document.documentElement);
      const a1 = style.getPropertyValue("--a1").trim() || "#8b5cf6";
      ctx.strokeStyle = a1;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = a1;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Traveling pulse dot
      const px = (frame * 1.2) % w;
      ctx.beginPath();
      ctx.arc(px, baseline, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    draw();
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
