"use client";

import { useState } from "react";
import { Settings2, Users } from "lucide-react";
import SiteSettings from "@/components/dashboard/setting/SiteSetting";
import { UserManagementSettings } from "@/components/dashboard/setting/UserManagementSettings";

type TabKey = "site" | "users";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { key: "site", label: "Site Settings", icon: Settings2 },
  { key: "users", label: "User Management", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("site");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mb-5">
        <p className="mb-1 text-[12px] text-neutral-400">
          Dashboard <span className="mx-1">›</span>{" "}
          <span className="text-neutral-500">Settings</span>
        </p>
        <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex items-center gap-1 border-b border-neutral-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition ${
                isActive ? "text-rose-600" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rose-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className={activeTab === "site" ? "block" : "hidden"}>
        <SiteSettings />
      </div>
      <div className={activeTab === "users" ? "block" : "hidden"}>
        <UserManagementSettings />
      </div>
    </div>
  );
}