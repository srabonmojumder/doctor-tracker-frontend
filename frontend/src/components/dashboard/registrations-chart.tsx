"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import type { DashboardStats } from "@/types/dashboard";

const PATIENT_COLOR = "var(--chart-1)";
const DOCTOR_COLOR = "var(--chart-3)";

function formatShortDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RegistrationsChart({ data }: { data: DashboardStats["registrationsByDate"] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tickLine={false}
          axisLine={{ stroke: "var(--chart-axis)" }}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          interval={Math.ceil(data.length / 8)}
          minTickGap={16}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          width={28}
        />
        <Tooltip
          cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <ChartTooltip
                title={formatShortDate(label as string)}
                rows={payload.map((entry) => ({
                  key: String(entry.dataKey),
                  label: entry.name as string,
                  value: entry.value as number,
                  color: entry.color as string,
                }))}
              />
            );
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          height={32}
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="patients"
          name="Patients"
          stroke={PATIENT_COLOR}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: "var(--surface)", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="doctors"
          name="Doctors"
          stroke={DOCTOR_COLOR}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: "var(--surface)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
