import type { DashboardData, DailyPrice, InvestorFlow, Stock } from "@/types";

const now = "2026-05-27T15:30:00+09:00";
const meta = (source: string) => ({ source, fetchedAt: now, confidenceLevel: "mock" as const, usesMockData: true });
const krxSnapshotMeta = {
  source: "pykrx KRX OHLCV snapshot",
  fetchedAt: now,
  confidenceLevel: "high" as const,
  usesMockData: false
};

export const stocks: Stock[] = [
  { id: "tiger200", ticker: "102110", name: "TIGER 200", type: "ETF", market: "KOSPI" },
  { id: "samsung", ticker: "005930", name: "삼성전자", type: "COMMON", market: "KOSPI" },
  { id: "skhynix", ticker: "000660", name: "SK하이닉스", type: "COMMON", market: "KOSPI" }
];

const flowHistory = (seed: number): InvestorFlow[] =>
  Array.from({ length: 20 }, (_, index) => ({
    date: `D-${19 - index}`,
    individualNetBuy: Math.round(Math.sin(index * 0.9 + seed) * 720 - 120),
    institutionNetBuy: Math.round(Math.cos(index * 0.7 + seed) * 640 + 80),
    foreignNetBuy: Math.round(Math.sin(index * 0.5 + seed / 2) * 880 + 160)
  }));

const actualPriceHistory: Record<string, DailyPrice[]> = {
  "102110": [
    { date: "04-21", open: 95635, high: 97045, low: 95635, close: 97045, volume: 3712981, changeRate: 2.74 },
    { date: "04-22", open: 97000, high: 97445, low: 95890, close: 97350, volume: 3864453, changeRate: 0.31 },
    { date: "04-23", open: 98655, high: 99895, low: 95720, close: 98445, volume: 5291966, changeRate: 1.12 },
    { date: "04-24", open: 98755, high: 99085, low: 96960, close: 98025, volume: 3377844, changeRate: -0.43 },
    { date: "04-27", open: 98940, high: 101175, low: 98940, close: 100320, volume: 3587804, changeRate: 2.34 },
    { date: "04-28", open: 100815, high: 102080, low: 100475, close: 100750, volume: 3022653, changeRate: 0.43 },
    { date: "04-29", open: 99935, high: 101297, low: 99535, close: 100975, volume: 4281701, changeRate: 0.22 },
    { date: "04-30", open: 101705, high: 102240, low: 99850, close: 99970, volume: 3918282, changeRate: -1.0 },
    { date: "05-04", open: 102560, high: 105285, low: 101890, close: 105280, volume: 4508090, changeRate: 5.31 },
    { date: "05-06", open: 111525, high: 114295, low: 110470, close: 113170, volume: 7562270, changeRate: 7.49 },
    { date: "05-07", open: 115400, high: 116145, low: 111710, close: 115630, volume: 8845148, changeRate: 2.17 },
    { date: "05-08", open: 113075, high: 115885, low: 112695, close: 115840, volume: 6294982, changeRate: 0.18 },
    { date: "05-11", open: 121110, high: 123310, low: 119920, close: 121740, volume: 6571122, changeRate: 5.09 },
    { date: "05-12", open: 124005, high: 124840, low: 115655, close: 119170, volume: 7587669, changeRate: -2.11 },
    { date: "05-13", open: 116045, high: 122875, low: 114950, close: 122690, volume: 6870146, changeRate: 2.95 },
    { date: "05-14", open: 122850, high: 125490, low: 122700, close: 124770, volume: 5089240, changeRate: 1.7 },
    { date: "05-15", open: 124615, high: 126170, low: 114800, close: 117285, volume: 8175090, changeRate: -6.0 },
    { date: "05-18", open: 116230, high: 120015, low: 111580, close: 117965, volume: 8178214, changeRate: 0.58 },
    { date: "05-19", open: 116210, high: 116655, low: 111800, close: 114360, volume: 5366201, changeRate: -3.06 },
    { date: "05-20", open: 114730, high: 115100, low: 110565, close: 113180, volume: 6197828, changeRate: -1.03 },
    { date: "05-21", open: 117790, high: 123375, low: 117685, close: 123110, volume: 4216528, changeRate: 8.77 },
    { date: "05-22", open: 124075, high: 124245, low: 122175, close: 123440, volume: 5167305, changeRate: 0.27 },
    { date: "05-26", open: 127180, high: 128280, low: 125895, close: 126935, volume: 4488824, changeRate: 2.83 },
    { date: "05-27", open: 133630, high: 134840, low: 128575, close: 130560, volume: 4383589, changeRate: 2.86 }
  ],
  "005930": [
    { date: "04-21", open: 218000, high: 220000, low: 216000, close: 219000, volume: 16752132, changeRate: 2.1 },
    { date: "04-22", open: 218500, high: 222500, low: 215500, close: 217500, volume: 16823480, changeRate: -0.68 },
    { date: "04-23", open: 223000, high: 229500, low: 216000, close: 224500, volume: 34525485, changeRate: 3.22 },
    { date: "04-24", open: 224000, high: 225000, low: 216500, close: 219500, volume: 19626666, changeRate: -2.23 },
    { date: "04-27", open: 220000, high: 226000, low: 218500, close: 224500, volume: 22870374, changeRate: 2.28 },
    { date: "04-28", open: 224000, high: 226000, low: 221500, close: 222000, volume: 18444490, changeRate: -1.11 },
    { date: "04-29", open: 219500, high: 228000, low: 218500, close: 226000, volume: 20363756, changeRate: 1.8 },
    { date: "04-30", open: 229000, high: 230000, low: 220500, close: 220500, volume: 22161975, changeRate: -2.43 },
    { date: "05-04", open: 228000, high: 232500, low: 224000, close: 232500, volume: 32920816, changeRate: 5.44 },
    { date: "05-06", open: 254000, high: 270000, low: 251000, close: 266000, volume: 53097996, changeRate: 14.41 },
    { date: "05-07", open: 272000, high: 277000, low: 260000, close: 271500, volume: 41404687, changeRate: 2.07 },
    { date: "05-08", open: 260000, high: 270000, low: 260000, close: 268500, volume: 25875880, changeRate: -1.1 },
    { date: "05-11", open: 284500, high: 288500, low: 280000, close: 285500, volume: 36031094, changeRate: 6.33 },
    { date: "05-12", open: 290000, high: 291500, low: 266000, close: 279000, volume: 41211149, changeRate: -2.28 },
    { date: "05-13", open: 264000, high: 285500, low: 262000, close: 284000, volume: 35540134, changeRate: 1.79 },
    { date: "05-14", open: 282000, high: 299500, low: 282000, close: 296000, volume: 39314752, changeRate: 4.23 },
    { date: "05-15", open: 291000, high: 296500, low: 266000, close: 270500, volume: 38075487, changeRate: -8.61 },
    { date: "05-18", open: 269500, high: 288500, low: 262000, close: 281000, volume: 33555214, changeRate: 3.88 },
    { date: "05-19", open: 274000, high: 281500, low: 266000, close: 275500, volume: 30767569, changeRate: -1.96 },
    { date: "05-20", open: 278000, high: 282500, low: 263500, close: 276000, volume: 35662077, changeRate: 0.18 },
    { date: "05-21", open: 291000, high: 299500, low: 287000, close: 299500, volume: 36168689, changeRate: 8.51 },
    { date: "05-22", open: 300000, high: 300500, low: 292000, close: 292500, volume: 18395274, changeRate: -2.34 },
    { date: "05-26", open: 298000, high: 302000, low: 297500, close: 299000, volume: 23441371, changeRate: 2.22 },
    { date: "05-27", open: 321500, high: 323000, low: 306000, close: 307000, volume: 33447443, changeRate: 2.68 }
  ],
  "000660": [
    { date: "04-21", open: 1196000, high: 1228000, low: 1193000, close: 1224000, volume: 3516960, changeRate: 4.97 },
    { date: "04-22", open: 1227000, high: 1233000, low: 1195000, close: 1223000, volume: 2894919, changeRate: -0.08 },
    { date: "04-23", open: 1220000, high: 1267000, low: 1183000, close: 1225000, volume: 5343871, changeRate: 0.16 },
    { date: "04-24", open: 1237000, high: 1242000, low: 1193000, close: 1222000, volume: 3127857, changeRate: -0.24 },
    { date: "04-27", open: 1253000, high: 1317000, low: 1249000, close: 1292000, volume: 4563073, changeRate: 5.73 },
    { date: "04-28", open: 1313000, high: 1328000, low: 1296000, close: 1300000, volume: 3002713, changeRate: 0.62 },
    { date: "04-29", open: 1284000, high: 1317000, low: 1281000, close: 1293000, volume: 3001208, changeRate: -0.54 },
    { date: "04-30", open: 1312000, high: 1325000, low: 1286000, close: 1286000, volume: 3342342, changeRate: -0.54 },
    { date: "05-04", open: 1339000, high: 1450000, low: 1333000, close: 1447000, volume: 5776641, changeRate: 12.52 },
    { date: "05-06", open: 1590000, high: 1614000, low: 1557000, close: 1601000, volume: 6631934, changeRate: 10.64 },
    { date: "05-07", open: 1622000, high: 1665000, low: 1567000, close: 1654000, volume: 5860618, changeRate: 3.31 },
    { date: "05-08", open: 1591000, high: 1689000, low: 1591000, close: 1686000, volume: 4278087, changeRate: 1.93 },
    { date: "05-11", open: 1833000, high: 1949000, low: 1826000, close: 1880000, volume: 7433039, changeRate: 11.51 },
    { date: "05-12", open: 1944000, high: 1967000, low: 1804000, close: 1835000, volume: 9160593, changeRate: -2.39 },
    { date: "05-13", open: 1781000, high: 1990000, low: 1781000, close: 1976000, volume: 7126921, changeRate: 7.68 },
    { date: "05-14", open: 1976000, high: 1994000, low: 1937000, close: 1970000, volume: 6040068, changeRate: -0.3 },
    { date: "05-15", open: 1950000, high: 1995000, low: 1789000, close: 1819000, volume: 7485233, changeRate: -7.66 },
    { date: "05-18", open: 1780000, high: 1897000, low: 1731000, close: 1840000, volume: 6481608, changeRate: 1.15 },
    { date: "05-19", open: 1791000, high: 1823000, low: 1740000, close: 1745000, volume: 4575855, changeRate: -5.16 },
    { date: "05-20", open: 1743000, high: 1778000, low: 1690000, close: 1745000, volume: 5535123, changeRate: 0 },
    { date: "05-21", open: 1801000, high: 1954000, low: 1796000, close: 1940000, volume: 5096690, changeRate: 11.17 },
    { date: "05-22", open: 1942000, high: 1952000, low: 1912000, close: 1941000, volume: 3135190, changeRate: 0.05 },
    { date: "05-26", open: 2008000, high: 2087000, low: 2006000, close: 2052000, volume: 4903591, changeRate: 5.72 },
    { date: "05-27", open: 2279000, high: 2358000, low: 2200000, close: 2243000, volume: 7248371, changeRate: 9.31 }
  ]
};

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
        currentPrice: 130560,
        changeRate: 2.86,
        volume: 4383589,
        marketCapLabel: "ETF · KRX 스냅샷",
        high52w: 134840,
        low52w: 34745,
        returns: { oneMonth: 32.62, threeMonths: 50.24, sixMonths: 134.47, oneYear: 273.25 },
        history: actualPriceHistory["102110"],
        meta: krxSnapshotMeta
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
        currentPrice: 307000,
        changeRate: 2.68,
        volume: 33447443,
        marketCapLabel: "시가총액 약 2,016조원",
        high52w: 323000,
        low52w: 53800,
        returns: { oneMonth: 36.75, threeMonths: 59.07, sixMonths: 213.91, oneYear: 469.57 },
        history: actualPriceHistory["005930"],
        meta: krxSnapshotMeta
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
        currentPrice: 2243000,
        changeRate: 9.31,
        volume: 7248371,
        marketCapLabel: "시가총액 약 1,592조원",
        high52w: 2358000,
        low52w: 200000,
        returns: { oneMonth: 83.1, threeMonths: 135.86, sixMonths: 293.51, oneYear: 1007.65 },
        history: actualPriceHistory["000660"],
        meta: krxSnapshotMeta
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
