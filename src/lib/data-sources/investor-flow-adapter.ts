import { mockDashboardData } from "@/data/mock/dashboard";
import type { InvestorFlowSummary } from "@/types";

export interface InvestorFlowAdapter {
  fetchInvestorFlow(ticker: string): Promise<InvestorFlowSummary>;
}

export class MockInvestorFlowAdapter implements InvestorFlowAdapter {
  async fetchInvestorFlow(ticker: string) {
    const found = mockDashboardData.stocks.find((item) => item.stock.ticker === ticker);
    if (!found) throw new Error(`Unknown ticker: ${ticker}`);
    return found.flow;
  }
}

export class RealInvestorFlowAdapter implements InvestorFlowAdapter {
  async fetchInvestorFlow(): Promise<InvestorFlowSummary> {
    throw new Error("Real investor flow adapter requires a compliant KRX or licensed data provider integration.");
  }
}

export async function getInvestorFlow(ticker: string) {
  const adapter = process.env.USE_MOCK_DATA === "false" ? new RealInvestorFlowAdapter() : new MockInvestorFlowAdapter();
  try {
    return await adapter.fetchInvestorFlow(ticker);
  } catch {
    return new MockInvestorFlowAdapter().fetchInvestorFlow(ticker);
  }
}
