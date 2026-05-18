import type { DashboardData, DailyPrice, InvestorFlow, Stock } from "@/types";

const now = "2026-05-14T15:45:00+09:00";
const meta = (source: string) => ({ source, fetchedAt: now, confidenceLevel: "mock" as const, usesMockData: true });

export const stocks: Stock[] = [
  { id: "tiger200", ticker: "102110", name: "TIGER 200", type: "ETF", market: "KOSPI" },
  { id: "samsung", ticker: "005930", name: "삼성전자", type: "COMMON", market: "KOSPI" },
  { id: "skhynix", ticker: "000660", name: "SK하이닉스", type: "COMMON", market: "KOSPI" }
];

const priceHistory = (base: number): DailyPrice[] =>
  Array.from({ length: 24 }, (_, index) => {
    const wave = Math.sin(index / 2.6) * base * 0.018;
    const drift = index * base * 0.0025;
    const close = Math.round(base + wave + drift);
    return {
      date: `04-${String(21 + index).padStart(2, "0")}`,
      open: close - Math.round(base * 0.006),
      high: close + Math.round(base * 0.012),
      low: close - Math.round(base * 0.014),
      close,
      volume: Math.round(900000 + index * 45000 + base * 12),
      changeRate: Number((Math.sin(index / 3) * 1.4).toFixed(2))
    };
  });

const flowHistory = (seed: number): InvestorFlow[] =>
  Array.from({ length: 20 }, (_, index) => ({
    date: `D-${19 - index}`,
    individualNetBuy: Math.round(Math.sin(index * 0.9 + seed) * 720 - 120),
    institutionNetBuy: Math.round(Math.cos(index * 0.7 + seed) * 640 + 80),
    foreignNetBuy: Math.round(Math.sin(index * 0.5 + seed / 2) * 880 + 160)
  }));

const reports = {
  samsung: [
    {
      id: "r-sam-1",
      stockId: "samsung",
      title: "메모리 업황 회복과 온디바이스 AI 수요 점검",
      broker: "미래에셋증권",
      publishedDate: "2026-05-10",
      targetPrice: 98000,
      rating: "Buy",
      summary: ["메모리 가격 반등이 실적 개선의 핵심 변수입니다.", "모바일과 서버 수요 회복 속도를 함께 확인해야 합니다.", "목표주가는 이전 대비 상향된 것으로 표시된 mock 데이터입니다."],
      positivePoints: ["DRAM 가격 개선", "HBM 공급 확대 기대"],
      riskPoints: ["환율 변동", "IT 수요 회복 지연"],
      outlook: "하반기 영업이익률 회복 여부가 관찰 포인트입니다.",
      targetChange: "상향" as const,
      sourceUrl: "https://example.com/research/samsung-memory",
      meta: meta("Mock research adapter")
    }
  ],
  skhynix: [
    {
      id: "r-sk-1",
      stockId: "skhynix",
      title: "HBM 매출 비중 확대가 밸류에이션을 견인",
      broker: "NH투자증권",
      publishedDate: "2026-05-09",
      targetPrice: 245000,
      rating: "Buy",
      summary: ["AI 서버 투자 확대가 HBM 수요를 뒷받침합니다.", "CAPEX와 공급 증가 속도가 리스크 요인입니다.", "목표주가는 mock 기준 유지로 표시합니다."],
      positivePoints: ["HBM 믹스 개선", "서버 DRAM 수요"],
      riskPoints: ["고객사 주문 변동", "경쟁사 증설"],
      outlook: "분기별 마진 개선 지속 여부가 핵심입니다.",
      targetChange: "유지" as const,
      sourceUrl: "https://example.com/research/sk-hbm",
      meta: meta("Mock research adapter")
    }
  ],
  tiger200: [
    {
      id: "r-tiger-1",
      stockId: "tiger200",
      title: "KOSPI 200 ETF 자금 유입과 대형주 흐름",
      broker: "KB증권",
      publishedDate: "2026-05-08",
      targetPrice: undefined,
      rating: "ETF Watch",
      summary: ["KOSPI 200 대형주 흐름을 추종하는 ETF 관점의 자료입니다.", "외국인 수급과 환율이 지수 방향성에 영향을 줄 수 있습니다.", "개별 종목 추천이 아닌 시장 점검용 요약입니다."],
      positivePoints: ["대형주 분산 노출", "낮은 총보수"],
      riskPoints: ["시장 전체 변동성", "추적오차"],
      outlook: "지수 수익률과 괴리율을 함께 확인해야 합니다.",
      targetChange: "미제공" as const,
      sourceUrl: "https://example.com/research/kospi200-etf",
      meta: meta("Mock research adapter")
    }
  ]
};

export const mockDashboardData: DashboardData = {
  fearGreed: {
    score: 58,
    previousChange: 4,
    label: "중립",
    drivers: ["KOSPI 1개월 수익률 개선", "외국인 순매수 전환", "변동성 지표는 아직 중립권"],
    components: [
      { name: "KOSPI 모멘텀", value: 62, note: "최근 수익률 기준 추정" },
      { name: "시장 변동성", value: 47, note: "VKOSPI 대체 mock 지표" },
      { name: "외국인 수급", value: 66, note: "전체 순매수 방향성" },
      { name: "커뮤니티 심리", value: 55, note: "3개 종목 감정 평균" }
    ],
    summary: "시장 분위기는 중립에 가깝지만 대형 반도체 수급 회복이 점수를 끌어올렸습니다.",
    meta: meta("Synthetic mock fear-greed calculator")
  },
  stocks: [
    {
      stock: stocks[0],
      price: {
        currentPrice: 38210,
        changeRate: 0.42,
        volume: 850321,
        marketCapLabel: "순자산총액 2.3조원",
        high52w: 40150,
        low52w: 31800,
        returns: { oneMonth: 2.8, threeMonths: 5.2, sixMonths: 11.1, oneYear: 18.4 },
        history: priceHistory(35800),
        meta: meta("Mock price adapter")
      },
      flow: {
        oneDay: { date: "2026-05-14", individualNetBuy: -82, institutionNetBuy: 144, foreignNetBuy: 96 },
        fiveDay: { date: "5D", individualNetBuy: -410, institutionNetBuy: 730, foreignNetBuy: 520 },
        twentyDay: { date: "20D", individualNetBuy: -950, institutionNetBuy: 1610, foreignNetBuy: 1420 },
        directionSummary: ["기관과 외국인의 ETF 순매수가 이어졌습니다.", "개인은 단기적으로 차익 실현 우위입니다."],
        alert: "최근 5거래일 기준 기관 순매수가 확대되었습니다.",
        history: flowHistory(1),
        meta: meta("Mock investor flow adapter")
      },
      sentiment: {
        positiveRatio: 44,
        neutralRatio: 42,
        negativeRatio: 14,
        topKeywords: ["KOSPI200", "분산투자", "연금", "대형주"],
        trend: [
          { date: "D-4", positive: 40, neutral: 45, negative: 15 },
          { date: "D-3", positive: 43, neutral: 42, negative: 15 },
          { date: "D-2", positive: 41, neutral: 44, negative: 15 },
          { date: "D-1", positive: 44, neutral: 42, negative: 14 }
        ],
        status: "중립",
        summary: "ETF 특성상 개별 이슈보다 지수와 연금 투자 관련 언급이 많습니다.",
        meta: meta("Mock sentiment adapter")
      },
      etf: {
        indexName: "KOSPI 200",
        netAssetLabel: "2.3조원",
        totalFee: "연 0.05%",
        trackingDifference: "최근 괴리율 +0.03% 추정",
        holdings: [
          { name: "삼성전자", ticker: "005930", weight: 25.4 },
          { name: "SK하이닉스", ticker: "000660", weight: 8.7 },
          { name: "LG에너지솔루션", ticker: "373220", weight: 3.4 },
          { name: "현대차", ticker: "005380", weight: 3.2 },
          { name: "기아", ticker: "000270", weight: 2.5 },
          { name: "셀트리온", ticker: "068270", weight: 2.1 },
          { name: "POSCO홀딩스", ticker: "005490", weight: 1.8 },
          { name: "NAVER", ticker: "035420", weight: 1.7 },
          { name: "KB금융", ticker: "105560", weight: 1.6 },
          { name: "신한지주", ticker: "055550", weight: 1.4 }
        ],
        summary: ["대형주 분산 노출 상품이므로 개별 기업 실적보다 지수 흐름이 중요합니다.", "삼성전자와 SK하이닉스 비중이 높아 반도체 업황 영향이 큽니다."],
        meta: meta("Mock ETF profile")
      },
      reports: reports.tiger200
    },
    {
      stock: stocks[1],
      price: {
        currentPrice: 81200,
        changeRate: 1.25,
        volume: 14880321,
        marketCapLabel: "시가총액 485조원",
        high52w: 87800,
        low52w: 64200,
        returns: { oneMonth: 4.1, threeMonths: 8.5, sixMonths: 15.6, oneYear: 22.0 },
        history: priceHistory(76000),
        meta: meta("Mock price adapter")
      },
      flow: {
        oneDay: { date: "2026-05-14", individualNetBuy: -960, institutionNetBuy: 340, foreignNetBuy: 1280 },
        fiveDay: { date: "5D", individualNetBuy: -3210, institutionNetBuy: 980, foreignNetBuy: 4120 },
        twentyDay: { date: "20D", individualNetBuy: -7500, institutionNetBuy: 2210, foreignNetBuy: 9200 },
        directionSummary: ["최근 5거래일 기준 외국인 순매수가 확대되었습니다.", "개인은 단기적으로 매도 우위입니다."],
        alert: "외국인 순매수와 주가 상승이 같은 방향으로 움직입니다.",
        history: flowHistory(2),
        meta: meta("Mock investor flow adapter")
      },
      sentiment: {
        positiveRatio: 62,
        neutralRatio: 24,
        negativeRatio: 14,
        topKeywords: ["실적", "반도체", "배당", "AI", "환율"],
        trend: [
          { date: "D-4", positive: 52, neutral: 31, negative: 17 },
          { date: "D-3", positive: 57, neutral: 27, negative: 16 },
          { date: "D-2", positive: 60, neutral: 25, negative: 15 },
          { date: "D-1", positive: 62, neutral: 24, negative: 14 }
        ],
        status: "탐욕",
        summary: "최근 실적, 반도체, 배당 키워드가 자주 등장하며 긍정 비율이 상승했습니다.",
        meta: meta("Mock sentiment adapter")
      },
      fundamentals: {
        stockId: "samsung",
        yearly: [
          { period: "2023", revenue: 258935, operatingIncome: 6567, netIncome: 15487, operatingMargin: 2.5, roe: 4.1, debtRatio: 26.4, per: 38.2, pbr: 1.2, eps: 2300, bps: 54000 },
          { period: "2024", revenue: 300870, operatingIncome: 32700, netIncome: 28400, operatingMargin: 10.9, roe: 8.2, debtRatio: 27.1, per: 18.1, pbr: 1.35, eps: 5200, bps: 59000 },
          { period: "2025E", revenue: 332400, operatingIncome: 45200, netIncome: 38900, operatingMargin: 13.6, roe: 10.5, debtRatio: 25.8, per: 15.6, pbr: 1.28, eps: 6100, bps: 63200 }
        ],
        quarterly: [
          { period: "2Q25", revenue: 74800, operatingIncome: 9300, netIncome: 8100, operatingMargin: 12.4 },
          { period: "3Q25", revenue: 80500, operatingIncome: 11200, netIncome: 9600, operatingMargin: 13.9 },
          { period: "4Q25", revenue: 84200, operatingIncome: 12300, netIncome: 10400, operatingMargin: 14.6 },
          { period: "1Q26E", revenue: 86100, operatingIncome: 13000, netIncome: 11100, operatingMargin: 15.1 }
        ],
        consensusNote: "컨센서스 대비 실적은 mock 추정치입니다.",
        summary: ["매출은 전년 대비 증가했으나 영업이익률 개선 지속 여부를 함께 확인해야 합니다.", "PER/PBR은 과거 평균과 비교하여 해석해야 합니다."],
        meta: meta("Mock fundamentals adapter")
      },
      reports: reports.samsung
    },
    {
      stock: stocks[2],
      price: {
        currentPrice: 214500,
        changeRate: -0.74,
        volume: 4120388,
        marketCapLabel: "시가총액 156조원",
        high52w: 232000,
        low52w: 118000,
        returns: { oneMonth: 7.4, threeMonths: 16.9, sixMonths: 39.2, oneYear: 71.5 },
        history: priceHistory(178000),
        meta: meta("Mock price adapter")
      },
      flow: {
        oneDay: { date: "2026-05-14", individualNetBuy: 520, institutionNetBuy: -240, foreignNetBuy: -180 },
        fiveDay: { date: "5D", individualNetBuy: 1620, institutionNetBuy: -800, foreignNetBuy: 310 },
        twentyDay: { date: "20D", individualNetBuy: -2100, institutionNetBuy: 1250, foreignNetBuy: 6400 },
        directionSummary: ["기관은 단기적으로 매도 우위입니다.", "20일 기준 외국인 누적 순매수는 유지되고 있습니다."],
        alert: "개인 매수세가 강하지만 주가는 단기 약세입니다.",
        history: flowHistory(3),
        meta: meta("Mock investor flow adapter")
      },
      sentiment: {
        positiveRatio: 68,
        neutralRatio: 18,
        negativeRatio: 14,
        topKeywords: ["HBM", "AI", "엔비디아", "공급", "마진"],
        trend: [
          { date: "D-4", positive: 61, neutral: 24, negative: 15 },
          { date: "D-3", positive: 63, neutral: 22, negative: 15 },
          { date: "D-2", positive: 66, neutral: 20, negative: 14 },
          { date: "D-1", positive: 68, neutral: 18, negative: 14 }
        ],
        status: "과열",
        summary: "AI/HBM 관련 기대감이 긍정 감정에 영향을 주고 있으며 과열 신호도 함께 표시됩니다.",
        meta: meta("Mock sentiment adapter")
      },
      fundamentals: {
        stockId: "skhynix",
        yearly: [
          { period: "2023", revenue: 32766, operatingIncome: -7730, netIncome: -9170, operatingMargin: -23.6, roe: -15.6, debtRatio: 84.1, per: undefined, pbr: 1.6, eps: -12600, bps: 92000 },
          { period: "2024", revenue: 65900, operatingIncome: 21200, netIncome: 16700, operatingMargin: 32.2, roe: 24.4, debtRatio: 72.0, per: 10.9, pbr: 2.4, eps: 22900, bps: 88000 },
          { period: "2025E", revenue: 82200, operatingIncome: 31400, netIncome: 24600, operatingMargin: 38.2, roe: 28.1, debtRatio: 68.5, per: 9.2, pbr: 2.2, eps: 30600, bps: 96500 }
        ],
        quarterly: [
          { period: "2Q25", revenue: 18100, operatingIncome: 6600, netIncome: 5200, operatingMargin: 36.5 },
          { period: "3Q25", revenue: 20500, operatingIncome: 7900, netIncome: 6100, operatingMargin: 38.5 },
          { period: "4Q25", revenue: 22100, operatingIncome: 8800, netIncome: 6900, operatingMargin: 39.8 },
          { period: "1Q26E", revenue: 23000, operatingIncome: 9100, netIncome: 7100, operatingMargin: 39.6 }
        ],
        consensusNote: "HBM 매출 비중 확대를 반영한 mock 컨센서스입니다.",
        summary: ["반도체 업황 민감도가 높으므로 단일 분기 실적만으로 판단하지 않습니다.", "영업이익률 개선은 HBM 믹스와 공급 계약 조건을 함께 봐야 합니다."],
        meta: meta("Mock fundamentals adapter")
      },
      reports: reports.skhynix
    }
  ],
  logs: [
    { id: "log-1", jobName: "price-flow-daily", status: "fallback", message: "실데이터 adapter 미설정으로 mock snapshot 사용", startedAt: now, finishedAt: now },
    { id: "log-2", jobName: "sentiment-daily", status: "success", message: "mock sentiment 분석 완료", startedAt: now, finishedAt: now },
    { id: "log-3", jobName: "research-daily", status: "success", message: "mock 리서치 목록 갱신", startedAt: now, finishedAt: now }
  ]
};
