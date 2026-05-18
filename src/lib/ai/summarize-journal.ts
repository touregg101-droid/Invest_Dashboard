import type { TradeJournalDraft } from "@/types/journal";

export function summarizeJournalReason(draft: TradeJournalDraft) {
  if (draft.decisionReason.trim().length < 30) {
    return {
      summary: draft.decisionReason.trim(),
      note: "판단 이유가 짧아 문장 정리만 제한적으로 수행했습니다."
    };
  }

  return {
    summary: draft.decisionReason.trim().replace(/\s+/g, " "),
    note: "제공된 판단 이유만 정리했습니다. 매수·매도 추천이나 목표가 제시는 하지 않습니다."
  };
}

export function suggestJournalTags(text: string) {
  const tags = [
    ["수급", ["외국인", "기관", "개인", "순매수", "순매도"]],
    ["커뮤니티 감정", ["감정", "커뮤니티", "과열", "공포"]],
    ["공포-탐욕지수", ["공포", "탐욕", "시장 분위기"]],
    ["실적/가치분석", ["실적", "매출", "영업이익", "PER", "PBR", "가치"]],
    ["리서치 보고서", ["리서치", "보고서", "목표주가", "증권사"]],
    ["차트", ["차트", "이평", "저항", "지지"]],
    ["뉴스", ["뉴스", "공시", "정책"]]
  ] as const;

  return tags.filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword))).map(([tag]) => tag);
}
