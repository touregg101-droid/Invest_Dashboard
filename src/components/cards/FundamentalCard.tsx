import { FundamentalChart } from "@/components/charts/FundamentalChart";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import { formatNumber } from "@/lib/utils/format";
import type { EtfProfile, Fundamentals, Stock } from "@/types";

export function FundamentalCard({ stock, fundamentals, etf }: { stock: Stock; fundamentals?: Fundamentals; etf?: EtfProfile }) {
  if (stock.type === "ETF" && etf) {
    return (
      <section className="card p-4">
        <h3 className="section-title">{stock.name} ETF 가치 정보</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <Metric label="추종지수" value={etf.indexName} />
          <Metric label="순자산총액" value={etf.netAssetLabel} />
          <Metric label="총보수" value={etf.totalFee} />
          <Metric label="괴리/추적" value={etf.trackingDifference ?? "미제공"} />
        </div>
        <h4 className="mt-4 text-sm font-semibold">구성종목 상위 10개</h4>
        <div className="mt-2 grid gap-2">
          {etf.holdings.map((holding) => (
            <div key={holding.ticker} className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
              <span>{holding.name}</span>
              <span className="font-semibold">{holding.weight}%</span>
            </div>
          ))}
        </div>
        {etf.summary.map((line) => <p key={line} className="mt-2 text-sm text-muted">{line}</p>)}
        <div className="mt-3"><SourceDisclosure meta={etf.meta} /></div>
      </section>
    );
  }

  if (!fundamentals) return null;
  const latest = fundamentals.yearly[fundamentals.yearly.length - 1];

  return (
    <section className="card p-4">
      <h3 className="section-title">{stock.name} 가치분석</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Metric label="매출" value={`${formatNumber(latest.revenue)}억`} />
        <Metric label="영업이익" value={`${formatNumber(latest.operatingIncome)}억`} />
        <Metric label="영업이익률" value={`${latest.operatingMargin}%`} />
        <Metric label="ROE" value={latest.roe ? `${latest.roe}%` : "미제공"} />
        <Metric label="부채비율" value={latest.debtRatio ? `${latest.debtRatio}%` : "미제공"} />
        <Metric label="PER/PBR" value={`${latest.per ?? "N/A"} / ${latest.pbr ?? "N/A"}`} />
        <Metric label="EPS" value={latest.eps ? `${formatNumber(latest.eps)}원` : "미제공"} />
        <Metric label="BPS" value={latest.bps ? `${formatNumber(latest.bps)}원` : "미제공"} />
      </div>
      <div className="mt-4"><FundamentalChart data={fundamentals.quarterly} /></div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold">최근 3개년 실적</summary>
        <div className="mt-2 grid gap-2">
          {fundamentals.yearly.map((period) => (
            <p key={period.period} className="caption">{period.period}: 매출 {formatNumber(period.revenue)}억, 영업이익 {formatNumber(period.operatingIncome)}억</p>
          ))}
        </div>
      </details>
      {fundamentals.summary.map((line) => <p key={line} className="mt-2 text-sm text-muted">{line}</p>)}
      <p className="mt-2 caption">{fundamentals.consensusNote}</p>
      <div className="mt-3"><SourceDisclosure meta={fundamentals.meta} /></div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface p-3">
      <p className="caption">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
