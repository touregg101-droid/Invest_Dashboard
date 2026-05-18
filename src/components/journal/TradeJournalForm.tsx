"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Sparkles } from "lucide-react";
import { ActionTypeSelector } from "@/components/journal/ActionTypeSelector";
import { AutoSaveIndicator } from "@/components/journal/AutoSaveIndicator";
import { EmotionStateSelector } from "@/components/journal/EmotionStateSelector";
import { EvidenceTagSelector } from "@/components/journal/EvidenceTagSelector";
import { localJournalRepository } from "@/lib/journal/local-journal-repository";
import { createJournalSnapshot } from "@/lib/journal/journal-snapshot";
import { suggestJournalTags, summarizeJournalReason } from "@/lib/ai/summarize-journal";
import type { DashboardData } from "@/types";
import { actionTypeLabels, type EvidenceTag, type JournalActionType, type TradeJournal, type TradeJournalDraft } from "@/types/journal";

const draftKey = "investment-dashboard.trade-journal-draft.v1";

const emptyDraft = (stockId = "tiger200"): TradeJournalDraft => ({
  stockId,
  actionType: "",
  decisionDate: new Date().toISOString().slice(0, 10),
  decisionReason: "",
  buyPrice: "",
  sellPrice: "",
  quantity: "",
  targetPrice: "",
  stopLossPrice: "",
  investmentHorizon: "",
  evidenceTags: [],
  emotionState: "",
  reviewMemo: ""
});

export function TradeJournalForm({ data, existingEntry }: { data: DashboardData; existingEntry?: TradeJournal }) {
  const router = useRouter();
  const [draft, setDraft] = useState<TradeJournalDraft>(() => existingEntry ? toDraft(existingEntry) : emptyDraft(data.stocks[0]?.stock.id));
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string>();

  useEffect(() => {
    if (existingEntry || typeof window === "undefined") return;
    const raw = window.localStorage.getItem(draftKey);
    if (raw) {
      try {
        setDraft({ ...emptyDraft(data.stocks[0]?.stock.id), ...JSON.parse(raw) });
      } catch {
        window.localStorage.removeItem(draftKey);
      }
    }
  }, [data.stocks, existingEntry]);

  useEffect(() => {
    if (existingEntry || typeof window === "undefined") return;
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
      setSavedAt(new Date().toISOString());
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [draft, existingEntry]);

  const selectedBundle = useMemo(() => data.stocks.find((bundle) => bundle.stock.id === draft.stockId) ?? data.stocks[0], [data.stocks, draft.stockId]);

  const update = <K extends keyof TradeJournalDraft>(key: K, value: TradeJournalDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const save = async () => {
    if (!draft.stockId) return setError("종목을 선택해 주세요.");
    if (!draft.actionType) return setError("보유, 구매, 판매 중 하나를 선택해 주세요.");
    if (!draft.decisionDate) return setError("판단일을 입력해 주세요.");
    if (draft.decisionReason.trim().length < 30) {
      return setError("판단 이유를 조금 더 구체적으로 작성해 주세요. 나중에 복기할 수 있도록 최소 30자 이상 작성하는 것을 권장합니다.");
    }

    const now = new Date().toISOString();
    const base = {
      stockId: selectedBundle.stock.id,
      stockName: selectedBundle.stock.name,
      ticker: selectedBundle.stock.ticker,
      actionType: draft.actionType as JournalActionType,
      decisionDate: draft.decisionDate,
      decisionReason: draft.decisionReason.trim(),
      buyPrice: toNumber(draft.buyPrice),
      sellPrice: toNumber(draft.sellPrice),
      quantity: toNumber(draft.quantity),
      targetPrice: toNumber(draft.targetPrice),
      stopLossPrice: toNumber(draft.stopLossPrice),
      investmentHorizon: draft.investmentHorizon,
      evidenceTags: draft.evidenceTags,
      emotionState: draft.emotionState,
      reviewMemo: draft.reviewMemo.trim() || undefined
    };

    if (existingEntry) {
      await localJournalRepository.update(existingEntry.id, base);
      router.push(`/journal/${existingEntry.id}`);
      return;
    }

    const entry: TradeJournal = {
      id: crypto.randomUUID(),
      ...base,
      createdAt: now,
      updatedAt: now,
      reviewStatus: "not_reviewed",
      snapshotJson: createJournalSnapshot(selectedBundle, data)
    };
    await localJournalRepository.create(entry);
    window.localStorage.removeItem(draftKey);
    router.push(`/journal/${entry.id}`);
  };

  const polishReason = () => {
    const result = summarizeJournalReason(draft);
    update("decisionReason", result.summary);
  };

  const suggestTags = () => {
    const suggested = suggestJournalTags(draft.decisionReason) as EvidenceTag[];
    update("evidenceTags", Array.from(new Set([...draft.evidenceTags, ...suggested])));
  };

  return (
    <div className="grid gap-4">
      <section className="card p-4">
        <h2 className="section-title">필수 입력</h2>
        <label className="mt-3 block">
          <span className="caption">종목명</span>
          <select value={draft.stockId} onChange={(event) => update("stockId", event.target.value)} className="mt-1 w-full rounded-md border border-line bg-white px-3 py-3 text-sm">
            {data.stocks.map((bundle) => <option key={bundle.stock.id} value={bundle.stock.id}>{bundle.stock.name} / {bundle.stock.ticker}</option>)}
          </select>
        </label>
        <div className="mt-4">
          <p className="caption mb-2">판단 유형</p>
          <ActionTypeSelector value={draft.actionType} onChange={(value) => update("actionType", value)} />
        </div>
        <label className="mt-4 block">
          <span className="caption">판단일</span>
          <input type="date" value={draft.decisionDate} onChange={(event) => update("decisionDate", event.target.value)} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
        </label>
        <label className="mt-4 block">
          <span className="caption">판단 이유</span>
          <textarea
            value={draft.decisionReason}
            onChange={(event) => update("decisionReason", event.target.value)}
            rows={8}
            placeholder={`왜 보유/구매/판매 판단을 했나요?\n예: 최근 외국인 순매수가 이어졌고, 리서치 보고서에서 실적 개선 가능성이 언급되었습니다. 다만 커뮤니티 감정이 과열되어 있어 단기 변동성은 주의가 필요하다고 판단했습니다.`}
            className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm leading-6 outline-none focus:border-ink"
          />
        </label>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${draft.decisionReason.trim().length >= 30 ? "text-good" : "text-muted"}`}>{draft.decisionReason.trim().length}/30자</span>
          <div className="flex gap-2">
            <button type="button" onClick={polishReason} className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs font-semibold"><Sparkles size={13} /> 이유 정리</button>
            <button type="button" onClick={suggestTags} className="rounded-md border border-line px-2 py-1 text-xs font-semibold">태그 추천</button>
          </div>
        </div>
        {error ? <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-rise">{error}</p> : null}
        <div className="mt-3"><AutoSaveIndicator savedAt={savedAt} /></div>
      </section>

      <details className="card p-4" open>
        <summary className="cursor-pointer text-sm font-semibold">선택 입력</summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumberInput label="매수가" value={draft.buyPrice} onChange={(value) => update("buyPrice", value)} />
          <NumberInput label="매도가" value={draft.sellPrice} onChange={(value) => update("sellPrice", value)} />
          <NumberInput label="수량" value={draft.quantity} onChange={(value) => update("quantity", value)} />
          <NumberInput label="목표가" value={draft.targetPrice} onChange={(value) => update("targetPrice", value)} />
          <NumberInput label="손절가" value={draft.stopLossPrice} onChange={(value) => update("stopLossPrice", value)} />
          <label className="block">
            <span className="caption">투자 기간</span>
            <select value={draft.investmentHorizon} onChange={(event) => update("investmentHorizon", event.target.value as TradeJournalDraft["investmentHorizon"])} className="mt-1 w-full rounded-md border border-line bg-white px-3 py-3 text-sm">
              <option value="">미선택</option>
              <option value="short">단기</option>
              <option value="medium">중기</option>
              <option value="long">장기</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <p className="caption mb-2">참고한 근거</p>
          <EvidenceTagSelector value={draft.evidenceTags} onChange={(value) => update("evidenceTags", value)} />
        </div>
        <div className="mt-4">
          <p className="caption mb-2">감정 상태</p>
          <EmotionStateSelector value={draft.emotionState} onChange={(value) => update("emotionState", value)} />
        </div>
        <label className="mt-4 block">
          <span className="caption">복기 메모</span>
          <textarea value={draft.reviewMemo} onChange={(event) => update("reviewMemo", event.target.value)} rows={4} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
        </label>
      </details>

      <div className="sticky bottom-16 z-10 -mx-4 bg-surface/95 px-4 py-3 backdrop-blur">
        <button type="button" onClick={save} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white">
          <Save size={18} /> {existingEntry ? "수정 저장" : "매매일지 저장"}
        </button>
      </div>
      <p className="text-xs leading-5 text-muted">이 매매일지는 사용자의 판단을 기록하고 복기하기 위한 도구입니다. 본 서비스는 매수·매도 추천을 제공하지 않으며, 기록된 내용은 투자 성과를 보장하지 않습니다.</p>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="caption">{label}</span>
      <input inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-line px-3 py-3 text-sm" />
    </label>
  );
}

function toNumber(value: string) {
  const trimmed = value.trim().replaceAll(",", "");
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toDraft(entry: TradeJournal): TradeJournalDraft {
  return {
    stockId: entry.stockId,
    actionType: entry.actionType,
    decisionDate: entry.decisionDate,
    decisionReason: entry.decisionReason,
    buyPrice: String(entry.buyPrice ?? ""),
    sellPrice: String(entry.sellPrice ?? ""),
    quantity: String(entry.quantity ?? ""),
    targetPrice: String(entry.targetPrice ?? ""),
    stopLossPrice: String(entry.stopLossPrice ?? ""),
    investmentHorizon: entry.investmentHorizon ?? "",
    evidenceTags: entry.evidenceTags,
    emotionState: entry.emotionState ?? "",
    reviewMemo: entry.reviewMemo ?? ""
  };
}
