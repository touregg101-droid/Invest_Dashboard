import { stocks } from "@/data/mock/dashboard";
import { getFearGreedIndex } from "@/lib/data-sources/fear-greed-calculator";
import { getFundamentalsBundle } from "@/lib/data-sources/fundamentals-adapter";
import { getInvestorFlow } from "@/lib/data-sources/investor-flow-adapter";
import { getPriceSnapshot } from "@/lib/data-sources/price-adapter";
import { getResearchReports } from "@/lib/data-sources/research-adapter";
import { getSentiment } from "@/lib/data-sources/sentiment-adapter";
import type { CollectionLog, DashboardData } from "@/types";

export async function getDashboardData(): Promise<DashboardData> {
  const bundles = await Promise.all(
    stocks.map(async (stock) => {
      const [price, flow, sentiment, fundamentalsBundle, reports] = await Promise.all([
        getPriceSnapshot(stock.ticker),
        getInvestorFlow(stock.ticker),
        getSentiment(stock.ticker),
        getFundamentalsBundle(stock.ticker),
        getResearchReports(stock.ticker)
      ]);

      return {
        stock,
        price,
        flow,
        sentiment,
        fundamentals: fundamentalsBundle.fundamentals,
        etf: fundamentalsBundle.etf,
        reports
      };
    })
  );

  const fearGreed = await getFearGreedIndex();
  const now = new Date().toISOString();
  const realPriceCount = bundles.filter((bundle) => !bundle.price.meta.usesMockData).length;
  const logs: CollectionLog[] = [
    {
      id: "log-price",
      jobName: "price-flow-daily",
      status: realPriceCount === bundles.length ? "success" : realPriceCount > 0 ? "fallback" : "fallback",
      message: realPriceCount === bundles.length
        ? "Yahoo Finance chart API에서 3개 종목 가격 데이터를 갱신했습니다. 수급은 mock fallback입니다."
        : `${realPriceCount}/${bundles.length}개 종목 가격만 실제 데이터로 갱신되어 나머지는 mock fallback입니다.`,
      startedAt: now,
      finishedAt: now
    },
    {
      id: "log-sentiment",
      jobName: "sentiment-daily",
      status: "fallback",
      message: "커뮤니티 수집은 약관 확인 전이므로 mock sentiment adapter를 사용합니다.",
      startedAt: now,
      finishedAt: now
    },
    {
      id: "log-research",
      jobName: "research-daily",
      status: "fallback",
      message: "리서치 원문 무단 수집을 피하기 위해 mock report adapter를 사용합니다.",
      startedAt: now,
      finishedAt: now
    },
    {
      id: "log-fear-greed",
      jobName: "fear-greed-daily",
      status: fearGreed.meta.usesMockData ? "fallback" : "success",
      message: fearGreed.meta.usesMockData
        ? "공포-탐욕 구성 지표 공급자 미설정으로 synthetic mock 지수를 사용합니다."
        : "Yahoo Finance의 KOSPI/KOSDAQ/원달러 지표로 합성 공포-탐욕 지수를 갱신했습니다.",
      startedAt: now,
      finishedAt: now
    }
  ];

  return {
    stocks: bundles,
    fearGreed,
    logs
  };
}
