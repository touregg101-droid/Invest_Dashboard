import type { DataMeta } from "@/types";

export function SourceDisclosure({ meta }: { meta: DataMeta }) {
  return (
    <p className="caption">
      출처: {meta.source} · 신뢰도: {meta.confidenceLevel}
      {meta.usesMockData ? " · mock fallback 사용 중" : ""}
    </p>
  );
}
