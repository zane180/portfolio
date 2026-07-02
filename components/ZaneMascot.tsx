"use client";

// One Zane, everywhere. Same character across every appearance:
// dark swoop hair, warm skin, violet hoodie, easy smile.
// Poses keep him alive in different corners of the story.

type Pose = "wave" | "hype" | "peek" | "ball";

export default function ZaneMascot({
  pose = "wave",
  size = 110,
  className = "",
}: {
  pose?: Pose;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 150"
      width={size}
      height={size * 1.25}
      className={className}
      aria-hidden
    >
      {/* ——— Arms behind body (pose-dependent) ——— */}
      {pose === "wave" && (
        <g>
          {/* Raised waving arm */}
          <g style={{ transformOrigin: "82px 78px" }}>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-8 82 78; 14 82 78; -8 82 78"
              dur="1.6s"
              repeatCount="indefinite"
            />
            <path d="M80 80 Q98 62 102 44" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="103" cy="41" r="8" fill="#f5c9a6" />
          </g>
          {/* Resting arm */}
          <path d="M40 82 Q30 96 32 108" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
          <circle cx="32" cy="111" r="7.5" fill="#f5c9a6" />
        </g>
      )}

      {pose === "hype" && (
        <g>
          <g style={{ transformOrigin: "60px 80px" }}>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 -4; 0 0"
              dur="0.7s"
              repeatCount="indefinite"
            />
            <path d="M42 80 Q26 62 24 46" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="23" cy="43" r="8" fill="#f5c9a6" />
            <path d="M78 80 Q94 62 96 46" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="97" cy="43" r="8" fill="#f5c9a6" />
          </g>
        </g>
      )}

      {pose === "ball" && (
        <g>
          <path d="M40 82 Q28 92 30 104" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
          {/* Ball hand dribbling */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 9; 0 0"
              dur="0.55s"
              repeatCount="indefinite"
            />
            <path d="M80 82 Q92 92 92 100" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="93" cy="103" r="7.5" fill="#f5c9a6" />
            <circle cx="94" cy="120" r="12" fill="#ea580c" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
            <path d="M82 120 H106 M94 108 V132" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" fill="none" />
          </g>
        </g>
      )}

      {/* ——— Body (hidden for peek) ——— */}
      {pose !== "peek" && (
        <>
          {/* Hoodie */}
          <path d="M36 78 Q38 66 60 65 Q82 66 84 78 L82 122 Q60 128 38 122 Z" fill="#8b5cf6" />
          {/* Hoodie pocket */}
          <path d="M48 104 Q60 110 72 104 L70 116 Q60 120 50 116 Z" fill="#7c3aed" />
          {/* Drawstrings */}
          <path d="M54 70 L52 84 M66 70 L68 84" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round" />
          {/* Legs */}
          <path d="M48 124 L46 142 M72 124 L74 142" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" />
          {/* Sneakers */}
          <ellipse cx="44" cy="145" rx="9" ry="4.5" fill="#e2e8f0" />
          <ellipse cx="76" cy="145" rx="9" ry="4.5" fill="#e2e8f0" />
        </>
      )}

      {/* ——— Peek: fingers gripping an edge ——— */}
      {pose === "peek" && (
        <g>
          <ellipse cx="38" cy="66" rx="6" ry="4" fill="#f5c9a6" />
          <ellipse cx="82" cy="66" rx="6" ry="4" fill="#f5c9a6" />
        </g>
      )}

      {/* ——— Head (shared, gently bobbing) ——— */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -2; 0 0"
          dur="2.4s"
          repeatCount="indefinite"
        />
        {/* Face */}
        <circle cx="60" cy="42" r="24" fill="#f5c9a6" />
        {/* Swoop hair */}
        <path
          d="M36 40 Q34 16 60 16 Q88 14 84 40 Q82 24 62 26 Q42 26 40 42 Z"
          fill="#2b2118"
        />
        {/* Brows */}
        <path d="M46 34 Q51 31 56 34 M66 34 Q71 31 76 34" stroke="#2b2118" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <circle cx="51" cy="42" r="2.8" fill="#1e293b" />
        <circle cx="70" cy="42" r="2.8" fill="#1e293b" />
        {/* Eye glints */}
        <circle cx="52" cy="41" r="0.9" fill="white" />
        <circle cx="71" cy="41" r="0.9" fill="white" />
        {/* Smile */}
        <path d="M52 52 Q60 58 68 52" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
