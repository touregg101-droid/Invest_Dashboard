"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { JournalSnapshotCard } from "@/components/journal/JournalSnapshotCard";
import { TradeJournalReviewForm } from "@/components/journal/TradeJournalReviewForm";
import { localJournalRepository } from "@/lib/journal/local-journal-repository";
import { formatNumber, formatPrice } from "@/lib/utils/format";
import { actionTypeLabels, horizonLabels, reviewResultLabels, type TradeJournal } from "@/types/journal";

export function TradeJournalDetail({ id }: { id: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<TradeJournal | null>();

  useEffect(() => {
    localJournalRepository.get(id).then(setEntry);
  }, [id]);

  const remove = async () => {
    if (!entry) return;
    if (!window.confirm("이 매매일지를 삭제할까요? 삭제한 기록은 복구할 수 없습니다.")) return;
    await localJournalRepository.remove(entry.id);
    router.push("/journal");
  };

  if (entry === undefined) return <div className="card p-5 text-sm text-muted">매매일지를 불러오는 중입니다.</div>;
  if (entry === null) return <div className="card p-5 text-sm text-muted">매매일지를 찾을 수 없습니다.</div>;

  return (
    <div className="grid gap-4">
      <Link href="/journal" className="inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={17} /> 일지 목록
      </Link>
      <section className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="caption">{entry.ticker}</p>
            <h1 className="mt-1 text-2xl font-bold">{entry.stockName}</h1>
            <p className="mt-1 text-sm text-muted">{actionTypeLabels[entry.actionType]} · 판단일 {entry.decisionDate}</p>
          </div>
          <span className="rounded-full bg-surface px-2 py-1 text-xs font-semibold">{entry.reviewStatus === "reviewed" ? "복기 완료" : "복기 전"}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label="당시 가격" value={formatPrice(entry.snapshotJson?.current_price)} />
          <Metric label="매수가" value={formatPrice(entry.buyPrice)} />
          <Metric label="매도가" value={formatPrice(entry.sellPrice)} />
          <Metric label="수량" value={entry.quantity !== undefined ? formatNumber(entry.quantity) : "미제공"} />
          <Metric label="목표가" value={formatPrice(entry.targetPrice)} />
          <Metric label="손절가" value={formatPrice(entry.stopLossPrice)} />
          <Metric label="투자 기간" value={entry.investmentHorizon ? horizonLabels[entry.investmentHorizon] : "미선택"} />
          <Metric label="감정 상태" value={entry.emotionState || "미선택"} />
        </div>
        <div className="mt-4">
          <h2 className="section-title">판단 이유</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{entry.decisionReason}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.evidenceTags.map((tag) => <span key={tag} className="rounded-full border border-line px-2 py-1 text-xs">{tag}</span>)}
        </div>
        <p className="mt-3 caption">작성 {new Date(entry.createdAt).toLocaleString("ko-KR")} · 수정 {new Date(entry.updatedAt).toLocaleString("ko-KR")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/journal/${entry.id}/edit`} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-3 py-3 text-sm font-semibold"><Pencil size={16} /> 수정</Link>
          <button type="button" onClick={remove} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-rise"><Trash2 size={16} /> 삭제</button>
        </div>
      </section>

      <JournalSnapshotCard snapshot={entry.snapshotJson} />

      {entry.reviewStatus === "reviewed" ? (
        <section className="card p-4">
          <h2 className="section-title">복기 결과</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Metric label="실제 결과" value={entry.reviewResult ? reviewResultLabels[entry.reviewResult] : "미입력"} />
            <Metric label="결과 가격" value={formatPrice(entry.resultPrice)} />
            <Metric label="수익률" value={entry.resultReturnRate !== undefined ? `${entry.resultReturnRate}%` : "미입력"} />
            <Metric label="판단 점수" value={entry.decisionScore ? `${entry.decisionScore}/5` : "미입력"} />
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{entry.reviewMemo}</p>
          <p className="mt-3 text-sm"><b>배운 점</b> {entry.lessonsLearned || "미입력"}</p>
          <p className="mt-2 text-sm"><b>다음 개선</b> {entry.improvementNextTime || "미입력"}</p>
        </section>
      ) : null}

      <TradeJournalReviewForm entry={entry} onUpdated={setEntry} />
      <p className="text-xs leading-5 text-muted">이 매매일지는 사용자의 판단을 기록하고 복기하기 위한 도구입니다. 본 서비스는 매수·매도 추천을 제공하지 않으며, 기록된 내용은 투자 성과를 보장하지 않습니다.</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface p-3">
      <p className="caption">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
