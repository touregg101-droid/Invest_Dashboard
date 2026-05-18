import type { DashboardData } from "@/types";

export interface MarketDataPersistResult {
  enabled: boolean;
  ok: boolean;
  message: string;
  savedTables: string[];
}

export interface MarketDataRepository {
  persistDashboardSnapshot(data: DashboardData): Promise<MarketDataPersistResult>;
}
