import { actionTypeLabels, horizonLabels, reviewResultLabels, type TradeJournal } from "@/types/journal";

const headers = [
  "종목명",
  "판단 유형",
  "판단일",
  "매수가",
  "매도가",
  "수량",
  "목표가",
  "손절가",
  "투자 기간",
  "판단 이유",
  "참고 근거",
  "감정 상태",
  "복기 결과",
  "복기 메모",
  "배운 점",
  "작성일",
  "수정일"
];

export function journalsToCsv(entries: TradeJournal[]) {
  const rows = entries.map((entry) => [
    entry.stockName,
    actionTypeLabels[entry.actionType],
    entry.decisionDate,
    entry.buyPrice ?? "",
    entry.sellPrice ?? "",
    entry.quantity ?? "",
    entry.targetPrice ?? "",
    entry.stopLossPrice ?? "",
    entry.investmentHorizon ? horizonLabels[entry.investmentHorizon] : "",
    entry.decisionReason,
    entry.evidenceTags.join("|"),
    entry.emotionState ?? "",
    entry.reviewResult ? reviewResultLabels[entry.reviewResult] : "",
    entry.reviewMemo ?? "",
    entry.lessonsLearned ?? "",
    entry.createdAt,
    entry.updatedAt
  ]);
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}
