"use client";

import type { EmotionState } from "@/types/journal";

const emotions: Exclude<EmotionState, "">[] = ["확신", "불안", "조급함", "관망", "후회", "기타"];

export function EmotionStateSelector({ value, onChange }: { value: EmotionState; onChange: (value: EmotionState) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map((emotion) => (
        <button
          key={emotion}
          type="button"
          onClick={() => onChange(value === emotion ? "" : emotion)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${value === emotion ? "border-ink bg-ink text-white" : "border-line bg-white text-muted"}`}
        >
          {emotion}
        </button>
      ))}
    </div>
  );
}
