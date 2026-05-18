"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SentimentResult } from "@/types";

export function SentimentBar({ sentiment }: { sentiment: SentimentResult }) {
  const data = [{ name: "감정", 긍정: sentiment.positiveRatio, 중립: sentiment.neutralRatio, 부정: sentiment.negativeRatio }];
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip formatter={(value) => [`${value}%`, ""]} />
          <Bar dataKey="긍정" stackId="a" fill="#039855" radius={[5, 0, 0, 5]} />
          <Bar dataKey="중립" stackId="a" fill="#98A2B3" />
          <Bar dataKey="부정" stackId="a" fill="#D92D20" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
