"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Lock } from "lucide-react";
import { getNavData } from "@/lib/data";
import { ASSETS } from "@/lib/assets";
import {
  hasModuleAccess,
  isSuperAdmin,
  fetchAndStoreAdminProfile,
  setStoredAdminToken,
  setStoredAdminUser,
} from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const NAV_ITEMS = getNavData();

  const [collapsed, setCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  // Bumped after a fresh profile fetch so the nav list re-renders with real access data.
  const [profileVersion, setProfileVersion] = useState(0);

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    const hasAccess = item.superAdminOnly
      ? isSuperAdmin()
      : item.moduleKey
        ? hasModuleAccess(item.moduleKey, item.access ?? "read")
        : true;

    return hasAccess;
  });

  useEffect(() => {
    // Pull the real modules/permissions from the backend (GET /api/admin/me)
    // rather than relying on whatever the login response happened to store.
    // This is what makes hasModuleAccess() actually correct instead of
    // guessing from the role name/label.
    fetchAndStoreAdminProfile().then(() => {
      setProfileVersion((v) => v + 1);
    });
  }, []);

  const handleNavItemHover = (href: string, event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width, y: rect.top + rect.height / 2 - 16 });
    setHoveredItem(href);
  };

  const handleNavItemLeave = () => {
    setHoveredItem(null);
  };

  const handleLogout = () => {
    setStoredAdminToken(null);
    setStoredAdminUser(null);
    router.push("/login");
  };

  return (
    <>
      {/* Placeholder — reserves space so page content never shifts */}
      <div className="h-screen w-[76px] shrink-0" />

      <aside
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-white justify-between text-black border-r border-slate-200 transition-[width,box-shadow] duration-300 ease-in-out overflow-hidden ${
          collapsed ? "w-[76px] shadow-none" : "w-[225px] shadow-xl"
        }`}
      >
        <div>
          {/* Header — icon slot is fixed, label fades in beside it */}
          <div className="flex items-center h-[60px] border-b border-slate-200 px-[18px] gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-light text-sm font-semibold text-black">
              <img src={ASSETS()[0].src} alt={ASSETS()[0].alt} className="w-7" />
            </div>

            <span
              className={`text-sm font-semibold tracking-wide text-3 whitespace-nowrap transition-opacity duration-200 ${
                collapsed ? "opacity-0" : "opacity-100 delay-100"
              }`}
            >
              Admin CMS
            </span>
          </div>

          <nav className="mt-4 flex w-full flex-col items-stretch gap-1 px-3" key={profileVersion}>
            {NAV_ITEMS.filter((item) => {
              const hasAccess = item.superAdminOnly
                ? isSuperAdmin()
                : item.moduleKey
                  ? hasModuleAccess(item.moduleKey, item.access ?? "read")
                  : true;

              return hasAccess;
            }).map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center gap-3 rounded-md py-2.5 px-3 text-sm transition-colors hover:bg-slate-50 whitespace-nowrap ${
                    isActive ? "text-primary" : "text-[#4B5563]"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} className="shrink-0" />
                  <span
                    className={`transition-opacity duration-200 ${
                      collapsed ? "opacity-0" : "opacity-100 delay-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 px-3 h-[54px] flex items-center">
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className="flex w-full items-center gap-3 rounded-md px-3 text-sm text-[#4B5563] hover:text-primary transition-colors whitespace-nowrap"
          >
            <LogOut size={19} strokeWidth={1.8} className="text-primary shrink-0" />
            <span
              className={`transition-opacity duration-200 ${
                collapsed ? "opacity-0" : "opacity-100 delay-100"
              }`}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}