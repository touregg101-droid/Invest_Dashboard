import type { MarketDataPersistResult, MarketDataRepository } from "@/lib/db/market-data-repository";
import type { DashboardData, Stock } from "@/types";

interface SupabaseStockRow {
  id: string;
  ticker: string;
}

export class SupabaseMarketDataRepository implements MarketDataRepository {
  private readonly url = process.env.SUPABASE_URL;
  private readonly key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  async persistDashboardSnapshot(data: DashboardData): Promise<MarketDataPersistResult> {
    if (!this.url || !this.key) {
      return {
        enabled: false,
        ok: true,
        message: "SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없어 DB 저장을 건너뜁니다.",
        savedTables: []
      };
    }

    const savedTables = new Set<string>();
    const stockIdMap = new Map<string, string>();

    for (const bundle of data.stocks) {
      const stockRow = await this.upsertStock(bundle.stock);
      stockIdMap.set(bundle.stock.id, stockRow.id);
      savedTables.add("stocks");

      const latestPrice = bundle.price.history.at(-1);
      if (latestPrice) {
        await this.upsert("price_daily", {
          stock_id: stockRow.id,
          date: toDateOnly(bundle.price.meta.fetchedAt),
          open: latestPrice.open,
          high: latestPrice.high,
          low: latestPrice.low,
          close: bundle.price.currentPrice,
          volume: bundle.price.volume,
          change_rate: bundle.price.changeRate,
          source: bundle.price.meta.source,
          fetched_at: bundle.price.meta.fetchedAt
        }, "stock_id,date");
        savedTables.add("price_daily");
      }

      await this.upsert("investor_flow_daily", {
        stock_id: stockRow.id,
        date: toDateOnly(bundle.flow.meta.fetchedAt),
        individual_net_buy: bundle.flow.fiveDay.individualNetBuy,
        institution_net_buy: bundle.flow.fiveDay.institutionNetBuy,
        foreign_net_buy: bundle.flow.fiveDay.foreignNetBuy,
        source: bundle.flow.meta.source,
        fetched_at: bundle.flow.meta.fetchedAt
      }, "stock_id,date");
      savedTables.add("investor_flow_daily");

      await this.upsert("sentiment_daily", {
        stock_id: stockRow.id,
        date: toDateOnly(bundle.sentiment.meta.fetchedAt),
        positive_ratio: bundle.sentiment.positiveRatio,
        neutral_ratio: bundle.sentiment.neutralRatio,
        negative_ratio: bundle.sentiment.negativeRatio,
        top_keywords: bundle.sentiment.topKeywords,
        summary: bundle.sentiment.summary,
        source: bundle.sentiment.meta.source,
        fetched_at: bundle.sentiment.meta.fetchedAt
      }, "stock_id,date");
      savedTables.add("sentiment_daily");

      if (bundle.fundamentals) {
        for (const period of [...bundle.fundamentals.yearly, ...bundle.fundamentals.quarterly]) {
          await this.upsert("fundamentals", {
            stock_id: stockRow.id,
            period: period.period,
            revenue: period.revenue,
            operating_income: period.operatingIncome,
            net_income: period.netIncome,
            operating_margin: period.operatingMargin,
            roe: period.roe,
            debt_ratio: period.debtRatio,
            per: period.per,
            pbr: period.pbr,
            eps: period.eps,
            bps: period.bps,
            source: bundle.fundamentals.meta.source,
            fetched_at: bundle.fundamentals.meta.fetchedAt
          }, "stock_id,period");
        }
        savedTables.add("fundamentals");
      }

      if (bundle.etf) {
        for (const holding of bundle.etf.holdings) {
          await this.upsert("etf_holdings", {
            stock_id: stockRow.id,
            holding_name: holding.name,
            holding_ticker: holding.ticker,
            weight: holding.weight,
            date: toDateOnly(bundle.etf.meta.fetchedAt),
            source: bundle.etf.meta.source,
            fetched_at: bundle.etf.meta.fetchedAt
          }, "stock_id,holding_ticker,date");
        }
        savedTables.add("etf_holdings");
      }

      for (const report of bundle.reports) {
        await this.upsert("research_reports", {
          stock_id: stockRow.id,
          title: report.title,
          broker: report.broker,
          published_date: report.publishedDate,
          target_price: report.targetPrice,
          rating: report.rating,
          summary: report.summary.join("\n"),
          positive_points: report.positivePoints,
          risk_points: report.riskPoints,
          source_url: report.sourceUrl,
          fetched_at: report.meta.fetchedAt
        }, "source_url");
      }
      savedTables.add("research_reports");
    }

    await this.upsert("fear_greed_index", {
      date: toDateOnly(data.fearGreed.meta.fetchedAt),
      score: data.fearGreed.score,
      label: data.fearGreed.label,
      components_json: data.fearGreed.components,
      summary: data.fearGreed.summary,
      fetched_at: data.fearGreed.meta.fetchedAt
    }, "date");
    savedTables.add("fear_greed_index");

    for (const log of data.logs) {
      await this.insert("collection_logs", {
        job_name: log.jobName,
        status: log.status,
        message: log.message,
        started_at: log.startedAt,
        finished_at: log.finishedAt
      });
    }
    savedTables.add("collection_logs");

    return {
      enabled: true,
      ok: true,
      message: "Supabase DB 저장 완료",
      savedTables: Array.from(savedTables)
    };
  }

  private async upsertStock(stock: Stock) {
    const rows = await this.upsert<SupabaseStockRow>("stocks", {
      ticker: stock.ticker,
      name: stock.name,
      type: stock.type,
      market: stock.market
    }, "ticker");
    const row = rows[0];
    if (!row) throw new Error(`stocks upsert returned no row for ${stock.ticker}`);
    return row;
  }

  private async insert<T>(table: string, body: unknown) {
    return this.request<T>(`/${table}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(body)
    });
  }

  private async upsert<T = unknown>(table: string, body: unknown, onConflict: string) {
    return this.request<T>(`/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(body)
    });
  }

  private async request<T>(path: string, init: RequestInit) {
    if (!this.url || !this.key) throw new Error("Supabase env is missing.");
    const response = await fetch(`${this.url}/rest/v1${path}`, {
      ...init,
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      }
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Supabase ${path} failed: ${response.status} ${text}`);
    }
    return text ? JSON.parse(text) as T[] : [];
  }
}

function toDateOnly(value?: string) {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().slice(0, 10);
}
