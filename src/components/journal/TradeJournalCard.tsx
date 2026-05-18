"use client";

import Link from "next/link";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { actionTypeLabels, type TradeJournal } from "@/types/journal";

export function TradeJournalCard({ entry }: { entry: TradeJournal }) {
  return (
    <Link href={`/journal/${entry.id}`} className="card block p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold">{entry.stockName}</h3>
            <span className="rounded-full bg-surface px-2 py-1 text-[11px] text-muted">{entry.ticker}</span>
          </div>
          <p className="caption">{actionTypeLabels[entry.actionType]} · 판단일 {entry.decisionDate}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${entry.actionType === "buy" ? "bg-red-50 text-rise" : entry.actionType === "sell" ? "bg-blue-50 text-fall" : "bg-surface text-muted"}`}>
          {actionTypeLabels[entry.actionType]}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted">{entry.decisionReason}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {entry.evidenceTags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-line px-2 py-1 text-[11px]">{tag}</span>)}
        {entry.emotionState ? <span className="rounded-full bg-surface px-2 py-1 text-[11px]">{entry.emotionState}</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>작성 {new Date(entry.createdAt).toLocaleDateString("ko-KR")}</span>
        <span className="inline-flex items-center gap-1">
          {entry.reviewStatus === "reviewed" ? <CheckCircle2 size={14} className="text-good" /> : <CircleDashed size={14} />}
          {entry.reviewStatus === "reviewed" ? "복기 완료" : "복기 전"}
        </span>
      </div>
    </Link>
  );
}
