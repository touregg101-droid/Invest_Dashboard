import { SentimentBar } from "@/components/charts/SentimentBar";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import type { SentimentResult, Stock } from "@/types";

export function SentimentCard({ stock, sentiment }: { stock: Stock; sentiment: SentimentResult }) {
  return (
    <section className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="section-title">{stock.name} 커뮤니티 감정</h3>
          <p className="caption">게시글 수집 → 정제 → 분류 → 감정 분석 → 키워드 추출</p>
        </div>
        <span className="rounded-full bg-surface px-2 py-1 text-xs font-semibold">{sentiment.status}</span>
      </div>
      <SentimentBar sentiment={sentiment} />
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <p className="rounded-md bg-emerald-50 py-2 text-good">긍정 {sentiment.positiveRatio}%</p>
        <p className="rounded-md bg-slate-100 py-2 text-muted">중립 {sentiment.neutralRatio}%</p>
        <p className="rounded-md bg-red-50 py-2 text-rise">부정 {sentiment.negativeRatio}%</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {sentiment.topKeywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-line px-2 py-1 text-xs">#{keyword}</span>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{sentiment.summary}</p>
      <p className="mt-2 caption">커뮤니티 감정은 투자 판단 근거가 아니라 참고 신호입니다.</p>
      <div className="mt-3"><SourceDisclosure meta={sentiment.meta} /></div>
    </section>
  );
}
