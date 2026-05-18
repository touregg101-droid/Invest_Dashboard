import { NextRequest, NextResponse } from "next/server";
import { summarizeReport } from "@/lib/ai/summarize-report";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.excerpt) {
    return NextResponse.json({ error: "title and excerpt are required" }, { status: 400 });
  }

  const result = await summarizeReport({
    title: body.title,
    broker: body.broker,
    excerpt: body.excerpt,
    targetPrice: body.targetPrice,
    previousTargetPrice: body.previousTargetPrice
  });

  return NextResponse.json({
    policy: "Provided data only. No buy or sell recommendation. No fabricated numbers.",
    result
  });
}
