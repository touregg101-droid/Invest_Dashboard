import { newestDateLabel } from "@/lib/utils/format";
import type { DataMeta } from "@/types";

export function UpdateStatusBadge({ meta }: { meta: DataMeta }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-1 text-[11px] text-muted">
      {meta.usesMockData ? "Mock" : meta.confidenceLevel} · {newestDateLabel(meta.fetchedAt)}
    </span>
  );
}
