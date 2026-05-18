"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ExportJournalButton } from "@/components/journal/ExportJournalButton";
import { TradeJournalCard } from "@/components/journal/TradeJournalCard";
import { actionTypeLabels, type JournalActionType, type TradeJournal } from "@/types/journal";

const periods = [
  { label: "전체", value: "all" },
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
  { label: "6개월", value: "6m" },
  { label: "1년", value: "1y" }
] as const;

export function TradeJournalList({ entries }: { entries: TradeJournal[] }) {
  const [stockId, setStockId] = useState("all");
  const [actionType, setActionType] = useState<JournalActionType | "all">("all");
  const [period, setPeriod] = useState<(typeof periods)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "decisionDate">("createdAt");

  const stocks = useMemo(() => Array.from(new Map(entries.map((entry) => [entry.stockId, entry])).values()), [entries]);
  const filtered = useMemo(() => {
    const minDate = getMinDecisionDate(period);
    return entries
      .filter((entry) => stockId === "all" || entry.stockId === stockId)
      .filter((entry) => actionType === "all" || entry.actionType === actionType)
      .filter((entry) => !minDate || new Date(entry.decisionDate) >= minDate)
      .filter((entry) => {
        const keyword = query.trim();
        if (!keyword) return true;
        return `${entry.stockName} ${entry.ticker} ${entry.decisionReason} ${entry.evidenceTags.join(" ")}`.includes(keyword);
      })
      .sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
  }, [actionType, entries, period, query, sortBy, stockId]);

  return (
    <div className="grid gap-4">
      <section className="card p-4">
        <Link href="/journal/new" className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white">
          <Plus size={18} /> 새 매매일지 작성
        </Link>
        <div className="mt-3"><ExportJournalButton entries={filtered} /></div>
      </section>

      <section className="card p-4">
        <h2 className="section-title">필터</h2>
        <label className="mt-3 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2">
          <Search size={16} className="text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="종목명, 이유, 근거 검색" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <select value={stockId} onChange={(event) => setStockId(event.target.value)} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
            <option value="all">전체 종목</option>
            {stocks.map((entry) => <option key={entry.stockId} value={entry.stockId}>{entry.stockName}</option>)}
          </select>
          <select value={actionType} onChange={(event) => setActionType(event.target.value as JournalActionType | "all")} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
            <option value="all">전체 판단</option>
            {(["hold", "buy", "sell"] as JournalActionType[]).map((action) => <option key={action} value={action}>{actionTypeLabels[action]}</option>)}
          </select>
          <select value={period} onChange={(event) => setPeriod(event.target.value as typeof period)} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
            {periods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "createdAt" | "decisionDate")} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
            <option value="createdAt">작성일 정렬</option>
            <option value="decisionDate">판단일 정렬</option>
          </select>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">최근 작성한 일지</h2>
          <span className="caption">{filtered.length}개</span>
        </div>
        {filtered.length ? filtered.map((entry) => <TradeJournalCard key={entry.id} entry={entry} />) : (
          <div className="card p-5 text-center text-sm text-muted">아직 작성한 매매일지가 없습니다.</div>
        )}
      </section>
    </div>
  );
}

function getMinDecisionDate(period: string) {
  const now = new Date();
  const months = period === "1m" ? 1 : period === "3m" ? 3 : period === "6m" ? 6 : period === "1y" ? 12 : 0;
  if (!months) return null;
  return new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
}
