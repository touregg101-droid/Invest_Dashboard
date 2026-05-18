import type { TradeJournal } from "@/types/journal";

export function summarizeReview(entry: TradeJournal) {
  return [
    `판단 당시 근거: ${entry.evidenceTags.length ? entry.evidenceTags.join(", ") : "기록된 근거 없음"}`,
    `실제 결과: ${entry.reviewResult || "아직 복기 결과 없음"}`,
    "이 요약은 저장된 일지와 snapshot만 기반으로 하며 투자 추천을 제공하지 않습니다."
  ];
}
