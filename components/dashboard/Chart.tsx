"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", visitors: 400 },
  { day: "Tue", visitors: 580 },
  { day: "Wed", visitors: 510 },
  { day: "Thu", visitors: 670 },
  { day: "Fri", visitors: 730 },
  { day: "Sat", visitors: 400 },
  { day: "Sun", visitors: 290 },
];

export default function SiteVisitorsChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Site Visitors</h3>
          <p className="text-sm text-slate-500">Last 7 days</p>
        </div>

        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          +12.4%
        </span>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8102E" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#C8102E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              domain={[0, 800]}
              ticks={[0, 200, 400, 600, 800]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
              labelStyle={{ color: "#334155", fontWeight: 600 }}
            />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#C8102E"
              strokeWidth={2.5}
              fill="url(#visitorsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}