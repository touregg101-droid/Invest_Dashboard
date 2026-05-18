"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TradeJournalForm } from "@/components/journal/TradeJournalForm";
import { localJournalRepository } from "@/lib/journal/local-journal-repository";
import type { DashboardData } from "@/types";
import type { TradeJournal } from "@/types/journal";

export function TradeJournalEditLoader({ id, data }: { id: string; data: DashboardData }) {
  const [entry, setEntry] = useState<TradeJournal | null>();

  useEffect(() => {
    localJournalRepository.get(id).then(setEntry);
  }, [id]);

  if (entry === undefined) return <div className="card p-5 text-sm text-muted">매매일지를 불러오는 중입니다.</div>;
  if (entry === null) {
    return (
      <div className="card p-5 text-sm text-muted">
        매매일지를 찾을 수 없습니다. <Link href="/journal" className="font-semibold text-ink">목록으로 돌아가기</Link>
      </div>
    );
  }

  return <TradeJournalForm data={data} existingEntry={entry} />;
}
