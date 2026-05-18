import { FearGreedGauge } from "@/components/charts/FearGreedGauge";
import { SourceDisclosure } from "@/components/cards/SourceDisclosure";
import { UpdateStatusBadge } from "@/components/cards/UpdateStatusBadge";
import type { FearGreedIndex } from "@/types";

export function MarketMoodCard({ index }: { index: FearGreedIndex }) {
  return (
    <section className="card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="section-title">오늘의 한국 시장 공포-탐욕</h2>
          <p className="caption">합성 지수, 0~100점</p>
        </div>
        <UpdateStatusBadge meta={index.meta} />
      </div>
      <FearGreedGauge index={index} />
      <div className="mt-3 rounded-md bg-surface p-3">
        <p className="text-sm font-medium">전일 대비 {index.previousChange > 0 ? "+" : ""}{index.previousChange}pt</p>
        <p className="mt-1 text-sm text-muted">{index.summary}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {index.drivers.map((driver) => (
          <p key={driver} className="rounded-md border border-line px-3 py-2 text-sm">{driver}</p>
        ))}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold">산출 방식</summary>
        <div className="mt-2 grid gap-2">
          {index.components.map((component) => (
            <p key={component.name} className="caption">
              {component.name}: {component.value}점 · {component.note}
            </p>
          ))}
        </div>
      </details>
      <div className="mt-3"><SourceDisclosure meta={index.meta} /></div>
    </section>
  );
}
