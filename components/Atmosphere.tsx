"use client";

// Fixed background auroras tinted by the live chapter palette.
// Because --a1/--a2/--a3 transition via @property, the atmosphere
// itself morphs as you travel between chapters — no JS involved.
export default function Atmosphere() {
  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="aurora"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-12%",
          left: "-8%",
          background: "color-mix(in srgb, var(--a1) 7%, transparent)",
          animation: "drift-a 26s ease-in-out infinite",
        }}
      />
      <div
        className="aurora"
        style={{
          width: "48vw",
          height: "48vw",
          bottom: "-15%",
          right: "-10%",
          background: "color-mix(in srgb, var(--a2) 6%, transparent)",
          animation: "drift-b 32s ease-in-out infinite",
        }}
      />
      <div
        className="aurora"
        style={{
          width: "36vw",
          height: "36vw",
          top: "40%",
          left: "55%",
          background: "color-mix(in srgb, var(--a3) 5%, transparent)",
          animation: "drift-a 38s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
