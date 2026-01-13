"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMarkNotificationRead, useNotifications } from "@/hooks/use-notifications";

export function NotificationBell() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        className="relative rounded-full bg-primary-bg flex items-center justify-center p-3"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <Bell size={20} className="text-primary-text" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-dark-border bg-input-bg shadow-lg z-20">
          <div className="px-4 py-3 border-b border-dark-border/40">
            <p className="text-sm font-semibold text-primary-text">Notifications</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-text-gray-opacity">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-text-gray-opacity">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markReadMutation.mutate(notification.id)}
                  className={`flex w-full flex-col gap-1 px-4 py-3 text-left text-sm ${
                    notification.is_read
                      ? "bg-input-bg"
                      : "bg-primary-bg/60 font-semibold"
                  } hover:bg-input-bg`}
                >
                  <span className="text-xs uppercase tracking-wide text-text-gray-opacity">
                    {notification.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-primary-text">
                    {notification.title}
                  </span>
                  <span className="text-xs text-text-gray-opacity">
                    {notification.body}
                  </span>
                  <span className="text-[10px] text-text-gray-opacity">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
