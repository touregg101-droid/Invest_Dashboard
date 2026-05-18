import { ExternalLink } from "lucide-react";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import { formatPrice } from "@/lib/utils/format";
import type { ResearchReport } from "@/types";

export function ResearchReportCard({ report }: { report: ResearchReport }) {
  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">{report.title}</h3>
          <p className="caption">{report.broker} · {report.publishedDate} · {report.rating ?? "의견 미제공"}</p>
        </div>
        <span className="rounded-full bg-surface px-2 py-1 text-xs font-semibold">{report.targetChange}</span>
      </div>
      <div className="mt-3 rounded-md bg-surface p-3">
        <p className="caption">목표주가</p>
        <p className="text-xl font-bold">{report.targetPrice ? formatPrice(report.targetPrice) : "미제공"}</p>
      </div>
      <details className="mt-3" open>
        <summary className="cursor-pointer text-sm font-semibold">자동 요약</summary>
        <div className="mt-2 grid gap-2 text-sm text-muted">
          {report.summary.map((line) => <p key={line}>{line}</p>)}
        </div>
      </details>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold">긍정 요인 / 리스크 / 전망</summary>
        <div className="mt-2 grid gap-2 text-sm">
          <p><b>긍정</b> {report.positivePoints.join(", ")}</p>
          <p><b>리스크</b> {report.riskPoints.join(", ")}</p>
          <p><b>전망</b> {report.outlook}</p>
        </div>
      </details>
      <a href={report.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-fall">
        원문 링크 <ExternalLink size={14} />
      </a>
      <div className="mt-3"><SourceDisclosure meta={report.meta} /></div>
    </article>
  );
}
