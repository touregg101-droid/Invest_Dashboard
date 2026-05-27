import type { ResearchReport } from "@/types";

const now = "2026-05-27T09:00:00+09:00";
const meta = (source: string) => ({ source, fetchedAt: now, confidenceLevel: "medium" as const, usesMockData: false });

export const curatedResearchReports: ResearchReport[] = [
  {
    id: "research-macro-mirae-kr-rates-fx",
    stockId: "tiger200",
    category: "macro",
    criteria: ["매크로", "환율", "금리"],
    title: "Macro Trends: 금리 인하와 환율 상승",
    broker: "미래에셋증권",
    publishedDate: "2026-05-27",
    rating: "Macro",
    summary: [
      "금리 인하 기대와 원/달러 환율 흐름이 한국 금융시장에 미치는 영향을 점검하는 자료입니다.",
      "채권 강세, 환율 하방 경직성, 주식시장 반등 지속 여부를 함께 봐야 합니다.",
      "매크로 자료이므로 개별 종목 목표주가보다 시장 환경 해석에 사용합니다."
    ],
    positivePoints: ["금리 인하 기대", "채권시장 안정 가능성"],
    riskPoints: ["원/달러 환율 재상승", "정책 기대 후퇴"],
    outlook: "금리와 환율 방향이 KOSPI 대형주 밸류에이션에 영향을 줄 수 있습니다.",
    targetChange: "미제공",
    sourceUrl: "https://securities.miraeasset.com/bbs/download/2030756.pdf?attachmentId=2030756",
    meta: meta("Public research link seed")
  },
  {
    id: "research-macro-kb-fixed-income",
    stockId: "tiger200",
    category: "macro",
    criteria: ["매크로", "채권", "금리"],
    title: "채권전략: 연준을 믿지 않는 시장",
    broker: "KB증권",
    publishedDate: "2026-05-27",
    rating: "Fixed Income",
    summary: [
      "미국 금리와 글로벌 채권 자금 흐름을 함께 확인하는 매크로 자료입니다.",
      "국내 대형주 수급에는 달러금리, 환율, 외국인 자금 흐름이 같이 작용할 수 있습니다.",
      "개별 종목 의견이 아니라 금리 환경 점검용으로 분류했습니다."
    ],
    positivePoints: ["금리 안정 시 위험자산 선호 개선"],
    riskPoints: ["금리 급등", "채권 자금 유출"],
    outlook: "금리 변동성이 커질 경우 반도체 성장주 할인율 부담을 확인해야 합니다.",
    targetChange: "미제공",
    sourceUrl: "https://rdata.kbsec.com/pdf_data/20210323065608147K.pdf",
    meta: meta("Public research link seed")
  },
  {
    id: "research-semi-eugene-global",
    stockId: "tiger200",
    category: "semiconductor",
    criteria: ["반도체 섹터", "삼성전자", "SK하이닉스"],
    title: "Korea 반도체: 글로벌 반도체 밸류에이션과 메모리 업체 비교",
    broker: "유진투자증권",
    publishedDate: "2026-02-09",
    rating: "Sector",
    summary: [
      "글로벌 반도체 업체의 주가, 시가총액, 밸류에이션을 비교한 섹터 자료입니다.",
      "메모리 섹션에 삼성전자, SK하이닉스, 마이크론 등 주요 업체가 함께 제시됩니다.",
      "반도체 섹터 전반의 상대 밸류에이션과 주가 성과를 확인하는 데 사용합니다."
    ],
    positivePoints: ["AI/HBM 수요", "메모리 업체 이익 개선"],
    riskPoints: ["글로벌 반도체 주가 변동성", "밸류에이션 부담"],
    outlook: "삼성전자와 SK하이닉스는 글로벌 메모리 비교 구도에서 함께 해석해야 합니다.",
    targetChange: "미제공",
    sourceUrl: "https://www.hankyung.com/koreamarket/consensus/pdf/2026-02-f4680261cbc2d0fd10c192140c2b2d3f",
    meta: meta("Hankyung Korea Market consensus PDF")
  },
  {
    id: "research-semi-display-weekly",
    stockId: "tiger200",
    category: "semiconductor",
    criteria: ["반도체 섹터"],
    title: "반도체/디스플레이: 메모리 가격과 국내외 주요 뉴스",
    broker: "메리츠증권",
    publishedDate: "2026-05-27",
    rating: "Sector",
    summary: [
      "DRAM, DDR5, NAND 가격과 반도체 관련 주요 뉴스를 정리하는 섹터형 자료입니다.",
      "메모리 가격 흐름은 삼성전자와 SK하이닉스 실적 기대에 직접 연결될 수 있습니다.",
      "단기 주가보다 업황 사이클 확인용으로 분류했습니다."
    ],
    positivePoints: ["DDR5 가격 상승", "AI 인프라 투자"],
    riskPoints: ["중국 공급 확대", "스마트폰 원가 부담"],
    outlook: "메모리 가격과 HBM 수요가 반도체 섹터 심리의 핵심입니다.",
    targetChange: "미제공",
    sourceUrl: "https://www.hankyung.com/koreamarket/consensus/pdf/2025-10-afa273bc8e683dc0f3035ddcf9d6b71e",
    meta: meta("Hankyung Korea Market consensus PDF")
  },
  {
    id: "research-company-samsung-sk-comfort",
    stockId: "samsung",
    category: "company",
    criteria: ["삼성전자", "SK하이닉스", "반도체 섹터"],
    title: "삼성전자/SK하이닉스: 흔들리지 않는 편안함",
    broker: "신한투자증권",
    publishedDate: "2026-01-27",
    rating: "Company",
    summary: [
      "삼성전자와 SK하이닉스를 함께 다루며 메모리 업황과 목표주가 변동 추이를 확인하는 자료입니다.",
      "두 종목 모두 반도체 사이클과 AI 수요 민감도가 높습니다.",
      "개별 기업 판단과 섹터 판단을 함께 확인해야 합니다."
    ],
    positivePoints: ["AI 메모리 수요", "업황 회복"],
    riskPoints: ["메모리 가격 변동", "고객사 투자 사이클"],
    outlook: "두 종목은 반도체 업황과 외국인 수급을 함께 확인해야 합니다.",
    targetChange: "미제공",
    sourceUrl: "https://www.hankyung.com/koreamarket/consensus/pdf/2026-01-cb657b9ee5c5bed4a631d2151441f0a7",
    meta: meta("Hankyung Korea Market consensus PDF")
  },
  {
    id: "research-company-sk-earnings-2026",
    stockId: "skhynix",
    category: "company",
    criteria: ["SK하이닉스", "반도체 섹터"],
    title: "SK하이닉스: 2026년 실적 추정과 DRAM/NAND 가정",
    broker: "SK증권",
    publishedDate: "2026-02-24",
    rating: "Company",
    summary: [
      "SK하이닉스 분기 실적 추정과 DRAM, NAND 부문 가정을 제시한 기업 자료입니다.",
      "HBM과 서버 DRAM 수요가 이익 추정의 핵심 변수로 해석됩니다.",
      "단일 목표가보다 매출과 영업이익 추정 변화에 초점을 둡니다."
    ],
    positivePoints: ["DRAM 이익 기여", "HBM 수요 확대"],
    riskPoints: ["NAND 수익성", "고객사 주문 변동"],
    outlook: "실적 추정 상향 여부와 메모리 믹스 개선을 계속 확인해야 합니다.",
    targetChange: "미제공",
    sourceUrl: "https://www.hankyung.com/koreamarket/consensus/pdf/2026-02-d344d28dc42db71bb132adaf842f65e6",
    meta: meta("Hankyung Korea Market consensus PDF")
  }
];

export function reportsForStock(stockId: string) {
  return curatedResearchReports.filter((report) => report.stockId === stockId);
}
