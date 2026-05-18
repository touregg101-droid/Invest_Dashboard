import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DataCollectionLogPanel } from "@/components/cards/DataCollectionLogPanel";
import { MarketMoodCard } from "@/components/cards/MarketMoodCard";
import { InvestorFlowChart } from "@/components/charts/InvestorFlowChart";
import { TargetPriceChart } from "@/components/charts/TargetPriceChart";
import { ResearchReportCard } from "@/components/research/ResearchReportCard";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import { StockSummaryCard } from "@/components/stocks/StockSummaryCard";
import { getDashboardData } from "@/lib/data-sources";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();
  const biggestMove = [...data.stocks].sort((a, b) => Math.abs(b.price.changeRate) - Math.abs(a.price.changeRate))[0];
  const allReports = data.stocks.flatMap((item) => item.reports);

  return (
    <AppShell>
      <header className="mb-4">
        <p className="text-xs font-semibold text-muted">KOREA STOCK SIGNAL</p>
        <h1 className="mt-1 text-2xl font-bold tracking-normal">3개 종목 한눈 비교</h1>
        <p className="mt-2 text-sm text-muted">TIGER 200, 삼성전자, SK하이닉스 고정 대시보드</p>
        <Link href="/admin" className="mt-3 inline-flex rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold">
          관리자 수집 로그
        </Link>
      </header>

      <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <p>본 서비스는 투자 판단 참고용 정보 대시보드이며 매수·매도 추천을 제공하지 않습니다.</p>
      </div>

      <div className="grid gap-4">
        <MarketMoodCard index={data.fearGreed} />

        <section className="grid gap-3">
          <h2 className="section-title">종목 요약</h2>
          {data.stocks.map((bundle) => <StockSummaryCard key={bundle.stock.id} bundle={bundle} />)}
        </section>

        <section className="card p-4">
          <h2 className="section-title">오늘 가장 큰 변화</h2>
          <p className="mt-2 text-sm text-muted">
            {biggestMove.stock.name}의 전일 대비 변동률이 {biggestMove.price.changeRate > 0 ? "+" : ""}
            {biggestMove.price.changeRate.toFixed(2)}%로 가장 컸습니다.
          </p>
          <p className="mt-2 text-sm">{biggestMove.flow.alert}</p>
        </section>

        <section id="flows" className="grid gap-3">
          <h2 className="section-title">수급 특이사항</h2>
          {data.stocks.map((bundle) => (
            <article key={bundle.stock.id} className="card p-4">
              <h3 className="text-base font-bold">{bundle.stock.name}</h3>
              <InvestorFlowChart data={bundle.flow.history} />
              <div className="grid gap-2">
                {bundle.flow.directionSummary.map((line) => <p key={line} className="text-sm text-muted">{line}</p>)}
              </div>
            </article>
          ))}
        </section>

        <section id="sentiment" className="grid gap-3">
          <h2 className="section-title">커뮤니티 감정 변화</h2>
          {data.stocks.map((bundle) => <SentimentCard key={bundle.stock.id} stock={bundle.stock} sentiment={bundle.sentiment} />)}
        </section>

        <section id="research" className="grid gap-3">
          <h2 className="section-title">최신 리서치 보고서</h2>
          <article className="card p-4">
            <h3 className="section-title">목표주가 분포</h3>
            <TargetPriceChart reports={allReports} />
          </article>
          {allReports.map((report) => <ResearchReportCard key={report.id} report={report} />)}
        </section>

        <DataCollectionLogPanel logs={data.logs} />

        <footer className="pb-2 text-xs leading-5 text-muted">
          본 서비스는 투자 판단을 보조하기 위한 정보 대시보드입니다. 매수·매도 추천을 제공하지 않으며, 모든 투자 판단과 책임은 사용자 본인에게 있습니다. 데이터는 지연되거나 오류가 있을 수 있습니다.
        </footer>
      </div>
    </AppShell>
  );
}
