"use client";

import { Activity, Check, ChevronDown, Pencil, Plus, Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminAuthHeaders, getStoredAdminToken } from "@/lib/auth";

const PAGE_SIZE = 5;

type Role = string;
type Status = "Active" | "Invited" | "Suspended";
type SortKey = "email" | "role" | "status" | "lastActive";
type SortDir = "asc" | "desc";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string; // ISO date
};

// Backend role shape: { name, label, modules: [{ module_key: "read" | "update" }] }
type ManagedRole = {
  name: string;
  label: string;
  description?: string;
  modules?: Record<string, string>[];
};

const DEFAULT_ROLE_OPTIONS: Role[] = ["Admin", "Editor", "Viewer"];
const STATUS_OPTIONS: Status[] = ["Active", "Invited", "Suspended"];

const ROLE_BADGE_STYLES: Record<string, string> = {
  Admin: "bg-[#FEF2F2] text-[#c8102e]",
  Editor: "bg-blue-50 text-blue-700",
  Viewer: "bg-slate-100 text-slate-600",
};

const STATUS_DOT_STYLES: Record<Status, string> = {
  Active: "bg-emerald-500",
  Invited: "bg-amber-500",
  Suspended: "bg-slate-400",
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: ["Manage users & roles", "Manage billing", "Edit all content", "Change workspace settings"],
  Editor: ["Create & edit content", "Publish pages", "View reports"],
  Viewer: ["View dashboard & reports", "No editing access"],
};

// Maps backend module keys (e.g. from init_builtin_roles) to the labels
// shown in the sidebar/nav, so role permissions read the same way admins
// see the app. Keep this in sync with any new modules added on the backend.
const MODULE_NAV_LABELS: Record<string, string> = {
  support_system: "Messages",
  xlsx_import: "FBR CheckList",
  pages: "Content",
  settings: "Settings",
  content: "Content",
  messages: "Messages",
  leads: "Leads",
  roles: "Roles",
  users: "Users",
};

function moduleLabel(key: string) {
  return MODULE_NAV_LABELS[key] ?? key.replace(/_/g, " ");
}

const AVATAR_COLORS = [
  "bg-[#FEF2F2] text-[#c8102e]",
  "bg-blue-50 text-blue-700",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-violet-50 text-violet-700",
];

const seedUsers: ManagedUser[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "Admin", status: "Active", lastActive: "2026-08-11" },
  { id: "2", name: "Marcus Lee", email: "marcus.lee@company.com", role: "Editor", status: "Active", lastActive: "2026-08-10" },
  { id: "3", name: "Priya Singh", email: "priya.singh@company.com", role: "Viewer", status: "Invited", lastActive: "2026-08-01" },
];

async function fetchJson(url: string, init?: RequestInit) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...getAdminAuthHeaders(),
    ...(init?.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();

  if (!res.ok) {
    let errorMsg = text || `Request failed with status ${res.status}`;

    // Try to parse JSON error response
    try {
      const jsonError = JSON.parse(text);
      if (jsonError.detail) {
        errorMsg = jsonError.detail;
      } else if (jsonError.message) {
        errorMsg = jsonError.message;
      }
    } catch {
      // If not JSON, use raw text
    }

    const error = new Error(errorMsg);
    (error as any).status = res.status;
    throw error;
  }

  return text ? JSON.parse(text) : null;
}

function normalizeUser(raw: any): ManagedUser {
  return {
    id: String(raw.id ?? raw.user_id ?? raw.uuid ?? raw.email ?? crypto.randomUUID()),
    name: String(raw.name ?? raw.full_name ?? raw.email ?? "Unknown"),
    email: String(raw.email ?? raw.email_address ?? ""),
    // role can come back as a plain string OR as a nested role object,
    // depending on which endpoint answered — normalize both shapes.
    role: String(raw.role?.name ?? raw.role_name ?? raw.role ?? "Viewer"),
    status: (raw.status === "Invited" || raw.status === "Suspended" ? raw.status : "Active") as Status,
    lastActive: String(raw.last_active ?? raw.lastActive ?? raw.updated_at ?? new Date().toISOString()),
  };
}

function normalizeRole(raw: any): ManagedRole {
  if (typeof raw === "string") return { name: raw, label: raw };
  const name = String(raw.name ?? raw.role_name ?? raw.id ?? "Unnamed");
  return {
    name,
    // Backend sends a human-friendly `label` (e.g. "Xlsx Import Editor") —
    // keep it instead of discarding it, falling back to a prettified name.
    label: String(raw.label ?? name.replace(/_/g, " ")),
    description: raw.description ? String(raw.description) : undefined,
    modules: Array.isArray(raw.modules) ? raw.modules : undefined,
  };
}

async function getUsers(): Promise<ManagedUser[]> {
  const data = await fetchJson("/api/admin/users");
  return Array.isArray(data) ? data.map(normalizeUser) : [];
}

async function createUser(payload: { name: string; email: string; password: string; role: Role }) {
  return fetchJson("/api/admin/users", { method: "POST", body: JSON.stringify(payload) });
}

async function updateUser(id: string, payload: { name: string; email: string; role?: Role; password?: string }) {
  return fetchJson(`/api/admin/users/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) });
}

async function deleteUser(id: string) {
  return fetchJson(`/api/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// This is the endpoint that actually persists a role on a user.
// It was previously defined but never called anywhere in this file —
// that's why role changes weren't sticking.
async function assignUserRole(id: string, payload: { role: Role }) {
  return fetchJson(`/api/admin/users/${encodeURIComponent(id)}/assign-role`, { method: "POST", body: JSON.stringify(payload) });
}

async function getRoles(): Promise<ManagedRole[]> {
  const data = await fetchJson("/api/admin/roles");
  return Array.isArray(data) ? data.map(normalizeRole) : [];
}

async function getRole(name: string) {
  return fetchJson(`/api/admin/roles/${encodeURIComponent(name)}`);
}

async function createRole(payload: { name: string; description?: string }) {
  return fetchJson("/api/admin/roles", { method: "POST", body: JSON.stringify(payload) });
}

async function updateRole(name: string, payload: { description?: string }) {
  return fetchJson(`/api/admin/roles/${encodeURIComponent(name)}`, { method: "PUT", body: JSON.stringify(payload) });
}

async function deleteRole(name: string) {
  return fetchJson(`/api/admin/roles/${encodeURIComponent(name)}`, { method: "DELETE" });
}

async function getMe() {
  return fetchJson("/api/admin/me");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function avatarColor(id: string) {
  const idx = Array.from(id).reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function formatRelativeDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const diffDays = Math.round((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Toast = { id: string; message: string; tone: "success" | "error" };

function FilterDropdown({
  label,
  options,
  value,
  onChange,
  labels,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  /** Optional map of option value -> friendly display text. */
  labels?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const display = (opt: string) => labels?.[opt] ?? opt;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-150 ${
          value ? "border-[#c8102e] bg-[#FEF2F2] text-[#c8102e]" : "border-slate-200 bg-white text-[#374151] hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        {value ? display(value) : label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1.5 max-h-56 w-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors duration-150 ${
                !value ? "bg-[#FEF2F2] font-semibold text-[#c8102e]" : "text-[#374151] hover:bg-slate-50"
              }`}
            >
              All {label}
              {!value && <Check className="h-3.5 w-3.5" />}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors duration-150 ${
                  value === opt ? "bg-[#FEF2F2] font-semibold text-[#c8102e]" : "text-[#374151] hover:bg-slate-50"
                }`}
              >
                {display(opt)}
                {value === opt && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function UserManagementSettings() {
  const [users, setUsers] = useState<ManagedUser[]>(seedUsers);
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("email");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<"selection" | string | null>(null);
  const [bulkRoleValue, setBulkRoleValue] = useState<Role>(DEFAULT_ROLE_OPTIONS[1]);
  const [isBulkRoleOpen, setIsBulkRoleOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(DEFAULT_ROLE_OPTIONS[1]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleEditTarget, setRoleEditTarget] = useState<string | null>(null);
  const [roleFormError, setRoleFormError] = useState<string | null>(null);
  const [roleSaving, setRoleSaving] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const roleOptions = useMemo(() => (roles.length ? roles.map((r) => r.name) : DEFAULT_ROLE_OPTIONS), [roles]);
  const permissions = useMemo(() => (roles.length ? roles : []), [roles]);
  // name -> friendly label, e.g. "xlsx_import_editor" -> "FBR CheckList Editor"
  const roleLabelMap = useMemo(() => Object.fromEntries(roles.map((r) => [r.name, r.label])), [roles]);
  const displayRole = (r: string) => roleLabelMap[r] ?? r;

  const pushToast = (message: string, tone: Toast["tone"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setPermissionError(null);
      try {
        const token = getStoredAdminToken();
        if (!token) {
          pushToast("Not authenticated as admin — please sign in.", "error");
          setLoading(false);
          return;
        }

        const [usersData, rolesData, me] = await Promise.all([getUsers(), getRoles(), getMe().catch(() => null)]);
        if (usersData.length) setUsers(usersData);
        if (rolesData.length) setRoles(rolesData.map(normalizeRole));
        // `me` can be used to show current admin's info/permissions in the future
      } catch (err: any) {
        console.warn("Could not load admin data:", err);

        // Check if it's a permission error (403)
        if (err.status === 403) {
          setPermissionError(err.message || "You do not have permission to access user management. Only super admins can access this resource.");
          pushToast("Permission denied: Super admin access required", "error");
        } else {
          pushToast("Could not load users or roles", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => setPage(1), [search, roleFilter, statusFilter]);
  useEffect(() => setSelected(new Set()), [page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = users.filter((u) => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "lastActive") cmp = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = useMemo(
    () => ({ total: users.length, active: users.filter((u) => u.status === "Active").length, invited: users.filter((u) => u.status === "Invited").length, admins: users.filter((u) => u.role === "Admin").length }),
    [users]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAllOnPage = () => {
    const pageIds = pageItems.map((u) => u.id);
    const allSelected = pageIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleSelectOne = (id: string) => setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const resetForm = () => { setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setRole(DEFAULT_ROLE_OPTIONS[1]); setFormError(null); setEditingId(null); };
  const openAddForm = () => { resetForm(); setIsFormOpen(true); };
  const openEditForm = (user: ManagedUser) => { setEditingId(user.id); setName(user.name); setEmail(user.email); setRole(user.role); setPassword(""); setConfirmPassword(""); setFormError(null); setIsFormOpen(true); };
  const closeForm = () => { if (isSaving) return; setIsFormOpen(false); resetForm(); };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    setFormError(null);
    if (!name.trim()) return setFormError("Enter a name.");
    if (!validateEmail(email.trim())) return setFormError("Enter a valid email address.");
    const isDuplicate = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== editingId);
    if (isDuplicate) return setFormError("A user with this email already exists.");
    if (!editingId) { if (password.length < 8) return setFormError("Password must be at least 8 characters."); if (password !== confirmPassword) return setFormError("Passwords do not match."); }
    else if (password || confirmPassword) { if (password.length < 8) return setFormError("Password must be at least 8 characters."); if (password !== confirmPassword) return setFormError("Passwords do not match."); }

    setIsSaving(true);
    try {
      if (!editingId) {
        const created = await createUser({ name: name.trim(), email: email.trim(), password, role });
        const newUser = normalizeUser(created ?? { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), role, status: "Invited", lastActive: new Date().toISOString() });
        // createUser may or may not persist the role depending on the backend —
        // always follow up with the dedicated assign-role call so it's guaranteed to stick.
        try {
          await assignUserRole(newUser.id, { role });
          newUser.role = role;
        } catch (roleErr: any) {
          pushToast(roleErr?.message || "User created, but role assignment failed.", "error");
        }
        setUsers((prev) => [newUser, ...prev]);
        pushToast(`Invite sent to ${newUser.email}`);
      } else {
        const payload: { name: string; email: string; role?: Role; password?: string } = { name: name.trim(), email: email.trim(), role };
        if (password) payload.password = password;
        const updated = await updateUser(editingId, payload);
        // This is the fix: the generic user-update endpoint may ignore `role`,
        // so we explicitly assign it through /assign-role.
        await assignUserRole(editingId, { role });
        const normalized = normalizeUser(updated ?? { id: editingId, name: name.trim(), email: email.trim(), role, status: "Active", lastActive: new Date().toISOString() });
        normalized.role = role;
        setUsers((prev) => prev.map((u) => (u.id === editingId ? normalized : u)));
        pushToast("User updated");
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error: any) {
      setFormError(error?.message || "Unable to save user.");
    } finally { setIsSaving(false); }
  };

  const performRemove = async (ids: string[]) => {
    const remaining = users.filter((u) => !ids.includes(u.id));
    setUsers(remaining);
    setSelected((prev) => { const next = new Set(prev); ids.forEach((id) => next.delete(id)); return next; });
    setConfirmTarget(null);
    try { await Promise.all(ids.map((id) => deleteUser(id))); pushToast(ids.length > 1 ? `Removed ${ids.length} users` : "User removed"); }
    catch (err: any) { pushToast(err?.message || "Unable to remove user.", "error"); }
  };

  const applyBulkRole = async () => {
    const ids = Array.from(selected);
    setUsers((prev) => prev.map((u) => (ids.includes(u.id) ? { ...u, role: bulkRoleValue } : u)));
    setSelected(new Set());
    setIsBulkRoleOpen(false);
    try {
      // Use the assign-role endpoint (not updateUser) so the role actually persists.
      await Promise.all(ids.map((id) => assignUserRole(id, { role: bulkRoleValue })));
      pushToast(`Updated role for ${ids.length} user${ids.length > 1 ? "s" : ""}`);
    } catch (err: any) {
      pushToast(err?.message || "Unable to update roles.", "error");
    }
  };

  const sortIcon = (key: SortKey) => (sortKey !== key ? "↕" : sortDir === "asc" ? "↑" : "↓");

  const startRoleEdit = (roleNameToEdit: string) => {
    const target = roles.find((r) => r.name === roleNameToEdit);
    if (!target) return;
    setRoleName(target.name);
    setRoleDescription(target.description ?? "");
    setRoleEditTarget(target.name);
    setRoleFormError(null);
    setIsRoleFormOpen(true);
  };
  const openNewRoleForm = () => {
    resetRoleForm();
    setIsRoleFormOpen(true);
  };
  const resetRoleForm = () => { setRoleName(""); setRoleDescription(""); setRoleEditTarget(null); setRoleFormError(null); };

  const closeRoleForm = () => {
    if (roleSaving) return;
    setIsRoleFormOpen(false);
    resetRoleForm();
  };

  const handleRoleSubmit = async () => {
    setRoleFormError(null);
    if (!roleName.trim()) return setRoleFormError("Enter a role name.");
    const duplicate = roles.some((r) => r.name.toLowerCase() === roleName.trim().toLowerCase() && r.name !== roleEditTarget);
    if (duplicate) return setRoleFormError("A role with this name already exists.");
    setRoleSaving(true);
    try {
      if (roleEditTarget) {
        await updateRole(roleEditTarget, { description: roleDescription.trim() || undefined });
        setRoles((prev) => prev.map((r) => (r.name === roleEditTarget ? { ...r, description: roleDescription.trim() || undefined } : r)));
        pushToast("Role updated");
      } else {
        const created = await createRole({ name: roleName.trim(), description: roleDescription.trim() || undefined });
        const normalized = normalizeRole(created ?? { name: roleName.trim(), description: roleDescription.trim() || undefined });
        setRoles((prev) => [normalized, ...prev]);
        pushToast("Role created");
      }
      closeRoleForm();
    } catch (err: any) { setRoleFormError(err?.message || "Unable to save role."); } finally { setRoleSaving(false); }
  };

  const handleRoleDelete = async (nameToDelete: string) => {
    try { await deleteRole(nameToDelete); setRoles((prev) => prev.filter((r) => r.name !== nameToDelete)); if (roleEditTarget === nameToDelete) resetRoleForm(); pushToast("Role deleted"); }
    catch (err: any) { pushToast(err?.message || "Unable to delete role.", "error"); }
  };

  return (
    <div className="space-y-6">
      {permissionError && (
        <div className="rounded-lg border border-[#fee2e2] bg-[#fef2f2] px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <svg className="h-5 w-5 text-[#c8102e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[12px] font-semibold text-[#c8102e]">Access Denied</h3>
              <p className="mt-1 text-[12px] text-[#7f1d1d]">{permissionError}</p>
            </div>
          </div>
        </div>
      )}

      {!permissionError && (
        <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">User Management</h2>
          <p className="mt-0.5 text-[12px] text-[#4B5563]">Invite teammates, manage access, and assign roles across your workspace.</p>
        </div>
        <button type="button" onClick={openAddForm} className="rounded-lg bg-[#c8102e] px-4 py-2 text-[12px] font-bold text-white transition-colors duration-150 hover:bg-[#a50d25]">+ Invite User</button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total, caption: "+1 this month", icon: Users, iconClass: "bg-[#eaf1ff] text-[#3b82f6]" },
          { label: "Active", value: stats.active, caption: `${stats.active} online now`, icon: Activity, iconClass: "bg-[#fff0f0] text-[#f87171]" },
          { label: "Invited", value: stats.invited, caption: "Needs follow-up", icon: UserPlus, iconClass: "bg-[#fff7ed] text-[#f59e0b]" },
          { label: "Admins", value: stats.admins, caption: "+2 from last week", icon: ShieldCheck, iconClass: "bg-[#ecfdf5] text-[#22c55e]" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex h-[106px] items-center justify-between rounded-[10px] border border-[#dfe6f1] bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-shadow duration-200 hover:shadow-md">
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.02em] text-[#111827]">{s.label}</div>
                <div className="mt-2 text-[18px] font-bold leading-none text-[#111827]">{s.value}</div>
                <div className="mt-2 text-[12px] text-[#4B5563]">{s.caption}</div>
              </div>
              <div className={`ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconClass}`}>
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* main table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[12px] outline-none transition-all duration-150 hover:border-slate-300 focus:border-[#c8102e] focus:bg-white focus:ring-2 focus:ring-[#c8102e]/20"
            />
          </div>
          <FilterDropdown
            label="All Roles"
            options={roleOptions}
            value={roleFilter === "All" ? null : roleFilter}
            onChange={(next) => setRoleFilter(next ?? "All")}
            labels={roleLabelMap}
          />
          <FilterDropdown
            label="All Statuses"
            options={STATUS_OPTIONS}
            value={statusFilter === "All" ? null : statusFilter}
            onChange={(next) => setStatusFilter((next as Status | null) ?? "All")}
          />
        </div>

        {selected.size > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#c8102e]/20 bg-[#FEF2F2] px-3 py-2">
            <span className="text-[12px] font-semibold text-[#c8102e]">{selected.size} selected</span>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button type="button" onClick={() => setIsBulkRoleOpen((v) => !v)} className="text-[12px] font-semibold text-[#c8102e]">Change Role</button>
                {isBulkRoleOpen && (<div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{roleOptions.map((r) => (<button key={r} onClick={() => setBulkRoleValue(r)} className={`block w-full px-2 py-1.5 text-left text-[12px] ${bulkRoleValue===r?"text-[#c8102e]":"text-[#111111]"}`}>{displayRole(r)}</button>))}<button onClick={applyBulkRole} className="mt-1 w-full rounded-md bg-[#c8102e] px-2 py-1.5 text-center text-[12px] font-bold text-white">Apply</button></div>)}
              </div>
              <button onClick={() => setConfirmTarget("selection")} className="text-[12px] font-semibold text-[#c8102e]">Remove</button>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-10 py-3 pl-2">
                  <input type="checkbox" checked={pageItems.length>0 && pageItems.every((u)=>selected.has(u.id))} onChange={toggleSelectAllOnPage} className="h-4 w-4 accent-[#c8102e]"/>
                </th>
                <th className="py-3 pr-3 text-[12px] font-bold uppercase tracking-wide text-[#111827]">
                  <button onClick={()=>toggleSort("email")} className="inline-flex items-center gap-1.5">User {sortIcon("email")}</button>
                </th>
                <th className="py-3 pr-3 text-[12px] font-bold uppercase tracking-wide text-[#111827]">
                  <button onClick={()=>toggleSort("role")} className="inline-flex items-center gap-1.5">Role {sortIcon("role")}</button>
                </th>
                <th className="py-3 pr-3 text-[12px] font-bold uppercase tracking-wide text-[#111827]">
                  <button onClick={()=>toggleSort("status")} className="inline-flex items-center gap-1.5">Status {sortIcon("status")}</button>
                </th>
                <th className="py-3 pr-3 text-[12px] font-bold uppercase tracking-wide text-[#111827]">
                  <button onClick={()=>toggleSort("lastActive")} className="inline-flex items-center gap-1.5">Last Active {sortIcon("lastActive")}</button>
                </th>
                <th className="py-3 pr-2 text-right text-[12px] font-bold uppercase tracking-wide text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((user)=> (
                <tr key={user.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pl-2">
                    <input type="checkbox" checked={selected.has(user.id)} onChange={()=>toggleSelectOne(user.id)} className="h-4 w-4 accent-[#c8102e]"/>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${avatarColor(user.id)}`}>{initials(user.name)}</div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#111111]">{user.name}</div>
                        <div className="text-[11px] text-[#4B5563]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-medium ${ROLE_BADGE_STYLES[user.role] ?? "bg-slate-100 text-slate-600"}`}>{displayRole(user.role)}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4B5563]">
                      <span className={`h-2 w-2 rounded-lg ${STATUS_DOT_STYLES[user.status]}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[12px] text-[#4B5563]">{formatRelativeDate(user.lastActive)}</td>
                  <td className="py-3 pr-2 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={()=>openEditForm(user)} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 hover:text-[#111827]">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={()=>setConfirmTarget(user.id)} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#ef4444] hover:text-[#dc2626]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length===0 && (<tr><td colSpan={6} className="py-8 text-center text-[12px] text-[#4B5563]">No users match your filters.</td></tr>)}
            </tbody>
          </table>
        </div>

        {filtered.length>0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[12px] text-[#4B5563]">Showing {(pageSafe-1)*PAGE_SIZE+1}–{Math.min(pageSafe*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-3">
              <button disabled={pageSafe===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-xl border border-[#d1d9e6] bg-white px-3 py-2 text-[12px] font-medium text-[#111827] disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
              <span className="text-[12px] text-[#4B5563]">Page {pageSafe} of {totalPages}</span>
              <button disabled={pageSafe===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="rounded-xl border border-[#d1d9e6] bg-white px-3 py-2 text-[12px] font-medium text-[#111827] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[18px] border border-[#cfd9e6] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-bold text-[#111827]">Roles &amp; Permissions</h3>
          <button
            onClick={openNewRoleForm}
            className="flex items-center gap-2 rounded-xl border border-[#d1d9e6] bg-white px-4 py-2 text-[12px] font-semibold text-[#111827] transition-colors duration-150 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            New Role
          </button>
        </div>

        <div className="mt-5 rounded-[18px] border border-[#cfd9e6] bg-white p-5">
          <div className="max-h-[320px] overflow-y-auto pr-1">
            {permissions.length === 0 ? (
              <p className="text-[12px] text-[#4B5563]">No roles created yet.</p>
            ) : (
              <div className="space-y-2">
                {permissions.map((r) => (
                  <div key={r.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex w-fit rounded-lg bg-[#e5e7eb] px-2 py-1 text-[12px] font-medium text-[#111827] ${ROLE_BADGE_STYLES[r.name] ?? "bg-slate-100 text-slate-600"}`}>
                        {r.label}
                      </span>
                      {r.modules && r.modules.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.modules.map((m, i) =>
                            Object.entries(m).map(([moduleKey, access]) => (
                              <span key={`${i}-${moduleKey}`} className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#4B5563] border border-slate-200">
                                {moduleLabel(moduleKey)} · {access}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startRoleEdit(r.name)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRoleDelete(r.name)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#ef4444]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {permissions.length > 0 && (
              <p className="mt-4 text-[12px] text-[#4B5563]">{permissions[0].description ?? "No description provided."}</p>
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"><div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl"><h3 className="text-[12px] font-bold text-[#111827]">{editingId?"Edit User":"Invite New User"}</h3><div className="mt-4 space-y-4"><div><label className="text-[12px] font-semibold text-[#111111]">Full Name</label><input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" className="mt-1 w-full rounded-lg border px-3 py-2"/></div><div><label className="text-[12px] font-semibold text-[#111111]">Email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@company.com" className="mt-1 w-full rounded-lg border px-3 py-2"/></div><div className="grid gap-4 md:grid-cols-2"><div><label className="text-[12px] font-semibold text-[#111111]">{editingId?"New Password (optional)":"Password"}</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-lg border px-3 py-2"/></div><div><label className="text-[12px] font-semibold text-[#111111]">Confirm Password</label><input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-lg border px-3 py-2"/></div></div><div><label className="text-[12px] font-semibold text-[#111111]">Role</label><div className="relative mt-1"><button type="button" onClick={() => setIsRoleMenuOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[12px] font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20"><span>{displayRole(role)}</span><ChevronDown className="h-4 w-4 text-slate-500" /></button>{isRoleMenuOpen && (<div className="absolute left-0 right-0 z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"><div className="space-y-1">{roleOptions.map((option)=>(<button key={option} type="button" onClick={()=>{ setRole(option); setIsRoleMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] transition-colors duration-150 ${role===option?"bg-[#FEF2F2] font-semibold text-[#c8102e]":"text-[#374151] hover:bg-slate-50"}`}><span>{displayRole(option)}</span>{role===option && <Check className="h-3.5 w-3.5" />}</button>))}</div></div>)}</div></div>{formError && <div className="text-[12px] font-medium text-[#c8102e]">{formError}</div>}<div className="flex items-center gap-3 pt-1"><button type="button" onClick={handleSubmit} disabled={isSaving} className="rounded-lg bg-[#c8102e] px-4 py-2 text-[12px] font-bold text-white">{isSaving?"Saving…": editingId?"Save Changes":"Send Invite"}</button><button type="button" onClick={closeForm} disabled={isSaving} className="text-[12px] font-semibold text-slate-500">Cancel</button></div></div></div></div>)}

      {isRoleFormOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"><div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h3 className="text-[12px] font-bold text-[#111827]">{roleEditTarget ? "Edit Role" : "Create New Role"}</h3><p className="mt-1 text-[11px] text-[#4B5563]">Define a role and add a short description for access rules.</p></div><button type="button" onClick={closeRoleForm} className="text-[12px] font-semibold text-slate-500">Close</button></div><div className="mt-4 space-y-4"><div><label className="text-[12px] font-semibold text-[#111111]">Role Name</label><input value={roleName} onChange={(e)=>setRoleName(e.target.value)} placeholder="Operations Manager" className="mt-1 w-full rounded-lg border px-3 py-2 text-[12px]" /></div><div><label className="text-[12px] font-semibold text-[#111111]">Description</label><textarea value={roleDescription} onChange={(e)=>setRoleDescription(e.target.value)} placeholder="Can manage content and user access within a limited scope." rows={4} className="mt-1 w-full rounded-lg border px-3 py-2 text-[12px]" /></div>{roleFormError && <div className="text-[12px] font-medium text-[#c8102e]">{roleFormError}</div>}<div className="flex items-center justify-end gap-3 pt-1"><button type="button" onClick={closeRoleForm} className="text-[12px] font-semibold text-slate-500">Cancel</button><button type="button" onClick={handleRoleSubmit} disabled={roleSaving} className="rounded-lg bg-[#c8102e] px-4 py-2 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{roleSaving ? (roleEditTarget ? "Saving..." : "Creating...") : (roleEditTarget ? "Save Role" : "Create Role")}</button></div></div></div></div>)}

      {confirmTarget && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"><div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"><h3 className="text-[12px] font-bold text-[#111827]">{confirmTarget==="selection"?`Remove ${selected.size} users?`:"Remove this user?"}</h3><p className="mt-2 text-[12px] text-[#4B5563]">This will revoke their access immediately. This action can’t be undone.</p><div className="mt-4 flex items-center gap-3"><button type="button" onClick={()=>performRemove(confirmTarget==="selection"?Array.from(selected):[confirmTarget])} className="rounded-lg bg-[#c8102e] px-4 py-2 text-[12px] font-bold text-white">Remove</button><button type="button" onClick={()=>setConfirmTarget(null)} className="text-[12px] font-semibold text-slate-500">Cancel</button></div></div></div>)}

      <div className="fixed bottom-4 right-4 z-[60] space-y-2">{toasts.map((t)=> (<div key={t.id} className={`rounded-lg px-4 py-2.5 text-[12px] font-semibold ${t.tone==="success"?"bg-[#111827] text-white":"bg-[#c8102e] text-white"}`}>{t.message}</div>))}</div>
        </>
      )}
    </div>
  );
}

export { UserManagementSettings };