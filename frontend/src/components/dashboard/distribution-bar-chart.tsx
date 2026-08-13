"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

export interface DistributionDatum {
  label: string;
  value: number;
}

export function DistributionBarChart({ data, color }: { data: DistributionDatum[]; color: string }) {
  const height = Math.max(160, data.length * 36);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tickLine={false}
          axisLine={{ stroke: "var(--chart-axis)" }}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "var(--surface-muted)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload as DistributionDatum;
            return <ChartTooltip rows={[{ key: point.label, label: point.label, value: point.value, color }]} />;
          }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={20}>
          <LabelList dataKey="value" position="right" fill="var(--foreground)" fontSize={12} fontWeight={600} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
