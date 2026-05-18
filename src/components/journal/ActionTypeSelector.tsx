"use client";

import { actionTypeLabels, type JournalActionType } from "@/types/journal";

const actions: JournalActionType[] = ["hold", "buy", "sell"];

export function ActionTypeSelector({ value, onChange }: { value: JournalActionType | ""; onChange: (value: JournalActionType) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map((action) => (
        <button
          key={action}
          type="button"
          onClick={() => onChange(action)}
          className={`min-h-14 rounded-lg border px-3 text-sm font-bold ${value === action ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}
        >
          {actionTypeLabels[action]}
        </button>
      ))}
    </div>
  );
}
