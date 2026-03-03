"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type ChartPoint = { day: string; views: number };

export function AdViewsChart({ points }: { points: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={points}>
        <CartesianGrid stroke="#1A1A1E" opacity={0.2} />
        <XAxis dataKey="day" stroke="#A1A1B3" />
        <YAxis stroke="#A1A1B3" tickFormatter={(value) => `${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0D0D0F",
            borderColor: "#282828",
          }}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#F63D68"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
