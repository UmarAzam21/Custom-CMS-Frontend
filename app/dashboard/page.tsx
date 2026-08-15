import RecentActivity from "@/components/dashboard/Activity";
import SiteVisitorsChart from "@/components/dashboard/Chart";
import { DashboardCards } from "@/lib/data";
import QuickAccess from "@/components/dashboard/QuickAccess";

export default function DashboardOverviewPage() {
  const stats = DashboardCards();

  return (
    <div>
      <div className="h-[65px] border-b border-slate-200">
        <span className="text-xs text-[#4B5563]">Hi,</span>
        <h1 className="text-lg font-bold">
          Welcome Back, <span className="text-primary">Admin!</span>
        </h1>
      </div>

      <div className="h-[129px] flex items-end gap-3">
        {stats.map((card: any, index: any) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="w-[281px] h-[106px] bg-white rounded-lg border border-slate-300 flex justify-between items-start p-4"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#4B5563]">
                  {card.title}
                </span>

                <span className="text-xl font-semibold">{card.value}</span>

                <span className="text-[11px] font-semibold text-[#4B5563]">
                  {card.change}
                </span>
              </div>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon size={20} strokeWidth={1.8} style={{ color: card.iconColor }} />
              </div>
            </div>
          );
        })}
      </div>

    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <SiteVisitorsChart />
  </div>
  <RecentActivity />
</div>
 
<div className="mt-6">
  
        <div className="mb-3 flex items-center justify-between">
            <h1 className="text-sm font-bold">Quick Access</h1>
        </div>
  <QuickAccess />
</div>

    </div>
  );
}