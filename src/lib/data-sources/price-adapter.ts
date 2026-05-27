import { mockDashboardData } from "@/data/mock/dashboard";
import type { DailyPrice, PriceSnapshot } from "@/types";

export interface PriceDataAdapter {
  fetchSnapshot(ticker: string): Promise<PriceSnapshot>;
}

export class MockPriceAdapter implements PriceDataAdapter {
  async fetchSnapshot(ticker: string) {
    const found = mockDashboardData.stocks.find((item) => item.stock.ticker === ticker);
    if (!found) throw new Error(`Unknown ticker: ${ticker}`);
    return found.price;
  }
}

export class RealPriceAdapter implements PriceDataAdapter {
  private readonly symbolMap: Record<string, string> = {
    "102110": "102110.KS",
    "005930": "005930.KS",
    "000660": "000660.KS"
  };

  async fetchSnapshot(ticker: string): Promise<PriceSnapshot> {
    const fallback = await new MockPriceAdapter().fetchSnapshot(ticker);
    const storedKrxSnapshot = await fetchStoredKrxSnapshot(ticker, fallback).catch(() => null);
    if (storedKrxSnapshot) return storedKrxSnapshot;

    const symbol = this.symbolMap[ticker];
    if (!symbol) throw new Error(`No Yahoo Finance symbol mapped for ${ticker}`);

    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`, {
      next: { revalidate: 60 * 15 },
      headers: {
        "User-Agent": "Mozilla/5.0 investment-dashboard/0.1"
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance chart request failed: ${response.status}`);
    }

    const payload = (await response.json()) as YahooChartResponse;
    const result = payload.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];
    const timestamps = result?.timestamp ?? [];
    const meta = result?.meta;

    if (!result || !quote || !meta || timestamps.length === 0) {
      throw new Error("Yahoo Finance chart response is missing price data.");
    }

    const history = timestamps
      .map((timestamp, index): DailyPrice | null => {
        const close = quote.close?.[index];
        const open = quote.open?.[index];
        const high = quote.high?.[index];
        const low = quote.low?.[index];
        const volume = quote.volume?.[index];
        if (
          close === null || close === undefined ||
          open === null || open === undefined ||
          high === null || high === undefined ||
          low === null || low === undefined ||
          volume === null || volume === undefined
        ) return null;
        return {
          date: new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(timestamp * 1000)),
          open: Math.round(open),
          high: Math.round(high),
          low: Math.round(low),
          close: Math.round(close),
          volume: Math.round(volume),
          changeRate: 0
        };
      })
      .filter((item): item is DailyPrice => item !== null);

    const historyWithChanges = history.map((item, index) => {
      const previous = history[index - 1]?.close;
      return {
        ...item,
        changeRate: previous ? Number((((item.close - previous) / previous) * 100).toFixed(2)) : 0
      };
    });

    const latest = historyWithChanges.at(-1);
    const previous = historyWithChanges.at(-2);
    if (!latest) throw new Error("Yahoo Finance chart response has no usable latest price.");

    return {
      currentPrice: Math.round(meta.regularMarketPrice ?? latest.close),
      changeRate: previous ? Number((((latest.close - previous.close) / previous.close) * 100).toFixed(2)) : latest.changeRate,
      volume: Math.round(meta.regularMarketVolume ?? latest.volume),
      marketCapLabel: fallback.marketCapLabel,
      high52w: Math.round(meta.fiftyTwoWeekHigh ?? Math.max(...historyWithChanges.map((item) => item.high))),
      low52w: Math.round(meta.fiftyTwoWeekLow ?? Math.min(...historyWithChanges.map((item) => item.low))),
      returns: {
        oneMonth: calculateReturn(historyWithChanges, 21),
        threeMonths: calculateReturn(historyWithChanges, 63),
        sixMonths: calculateReturn(historyWithChanges, 126),
        oneYear: calculateReturn(historyWithChanges, 252)
      },
      history: historyWithChanges.slice(-60),
      meta: {
        source: `Yahoo Finance chart API (${symbol})`,
        fetchedAt: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
        confidenceLevel: "medium",
        usesMockData: false
      }
    };
  }
}

async function fetchStoredKrxSnapshot(ticker: string, fallback: PriceSnapshot): Promise<PriceSnapshot | null> {
  if (!["102110", "005930", "000660"].includes(ticker)) return null;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  const stockRows = await supabaseRequest<SupabaseStockRow[]>(
    supabaseUrl,
    serviceRoleKey,
    `/stocks?select=id,ticker&ticker=eq.${ticker}&limit=1`
  );
  const stockId = stockRows[0]?.id;
  if (!stockId) return null;

  const priceRows = await supabaseRequest<SupabasePriceRow[]>(
    supabaseUrl,
    serviceRoleKey,
    `/price_daily?select=date,open,high,low,close,volume,change_rate,source,fetched_at&stock_id=eq.${stockId}&order=date.desc&limit=260`
  );
  if (priceRows.length === 0) return null;

  const ordered = priceRows.slice().reverse();
  const history = ordered.map((row) => ({
    date: new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(`${row.date}T00:00:00+09:00`)),
    open: Math.round(Number(row.open)),
    high: Math.round(Number(row.high)),
    low: Math.round(Number(row.low)),
    close: Math.round(Number(row.close)),
    volume: Math.round(Number(row.volume)),
    changeRate: Number(row.change_rate ?? 0)
  }));

  const latest = history.at(-1);
  const previous = history.at(-2);
  const latestRaw = ordered.at(-1);
  if (!latest || !latestRaw) return null;

  return {
    currentPrice: latest.close,
    changeRate: previous ? Number((((latest.close - previous.close) / previous.close) * 100).toFixed(2)) : latest.changeRate,
    volume: latest.volume,
    marketCapLabel: fallback.marketCapLabel,
    high52w: Math.max(...history.map((item) => item.high)),
    low52w: Math.min(...history.map((item) => item.low)),
    returns: {
      oneMonth: calculateReturn(history, 21),
      threeMonths: calculateReturn(history, 63),
      sixMonths: calculateReturn(history, 126),
      oneYear: calculateReturn(history, 252)
    },
    history: history.slice(-60),
    meta: {
      source: latestRaw.source || "Supabase price_daily (pykrx KRX OHLCV)",
      fetchedAt: latestRaw.fetched_at || new Date(`${latestRaw.date}T00:00:00+09:00`).toISOString(),
      confidenceLevel: "high",
      usesMockData: false
    }
  };
}

async function supabaseRequest<T>(supabaseUrl: string, serviceRoleKey: string, path: string): Promise<T> {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1${path}`, {
    next: { revalidate: 60 },
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`Supabase price read failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getPriceSnapshot(ticker: string) {
  const useMock = process.env.USE_MOCK_DATA !== "false";
  const primary = useMock ? new MockPriceAdapter() : new RealPriceAdapter();
  try {
    return await primary.fetchSnapshot(ticker);
  } catch {
    return new MockPriceAdapter().fetchSnapshot(ticker);
  }
}

function calculateReturn(history: DailyPrice[], sessions: number) {
  const latest = history.at(-1);
  const base = history.at(-(sessions + 1)) ?? history[0];
  if (!latest || !base?.close) return 0;
  return Number((((latest.close - base.close) / base.close) * 100).toFixed(2));
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        regularMarketVolume?: number;
        regularMarketTime?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
  };
}

interface SupabaseStockRow {
  id: string;
  ticker: string;
}

interface SupabasePriceRow {
  date: string;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volume: number | string;
  change_rate: number | string | null;
  source: string | null;
  fetched_at: string | null;
}
