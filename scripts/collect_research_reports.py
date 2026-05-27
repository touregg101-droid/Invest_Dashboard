#!/usr/bin/env python3
"""Seed selected public research-report links into Supabase.

The collector stores only metadata, classification tags, short original
summaries written for this dashboard, and source links. It does not copy PDF
contents. Reports are included only when they match at least one rule:
1. Macro: macro economy, FX, rates, bonds
2. Semiconductor sector
3. Samsung Electronics or SK Hynix company report
"""

from __future__ import annotations

import datetime as dt
import json
import os
from typing import Any, Dict, List

import requests


KST = dt.timezone(dt.timedelta(hours=9))

STOCKS = {
    "tiger200": {"ticker": "102110", "name": "TIGER 200", "type": "ETF", "market": "KOSPI"},
    "samsung": {"ticker": "005930", "name": "삼성전자", "type": "COMMON", "market": "KOSPI"},
    "skhynix": {"ticker": "000660", "name": "SK하이닉스", "type": "COMMON", "market": "KOSPI"},
}

REPORTS: List[Dict[str, Any]] = [
    {
        "stock_key": "tiger200",
        "category": "macro",
        "criteria": ["매크로", "환율", "금리"],
        "title": "Macro Trends: 금리 인하와 환율 상승",
        "broker": "미래에셋증권",
        "published_date": "2026-05-27",
        "rating": "Macro",
        "summary": "금리 인하 기대와 원/달러 환율 흐름이 한국 금융시장에 미치는 영향을 점검하는 자료입니다.\n채권 강세, 환율 하방 경직성, 주식시장 반등 지속 여부를 함께 봐야 합니다.\n매크로 자료이므로 개별 종목 목표주가보다 시장 환경 해석에 사용합니다.",
        "positive_points": ["금리 인하 기대", "채권시장 안정 가능성"],
        "risk_points": ["원/달러 환율 재상승", "정책 기대 후퇴"],
        "outlook": "금리와 환율 방향이 KOSPI 대형주 밸류에이션에 영향을 줄 수 있습니다.",
        "target_change": "미제공",
        "source_url": "https://securities.miraeasset.com/bbs/download/2030756.pdf?attachmentId=2030756",
    },
    {
        "stock_key": "tiger200",
        "category": "macro",
        "criteria": ["매크로", "채권", "금리"],
        "title": "채권전략: 연준을 믿지 않는 시장",
        "broker": "KB증권",
        "published_date": "2026-05-27",
        "rating": "Fixed Income",
        "summary": "미국 금리와 글로벌 채권 자금 흐름을 함께 확인하는 매크로 자료입니다.\n국내 대형주 수급에는 달러금리, 환율, 외국인 자금 흐름이 같이 작용할 수 있습니다.\n개별 종목 의견이 아니라 금리 환경 점검용으로 분류했습니다.",
        "positive_points": ["금리 안정 시 위험자산 선호 개선"],
        "risk_points": ["금리 급등", "채권 자금 유출"],
        "outlook": "금리 변동성이 커질 경우 반도체 성장주 할인율 부담을 확인해야 합니다.",
        "target_change": "미제공",
        "source_url": "https://rdata.kbsec.com/pdf_data/20210323065608147K.pdf",
    },
    {
        "stock_key": "tiger200",
        "category": "semiconductor",
        "criteria": ["반도체 섹터", "삼성전자", "SK하이닉스"],
        "title": "Korea 반도체: 글로벌 반도체 밸류에이션과 메모리 업체 비교",
        "broker": "유진투자증권",
        "published_date": "2026-02-09",
        "rating": "Sector",
        "summary": "글로벌 반도체 업체의 주가, 시가총액, 밸류에이션을 비교한 섹터 자료입니다.\n메모리 섹션에 삼성전자, SK하이닉스, 마이크론 등 주요 업체가 함께 제시됩니다.\n반도체 섹터 전반의 상대 밸류에이션과 주가 성과를 확인하는 데 사용합니다.",
        "positive_points": ["AI/HBM 수요", "메모리 업체 이익 개선"],
        "risk_points": ["글로벌 반도체 주가 변동성", "밸류에이션 부담"],
        "outlook": "삼성전자와 SK하이닉스는 글로벌 메모리 비교 구도에서 함께 해석해야 합니다.",
        "target_change": "미제공",
        "source_url": "https://www.hankyung.com/koreamarket/consensus/pdf/2026-02-f4680261cbc2d0fd10c192140c2b2d3f",
    },
    {
        "stock_key": "tiger200",
        "category": "semiconductor",
        "criteria": ["반도체 섹터"],
        "title": "반도체/디스플레이: 메모리 가격과 국내외 주요 뉴스",
        "broker": "메리츠증권",
        "published_date": "2026-05-27",
        "rating": "Sector",
        "summary": "DRAM, DDR5, NAND 가격과 반도체 관련 주요 뉴스를 정리하는 섹터형 자료입니다.\n메모리 가격 흐름은 삼성전자와 SK하이닉스 실적 기대에 직접 연결될 수 있습니다.\n단기 주가보다 업황 사이클 확인용으로 분류했습니다.",
        "positive_points": ["DDR5 가격 상승", "AI 인프라 투자"],
        "risk_points": ["중국 공급 확대", "스마트폰 원가 부담"],
        "outlook": "메모리 가격과 HBM 수요가 반도체 섹터 심리의 핵심입니다.",
        "target_change": "미제공",
        "source_url": "https://www.hankyung.com/koreamarket/consensus/pdf/2025-10-afa273bc8e683dc0f3035ddcf9d6b71e",
    },
    {
        "stock_key": "samsung",
        "category": "company",
        "criteria": ["삼성전자", "SK하이닉스", "반도체 섹터"],
        "title": "삼성전자/SK하이닉스: 흔들리지 않는 편안함",
        "broker": "신한투자증권",
        "published_date": "2026-01-27",
        "rating": "Company",
        "summary": "삼성전자와 SK하이닉스를 함께 다루며 메모리 업황과 목표주가 변동 추이를 확인하는 자료입니다.\n두 종목 모두 반도체 사이클과 AI 수요 민감도가 높습니다.\n개별 기업 판단과 섹터 판단을 함께 확인해야 합니다.",
        "positive_points": ["AI 메모리 수요", "업황 회복"],
        "risk_points": ["메모리 가격 변동", "고객사 투자 사이클"],
        "outlook": "두 종목은 반도체 업황과 외국인 수급을 함께 확인해야 합니다.",
        "target_change": "미제공",
        "source_url": "https://www.hankyung.com/koreamarket/consensus/pdf/2026-01-cb657b9ee5c5bed4a631d2151441f0a7",
    },
    {
        "stock_key": "skhynix",
        "category": "company",
        "criteria": ["SK하이닉스", "반도체 섹터"],
        "title": "SK하이닉스: 2026년 실적 추정과 DRAM/NAND 가정",
        "broker": "SK증권",
        "published_date": "2026-02-24",
        "rating": "Company",
        "summary": "SK하이닉스 분기 실적 추정과 DRAM, NAND 부문 가정을 제시한 기업 자료입니다.\nHBM과 서버 DRAM 수요가 이익 추정의 핵심 변수로 해석됩니다.\n단일 목표가보다 매출과 영업이익 추정 변화에 초점을 둡니다.",
        "positive_points": ["DRAM 이익 기여", "HBM 수요 확대"],
        "risk_points": ["NAND 수익성", "고객사 주문 변동"],
        "outlook": "실적 추정 상향 여부와 메모리 믹스 개선을 계속 확인해야 합니다.",
        "target_change": "미제공",
        "source_url": "https://www.hankyung.com/koreamarket/consensus/pdf/2026-02-d344d28dc42db71bb132adaf842f65e6",
    },
]


class SupabaseRestClient:
    def __init__(self, url: str, service_role_key: str) -> None:
        self.base_url = url.rstrip("/") + "/rest/v1"
        self.headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
        }

    def upsert(self, table: str, payload: Dict[str, Any], on_conflict: str) -> List[Dict[str, Any]]:
        response = requests.post(
            f"{self.base_url}/{table}",
            params={"on_conflict": on_conflict},
            headers={**self.headers, "Prefer": "resolution=merge-duplicates,return=representation"},
            data=json.dumps(payload, ensure_ascii=False),
            timeout=30,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"Supabase upsert {table} failed: {response.status_code} {response.text}")
        return response.json() if response.text else []


def matches_criteria(report: Dict[str, Any]) -> bool:
    criteria = set(report.get("criteria", []))
    return bool(criteria.intersection({"매크로", "환율", "금리", "채권", "반도체 섹터", "삼성전자", "SK하이닉스"}))


def upsert_stock(client: SupabaseRestClient, stock_key: str) -> str:
    stock = STOCKS[stock_key]
    rows = client.upsert("stocks", stock, "ticker")
    if not rows:
        raise RuntimeError(f"No stock row returned for {stock['ticker']}")
    return rows[0]["id"]


def main() -> None:
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    fetched_at = dt.datetime.now(KST).isoformat()
    filtered = [report for report in REPORTS if matches_criteria(report)]

    if not supabase_url or not service_role_key:
        print(json.dumps({"saved_rows": 0, "reports": filtered}, ensure_ascii=False, indent=2))
        return

    client = SupabaseRestClient(supabase_url, service_role_key)
    saved = 0
    for report in filtered:
        stock_uuid = upsert_stock(client, report["stock_key"])
        client.upsert(
            "research_reports",
            {
                "stock_id": stock_uuid,
                "category": report["category"],
                "criteria_json": report["criteria"],
                "title": report["title"],
                "broker": report["broker"],
                "published_date": report["published_date"],
                "target_price": report.get("target_price"),
                "rating": report.get("rating"),
                "summary": report["summary"],
                "positive_points": report["positive_points"],
                "risk_points": report["risk_points"],
                "outlook": report["outlook"],
                "target_change": report["target_change"],
                "source_url": report["source_url"],
                "source": "Public research link seed",
                "fetched_at": fetched_at,
            },
            "source_url",
        )
        saved += 1

    print(json.dumps({"saved_rows": saved, "criteria": "macro|semiconductor|samsung|skhynix"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
