"use client";

import Link from "next/link";
import { Pencil, Mail, Plus, LucideIcon } from "lucide-react";

interface QuickAction {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const actions: QuickAction[] = [
  {
    title: "Edit Homepage",
    subtitle: "Update hero, sections, content",
    href: "/dashboard/pages/home",
    icon: Pencil,
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
  },
  {
    title: "View New Messages",
    subtitle: "3 unread enquiries waiting",
    href: "/dashboard/messages",
    icon: Mail,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    title: "Add New Page",
    subtitle: "Create a new site page",
    href: "/dashboard/pages/new",
    icon: Plus,
    iconBg: "#ECFDF5",
    iconColor: "#16A34A",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: action.iconBg }}
            >
              <Icon size={18} strokeWidth={2} style={{ color: action.iconColor }} />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                {action.title}
              </p>
              <p className="text-[11px] text-slate-500">{action.subtitle}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}