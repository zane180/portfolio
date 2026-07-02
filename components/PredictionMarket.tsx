"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Kalshi-style mini market on Zane's career — a nod to the NBA prediction bot.
// Prices move with each trade via a logistic bump; state persists locally.

interface Market {
  id: string;
  question: string;
  deadline: string;
  basePrice: number; // starting YES price in cents
}

const MARKETS: Market[] = [
  { id: "ship-ai", question: "Zane ships his next AI project", deadline: "by Sep 2026", basePrice: 78 },
  { id: "faang-intern", question: "Lands Summer 2027 AI/SWE internship", deadline: "by Mar 2027", basePrice: 64 },
  { id: "nba-bot", question: "NBA prediction bot goes live on Kalshi", deadline: "by Dec 2026", basePrice: 55 },
];

interface Position {
  yes: number;
  no: number;
  priceShift: number;
}

type Book = Record<string, Position>;

const KEY = "zane-market";

function load(): Book {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function PredictionMarket() {
  const [book, setBook] = useState<Book>({});
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setBook(load());
  }, []);

  const trade = (id: string, side: "yes" | "no") => {
    setBook((prev) => {
      const pos = prev[id] ?? { yes: 0, no: 0, priceShift: 0 };
      const next: Book = {
        ...prev,
        [id]: {
          ...pos,
          [side]: pos[side] + 1,
          // Each trade nudges the price toward that side, decaying near bounds
          priceShift: Math.max(-25, Math.min(25, pos.priceShift + (side === "yes" ? 2 : -2))),
        },
      };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    setFlash(id + side);
    setTimeout(() => setFlash(null), 400);
  };

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-white font-black text-xl">The Zane Exchange</h3>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-slate-500 tracking-widest">
          PAPER TRADING
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Inspired by my Kalshi NBA bot — bet on my career instead. Prices move with your trades.
      </p>

      <div className="flex flex-col gap-3">
        {MARKETS.map((m) => {
          const pos = book[m.id] ?? { yes: 0, no: 0, priceShift: 0 };
          const yesPrice = Math.max(3, Math.min(97, m.basePrice + pos.priceShift));
          const noPrice = 100 - yesPrice;
          const held = pos.yes + pos.no > 0;

          return (
            <div
              key={m.id}
              className="gradient-border glass rounded-2xl p-5 flex flex-wrap items-center gap-4"
            >
              <div className="flex-1 min-w-[200px]">
                <p className="text-white font-bold text-sm">{m.question}</p>
                <p className="font-mono text-[10px] text-slate-600 mt-0.5">
                  {m.deadline}
                  {held && (
                    <span className="ml-2" style={{ color: "var(--a2)" }}>
                      · you hold {pos.yes} YES / {pos.no} NO
                    </span>
                  )}
                </p>
              </div>

              {/* Price bar */}
              <div className="w-full sm:w-40 order-last sm:order-none">
                <div className="h-1.5 rounded-full bg-red-500/25 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-green-500/70"
                    animate={{ width: `${yesPrice}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => trade(m.id, "yes")}
                  animate={flash === m.id + "yes" ? { scale: [1, 1.15, 1] } : {}}
                  className="px-4 py-2 rounded-xl text-xs font-black text-green-400 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                >
                  YES {yesPrice}¢
                </motion.button>
                <motion.button
                  onClick={() => trade(m.id, "no")}
                  animate={flash === m.id + "no" ? { scale: [1, 1.15, 1] } : {}}
                  className="px-4 py-2 rounded-xl text-xs font-black text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  NO {noPrice}¢
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[10px] text-slate-700 mt-3">
        * no real money. but I am genuinely long on all three.
      </p>
    </div>
  );
}
