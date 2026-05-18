"use client";

import { useEffect, useState } from "react";
import { TradeJournalList } from "@/components/journal/TradeJournalList";
import { localJournalRepository } from "@/lib/journal/local-journal-repository";
import type { TradeJournal } from "@/types/journal";

export function TradeJournalListLoader() {
  const [entries, setEntries] = useState<TradeJournal[]>();

  useEffect(() => {
    localJournalRepository.list().then(setEntries);
  }, []);

  if (!entries) return <div className="card p-5 text-sm text-muted">매매일지를 불러오는 중입니다.</div>;
  return <TradeJournalList entries={entries} />;
}
