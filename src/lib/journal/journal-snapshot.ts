import type { DashboardData, StockBundle } from "@/types";
import type { JournalSnapshot } from "@/types/journal";

export function createJournalSnapshot(bundle: StockBundle, dashboard: Pick<DashboardData, "fearGreed">): JournalSnapshot {
  return {
    current_price: bundle.price.currentPrice,
    change_rate: bundle.price.changeRate,
    individual_net_buy_5d: bundle.flow.fiveDay.individualNetBuy,
    institution_net_buy_5d: bundle.flow.fiveDay.institutionNetBuy,
    foreign_net_buy_5d: bundle.flow.fiveDay.foreignNetBuy,
    sentiment_positive_ratio: bundle.sentiment.positiveRatio,
    sentiment_negative_ratio: bundle.sentiment.negativeRatio,
    fear_greed_score: dashboard.fearGreed.score,
    latest_research_summary: bundle.reports[0]?.summary.join(" "),
    fetched_at: new Date().toISOString()
  };
}
