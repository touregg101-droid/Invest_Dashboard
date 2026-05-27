#!/usr/bin/env python3
"""Write the GitHub Pages static KRX price snapshot.

GitHub Pages serves index.html without the Next.js runtime. This JSON file lets
the static page refresh displayed prices after the daily GitHub Action runs.
"""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path
from typing import Any, Dict

from pykrx import stock


KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "static-market-snapshot.json"

TARGETS = {
    "102110": {"name": "TIGER 200", "note": "커뮤니티 감정: 긍정 44%"},
    "005930": {"name": "삼성전자", "note": "감정: 긍정 62%"},
    "000660": {"name": "SK하이닉스", "note": "감정: 긍정 68%"},
}


def latest_krx_row(ticker: str, end: dt.date) -> Dict[str, Any]:
    start = end - dt.timedelta(days=14)
    frame = stock.get_market_ohlcv_by_date(start.strftime("%Y%m%d"), end.strftime("%Y%m%d"), ticker)
    if frame.empty:
        raise RuntimeError(f"No KRX OHLCV rows for {ticker}")
    date, row = next(reversed(list(frame.iterrows())))
    return {
        "date": date.strftime("%Y-%m-%d"),
        "close": int(row["종가"]),
        "changeRate": round(float(row["등락률"]), 2),
        "volume": int(row["거래량"]),
    }


def main() -> None:
    now = dt.datetime.now(KST)
    snapshot = {
        "source": "pykrx KRX OHLCV",
        "updatedAt": now.isoformat(timespec="seconds"),
        "updatedLabel": now.strftime("%Y.%m.%d %H:%M"),
        "stocks": {},
    }

    for ticker, config in TARGETS.items():
        row = latest_krx_row(ticker, now.date())
        snapshot["stocks"][ticker] = {
            "name": config["name"],
            **row,
            "note": config["note"],
        }

    OUTPUT.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(snapshot, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
