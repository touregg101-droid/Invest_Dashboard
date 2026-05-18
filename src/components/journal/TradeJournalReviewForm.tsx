"use client";

import { useState } from "react";
import { localJournalRepository } from "@/lib/journal/local-journal-repository";
import { summarizeReview } from "@/lib/ai/summarize-review";
import { reviewResultLabels, type ReviewResult, type TradeJournal } from "@/types/journal";

export function TradeJournalReviewForm({ entry, onUpdated }: { entry: TradeJournal; onUpdated: (entry: TradeJournal) => void }) {
  const [reviewResult, setReviewResult] = useState<ReviewResult>(entry.reviewResult ?? "");
  const [reviewMemo, setReviewMemo] = useState(entry.reviewMemo ?? "");
  const [lessonsLearned, setLessonsLearned] = useState(entry.lessonsLearned ?? "");
  const [improvementNextTime, setImprovementNextTime] = useState(entry.improvementNextTime ?? "");
  const [resultPrice, setResultPrice] = useState(String(entry.resultPrice ?? ""));
  const [resultReturnRate, setResultReturnRate] = useState(String(entry.resultReturnRate ?? ""));
  const [holdingPeriodDays, setHoldingPeriodDays] = useState(String(entry.holdingPeriodDays ?? ""));
  const [decisionScore, setDecisionScore] = useState(String(entry.decisionScore ?? ""));

  const save = async () => {
    const updated = await localJournalRepository.update(entry.id, {
      reviewStatus: "reviewed",
      reviewResult,
      reviewMemo: reviewMemo.trim(),
      lessonsLearned: lessonsLearned.trim(),
      improvementNextTime: improvementNextTime.trim(),
      resultPrice: toNumber(resultPrice),
      resultReturnRate: toNumber(resultReturnRate),
      holdingPeriodDays: toNumber(holdingPeriodDays),
      decisionScore: toNumber(decisionScore)
    });
    onUpdated(updated);
  };

  const makeSummary = () => {
    setReviewMemo((current) => `${current ? `${current}\n` : ""}${summarizeReview({ ...entry, reviewResult, reviewMemo }).join("\n")}`);
  };

  return (
    <section className="card p-4">
      <h2 className="section-title">복기</h2>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {(Object.keys(reviewResultLabels) as Exclude<ReviewResult, "">[]).map((result) => (
          <button
            key={result}
            type="button"
            onClick={() => setReviewResult(result)}
            className={`rounded-md border px-3 py-3 text-sm font-semibold ${reviewResult === result ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
          >
            {reviewResultLabels[result]}
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="caption">복기 메모</span>
        <textarea value={reviewMemo} onChange={(event) => setReviewMemo(event.target.value)} rows={4} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
      </label>
      <label className="mt-3 block">
        <span className="caption">배운 점</span>
        <textarea value={lessonsLearned} onChange={(event) => setLessonsLearned(event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
      </label>
      <label className="mt-3 block">
        <span className="caption">다음에 개선할 점</span>
        <textarea value={improvementNextTime} onChange={(event) => setImprovementNextTime(event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
      </label>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold">선택 결과 입력</summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SmallInput label="결과 가격" value={resultPrice} onChange={setResultPrice} />
          <SmallInput label="수익률" value={resultReturnRate} onChange={setResultReturnRate} />
          <SmallInput label="보유 기간(일)" value={holdingPeriodDays} onChange={setHoldingPeriodDays} />
          <label className="block">
            <span className="caption">판단 점수</span>
            <select value={decisionScore} onChange={(event) => setDecisionScore(event.target.value)} className="mt-1 w-full rounded-md border border-line bg-white px-3 py-3 text-sm">
              <option value="">미선택</option>
              {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}점</option>)}
            </select>
          </label>
        </div>
      </details>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={makeSummary} className="rounded-md border border-line px-3 py-3 text-sm font-semibold">복기 요약 만들기</button>
        <button type="button" onClick={save} className="rounded-md bg-ink px-3 py-3 text-sm font-bold text-white">복기 저장</button>
      </div>
    </section>
  );
}

function SmallInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="caption">{label}</span>
      <input inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
    </label>
  );
}

function toNumber(value: string) {
  const parsed = Number(value.trim().replaceAll(",", ""));
  return value.trim() && Number.isFinite(parsed) ? parsed : undefined;
}
