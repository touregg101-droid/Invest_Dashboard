import { mockDashboardData } from "@/data/mock/dashboard";
import type { ResearchReport } from "@/types";

export interface ResearchReportAdapter {
  fetchReports(ticker: string): Promise<ResearchReport[]>;
}

export class MockResearchReportAdapter implements ResearchReportAdapter {
  async fetchReports(ticker: string) {
    return mockDashboardData.stocks.find((item) => item.stock.ticker === ticker)?.reports ?? [];
  }
}

export class RealResearchReportAdapter implements ResearchReportAdapter {
  async fetchReports(): Promise<ResearchReport[]> {
    throw new Error("Real report collection should use public report indexes, RSS, or licensed feeds; raw PDF copying is disabled.");
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
