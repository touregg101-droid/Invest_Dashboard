import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import { UpdateStatusBadge } from "@/components/cards/UpdateStatusBadge";
import { FundamentalCard } from "@/components/cards/FundamentalCard";
import { PriceChart } from "@/components/charts/PriceChart";
import { InvestorFlowChart } from "@/components/charts/InvestorFlowChart";
import { TargetPriceChart } from "@/components/charts/TargetPriceChart";
import { AppShell } from "@/components/layout/AppShell";
import { ResearchReportCard } from "@/components/research/ResearchReportCard";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import { getDashboardData } from "@/lib/data-sources";
import { formatFlow, formatNumber, formatPercent, formatPrice, toneClass } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function StockPage({ params }: { params: { ticker: string } }) {
  const data = await getDashboardData();
  const bundle = data.stocks.find((item) => item.stock.ticker === params.ticker);
  if (!bundle) notFound();

  return (
    <AppShell>
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={17} /> 홈
      </Link>

      <header className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="caption">{bundle.stock.ticker} · {bundle.stock.market}</p>
            <h1 className="mt-1 text-2xl font-bold">{bundle.stock.name}</h1>
          </div>
          <UpdateStatusBadge meta={bundle.price.meta} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="caption">현재가</p>
            <p className="text-3xl font-bold">{formatPrice(bundle.price.currentPrice)}</p>
          </div>
          <div>
            <p className="caption">전일 대비</p>
            <p className={`text-3xl font-bold ${toneClass(bundle.price.changeRate)}`}>{formatPercent(bundle.price.changeRate)}</p>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-10 -mx-4 my-4 overflow-x-auto border-y border-line bg-white px-4 py-2">
        <div className="flex min-w-max gap-2 text-sm font-semibold">
          {["가격", "수급", "가치", "감정", "리서치"].map((label) => (
            <a key={label} href={`#${label}`} className="rounded-md bg-surface px-3 py-2">{label}</a>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <section id="가격" className="card p-4">
          <h2 className="section-title">가격 및 기본 시장 데이터</h2>
          <PriceChart data={bundle.price.history} />
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Metric label="거래량" value={formatNumber(bundle.price.volume)} />
            <Metric label="시총/순자산" value={bundle.price.marketCapLabel} />
            <Metric label="52주 고가" value={formatPrice(bundle.price.high52w)} />
            <Metric label="52주 저가" value={formatPrice(bundle.price.low52w)} />
            <Metric label="1개월" value={formatPercent(bundle.price.returns.oneMonth)} />
            <Metric label="3개월" value={formatPercent(bundle.price.returns.threeMonths)} />
            <Metric label="6개월" value={formatPercent(bundle.price.returns.sixMonths)} />
            <Metric label="1년" value={formatPercent(bundle.price.returns.oneYear)} />
          </div>
          <div className="mt-3"><SourceDisclosure meta={bundle.price.meta} /></div>
        </section>

        <section id="수급" className="card p-4">
          <h2 className="section-title">투자주체별 수급</h2>
          <InvestorFlowChart data={bundle.flow.history} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <FlowBox label="개인 5일" value={bundle.flow.fiveDay.individualNetBuy} />
            <FlowBox label="기관 5일" value={bundle.flow.fiveDay.institutionNetBuy} />
            <FlowBox label="외국인 5일" value={bundle.flow.fiveDay.foreignNetBuy} />
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold">1일 / 5일 / 20일 누적</summary>
            <div className="mt-2 grid gap-2 text-sm text-muted">
              <p>1일: 개인 {formatFlow(bundle.flow.oneDay.individualNetBuy)}, 기관 {formatFlow(bundle.flow.oneDay.institutionNetBuy)}, 외국인 {formatFlow(bundle.flow.oneDay.foreignNetBuy)}</p>
              <p>5일: 개인 {formatFlow(bundle.flow.fiveDay.individualNetBuy)}, 기관 {formatFlow(bundle.flow.fiveDay.institutionNetBuy)}, 외국인 {formatFlow(bundle.flow.fiveDay.foreignNetBuy)}</p>
              <p>20일: 개인 {formatFlow(bundle.flow.twentyDay.individualNetBuy)}, 기관 {formatFlow(bundle.flow.twentyDay.institutionNetBuy)}, 외국인 {formatFlow(bundle.flow.twentyDay.foreignNetBuy)}</p>
            </div>
          </details>
          <p className="mt-3 text-sm font-semibold">{bundle.flow.alert}</p>
          <div className="mt-2 grid gap-2">{bundle.flow.directionSummary.map((line) => <p key={line} className="text-sm text-muted">{line}</p>)}</div>
          <div className="mt-3"><SourceDisclosure meta={bundle.flow.meta} /></div>
        </section>

        <section id="가치">
          <FundamentalCard stock={bundle.stock} fundamentals={bundle.fundamentals} etf={bundle.etf} />
        </section>

        <section id="감정">
          <SentimentCard stock={bundle.stock} sentiment={bundle.sentiment} />
        </section>

        <section id="리서치" className="grid gap-3">
          <article className="card p-4">
            <h2 className="section-title">증권사별 목표주가 분포</h2>
            <TargetPriceChart reports={bundle.reports} />
          </article>
          {bundle.reports.map((report) => <ResearchReportCard key={report.id} report={report} />)}
        </section>

        <footer className="pb-2 text-xs leading-5 text-muted">
          본 서비스는 투자 판단을 보조하기 위한 정보 대시보드입니다. 매수·매도 추천을 제공하지 않으며, 모든 투자 판단과 책임은 사용자 본인에게 있습니다. 데이터는 지연되거나 오류가 있을 수 있습니다.
        </footer>
      </div>
    </AppShell>
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

function FlowBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-surface p-2">
      <p className="caption">{label}</p>
      <p className={value >= 0 ? "font-semibold text-good" : "font-semibold text-rise"}>{formatFlow(value)}</p>
    </div>
  );
}
