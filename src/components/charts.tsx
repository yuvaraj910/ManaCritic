import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ChartPoint = { label: string; value: number; secondary?: number };

const tooltipStyle = { borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", boxShadow: "0 12px 32px rgba(32, 23, 18, .10)" };

export function GradientAreaChart({ data, color = "#ff6b35", secondaryColor, valueLabel = "Calories" }: { data: ChartPoint[]; color?: string; secondaryColor?: string; valueLabel?: string }) {
  const gradientId = `gradient-${color.replace("#", "")}-${secondaryColor ?? "one"}`;
  return <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0.02} /></linearGradient></defs>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="4 4" />
    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} width={36} />
    <Tooltip contentStyle={tooltipStyle} />
    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} />
    {secondaryColor && <Area type="monotone" dataKey="secondary" stroke={secondaryColor} strokeWidth={2} fill="none" />}
  </AreaChart></ResponsiveContainer></div>;
}

export function TinyLineChart({ data, color = "#8b5cf6" }: { data: ChartPoint[]; color?: string }) {
  return <div className="tiny-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 5, right: 4, left: 4, bottom: 4 }}><Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div>;
}
