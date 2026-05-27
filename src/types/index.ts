export type StockType = "ETF" | "COMMON";
export type ConfidenceLevel = "mock" | "low" | "medium" | "high";

export interface DataMeta {
  source: string;
  fetchedAt: string;
  confidenceLevel: ConfidenceLevel;
  usesMockData?: boolean;
}

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  type: StockType;
  market: string;
}

export interface DailyPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changeRate: number;
}

export interface PriceSnapshot {
  currentPrice: number;
  changeRate: number;
  volume: number;
  marketCapLabel: string;
  high52w: number;
  low52w: number;
  returns: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  history: DailyPrice[];
  meta: DataMeta;
}

export interface InvestorFlow {
  date: string;
  individualNetBuy: number;
  institutionNetBuy: number;
  foreignNetBuy: number;
}

export interface InvestorFlowSummary {
  oneDay: InvestorFlow;
  fiveDay: InvestorFlow;
  twentyDay: InvestorFlow;
  directionSummary: string[];
  alert?: string;
  history: InvestorFlow[];
  meta: DataMeta;
}

export interface SentimentResult {
  positiveRatio: number;
  neutralRatio: number;
  negativeRatio: number;
  topKeywords: string[];
  trend: Array<{ date: string; positive: number; neutral: number; negative: number }>;
  status: "과열" | "공포" | "무관심" | "중립" | "탐욕";
  summary: string;
  meta: DataMeta;
}

export interface FearGreedIndex {
  score: number;
  previousChange: number;
  label: "극단적 공포" | "공포" | "중립" | "탐욕" | "극단적 탐욕";
  drivers: string[];
  components: Array<{ name: string; value: number; note: string }>;
  summary: string;
  meta: DataMeta;
}

export interface FundamentalPeriod {
  period: string;
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  operatingMargin: number;
  roe?: number;
  debtRatio?: number;
  per?: number;
  pbr?: number;
  eps?: number;
  bps?: number;
}

export interface Fundamentals {
  stockId: string;
  yearly: FundamentalPeriod[];
  quarterly: FundamentalPeriod[];
  consensusNote?: string;
  summary: string[];
  meta: DataMeta;
}

export interface EtfProfile {
  indexName: string;
  netAssetLabel: string;
  totalFee: string;
  trackingDifference?: string;
  holdings: Array<{ name: string; ticker: string; weight: number }>;
  summary: string[];
  meta: DataMeta;
}

export interface ResearchReport {
  id: string;
  stockId: string;
  category?: "macro" | "semiconductor" | "company" | "market";
  criteria?: string[];
  title: string;
  broker: string;
  publishedDate: string;
  targetPrice?: number;
  rating?: string;
  summary: string[];
  positivePoints: string[];
  riskPoints: string[];
  outlook: string;
  targetChange: "상향" | "하향" | "유지" | "미제공";
  sourceUrl: string;
  meta: DataMeta;
}

export interface CollectionLog {
  id: string;
  jobName: string;
  status: "success" | "failed" | "fallback";
  message: string;
  startedAt: string;
  finishedAt: string;
}

export interface StockBundle {
  stock: Stock;
  price: PriceSnapshot;
  flow: InvestorFlowSummary;
  sentiment: SentimentResult;
  fundamentals?: Fundamentals;
  etf?: EtfProfile;
  reports: ResearchReport[];
}

export interface DashboardData {
  stocks: StockBundle[];
  fearGreed: FearGreedIndex;
  logs: CollectionLog[];
}
