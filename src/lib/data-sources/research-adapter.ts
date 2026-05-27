import { mockDashboardData } from "@/data/mock/dashboard";
import { reportsForStock } from "@/data/research/research-reports";
import type { ResearchReport } from "@/types";

export interface ResearchReportAdapter {
  fetchReports(ticker: string): Promise<ResearchReport[]>;
}

export class MockResearchReportAdapter implements ResearchReportAdapter {
  async fetchReports(ticker: string) {
    const found = mockDashboardData.stocks.find((item) => item.stock.ticker === ticker);
    if (!found) return [];
    const curated = reportsForStock(found.stock.id);
    const mock = found.reports ?? [];
    return dedupeReports([...curated, ...mock]);
  }
}

export class RealResearchReportAdapter implements ResearchReportAdapter {
  async fetchReports(ticker: string): Promise<ResearchReport[]> {
    const found = mockDashboardData.stocks.find((item) => item.stock.ticker === ticker);
    if (!found) return [];

    const supabaseReports = await fetchSupabaseReports(found.stock.id, ticker).catch(() => []);
    const curated = reportsForStock(found.stock.id);
    const mock = found.reports ?? [];
    return dedupeReports([...supabaseReports, ...curated, ...mock]);
  }
}

export async function getResearchReports(ticker: string) {
  const adapter = process.env.USE_MOCK_DATA === "false" ? new RealResearchReportAdapter() : new MockResearchReportAdapter();
  try {
    return await adapter.fetchReports(ticker);
  } catch {
    return new MockResearchReportAdapter().fetchReports(ticker);
  }
}

function dedupeReports(reports: ResearchReport[]) {
  const seen = new Set<string>();
  return reports
    .filter((report) => {
      const key = report.sourceUrl || report.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

async function fetchSupabaseReports(stockId: string, ticker: string): Promise<ResearchReport[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return [];

  const stockRows = await supabaseRequest<SupabaseStockRow[]>(
    supabaseUrl,
    serviceRoleKey,
    `/stocks?select=id,ticker&ticker=eq.${ticker}&limit=1`
  );
  const stockUuid = stockRows[0]?.id;
  if (!stockUuid) return [];

  const rows = await supabaseRequest<SupabaseResearchReportRow[]>(
    supabaseUrl,
    serviceRoleKey,
    `/research_reports?select=*&stock_id=eq.${stockUuid}&order=published_date.desc&limit=30`
  );

  return rows.map((row) => ({
    id: row.id,
    stockId,
    category: row.category ?? undefined,
    criteria: row.criteria_json ?? [],
    title: row.title,
    broker: row.broker,
    publishedDate: row.published_date,
    targetPrice: row.target_price ?? undefined,
    rating: row.rating ?? undefined,
    summary: splitText(row.summary),
    positivePoints: row.positive_points ?? [],
    riskPoints: row.risk_points ?? [],
    outlook: row.outlook ?? "원문 링크와 공개 요약을 함께 확인해야 합니다.",
    targetChange: row.target_change ?? "미제공",
    sourceUrl: row.source_url,
    meta: {
      source: row.source ?? "Supabase research_reports",
      fetchedAt: row.fetched_at ?? new Date().toISOString(),
      confidenceLevel: "medium",
      usesMockData: false
    }
  }));
}

async function supabaseRequest<T>(supabaseUrl: string, serviceRoleKey: string, path: string): Promise<T> {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1${path}`, {
    next: { revalidate: 60 * 10 },
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });
  if (!response.ok) throw new Error(`Supabase research read failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function splitText(value: string | null) {
  return value?.split("\n").filter(Boolean) ?? [];
}

interface SupabaseStockRow {
  id: string;
  ticker: string;
}

interface SupabaseResearchReportRow {
  id: string;
  category: ResearchReport["category"] | null;
  criteria_json: string[] | null;
  title: string;
  broker: string;
  published_date: string;
  target_price: number | null;
  rating: string | null;
  summary: string | null;
  positive_points: string[] | null;
  risk_points: string[] | null;
  outlook: string | null;
  target_change: ResearchReport["targetChange"] | null;
  source_url: string;
  source: string | null;
  fetched_at: string | null;
}
