import type { FearGreedIndex } from "@/types";

export function FearGreedGauge({ index }: { index: FearGreedIndex }) {
  const rotation = -90 + (index.score / 100) * 180;
  return (
    <div className="relative mx-auto h-28 w-56 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-56 rounded-full bg-[conic-gradient(from_270deg,#1570EF_0deg,#039855_85deg,#DC6803_135deg,#D92D20_180deg,transparent_180deg)]" />
      <div className="absolute inset-x-5 top-5 h-[11.5rem] rounded-full bg-white" />
      <div
        className="absolute left-1/2 top-[92px] h-1 w-20 origin-left rounded-full bg-ink"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <div className="absolute inset-x-0 top-12 text-center">
        <div className="text-4xl font-bold">{index.score}</div>
        <div className="text-sm font-semibold">{index.label}</div>
      </div>
    </div>
  );
}
