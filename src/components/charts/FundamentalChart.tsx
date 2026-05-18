"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FundamentalPeriod } from "@/types";

export function FundamentalChart({ data }: { data: FundamentalPeriod[] }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 0, left: -30, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EEF2F6" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString("ko-KR")}억`, ""]} />
          <Bar dataKey="revenue" name="매출" fill="#1570EF" radius={[3, 3, 0, 0]} />
          <Bar dataKey="operatingIncome" name="영업이익" fill="#039855" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
