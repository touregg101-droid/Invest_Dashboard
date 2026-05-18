"use client";

import { Download } from "lucide-react";
import { downloadTextFile, journalsToCsv } from "@/lib/journal/journal-export";
import type { TradeJournal } from "@/types/journal";

export function ExportJournalButton({ entries }: { entries: TradeJournal[] }) {
  const disabled = entries.length === 0;

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => downloadTextFile("trade-journals.csv", journalsToCsv(entries), "text/csv;charset=utf-8")}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40"
      >
        <Download size={16} /> CSV
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => downloadTextFile("trade-journals.json", JSON.stringify(entries, null, 2), "application/json;charset=utf-8")}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40"
      >
        <Download size={16} /> JSON
      </button>
    </div>
  );
}
