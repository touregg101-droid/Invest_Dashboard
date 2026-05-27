#!/usr/bin/env python3
"""Collect Samsung Electronics and SK Hynix daily OHLCV from KRX via pykrx.

The script is designed for GitHub Actions and local manual runs.
It upserts rows into Supabase REST API when SUPABASE_URL and
SUPABASE_SERVICE_ROLE_KEY are present. Without Supabase env vars it prints
the fetched rows and exits successfully.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional

import requests
from pykrx import stock


KST = dt.timezone(dt.timedelta(hours=9))


@dataclass(frozen=True)
class StockConfig:
    stock_id: str
    ticker: str
    name: str
    type: str = "COMMON"
    market: str = "KOSPI"


TARGET_STOCKS = [
    StockConfig(stock_id="samsung", ticker="005930", name="삼성전자"),
    StockConfig(stock_id="skhynix", ticker="000660", name="SK하이닉스"),
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
            headers={
                **self.headers,
                "Prefer": "resolution=merge-duplicates,return=representation",
            },
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
    today_kst = dt.datetime.now(KST).date()
    default_start = today_kst - dt.timedelta(days=370)
    parser = argparse.ArgumentParser(description="Collect KRX daily prices through pykrx.")
    parser.add_argument("--start", default=default_start.strftime("%Y%m%d"), help="Start date, YYYYMMDD")
    parser.add_argument("--end", default=today_kst.strftime("%Y%m%d"), help="End date, YYYYMMDD")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print data without writing Supabase")
    return parser.parse_args()


def fetch_ohlcv(ticker: str, start: str, end: str) -> List[Dict[str, Any]]:
    frame = stock.get_market_ohlcv_by_date(start, end, ticker)
    if frame.empty:
        return []

    rows: List[Dict[str, Any]] = []
    previous_close: Optional[float] = None
    for index, row in frame.iterrows():
      # pykrx columns are Korean: 시가, 고가, 저가, 종가, 거래량, 등락률.
        close = float(row["종가"])
        change_rate = row.get("등락률")
        if change_rate is None or str(change_rate) == "nan":
            change_rate = ((close - previous_close) / previous_close * 100) if previous_close else 0
        rows.append(
            {
                "date": index.strftime("%Y-%m-%d"),
                "open": number_or_none(row["시가"]),
                "high": number_or_none(row["고가"]),
                "low": number_or_none(row["저가"]),
                "close": close,
                "volume": number_or_none(row["거래량"]),
                "change_rate": round(float(change_rate), 2),
            }
        )
        previous_close = close
    return rows


def number_or_none(value: Any) -> Optional[float]:
    if value is None or str(value) == "nan":
        return None
    return float(value)


def upsert_stock(client: SupabaseRestClient, config: StockConfig) -> str:
    rows = client.upsert(
        "stocks",
        {
            "ticker": config.ticker,
            "name": config.name,
            "type": config.type,
            "market": config.market,
        },
        "ticker",
    )
    if not rows:
        raise RuntimeError(f"No stock row returned for {config.ticker}")
    return rows[0]["id"]


def collect_and_save(client: Optional[SupabaseRestClient], start: str, end: str, dry_run: bool) -> Dict[str, Any]:
    fetched_at = dt.datetime.now(KST).isoformat()
    result = {
        "source": "pykrx KRX OHLCV",
        "start": start,
        "end": end,
        "fetched_at": fetched_at,
        "stocks": [],
        "saved_rows": 0,
    }

    for config in TARGET_STOCKS:
        daily_rows = fetch_ohlcv(config.ticker, start, end)
        stock_summary = {
            "ticker": config.ticker,
            "name": config.name,
            "rows": len(daily_rows),
            "latest": daily_rows[-1] if daily_rows else None,
        }
        result["stocks"].append(stock_summary)

        if dry_run or client is None:
            continue

        stock_uuid = upsert_stock(client, config)
        for price in daily_rows:
            client.upsert(
                "price_daily",
                {
                    "stock_id": stock_uuid,
                    "date": price["date"],
                    "open": price["open"],
                    "high": price["high"],
                    "low": price["low"],
                    "close": price["close"],
                    "volume": price["volume"],
                    "change_rate": price["change_rate"],
                    "source": "pykrx KRX OHLCV",
                    "fetched_at": fetched_at,
                },
                "stock_id,date",
            )
            result["saved_rows"] += 1

    if client is not None and not dry_run:
        client.insert(
            "collection_logs",
            {
                "job_name": "pykrx-price-daily",
                "status": "success",
                "message": f"pykrx로 삼성전자/SK하이닉스 일봉 {result['saved_rows']}개 저장",
                "started_at": fetched_at,
                "finished_at": dt.datetime.now(KST).isoformat(),
            },
        )

    return result


def main() -> None:
    args = parse_args()
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    client = None

    if supabase_url and service_role_key and not args.dry_run:
        client = SupabaseRestClient(supabase_url, service_role_key)

    result = collect_and_save(client, args.start, args.end, args.dry_run)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
