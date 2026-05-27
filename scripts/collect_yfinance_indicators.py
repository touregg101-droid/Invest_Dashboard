#!/usr/bin/env python3
"""Collect previous-session global indicators from Yahoo Finance via yfinance.

Targets:
- Nasdaq Composite (^IXIC): 미국 기술주 흐름
- S&P 500 (^GSPC): 미국 전체 시장 방향
- Gold Futures (GC=F): 안전자산 선호도
- Bitcoin (BTC-USD): 디지털 자산 / 위험 자산 심리

The script upserts rows into Supabase market_indicators_daily when
SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are present. Without those env vars,
it prints fetched rows and exits successfully.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import requests
import yfinance as yf


KST = dt.timezone(dt.timedelta(hours=9))


@dataclass(frozen=True)
class IndicatorConfig:
    ticker: str
    name: str
    reason: str


TARGET_INDICATORS = [
    IndicatorConfig("^IXIC", "나스닥 종합", "미국 기술주 흐름"),
    IndicatorConfig("^GSPC", "S&P500", "미국 전체 시장 방향"),
    IndicatorConfig("GC=F", "금", "안전자산 선호도"),
    IndicatorConfig("BTC-USD", "비트코인", "디지털 자산 / 위험 자산 심리"),
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

    def insert(self, table: str, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        response = requests.post(
            f"{self.base_url}/{table}",
            headers={**self.headers, "Prefer": "return=representation"},
            data=json.dumps(payload, ensure_ascii=False),
            timeout=30,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"Supabase insert {table} failed: {response.status_code} {response.text}")
        return response.json() if response.text else []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect Yahoo Finance global market indicators.")
    parser.add_argument("--period", default="10d", help="yfinance history period")
    parser.add_argument("--target-date", help="Target date in YYYY-MM-DD. Defaults to yesterday in Korea time.")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print data without writing Supabase")
    return parser.parse_args()


def clean_number(value: Any) -> Optional[float]:
    if value is None:
        return None
    numeric = float(value)
    if math.isnan(numeric):
        return None
    return numeric


def fetch_indicator(config: IndicatorConfig, period: str, target_date: dt.date) -> Dict[str, Any]:
    history = yf.Ticker(config.ticker).history(period=period, interval="1d", auto_adjust=False)
    history = history.dropna(subset=["Close"])
    history = history[history.index.date <= target_date]
    if len(history) < 2:
        raise RuntimeError(f"{config.ticker} has insufficient Yahoo Finance history before {target_date}.")

    latest = history.iloc[-1]
    previous = history.iloc[-2]
    close = clean_number(latest["Close"])
    previous_close = clean_number(previous["Close"])
    if close is None or previous_close is None:
        raise RuntimeError(f"{config.ticker} has invalid close values.")

    change = close - previous_close
    change_rate = (change / previous_close) * 100 if previous_close else 0
    latest_date = history.index[-1].date().isoformat()

    return {
        "ticker": config.ticker,
        "name": config.name,
        "reason": config.reason,
        "date": latest_date,
        "open": clean_number(latest.get("Open")),
        "high": clean_number(latest.get("High")),
        "low": clean_number(latest.get("Low")),
        "close": round(close, 4),
        "previous_close": round(previous_close, 4),
        "change": round(change, 4),
        "change_rate": round(change_rate, 2),
        "volume": clean_number(latest.get("Volume")),
        "source": "Yahoo Finance via yfinance",
        "fetched_at": dt.datetime.now(KST).isoformat(),
    }


def collect_and_save(client: Optional[SupabaseRestClient], period: str, target_date: dt.date, dry_run: bool) -> Dict[str, Any]:
    started_at = dt.datetime.now(KST).isoformat()
    rows = []
    for config in TARGET_INDICATORS:
        rows.append(fetch_indicator(config, period, target_date))

    saved_rows = 0
    if client is not None and not dry_run:
        for row in rows:
            client.upsert("market_indicators_daily", row, "ticker,date")
            saved_rows += 1

        client.insert(
            "collection_logs",
            {
                "job_name": "yfinance-global-indicators-daily",
                "status": "success",
                "message": f"yfinance로 글로벌 주요 지표 {saved_rows}개 저장",
                "started_at": started_at,
                "finished_at": dt.datetime.now(KST).isoformat(),
            },
        )

    return {
        "source": "Yahoo Finance via yfinance",
        "fetched_at": started_at,
        "target_date": target_date.isoformat(),
        "rows": rows,
        "saved_rows": saved_rows,
    }


def main() -> None:
    args = parse_args()
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    target_date = (
        dt.datetime.strptime(args.target_date, "%Y-%m-%d").date()
        if args.target_date
        else dt.datetime.now(KST).date() - dt.timedelta(days=1)
    )
    client = None
    if supabase_url and service_role_key and not args.dry_run:
        client = SupabaseRestClient(supabase_url, service_role_key)

    result = collect_and_save(client, args.period, target_date, args.dry_run)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
