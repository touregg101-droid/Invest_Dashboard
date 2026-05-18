"use client";

import type { EvidenceTag } from "@/types/journal";

const tags: EvidenceTag[] = ["수급", "커뮤니티 감정", "공포-탐욕지수", "실적/가치분석", "리서치 보고서", "차트", "뉴스", "기타"];

export function EvidenceTagSelector({ value, onChange }: { value: EvidenceTag[]; onChange: (value: EvidenceTag[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(active ? value.filter((item) => item !== tag) : [...value, tag])}
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${active ? "border-ink bg-ink text-white" : "border-line bg-white text-muted"}`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
