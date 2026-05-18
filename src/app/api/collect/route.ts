import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data-sources";
import { marketDataRepository } from "@/lib/db";

export async function GET(request: NextRequest) {
  return runCollection(request);
}

export async function POST(request: NextRequest) {
  return runCollection(request);
}

async function runCollection(request: NextRequest) {
  const unauthorized = checkAuthorization(request);
  if (unauthorized) return unauthorized;

  const startedAt = new Date().toISOString();
  const data = await getDashboardData();
  const dbResult = await marketDataRepository.persistDashboardSnapshot(data).catch((error: unknown) => ({
    enabled: true,
    ok: false,
    message: error instanceof Error ? error.message : "DB 저장 중 알 수 없는 오류가 발생했습니다.",
    savedTables: []
  }));
  const finishedAt = new Date().toISOString();

  return NextResponse.json({
    status: process.env.USE_MOCK_DATA === "false" ? "fallback-capable" : "mock",
    message: "Collection pipeline completed. Real adapters fall back to mock data until compliant providers are configured.",
    database: dbResult,
    jobs: [
      "price-flow-daily",
      "sentiment-daily",
      "fear-greed-daily",
      "research-daily",
      "fundamentals-quarterly"
    ],
    stockCount: data.stocks.length,
    startedAt,
    finishedAt,
    logs: data.logs
  });
}

function checkAuthorization(request: NextRequest) {
  const secret = process.env.CRON_SECRET ?? process.env.COLLECT_SECRET;
  if (!secret || secret === "local-dev" || process.env.NODE_ENV !== "production") return null;

  const provided = request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-collect-secret");
  const authorization = request.headers.get("authorization");
  if (provided === secret || authorization === `Bearer ${secret}`) return null;

  return NextResponse.json({ error: "Unauthorized collect request" }, { status: 401 });
}
