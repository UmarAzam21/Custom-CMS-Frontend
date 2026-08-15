import { LayoutDashboard, Clock, TrendingUp, Pencil, Plus, Upload, Landmark, Globe, FileText, Mail, Settings, LucideIcon, ImageIcon, Search, User, Users } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * The backend module key this item maps to (e.g. "xlsx_import", "pages",
   * "settings", "support_system") — confirmed from the `require_module` /
   * `require_module_access` calls in the backend routers. Access is checked
   * via hasModuleAccess(moduleKey, access) against the user's real modules
   * data, NOT the display label.
   */
  moduleKey?: string;
  /** Access level required for this module. Defaults to "read". */
  access?: "read" | "update";
  /**
   * Backend protects this route with require_super_admin (not module-based),
   * e.g. Users and Roles management. When true, only superadmin gets access
   * regardless of any module grants.
   */
  superAdminOnly?: boolean;
}

export interface DashboardContent {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface ActivityItem {
  title: string;
  meta: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface PageRow {
  id: string;
  name: string;
  slug: string;
  sections: number;
  status: "Published" | "Draft";
  lastEdited: string;
}

export const pagesData: PageRow[] = [
  { id: "1", name: "Home", slug: "/", sections: 6, status: "Published", lastEdited: "2 hours ago" },
  { id: "2", name: "About Us", slug: "/about", sections: 4, status: "Published", lastEdited: "Yesterday" },
  { id: "3", name: "Services", slug: "/services", sections: 5, status: "Published", lastEdited: "3 days ago" },
  { id: "4", name: "Portfolio", slug: "/portfolio", sections: 3, status: "Draft", lastEdited: "1 week ago" },
  { id: "5", name: "Contact", slug: "/contact", sections: 2, status: "Published", lastEdited: "2 weeks ago" },
  { id: "6", name: "Blog", slug: "/blog", sections: 1, status: "Draft", lastEdited: "1 month ago" },
];

export function Activities(): ActivityItem[] {
  return [
    {
      title: "Updated Hero headline",
      meta: "Home · 2 hours ago",
      icon: Pencil,
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
    },
    {
      title: "Added new section: Testimonials",
      meta: "About Us · 5 hours ago",
      icon: Plus,
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
      title: "Uploaded hero-banner.jpg",
      meta: "Media Library · Yesterday",
      icon: Upload,
      iconBg: "#ECFDF5",
      iconColor: "#16A34A",
    },
    {
      title: "Published page",
      meta: "Services · 2 days ago",
      icon: Globe,
      iconBg: "#F5F3FF",
      iconColor: "#7C3AED",
    },
    {
      title: "Updated meta description",
      meta: "Home · 3 days ago",
      icon: Search,
      iconBg: "#FFFBEB",
      iconColor: "#D97706",
    },
  ];
}

export function DashboardCards(): DashboardContent[] {
  return [
    {
      title: "TOTAL PAGES",
      value: "6",
      change: "+1 this month",
      icon: FileText,
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
      title: "NEW MESSAGES",
      value: "3",
      change: "5 total unread",
      icon: Mail,
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
    },
    {
      title: "LAST CONTENT UPDATE",
      value: "2h ago",
      change: "Hero headline — Home",
      icon: Clock,
      iconBg: "#FFF7ED",
      iconColor: "#D97706",
    },
    {
      title: "SEO HEALTH SCORE",
      value: "82",
      change: "+4 from last week",
      icon: TrendingUp,
      iconBg: "#ECFDF5",
      iconColor: "#16A34A",
    },
  ];
}

export function getNavData(): NavItem[] {
  return [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Content", href: "/dashboard/content", icon: FileText, moduleKey: "pages", access: "read" },
    { label: "FBR CheckList", href: "/dashboard/fbr", icon: Landmark, moduleKey: "xlsx_import", access: "read" },
    { label: "Messages", href: "/dashboard/messages", icon: Mail, moduleKey: "support_system", access: "read" },
    // No backend module protection confirmed for Media Library / SEO yet —
    // open to any logged-in admin for now, per explicit product decision.
    // { label: "Media Library", href: "/dashboard/media", icon: ImageIcon },
    // { label: "SEO", href: "/dashboard/seo", icon: Search },
    { label: "Users", href: "/dashboard/users", icon: Users, superAdminOnly: true },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, moduleKey: "settings", access: "read" },
    // Backend protects users/roles with require_super_admin, not module grants.
  ];
}