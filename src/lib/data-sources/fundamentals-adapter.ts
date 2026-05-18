import { mockDashboardData } from "@/data/mock/dashboard";
import type { EtfProfile, Fundamentals } from "@/types";

export interface FundamentalsAdapter {
  fetchFundamentals(ticker: string): Promise<Fundamentals | undefined>;
  fetchEtfProfile(ticker: string): Promise<EtfProfile | undefined>;
}

export class MockFundamentalsAdapter implements FundamentalsAdapter {
  async fetchFundamentals(ticker: string) {
    return mockDashboardData.stocks.find((item) => item.stock.ticker === ticker)?.fundamentals;
  }

  async fetchEtfProfile(ticker: string) {
    return mockDashboardData.stocks.find((item) => item.stock.ticker === ticker)?.etf;
  }
}

export class RealFundamentalsAdapter implements FundamentalsAdapter {
  async fetchFundamentals(): Promise<Fundamentals | undefined> {
    throw new Error("Real fundamentals adapter requires DART/FnGuide/CompanyGuide mapping and rate-limit handling.");
  }

  async fetchEtfProfile(): Promise<EtfProfile | undefined> {
    throw new Error("Real ETF adapter requires asset manager or licensed ETF data source integration.");
  }
}

export async function getFundamentalsBundle(ticker: string) {
  const adapter = process.env.USE_MOCK_DATA === "false" ? new RealFundamentalsAdapter() : new MockFundamentalsAdapter();
  try {
    return {
      fundamentals: await adapter.fetchFundamentals(ticker),
      etf: await adapter.fetchEtfProfile(ticker)
    };
  } catch {
    const fallback = new MockFundamentalsAdapter();
    return {
      fundamentals: await fallback.fetchFundamentals(ticker),
      etf: await fallback.fetchEtfProfile(ticker)
    };
  }
}
