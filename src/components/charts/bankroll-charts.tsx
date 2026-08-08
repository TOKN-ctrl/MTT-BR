"use client";

import { Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BankrollCurveChart({ data }: { data: { date: string; bankroll: string; drawdown: string }[] }) {
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">No bankroll transactions yet.</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data.map((point) => ({ ...point, bankroll: Number(point.bankroll), drawdown: Number(point.drawdown), date: point.date.slice(0, 10) }))}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" tickLine={false} />
          <YAxis stroke="var(--muted-foreground)" tickLine={false} width={70} />
          <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} />
          <Line dataKey="bankroll" dot={false} stroke="var(--primary)" strokeWidth={2} />
          <Line dataKey="drawdown" dot={false} stroke="oklch(0.78 0.15 76)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RoiBarChart({ data }: { data: { label: string; roi: number | null; tournaments: number }[] }) {
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">No completed tournaments yet.</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data.map((point) => ({ ...point, roi: point.roi ?? 0 }))}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" stroke="var(--muted-foreground)" tickLine={false} />
          <YAxis stroke="var(--muted-foreground)" tickFormatter={(value) => `${value}%`} tickLine={false} width={60} />
          <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} formatter={(value) => `${value}%`} />
          <Bar dataKey="roi" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TournamentProfitChart({
  data,
}: {
  data: { buyIns: string; cumulativeProfit: string; date: string; name: string; profit: string; returned: string }[];
}) {
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Log a tournament to see buy-ins and profit.</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer height="100%" width="100%">
        <ComposedChart
          data={data.map((point) => ({
            ...point,
            buyIns: Number(point.buyIns),
            cumulativeProfit: Number(point.cumulativeProfit),
            profit: Number(point.profit),
            returned: Number(point.returned),
          }))}
        >
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" tickLine={false} />
          <YAxis stroke="var(--muted-foreground)" tickLine={false} width={70} />
          <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} />
          <Bar dataKey="buyIns" fill="oklch(0.68 0.12 250)" name="Buy-ins" radius={[4, 4, 0, 0]} />
          <Bar dataKey="returned" fill="oklch(0.72 0.14 155)" name="Returned" radius={[4, 4, 0, 0]} />
          <Line dataKey="cumulativeProfit" dot stroke="var(--primary)" strokeWidth={2} name="Cumulative profit" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
