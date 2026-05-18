"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ResearchReport } from "@/types";

export function TargetPriceChart({ reports }: { reports: ResearchReport[] }) {
  const data = reports.filter((report) => report.targetPrice).map((report) => ({ broker: report.broker, targetPrice: report.targetPrice }));
  if (!data.length) return <p className="caption">목표주가가 제공된 보고서가 없습니다.</p>;
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <XAxis dataKey="broker" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString("ko-KR")}원`, "목표주가"]} />
          <Bar dataKey="targetPrice" fill="#1570EF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
