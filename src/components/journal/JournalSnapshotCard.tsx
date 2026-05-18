import { formatFlow, formatPercent, formatPrice } from "@/lib/utils/format";
import type { JournalSnapshot } from "@/types/journal";

export function JournalSnapshotCard({ snapshot }: { snapshot?: JournalSnapshot }) {
  if (!snapshot) {
    return (
      <section className="card p-4">
        <h2 className="section-title">작성 당시 시장 데이터</h2>
        <p className="mt-2 text-sm text-muted">작성 당시 데이터 없음</p>
      </section>
    );
  }

  return (
    <section className="card p-4">
      <h2 className="section-title">작성 당시 시장 데이터</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Metric label="당시 가격" value={formatPrice(snapshot.current_price)} />
        <Metric label="등락률" value={formatPercent(snapshot.change_rate)} />
        <Metric label="개인 5일" value={snapshot.individual_net_buy_5d !== undefined ? formatFlow(snapshot.individual_net_buy_5d) : "없음"} />
        <Metric label="기관 5일" value={snapshot.institution_net_buy_5d !== undefined ? formatFlow(snapshot.institution_net_buy_5d) : "없음"} />
        <Metric label="외국인 5일" value={snapshot.foreign_net_buy_5d !== undefined ? formatFlow(snapshot.foreign_net_buy_5d) : "없음"} />
        <Metric label="공포-탐욕" value={snapshot.fear_greed_score !== undefined ? `${snapshot.fear_greed_score}점` : "없음"} />
        <Metric label="긍정 감정" value={snapshot.sentiment_positive_ratio !== undefined ? `${snapshot.sentiment_positive_ratio}%` : "없음"} />
        <Metric label="부정 감정" value={snapshot.sentiment_negative_ratio !== undefined ? `${snapshot.sentiment_negative_ratio}%` : "없음"} />
      </div>
      <p className="mt-3 text-sm text-muted">{snapshot.latest_research_summary ?? "작성 당시 최신 리서치 요약 없음"}</p>
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
