import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import { UpdateStatusBadge } from "@/components/cards/UpdateStatusBadge";
import { formatNumber, formatPercent, formatPrice, toneClass } from "@/lib/utils/format";
import type { StockBundle } from "@/types";

export function StockSummaryCard({ bundle }: { bundle: StockBundle }) {
  const recentReport = bundle.reports[0];
  return (
    <Link href={`/stocks/${bundle.stock.ticker}`} className="card block p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{bundle.stock.name}</h3>
            <span className="rounded-full bg-surface px-2 py-1 text-[11px] text-muted">{bundle.stock.ticker}</span>
          </div>
          <p className="caption">{bundle.stock.type === "ETF" ? "KOSPI 200 ETF" : bundle.stock.market}</p>
        </div>
        <ArrowRight size={18} className="text-muted" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="caption">현재가</p>
          <p className="text-2xl font-bold">{formatPrice(bundle.price.currentPrice)}</p>
        </div>
        <div>
          <p className="caption">전일 대비</p>
          <p className={`text-2xl font-bold ${toneClass(bundle.price.changeRate)}`}>{formatPercent(bundle.price.changeRate)}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-sm">
        <p>거래량 {formatNumber(bundle.price.volume)} · {bundle.price.marketCapLabel}</p>
        <p>{bundle.flow.alert ?? bundle.flow.directionSummary[0]}</p>
        <p>커뮤니티 감정: 긍정 {bundle.sentiment.positiveRatio}% · {bundle.sentiment.status}</p>
        <p>최근 리서치: {recentReport ? `${recentReport.broker} ${recentReport.targetChange}` : "미제공"}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <UpdateStatusBadge meta={bundle.price.meta} />
      </div>
      <div className="mt-2"><SourceDisclosure meta={bundle.price.meta} /></div>
    </Link>
  );
}
