import type { FearGreedIndex } from "@/types";

export function FearGreedGauge({ index }: { index: FearGreedIndex }) {
  const score = Math.max(0, Math.min(100, index.score));
  const centerX = 112;
  const centerY = 112;
  const needleLength = 72;
  const angleDeg = 180 - (score / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleX = centerX + Math.cos(angleRad) * needleLength;
  const needleY = centerY - Math.sin(angleRad) * needleLength;

  return (
    <div className="relative mx-auto h-32 w-60">
      <svg viewBox="0 0 224 132" role="img" aria-label={`공포-탐욕 지수 ${score}점`} className="h-full w-full">
        <defs>
          <linearGradient id="fearGreedGradient" x1="24" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1570EF" />
            <stop offset="45%" stopColor="#039855" />
            <stop offset="70%" stopColor="#DC6803" />
            <stop offset="100%" stopColor="#D92D20" />
          </linearGradient>
        </defs>
        <path
          d="M 24 112 A 88 88 0 0 1 200 112"
          fill="none"
          stroke="url(#fearGreedGradient)"
          strokeWidth="26"
          strokeLinecap="butt"
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#17202A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={centerX} cy={centerY} r="5" fill="#17202A" />
      </svg>
      <div className="absolute inset-x-0 top-12 text-center">
        <div className="text-4xl font-bold leading-none">{score}</div>
        <div className="mt-1 text-sm font-semibold">{index.label}</div>
      </div>
    </div>
  );
}
