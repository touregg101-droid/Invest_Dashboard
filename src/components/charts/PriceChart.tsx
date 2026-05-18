"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyPrice } from "@/types";

export function PriceChart({ data }: { data: DailyPrice[] }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString("ko-KR")}원`, "종가"]} labelStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="close" stroke="#1570EF" strokeWidth={2.4} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
