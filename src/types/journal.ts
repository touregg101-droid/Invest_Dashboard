import type { StockBundle } from "@/types";

export type JournalActionType = "hold" | "buy" | "sell";
export type InvestmentHorizon = "short" | "medium" | "long" | "";
export type EvidenceTag = "수급" | "커뮤니티 감정" | "공포-탐욕지수" | "실적/가치분석" | "리서치 보고서" | "차트" | "뉴스" | "기타";
export type EmotionState = "확신" | "불안" | "조급함" | "관망" | "후회" | "기타" | "";
export type ReviewStatus = "not_reviewed" | "reviewed";
export type ReviewResult = "as_expected" | "different" | "pending" | "";

export interface JournalSnapshot {
  current_price?: number;
  change_rate?: number;
  individual_net_buy_5d?: number;
  institution_net_buy_5d?: number;
  foreign_net_buy_5d?: number;
  sentiment_positive_ratio?: number;
  sentiment_negative_ratio?: number;
  fear_greed_score?: number;
  latest_research_summary?: string;
  fetched_at?: string;
}

export interface TradeJournal {
  id: string;
  stockId: string;
  stockName: string;
  ticker: string;
  actionType: JournalActionType;
  decisionDate: string;
  createdAt: string;
  updatedAt: string;
  decisionReason: string;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  targetPrice?: number;
  stopLossPrice?: number;
  investmentHorizon?: InvestmentHorizon;
  evidenceTags: EvidenceTag[];
  emotionState?: EmotionState;
  reviewStatus: ReviewStatus;
  reviewResult?: ReviewResult;
  reviewMemo?: string;
  lessonsLearned?: string;
  improvementNextTime?: string;
  resultPrice?: number;
  resultReturnRate?: number;
  holdingPeriodDays?: number;
  decisionScore?: number;
  snapshotJson?: JournalSnapshot;
}

export interface TradeJournalDraft {
  stockId: string;
  actionType: JournalActionType | "";
  decisionDate: string;
  decisionReason: string;
  buyPrice: string;
  sellPrice: string;
  quantity: string;
  targetPrice: string;
  stopLossPrice: string;
  investmentHorizon: InvestmentHorizon;
  evidenceTags: EvidenceTag[];
  emotionState: EmotionState;
  reviewMemo: string;
}

export interface JournalPageData {
  stocks: StockBundle[];
  fearGreedScore?: number;
}

export const actionTypeLabels: Record<JournalActionType, string> = {
  hold: "보유",
  buy: "구매",
  sell: "판매"
};

export const horizonLabels: Record<Exclude<InvestmentHorizon, "">, string> = {
  short: "단기",
  medium: "중기",
  long: "장기"
};

export const reviewResultLabels: Record<Exclude<ReviewResult, "">, string> = {
  as_expected: "예상대로 진행",
  different: "예상과 다름",
  pending: "아직 판단 보류"
};
