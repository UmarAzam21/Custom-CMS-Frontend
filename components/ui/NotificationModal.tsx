"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { Bell, X, Trash2, CheckCheck, FileText, ShieldCheck, Receipt, AlertTriangle, RefreshCw } from "lucide-react";


const ICONS = {
  filing: FileText,
  compliance: ShieldCheck,
  tax: Receipt,
  alert: AlertTriangle,
} as const;

type NotificationType = keyof typeof ICONS;

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const seedNotifications: Notification[] = [];

type NotificationModalProps = {
  userId?: string;
};

type NotificationResponsePayload = any;

function normalizeNotifications(data: NotificationResponsePayload): any[] | null {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.notifications)) return data.data.notifications;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  return null;
}

export default function NotificationModal({ userId }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = `?user_id=${encodeURIComponent(userId)}`;
      const res = await fetch(`/api/proxy/notifications${query}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to load notifications: ${res.status}`);
      }

      const data = await res.json();
      const list = normalizeNotifications(data);

      if (!list) {
        throw new Error("Unexpected notifications response");
      }

      setNotifications(
        list.map((item: any) => ({
          id: String(item.id ?? item.notification_id ?? item._id ?? item.uuid ?? item.key ?? "unknown"),
          type: (item.resource_type as NotificationType) || item.type || "alert",
          title: item.title || item.subject || item.message || "Notification",
          message: item.message || item.body || "",
          time: item.created_at || item.createdAt || item.time || "just now",
          read: Boolean(item.read),
        }))
      );
      setLastLoadedAt(Date.now());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  useEffect(() => {
    if (open && userId) {
      loadNotifications();
    }
  }, [open, userId]);

  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        loadNotifications();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        panelRef.current &&
        target &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
  }

  document.addEventListener("mousedown", handleClick);
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("mousedown", handleClick);
    document.removeEventListener("keydown", handleKey);
  };
}, []);

  useEffect(() => {
    async function loadNotifications() {
      if (!userId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const query = `?user_id=${encodeURIComponent(userId)}`;
        const res = await fetch(`/api/proxy/notifications${query}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load notifications: ${res.status}`);
        }

        const data = await res.json();
        const list = normalizeNotifications(data);

        if (!list) {
          throw new Error("Unexpected notifications response");
        }

        setNotifications(
          list.map((item: any) => ({
            id: String(item.id ?? item.notification_id ?? item._id ?? item.uuid ?? item.key ?? "unknown"),
            type: (item.resource_type as NotificationType) || item.type || "alert",
            title: item.title || item.subject || item.message || "Notification",
            message: item.message || item.body || "",
            time: item.created_at || item.createdAt || item.time || "just now",
            read: Boolean(item.read),
          }))
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [userId]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
      await fetch(`/api/proxy/notifications/read${query}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
      await fetch(`/api/proxy/notifications/read${query}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: notifications.map((n) => n.id) }),
      });
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
      await fetch(`/api/proxy/notifications/${encodeURIComponent(id)}${query}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Trigger */}
        <button
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center transition hover:border-neutral-300 "
        >
          <Bell className="h-5 w-5 text-neutral-700" strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white ring-2 ring-neutral-50">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Panel */}
        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-50 mt-2 w-[380px] h-[400px] origin-top-right overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl animate-in"
            style={{ animation: "fadeSlide 160ms ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-900">
                  Notifications
                </h2>
                <p className="text-xs text-neutral-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={loadNotifications}
                  aria-label="Refresh notifications"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <RefreshCw className="h-4 w-4" strokeWidth={2} />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close notifications"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                    <Bell className="h-5 w-5 text-rose-400" strokeWidth={1.6} />
                  </div>
                  <p className="text-sm font-medium text-neutral-700">
                    Nothing here yet
                  </p>
                  <p className="text-xs text-neutral-400">
                    New updates on your filings will show up here.
                  </p>
                </div>
              ) : (
                <ul>
                  {notifications.map((n) => {
                    const Icon = ICONS[n.type as NotificationType] ?? FileText;
                    return (
                      <li
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`group relative flex cursor-pointer gap-3 border-b border-neutral-50 px-5 py-3.5 transition hover:bg-neutral-50 ${
                          n.read ? "bg-white" : "bg-rose-50/40"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            n.read ? "bg-neutral-100" : "bg-rose-100"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              n.read ? "text-neutral-500" : "text-rose-600"
                            }`}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-[13.5px] leading-snug ${
                                n.read
                                  ? "font-medium text-neutral-600"
                                  : "font-semibold text-neutral-900"
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-neutral-500">
                            {n.message}
                          </p>
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            {n.time}
                          </p>
                        </div>

                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          aria-label={`Delete notification: ${n.title}`}
                          className="absolute right-3 top-8 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-neutral-100 px-5 py-2.5 text-center">
                <button className="text-xs font-medium text-neutral-500 transition hover:text-rose-600">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}