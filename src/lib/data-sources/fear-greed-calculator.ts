import { mockDashboardData } from "@/data/mock/dashboard";
import type { FearGreedIndex } from "@/types";

export interface FearGreedCalculator {
  calculate(): Promise<FearGreedIndex>;
}

export class MockFearGreedCalculator implements FearGreedCalculator {
  async calculate() {
    return mockDashboardData.fearGreed;
  }
}

export class SyntheticFearGreedCalculator implements FearGreedCalculator {
  async calculate(): Promise<FearGreedIndex> {
    const [kospi, kosdaq, usdKrw] = await Promise.all([
      fetchYahooSeries("^KS11"),
      fetchYahooSeries("^KQ11"),
      fetchYahooSeries("KRW=X")
    ]);

    const kospiReturn = calculateReturn(kospi.closes);
    const kosdaqReturn = calculateReturn(kosdaq.closes);
    const fxReturn = calculateReturn(usdKrw.closes);
    const kospiVolatility = calculateVolatility(kospi.closes);

    const kospiScore = clamp(50 + kospiReturn * 5);
    const kosdaqScore = clamp(50 + kosdaqReturn * 4);
    const fxScore = clamp(50 - fxReturn * 4);
    const volatilityScore = clamp(70 - kospiVolatility * 8);
    const score = Math.round((kospiScore * 0.35) + (kosdaqScore * 0.25) + (fxScore * 0.2) + (volatilityScore * 0.2));

    return {
      score,
      previousChange: score - mockDashboardData.fearGreed.score,
      label: getLabel(score),
      drivers: [
        `KOSPI 1개월 수익률 ${formatSigned(kospiReturn)}%`,
        `KOSDAQ 1개월 수익률 ${formatSigned(kosdaqReturn)}%`,
        `원/달러 환율 1개월 변화 ${formatSigned(fxReturn)}%`
      ],
      components: [
        { name: "KOSPI 모멘텀", value: Math.round(kospiScore), note: "Yahoo Finance ^KS11 1개월 수익률 기반" },
        { name: "KOSDAQ 모멘텀", value: Math.round(kosdaqScore), note: "Yahoo Finance ^KQ11 1개월 수익률 기반" },
        { name: "환율 부담", value: Math.round(fxScore), note: "Yahoo Finance KRW=X 변화율 기반" },
        { name: "변동성 대체지표", value: Math.round(volatilityScore), note: "KOSPI 일간 수익률 표준편차 기반" }
      ],
      summary: "공식 한국형 공포-탐욕 API가 없어 KOSPI, KOSDAQ, 원/달러 환율, 변동성 대체지표로 합성 산출했습니다.",
      meta: {
        source: "Yahoo Finance chart API synthetic fear-greed",
        fetchedAt: kospi.fetchedAt,
        confidenceLevel: "medium",
        usesMockData: false
      }
    };
  }
}

export async function getFearGreedIndex() {
  const calculator = process.env.USE_MOCK_DATA === "false" ? new SyntheticFearGreedCalculator() : new MockFearGreedCalculator();
  try {
    return await calculator.calculate();
  } catch {
    return new MockFearGreedCalculator().calculate();
  }
}

async function fetchYahooSeries(symbol: string) {
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`, {
    next: { revalidate: 60 * 15 },
    headers: { "User-Agent": "Mozilla/5.0 investment-dashboard/0.1" }
  });
  if (!response.ok) throw new Error(`Yahoo Finance ${symbol} failed: ${response.status}`);
  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  const closes = result?.indicators?.quote?.[0]?.close?.filter((value): value is number => typeof value === "number") ?? [];
  if (closes.length < 2) throw new Error(`Yahoo Finance ${symbol} has insufficient closes.`);
  return {
    closes,
    fetchedAt: result?.meta?.regularMarketTime ? new Date(result.meta.regularMarketTime * 1000).toISOString() : new Date().toISOString()
  };
}

function calculateReturn(closes: number[]) {
  const first = closes[0];
  const last = closes.at(-1);
  if (!first || !last) return 0;
  return Number((((last - first) / first) * 100).toFixed(2));
}

function calculateVolatility(closes: number[]) {
  const returns = closes.slice(1).map((close, index) => ((close - closes[index]) / closes[index]) * 100);
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance = returns.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / returns.length;
  return Number(Math.sqrt(variance).toFixed(2));
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getLabel(score: number): FearGreedIndex["label"] {
  if (score <= 20) return "극단적 공포";
  if (score <= 40) return "공포";
  if (score <= 60) return "중립";
  if (score <= 80) return "탐욕";
  return "극단적 탐욕";
}

function formatSigned(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: { regularMarketTime?: number };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
  };
}
