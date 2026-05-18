"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { InvestorFlow } from "@/types";

export function InvestorFlowChart({ data }: { data: InvestorFlow[] }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <BarChart data={data.slice(-8)} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EEF2F6" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString("ko-KR")}억`, ""]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="individualNetBuy" name="개인" fill="#98A2B3" radius={[3, 3, 0, 0]} />
          <Bar dataKey="institutionNetBuy" name="기관" fill="#039855" radius={[3, 3, 0, 0]} />
          <Bar dataKey="foreignNetBuy" name="외국인" fill="#1570EF" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
