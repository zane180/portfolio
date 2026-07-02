"use client";

const ITEMS = [
  "DUBAI → ANN ARBOR ✈",
  "AI ENGINEER IN TRAINING",
  "POINT GUARD · #7",
  "FÜR ELISE ON REPEAT",
  "50M FREESTYLE",
  "WOLVERINE 〽️",
  "DEAN'S LIST",
  "SHIP > TALK",
  "DUKE OF ED · SILVER",
  "98/100 COMPUTER SCIENCE",
  "TAUGHT JAVA IN KENYA",
  "CLAUDE VISION PIPELINES",
];

export default function MarqueeStrip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden py-5 border-y border-white/5 select-none">
      <div className="marquee-track flex whitespace-nowrap w-max">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono text-xs tracking-[0.3em] text-slate-600 hover:text-white transition-colors">
              {item}
            </span>
            <span
              className="mx-6 w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "var(--a1)", opacity: 0.6 }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
