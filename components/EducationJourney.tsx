"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ZaneMascot from "./ZaneMascot";

const stops = [
  {
    emoji: "🇦🇪",
    city: "Dubai",
    country: "UAE",
    school: "GEMS Modern Academy",
    period: "2012 – 2025",
    chapter: "The Beginning",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.2)",
    achievements: [
      "ISC Grade 12 — 90% aggregate",
      "ICSE Grade 10 — 92% aggregate",
      "Computer Science — 98/100, School Runner-Up",
      "Varsity Basketball Captain",
      "Duke of Edinburgh Silver Award",
    ],
    story:
      "Where curiosity met code. Top of class, captained the basketball team, taught myself to build things, and discovered a love for turning ideas into software.",
  },
  {
    emoji: "〽️",
    city: "Ann Arbor",
    country: "Michigan",
    school: "University of Michigan",
    period: "2025 – 2029",
    chapter: "The Mission",
    accent: "#eab308",
    accentBg: "rgba(234,179,8,0.08)",
    accentBorder: "rgba(234,179,8,0.2)",
    achievements: [
      "BS Computer Science",
      "#1 CS program in the Midwest",
      "Dean's List — freshman year",
      "Shipped Lovemaxxing & Sentify — production AI systems",
      "Targeting FAANG AI Engineering — Summer 2027",
    ],
    story:
      "The AI chapter. One of the best CS programs in the country, two production AI systems shipped. The mission: become an AI engineer who builds systems that scale, matter, and ship to millions.",
  },
];

export default function EducationJourney() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="journey" className="py-32 px-6 overflow-hidden relative">
      <span className="side-label left-4 hidden xl:block">Dubai → Ann Arbor</span>
      <div className="max-w-7xl mx-auto relative">
        <div className="hidden lg:block absolute -top-16 right-4 z-10">
          <ZaneMascot pose="wave" size={92} />
        </div>
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="chapter-label mb-5">Chapter 01 — Origin Story</p>
          <div className="relative">
            <span className="ghost-num">01</span>
            <h2
              className="font-black text-white leading-none"
              style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
            >
              The <span className="serif-i gradient-text">Journey</span>
            </h2>
          </div>
          <p className="text-slate-500 mt-4 text-base max-w-xl">
            Dubai to Michigan. Two cities, one trajectory.
          </p>
        </motion.div>

        {/* Path line */}
        <div className="relative">
          <div
            className="hidden lg:block absolute top-[88px] left-[25%] right-[25%] h-px"
            style={{
              background: "linear-gradient(to right, #f59e0b40, #eab30840)",
            }}
          />
          {/* Dots on path */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="hidden lg:block absolute top-[82px] w-3 h-3 rounded-full"
              style={{
                left: `calc(${25 + i * 50}% - 6px)`,
                background: stops[i].accent,
                boxShadow: `0 0 12px ${stops[i].accent}`,
              }}
            />
          ))}

          <div className="grid lg:grid-cols-2 gap-6">
            {stops.map((stop, i) => (
              <JourneyCard key={stop.city} stop={stop} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyCard({
  stop,
  index,
}: {
  stop: (typeof stops)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-2xl p-7 flex flex-col gap-5"
      style={{
        background: stop.accentBg,
        border: `1px solid ${stop.accentBorder}`,
      }}
    >
      <div>
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          0{index + 1}
        </span>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <span className="text-4xl">{stop.emoji}</span>
            <p
              className="font-mono text-[10px] tracking-widest mt-3 uppercase"
              style={{ color: stop.accent }}
            >
              {stop.chapter}
            </p>
            <h3 className="text-3xl font-black text-white mt-1">{stop.city}</h3>
            <p className="text-slate-500 text-sm">{stop.country}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-semibold text-white text-sm">{stop.school}</p>
        <p className="font-mono text-[11px] text-slate-500 mt-0.5">{stop.period}</p>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 pl-4" style={{ borderColor: stop.accent }}>
        &ldquo;{stop.story}&rdquo;
      </p>

      <div className="flex flex-col gap-2.5">
        {stop.achievements.map((a) => (
          <div key={a} className="flex items-start gap-2.5">
            <span
              className="mt-1.5 w-1 h-1 rounded-full shrink-0"
              style={{ background: stop.accent }}
            />
            <span className="text-slate-400 text-sm">{a}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
