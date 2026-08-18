"use client";
import { ActivitySquare } from "lucide-react";
import { Activities } from "@/lib/data";
import { DashboardStats } from "@/lib/useDashboardStats";

interface RecentActivityProps {
  stats?: DashboardStats | null;
  loading?: boolean;
}

export default function RecentActivity({ stats, loading }: RecentActivityProps) {
  // Use real stats if available, otherwise use mock data
  const activityList = stats?.recent_activity 
    ? stats.recent_activity.map((item) => ({
        title: item.title,
        meta: item.detail,
        icon: ActivitySquare,
        iconBg: '#FEF2F2',
        iconColor: '#c8102e',
      }))
    : Activities();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ">
      <h3 className="text-base font-bold text-slate-900 text-[13px]">Recent Activity</h3>

      {loading ? (
        <div className="mt-5 text-center text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="mt-5 flex flex-col">
          {activityList.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === activityList.length - 1;

            return (
              <div
                key={index}
                className={`flex items-start gap-3 py-2 ${
                  !isLast ? "border-b border-slate-100" : ""
                }`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Icon size={16} strokeWidth={2} style={{ color: item.iconColor }} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.meta}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}