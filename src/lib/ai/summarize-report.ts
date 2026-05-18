export interface ReportSummaryInput {
  title: string;
  broker?: string;
  excerpt: string;
  targetPrice?: number;
  previousTargetPrice?: number;
}

export async function summarizeReport(input: ReportSummaryInput) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      summary: [
        `${input.title} 자료의 제공된 발췌문만 기준으로 요약 대기 상태입니다.`,
        "OPENAI_API_KEY가 없으므로 mock 요약을 반환합니다.",
        "원문 링크와 짧은 요약 중심으로 표시해야 합니다."
      ],
      positivePoints: ["제공 데이터 내 긍정 요인만 사용"],
      riskPoints: ["제공 데이터 내 리스크만 사용"],
      targetChange: "미제공"
    };
  }

  return {
    summary: ["OpenAI adapter placeholder: 제공 데이터만 사용해 요약하도록 연결 지점이 준비되어 있습니다."],
    positivePoints: [],
    riskPoints: [],
    targetChange: input.previousTargetPrice && input.targetPrice
      ? input.targetPrice > input.previousTargetPrice
        ? "상향"
        : input.targetPrice < input.previousTargetPrice
          ? "하향"
          : "유지"
      : "미제공"
  };
}
